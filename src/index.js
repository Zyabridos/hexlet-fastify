import fastify from 'fastify';
import view from '@fastify/view';
import pug from 'pug';
import path from 'path';
import { fileURLToPath } from 'url';

const app = fastify();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

await app.register(view, {
  engine: { pug },
  root: path.join(__dirname, 'views'),
});

const state = {
  courses: [
    { id: 1, title: 'JavaScript Basics', description: 'Learn the fundamentals of JavaScript, including syntax and basic programming concepts.' },
    { id: 2, title: 'Node.js Fundamentals', description: 'Understand the basics of server-side development with Node.js and build simple APIs.' },
    { id: 3, title: 'React Crash Course', description: 'Dive into React development, including components, state management, and hooks.' },
  ],
};


app.get('/courses', (req, res) => {
  const term = req.query.term;
  let filteredCourses = state.courses;

  if (term) {
    filteredCourses = state.courses.filter(course => 
      course.title.toLowerCase().includes(term.toLowerCase()) || 
      course.description.toLowerCase().includes(term.toLowerCase())
    );
  }

  const data = { term, courses: filteredCourses };

  res.view('courses/index', data);
});

app.listen({ port }, () => {
  console.log(`Example app listening on port ${port}`);
});