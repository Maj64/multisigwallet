<template>
  <div class="app-container">
    <div class="feature-container">
      <div class="feature-header">Wallet</div>
      <div class="feature-item">
        <button class="btn btn-add" @click="handleAdd">Add</button>
      </div>
    </div>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Address</th>
            <th>Balance</th>
            <th>Required Confirmation</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="wallet-name">Hust Wallet</td>
            <td class="wallet-address">f8ef8939fccccccdfr483yfe89fhdfhdfhdofhdosfhoidhfodshf3dchđì</td>
            <td class="wallet-balance">0.1000000ETH</td>
            <td class="wallet-balance"><button class="btn btn-edit">Edit</button></td>
            <td>
              <div class="action">
                <div class="action-item"><button class="btn deposit-btn">Deposit</button></div>
                <div class="action-item"><button class="btn withdraw-btn">Withdraw</button></div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="dialog-container">
      <button @click="showDialog = true">Open Dialog</button>
      <div v-if="showDialog" class="modal">
        <div class="modal-content">
          <span class="close" @click="closeDialog">&times;</span>
          <form @submit.prevent="submitForm">
            <div v-for="(field, index) in fields" :key="index">
              <label :for="field.name">{{ field.label }}:</label>
              <input v-model="formData[field.name]" :type="field.type" :name="field.name">
            </div>
            <button type="submit">{{ submitButtonText }}</button>
          </form>
        </div>
      </div>
    </div>
    <div class="modal-container">
      <el-dialog title="Add New Wallet" class="modal" :visible.sync="dialogVisible" :before-close="handleCancel">
        <el-form :label-position="labelPosition" label-width="180px" :model="wallet">
          <el-form-item label="Name">
            <el-input v-model="wallet.name" />
          </el-form-item>
          <el-form-item label="Address">
            <el-input v-model="wallet.address" />
          </el-form-item>
          <el-form-item label="Balance">
            <el-input v-model.number="wallet.balance" type="number" />
          </el-form-item>
          <el-form-item label="Required Confirmation">
            <el-input v-model.number="wallet.requiredConfirmation" type="number" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="info" class="btn btn-cancel" plain @click="handleCancel">Cancel</el-button>
          <el-button type="success" class="btn">Add</el-button>
        </div>
      </el-dialog>
    </div>
  </div>

</template>

<script>
export default {
  name: 'Wallet',
  props: {
    fields: {
      type: Array,
      required: true
    },
    submitButtonText: {
      type: String,
      default: 'Submit'
    }
  },
  data() {
    return {
      wallets: [],
      wallet: {
        name: '',
        address: '',
        balance: '',
        requiredConfirmation: ''
      },
      labelPosition: 'right',
      dialogVisible: false,
      showDialog: false,
      formData: {}
    }
  },
  methods: {
    handleAdd() {
      this.dialogVisible = true
    },
    handleCancel() {
      this.dialogVisible = false
    },
    closeDialog() {
      this.showDialog = false
    },
    submitForm() {
      console.log('Form data:', this.formData)
      this.$emit('submit', this.formData)
      this.closeDialog()
    }
  }
}
</script>

<style lang="scss" scoped>
$--color-text: rgb(255, 255, 255);
$--color-border-light: #303033;
$--space-3: 24px;
.app-container {
  .dialog-container {
    .modal {
      display: flex;
      align-items: center;
      justify-content: center;
      position: fixed;
      z-index: 1;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.4);
    }
    .modal-content {
      background-color: #fff;
      padding: 20px;
      border-radius: 5px;
      width: 50%;
    }
    .close {
      color: #aaa;
      float: right;
      font-size: 28px;
      font-weight: bold;
      cursor: pointer;
    }
  }
  .modal-container {
    .modal {
      background-color: rgba(99, 102, 105, 0.75);
    }

    .dialog-footer {
      display: flex;
      justify-content: space-evenly;
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
    .feature-item > button{
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
 .table-container {
  margin: 10px 24px;
  table {
    display: table;
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0px;
    thead {
      display: table-header-group;
      tr {
        color: $--color-text;
        display: table-row;
        vertical-align: middle;
        outline: 0px;
        th {
          border-bottom: 1px solid rgb(48, 48, 51);
          display: table-cell;
          text-align: left;
          padding: 16px;
          font-size: 16px;
          line-height: 22px;
          font-weight: 400;
          color: rgb(161, 163, 167);
        }
      }
    }
    tbody {
      display: table-row-group;
      tr {
        transition: background-color 0.2s ease 0s;
        display: table-row;
        vertical-align: middle;
        outline: 0px;
        td {
          padding: 8px 0px;
          font-size: 16px;
          line-height: 22px;
          font-weight: 400;
          display: table-cell;
          border-bottom: 1px solid rgb(81, 81, 81);
          padding: 16px;
          color: rgb(255, 255, 255);
          text-align: center;
        }
      }
      .action {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
      }
    }
  }
 }
}
</style>
