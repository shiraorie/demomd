<template>
  <div class="tw-network-config">
    <!-- HQ-RTR Config -->
    <div class="tw-config-section">
      <h3 class="tw-section-title">HQ-RTR (Головной офис - Маршрутизатор)</h3>
      <div class="tw-config-grid">
        <div class="tw-config-item">
          <label for="hqRtr-hostname">Имя хоста</label>
          <input id="hqRtr-hostname" type="text" v-model="localConfig.hqRtr.hostname">
        </div>
        <div class="tw-config-item">
          <label for="hqRtr-ens18-ip">ENS18 IP</label>
          <input id="hqRtr-ens18-ip" type="text" v-model="localConfig.hqRtr.ens18.ip">
        </div>
        <div class="tw-config-item">
          <label for="hqRtr-ens18-netmask">ENS18 Маска</label>
          <input id="hqRtr-ens18-netmask" type="text" v-model="localConfig.hqRtr.ens18.netmask">
        </div>
        <div class="tw-config-item">
          <label for="hqRtr-ens18-network">ENS18 Сеть</label>
          <input id="hqRtr-ens18-network" type="text" v-model="localConfig.hqRtr.ens18.network">
        </div>
        <div class="tw-config-item">
          <label for="hqRtr-ens19-ip">ENS19 IP</label>
          <input id="hqRtr-ens19-ip" type="text" v-model="localConfig.hqRtr.ens19.ip">
        </div>
        <div class="tw-config-item">
          <label for="hqRtr-ens19-netmask">ENS19 Маска</label>
          <input id="hqRtr-ens19-netmask" type="text" v-model="localConfig.hqRtr.ens19.netmask">
        </div>
        <div class="tw-config-item">
          <label for="hqRtr-ens19-network">ENS19 Сеть</label>
          <input id="hqRtr-ens19-network" type="text" v-model="localConfig.hqRtr.ens19.network">
        </div>
        <div class="tw-config-item">
          <label for="hqRtr-gateway">Gateway</label>
          <input id="hqRtr-gateway" type="text" v-model="localConfig.hqRtr.gateway">
        </div>
        <div class="tw-config-item">
          <label for="hqRtr-tun0-ip">TUN0 IP</label>
          <input id="hqRtr-tun0-ip" type="text" v-model="localConfig.hqRtr.tun0.ip">
        </div>
      </div>
    </div>

    <!-- BR-RTR Config -->
    <div class="tw-config-section">
      <h3 class="tw-section-title">BR-RTR (Филиал - Маршрутизатор)</h3>
      <div class="tw-config-grid">
        <div class="tw-config-item">
          <label for="brRtr-hostname">Имя хоста</label>
          <input id="brRtr-hostname" type="text" v-model="localConfig.brRtr.hostname">
        </div>
        <div class="tw-config-item">
          <label for="brRtr-ens18-ip">ENS18 IP</label>
          <input id="brRtr-ens18-ip" type="text" v-model="localConfig.brRtr.ens18.ip">
        </div>
        <div class="tw-config-item">
          <label for="brRtr-ens18-netmask">ENS18 Маска</label>
          <input id="brRtr-ens18-netmask" type="text" v-model="localConfig.brRtr.ens18.netmask">
        </div>
        <div class="tw-config-item">
          <label for="brRtr-ens18-network">ENS18 Сеть</label>
          <input id="brRtr-ens18-network" type="text" v-model="localConfig.brRtr.ens18.network">
        </div>
        <div class="tw-config-item">
          <label for="brRtr-ens19-ip">ENS19 IP</label>
          <input id="brRtr-ens19-ip" type="text" v-model="localConfig.brRtr.ens19.ip">
        </div>
        <div class="tw-config-item">
          <label for="brRtr-ens19-netmask">ENS19 Маска</label>
          <input id="brRtr-ens19-netmask" type="text" v-model="localConfig.brRtr.ens19.netmask">
        </div>
        <div class="tw-config-item">
          <label for="brRtr-ens19-network">ENS19 Сеть</label>
          <input id="brRtr-ens19-network" type="text" v-model="localConfig.brRtr.ens19.network">
        </div>
        <div class="tw-config-item">
          <label for="brRtr-gateway">Gateway</label>
          <input id="brRtr-gateway" type="text" v-model="localConfig.brRtr.gateway">
        </div>
        <div class="tw-config-item">
          <label for="brRtr-tun0-ip">TUN0 IP</label>
          <input id="brRtr-tun0-ip" type="text" v-model="localConfig.brRtr.tun0.ip">
        </div>
      </div>
    </div>

    <!-- HQ-SRV и BR-SRV Config -->
    <div class="tw-config-row">
      <div class="tw-config-section">
        <h3 class="tw-section-title">HQ-SRV (Головной офис - Сервер)</h3>
        <div class="tw-config-grid">
          <div class="tw-config-item">
            <label for="hqSrv-hostname">Имя хоста</label>
            <input id="hqSrv-hostname" type="text" v-model="localConfig.hqSrv.hostname">
          </div>
          <div class="tw-config-item">
            <label for="hqSrv-ip">IP адрес</label>
            <input id="hqSrv-ip" type="text" v-model="localConfig.hqSrv.ip">
          </div>
          <div class="tw-config-item">
            <label for="hqSrv-netmask">Маска сети</label>
            <input id="hqSrv-netmask" type="text" v-model="localConfig.hqSrv.netmask">
          </div>
          <div class="tw-config-item">
            <label for="hqSrv-gateway">Gateway</label>
            <input id="hqSrv-gateway" type="text" v-model="localConfig.hqSrv.gateway">
          </div>
        </div>
      </div>

      <div class="tw-config-section">
        <h3 class="tw-section-title">BR-SRV (Филиал - Сервер)</h3>
        <div class="tw-config-grid">
          <div class="tw-config-item">
            <label for="brSrv-hostname">Имя хоста</label>
            <input id="brSrv-hostname" type="text" v-model="localConfig.brSrv.hostname">
          </div>
          <div class="tw-config-item">
            <label for="brSrv-ip">IP адрес</label>
            <input id="brSrv-ip" type="text" v-model="localConfig.brSrv.ip">
          </div>
          <div class="tw-config-item">
            <label for="brSrv-netmask">Маска сети</label>
            <input id="brSrv-netmask" type="text" v-model="localConfig.brSrv.netmask">
          </div>
          <div class="tw-config-item">
            <label for="brSrv-gateway">Gateway</label>
            <input id="brSrv-gateway" type="text" v-model="localConfig.brSrv.gateway">
          </div>
        </div>
      </div>
    </div>

    <!-- HQ-CLI и Домен -->
    <div class="tw-config-row">
      <div class="tw-config-section">
        <h3 class="tw-section-title">HQ-CLI (Клиентская сеть)</h3>
        <div class="tw-config-grid">
          <div class="tw-config-item">
            <label for="hqCli-network">Сеть</label>
            <input id="hqCli-network" type="text" v-model="localConfig.hqCli.network">
          </div>
          <div class="tw-config-item">
            <label for="hqCli-dhcpRange">Диапазон DHCP</label>
            <input id="hqCli-dhcpRange" type="text" v-model="localConfig.hqCli.dhcpRange">
          </div>
        </div>
      </div>

      <div class="tw-config-section">
        <h3 class="tw-section-title">Домен и DNS</h3>
        <div class="tw-config-grid">
          <div class="tw-config-item">
            <label for="domain-name">Имя домена</label>
            <input id="domain-name" type="text" v-model="localConfig.domain.name">
          </div>
          <div class="tw-config-item">
            <label for="domain-dns">DNS сервер</label>
            <input id="domain-dns" type="text" v-model="localConfig.domain.dns">
          </div>
        </div>
      </div>
    </div>

    <!-- Учетные записи -->
    <div class="tw-config-section">
      <h3 class="tw-section-title">Учетные записи</h3>
      <div class="tw-config-grid">
        <div class="tw-config-item">
          <label for="sshUser-username">SSH пользователь</label>
          <input id="sshUser-username" type="text" v-model="localConfig.accounts.sshUser.username">
        </div>
        <div class="tw-config-item">
          <label for="sshUser-password">SSH пароль</label>
          <input id="sshUser-password" type="password" v-model="localConfig.accounts.sshUser.password">
        </div>
        <div class="tw-config-item">
          <label for="netAdmin-username">NetAdmin пользователь</label>
          <input id="netAdmin-username" type="text" v-model="localConfig.accounts.netAdmin.username">
        </div>
        <div class="tw-config-item">
          <label for="netAdmin-password">NetAdmin пароль</label>
          <input id="netAdmin-password" type="password" v-model="localConfig.accounts.netAdmin.password">
        </div>
      </div>
    </div>

    <div class="tw-config-actions">
      <button class="tw-config-button" @click="updateConfig">Применить конфигурацию</button>
      <button class="tw-config-button secondary" @click="resetConfig">Сбросить</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NetworkConfig',
  props: {
    config: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      localConfig: JSON.parse(JSON.stringify(this.config))
    }
  },
  watch: {
    config: {
      handler(newVal) {
        this.localConfig = JSON.parse(JSON.stringify(newVal))
      },
      deep: true
    }
  },
  methods: {
    updateConfig() {
      this.$emit('update:config', this.localConfig)
    },
    resetConfig() {
      this.localConfig = JSON.parse(JSON.stringify(this.config))
    }
  }
}
</script>

