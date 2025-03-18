<template>
  <div class="editor-container">
    <NetworkConfig @update="updatePackages" v-model="localConfig" />

    <div class="editor-header">
      <h1>Редактор markdown</h1>
      <div class="editor-actions">
        <button class="button primary" @click="saveMarkdown">Сохранить</button>
        <button class="button secondary" @click="addBlock">Добавить блок</button>
      </div>
    </div>

    <div class="editor-workspace">
      <div class="editor-sidebar">
        <div class="toolbar-section">
          <h3>Навигация</h3>
          <ul class="nav-menu">
            <li v-for="(heading, index) in headings" :key="index">
              <a :href="'#' + heading.id">{{ heading.text }}</a>
            </li>
          </ul>
        </div>

        <div class="toolbar-section">
          <h3>Форматирование</h3>
          <div class="toolbar-buttons">
            <button class="toolbar-button" @click="applyFormatting('h1')">H1</button>
            <button class="toolbar-button" @click="applyFormatting('h2')">H2</button>
            <button class="toolbar-button" @click="applyFormatting('h3')">H3</button>
            <button class="toolbar-button" @click="applyFormatting('h4')">H4</button>
            <button class="toolbar-button" @click="applyFormatting('bold')">B</button>
            <button class="toolbar-button" @click="applyFormatting('italic')">I</button>
            <button class="toolbar-button" @click="applyFormatting('list')">•</button>
          </div>
        </div>

        <div class="toolbar-section">
          <h3>Переменные</h3>
          <div class="variable-buttons">
            <div class="grid-container">
              <button class="grid-button" @click="insertVariable('hqRtr.hostname')">HQ-RTR Имя хоста</button>
              <button class="grid-button" @click="insertVariable('hqRtr.ens18.ip')">HQ-RTR ENS18 IP</button>
              <button class="grid-button" @click="insertVariable('brRtr.hostname')">BR-RTR Имя хоста</button>
              <button class="grid-button" @click="insertVariable('brRtr.ens18.ip')">BR-RTR ENS18 IP</button>
              <button class="grid-button" @click="insertVariable('hqSrv')">HQ-SRV</button>
              <button class="grid-button" @click="insertVariable('brSrv')">BR-SRV</button>
              <button class="grid-button" @click="insertVariable('hqRtr.ens19.ip')">HQ-RTR ENS19 IP</button>
              <button class="grid-button" @click="insertVariable('brRtr.ens19.ip')">BR-RTR ENS19 IP</button>
              <button class="grid-button" @click="insertVariable('hqRtr.gateway')">HQ-RTR Gateway</button>
              <button class="grid-button" @click="insertVariable('brRtr.gateway')">BR-RTR Gateway</button>
            </div>
          </div>
        </div>

        <div class="toolbar-section">
          <h3>Блоки кода</h3>
          <div class="toolbar-buttons">
            <button class="toolbar-button" @click="insertCodeBlock('bash')">BASH</button>
            <button class="toolbar-button" @click="insertCodeBlock('json')">JSON</button>
            <button class="toolbar-button" @click="insertCodeBlock('yaml')">YAML</button>
            <button class="toolbar-button" @click="insertCodeBlock('conf')">CONF</button>
          </div>
        </div>

        <div class="toolbar-section">
          <h3>Медиа</h3>
          <div class="toolbar-buttons">
            <button class="toolbar-button" @click="openImageUpload">Добавить изображение</button>
            <input type="file" ref="imageUpload" @change="handleImageUpload" accept="image/*" style="display: none" />
          </div>
        </div>

        <div class="toolbar-section">
          <h3>Опциональные блоки</h3>
          <div class="optional-blocks">
            <div v-for="(block, index) in optionalBlocks" :key="index" class="optional-block">
              <div class="optional-block-header">
                <input type="checkbox" :id="`block-${index}`" v-model="block.enabled" @change="updateOptionalBlocks" />
                <label :for="`block-${index}`">{{ block.name }}</label>
                <button class="small-button" @click="editOptionalBlock(index)">✏️</button>
              </div>
            </div>
            <button class="button secondary" @click="addOptionalBlock">Добавить блок</button>
          </div>
        </div>
      </div>

      <div class="editor-content">
        <div class="editor-tabs">
          <button class="editor-tab" :class="{ active: activeTab === 'edit' }" @click="activeTab = 'edit'">Редактор</button>
          <button class="editor-tab" :class="{ active: activeTab === 'preview' }" @click="activeTab = 'preview'">Предпросмотр</button>
        </div>
        
        <div class="editor-panels">
          <div v-if="activeTab === 'edit'" class="edit-panel">
            <textarea ref="markdownEditor" v-model="markdownContent" class="markdown-textarea" placeholder="Введите markdown текст..." @keydown.tab.prevent="handleTab"></textarea>
            <div v-for="(block, index) in blocks" :key="index">
              <h4>Блок {{ index + 1 }}</h4>
              <textarea v-model="block.content" placeholder="Введите содержимое блока..."></textarea>
            </div>
          </div>
          <div v-else class="preview-panel">
            <MarkdownViewer :markdown="renderMarkdown(markdownContent)" :config="config" />
          </div>
        </div>
      </div>
    </div>

    <div v-if="showOptionalBlockModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>{{ isEditingBlock ? 'Редактировать блок' : 'Новый опциональный блок' }}</h2>
          <button class="close-button" @click="showOptionalBlockModal = false">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="block-name">Название блока:</label>
            <input type="text" id="block-name" v-model="currentBlock.name" placeholder="Введите название блока" />
          </div>
          <div class="form-group">
            <label for="block-content">Содержимое:</label>
            <textarea id="block-content" v-model="currentBlock.content" placeholder="Введите содержимое блока в формате markdown"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="button secondary" @click="showOptionalBlockModal = false">Отмена</button>
          <button class="button primary" @click="saveOptionalBlock">Сохранить</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useNetworkConfigStore } from '../store/NetworkConfig'; // Импортируем хранилище
