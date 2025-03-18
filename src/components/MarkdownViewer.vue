<template>
  <div class="markdown-container">
    <div class="markdown-viewer" v-html="renderedMarkdown"></div>
  </div>
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
            
            // Разбиваем подсвеченный код на строки для возможности подсветки отдельных строк
            const highlightedLines = highlighted.split('\n').map(line => 
              `<span class="hljs-line">${line}</span>`
            ).join('\n');
            
            // Определяем язык программирования для отображения
            const displayLang = {
              'js': 'JavaScript',
              'ts': 'TypeScript',
              'html': 'HTML',
              'css': 'CSS',
              'sass': 'SASS',
              'scss': 'SCSS',
              'bash': 'Bash',
              'shell': 'Shell',
              'py': 'Python',
              'python': 'Python',
              'json': 'JSON',
              'md': 'Markdown',
              'vue': 'Vue',
              'jsx': 'JSX',
              'tsx': 'TSX',
            }[lang] || lang.toUpperCase();
            
            // Создаем разметку с номерами строк и кнопкой копирования
            return `<div class="code-block-wrapper">
              <div class="code-header">
                <span class="code-language">${displayLang}</span>
                <button class="copy-button" onclick="
                  const codeBlock = this.parentNode.nextElementSibling.querySelector('.code-lines');
                  const text = codeBlock.textContent;
                  navigator.clipboard.writeText(text).then(() => {
                    this.classList.add('copied');
                    const originalText = this.innerHTML;
                    this.innerHTML = '<svg xmlns=&quot;http://www.w3.org/2000/svg&quot; width=&quot;16&quot; height=&quot;16&quot; viewBox=&quot;0 0 24 24&quot; fill=&quot;none&quot; stroke=&quot;currentColor&quot; stroke-width=&quot;2&quot; stroke-linecap=&quot;round&quot; stroke-linejoin=&quot;round&quot; class=&quot;checkmark-icon&quot;><polyline points=&quot;20 6 9 17 4 12&quot;></polyline></svg><span>Скопировано!</span>';
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
                <code class="code-lines">${highlightedLines}</code>
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

<style lang="sass">
// Стили подключаются глобально через main.sass
</style>