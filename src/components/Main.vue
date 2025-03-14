<template>
  <div class="tw-main">
    <div class="tw-header">
      <h1 class="tw-title">Настройка сетевой инфраструктуры</h1>
      <div class="tw-header-actions">
        <button class="tw-button">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Скачать конфигурацию
        </button>
        <button class="tw-button secondary">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
          Редактировать
        </button>
      </div>
    </div>
    
    <div class="tw-config-panel">
      <h2 class="tw-config-title">Настройки конфигурации</h2>
      <NetworkConfig :config="config" @update:config="updateConfig" />
    </div>
    
    <div class="tw-content">
      <div class="tw-markdown-panel">
        <div class="tw-panel-header">
          <h2>Документация</h2>
          <div class="tw-tabs">
            <button class="tw-tab active">README.md</button>
            <button class="tw-tab">Установка</button>
            <button class="tw-tab">Конфигурация</button>
          </div>
        </div>
        <MarkdownViewer :markdown="markdownContent" :config="config" />
      </div>
    </div>
  </div>
</template>

<script>
import NetworkConfig from './NetworkConfig.vue'
import MarkdownViewer from './MarkdownViewer.vue'
import MarkdownService from '../services/MarkdownService'
import { ref, onMounted } from 'vue'

export default {
  name: 'Main',
  components: {
    NetworkConfig,
    MarkdownViewer
  },
  setup() {
    const markdownContent = ref('')
    const defaultConfig = ref({
      hqRtr: {
        ens18: '172.16.4.2/28',
        ens19: '192.168.100.1/26',
        tun0: '172.16.100.1',
        gateway: '172.16.4.1'
      },
      brRtr: {
        ens18: '172.16.5.2/28',
        ens19: '192.168.200.1/27',
        tun0: '172.16.100.2',
        gateway: '172.16.5.1'
      },
      hqSrv: {
        ip: '192.168.100.2/26',
        gateway: '192.168.100.1'
      },
      brSrv: {
        ip: '192.168.200.2/27',
        gateway: '192.168.200.1'
      },
      hqCli: {
        network: '192.168.10.0/24',
        dhcpRange: '192.168.10.2-192.168.10.254'
      },
      accounts: {
        password: 'P@ssw0rd',
        sshUser: 'sshuser',
        netAdmin: 'net_admin'
      },
      domain: {
        name: 'au-team.irpo',
        dns: '192.168.100.2'
      },
      moodle: {
        dbName: 'moodle',
        dbUser: 'moodle',
        dbPassword: 'P@ssw0rd'
      }
    })
    
    const config = ref({ ...defaultConfig.value })
    
    const updateConfig = (newConfig) => {
      config.value = { ...newConfig }
    }
    
    onMounted(async () => {
      try {
        // Загрузка markdown-файла
        markdownContent.value = await MarkdownService.loadMarkdown('/read.md')
      } catch (error) {
        console.error('Ошибка при загрузке markdown-файла:', error)
      }
    })
    
    return {
      markdownContent,
      defaultConfig,
      config,
      updateConfig
    }
  }
}
</script>

<style lang="scss" scoped>
// TailwindCSS цвета и переменные
$tw-bg-dark: #0f172a;
$tw-bg-light: #1e293b;
$tw-bg-input: #0f172a;
$tw-text-light: #f8fafc;
$tw-text-muted: #94a3b8;
$tw-blue-accent: #3b82f6;
$tw-blue-light: #60a5fa;
$tw-blue-dark: #2563eb;
$tw-border-color: #334155;
$tw-hover-color: #1e40af;
$tw-radius: 6px;
$tw-font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;

.tw-main {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.tw-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.tw-title {
  font-size: 28px;
  font-weight: 700;
  color: $tw-text-light;
  margin: 0;
}

.tw-header-actions {
  display: flex;
  gap: 12px;
}

.tw-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: $tw-blue-accent;
  color: white;
  border: none;
  padding: 8px 16px;
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
  
  svg {
    width: 16px;
    height: 16px;
  }
}

.tw-config-panel {
  background-color: $tw-bg-light;
  border: 1px solid $tw-border-color;
  border-radius: $tw-radius;
  padding: 24px;
  margin-bottom: 32px;
}

.tw-config-title {
  font-size: 18px;
  font-weight: 600;
  color: $tw-text-light;
  margin-top: 0;
  margin-bottom: 24px;
}

.tw-content {
  display: flex;
  flex-direction: column;
}

.tw-markdown-panel {
  width: 100%;
  border: 1px solid $tw-border-color;
  border-radius: $tw-radius;
  overflow: hidden;
}

.tw-panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background-color: $tw-bg-light;
  border-bottom: 1px solid $tw-border-color;
  
  h2 {
    font-size: 18px;
    font-weight: 600;
    color: $tw-text-light;
    margin: 0;
  }
}

.tw-tabs {
  display: flex;
  gap: 4px;
}

.tw-tab {
  padding: 8px 16px;
  background-color: transparent;
  border: none;
  color: $tw-text-muted;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.15s ease;
  
  &:hover {
    color: $tw-text-light;
  }
  
  &.active {
    color: $tw-blue-light;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -17px;
      left: 0;
      width: 100%;
      height: 2px;
      background-color: $tw-blue-accent;
    }
  }
}

// Медиа-запросы
@media (max-width: 768px) {
  .tw-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .tw-header-actions {
    width: 100%;
    justify-content: space-between;
  }
  
  .tw-panel-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .tw-tabs {
    width: 100%;
    overflow-x: auto;
    padding-bottom: 8px;
  }
}
</style>