import MarkdownViewer from './MarkdownViewer.vue';
import NetworkConfig from './NetworkConfig.vue';
import { ref, onMounted, reactive } from 'vue';
import axios from 'axios';

export default {
  name: 'Editor',
  components: {
    MarkdownViewer,
    NetworkConfig
  },
  props: {
    filename: {
      type: String,
      default: 'test.md'
    },
    config: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props) {
    const store = useNetworkConfigStore(); // Используем хранилище
    const markdownContent = ref('');
    const activeTab = ref('edit');
    const markdownEditor = ref(null);
    const imageUpload = ref(null);
    const showOptionalBlockModal = ref(false);
    const currentBlockIndex = ref(-1);
    const currentBlock = reactive({
      name: '',
      content: '',
      enabled: true
    });
    const optionalBlocks = ref([]);
    const isEditingBlock = ref(false);
    const blocks = ref([]);
    const headings = ref([]);
    const localConfig = reactive({}); // Хранение конфигурации сети

    // Загрузка файла
    const loadMarkdown = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/markdown');
        markdownContent.value = response.data;
        extractHeadings(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке markdown-файла:', error);
        markdownContent.value = '# Новый документ\n\nНачните писать здесь...';
      }
    };

    // Извлечение заголовков
    const extractHeadings = (content) => {
      const headingRegex = /^(#{1,6})\s+(.*)$/gm;
      headings.value = [];
      let match;
      while ((match = headingRegex.exec(content)) !== null) {
        const level = match[1].length; // Уровень заголовка
        const text = match[2]; // Текст заголовка
        const id = text.toLowerCase().replace(/\s+/g, '-'); // Создание id для навигации
        headings.value.push({ level, text, id });
      }
    };

    // Сохранение файла
    const saveMarkdown = async () => {
      try {
        await axios.post('http://localhost:3000/api/markdown', {
          content: markdownContent.value,
        });
        alert('Файл успешно сохранен!');
      } catch (error) {
        console.error('Ошибка при сохранении файла:', error);
      }
    };

    // Вставка переменной
    const insertVariable = (variable) => {
      const textarea = markdownEditor.value;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      const variableValue = localConfig[variable] || `{{${variable}}}`; // Получаем значение переменной
      markdownContent.value = 
        markdownContent.value.substring(0, start) + 
        variableValue + 
        markdownContent.value.substring(end);

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + variableValue.length, start + variableValue.length);
      }, 0);
    };

    // Применение форматирования
    const applyFormatting = (type) => {
      const textarea = markdownEditor.value;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = markdownContent.value.substring(start, end);
      
      let formattedText = '';
      let cursorPosition = 0;
      
      switch (type) {
        case 'h1':
          formattedText = `# ${selectedText}`;
          cursorPosition = start + 2 + selectedText.length;
          break;
        case 'h2':
          formattedText = `## ${selectedText}`;
          cursorPosition = start + 3 + selectedText.length;
          break;
        case 'h3':
          formattedText = `### ${selectedText}`;
          cursorPosition = start + 4 + selectedText.length;
          break;
        case 'h4':
          formattedText = `#### ${selectedText}`;
          cursorPosition = start + 5 + selectedText.length;
          break;
        case 'bold':
          formattedText = `**${selectedText}**`;
          cursorPosition = start + 2 + selectedText.length + 2;
          break;
        case 'italic':
          formattedText = `*${selectedText}*`;
          cursorPosition = start + 1 + selectedText.length + 1;
          break;
        case 'list':
          formattedText = selectedText.split('\n').map(line => `- ${line}`).join('\n');
          cursorPosition = start + formattedText.length;
          break;
      }
      
      markdownContent.value = 
        markdownContent.value.substring(0, start) + 
        formattedText + 
        markdownContent.value.substring(end);
      
      // Восстанавливаем фокус и позицию курсора
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(selectedText ? cursorPosition : start + formattedText.length, selectedText ? cursorPosition : start + formattedText.length);
      }, 0);
    };

    // Вставка блока кода
    const insertCodeBlock = (language) => {
      const textarea = markdownEditor.value;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = markdownContent.value.substring(start, end);
      
      const codeBlock = `\`\`\`${language}\n${selectedText || 'Введите код здесь...'}\n\`\`\``;
      
      markdownContent.value = 
        markdownContent.value.substring(0, start) + 
        codeBlock + 
        markdownContent.value.substring(end);
      
      // Восстанавливаем фокус
      setTimeout(() => {
        textarea.focus();
        if (!selectedText) {
          // Если не было выделенного текста, устанавливаем курсор внутрь блока кода
          const cursorPos = start + language.length + 4; // ```language\n
          textarea.setSelectionRange(cursorPos, cursorPos);
        }
      }, 0);
    };

    // Обработка нажатия Tab
    const handleTab = (event) => {
      const textarea = markdownEditor.value;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      
      // Вставляем табуляцию (2 пробела)
      markdownContent.value = 
        markdownContent.value.substring(0, start) + 
        '  ' + 
        markdownContent.value.substring(end);
      
      // Устанавливаем новую позицию курсора
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + 2, start + 2);
      }, 0);
    };

    // Открытие диалога загрузки изображения
    const openImageUpload = () => {
      imageUpload.value.click();
    };

    // Обработка загрузки изображения
    const handleImageUpload = (event) => {
      const file = event.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const textarea = markdownEditor.value;
        const start = textarea.selectionStart;
        
        // Формируем markdown для изображения
        const imageMarkdown = `![${file.name}](${e.target.result})`;
        
        markdownContent.value = 
          markdownContent.value.substring(0, start) + 
          imageMarkdown + 
          markdownContent.value.substring(start);
        
        // Очищаем input, чтобы можно было загрузить тот же файл повторно
        event.target.value = '';
      };
      reader.readAsDataURL(file);
    };

    // Добавление нового опционального блока
    const addOptionalBlock = () => {
      isEditingBlock.value = false;
      currentBlockIndex.value = -1;
      currentBlock.name = '';
      currentBlock.content = '';
      currentBlock.enabled = true;
      showOptionalBlockModal.value = true;
    };

    // Редактирование опционального блока
    const editOptionalBlock = (index) => {
      isEditingBlock.value = true;
      currentBlockIndex.value = index;
      const block = optionalBlocks.value[index];
      currentBlock.name = block.name;
      currentBlock.content = block.content;
      currentBlock.enabled = block.enabled;
      showOptionalBlockModal.value = true;
    };

    // Сохранение опционального блока
    const saveOptionalBlock = () => {
      if (!currentBlock.name.trim()) {
        alert('Введите название блока!');
        return;
      }
      
      if (isEditingBlock.value && currentBlockIndex.value !== -1) {
        // Обновление существующего блока
        optionalBlocks.value[currentBlockIndex.value] = {
          name: currentBlock.name,
          content: currentBlock.content,
          enabled: currentBlock.enabled
        };
      } else {
        // Добавление нового блока
        optionalBlocks.value.push({
          name: currentBlock.name,
          content: currentBlock.content,
          enabled: currentBlock.enabled
        });
      }
      
      showOptionalBlockModal.value = false;
      updateOptionalBlocks();
    };

    // Обновление опциональных блоков в markdown-контенте
    const updateOptionalBlocks = () => {
      console.log('Опциональные блоки:', optionalBlocks.value);
    };

    const addBlock = () => {
      blocks.value.push({ content: '' });
    };

    const updatePackages = (packages) => {
      console.log('Обновленные пакеты:', packages);
      localConfig.value = packages; // Обновляем локальную конфигурацию
    };

    const renderMarkdown = (content) => {
      // Заменяем переменные на их значения
      let renderedContent = content;
      for (const key in localConfig) {
        const value = localConfig[key];
        renderedContent = renderedContent.replace(new RegExp(`{{${key}}}`, 'g'), value);
      }
      return renderedContent;
    };

    onMounted(() => {
      loadMarkdown();
    });

    return {
      markdownContent,
      activeTab,
      markdownEditor,
      imageUpload,
      showOptionalBlockModal,
      currentBlock,
      optionalBlocks,
      isEditingBlock,
      saveMarkdown,
      insertVariable,
      applyFormatting,
      insertCodeBlock,
      handleTab,
      openImageUpload,
      handleImageUpload,
      addOptionalBlock,
      editOptionalBlock,
      saveOptionalBlock,
      updateOptionalBlocks,
      blocks,
      addBlock,
      headings,
      localConfig,
      renderMarkdown
    };
  }
};
</script>

