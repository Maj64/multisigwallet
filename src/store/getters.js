const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  displaySidebar: state => state.app.displaySidebar,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs,
  walletID: state => state.app.walletID,
  account: state => state.web3.account,
  balance: state => state.web3.balance,
  web3: state => state.web3.web3,
  netId: state => state.web3.netId,
  wallets: state => state.wallet.wallets,
  wallet: state => state.wallet.wallet,
  profile: state => state.user.profile
}
export default getters
