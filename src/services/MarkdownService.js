/**
 * Сервис для загрузки и обработки Markdown-файлов
 */
export default {
  /**
   * Загружает Markdown-файл по указанному пути
   * 
   * @param {string} path - Путь к Markdown-файлу
   * @returns {Promise<string>} - Содержимое файла в виде строки
   */
  async loadMarkdown(path) {
    try {
      const response = await fetch(path);
      
      if (!response.ok) {
        throw new Error(`Не удалось загрузить файл: ${response.status} ${response.statusText}`);
      }
      
      const text = await response.text();
      return text;
    } catch (error) {
      console.error('Ошибка при загрузке Markdown-файла:', error);
      throw error;
    }
  }
} 