<style lang="scss" scoped>
// TailwindCSS цвета и переменные
$tw-bg-dark: #0f172a;
$tw-bg-light: #1e293b;
$tw-bg-input: #1e293b;
$tw-text-light: #f8fafc;
$tw-text-muted: #94a3b8;
$tw-blue-accent: #3b82f6;
$tw-blue-light: #60a5fa;
$tw-blue-dark: #2563eb;
$tw-border-color: #334155;
$tw-hover-color: #1e40af;
$tw-radius: 6px;
$tw-font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;

.tw-network-config {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.tw-config-row {
  display: flex;
  gap: 24px;
  
  @media (max-width: 980px) {
    flex-direction: column;
  }
}

.tw-config-section {
  flex: 1;
  background-color: rgba(30, 41, 59, 0.4);
  border-radius: $tw-radius;
  padding: 24px;
  
  &:not(:last-child) {
    margin-bottom: 16px;
  }
}

.tw-section-title {
  font-size: 16px;
  font-weight: 600;
  color: $tw-text-light;
  margin-top: 0;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid $tw-border-color;
}

.tw-config-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.tw-config-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
  
  label {
    font-size: 13px;
    font-weight: 500;
    color: $tw-text-muted;
  }
  
  input {
    padding: 8px 12px;
    background-color: $tw-bg-input;
    border: 1px solid $tw-border-color;
    border-radius: $tw-radius;
    color: $tw-text-light;
    font-size: 14px;
    
    &:focus {
      outline: none;
      border-color: $tw-blue-accent;
      box-shadow: 0 0 0 1px $tw-blue-accent;
    }
    
    &::placeholder {
      color: $tw-text-muted;
    }
  }
}

.tw-config-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  gap: 12px;
}

.tw-config-button {
  padding: 10px 16px;
  background-color: $tw-blue-accent;
  color: white;
  border: none;
  border-radius: $tw-radius;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.15s ease;
  
  &:hover {
    background-color: $tw-hover-color;
  }
  
  &.secondary {
    background-color: transparent;
    border: 1px solid $tw-border-color;
    color: $tw-text-light;
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
      border-color: $tw-text-light;
    }
  }
}

@media (max-width: 768px) {
  .tw-config-grid {
    grid-template-columns: 1fr;
  }
  
  .tw-config-actions {
    flex-direction: column;
    
    .tw-config-button {
      width: 100%;
    }
  }
}
</style> 