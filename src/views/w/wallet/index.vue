<template>
  <div
    v-loading.lock="loadingTable"
    class="app-container"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <div class="feature-container">
      <div class="feature-header">Wallet</div>
      <div class="feature-item">
        <button class="btn btn-add" @click="handleAdd">Thêm mới</button>
      </div>
    </div>
    <Table :columns="columns" :data-source="wallets" :class-name="className" @row-click="openWalletDetail">
      <template v-slot:required="{ rowData }">
        <div class="action-item">
          <div class="row-text">{{ rowData.numConfirmationsRequired }}</div>
          <button class="btn btn-edit" @click.stop="handleEdit(rowData)">Thay đổi</button>
        </div>
      </template>
      <template v-slot:action="{ rowData }">
        <div class="action">
          <div class="action-item"><button
            class="btn-size deposit-btn btn-normal"
            @click.stop="handleDeposit(rowData)"
          >Nạp tiền</button></div>
          <div class="action-item"><button class="btn withdraw-btn" @click.stop="handleWithdraw(rowData)">Rút
            tiền</button></div>
        </div>
      </template>
    </Table>
    <Form :dialog-data="dialogData" :data-form="dataForm" :form-list="formData">
      <template v-slot:owners>
        <div class="owner-header">
          <h3>Danh sách người sở hữu ví:</h3>
          <div class="action-item"><button class="btn" @click="handleAddOwner">Add</button></div>
        </div>
        <Table :class-name="classNameForm" :columns="columnOwner" :data-source="wallet.owners">
          <template v-slot:action="{ rowData }">
            <div class="action-item"><button class="btn btn-danger" @click="handleRemoveOwner(rowData)">Remove</button>
            </div>
          </template>
        </Table>
      </template>
      <template v-slot:footerDialog>
        <el-button type="info" class="btn-normal btn-cancel" plain @click="handleCancel">Cancel</el-button>
        <div v-if="dialogData.action">
          <el-button type="success" class="btn" @click="handleSubmit">Send Transaction</el-button>
        </div>
        <div v-else>
          <el-button type="success" class="btn" @click="handleSubmit">Submit</el-button>
        </div>
      </template>
    </Form>
  </div>
</template>

<script>
import Table from '@/components/MyTableComponent/Table.vue'
import Form from '@/components/MyDialogComponent/Form.vue'
import Web3 from 'web3'
import { mapGetters } from 'vuex'
import {
  get,
  getWalletList,
  createWallet,
  createWalletApi,
  deposit,
  submitTransaction
} from '@/api/wallet'

