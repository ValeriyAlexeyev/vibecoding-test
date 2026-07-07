export const levels = [
  {
    id: "beginner",
    title: "Уровень 1: Новичок",
    short: "Новичок",
    focus: "Что такое сайт, HTML, CSS, основы JavaScript и простые страницы.",
    skills: ["Структура страницы", "Семантический HTML", "Базовый CSS", "Первые скрипты"]
  },
  {
    id: "junior",
    title: "Уровень 2: Junior",
    short: "Junior",
    focus: "Адаптивная верстка, формы, DOM, события, Git, GitHub и простые проекты.",
    skills: ["Responsive UI", "Формы", "DOM", "Git workflow"]
  },
  {
    id: "middle",
    title: "Уровень 3: Middle",
    short: "Middle",
    focus: "Архитектура проекта, компоненты, данные, модульный JavaScript, React, роутинг и состояние.",
    skills: ["Компоненты", "Модули", "React", "Состояние"]
  },
  {
    id: "senior",
    title: "Уровень 4: Senior",
    short: "Senior",
    focus: "Чистая архитектура, проектирование интерфейсов, оптимизация, безопасность, тестирование, review и лидерство.",
    skills: ["Архитектура", "Оптимизация", "Тестирование", "Лидерство"]
  }
];

export const lessons = [
  {
    id: "site-basics",
    title: "Что такое сайт и как работает браузер",
    level: "beginner",
    duration: "35 мин",
    description: "Разбираем путь от HTML-файла до отображения страницы в браузере.",
    theory: "Сайт состоит из файлов: HTML описывает структуру, CSS отвечает за внешний вид, JavaScript добавляет поведение. Браузер загружает эти файлы, строит DOM-дерево, применяет стили и запускает скрипты. Локальный сайт может работать без сервера, если ему не нужны сетевые запросы.",
    code: "<!doctype html>\n<html lang=\"ru\">\n  <head>\n    <meta charset=\"UTF-8\" />\n    <title>Моя первая страница</title>\n  </head>\n  <body>\n    <h1>Привет, веб!</h1>\n    <p>Это локальная HTML-страница.</p>\n  </body>\n</html>",
    practice: "Создай файл index.html, добавь заголовок, абзац о себе и список из трех целей обучения.",
    quiz: [
      {
        question: "За что отвечает HTML?",
        options: ["За структуру документа", "За хранение паролей", "За покупку домена", "За компиляцию браузера"],
        answer: 0
      },
      {
        question: "Что делает браузер с HTML?",
        options: ["Строит DOM", "Удаляет CSS", "Создает базу данных", "Пишет код вместо разработчика"],
        answer: 0
      },
      {
        question: "Может ли простой сайт работать локально?",
        options: ["Да, если файлы доступны браузеру", "Нет, всегда нужен облачный сервер", "Только с платным API", "Только с базой данных"],
        answer: 0
      }
    ]
  },
  {
    id: "html-semantics",
    title: "HTML: семантика и структура",
    level: "beginner",
    duration: "45 мин",
    description: "Учимся выбирать правильные теги для понятной и доступной страницы.",
    theory: "Семантические теги помогают браузеру, поисковым системам и ассистивным технологиям понимать смысл блоков. Вместо бесконечных div лучше использовать header, nav, main, section, article и footer там, где это уместно.",
    code: "<header>\n  <nav aria-label=\"Главная навигация\">\n    <a href=\"#about\">Обо мне</a>\n  </nav>\n</header>\n<main>\n  <section id=\"about\">\n    <h2>Обо мне</h2>\n    <p>Я изучаю веб-разработку.</p>\n  </section>\n</main>",
    practice: "Сверстай страницу личной карточки с header, main, section и footer.",
    quiz: [
      {
        question: "Какой тег лучше подходит для главного содержимого страницы?",
        options: ["main", "span", "b", "script"],
        answer: 0
      },
      {
        question: "Зачем нужна семантика?",
        options: ["Чтобы структура была понятнее людям и программам", "Чтобы убрать CSS", "Чтобы сайт работал только онлайн", "Чтобы запретить JavaScript"],
        answer: 0
      },
      {
        question: "Где обычно размещают навигацию?",
        options: ["nav", "strong", "code", "small"],
        answer: 0
      }
    ]
  },
  {
    id: "css-layout",
    title: "CSS: визуальная система страницы",
    level: "beginner",
    duration: "50 мин",
    description: "Цвета, отступы, сетки, карточки и базовая адаптивность.",
    theory: "CSS превращает структуру в интерфейс. Для современного макета часто используют flexbox и grid. Хорошая система отступов, читаемые размеры шрифта и переменные цветов делают дизайн последовательным и легким для изменения.",
    code: ":root {\n  --accent: #2563eb;\n  --surface: #ffffff;\n}\n.card {\n  display: grid;\n  gap: 12px;\n  padding: 20px;\n  border: 1px solid #dbe3ef;\n  border-radius: 8px;\n}",
    practice: "Стилизуй личную карточку: добавь фон, ограничь ширину, оформи кнопки и сделай сетку навыков.",
    quiz: [
      {
        question: "Что удобнее для двухмерной сетки?",
        options: ["CSS Grid", "alert", "localStorage", "meta"],
        answer: 0
      },
      {
        question: "Зачем нужны CSS-переменные?",
        options: ["Для переиспользования значений", "Для отправки запросов", "Для создания HTML", "Для запуска тестов"],
        answer: 0
      },
      {
        question: "Что делает padding?",
        options: ["Внутренний отступ", "Внешнюю ссылку", "Загрузку файла", "Сортировку массива"],
        answer: 0
      }
    ]
  },
  {
    id: "js-basics",
    title: "JavaScript: первые действия",
    level: "beginner",
    duration: "55 мин",
    description: "Переменные, функции, условия и простая реакция интерфейса.",
    theory: "JavaScript добавляет странице поведение. Он может читать элементы DOM, реагировать на действия пользователя, менять текст, классы и данные. На старте важно понять переменные, функции, условия и события.",
    code: "const button = document.querySelector(\"button\");\nconst title = document.querySelector(\"h1\");\n\nbutton.addEventListener(\"click\", () => {\n  title.textContent = \"JavaScript работает!\";\n});",
    practice: "Добавь кнопку, которая меняет текст заголовка и переключает класс у карточки.",
    quiz: [
      {
        question: "Как подписаться на клик?",
        options: ["addEventListener(\"click\", handler)", "listen.click()", "onDatabase()", "css.click()"],
        answer: 0
      },
      {
        question: "Что такое функция?",
        options: ["Переиспользуемый блок действий", "CSS-цвет", "HTML-тег", "Файл проекта"],
        answer: 0
      },
      {
        question: "Что возвращает querySelector?",
        options: ["Первый подходящий элемент", "Все сайты интернета", "Новый браузер", "Пароль пользователя"],
        answer: 0
      }
    ]
  },
  {
    id: "responsive-forms",
    title: "Адаптивность и формы",
    level: "junior",
    duration: "60 мин",
    description: "Делаем интерфейс удобным на телефоне и собираем данные формы без сервера.",
    theory: "Адаптивная верстка подстраивается под ширину экрана. Формы дают пользователю способ вводить данные. Даже без сервера можно валидировать поля, показывать ошибки и сохранять черновик в localStorage.",
    code: "const form = document.querySelector(\"form\");\nform.addEventListener(\"submit\", (event) => {\n  event.preventDefault();\n  const data = new FormData(form);\n  localStorage.setItem(\"profile\", JSON.stringify(Object.fromEntries(data)));\n});",
    practice: "Сделай форму профиля с именем, email и целью обучения. Добавь адаптивную сетку и сохранение черновика.",
    quiz: [
      {
        question: "Что делает event.preventDefault() в submit?",
        options: ["Останавливает стандартную отправку формы", "Удаляет HTML", "Меняет язык браузера", "Создает API"],
        answer: 0
      },
      {
        question: "Где локально хранить небольшой прогресс?",
        options: ["localStorage", "Платный сервер", "В CSS", "В теге h1"],
        answer: 0
      },
      {
        question: "Что помогает адаптивности?",
        options: ["Media queries", "Только фиксированная ширина 1440px", "Удаление viewport", "Один огромный шрифт"],
        answer: 0
      }
    ]
  },
  {
    id: "dom-events-git",
    title: "DOM, события и Git-подход",
    level: "junior",
    duration: "70 мин",
    description: "Управляем элементами страницы и учимся мыслить маленькими изменениями.",
    theory: "DOM позволяет создавать, удалять и изменять элементы. События связывают интерфейс с действиями пользователя. Git помогает сохранять историю работы: маленькие осмысленные коммиты проще проверять, откатывать и обсуждать.",
    code: "const list = document.querySelector(\".tasks\");\nconst item = document.createElement(\"li\");\nitem.textContent = \"Сделать коммит\";\nlist.append(item);\n\n// Git: git add . && git commit -m \"Add task list\"",
    practice: "Собери список задач: добавление, отметка выполнения и удаление элемента. Опиши, какими коммитами разбил бы работу.",
    quiz: [
      {
        question: "Как создать DOM-элемент?",
        options: ["document.createElement(\"li\")", "new HTML(\"li\")", "css.create()", "git element"],
        answer: 0
      },
      {
        question: "Для чего нужен Git?",
        options: ["Для истории изменений", "Для замены HTML", "Для покупки хостинга", "Для запуска браузера"],
        answer: 0
      },
      {
        question: "Что такое событие?",
        options: ["Действие или сигнал в интерфейсе", "Только ошибка", "CSS-селектор", "JSON-файл"],
        answer: 0
      }
    ]
  },
  {
    id: "modular-react",
    title: "Модули, компоненты и React",
    level: "middle",
    duration: "80 мин",
    description: "Разбиваем интерфейс на компоненты и управляем состоянием.",
    theory: "На уровне Middle проект становится системой. Компоненты отвечают за отдельные части интерфейса, модули разделяют данные и логику, состояние описывает текущий снимок приложения. React помогает декларативно связывать состояние с UI.",
    code: "function LessonCard({ lesson, done, onToggle }) {\n  return (\n    <article className=\"lesson-card\">\n      <h3>{lesson.title}</h3>\n      <p>{lesson.description}</p>\n      <button onClick={() => onToggle(lesson.id)}>\n        {done ? \"Пройден\" : \"Отметить\"}\n      </button>\n    </article>\n  );\n}",
    practice: "Создай компонент карточки урока, передай данные через props и добавь кнопку изменения состояния.",
    quiz: [
      {
        question: "Что такое props в React?",
        options: ["Данные, переданные компоненту", "База данных", "CSS-анимация", "Команда терминала"],
        answer: 0
      },
      {
        question: "Зачем делить проект на модули?",
        options: ["Чтобы уменьшить связанность и упростить поддержку", "Чтобы скрыть все файлы", "Чтобы отключить тесты", "Чтобы писать все в index.html"],
        answer: 0
      },
      {
        question: "Что такое состояние приложения?",
        options: ["Данные, от которых зависит интерфейс", "Только цвет кнопки", "Название папки", "Тип шрифта"],
        answer: 0
      }
    ]
  },
  {
    id: "senior-engineering",
    title: "Senior: архитектура, качество и лидерство",
    level: "senior",
    duration: "90 мин",
    description: "Смотрим на продукт целиком: архитектура, review, безопасность, тестирование и решения.",
    theory: "Senior-разработчик проектирует не только код, но и процесс. Он думает о границах ответственности, доступности, производительности, безопасности, тестируемости и командной ясности. Хорошее решение объяснимо, измеримо и не усложняет систему без причины.",
    code: "const userCanEdit = ({ user, document }) => {\n  if (!user || !document) return false;\n  if (user.role === \"admin\") return true;\n  return document.ownerId === user.id && document.status !== \"archived\";\n};\n\nexport const policy = { userCanEdit };",
    practice: "Проведи code review учебного компонента: найди риски доступности, производительности, безопасности и поддержки.",
    quiz: [
      {
        question: "Что важнее всего в code review?",
        options: ["Найти риски и улучшить качество без потери уважения", "Переименовать все переменные по вкусу", "Удалить тесты", "Сделать код максимально сложным"],
        answer: 0
      },
      {
        question: "Что такое чистая архитектура?",
        options: ["Ясные границы ответственности и независимость важной логики", "Один файл на весь проект", "Только белый фон", "Запрет компонентов"],
        answer: 0
      },
      {
        question: "Почему безопасность нужна даже учебному проекту?",
        options: ["Она формирует правильные привычки", "Она заменяет HTML", "Она нужна только банкам", "Она выключает браузер"],
        answer: 0
      }
    ]
  }
];

