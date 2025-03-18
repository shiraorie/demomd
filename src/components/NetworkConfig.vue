<template>
  <div class="network-config">
    <!-- HQ-RTR Config -->
    <div class="config-section">
      <h3 class="section-title">HQ-RTR (Головной офис - Маршрутизатор)</h3>
      <div class="config-grid">
        <div class="config-item">
          <label for="hqRtr-hostname">Имя хоста</label>
          <input id="hqRtr-hostname" type="text" v-model="localConfig.hqRtr.hostname" @input="updateConfig">
        </div>
        <div class="config-item">
          <label for="hqRtr-ens18-ip">ENS18 IP</label>
          <input id="hqRtr-ens18-ip" type="text" v-model="localConfig.hqRtr.ens18.ip" @input="updateConfig">
        </div>
        <div class="config-item">
          <label for="hqRtr-ens18-netmask">ENS18 Маска</label>
          <input id="hqRtr-ens18-netmask" type="text" v-model="localConfig.hqRtr.ens18.netmask" @input="updateConfig">
        </div>
        <div class="config-item">
          <label for="hqRtr-ens18-network">ENS18 Сеть</label>
          <input id="hqRtr-ens18-network" type="text" v-model="localConfig.hqRtr.ens18.network" @input="updateConfig">
        </div>
        <div class="config-item">
          <label for="hqRtr-ens19-ip">ENS19 IP</label>
          <input id="hqRtr-ens19-ip" type="text" v-model="localConfig.hqRtr.ens19.ip" @input="updateConfig">
        </div>
        <div class="config-item">
          <label for="hqRtr-ens19-netmask">ENS19 Маска</label>
          <input id="hqRtr-ens19-netmask" type="text" v-model="localConfig.hqRtr.ens19.netmask" @input="updateConfig">
        </div>
        <div class="config-item">
          <label for="hqRtr-ens19-network">ENS19 Сеть</label>
          <input id="hqRtr-ens19-network" type="text" v-model="localConfig.hqRtr.ens19.network" @input="updateConfig">
        </div>
        <div class="config-item">
          <label for="hqRtr-gateway">Gateway</label>
          <input id="hqRtr-gateway" type="text" v-model="localConfig.hqRtr.gateway" @input="updateConfig">
        </div>
        <div class="config-item">
          <label for="hqRtr-tun0-ip">TUN0 IP</label>
          <input id="hqRtr-tun0-ip" type="text" v-model="localConfig.hqRtr.tun0.ip" @input="updateConfig">
        </div>
        <div class="config-item">
          <label for="hqRtr-dhcp">Установить ISC-DHCP</label>
          <input type="checkbox" id="hqRtr-dhcp" v-model="localConfig.hqRtr.packages.iscDhcp" @change="updateConfig">
        </div>
        <div class="config-item">
          <label for="hqRtr-frr">Установить FRR</label>
          <input type="checkbox" id="hqRtr-frr" v-model="localConfig.hqRtr.packages.frr" @change="updateConfig">
        </div>
        <div class="config-item">
          <label for="hqRtr-nftables">Установить nftables</label>
          <input type="checkbox" id="hqRtr-nftables" v-model="localConfig.hqRtr.packages.nftables" @change="updateConfig">
        </div>
        <div class="config-item">
          <label for="hqRtr-chrony">Установить Chrony (сервер)</label>
          <input type="checkbox" id="hqRtr-chrony" v-model="localConfig.hqRtr.packages.chrony" @change="updateConfig">
        </div>
      </div>
    </div>

    <!-- BR-RTR Config -->
    <div class="config-section">
      <h3 class="section-title">BR-RTR (Филиал - Маршрутизатор)</h3>
      <div class="config-grid">
        <div class="config-item">
          <label for="brRtr-hostname">Имя хоста</label>
          <input id="brRtr-hostname" type="text" v-model="localConfig.brRtr.hostname" @input="updateConfig">
        </div>
        <div class="config-item">
          <label for="brRtr-ens18-ip">ENS18 IP</label>
          <input id="brRtr-ens18-ip" type="text" v-model="localConfig.brRtr.ens18.ip" @input="updateConfig">
        </div>
        <div class="config-item">
          <label for="brRtr-ens18-netmask">ENS18 Маска</label>
          <input id="brRtr-ens18-netmask" type="text" v-model="localConfig.brRtr.ens18.netmask" @input="updateConfig">
        </div>
        <div class="config-item">
          <label for="brRtr-ens18-network">ENS18 Сеть</label>
          <input id="brRtr-ens18-network" type="text" v-model="localConfig.brRtr.ens18.network" @input="updateConfig">
        </div>
        <div class="config-item">
          <label for="brRtr-ens19-ip">ENS19 IP</label>
          <input id="brRtr-ens19-ip" type="text" v-model="localConfig.brRtr.ens19.ip" @input="updateConfig">
        </div>
        <div class="config-item">
          <label for="brRtr-ens19-netmask">ENS19 Маска</label>
          <input id="brRtr-ens19-netmask" type="text" v-model="localConfig.brRtr.ens19.netmask" @input="updateConfig">
        </div>
        <div class="config-item">
          <label for="brRtr-ens19-network">ENS19 Сеть</label>
          <input id="brRtr-ens19-network" type="text" v-model="localConfig.brRtr.ens19.network" @input="updateConfig">
        </div>
        <div class="config-item">
          <label for="brRtr-gateway">Gateway</label>
          <input id="brRtr-gateway" type="text" v-model="localConfig.brRtr.gateway" @input="updateConfig">
        </div>
        <div class="config-item">
          <label for="brRtr-tun0-ip">TUN0 IP</label>
          <input id="brRtr-tun0-ip" type="text" v-model="localConfig.brRtr.tun0.ip" @input="updateConfig">
        </div>
        <div class="config-item">
          <label for="brRtr-dhcp">Установить ISC-DHCP</label>
          <input type="checkbox" id="brRtr-dhcp" v-model="localConfig.brRtr.packages.iscDhcp" @change="updateConfig">
        </div>
        <div class="config-item">
          <label for="brRtr-chrony">Установить Chrony (клиент)</label>
          <input type="checkbox" id="brRtr-chrony" v-model="localConfig.brRtr.packages.chrony" @change="updateConfig">
        </div>
      </div>
    </div>

    <!-- HQ-SRV и BR-SRV Config -->
    <div class="config-row">
      <div class="config-section">
        <h3 class="section-title">HQ-SRV (Головной офис - Сервер)</h3>
        <div class="config-grid">
          <div class="config-item">
            <label for="hqSrv-hostname">Имя хоста</label>
            <input id="hqSrv-hostname" type="text" v-model="localConfig.hqSrv.hostname" @input="updateConfig">
          </div>
          <div class="config-item">
            <label for="hqSrv-ip">IP адрес</label>
            <input id="hqSrv-ip" type="text" v-model="localConfig.hqSrv.ip" @input="updateConfig">
          </div>
          <div class="config-item">
            <label for="hqSrv-netmask">Маска сети</label>
            <input id="hqSrv-netmask" type="text" v-model="localConfig.hqSrv.netmask" @input="updateConfig">
          </div>
          <div class="config-item">
            <label for="hqSrv-gateway">Gateway</label>
            <input id="hqSrv-gateway" type="text" v-model="localConfig.hqSrv.gateway" @input="updateConfig">
          </div>
          <div class="config-item">
            <label for="hqSrv-dnsmasq">Установить DNSMASQ</label>
            <input type="checkbox" id="hqSrv-dnsmasq" v-model="localConfig.hqSrv.packages.dnsmasq" @change="updateConfig">
          </div>
          <div class="config-item">
            <label for="hqSrv-chrony">Установить Chrony (клиент)</label>
            <input type="checkbox" id="hqSrv-chrony" v-model="localConfig.hqSrv.packages.chrony" @change="updateConfig">
          </div>
        </div>
      </div>

      <div class="config-section">
        <h3 class="section-title">BR-SRV (Филиал - Сервер)</h3>
        <div class="config-grid">
          <div class="config-item">
            <label for="brSrv-hostname">Имя хоста</label>
            <input id="brSrv-hostname" type="text" v-model="localConfig.brSrv.hostname" @input="updateConfig">
          </div>
          <div class="config-item">
            <label for="brSrv-ip">IP адрес</label>
            <input id="brSrv-ip" type="text" v-model="localConfig.brSrv.ip" @input="updateConfig">
          </div>
          <div class="config-item">
            <label for="brSrv-netmask">Маска сети</label>
            <input id="brSrv-netmask" type="text" v-model="localConfig.brSrv.netmask" @input="updateConfig">
          </div>
          <div class="config-item">
            <label for="brSrv-gateway">Gateway</label>
            <input id="brSrv-gateway" type="text" v-model="localConfig.brSrv.gateway" @input="updateConfig">
          </div>
          <div class="config-item">
            <label for="brSrv-dnsmasq">Установить DNSMASQ</label>
            <input type="checkbox" id="brSrv-dnsmasq" v-model="localConfig.brSrv.packages.dnsmasq" @change="updateConfig">
          </div>
          <div class="config-item">
            <label for="brSrv-chrony">Установить Chrony (клиент)</label>
            <input type="checkbox" id="brSrv-chrony" v-model="localConfig.brSrv.packages.chrony" @change="updateConfig">
          </div>
        </div>
      </div>
    </div>

    <!-- HQ-CLI и Домен -->
    <div class="config-row">
      <div class="config-section">
        <h3 class="section-title">HQ-CLI (Клиентская сеть)</h3>
        <div class="config-grid">
          <div class="config-item">
            <label for="hqCli-network">Сеть</label>
            <input id="hqCli-network" type="text" v-model="localConfig.hqCli.network" @input="updateConfig">
          </div>
          <div class="config-item">
            <label for="hqCli-dhcpRange">Диапазон DHCP</label>
            <input id="hqCli-dhcpRange" type="text" v-model="localConfig.hqCli.dhcpRange" @input="updateConfig">
          </div>
          <div class="config-item">
            <label for="hqCli-admc">Установить admc</label>
            <input type="checkbox" id="hqCli-admc" v-model="localConfig.hqCli.packages.admc" @change="updateConfig">
          </div>
          <div class="config-item">
            <label for="hqCli-yandexBrowser">Установить Yandex Browser</label>
            <input type="checkbox" id="hqCli-yandexBrowser" v-model="localConfig.hqCli.packages.yandexBrowserStable" @change="updateConfig">
          </div>
        </div>
      </div>

      <div class="config-section">
        <h3 class="section-title">Домен и DNS</h3>
        <div class="config-grid">
          <div class="config-item">
            <label for="domain-name">Имя домена</label>
            <input id="domain-name" type="text" v-model="localConfig.domain.name" @input="updateConfig">
          </div>
          <div class="config-item">
            <label for="domain-dns">DNS сервер</label>
            <input id="domain-dns" type="text" v-model="localConfig.domain.dns" @input="updateConfig">
          </div>
        </div>
      </div>
    </div>

    <!-- Учетные записи -->
    <div class="config-section">
      <h3 class="section-title">Учетные записи</h3>
      <div class="config-grid">
        <div class="config-item">
          <label for="sshUser-username">SSH пользователь</label>
          <input id="sshUser-username" type="text" v-model="localConfig.accounts.sshUser.username">
        </div>
        <div class="config-item">
          <label for="sshUser-password">SSH пароль</label>
          <input id="sshUser-password" type="password" v-model="localConfig.accounts.sshUser.password">
        </div>
        <div class="config-item">
          <label for="netAdmin-username">NetAdmin пользователь</label>
          <input id="netAdmin-username" type="text" v-model="localConfig.accounts.netAdmin.username">
        </div>
        <div class="config-item">
          <label for="netAdmin-password">NetAdmin пароль</label>
          <input id="netAdmin-password" type="password" v-model="localConfig.accounts.netAdmin.password">
        </div>
      </div>
    </div>

    <div class="config-actions">
      <button class="button primary" @click="updateConfig">Применить конфигурацию</button>
      <button class="button secondary" @click="resetConfig">Сбросить</button>
    </div>
  </div>
