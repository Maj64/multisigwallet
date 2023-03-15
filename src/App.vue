<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
.v-modal {
  display: none !important;
}
.el-dialog__wrapper.modal {
  background: rgba(0, 0, 0, 0.5);
}
</style>
