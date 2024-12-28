const routes = {
  // Пользователи
  usersPath: () => '/users',
  // Форма создания пользователя
  newUserPath: () => '/users/new',
  // Курсы
  coursesPath: () => '/courses',
  // Конкретный курс
  coursePath: (id) => `/courses/${id}`,
  // Форма создания курса
  newCoursePath: () => '/courses/new',
};

export default routes;