<style lang="sass" scoped>
@import '../assets/css/_variables'

.editor-container
  display: flex
  flex-direction: column
  height: 100%
  overflow: hidden

.editor-header
  display: flex
  justify-content: space-between
  align-items: center
  padding: 16px 24px
  background-color: $color-secondary
  border-bottom: 1px solid rgba($txt-white, 0.1)
  
  h1
    margin: 0
    font-size: 24px
    border: none

.editor-actions
  display: flex
  gap: 12px

.editor-workspace
  display: flex
  flex: 1
  overflow: hidden

.editor-sidebar
  width: 250px
  background-color: $color-secondary
  border-right: 1px solid rgba($txt-white, 0.1)
  padding: 16px
  overflow-y: auto

.toolbar-section
  margin-bottom: 24px
  
  h3
    font-size: 16px
    margin-top: 0
    margin-bottom: 12px
    color: $txt-gray

.toolbar-buttons
  display: flex
  flex-wrap: wrap
  gap: 8px

.toolbar-button
  display: flex
  align-items: center
  justify-content: center
  width: 36px
  height: 36px
  background-color: rgba($color-main, 0.3)
  border: 1px solid rgba($txt-white, 0.1)
  border-radius: $border-radius-small
  color: $txt-gray
  cursor: pointer
  transition: all 0.2s ease
  
  &:hover
    background-color: rgba($color-main, 0.5)
    color: $txt-white
  
  svg
    width: 18px
    height: 18px

