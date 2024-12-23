// По аналогии с примерами из урока, добавьте в приложение обработчик, 
// который будет обрабатывать запросы по пути users/{id}/post/{postId}

import fastify from 'fastify';

const app = fastify();
const port = 3000;

const state = {
  users: [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
  ],
};

// Маршрут для получения информации о пользователе по ID
app.get('/users/:id', (req, res) => {
  const { id } = req.params;
  const user = state.users.find((user) => user.id === parseInt(id, 10)); // Приводим `id` к числу
  if (!user) {
    return res.code(404).send({ message: 'User not found' });
  }
  res.send(user);
});

// Маршрут для получения информации о курсе
app.get('/courses/:courseId/lessons/:id', (req, res) => {
  res.send(`Course ID: ${req.params.courseId}; Lesson ID: ${req.params.id}`);
});

// Маршрут для получения курса по ID
app.get('/courses/:id', (req, res) => {
  res.send(`Course ID: ${req.params.id}`);
});

// Маршрут для создания нового курса
app.get('/courses/new', (req, res) => {
  res.send('Course build');
});

// Маршрут для получения поста пользователя
app.get('/users/:id/post/:postId', (req, res) => {
  const { id, postId } = req.params;
  res.send(`User ID: ${id}; Post ID: ${postId}`);
});

// Запуск сервера
app.listen({ port }, () => {
  console.log(`Example app listening on port ${port}`);
});