export const practiceTasks = [
  { title: "Личная страница", level: "beginner", text: "Сверстай страницу о себе с фото-заглушкой, списком навыков и кнопкой связи." },
  { title: "Карточка товара", level: "beginner", text: "Сделай карточку с названием, описанием, ценой и состояниями кнопки." },
  { title: "Форма регистрации", level: "junior", text: "Добавь валидацию email, подсказки ошибок и сохранение черновика." },
  { title: "Список задач", level: "junior", text: "Реализуй добавление, фильтр активных задач и сохранение в localStorage." },
  { title: "Каталог уроков", level: "middle", text: "Разбей каталог на компоненты, добавь поиск и фильтр по уровню." },
  { title: "Code review", level: "senior", text: "Опиши 10 замечаний к учебному компоненту: баги, доступность, тесты, безопасность." }
];

export const miniProjects = [
  "Личная страница",
  "Калькулятор",
  "Список задач",
  "Погодный интерфейс без API, только макет",
  "Лендинг компании",
  "Dashboard",
  "Учебный блог",
  "Портфолио разработчика"
].map((title, index) => ({
  id: `project-${index + 1}`,
  title,
  stack: index < 2 ? "HTML/CSS/JS" : index < 5 ? "DOM/localStorage" : "React/components",
  steps: ["Собери структуру", "Добавь стили и адаптивность", "Подключи интерактивность", "Проверь на мобильной ширине"]
}));

export const reference = [
  { area: "HTML", title: "Семантические блоки", body: "header, nav, main, section, article, aside и footer помогают описать смысл страницы." },
  { area: "HTML", title: "Формы", body: "label связывается с input через htmlFor/id, а required и type помогают базовой валидации." },
  { area: "CSS", title: "Flexbox", body: "Подходит для одномерного расположения элементов: строка или колонка." },
  { area: "CSS", title: "Grid", body: "Подходит для сеток с рядами и колонками, карточек и dashboard-интерфейсов." },
  { area: "JS", title: "DOM", body: "querySelector, classList и addEventListener позволяют управлять интерфейсом." },
  { area: "JS", title: "localStorage", body: "Хранит строки в браузере. Объекты сохраняют через JSON.stringify и читают через JSON.parse." }
];

export const finalProjects = [
  "Платформа личного обучения с прогрессом",
  "Портфолио с блогом и фильтрами проектов",
  "Dashboard привычек с графиками без внешних API",
  "Мини CRM-макет с таблицами, формами и состояниями"
];