.heading-icon, .code-icon
  font-family: monospace
  font-size: 12px
  font-weight: bold

.optional-blocks
  display: flex
  flex-direction: column
  gap: 12px

.optional-block
  background-color: rgba($color-main, 0.3)
  border-radius: $border-radius-small
  padding: 10px
  
  &-header
    display: flex
    align-items: center
    gap: 8px
    
    label
      flex: 1
      margin: 0
      font-size: 14px
      cursor: pointer

.small-button
  display: flex
  align-items: center
  justify-content: center
  width: 24px
  height: 24px
  background-color: transparent
  border: none
  color: $txt-gray
  cursor: pointer
  transition: color 0.2s ease
  
  &:hover
    color: $txt-white

.editor-content
  flex: 1
  display: flex
  flex-direction: column
  overflow: hidden

.editor-tabs
  display: flex
  background-color: $color-secondary
  border-bottom: 1px solid rgba($txt-white, 0.1)
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1)

.editor-tab
  padding: 12px 24px
  background: none
  border: none
  color: $txt-gray
  font-size: 14px
  font-weight: $font-weight-medium
  cursor: pointer
  transition: all 0.2s ease
  position: relative
  
  &:hover
    color: $txt-white
  
  &.active
    color: #3B82F6
    font-weight: bold
    
    &::after
      content: ''
      position: absolute
      bottom: -1px
      left: 0
      width: 100%
      height: 2px
      background-color: #3B82F6

