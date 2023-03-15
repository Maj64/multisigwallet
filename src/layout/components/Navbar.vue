<template>
  <div class="navbar">
    <div>
      <div v-if="displaySidebar">
        <hamburger
          id="hamburger-container"
          :is-active="sidebar.opened"
          class="hamburger-container"
          @toggleClick="toggleSideBar"
        />
      </div>
      <div v-else>
        <svg-icon class="navbar-logo" class-name="logo-icon" icon-class="logoTee" />
      </div>
      <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
    </div>
    <div class="right-menu">
      <div v-if="!account" class="right-menu-item btn-container">
        <button class="btn-connect" @click="connectWallet">Connect Wallet</button>
      </div>
      <div v-else>
        <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
          <div class="avatar-wrapper">
            <img :src="avatar + '?imageView2/1/w/80/h/80'" class="user-avatar">
            <div class="user-name">gor: {{ account }}</div>
            <div v-if="balance" :style="{ borderLeft: '1px solid white', padding: '6px', color: 'white' }">balance: {{
              balance }} </div>
          </div>
          <el-dropdown-menu slot="dropdown" class="dropdown-menu">
            <el-dropdown-item icon="el-icon-user" @click.native="handleShowProfile">Profile</el-dropdown-item>
            <!-- <router-link to="/profile/index">
            </router-link> -->
            <router-link to="/wallet">
              <el-dropdown-item icon="el-icon-wallet" divided>Wallets</el-dropdown-item>
            </router-link>
            <!-- <el-dropdown-item divided @click.native="logout">
              <span style="display:block;">Log Out</span>
            </el-dropdown-item> -->
          </el-dropdown-menu>
        </el-dropdown>
        <template v-if="device !== 'mobile'">
          <!-- <div class="right-menu-item">
              <div v-if="!currentContract">
                <el-button class="primaryButton" @click="attachContract">Attach Contract</el-button>
              </div>
            </div> -->
          <!-- <search id="header-search" class="right-menu-item" /> -->

          <error-log class="errLog-container right-menu-item hover-effect" />

          <!-- <screenfull id="screenfull" class="right-menu-item hover-effect" /> -->

          <!-- <el-tooltip content="Global Size" effect="dark" placement="bottom">
                  <size-select id="size-select" class="right-menu-item hover-effect" />
                </el-tooltip> -->
          <el-tag effect="dark" size="small" class="right-menu-item tag-coin">
            Goerli
          </el-tag>

        </template>
      </div>
    </div>

    <div class="modal-container">
      <el-dialog
        :title="dialogData.title"
        class="modal"
        :visible.sync="dialogData.dialogVisible"
        :close-on-click-modal="false"
        :width="dialogData.width"
        :top="dialogData.marginTop"
        :before-close="handleClose"
      >
        <div class="profile-container">
          <div class="profile-avt-wrapper">
            <img :src="avatar + '?imageView2/1/w/80/h/80'" class="profile-avt-item">
            <div class="profile-name">{{ profile.name }}</div>
          </div>
          <div class="profile-content">
            <div class="profile-address">gor:{{ profile.address }}</div>
            <div class="profile-info">
              <div class="info-item">Wallet <div>{{ profile.wallet }}</div>
              </div>
              <div class="info-item">Connected network <div>{{ profile.connectedNetwork }}</div>
              </div>
            </div>
            <div class="profile-btn">
              <el-button type="info" class="btn" plain @click="handleShow"> TeeID</el-button>
            </div>
          </div>
        </div>
      </el-dialog>
    </div>
    <Form :dialog-data="dialogEmailData" :data-form="dataForm" :form-list="inputFormList">
      <template v-slot:footerDialog>
        <div class="dialog-footer">
          <div class="btn-normal"><el-button class="btn-normal btn-cancel" plain @click="handleCancel">Cancel</el-button>
          </div>
          <div v-if="dialogEmailData.action">
            <el-button type="success" class="btn" @click="handleSubmit">Submit</el-button>
          </div>
          <div v-else>
            <el-button type="success" class="btn" @click="handleConfirm">Confirm</el-button>
          </div>
        </div>
      </template>
    </Form>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Form from '@/components/MyDialogComponent/Form.vue'
import { unlockAccount } from '@/api/web3'