</template>

<script>
import { useNetworkConfigStore } from '../store/NetworkConfig';

export default {
  name: 'NetworkConfig',
  setup() {
    const store = useNetworkConfigStore();
    const localConfig = store.config;

    // Загрузка данных из localStorage при инициализации
    const loadConfigFromLocalStorage = () => {
      const savedConfig = localStorage.getItem('networkConfig');
      if (savedConfig) {
        const parsedConfig = JSON.parse(savedConfig);
        // Обновляем localConfig с данными из localStorage
        Object.assign(localConfig, parsedConfig);
      }
    };

    const updateConfig = () => {
      store.updateConfig(localConfig);
    };

    const resetConfig = () => {
      store.resetConfig(); // Сбрасываем конфигурацию
      loadConfigFromLocalStorage(); // Загружаем данные после сброса
    };

    // Загружаем данные из localStorage при инициализации
    loadConfigFromLocalStorage();

    return {
      localConfig,
      updateConfig,
      resetConfig
    };
  }
}
</script>

<style lang="sass" scoped>
@import '../assets/css/_variables'

.network-config
  display: flex
  flex-direction: column
  gap: 32px

.config-row
  display: flex
  gap: 24px
  
  @media (max-width: 980px)
    flex-direction: column

.config-section
  flex: 1
  background-color: $color-secondary
  border-radius: $border-radius
  padding: 24px
  
  &:not(:last-child)
    margin-bottom: 16px

.section-title
  font-size: $font-size-large
  font-weight: $font-weight-bold
  color: $txt-white
  margin-top: 0
  margin-bottom: 20px
  padding-bottom: 12px
  border-bottom: 1px solid rgba($txt-white, 0.1)

.config-grid
  display: grid
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr))
  gap: 16px

.config-item
  display: flex
  flex-direction: column
  gap: 6px

.config-actions
  display: flex
  justify-content: flex-end
  margin-top: 16px
  gap: 12px
  
  @media (max-width: 768px)
    flex-direction: column
    
    .button
      width: 100%
</style> 