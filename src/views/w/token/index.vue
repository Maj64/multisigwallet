<template>
  <div v-loading.lock="loadingTable" element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)" class="app-container">
    <div class="feature-container">
      <div class="feature-header">Token</div>
      <div class="feature-item">
        <button class="btn btn-add" @click="handleAdd">Thêm mới</button>
      </div>
    </div>
    <Table :columns="columns" :data-source="tokens" :class-name="className">
      <template v-slot:action="{ rowData }">
        <div class="action">
          <div class="action-item">
            <button class="btn-size deposit-btn btn-normal" @click.stop="handleDeposit(rowData)">Nạp Token</button>
          </div>
          <div class="action-item">
            <button class="btn withdraw-btn" @click.stop="handleWithdrawToken(rowData)">Rút Token</button>
          </div>
        </div>
      </template>
    </Table>
    <Form :dialog-data="dialogData" :data-form="dataForm" :form-list="formData">
      <template v-slot:footerDialog>
        <el-button type="info" class="btn-normal btn-cancel" plain>Huỷ</el-button>
        <el-button type="success" class="btn" @click="handleSubmit">Thêm mới</el-button>
      </template>
    </Form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Table from '@/components/MyTableComponent/Table.vue'
import Form from '@/components/MyDialogComponent/Form.vue'
import Web3 from 'web3'
import {
  getTokensApi,
  createToken
} from '@/api/wallet'

import {
  submitTransaction
} from '@/api/wallet'

