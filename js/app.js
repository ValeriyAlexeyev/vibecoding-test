(function () {
  const course = window.GoCourse;
  course.pathPrefix = document.body.dataset.page === "lesson" ? "../" : "";

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[char]));
  }

  function highlight(code) {
    return escapeHtml(code)
      .replace(/(\/\/.*)$/gm, '<span class="tok-comment">$1</span>')
      .replace(/(&quot;.*?&quot;)/g, '<span class="tok-string">$1</span>')
      .replace(/\b(\d+)\b/g, '<span class="tok-number">$1</span>')
      .replace(/\b(package|import|func|var|const|if|else|switch|case|for|range|return|defer|go|select|struct|interface|map|chan|type)\b/g, '<span class="tok-keyword">$1</span>')
      .replace(/\b(string|int|bool|error|float64|byte|rune|nil|true|false)\b/g, '<span class="tok-type">$1</span>')
      .replace(/\b([a-zA-Z_]\w*)\(/g, '<span class="tok-function">$1</span>(');
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.left = "-9999px";
    document.body.appendChild(area);
    area.select();
    document.execCommand("copy");
    area.remove();
    return Promise.resolve();
  }

  function renderShell(content, activeId) {
    document.getElementById("app-shell").innerHTML = `${course.navbar()}<div class="layout">${course.sidebar(activeId)}<main class="content">${content}</main></div>`;
    course.theme.init();
    course.search.attach();
    document.getElementById("theme-toggle").addEventListener("click", course.theme.toggle);
    document.getElementById("menu-toggle").addEventListener("click", () => document.getElementById("sidebar").classList.toggle("open"));
  }

  function getLevel(completedCount) {
    const levels = course.advanced.levels;
    return levels.slice().reverse().find((level) => completedCount >= level.from) || levels[0];
  }

  function getDailyTask() {
    const tasks = course.advanced.practiceTasks;
    const dateKey = new Date().toISOString().slice(0, 10).replaceAll("-", "");
    const index = Number(dateKey) % tasks.length;
    return tasks[index];
  }

  function renderLevelSystem(state) {
    const completed = state.completed.length;
    const current = getLevel(completed);
    return `
      <section class="section level-system" id="level-system">
        <div class="section-heading"><span class="eyebrow">Система уровней</span><h2>${current.name}</h2></div>
        <div class="level-track">
          ${course.advanced.levels.map((level) => {
            const active = completed >= level.from;
            return `<article class="${active ? "active" : ""}">
              <strong>${level.name}</strong>
              <span>${level.from}-${level.to} уроков</span>
              <p>${level.focus}</p>
            </article>`;
          }).join("")}
        </div>
      </section>`;
  }

  function renderAchievements(state) {
    const completed = state.completed.length;
    return `
      <section class="section" id="achievements">
        <div class="section-heading"><span class="eyebrow">Достижения</span><h2>Награды за прохождение</h2></div>
        <div class="achievement-grid">
          ${course.advanced.achievements.map((item) => {
            const unlocked = completed >= item.threshold;
            return `<article class="${unlocked ? "unlocked" : ""}">
              <div class="badge-icon">${unlocked ? "✓" : "·"}</div>
              <h3>${item.title}</h3>
              <p>${item.rule}</p>
            </article>`;
          }).join("")}
        </div>
      </section>`;
  }

  function renderProgressChart(state) {
    const completed = new Set(state.completed);
    const bars = course.lessons.map((lesson) => {
      const height = completed.has(lesson.id) ? 92 : 18;
      return `<a href="${lesson.file}" class="${completed.has(lesson.id) ? "done" : ""}" style="--h:${height}%" title="Урок ${lesson.id}: ${lesson.title}"><span></span></a>`;
    }).join("");
    return `
      <section class="section" id="progress-chart">
        <div class="section-heading"><span class="eyebrow">График прогресса</span><h2>40 уроков по траектории</h2></div>
        <div class="progress-chart">${bars}</div>
      </section>`;
  }

  function renderFavorites(state) {
    const favorites = course.lessons.filter((lesson) => state.favorites.includes(lesson.id));
    return `
      <section class="section" id="favorites">
        <div class="section-heading"><span class="eyebrow">Избранные уроки</span><h2>${favorites.length || "Пока пусто"}</h2></div>
        <div class="compact-list">
          ${(favorites.length ? favorites : course.lessons.slice(0, 4)).map((lesson) => `
            <article>
              <strong>${String(lesson.id).padStart(2, "0")} ${lesson.title}</strong>
              <p>${favorites.length ? "Добавлено в избранное" : "Откройте урок и нажмите «В избранное»."}</p>
              <a href="${lesson.file}">Открыть урок</a>
            </article>`).join("")}
        </div>
      </section>`;
  }

  function renderDailyTask() {
    const task = getDailyTask();
    return `
      <section class="section daily-task" id="daily-task">
        <div class="section-heading"><span class="eyebrow">Ежедневное задание</span><h2>${task.title}</h2></div>
        <p>${task.statement}</p>
        <div class="task-meta"><span>${task.level}</span><span>${task.tags.join(", ")}</span></div>
        <details><summary>Подсказка</summary><p>${task.hint}</p></details>
        <details><summary>Решение</summary><pre class="code-block"><code>${highlight(task.solution)}</code></pre><p>${task.explanation}</p></details>
      </section>`;
  }

  function renderPracticeTasks() {
    const tasks = course.advanced.practiceTasks;
    return `
      <section class="section" id="practice-500">
        <div class="section-heading"><span class="eyebrow">Практика</span><h2>${tasks.length} задач с решениями</h2></div>
        <div class="task-list">
          ${tasks.map((task) => `
            <details class="task-card">
              <summary><strong>${task.title}</strong><span>${task.level}</span></summary>
              <p>${task.statement}</p>
              <p><strong>Ввод:</strong> ${task.input}</p>
              <p><strong>Вывод:</strong> ${task.output}</p>
              <p><strong>Подсказка:</strong> ${task.hint}</p>
              <pre class="code-block"><code>${highlight(task.solution)}</code></pre>
              <p>${task.explanation}</p>
            </details>`).join("")}
        </div>
      </section>`;
  }

  function renderInterviewTasks() {
    return `
      <section class="section" id="interview-tasks">
        <div class="section-heading"><span class="eyebrow">Собеседования</span><h2>Типичные технические задачи</h2></div>
        <div class="compact-list">
          ${course.advanced.interviewTasks.map(([title, why, approach]) => `
            <article>
              <strong>${title}</strong>
              <p>${why}</p>
              <p><strong>Разбор:</strong> ${approach}</p>
            </article>`).join("")}
        </div>
      </section>`;
  }

  function renderProjects() {
    return `
      <section class="section" id="real-projects">
        <div class="section-heading"><span class="eyebrow">Мини-проекты</span><h2>${course.advanced.projects.length} реальных проектов</h2></div>
        <div class="project-grid">
          ${course.advanced.projects.map((project) => `
            <article>
              <span>${project.type} · ${project.difficulty}</span>
              <h3>${project.title}</h3>
              <p>${project.goal}</p>
              <ul>${project.requirements.map((item) => `<li>${item}</li>`).join("")}</ul>
              <details><summary>План выполнения</summary><ol>${project.checklist.map((item) => `<li>${item}</li>`).join("")}</ol></details>
            </article>`).join("")}
        </div>
      </section>`;
  }

  function renderJobChecklist() {
    return `
      <section class="section" id="job-checklist">
        <div class="section-heading"><span class="eyebrow">Подготовка к работе</span><h2>Чек-лист Go-разработчика</h2></div>
        <div class="checklist">
          ${course.advanced.jobChecklist.map((item, index) => `
            <label>
              <input type="checkbox" data-job-check="${index}">
              <span>${item}</span>
            </label>`).join("")}
        </div>
      </section>`;
  }

  function attachChecklist() {
    const key = "goJuniorAcademy.jobChecklist.v1";
    const saved = JSON.parse(localStorage.getItem(key) || "[]");
    document.querySelectorAll("[data-job-check]").forEach((input) => {
      const id = Number(input.dataset.jobCheck);
      input.checked = saved.includes(id);
      input.addEventListener("change", () => {
        const current = new Set(JSON.parse(localStorage.getItem(key) || "[]"));
        if (input.checked) current.add(id);
        else current.delete(id);
        localStorage.setItem(key, JSON.stringify([...current]));
      });
    });
  }

  function renderSandbox() {
    const state = course.storage.read();
    const initialCode = state.sandbox || 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Practice Go")\n}';
    return `
      <section class="section sandbox" id="sandbox">
        <div class="section-heading"><span class="eyebrow">Песочница</span><h2>Локальный редактор Go</h2></div>
        <div class="editor-toolbar"><button id="load-example">Загрузить пример</button><button id="copy-code">Копировать</button><button id="clear-code">Очистить</button></div>
        <div class="editor"><pre id="line-numbers">1</pre><textarea id="sandbox-code" spellcheck="false">${escapeHtml(initialCode)}</textarea></div>
      </section>`;
  }

  function attachSandbox() {
    const editor = document.getElementById("sandbox-code");
    const lineNumbers = document.getElementById("line-numbers");
    if (!editor) return;
    const sync = () => {
      lineNumbers.textContent = editor.value.split("\n").map((_, index) => index + 1).join("\n");
      course.storage.saveSandbox(editor.value);
    };
    editor.addEventListener("input", sync);
    document.getElementById("load-example").addEventListener("click", () => {
      editor.value = course.lessons[0].examples[0].code;
      sync();
    });
    document.getElementById("copy-code").addEventListener("click", () => copyText(editor.value));
    document.getElementById("clear-code").addEventListener("click", () => {
      editor.value = "";
      sync();
    });
    sync();
  }

  function renderList(title, items, id) {
    return `
      <section class="section" id="${id}">
        <div class="section-heading"><span class="eyebrow">Дополнительно</span><h2>${title}</h2></div>
        <div class="compact-list">
          ${items.map((item) => Array.isArray(item) ? `<article><strong>${item[0]}</strong><p>${item[1]}</p></article>` : `<article><p>${item}</p></article>`).join("")}
        </div>
      </section>`;
  }

  function renderExtras() {
    const extras = course.extras;
    return [
      renderList("Шпаргалка Go", extras.cheat, "cheatsheet"),
      renderList("Горячие клавиши", extras.hotkeys, "hotkeys"),
      renderList("FAQ", extras.faq, "faq"),
      renderList("Типичные ошибки новичков", extras.mistakes, "mistakes"),
      renderList("RoadMap Go Developer", extras.roadmap, "roadmap"),
      renderList("Полезные ссылки", extras.links.map(([name, url]) => [name, `<a href="${url}">${url}</a>`]), "links")
    ].join("");
  }

  function renderHome() {
    const state = course.storage.read();
    const lastLesson = course.lessons.find((lesson) => lesson.id === state.lastLesson) || course.lessons[0];
    const questionCount = course.lessons.reduce((sum, lesson) => sum + lesson.questions.length, 0);
    const sections = [...new Set(course.lessons.map((lesson) => lesson.category))];

    const content = `
      <section class="hero">
        <div class="hero-copy">
          <span class="eyebrow">Локальный интерактивный учебник</span>
          <h1>Go с нуля до уверенного Junior</h1>
          <p>40 уроков, 320+ примеров кода, 400 вопросов, уровни, достижения, график прогресса, 500+ задач, проекты и чек-лист подготовки к работе.</p>
          <div class="hero-actions"><a class="primary" href="${lastLesson.file}">Продолжить обучение</a><a href="#daily-task">Задание дня</a><a href="#practice-500">500+ задач</a></div>
        </div>
        <div class="hero-terminal"><div class="dots"><i></i><i></i><i></i></div><pre><code>${highlight('package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, Go!")\n}')}</code></pre></div>
      </section>
      <section class="stats-grid">
        ${course.progressCard()}
        <article><strong>${course.lessons.length}</strong><span>уроков</span></article>
        <article><strong>${course.lessons.length}</strong><span>тестов</span></article>
        <article><strong>${questionCount}</strong><span>тестовых вопросов</span></article>
        <article><strong>${course.advanced.practiceTasks.length}</strong><span>практических задач</span></article>
      </section>
      ${renderLevelSystem(state)}
      ${renderAchievements(state)}
      ${renderProgressChart(state)}
      ${renderFavorites(state)}
      ${renderDailyTask()}
      <section class="section">
        <div class="section-heading"><span class="eyebrow">Разделы</span><h2>Программа обучения</h2></div>
        <div class="cards-grid">${sections.map((section) => `<article class="section-card"><span>${course.lessons.filter((lesson) => lesson.category === section).length} уроков</span><h3>${section}</h3><p>Теория, примеры, тесты и практика.</p></article>`).join("")}</div>
      </section>
      ${renderSandbox()}
      ${renderPracticeTasks()}
      ${renderInterviewTasks()}
      ${renderProjects()}
      ${renderJobChecklist()}
      ${renderExtras()}`;

    renderShell(content, state.lastLesson);
    attachSandbox();
    attachChecklist();
  }

  function renderExamples(lesson) {
    return `
      <section class="section" id="examples">
        <div class="section-heading"><span class="eyebrow">Примеры</span><h2>Карточки кода</h2></div>
        <div class="examples-grid">
          ${lesson.examples.map((example) => `
            <article class="example-card">
              <div class="example-head"><h3>${example.title}</h3><div><button data-copy="${example.id}">Копировать</button><button data-toggle="${example.id}">Развернуть</button></div></div>
              <pre id="${example.id}" class="code-block collapsed"><code>${highlight(example.code)}</code></pre>
              <button class="link-button" data-explain="${example.id}">Показать объяснение</button>
              <p class="example-explain" id="${example.id}-explain">${example.explanation}</p>
            </article>`).join("")}
        </div>
      </section>`;
  }

  function renderLesson() {
    const id = Number(document.body.dataset.lessonId);
    const lesson = course.lessons.find((item) => item.id === id);
    if (!lesson) return renderHome();
    course.storage.setLastLesson(id);
    const state = course.storage.read();
    const previous = course.lessons.find((item) => item.id === id - 1);
    const next = course.lessons.find((item) => item.id === id + 1);
    const favorite = state.favorites.includes(id);

    const content = `
      <article class="lesson">
        <nav class="breadcrumbs"><a href="../index.html">Главная</a><span>/</span><span>${lesson.title}</span></nav>
        <header class="lesson-hero"><span class="eyebrow">Урок ${String(id).padStart(2, "0")}</span><h1>${lesson.title}</h1><p>${lesson.summary}</p><button id="favorite-btn">${favorite ? "Убрать из избранного" : "В избранное"}</button></header>
        <section class="section theory"><div class="section-heading"><span class="eyebrow">Теория</span><h2>Ключевая идея</h2></div>${lesson.theory.map((paragraph) => `<p>${paragraph}</p>`).join("")}</section>
        <section class="diagram">${lesson.diagram.map((step, index) => `<article><span>${index + 1}</span><h3>${step.label}</h3><p>${step.detail}</p></article>`).join("")}</section>
        ${renderExamples(lesson)}
        <section class="section split"><article><h2>Объяснение строк</h2><ol>${lesson.lineByLine.map((line) => `<li>${line}</li>`).join("")}</ol></article><article><h2>Типичные ошибки</h2><ul>${lesson.mistakes.map((line) => `<li>${line}</li>`).join("")}</ul></article></section>
        <section class="section practice"><h2>Практическое задание</h2><p>${lesson.practice}</p><details><summary>Показать ответ</summary><p>${lesson.answer}</p></details></section>
        ${course.quiz.renderQuiz(lesson)}
        <section class="section"><div class="section-heading"><span class="eyebrow">Материалы</span><h2>Дополнительно</h2></div><div class="compact-list">${lesson.extra.map((url) => `<article><p><a href="${url}">${url}</a></p></article>`).join("")}</div></section>
        <section class="section notes"><h2>Мои заметки</h2><textarea id="lesson-note" placeholder="Запишите мысль, вопрос или ошибку.">${escapeHtml(state.notes[id] || "")}</textarea></section>
        <footer class="lesson-actions">${previous ? `<a href="${previous.file.split("/").pop()}">Назад</a>` : `<a href="../index.html">Главная</a>`}<button class="primary" id="complete-btn">Отметить как изучено</button>${next ? `<a href="${next.file.split("/").pop()}">Далее</a>` : `<a href="../index.html#real-projects">К проектам</a>`}</footer>
      </article>`;

    renderShell(content, id);
    attachLesson(lesson);
  }

  function attachLesson(lesson) {
    document.querySelectorAll("[data-copy]").forEach((button) => {
      button.addEventListener("click", () => {
        const example = lesson.examples.find((item) => item.id === button.dataset.copy);
        copyText(example.code).then(() => {
          button.textContent = "Скопировано";
          setTimeout(() => { button.textContent = "Копировать"; }, 1200);
        });
      });
    });
    document.querySelectorAll("[data-toggle]").forEach((button) => {
      button.addEventListener("click", () => {
        const block = document.getElementById(button.dataset.toggle);
        block.classList.toggle("collapsed");
        button.textContent = block.classList.contains("collapsed") ? "Развернуть" : "Свернуть";
      });
    });
    document.querySelectorAll(".link-button[data-explain]").forEach((button) => {
      button.addEventListener("click", () => document.getElementById(`${button.dataset.explain}-explain`).classList.toggle("show"));
    });
    document.getElementById("complete-btn").addEventListener("click", () => {
      course.storage.completeLesson(lesson.id);
      document.getElementById("complete-btn").textContent = "Изучено";
    });
    document.getElementById("favorite-btn").addEventListener("click", () => {
      course.storage.toggleFavorite(lesson.id);
      renderLesson();
    });
    document.getElementById("lesson-note").addEventListener("input", (event) => course.storage.saveNote(lesson.id, event.target.value));
    course.quiz.attach(lesson);
  }

  document.addEventListener("DOMContentLoaded", () => {
    if (document.body.dataset.page === "lesson") renderLesson();
    else renderHome();
  });
})();