import {
  requestAccess,
  confirmOtp
} from '@/api/wallet'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Form
    // Screenfull,
    // SizeSelect,
    // Search
  },
  data() {
    return {
      logo: 'https://wpimg.wallstcn.com/69a1c46c-eb1c-4b46-8bd4-e9e686ef5251.png',
      dialogData: {
        title: 'Profile',
        dialogVisible: false,
        width: '30%',
        marginTop: '12vh'
      },
      dialogEmailData: {
        title: '',
        dialogVisible: false,
        template: 'footerDialog',
        type: null,
        action: null,
        nested: false
      },
      dataForm: {},
      inputFormList: [],
      profile: {
        name: 'Human',
        address: null,
        wallet: 'Metamask',
        connectedNetwork: 'Goerli'
      }
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device',
      'displaySidebar',
      'account',
      'balance',
      'netId'
    ])
  },
  watch: {
    account: function(newAccount, oldAccount) {
      this.profile.address = this.shortenString(newAccount)
    }
  },
  mounted() {
    this.$store.dispatch('web3/getConnectionInfo')
    // this['web3/getConnectionInfo']()
    this.reload()
  },
  methods: {
    ...mapActions(['web3/getConnectionInfo']),
    reload() {
      this.profile.address = this.account && this.shortenString(this.account)
    },
    handleCancel() {

    },
    async handleConfirm() {
      try {
        const profile = await confirmOtp({ keyConfirm: this.dataForm.otp, mail: this.dataForm.email })
        const { data } = profile.data.data
        console.log(data);
        this.$store.dispatch('user/setProfile', data)
        this.$message({
          message: "Lấy thông tin thành công",
          type: 'success'
        })
      } catch (e) {
        console.log(e.data.msg)
        this.$message({
          message: e.message,
          type: 'warning'
        })
      }
    },
    async handleSubmit() {
      this.dataForm = {
        email: this.dataForm.email,
        otp: ''
      }
      this.dialogEmailData = {
        ...this.dialogEmailData,
        action: false
      }
      this.inputFormList = [
        { type: 'text', label: 'Email', field: 'email', disable: true },
        { type: 'text', label: 'OTP', field: 'otp' }
      ]
      this.$message({
        message: 'Chúng tôi đã gửi yêu cầu kết nối thông tin tới ứng dụng định danh ID của bạn vui lòng kiểm tra để lấy được mã đăng nhập.',
        type: 'success'
      })

      await requestAccess({
        email: this.dataForm.email,
        clientAddr: 'Hai Bà Trưng, Hà Nội, Việt Nam',
        deviceName: 'Google Chrome',
        deviceType: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
        application: 'Ví đa chữ ký - Tee Wallet',
        applicationId: '64102b48ea75995f98ea38cb',
        location: 'Hà nội, Việt Nam'
      })
    },
    handleShow() {
      this.dialogEmailData = {
        ...this.dialogEmailData,
        title: 'Kết nối ID',
        dialogVisible: true,
        template: 'footerDialog',
        type: 'show',
        action: 'confirm',
        nested: true
      }
      this.dataForm = {
        email: 'tao.duongkhac@gmail.com'
      }
      this.inputFormList = [
        { type: 'text', label: 'Email', field: 'email' }
      ]
    },
    async connectWallet() {
      try {
        const web3Data = await unlockAccount()
        if (web3Data) {
          const result = localStorage.getItem('wallet')
          if (result) {
            // convert to JSON
            const wallet = JSON.parse(result)
            this.$store.dispatch('wallet/setWallet', wallet)
          }
          this.$store.dispatch('web3/updateAccount', web3Data)
          this.profile.address = web3Data.account
        }
      } catch (error) {
        this.$message({
          message: error.message,
          type: 'warning'
        })
      }
    },
    shortenString(str) {
      if (str && str.length <= 28) {
        return str
      } else {
        const firstThree = str.slice(0, 18)
        const lastThree = str.slice(-5)
        return `${firstThree}...${lastThree}`
      }
    },
    handleShowProfile() {
      this.dialogData = { ...this.dialogData, dialogVisible: true }
    },
    handleClose() {
      this.dialogData = { ...this.dialogData, dialogVisible: false }
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../styles/variables.scss";

.dialog-footer {
  display: flex;
  justify-content: space-between;
}

.navbar-logo {
  float: left;
  width: 50px !important;
  height: 50px !important;
  margin-right: 16px;
}

.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background-color: $--color-background-paper;
  border-bottom: 2px solid $--color-border-light;

  .btn {
    outline: 0px;
    border: 0px rgb(18, 255, 128);
    margin: 0px;
    vertical-align: middle;
    min-width: 64px;
    color: rgba(0, 0, 0, 0.87);
    background-color: rgb(18, 255, 128);
    box-shadow: rgb(161 163 167) 0px 0px 2px;
    border-radius: 6px;
    font-weight: bold;
    line-height: 1.25;
    font-size: 14px;
    padding: 8px 24px;

    &:hover {
      text-decoration: none;
      background-color: rgb(12, 178, 89);
    }
  }

  .btn-normal {
    display: inline-flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
    background-color: transparent;
    outline: 0px;
    min-width: 64px;
    border-radius: 6px;
    font-weight: bold;
    line-height: 1.25;
    text-transform: none;
    font-size: 16px;
    padding: 12px 24px;
    border: 0px rgb(18, 255, 128);

    &:hover {
      text-decoration: none;
      background-color: rgba(255, 255, 255, 0.08);
    }
  }

  /* .sidebar-logo-link {
    float: left;
    margin-top: 8px;
    margin-left: 10px;
    height: 100%;
  }
  .sidebar-logo {
    width: 32px;
    height: 32px;
    vertical-align: middle;
    margin-right: 12px;
  } */

  /* box-shadow: 0 1px 4px rgba(48, 48, 51, .08); */
  .dropdown-menu {
    min-width: 10% !important;
  }

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 18px;

    &:focus {
      outline: none;
    }

    .tag-coin {
      display: inline-block;
      min-width: 70px;
      font-size: 11px;
      line-height: 24px;
      text-align: center;
      border-radius: 4px;
      padding: 4px 8px;
    }

    .btn-connect {
      outline: 0px;
      border: 0px rgb(18, 255, 128);
      margin: 0px;
      vertical-align: middle;
      min-width: 64px;
      color: rgba(0, 0, 0, 0.87);
      background-color: rgb(18, 255, 128);
      box-shadow: rgb(161 163 167) 0px 0px 2px;
      border-radius: 6px;
      font-weight: bold;
      line-height: 1.25;
      font-size: 14px;
      padding: 8px 24px;

      &:hover {
        text-decoration: none;
        background-color: rgb(12, 178, 89);
      }
    }

    .btn-container {
      display: flex !important;
      align-items: center;
      justify-content: center;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      /* font-size: 18px; */
      /* color: #5a5e66; */
      margin-right: 20px;
      border: 2px solid #303033;
      vertical-align: -webkit-baseline-middle;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {

      .avatar-wrapper {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .user-name {
          color: rgb(255, 255, 255);
        }

        .el-icon-caret-bottom {
          display: none;
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }

  }

  .profile-container {
    display: flex;
    color: rgb(255, 255, 255);

    .profile-btn {
      display: flex;
      justify-content: flex-end;
    }

    .profile-avt-wrapper {
      display: flex;
      flex-direction: column;
      gap: 10px;
      justify-content: flex-end;
      align-items: center;
      flex: 3;
      border-right: 1px solid #515151;
      padding-bottom: 14px;
      border-bottom: 1px solid #515151;

      .profile-avt-item {
        border-radius: 50%;
        width: 80px;
        height: 80px;
      }

      .profile-name {
        font-size: 18px;
        font-weight: 700;
        line-height: 1.1;
        text-align: justify;
        font-family: "DM Sans", sans-serif;
      }
    }

    .profile-content {
      flex: 7;
      display: flex;
      gap: 10px;
      flex-direction: column;

      .profile-address {
        flex: 2;
        font-size: 16px;
        border-bottom: 1px solid #515151;
        padding: 8px 16px;
      }

      .profile-info {
        flex: 8;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
        font-size: 14px;

        .info-item {
          display: flex;
          flex: 0.5;
          width: 100%;
          justify-content: space-between;
          border-bottom: 1px solid #515151;
          padding: 4px 16px;
        }
      }
    }
  }
}</style>