export default {
  name: 'Token',
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
      dataForm: {},
      formData: [],
      formList: [
        { type: 'text', label: 'Tên token', field: 'name' },
        { type: 'number', label: 'Tổng cung', field: 'totalSupply' },
        { type: 'text', label: 'Ký hiệu', field: 'symbol' },
        { type: 'number', label: 'Phần thập phân', field: 'decimals' }
      ],
      columns: [
        { name: 'Token', field: 'name' },
        { name: 'Ký hiệu', field: 'symbol' },
        { name: 'Số dư', field: 'balance' },
        { name: 'Địa chỉ', field: 'address' },
        { name: 'Phần thập phân', field: 'decimals' },
        { name: 'Thao tác', template: 'action' }
      ],
      tokens: [],
      token: {
        name: '',
        symbol: '',
        totalSupply: '',
        decimals: ''
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
    this.getTokenList()
  },
  methods: {
    resetData() {
      this.dialogData = {
        title: '',
        dialogVisible: false,
        template: 'footerDialog',
        type: null
      }
      this.dataForm = {}
      this.formData = {}
    },
    async handleDeposit(token) {
      this.dialogData = {
        ...this.dialogData,
        title: 'Nạp token vào ví',
        dialogVisible: true,
        template: 'footerDialog',
        type: 'deposit',
        action: 'deposit'
      }
      this.dataForm = {
        address: token.address,
        name: token.name
      }
      this.formData = [
        {
          type: 'text',
          label: 'Tên Token',
          field: 'name',
          disable: true
        },
        {
          type: 'text',
          label: 'Địa chỉ ví',
          field: 'address',
          disable: true
        },
        {
          type: 'number',
          label: 'Số lượng token',
          field: 'amount'
        }
      ]
    },
    async handleWithdrawToken(rawData) {
      const wallet = this.$store.getters.wallet
      this.dialogData = {
        ...this.dialogData,
        title: 'Yêu cầu Phân phối Token',
        dialogVisible: true,
        template: 'footerDialog',
        type: 'withdraw',
        action: 'withdraw'
      }
      this.dataForm = {
        tokenName: rawData.address,
        tokenAddress: rawData.name,
        walletName: wallet.name,
        walletAddress: wallet.address
      }
      this.formData = [
        {
          type: 'text',
          label: 'Tên ví',
          field: 'walletName',
          disable: true
        },
        {
          type: 'text',
          label: 'Rút từ ví',
          field: 'walletAddress',
          disable: true
        },
        {
          type: 'text',
          label: 'Tên Token',
          field: 'tokenName',
          disable: true
        },
        {
          type: 'text',
          label: 'Địa chỉ Token',
          field: 'tokenAddress',
          disable: true
        },
        {
          type: 'number',
          label: 'Số lượng Token',
          field: 'amount'
        },
        {
          type: 'text',
          label: 'Địa chỉ nhận',
          field: 'creditAddress'
        },
        {
          type: 'text',
          label: 'Lý do rút Token',
          field: 'reason'
        }
      ]
    },
    async deposit() {
      try {
        const { wallet, amount } = this.dataForm
        if (!this.web3) {
          this.$message({
            message: 'You must unlock Metamask',
            type: 'warning'
          })
          return
        }
        this.loadingTable = true
        const value = Web3.utils.toBN(amount)
        const zero = Web3.utils.toBN(0)
        if (value.gt(zero)) {
          this.$message({
            message: 'Nạp tiền vào ví thành công',
            type: 'success'
          })
        }
        this.loadingTable = false
      } catch (e) {
        this.$message({
          message: e.message,
          type: 'warning'
        })
        this.loadingTable = false
      }
      // need close form
    },
    async withdrawToken() {
      const { walletAddress, creditAddress, amount, reason, tokenAddress } = this.dataForm

      if (!this.web3) {
        this.$message({
          message: 'You must unlock Metamask',
          type: 'warning'
        })
        return
      }

      if (!this.web3.utils.isAddress(creditAddress)) {
        this.$message({
          message: 'Địa chỉ người nhận không hợp lệ',
          type: 'warning'
        })
        return
      }

      // fake data withDrawValue
      const value = Web3.utils.toBN(amount)
      const zero = Web3.utils.toBN(0)
      if (value.gt(zero)) {
        try {
          if (!this.web3) {
            throw new Error('No web3')
          }
          this.loadingTable = true
          await submitTransaction(this.web3, this.account, {
            value,
            destination: creditAddress,
            data: reason,
            token: tokenAddress,
            wallet: walletAddress
          })
          this.$message({
            message: 'Tạo yêu cầu rút tiền thành công!',
            type: 'success'
          })
          this.loadingTable = false
          // close form, reset value
        } catch (error) {
          this.$message({
            message: error.message,
            type: 'warning'
          })
          this.loadingTable = false
        }
      }
    },
    handleSubmit() {
      switch (this.dialogData.type) {
        case 'add': {
          this.handleCreateToken()
          break
        }
        default:
          break
      }
      this.resetData()
    },
    handleAdd() {
      this.dialogData = {
        title: 'Tạo mới tài sản chung (Token)',
        dialogVisible: true,
        template: 'footerDialog',
        type: 'add'
      }
      this.formData = this.formList
    },
    async getTokenList() {
      try {
        if (!this.web3) {
          this.$message({
            message: 'You must connect to MetaMask',
            type: 'warning'
          })
          return
        }
        this.loadingTable = true
        const wallet = this.$store.getters.wallet
        const tokens = await getTokensApi(this.web3, this.account, {
          address: wallet.address
        })
        this.tokens = tokens.detailTokens.map(tk => {
          return {
            name: tk.name,
            symbol: tk.symbol,
            decimals: tk.decimals.toString(),
            balance: tk.balance.toString(),
            address: tk.address
          }
        })
        this.loadingTable = false
        this.$message({
          message: 'Lấy danh sách token ví quản lý thành công',
          type: 'success'
        })
      } catch (e) {
        this.$message({
          message: e.message,
          type: 'warning'
        })
        this.loadingTable = true
      }
    },
    async handleCreateToken() {
      try {
        if (!this.web3) {
          this.$message({
            message: 'You must connect to MetaMask',
            type: 'warning'
          })
          return
        }
        this.loadingTable = true
        const { name, symbol, decimals, totalSupply } = this.token
        await createToken(this.web3, this.account, {
          name,
          symbol,
          decimals,
          total: totalSupply,
          wallet: this.$store.getters.wallet.address
        })
        this.$message({
          message: 'Tạo mới token thành công',
          type: 'success'
        })
        this.loadingTable = false
      } catch (e) {
        this.$message({
          message: e.message,
          type: 'warning'
        })
        this.loadingTable = false
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
  .btn-size {
    padding: 8px 24px;
    min-width: 64px;
    border: 1px solid #303033;
    border-radius: 6px;
    font-weight: bold;
    line-height: 1.25;
    font-size: 14px;
  }

  .deposit-btn {
    color: $--color-text;
  }

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
}
</style>
