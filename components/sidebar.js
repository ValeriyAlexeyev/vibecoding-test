(function () {
  window.GoCourse = window.GoCourse || {};

  window.GoCourse.sidebar = function sidebar(activeId) {
    const groups = new Map();

    window.GoCourse.lessons.forEach((lesson) => {
      if (!groups.has(lesson.category)) groups.set(lesson.category, []);
      groups.get(lesson.category).push(lesson);
    });

    const lessonLinks = [...groups.entries()].map(([group, lessons]) => `
      <section class="nav-group">
        <h3>${group}</h3>
        ${lessons.map((lesson) => `
          <a class="${lesson.id === activeId ? "active" : ""}" href="${window.GoCourse.pathPrefix}${lesson.file}">
            <span>${String(lesson.id).padStart(2, "0")}</span>${lesson.title}
          </a>`).join("")}
      </section>`).join("");

    return `
      <aside class="sidebar" id="sidebar">
        <div class="sidebar-title">Программа</div>
        ${lessonLinks}
        <section class="nav-group">
          <h3>Разделы</h3>
          <a href="${window.GoCourse.pathPrefix}index.html#level-system">Уровни</a>
          <a href="${window.GoCourse.pathPrefix}index.html#achievements">Достижения</a>
          <a href="${window.GoCourse.pathPrefix}index.html#progress-chart">График прогресса</a>
          <a href="${window.GoCourse.pathPrefix}index.html#favorites">Избранное</a>
          <a href="${window.GoCourse.pathPrefix}index.html#daily-task">Задание дня</a>
          <a href="${window.GoCourse.pathPrefix}index.html#sandbox">Песочница</a>
          <a href="${window.GoCourse.pathPrefix}index.html#practice-500">500+ задач</a>
          <a href="${window.GoCourse.pathPrefix}index.html#interview-tasks">Собеседования</a>
          <a href="${window.GoCourse.pathPrefix}index.html#real-projects">Мини-проекты</a>
          <a href="${window.GoCourse.pathPrefix}index.html#job-checklist">Чек-лист</a>
        </section>
      </aside>`;
  };
})();
