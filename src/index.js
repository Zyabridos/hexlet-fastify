import fastify from 'fastify';
import pointOfView from '@fastify/view';
import pug from 'pug';
import path from 'path';
import { fileURLToPath } from 'url';
import sanitizeHtml from 'sanitize-html';

// Воссоздание __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = fastify();
const port = 3000;

// Подключаем шаблонизатор
app.register(pointOfView, {
  engine: { pug },
  root: path.join(__dirname, 'views'),
});

// Статические файлы
app.register(import('@fastify/static'), {
  root: path.join(__dirname, 'public'),
});

// Данные
const users = [
  { id: 1, username: 'john_doe', email: 'john@example.com' },
  { id: 2, username: 'jane_smith', email: 'jane@example.com' },
  { id: 3, username: 'sam_wilson', email: 'sam@example.com' },
];

// Главная страница
app.get('/', (req, res) => {
  res.view('index.pug', { title: 'Главная страница' });
});

// Список пользователей
app.get('/users', (req, res) => {
  res.view('users/index.pug', { title: 'Список пользователей', users });
});

// Конкретный пользователь
app.get('/users/:id', (req, res) => {
  const { id } = req.params;
  const user = users.find((user) => user.id === parseInt(id));

  if (!user) {
    res.code(404).view('error.pug', { title: 'Ошибка', message: 'Пользователь не найден' });
    return;
  }

  res.view('users/show.pug', { title: `Пользователь ${user.username}`, user });
});

// Новый маршрут для получения ID пользователя из строки запроса
// http://localhost:3000/users/get-user-id?id=1
// http://localhost:3000/get-user-id?id=<script>alert("XSS")</script>

app.get('/users/get-user-id', (req, res) => {
  const { id } = req.query;

  // Экранируем ID для защиты от XSS
  const sanitizedId = sanitizeHtml(id, { allowedTags: [], allowedAttributes: {} });

  res.view('users/get-user-id.pug', {
    title: 'Получение ID пользователя',
    id: sanitizedId || 'Идентификатор пользователя удалён из-за недопустимых символов',
  });
});

// Запуск сервера
app.listen({ port }, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Сервер запущен: http://localhost:${port}`);
});
