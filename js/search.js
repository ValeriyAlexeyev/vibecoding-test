(function () {
  function normalize(text) {
    return String(text).toLowerCase().trim();
  }

  function buildIndex() {
    const course = window.GoCourse;
    const lessonIndex = course.lessons.flatMap((lesson) => [
      {
        type: "Урок",
        title: lesson.title,
        text: [lesson.title, lesson.summary, lesson.keywords.join(" ")].join(" "),
        href: course.pathPrefix + lesson.file
      },
      ...lesson.examples.map((example) => ({
        type: "Пример",
        title: example.title,
        text: [example.code, example.explanation, example.tags.join(" ")].join(" "),
        href: course.pathPrefix + lesson.file + "#examples"
      }))
    ]);

    const advanced = course.advanced || { practiceTasks: [], interviewTasks: [], projects: [] };
    const taskIndex = advanced.practiceTasks.slice(0, 120).map((task) => ({
      type: "Задача",
      title: task.title,
      text: [task.statement, task.hint, task.tags.join(" ")].join(" "),
      href: course.pathPrefix + "index.html#practice-500"
    }));
    const interviewIndex = advanced.interviewTasks.map(([title, why, approach]) => ({
      type: "Собеседование",
      title,
      text: [title, why, approach].join(" "),
      href: course.pathPrefix + "index.html#interview-tasks"
    }));
    const projectIndex = advanced.projects.map((project) => ({
      type: "Проект",
      title: project.title,
      text: [project.type, project.difficulty, project.goal, project.requirements.join(" ")].join(" "),
      href: course.pathPrefix + "index.html#real-projects"
    }));

    return [...lessonIndex, ...taskIndex, ...interviewIndex, ...projectIndex];
  }

  window.GoCourse = window.GoCourse || {};
  window.GoCourse.search = {
    attach() {
      const input = document.getElementById("global-search");
      if (!input) return;

      const panel = document.createElement("div");
      panel.className = "search-results";
      input.closest(".searchbox").appendChild(panel);
      const index = buildIndex();

      input.addEventListener("input", () => {
        const query = normalize(input.value);
        panel.innerHTML = query.length < 2
          ? ""
          : (index
            .filter((item) => normalize(item.text).includes(query))
            .slice(0, 12)
            .map((item) => `<a href="${item.href}"><span>${item.type}</span><strong>${item.title}</strong></a>`)
            .join("") || "<p>Ничего не найдено</p>");
      });

      document.addEventListener("keydown", (event) => {
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
          event.preventDefault();
          input.focus();
        }
      });
    }
  };
})();
