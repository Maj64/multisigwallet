<template>
  <div
    v-loading.lock="loadingTable"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
    class="app-container"
  >
    <div class="feature-container">
      <div class="feature-header">Owner</div>
      <div class="feature-item">
        <button class="btn btn-add" @click="handleAdd">Thêm mới</button>
      </div>
    </div>
    <Table :columns="columns" :data-source="owners" :class-name="className">
      <template v-slot:action="{ rowData }">
        <div class="action">
          <div class="action-item">
            <button class="btn withdraw-btn" @click.stop="handleWithdraw(rowData)">Kick</button>
          </div>
        </div>
      </template>
    </Table>
    <Form :dialog-data="dialogData" :data-form="owner" :form-list="formList">
      <template v-slot:footerDialog>
        <el-button type="info" class="btn-normal" plain>Huỷ</el-button>
        <el-button type="success" class="btn" @click="handleSubmit">Thêm mới</el-button>
      </template>
    </Form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Table from '@/components/MyTableComponent/Table.vue'
import Form from '@/components/MyDialogComponent/Form.vue'

import {
  getOwnerListDetail
} from '@/api/wallet'

export default {
  name: 'Owner',
  components: {
    Table,
    Form
  },
  data() {
    return {
      loadingTable: false,
      className: 'table-container-height',
      dialogData: {
        title: '',
        dialogVisible: false,
        template: 'footerDialog'
      },
      formList: [
        { type: 'text', label: 'Tên người sở hữu', field: 'name' },
        { type: 'text', label: 'Địa chỉ', field: 'address' }
      ],
      columns: [
        { name: 'Người sở hữu', field: 'name' },
        { name: 'Địa chỉ', field: 'address', unShorten: true },
        { name: 'Thao tác', template: 'action' }
      ],
      owners: [
      ],
      owner: {
        name: '',
        address: ''
      }
    }
  },
  computed: {
    ...mapGetters([
      'provider',
      'account',
      'web3',
      'wallet'
    ])
  },
  mounted() {
    this.getListOwner()
  },
  methods: {
    handleAdd() {
      this.dialogData = {
        title: 'Thêm mới',
        dialogVisible: true,
        template: 'footerDialog',
        type: 'add'
      }
    },
    handleSubmit() {
      switch (this.dialogData.type) {
        case 'add': {
          this.handleAddOwner()
          break
        }
        default:
          break
      }
      this.resetData()
    },
    async handleAddOwner() {
      try {
        if (!this.web3) {
          this.$message({
            message: 'You must connect to MetaMask',
            type: 'warning'
          })
          return
        }
        if (!this.web3.utils.isAddress(this.owner.address)) {
          this.$message({
            message: 'Địa chỉ người sở hữu không hợp lệ!',
            type: 'warning'
          })
          return
        }
      } catch (error) {
        this.$message({
          message: error.message,
          type: 'warning'
        })
      }
    },
    async getListOwner() {
      try {
        if (!this.web3) {
          this.$message({
            message: 'You must connect to MetaMask',
            type: 'warning'
          })
          return
        }
        this.loadingTable = true
        var wallet = this.$store.getters.wallet
        const ownerList = await getOwnerListDetail(this.web3, this.account, {
          wallet: wallet.address,
          owners: wallet.owners
        })
        this.owners = ownerList
        this.loadingTable = false
        this.$message({
          message: 'Lấy danh sách người sở hữu ví thành công',
          type: 'success'
        })
      } catch (e) {
        this.$message({
          message: e.message,
          type: 'warning'
        })
        this.loadingTable = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$--color-text: rgb(255, 255, 255);
$--color-border-light: #303033;
$--space-3: 24px;

.app-container {

  .modal-container {
    .modal {
      background-color: rgba(99, 102, 105, 0.75);

      .form-container {
        color: $--color-text;
      }
    }

    .dialog-footer {
      display: flex;
      justify-content: space-between;
    }
  }

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

  .feature-container {
    display: flex;
    margin: 0px 24px;
    justify-content: space-between;
    align-items: baseline;

    .feature-header {
      color: rgb(255, 255, 255);
      font-weight: 700;
      margin: 0px;
      font-size: 24px;
      line-height: 30px;
      margin-bottom: 24px;
    }

    .feature-item>button {
      color: rgb(18, 255, 128);
      display: flex;
      height: 100%;
      align-items: flex-end;
      -webkit-box-pack: end;
      justify-content: flex-end;
      box-sizing: border-box;
      color: rgba(0, 0, 0, 0.87);
      background-color: rgb(18, 255, 128);
      box-shadow: rgb(161 163 167) 0px 0px 2px;
      border-radius: 6px;
      font-weight: bold;
      line-height: 1.25;
      text-transform: none;
      font-size: 16px;
      padding: 8px 32px;

      &:hover {
        text-decoration: none;
        background-color: rgb(12, 178, 89);
      }
    }
  }

  .action-item {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
  }
}</style>
