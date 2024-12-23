import fastify from 'fastify';

const app = fastify();
const port = 3000;

// Добавьте в проект hexlet-fastify обработчик, который будет обрабатывать GET запросы по адресу /hello 
// и выводить приветствие. Обработчик должен использовать параметр запроса name и приветствовать пользователя по имени. \
// Например, при запросе GET /hello?name=John должно вывестись Hello, John!. 
// Если параметр запроса name не передан, должно вывестись Hello, World!

app.get('/hello', async (request, reply) => {
  const { name } = request.query;
  const greeting = `Hello, ${name || 'World'}!`;
  return greeting;
});

app.listen({ port }, () => {
  console.log(`Example app listening on port ${port}`);
});
