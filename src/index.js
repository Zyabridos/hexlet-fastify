import fastify from 'fastify';
import formbody from '@fastify/formbody';
import view from '@fastify/view';
import pug from 'pug';
import path from 'path';
import { fileURLToPath } from 'url';

// Определяем пути
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Инициализируем приложение Fastify
const app = fastify();
const port = 3000;

// Простая база данных (имитация репозитория)
const state = {
  users: [],
  courses: [],
};

// Подключаем плагины
await app.register(formbody);
await app.register(view, {
  engine: { pug },
  root: path.join(__dirname, 'views'),
});

// Маршрут для формы добавления пользователя
app.get('/users/new', (req, res) => {
  res.view('users/new');
});

// Обработчик добавления пользователя
app.post('/users', (req, res) => {
  const { name, email, password } = req.body;

  // Нормализация email
  const normalizedEmail = email.trim().toLowerCase();

  // Добавляем пользователя в "репозиторий"
  const user = { name, email: normalizedEmail, password };
  state.users.push(user);

  // Редирект на список пользователей
  res.redirect('/users');
});

// Список пользователей
app.get('/users', (req, res) => {
  res.view('/users/users', { users: state.users });
});

// Форма для добавления курса
app.get('/courses/new', (req, res) => {
  res.view('courses/new');
});

// Обработчик добавления курса
app.post('/courses', (req, res) => {
  const { title, description } = req.body;

  // Добавляем курс в "репозиторий"
  const course = { title, description };
  state.courses.push(course);

  // Редирект на список курсов
  res.redirect('/courses');
});

// Список курсов
app.get('/courses', (req, res) => {
  res.view('/courses/courses', { courses: state.courses });
});

// Запускаем сервер
app.listen({ port }, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server is running at http://localhost:${port}`);
});
