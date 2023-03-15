<template>
  <div
    v-loading.lock="loadingTable"
    class="app-container"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <div class="feature-container">
      <div class="feature-header">Transaction</div>
    </div>
    <Table :columns="columns" :data-source="transactions" :class-name="className">
      <template v-slot:required="{ rowData }">
        <div v-if="!rowData.executed">
          <div v-if="rowData.isConfirmedByCurrentAccount">
            <el-button type="success" class="btn" @click.stop="handleRevokeConfirm(rowData)">Revoke Confirm</el-button>
          </div>
          <div v-else>
            <el-button type="success" class="btn" @click.stop="handleConfirm(rowData)">Confirm</el-button>
          </div>
          <div v-if="rowData.execute">
            <el-button type="success" class="btn" @click.stop="handleExecute(rowData)">Execute</el-button>
          </div>
        </div>
      </template>
    </Table>
    <!-- <Form :dialog-data="dialogData" :data-form="transaction" :form-list="formList">
      <template v-slot:footerDialog>
        <el-button type="info" class="btn-normal btn-cancel" plain @click="handleCancel">Cancel</el-button>
        <el-button type="success" class="btn" @click="handleAddSubmit">Add</el-button>
      </template>
    </Form> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Table from '@/components/MyTableComponent/Table.vue'
import {
  getTransactionsApi,
  confirmTransaction,
  revokeConfirmation,
  executeTransaction
} from '@/api/wallet'

export default {
  name: 'Transaction',
  components: {
    Table
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
      columns: [
        { name: 'ID', field: 'id' },
        { name: 'Destination', field: 'destination' },
        { name: 'Value', field: 'value' },
        { name: 'Data/Subject', field: 'subject' },
        { name: 'Confirmations', field: 'confirmations' },
        { name: 'Actions', field: 'confirmations', template: 'required' },
        { name: 'Executed', field: 'executedMsg' }
      ],
      transactions: [
      ],
      transaction: {
        id: '',
        destination: '',
        value: '',
        subject: '',
        confirmations: '',
        executed: ''
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
    this.getListTransaction()
  },
  methods: {
    async handleRevokeConfirm(rawData) {
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
        this.loadingTable = true
        await revokeConfirmation(this.web3, this.account, {
          txIndex: rawData.id,
          wallet: wallet.address
        })
        this.$message({
          message: 'Thu hồi xác nhận giao dịch thành công!',
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
    },
    async handleConfirm(rawData) {
      try {
        if (!this.web3) {
          this.$message({
            message: 'You must connect to MetaMask',
            type: 'warning'
          })
          return
        }
        const wallet = this.$store.getters.wallet
        this.loadingTable = true
        await confirmTransaction(this.web3, this.account, {
          txIndex: rawData.id,
          wallet: wallet.address
        })
        this.$message({
          message: 'Xác nhận giao dịch thành công!',
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
    },
    async handleExecute(rawData) {
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
        this.loadingTable = true
        await executeTransaction(this.web3, this.account, {
          txIndex: rawData.id,
          wallet: wallet.address
        })
        this.$message({
          message: 'Thực thi giao dịch thành công!',
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
    },
    handleAdd() {
      this.dialogData = {
        title: 'Thêm mới',
        dialogVisible: true,
        template: 'footerDialog'
      }
    },
    async getListTransaction() {
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
        const transactions = await getTransactionsApi(this.web3, this.account, {
          address: wallet.address
        })
        var trans = transactions.transactions.map(tx => {
          return {
            id: tx.txIndex.toString(),
            destination: tx.destination,
            value: tx.value.toNumber().toString(),
            subject: tx.data,
            isConfirmedByCurrentAccount: tx.isConfirmedByCurrentAccount,
            confirmations: tx.numConfirmations.toString(),
            executedMsg: tx.executed ? 'Đã thực thi' : 'Chưa thực thi',
            executed: tx.executed,
            action: true,
            execute: tx.numConfirmations >= wallet.numConfirmationsRequired
          }
        })
        this.transactions = trans
        this.loadingTable = false
        this.$message({
          message: 'Lấy danh sách giao dịch thành công!',
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
    justify-content: flex-start;
    align-items: center;
    gap: 10px;
  }
}
</style>
