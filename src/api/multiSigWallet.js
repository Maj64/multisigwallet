import Web3 from 'web3'

const state = {
  name: '',
  tokens: [],
  address: '',
  balance: '0',
  owners: [],
  numConfirmationsRequired: 0,
  transactionCount: 0,
  transactions: [],
  detailTokens: [],
  requestOwners: []
}

const mutations = {
  SET: (state, multiSigWallet) => {
    state = {
      ...state,
      ...multiSigWallet
    }
  },
  UPDATE_BALANCE: (state, multiSigWallet) => {
    state.balance = multiSigWallet.balance
  },
  ADD_TX: (state, multiSigWallet) => {
    const { data: { txIndex, destination, value, data, token }} = multiSigWallet
    const transactions = [
      {
        txIndex: parseInt(txIndex),
        destination,
        value: Web3.utils.toBN(value),
        data,
        executed: false,
        numConfirmations: 0,
        isConfirmedByCurrentAccount: false,
        token: token
      },
      ...state.transactions
    ]
    state.transactionCount = state.transactionCount + 1
    state.transactions = transactions
  },
  UPDATE_TX: (state, multiSigWallet) => {
    const { data } = multiSigWallet
    const txIndex = parseInt(data.txIndex)
    const transactions = state.transactions.map((tx) => {
      if (tx.txIndex === txIndex) {
        const updatedTx = {
          ...tx
        }
        if (data.executed) {
          /*
          Exercise
          Complete the if statement
          Set updatedTx.executed to true
          */
          updatedTx.executed = true
        }
        if (data.confirmed !== undefined) {
          if (data.confirmed) {
            updatedTx.numConfirmations += 1
            updatedTx.isConfirmedByCurrentAccount = data.owner === data.account
          } else {
            updatedTx.numConfirmations -= 1
            if (data.owner === data.account) {
              updatedTx.isConfirmedByCurrentAccount = false
            }
          }
        }
        return updatedTx
      }
      return tx
    })
    state.transactions = transactions
  },
  ADD_OWNER: (state, multiSigWallet) => {
    state.owners = [
      ...state.owners,
      multiSigWallet.address
    ]
  },
  UPDATE_TOKEN_DETAIL: (state, multiSigWallet) => {
    state.detailTokens = multiSigWallet.detailTokens
  },
  ADD_TOKEN: (state, multiSigWallet) => {
    state.detailTokens = [...state.detailTokens, multiSigWallet.token]
  },
  GET_TOKENS: (state, multiSigWallet) => {
    state.tokens = [...multiSigWallet.tokens]
    state.detailTokens = [...multiSigWallet.detailTokens]
  },
  GET_TRANS: (state, action) => {
    state.transactions = action.data.transactions
  },
  GET_OWNERS: (state, action) => {
    state.owners = [...action.data.owners]
    state.requestOwners = [...action.data.requests]
  }
}

const actions = {
  set({ commit }, multiSigWallet) {
    commit('SET', multiSigWallet)
  },
  updateBalance({ commit }, multiSigWallet) {
    commit('UPDATE_BALANCE', multiSigWallet)
  },
  addTx({ commit }, multiSigWallet) {
    commit('ADD_TX', multiSigWallet)
  },
  updateTx({ commit }, multiSigWallet) {
    commit('UPDATE_TX', multiSigWallet)
  },
  addOwner({ commit }, multiSigWallet) {
    commit('ADD_OWNER', multiSigWallet)
  },
  updateTokenDetail({ commit }, multiSigWallet) {
    commit('UPDATE_TOKEN_DETAIL', multiSigWallet)
  },
  addToken({ commit }, multiSigWallet) {
    commit('ADD_TOKEN', multiSigWallet)
  },
  getTokens({ commit }, multiSigWallet) {
    commit('GET_TOKENS', multiSigWallet)
  },
  getTrans({ commit }, multiSigWallet) {
    commit('GET_TRANS', multiSigWallet)
  },
  getOwners({ commit }, multiSigWallet) {
    commit('GET_OWNERS', multiSigWallet)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
