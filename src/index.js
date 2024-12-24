import fastify from 'fastify';
import pointOfView from '@fastify/view';
import pug from 'pug';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = fastify();
const port = 3000;

// Подключаем шаблонизатор
app.register(pointOfView, {
  engine: { pug },
  root: path.join(__dirname, 'views'),
});

// Статические файлы (например, стили)
app.register(import('@fastify/static'), {
  root: path.join(__dirname, 'public'),
});

// Данные
const users = [
  { id: 1, username: 'john_doe', email: 'john@example.com' },
  { id: 2, username: 'arya_stark', email: 'arya@example.com' },
  { id: 3, username: 'john_snow', email: 'johnSnow@example.com' },
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

// Запуск сервера
app.listen({ port }, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Сервер запущен: http://localhost:${port}`);
});
