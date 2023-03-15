import Cookies from 'js-cookie'

const state = {
  sidebar: {
    opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    withoutAnimation: false
  },
  device: 'desktop',
  size: Cookies.get('size') || 'medium',
  displaySidebar: false,
  walletID: null
}

const mutations = {
  DISPLAY_SIDEBAR: (state, displaySidebar) => {
    state.displaySidebar = displaySidebar
  },
  SHOW_SIDEBAR: state => {
    state.showSidebar = true
    if (state.showSidebar) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  },
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  SET_SIZE: (state, size) => {
    state.size = size
    Cookies.set('size', size)
  },
  SET_WALLET_ID: (state, walletID) => {
    state.walletID = walletID
  }
}

const actions = {
  displaySidebar({ commit }, displaySidebar) {
    commit('DISPLAY_SIDEBAR', displaySidebar)
  },
  showSidebar({ commit }) {
    commit('SHOW_SIDEBAR')
  },
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  setSize({ commit }, size) {
    commit('SET_SIZE', size)
  },
  setWalletID({ commit }, walletID) {
    commit('SET_WALLET_ID', walletID)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
