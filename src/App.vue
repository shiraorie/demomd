<template>
  <div class="tw-app">
    <header class="tw-app-header">
      <div class="tw-container">
        <div class="tw-logo">
          <span class="tw-logo-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
          </span>
          <h1>Network Config</h1>
        </div>
        <nav class="tw-navigation">
          <a href="#" class="tw-nav-link active">Главная</a>
          <a href="#" class="tw-nav-link">Документация</a>
          <a href="#" class="tw-nav-link">О проекте</a>
        </nav>
      </div>
    </header>
    <main class="tw-app-main">
      <div class="tw-container">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>
    <footer class="tw-app-footer">
      <div class="tw-container">
        <div class="tw-footer-links">
          <a href="#">© 2023 Network Config</a>
          <a href="#">Условия использования</a>
          <a href="#">Конфиденциальность</a>
          <a href="#">Контакты</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import Main from './components/Main.vue'

export default {
  name: 'App',
  components: {
    Main
  }
}
</script>

<style lang="scss">
// Переменные в стиле TailwindCSS.com
$tw-bg-dark: #0f172a;
$tw-bg-light: #1e293b;
$tw-text-light: #f8fafc;
$tw-text-muted: #94a3b8;
$tw-blue-accent: #3b82f6;
$tw-blue-light: #60a5fa;
$tw-border-color: #334155;
$tw-border-focus: #60a5fa;
$tw-radius: 6px;
$tw-font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;

// Глобальные стили
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  font-family: $tw-font-sans;
  font-size: 16px;
  line-height: 1.5;
  color: $tw-text-light;
  background-color: $tw-bg-dark;
}

// Контейнер для центрирования контента
.tw-container {
  width: 100%;
  overflow: visible;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 16px;
}

// Стили приложения
.tw-app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

// Стили шапки
.tw-app-header {
  background-color: $tw-bg-light;
  border-bottom: 1px solid $tw-border-color;
  padding: 16px 0;
  
  .tw-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

.tw-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  
  h1 {
    font-size: 20px;
    font-weight: 700;
    color: $tw-text-light;
  }
}

.tw-logo-icon {
  color: $tw-blue-accent;
}

.tw-navigation {
  display: flex;
  gap: 24px;
}

.tw-nav-link {
  color: $tw-text-muted;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.15s ease;
  
  &:hover {
    color: $tw-text-light;
  }
  
  &.active {
    color: $tw-blue-light;
  }
}

// Стили основного контента
.tw-app-main {
  flex: 1;
  padding: 32px 0;
}

// Стили подвала
.tw-app-footer {
  background-color: $tw-bg-light;
  border-top: 1px solid $tw-border-color;
  padding: 32px 0;
  margin-top: 32px;
}

.tw-footer-links {
  display: flex;
  justify-content: center;
  gap: 24px;
  
  a {
    color: $tw-text-muted;
    text-decoration: none;
    font-size: 14px;
    transition: color 0.15s ease;
    
    &:hover {
      color: $tw-text-light;
    }
  }
}

// Медиа-запросы для адаптивности
@media (max-width: 768px) {
  .tw-app-header .tw-container {
    flex-direction: column;
    gap: 16px;
  }
  
  .tw-navigation {
    width: 100%;
    justify-content: space-between;
  }
  
  .tw-footer-links {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>

<style lang="sass">
.fade-enter-active,
.fade-leave-active
  transition: opacity 0.3s ease, transform 0.3s ease

.fade-enter-from,
.fade-leave-to
  opacity: 0
  transform: translateY(10px)
</style>
