const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000; // Порт для вашего сервера

app.use(cors());
app.use(bodyParser.json());

// Эндпоинт для загрузки файла
app.get('/api/markdown', (req, res) => {
  const filePath = path.join(__dirname, '../src/assets/css/md/read.md'); // Убедитесь, что путь правильный
  console.log('Путь к файлу:', filePath); // Отладочная информация
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Ошибка при чтении файла:', err); // Логирование ошибки
      return res.status(500).send('Ошибка при чтении файла');
    }
    res.send(data);
  });
});

// Эндпоинт для сохранения файла
app.post('/api/markdown', (req, res) => {
  const filePath = path.join(__dirname, '../src/assets/css/md/read.md'); // Убедитесь, что путь правильный
  const content = req.body.content;

  fs.writeFile(filePath, content, 'utf8', (err) => {
    if (err) {
      console.error('Ошибка при сохранении файла:', err); // Логирование ошибки
      return res.status(500).send('Ошибка при сохранении файла');
    }
    res.send('Файл успешно сохранен!');
  });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});