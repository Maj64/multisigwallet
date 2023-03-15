// api
// get token

const state = {
  wallets: [],
  wallet: {
    name: '',
    address: '',
    balance: '',
    numConfirmationsRequired: null
  }
}

const mutations = {
  SET_WALLET: (state, wallet) => {
    state.wallet = {
      ...state.wallet,
      ...wallet
    }
  },
  ADD_WALLET: (state, wallet) => {
    localStorage.setItem('wallets', JSON.stringify({
      ...state,
      wallets: [...state.wallets, state.wallet]
    }))
    state.wallets = [...state.wallets, wallet]
  },
  UPDATE_BALANCE: (state, wallet) => {
    const currentWallet = state.wallets
    const indexWallet = currentWallet.findIndex(x => x.address === wallet.address)
    if (indexWallet >= 0) {
      currentWallet[indexWallet].balance += wallet.balance
    }
    state.wallets = [...currentWallet]
  },
  UPDATE_WALLET: (state, wallet) => {
    const currentWallet = state.wallets
    const indexWallet = currentWallet.findIndex(x => x.address === wallet.address)

    if (indexWallet >= 0) {
      currentWallet[indexWallet] = { ...wallet }
    }
    state.wallets = [...currentWallet]
  }
}

const actions = {
  setWallet({ commit }, wallet) {
    commit('SET_WALLET', wallet)
  },
  addWallet({ commit }, wallet) {
    commit('ADD_WALLET', wallet)
  },
  updateBalance({ commit }, wallet) {
    commit('UPDATE_BALANCE', wallet)
  },
  updateWallet({ commit }, wallet) {
    commit('UPDATE_WALLET', wallet)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
