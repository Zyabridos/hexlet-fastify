import fastify from 'fastify';

const data = {
  phones: ['+12345678', '3434343434', '234-56-78'],
  domains: ['example.com', 'hexlet.io'],
};

const app = fastify();
const port = 3000;

app.get('/phones', (req, res) => {
  res.send(data.phones);
});

app.get('/domains', (req, res) => {
  res.send(data.domains);
});

app.listen({ port }, () => {
  console.log(`Example app listening on port ${port}`);
});
