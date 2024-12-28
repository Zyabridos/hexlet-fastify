import fastify from 'fastify';
import formbody from '@fastify/formbody';
import view from '@fastify/view';
import pug from 'pug';
import path from 'path';
import { fileURLToPath } from 'url';
import * as yup from 'yup'
import routes from './routes.js'

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
app.get(routes.newUserPath(), (req, res) => {
  res.view(routes.newUserPath());
});

// Обработчик добавления пользователя
app.post(routes.usersPath(), {
  attachValidation: true,
  schema: {
    body: yup.object({
      name: yup.string().min(2, 'Name should contain at least 2 symbols'),
      email: yup.string().email(),
      password: yup.string().min(5, 'Password should be at least 5 symbols'),
      passwordConfirmation: yup.string().min(5),
    }),
  },
  validatorCompiler: ({ schema, method, url, httpPart }) => (data) => {
    if (data.password !== data.passwordConfirmation) {
      return {
        error: Error('Password confirmation is not equal the password'),
      };
    }
    try {
      const result = schema.validateSync(data);
      return { value: result };
    } catch (e) {
      return { error: e };
    }
  },
}, (req, res) => {
  const { name, email, password, passwordConfirmation } = req.body;

  if (req.validationError) {
    const data = {
      name: name.trim(), email: email.trim().toLowerCase(), password, passwordConfirmation,
      error: req.validationError,
    };

    res.view(routes.newUserPath(), data);
    return;
  }

  const user = {
    name,
    email,
    password,
  };

  state.users.push(user);

  res.redirect(routes.usersPath());
});

// Список пользователей
app.get(routes.usersPath(), (req, res) => {
  res.view('/users/users', { users: state.users });
});

// Форма для добавления курса
app.get(routes.newCoursePath(), (req, res) => {
  res.view(routes.newCoursePath());
});

// Обработчик добавления курса
app.post(routes.coursesPath(), {
  attachValidation: true,
  schema: {
    body: yup.object({
      title: yup.string().min(2, 'Title should contain at least 2 symbols'),
      description: yup.string().min(10, 'Description should be at least 10 symbols'),
    }),
  },
  validatorCompiler: ({ schema, method, url, httpPart }) => (data) => {
    try {
      const result = schema.validateSync(data);
      return { value: result };
    } catch (e) {
      return { error: e };
    }
  },
}, (req, res) => {
  const { title, description } = req.body;

  if (req.validationError) {
    const data = {
      title, description,
      description: description,
      error: req.validationError,
    };

    res.view(routes.newCoursePath(), data);
    return;
  }

  const course = {
    title,
    description,
  };

  state.courses.push(course);

  res.redirect(routes.coursesPath);
});
// Список курсов
app.get(routes.coursesPath(), (req, res) => {
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
