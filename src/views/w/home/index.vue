<template>
  <div class="app-container">
    <div class="app-wrapper app-token">
      <div class="app-header"><h2>Overview</h2></div>
      <div class="app-content">
        <div class="avatar-wrapper">
          <div class="avatar-item avatar-image">
            <img src="" class="user-avatar">
          </div>
          <div class="avatar-item">
            <span class="avatar-item-right">Goerli</span>
          </div>
        </div>
        <div class="wallet-content">
          <div class="wallet-item">{{ wallet.name }}</div>
          <div class="wallet-item wallet-address"><div class="address-label">gor:</div>{{ wallet.address }}</div>
          <div class="wallet-item wallet-address">Balance: {{ wallet.balance }} ETH</div>
        </div>
        <div class="avatar-item">
          <div class="info-btn">
            <button class="btn" @click="handleLink">Token</button>
          </div>
        </div>
        <div class="wallet-info">
          <div class="info-count">
            <div class="title">Tokens</div>
            <div class="number">{{ wallet.tokens.length }}</div>
          </div>
          <div class="info-count">
            <div class="title">Transactions</div>
            <div class="number">{{ wallet.transactionCount }}</div>
          </div>
          <div class="info-count">
            <div class="title">Owners</div>
            <div class="number">{{ wallet.owners.length }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Home',
  computed: {
    ...mapGetters([
      'walletID',
      'wallet'
    ])
  },
  methods: {
    handleLink() {
      this.$router.push(`/${this.walletID}/token`)
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  display: flex;
  gap: 10px;
  justify-content: space-between;
  .app-wrapper {
    flex: 0.5;
    min-height: 320px;
    .app-header {
      display: flex;
      flex-direction: column;
      margin: 0px 0px 16px;
      font-family: "DM Sans", sans-serif;
      font-size: 16px;
      line-height: 0;
      font-weight: 700;
      color: rgb(255, 255, 255);
    }
    .app-content {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 8px;
      background-color: #1c1c1c;
      color: rgb(255, 255, 255);
      padding: 24px;
      border-radius: 6px;
      -webkit-box-flex: 1;
      flex-grow: 1;
      position: relative;
      box-sizing: border-box;
      height: 100%;
      overflow: hidden;
      .avatar-wrapper {
        display: flex;
        justify-content: space-between;
        .avatar-image {
          width: 40px;
          height: 40px;
        }
        .avatar-item-right {
          background-color: rgb(77, 153, 235);
          color: rgb(255, 255, 255);
          display: inline-block;
          min-width: 70px;
          font-size: 11px;
          line-height: normal;
          text-align: center;
          border-radius: 4px;
          padding: 4px 8px;
        }
      }
      .wallet-content {
        display: flex;
        flex-direction: column;
        gap: 6px;
        margin-bottom: 32px;
        .wallet-item {
          font-size: 40px;
          font-weight: bold;
          padding-bottom: 2%;
        }
        .wallet-address {
          font-size: 16px;
          display: flex;
          gap: 2px;
          .address-label {
            font-weight: 600;
          }
        }
      }
      .wallet-info {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        .info-count {
          flex-basis: 25%;
          text-align: center;
          .title {
            font-size: 14px;
            line-height: 20px;
            font-family: "DM Sans", sans-serif;
            font-weight: 400;
            color: rgb(99, 102, 105);
          }
          .number {
            margin: 8px 0px 0px;
            line-height: 22px;
            font-family: "DM Sans", sans-serif;
            font-size: 31px;
            font-weight: bold;
          }
        }
        .info-btn {
          flex-basis: 25%;
          display: flex;
          height: 100%;
          align-items: flex-end;
          -webkit-box-pack: end;
          justify-content: flex-end;
        }
      }
    }
  }

  .app-token {
    display: flex;
    gap: 8px;
    flex-direction: column;
  }
  .btn {
    display: inline-flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
    position: relative;
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
    outline: 0px;
    border: 0px rgb(18, 255, 128);
    margin: 0px;
    cursor: pointer;
    user-select: none;
    vertical-align: middle;
    appearance: none;
    text-decoration: none;
    font-family: "DM Sans", sans-serif;
    min-width: 64px;
    transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    color: rgba(0, 0, 0, 0.87);
    background-color: rgb(18, 255, 128);
    box-shadow: rgb(161 163 167) 0px 0px 2px;
    border-radius: 6px;
    font-weight: bold;
    line-height: 1.25;
    text-transform: none;
    font-size: 16px;
    padding: 12px 24px;
    &:hover {
      text-decoration: none;
      background-color: rgb(12, 178, 89);
      box-shadow: none;
    }
  }
}
</style>
