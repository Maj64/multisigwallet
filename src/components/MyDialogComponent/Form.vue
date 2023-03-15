<template>
  <div class="modal-container">
    <el-dialog :title="dialogData.title" class="modal" :visible.sync="dialogData.dialogVisible" :close-on-click-modal="false" :append-to-body="dialogData.nested">
      <el-form label-position="left" label-width="200px" :model="dataForm" class="form-container">
        <div v-for="(formItem, formIndex) in formList" :key="formIndex">
          <el-form-item :label="formItem.label">
            <div v-if="formItem.type === 'text'">
              <el-input v-model="dataForm[formItem.field]" :type="formItem.type" :disabled="formItem.disable" />
            </div>
            <div v-if="formItem.type === 'number'">
              <el-input v-model.number="dataForm[formItem.field]" :type="formItem.type" />
            </div>
          </el-form-item>
          <slot :dataOwner="{...dataForm} " :name="formItem.template" />
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <slot :name="dialogData.template" />
        <!-- <el-button type="info" class="btn-normal btn-cancel" plain @click="handleCancel">Cancel</el-button>
        <el-button type="success" class="btn" @click="handleAddSubmit">Add</el-button> -->
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Form',
  props: {
    dialogData: {
      type: Object,
      default: () => {}
    },
    dataForm: {
      type: Object,
      default: () => {}
    },
    formList: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style lang="scss" scoped>
$--color-text: rgb(255, 255, 255);
$--color-border-light: #303033;
$--space-3: 24px;
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
</style>
