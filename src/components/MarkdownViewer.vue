<template>
  <div class="markdown-viewer" v-html="renderedMarkdown"></div>
</template>

<script>
import MarkdownIt from 'markdown-it';
import 'highlight.js/styles/nord.css';
import hljs from 'highlight.js';
import { ref, defineProps, watch, onMounted } from 'vue';

export default {
  name: 'MarkdownViewer',
  props: {
    markdown: {
      type: String,
      required: false,
      default: ''
    },
    config: {
      type: Object,
      required: false,
      default: () => ({
        domain: { name: 'example.com' },
        hqRtr: {},
        brRtr: {},
        hqSrv: {},
        brSrv: {},
        accounts: {},
        hqCli: {}
      })
    }
  },
  setup(props) {
    // Инициализация markdown-it с настройками
    const md = new MarkdownIt({
      html: true,
      linkify: true,
      typographer: true,
      highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            const highlighted = hljs.highlight(str, { language: lang }).value;
            
            // Создаем блок для строк кода и номеров строк
            const lines = str.split('\n');
            const lineNumbers = lines.map((_, index) => 
              `<div class="line-number">${index + 1}</div>`
            ).join('');
            
            // Создаем разметку с номерами строк и кнопкой копирования
            return `<div class="code-block-wrapper">
              <div class="code-header">
                <span class="code-language">${lang}</span>
                <button class="copy-button" onclick="
                  const codeBlock = this.parentNode.nextElementSibling.querySelector('.code-lines');
                  const text = codeBlock.textContent;
                  navigator.clipboard.writeText(text).then(() => {
                    this.classList.add('copied');
                    const originalText = this.innerHTML;
                    this.innerHTML = '<svg xmlns=&quot;http://www.w3.org/2000/svg&quot; width=&quot;16&quot; height=&quot;16&quot; viewBox=&quot;0 0 24 24&quot; fill=&quot;none&quot; stroke=&quot;currentColor&quot; stroke-width=&quot;2&quot; stroke-linecap=&quot;round&quot; stroke-linejoin=&quot;round&quot;><polyline points=&quot;20 6 9 17 4 12&quot;></polyline></svg><span>Скопировано!</span>';
                    setTimeout(() => {
                      this.innerHTML = originalText;
                      this.classList.remove('copied');
                    }, 2000);
                  });
                ">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                  <span>Копировать</span>
                </button>
              </div>
              <pre class="hljs"><div class="code-container">
                <div class="line-numbers-block">${lineNumbers}</div>
                <code class="code-lines">${highlighted}</code>
              </div></pre>
            </div>`;
          } catch (__) {}
        }

        return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
      }
    });

    const renderedMarkdown = ref('');

    const replaceVariables = (markdown) => {
      if (!markdown) return '';

      // Создаем локальные константы с проверкой на существование
      const hqRtr = props.config && props.config.hqRtr || {};
      const brRtr = props.config && props.config.brRtr || {};
      const hqSrv = props.config && props.config.hqSrv || {};
      const brSrv = props.config && props.config.brSrv || {};
      const accounts = props.config && props.config.accounts || {};
      const domain = props.config && props.config.domain || { name: 'example.com' };
      const hqCli = props.config && props.config.hqCli || {};
      
      // Заменяем переменные в тексте
      let result = markdown
        .replace(/\{\{domain\}\}/g, domain.name || 'example.com')
        .replace(/\{\{ssh_user\}\}/g, accounts.sshUser || 'sshuser')
        .replace(/\{\{net_admin\}\}/g, accounts.netAdmin || 'netadmin')
        .replace(/\{\{hq_rtr_ens18_ip\}\}/g, hqRtr.ens18 && hqRtr.ens18.ip || '10.0.0.1')
        .replace(/\{\{hq_rtr_ens19_ip\}\}/g, hqRtr.ens19 && hqRtr.ens19.ip || '192.168.10.1')
        .replace(/\{\{hq_rtr_tun0_ip\}\}/g, hqRtr.tun0 && hqRtr.tun0.ip || '10.10.10.1')
        .replace(/\{\{hq_rtr_gateway\}\}/g, hqRtr.gateway || '10.0.0.254')
        .replace(/\{\{br_rtr_ens18_ip\}\}/g, brRtr.ens18 && brRtr.ens18.ip || '10.0.1.1')
        .replace(/\{\{br_rtr_ens19_ip\}\}/g, brRtr.ens19 && brRtr.ens19.ip || '192.168.20.1')
        .replace(/\{\{br_rtr_tun0_ip\}\}/g, brRtr.tun0 && brRtr.tun0.ip || '10.10.10.2')
        .replace(/\{\{br_rtr_gateway\}\}/g, brRtr.gateway || '10.0.1.254')
        .replace(/\{\{hq_srv_ip\}\}/g, hqSrv.ip || '192.168.10.10')
        .replace(/\{\{hq_srv_gateway\}\}/g, hqSrv.gateway || '192.168.10.1')
        .replace(/\{\{br_srv_ip\}\}/g, brSrv.ip || '192.168.20.10')
        .replace(/\{\{br_srv_gateway\}\}/g, brSrv.gateway || '192.168.20.1')
        .replace(/\{\{hq_cli_network\}\}/g, hqCli.network || '192.168.10.0/24')
        .replace(/\{\{hq_cli_dhcp_range\}\}/g, hqCli.dhcpRange || '192.168.10.50-192.168.10.150');
      
      return result;
    };

    // Обновляет отрендеренный markdown при изменении входных данных
    const updateRenderedMarkdown = () => {
      const replacedMarkdown = replaceVariables(props.markdown);
      renderedMarkdown.value = md.render(replacedMarkdown);
    };

    // Инициализация при монтировании
    onMounted(() => {
      updateRenderedMarkdown();
    });

    // Отслеживаем изменения markdown и config
    watch(() => props.markdown, updateRenderedMarkdown);
    watch(() => props.config, updateRenderedMarkdown, { deep: true });

    return {
      renderedMarkdown
    };
  }
};
</script>