.editor-panels
  flex: 1
  overflow: hidden

.edit-panel, .preview-panel
  height: 100%
  overflow: auto

.markdown-textarea
  width: 100%
  height: 100%
  padding: 16px
  background-color: $color-main
  color: $txt-white
  border: none
  font-family: monospace
  font-size: 14px
  line-height: 1.6
  resize: none
  outline: none

.modal
  position: fixed
  top: 0
  left: 0
  width: 100%
  height: 100%
  background-color: rgba(0, 0, 0, 0.5)
  display: flex
  align-items: center
  justify-content: center
  z-index: 1000

.modal-content
  width: 100%
  max-width: 600px
  background-color: $color-secondary
  border-radius: $border-radius
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3)
  overflow: hidden

.modal-header
  display: flex
  justify-content: space-between
  align-items: center
  padding: 16px 24px
  border-bottom: 1px solid rgba($txt-white, 0.1)
  
  h2
    margin: 0
    font-size: 18px

.close-button
  background: none
  border: none
  color: $txt-gray
  font-size: 24px
  cursor: pointer
  transition: color 0.2s ease
  
  &:hover
    color: $txt-white

.modal-body
  padding: 24px

.form-group
  margin-bottom: 16px
  
  label
    display: block
    margin-bottom: 8px
    color: $txt-gray
  
  input, textarea
    width: 100%
    padding: 12px
    background-color: $color-main
    border: 1px solid rgba($txt-white, 0.1)
    border-radius: $border-radius-small
    color: $txt-white
    font-size: 14px
    
    &:focus
      outline: none
      border-color: #3B82F6
  
  textarea
    height: 150px
    resize: vertical
    font-family: monospace

.modal-footer
  display: flex
  justify-content: flex-end
  gap: 12px
  padding: 16px 24px
  border-top: 1px solid rgba($txt-white, 0.1)

@media (max-width: 768px)
  .editor-workspace
    flex-direction: column
  
  .editor-sidebar
    width: 100%
    border-right: none
    border-bottom: 1px solid rgba($txt-white, 0.1)
    max-height: 200px

.nav-menu
  list-style: none
  padding: 0
  margin: 0
  
  li
    margin: 5px 0
  
  a
    text-decoration: none
    color: $txt-gray
    transition: color 0.2s
    
    &:hover
      color: $txt-white
</style>