export default {
  name: 'Wallet',
  components: {
    Table,
    Form
  },
  data() {
    return {
      loadingTable: false,
      className: 'table-container-height',
      classNameForm: 'table-container',
      dialogData: {
        title: '',
        dialogVisible: false,
        template: 'footerDialog',
        type: null,
        action: null
      },
      dataForm: {},
      formData: [],
      formList: [
        { type: 'text', label: 'Tên ví', field: 'name' },
        { type: 'number', label: 'Số người cần xác nhận', field: 'numConfirmationsRequired' },
        { template: 'owners' }
      ],
      columns: [
        { name: 'Tên ví', field: 'name' },
        { name: 'Địa chỉ', field: 'address', unShorten: true },
        { name: 'Số dư', field: 'balance' },
        { name: 'Số người cần xác nhận', field: 'numConfirmationsRequired', template: 'required' },
        { name: 'Thao tác', template: 'action' }
      ],
      columnOwner: [
        { name: 'Name', field: 'name', input: 'input' },
        { name: 'Address', field: 'address', input: 'input' },
        { name: 'Action', template: 'action' }
      ],
      wallets: [
      ],
      wallet: {
        name: '',
        address: '',
        balance: '',
        numConfirmationsRequired: '',
        owners: [{
          name: '',
          address: ''
        }]
      }
    }
  },
  computed: {
    ...mapGetters([
      'provider',
      'account',
      'web3'
    ])
  },
  watch: {
    account: function(newAccount, oldAccount) {
      this.getWalletListData(newAccount)
    }
  },
  mounted() {
    this.$store.dispatch('app/displaySidebar', false)
    this.getWalletListData(this.$store.getters.account)
  },
  methods: {
    async openWalletDetail(wallet) {
      try {
        if (!this.web3) {
          this.$message({
            message: 'You must unlock Metamask',
            type: 'warning'
          })
          return
        }
        this.loadingTable = true
        const walletDetail = await get(new Web3(window.ethereum), this.account, wallet.address)
        if (walletDetail) {
          this.$store.dispatch('wallet/setWallet', walletDetail)
          this.$store.dispatch('app/displaySidebar', true)
          this.$store.dispatch('app/setWalletID', wallet?.address)
          this.$router.push(`/${wallet?.address}/home`)
        }
        this.loadingTable = false
      } catch (error) {
        this.$message({
          message: error.message,
          type: 'warning'
        })
        this.loadingTable = true
      }
    },
    async getWalletListData(account) {
      // const account = this.$store.getters.account
      try {
        if (!account) {
          return false
        }
        this.loadingTable = true
        const walletList = await getWalletList(account)
        this.wallets = walletList.data.data.map(wl => {
          return {
            name: wl.name,
            address: wl.contractAddress,
            balance: wl.balance,
            numConfirmationsRequired: 2
          }
        })
        this.loadingTable = false
      } catch (error) {
        this.loadingTable = false
        console.log(error)
      }
    },
    handleRowClick(rowData) {
      this.$router.push(`/${rowData?.address}/home`)
      this.$store.dispatch('app/displaySidebar', true)
      this.$store.dispatch('app/setWalletID', rowData?.address)
    },
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
    handleAdd() {
      this.dialogData = {
        title: 'Tạo mới ví đa chữ ký',
        dialogVisible: true,
        template: 'footerDialog',
        type: 'add'
      }
      this.dataForm = {
        ...this.wallet,
        owners: [{
          name: '',
          address: ''
        }]
      }
      this.formData = [...this.formList]
    },
    handleCancel() {
      this.resetData()
    },
    async handleCreateWallet() {
      try {
        if (!this.web3) {
          this.$message({
            message: 'You must unlock Metamask',
            type: 'warning'
          })
          return
        }
        this.loadingTable = true
        const { name, numConfirmationsRequired } = this.dataForm
        const ownerAddressList = this.wallet.owners.map((i) => i.address)
        const ownerNameList = this.wallet.owners.map(i => i.name)

        if (this.web3) {
          const wallet = await createWallet(this.web3, this.account, {
            name,
            numConfirmationsRequired,
            owners: ownerAddressList,
            ownerNames: ownerNameList
          })

          this.$store.dispatch('wallet/addWallet', {
            name: wallet.name,
            address: wallet.address,
            balance: Number(wallet.balance),
            numConfirmationsRequired: wallet.numConfirmationsRequired
          })

          ownerAddressList.push(this.account)
          await createWalletApi({
            name,
            contractAddress: wallet.address,
            owners: ownerAddressList
          })

          this.$message({
            message: 'Tạo mới ví đa chữ ký thành công!',
            type: 'success'
          })
          this.loadingTable = false
        } else {
          this.$message({
            message: 'You must unlock Metamask',
            type: 'warning'
          })
          this.loadingTable = false
        }
      } catch (error) {
        this.$message({
          message: error.message,
          type: 'warning'
        })
        this.loadingTable = false
      }
    },
    handleSubmit() {
      switch (this.dialogData.type) {
        case 'edit': {
          this.wallets = this.wallets.map(wallet => wallet.id !== this.dataForm.id ? wallet : this.dataForm)
          break
        }
        case 'add': {
          this.handleCreateWallet()
          this.wallets.push(this.dataForm)
          break
        }
        case 'deposit': {
          this.deposit()
          break
        }
        case 'withdraw': {
          this.withdraw()
          break
        }
        default:
          break
      }
      this.resetData()
    },
    handleEdit(rowData) {
      this.dialogData = {
        ...this.dialogData,
        title: 'Chỉnh sửa số người xác nhận',
        dialogVisible: true,
        template: 'footerDialog',
        type: 'edit'
      }
      this.dataForm = {
        ...rowData,
        numConfirmationsRequired: rowData.numConfirmationsRequired,
        wallet: rowData.address,
        name: rowData.name
      }
      this.formData = [
        {
          type: 'text',
          label: 'Tên ví',
          field: 'name',
          disable: true
        },
        {
          type: 'text',
          label: 'Địa chỉ ví',
          field: 'wallet',
          disable: true
        },
        {
          type: 'number',
          label: 'Required Confirmations',
          field: 'numConfirmationsRequired'
        }
      ]
    },

    async handleDeposit(wallet) {
      this.dialogData = {
        ...this.dialogData,
        title: 'Nạp tiền vào ví',
        dialogVisible: true,
        template: 'footerDialog',
        type: 'deposit',
        action: 'deposit'
      }
      this.dataForm = {
        wallet: wallet.address,
        name: wallet.name
      }
      this.formData = [
        {
          type: 'text',
          label: 'Tên ví',
          field: 'name',
          disable: true
        },
        {
          type: 'text',
          label: 'Địa chỉ ví',
          field: 'wallet',
          disable: true
        },
        {
          type: 'number',
          label: 'Số tiền (WEI)',
          field: 'amount'
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
          await deposit(this.web3, this.account, { value, wallet })
          // depositValue = '0'
          // const valueEther = this.web3.utils.fromWei(depositValue.toString(), 'ether')

          // this.$store.dispatch('web3/updateBalance', {
          //   address: wallet,
          //   balance: Number(Number(valueEther).toFixed(4))
          // })

          // const balance = this.web3.utils.fromWei(
          //   await this.web3.eth.getBalance(this.account),
          //   'ether'
          // )

          // const newBalance = Number(balance).toFixed(4)
          // this.$store.dispatch('web3/updateAccount', {
          //   account: this.account,
          //   balance: newBalance,
          //   web3: this.web3
          // })

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
    async handleWithdraw(wallet) {
      this.dialogData = {
        ...this.dialogData,
        title: 'Yêu cầu rút tiền',
        dialogVisible: true,
        template: 'footerDialog',
        type: 'withdraw',
        action: 'withdraw'
      }
      this.dataForm = {
        wallet: wallet.address,
        name: wallet.name
      }
      this.formData = [
        {
          type: 'text',
          label: 'Tên ví',
          field: 'name',
          disable: true
        },
        {
          type: 'text',
          label: 'Rút từ ví',
          field: 'wallet',
          disable: true
        },
        {
          type: 'number',
          label: 'Số tiền (WEI)',
          field: 'amount'
        },
        {
          type: 'text',
          label: 'Địa chỉ nhận',
          field: 'creditAddress'
        },
        {
          type: 'text',
          label: 'Lý do rút tiền',
          field: 'reason'
        }
      ]
    },

    async withdraw() {
      const { wallet, creditAddress, amount, reason } = this.dataForm

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
            token: '0x0000000000000000000000000000000000000000',
            wallet
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

    handleAddOwner() {
      this.wallet.owners.push({
        id: '',
        name: '',
        address: ''
      })
    },
    handleRemoveOwner(rowData) {
      this.wallet.owners.splice(rowData.RowIndex, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
$--color-text: black;
$--color-border-light: #303033;
$--space-3: 24px;

.app-container {

  .owner-header {
    display: flex;
    justify-content: space-between;
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

  .btn-danger {
    color: #e4e8ef;
    background-color: rgb(198, 32, 35);

    &:hover {
      background-color: rgba(198, 32, 35, 0.6);
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

  .btn-edit {
    background-color: rgb(72, 169, 166);

    &:hover {
      background-color: rgba(72, 169, 166, 0.6);
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
    justify-content: flex-start;
    gap: 60px;
    align-items: center;

    .row-text {
      margin-left: 24px;
    }
  }
}
</style>
