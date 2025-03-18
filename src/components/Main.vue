<template>
  <div class="container">
    <div class="header">
      <h1 class="title">Настройка сетевой инфраструктуры</h1>
      <div class="header-actions">
        <button class="button primary" @click="saveConfig">Сохранить настройки</button>
        <button class="button secondary" @click="resetToDefaults">Сбросить до базовых настроек</button>
        <button class="button danger" @click="clearLocalStorage">Очистить локальное хранилище</button>
      </div>
    </div>
    
    <div class="card config-panel">
      <h2 class="config-title">Настройки конфигурации</h2>
      <NetworkConfig :config="config" @update:config="updateConfig" />
    </div>
    
    <div class="content">
      <div class="card markdown-panel">
        <div class="panel-header">
          <h2>Документация</h2>
          <div class="tabs">
            <button class="tab active active-element">README.md</button>
            <button class="tab">Установка</button>
            <button class="tab">Конфигурация</button>
          </div>
        </div>
        <MarkdownViewer :markdown="markdownContent" :config="config" />
      </div>
    </div>
  </div>
</template>

<script>
import { useNetworkConfigStore } from '../store/NetworkConfig';
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
    const store = useNetworkConfigStore();
    const markdownContent = ref('')
    
    const updateConfig = (newConfig) => {
      store.updateConfig(newConfig);
    }
    
    const replaceVariables = (content) => {
      let result = content;
      for (const key in store.config.hqRtr) {
        result = result.replace(new RegExp(`{{hqRtr.${key}}}`, 'g'), store.config.hqRtr[key]);
      }
      return result;
    }
    
    const saveConfig = () => {
      localStorage.setItem('networkConfig', JSON.stringify(store.config));
      alert('Настройки сохранены в локальном хранилище.');
    }

    const resetToDefaults = () => {
      store.resetConfig();
      alert('Настройки сброшены до базовых значений.');
    }

    const clearLocalStorage = () => {
      localStorage.removeItem('networkConfig');
      alert('Локальное хранилище очищено.');
    }

    onMounted(async () => {
      // Загрузка настроек из локального хранилища
      const savedConfig = localStorage.getItem('networkConfig');
      if (savedConfig) {
        store.updateConfig(JSON.parse(savedConfig));
      }

      try {
        // Загрузка markdown-файла
        let content = await MarkdownService.loadMarkdown('/read.md');
        markdownContent.value = replaceVariables(content);
      } catch (error) {
        console.error('Ошибка при загрузке markdown-файла:', error)
      }
    })
    
    return {
      markdownContent,
      config: store.config,
      updateConfig,
      saveConfig,
      resetToDefaults,
      clearLocalStorage
    }
  }
}
</script>

<style lang="sass" scoped>
@import '../assets/css/_variables'

// Дополнительные стили для Main.vue
.header
  display: flex
  justify-content: space-between
  align-items: center
  margin-bottom: 24px
  flex-wrap: wrap
  gap: 16px

  @media (max-width: 768px)
    flex-direction: column
    align-items: flex-start

.title
  margin-top: 0
  margin-bottom: 0

.header-actions
  display: flex
  gap: 12px
  
  @media (max-width: 768px)
    width: 100%
    justify-content: space-between

.config-panel
  margin-bottom: 32px

.config-title
  margin-top: 0
  padding-bottom: 16px
  border-bottom: 1px solid rgba(255, 255, 255, 0.1)

.content
  margin-top: 32px

.markdown-panel
  padding: 0
  overflow: hidden

.panel-header
  display: flex
  justify-content: space-between
  align-items: center
  padding: 16px 24px
  background-color: $color-secondary
  border-bottom: 1px solid rgba(255, 255, 255, 0.1)
  
  h2
    margin: 0
    padding: 0
    border: none
  
  @media (max-width: 768px)
    flex-direction: column
    align-items: flex-start
    gap: 12px

.tabs
  display: flex
  gap: 8px
  
  @media (max-width: 768px)
    width: 100%
    overflow-x: auto
    padding-bottom: 8px

.tab
  padding: 8px 16px
  background-color: transparent
  border: none
  color: $txt-gray
  font-size: $font-size-medium
  font-weight: $font-weight-medium
  cursor: pointer
  transition: color 0.2s ease
  
  &:hover
    color: $txt-white
  
  &.active
    color: #3B82F6
    position: relative
    
    &::after
      content: ''
      position: absolute
      bottom: -17px
      left: 0
      width: 100%
      height: 2px
      background-color: #3B82F6
</style>