<style lang="scss" scoped>
// Переменные стилей в стиле TailwindCSS
$tw-bg-dark: rgb(2, 6, 23);
$tw-bg-light: rgb(255, 255, 255);
$tw-bg-code: rgb(15, 23, 42);
$tw-text-light: rgb(255, 255, 255);
$tw-text-dark: rgb(30, 41, 59);
$tw-blue-accent: rgb(59, 130, 246);
$tw-gray-light: rgb(226, 232, 240);
$tw-gray-dark: rgb(100, 116, 139);
$tw-font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
$tw-border-radius: 8px;

.markdown-viewer {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  color: $tw-text-dark;
  line-height: 1.7;
  
  :deep(h1) {
    font-size: 2em;
    font-weight: 700;
    margin: 0.8em 0 0.4em;
    border-bottom: 1px solid $tw-gray-light;
    padding-bottom: 0.2em;
  }
  
  :deep(h2) {
    font-size: 1.6em;
    font-weight: 600;
    margin: 0.8em 0 0.4em;
    border-bottom: 1px solid $tw-gray-light;
    padding-bottom: 0.2em;
  }
  
  :deep(h3) {
    font-size: 1.3em;
    font-weight: 600;
    margin: 0.8em 0 0.4em;
  }
  
  :deep(h4, h5, h6) {
    font-size: 1.1em;
    font-weight: 600;
    margin: 0.8em 0 0.4em;
  }
  
  :deep(p) {
    margin: 0.8em 0;
  }
  
  :deep(a) {
    color: $tw-blue-accent;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
  
  :deep(blockquote) {
    margin: 1em 0;
    padding: 0 1em;
    border-left: 4px solid $tw-gray-light;
    color: $tw-gray-dark;
  }
  
  :deep(ul, ol) {
    margin: 0.8em 0;
    padding-left: 2em;
  }
  
  :deep(li) {
    margin: 0.3em 0;
  }
  
  :deep(img) {
    max-width: 100%;
    border-radius: $tw-border-radius;
  }
  
  :deep(hr) {
    height: 1px;
    background-color: $tw-gray-light;
    border: none;
    margin: 1.5em 0;
  }
  
  :deep(table) {
    width: 100%;
    border-collapse: collapse;
    margin: 1em 0;
    
    th, td {
      border: 1px solid $tw-gray-light;
      padding: 0.5em 0.8em;
      text-align: left;
    }
    
    th {
      background-color: rgba($tw-gray-light, 0.5);
      font-weight: 600;
    }
    
    tr:nth-child(even) {
      background-color: rgba($tw-gray-light, 0.2);
    }
  }
  
  :deep(.code-block-wrapper) {
    margin: 1.2em 0;
    border-radius: $tw-border-radius;
    overflow: hidden;
    border: 1px solid rgba($tw-bg-dark, 0.1);
    box-shadow: 0 2px 6px rgba($tw-bg-dark, 0.05);
    
    .code-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.6em 1em;
      background-color: rgba($tw-bg-dark, 0.95);
      color: $tw-text-light;
      font-size: 0.85em;
      
      .code-language {
        text-transform: uppercase;
        font-weight: 600;
        letter-spacing: 0.5px;
        font-size: 0.8em;
        opacity: 0.7;
      }
      
      .copy-button {
        display: flex;
        align-items: center;
        gap: 6px;
        background-color: rgba($tw-blue-accent, 0.2);
        color: $tw-text-light;
        border: none;
        border-radius: 4px;
        padding: 0.3em 0.6em;
        font-size: 0.85em;
        cursor: pointer;
        transition: all 0.2s ease;
        
        svg {
          width: 1em;
          height: 1em;
        }
        
        &:hover {
          background-color: rgba($tw-blue-accent, 0.3);
        }
        
        &.copied {
          background-color: rgba(16, 185, 129, 0.3);
          
          svg {
            color: rgb(16, 185, 129);
          }
        }
      }
    }
    
    pre.hljs {
      margin: 0;
      padding: 0;
      overflow-x: auto;
      font-family: $tw-font-mono;
      font-size: 0.9em;
      line-height: 1.6;
      background-color: rgba(2, 6, 23, 0.9);
      
      .code-container {
        display: flex;
        width: 100%;
        min-width: 100%;
      }
      
      .line-numbers-block {
        display: flex;
        flex-direction: column;
        padding: 1.2em 12px 1.2em 1.2em;
        margin-right: 12px;
        border-right: 1px solid rgba(59, 130, 246, 0.2);
        color: rgba(148, 163, 184, 0.6);
        font-size: 0.85em;
        text-align: right;
        user-select: none;
        
        .line-number {
          counter-increment: line;
          padding-right: 4px;
          min-width: 1.5em;
        }
      }
      
      .code-lines {
        flex: 1;
        white-space: pre;
        counter-reset: line;
        padding: 1.2em 1.2em 1.2em 0;
      }
      
      &::-webkit-scrollbar {
        height: 8px;
      }
      
      &::-webkit-scrollbar-track {
        background: rgba(30, 41, 59, 0.1);
        border-radius: 0 0 8px 8px;
      }
      
      &::-webkit-scrollbar-thumb {
        background: rgba(59, 130, 246, 0.3);
        border-radius: 8px;
      }
      
      &::-webkit-scrollbar-thumb:hover {
        background: rgba(59, 130, 246, 0.5);
      }
    }
  }
  
  :deep(code:not(pre code)) {
    font-family: $tw-font-mono;
    font-size: 0.9em;
    background-color: rgba(226, 232, 240, 0.5);
    padding: 0.2em 0.4em;
    border-radius: 3px;
  }
}
</style>