<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <div v-if="displaySidebar"><sidebar class="sidebar-container" /></div>
    <div :class="[{hasTagsView:needTagsView}, displaySidebar ? 'main-container' : 'main-container-no-margin']">
      <div :class="{'fixed-header':fixedHeader}">
        <navbar />
        <tags-view v-if="needTagsView" />
      </div>
      <app-main />
      <right-panel v-if="showSettings">
        <settings />
      </right-panel>
      <footer>
        <div class="copyright">
          <div class="container">
            <div class="row">
              <span>Tee platform</span>
            </div>
            <div class="row">
              <span>Copyright © 2023</span>
            </div>
            <div class="row">
              <span>Contact us: 0977948802</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
import RightPanel from '@/components/RightPanel'
import { AppMain, Navbar, Settings, Sidebar, TagsView } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'Layout',
  components: {
    AppMain,
    Navbar,
    RightPanel,
    Settings,
    Sidebar,
    TagsView
  },
  mixins: [ResizeMixin],
  data() {
    return {
      noMargin: ''
    }
  },
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar,
      device: state => state.app.device,
      displaySidebar: state => state.app.displaySidebar,
      showSettings: state => state.settings.showSettings,
      needTagsView: state => state.settings.tagsView,
      fixedHeader: state => state.settings.fixedHeader
    }),
    ...mapGetters([
      'setWalletID'
    ]),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  mounted() {
    this.renderPage()
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    },
    renderPage() {
      const route = this.$route
      const { path } = route
      if (path === '/wallet') {
        this.$store.dispatch('app/displaySidebar', false)
      } else {
        this.$store.dispatch('app/displaySidebar', true)
      }
    }
  }
}
</script>

<style lang="scss">
/* .main-container {
  margin: 0 !important;
}
.openSidebar {
  .main-container {
    margin-left: 210px !important;
  }
} */
</style>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  @import "~@/styles/variables.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;

    &.mobile.openSidebar {
      position: fixed;
      top: 0;
    }
  }

  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px)
  }

  .main-container-no-margin .fixed-header {
    width: 100%;
  }

  .mobile .fixed-header {
    width: 100%;
  }

  .sidebar-container {
    border-right: 1px solid rgb(48, 48, 51);
  }

  .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #1c1c1c;
    color: rgba(255, 255, 255, 0.8);
    border-top: solid 1px #303033;
    height: 64px;
    padding: 8px;
  }
</style>
