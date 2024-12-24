import fastify from 'fastify';
import pointOfView from '@fastify/view';
import pug from 'pug';

const app = fastify();
const port = 3000;

// Подключение плагина для работы с шаблонами
app.register(pointOfView, {
  engine: {
    pug,
  },
  root: './src/views',
});

const state = {
  courses: [
    {
      id: 1,
      title: 'JS: Массивы',
      description: 'Курс про массивы в JavaScript',
    },
    {
      id: 2,
      title: 'JS: Функции',
      description: 'Курс про функции в JavaScript',
    },
  ],
  users: [
    {
      id: 1,
      name: 'John Doe',
      posts: [
        { id: 1, title: 'First Post', content: 'This is the first post' },
        { id: 2, title: 'Second Post', content: 'This is the second post' },
      ],
    },
    {
      id: 2,
      name: 'Jane Smith',
      posts: [
        { id: 1, title: 'Hello World', content: 'Welcome to the blog!' },
      ],
    },
  ],
};

// Обработчик для courses/:id
app.get('/courses/:id', (req, res) => {
  const { id } = req.params;
  const course = state.courses.find(({ id: courseId }) => courseId === parseInt(id));
  if (!course) {
    res.code(404).send({ message: 'Course not found' });
    return;
  }
  res.view('courses/show.pug', { course });
});

// бработчик для users/{id}/post/{postId}
app.get('/users/:id/post/:postId', (req, res) => {
  const { id, postId } = req.params;
  const user = state.users.find(({ id: userId }) => userId === parseInt(id));
  if (!user) {
    res.code(404).send({ message: 'User not found' });
    return;
  }

  const post = user.posts.find(({ id: pId }) => pId === parseInt(postId));
  if (!post) {
    res.code(404).send({ message: 'Post not found' });
    return;
  }

  res.view('users/post.pug', { user, post });
});

// Запуск сервера
app.listen({ port }, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Example app listening on port ${port}`);
});
