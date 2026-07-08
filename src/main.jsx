import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  codeChecklists,
  commonMistakes,
  finalProject,
  lessons,
  levels,
  practiceTasks,
  projects,
  promptLibrary
} from "./data/course.js";
import "./styles/main.css";

const STORAGE_KEY = "vibe-coding-academy-state";

const defaultState = {
  completedLessons: [],
  completedTasks: [],
  quizScores: {},
  projectNotes: "",
  agentMessages: [
    {
      role: "agent",
      text: "Привет! Я локальный AI-агент Vibe Coding Academy. Я не использую внешние API, но могу помочь по материалам курса: подобрать следующий урок, улучшить промт, разобрать ошибку, дать практику или подготовить план финального проекта."
    }
  ]
};

function readState() {
  try {
    return { ...defaultState, ...JSON.parse(localStorage.getItem(STORAGE_KEY)) };
  } catch {
    return defaultState;
  }
}

function App() {
  const [state, setState] = useState(readState);
  const [section, setSection] = useState("home");
  const [selectedLessonId, setSelectedLessonId] = useState(lessons[0].id);
  const [levelFilter, setLevelFilter] = useState("all");
  const [lessonQuery, setLessonQuery] = useState("");
  const [promptQuery, setPromptQuery] = useState("");

  const selectedLesson = lessons.find((lesson) => lesson.id === selectedLessonId) || lessons[0];
  const completed = new Set(state.completedLessons);
  const progress = Math.round((state.completedLessons.length / lessons.length) * 100);

  const filteredLessons = useMemo(() => {
    const query = lessonQuery.trim().toLowerCase();
    return lessons.filter((lesson) => {
      const matchesLevel = levelFilter === "all" || lesson.level === levelFilter;
      const searchable = `${lesson.title} ${lesson.course} ${lesson.goal} ${lesson.theory} ${lesson.aiPrompt}`.toLowerCase();
      return matchesLevel && searchable.includes(query);
    });
  }, [levelFilter, lessonQuery]);

  const filteredPrompts = useMemo(() => {
    const query = promptQuery.trim().toLowerCase();
    return promptLibrary.filter((prompt) => `${prompt.category} ${prompt.title} ${prompt.text}`.toLowerCase().includes(query));
  }, [promptQuery]);

  function save(patch) {
    setState((current) => {
      const next = { ...current, ...patch };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }

  function toggleLesson(id) {
    const next = completed.has(id)
      ? state.completedLessons.filter((lessonId) => lessonId !== id)
      : [...state.completedLessons, id];
    save({ completedLessons: next });
  }

  function toggleTask(title) {
    const exists = state.completedTasks.includes(title);
    save({
      completedTasks: exists ? state.completedTasks.filter((task) => task !== title) : [...state.completedTasks, title]
    });
  }

  const screens = {
    home: <Home progress={progress} onNavigate={setSection} />,
    dashboard: <Dashboard state={state} progress={progress} />,
    courses: <Courses completed={completed} onOpenLesson={(id) => { setSelectedLessonId(id); setSection("lessons"); }} />,
    lessons: (
      <Lessons
        lessons={filteredLessons}
        selectedLesson={selectedLesson}
        completed={completed}
        levelFilter={levelFilter}
        lessonQuery={lessonQuery}
        onFilter={setLevelFilter}
        onSearch={setLessonQuery}
        onSelect={setSelectedLessonId}
        onToggle={toggleLesson}
        score={state.quizScores[selectedLesson.id]}
        onScore={(score) => save({ quizScores: { ...state.quizScores, [selectedLesson.id]: score } })}
      />
    ),
    practice: <Practice completedTasks={state.completedTasks} onToggle={toggleTask} />,
    agent: (
      <AIAgent
        messages={state.agentMessages}
        progress={progress}
        state={state}
        selectedLesson={selectedLesson}
        onMessages={(agentMessages) => save({ agentMessages })}
        onOpenLesson={(id) => {
          setSelectedLessonId(id);
          setSection("lessons");
        }}
      />
    ),
    prompts: <Prompts prompts={filteredPrompts} query={promptQuery} onQuery={setPromptQuery} />,
    checklists: <Checklists />,
    tests: <Tests scores={state.quizScores} />,
    projects: <Projects notes={state.projectNotes} onNotes={(projectNotes) => save({ projectNotes })} />,
    mistakes: <Mistakes />,
    final: <FinalProject />
  };

  return (
    <div className="app-shell">
      <Sidebar active={section} onNavigate={setSection} />
      <main className="workspace">
        <Topbar progress={progress} />
        {screens[section]}
      </main>
    </div>
  );
}

function Sidebar({ active, onNavigate }) {
  const items = [
    ["home", "Главная"],
    ["dashboard", "Дашборд"],
    ["courses", "Каталог курсов"],
    ["lessons", "Уроки"],
    ["practice", "Практика"],
    ["agent", "AI-агент"],
    ["prompts", "Промты"],
    ["checklists", "Чек-листы"],
    ["tests", "Мини-тесты"],
    ["projects", "Мои проекты"],
    ["mistakes", "Типовые ошибки"],
    ["final", "Финальный проект"]
  ];

  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark">VC</span>
        <div>
          <strong>Vibe Coding Academy</strong>
          <small>AI-first разработка</small>
        </div>
      </div>
      <nav aria-label="Разделы платформы">
        {items.map(([id, label]) => (
          <button className={active === id ? "active" : ""} key={id} type="button" onClick={() => onNavigate(id)}>
            {label}
          </button>
        ))}
      </nav>
    </aside>
  );
}

function Topbar({ progress }) {
  return (
    <header className="topbar">
      <div>
        <span className="eyebrow">Локально. Бесплатно. Без API и базы данных.</span>
        <h1>Vibe Coding Academy</h1>
      </div>
      <div className="progress-widget" aria-label={`Прогресс обучения ${progress}%`}>
        <strong>{progress}%</strong>
        <span><i style={{ width: `${progress}%` }} /></span>
      </div>
    </header>
  );
}

function Home({ progress, onNavigate }) {
  return (
    <section className="home-grid">
      <article className="hero-panel">
        <span className="eyebrow">Путь от новичка до уверенного разработчика</span>
        <h2>Учись создавать сайты и приложения с ИИ, но понимай, что именно ты строишь.</h2>
        <p>
          Платформа ведет по простому маршруту: промты, HTML, CSS, JavaScript, отладка, проекты и финальная работа.
          Все данные лежат локально, прогресс сохраняется в браузере.
        </p>
        <div className="button-row">
          <button className="primary" type="button" onClick={() => onNavigate("lessons")}>Начать уроки</button>
          <button type="button" onClick={() => onNavigate("dashboard")}>Открыть дашборд</button>
        </div>
      </article>
      <article className="learning-map">
        {levels.map((level, index) => (
          <div key={level.id}>
            <span>{index + 1}</span>
            <h3>{level.label}</h3>
            <p>{level.description}</p>
          </div>
        ))}
      </article>
      <Metric label="Общий прогресс" value={`${progress}%`} />
      <Metric label="Уроков" value={lessons.length} />
      <Metric label="Практик" value={practiceTasks.length} />
      <Metric label="Промтов" value={promptLibrary.length} />
    </section>
  );
}

function Dashboard({ state, progress }) {
  const nextLesson = lessons.find((lesson) => !state.completedLessons.includes(lesson.id)) || lessons.at(-1);
  return (
    <section className="section">
      <SectionTitle kicker="Дашборд ученика" title="Твой учебный маршрут" />
      <div className="metric-grid">
        <Metric label="Пройдено уроков" value={`${state.completedLessons.length}/${lessons.length}`} />
        <Metric label="Практик закрыто" value={`${state.completedTasks.length}/${practiceTasks.length}`} />
        <Metric label="Тестов решено" value={Object.keys(state.quizScores).length} />
        <Metric label="Прогресс" value={`${progress}%`} />
      </div>
      <article className="next-card">
        <span className="eyebrow">Следующий разумный шаг</span>
        <h3>{nextLesson.title}</h3>
        <p>{nextLesson.goal}</p>
      </article>
    </section>
  );
}

function Courses({ completed, onOpenLesson }) {
  return (
    <section className="section">
      <SectionTitle kicker="Каталог курсов" title="10 тем, которые собираются в один практический путь" />
      <div className="course-grid">
        {lessons.map((lesson, index) => (
          <article key={lesson.id}>
            <span>{String(index + 1).padStart(2, "0")} · {levelLabel(lesson.level)}</span>
            <h3>{lesson.course}</h3>
            <p>{lesson.goal}</p>
            <button type="button" onClick={() => onOpenLesson(lesson.id)}>
              {completed.has(lesson.id) ? "Повторить" : "Открыть"}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function Lessons(props) {
  const { lessons: visibleLessons, selectedLesson, completed, levelFilter, lessonQuery, onFilter, onSearch, onSelect, onToggle, score, onScore } = props;
  return (
    <section className="lessons-layout">
      <aside className="lesson-panel">
        <SectionTitle kicker="Уроки" title="Выбери тему" />
        <div className="filters">
          <input value={lessonQuery} onChange={(event) => onSearch(event.target.value)} placeholder="Поиск по урокам и промтам" />
          <select value={levelFilter} onChange={(event) => onFilter(event.target.value)} aria-label="Фильтр уровня">
            <option value="all">Все уровни</option>
            {levels.map((level) => <option key={level.id} value={level.id}>{level.label}</option>)}
          </select>
        </div>
        <div className="lesson-list">
          {visibleLessons.map((lesson) => (
            <button className={selectedLesson.id === lesson.id ? "lesson-card active" : "lesson-card"} key={lesson.id} type="button" onClick={() => onSelect(lesson.id)}>
              <span>{levelLabel(lesson.level)}</span>
              <strong>{lesson.title}</strong>
              <small>{completed.has(lesson.id) ? "Завершен" : lesson.course}</small>
            </button>
          ))}
        </div>
      </aside>
      <LessonReader lesson={selectedLesson} done={completed.has(selectedLesson.id)} onToggle={onToggle} score={score} onScore={onScore} />
    </section>
  );
}

function LessonReader({ lesson, done, onToggle, score, onScore }) {
  return (
    <article className="reader">
      <div className="reader-head">
        <div>
          <span className="eyebrow">{lesson.course} · {levelLabel(lesson.level)}</span>
          <h2>{lesson.title}</h2>
          <p>{lesson.goal}</p>
        </div>
        <button className={done ? "success" : "primary"} type="button" onClick={() => onToggle(lesson.id)}>
          {done ? "Урок завершен" : "Отметить завершенным"}
        </button>
      </div>
      <ContentBlock title="Краткая теория">{lesson.theory}</ContentBlock>
      <ContentBlock title="Пример промта для ИИ">
        <pre className="prompt-box">{lesson.aiPrompt}</pre>
      </ContentBlock>
      <ContentBlock title="Пример кода">
        <pre className="code-block">{lesson.code}</pre>
      </ContentBlock>
      <ContentBlock title="Практическое задание">{lesson.practice}</ContentBlock>
      <ContentBlock title="Чек-лист проверки">
        <Checklist items={lesson.checklist} />
      </ContentBlock>
      <Quiz lesson={lesson} score={score} onScore={onScore} />
    </article>
  );
}

function Quiz({ lesson, score, onScore }) {
  const [answers, setAnswers] = useState({});

  function checkQuiz() {
    const result = lesson.quiz.reduce((sum, item, index) => sum + (Number(answers[index]) === item.answer ? 1 : 0), 0);
    onScore(result);
  }

  return (
    <ContentBlock title="Мини-тест">
      <div className="quiz">
        {lesson.quiz.map((item, index) => (
          <fieldset key={item.text}>
            <legend>{item.text}</legend>
            {item.options.map((option, optionIndex) => (
              <label key={option}>
                <input
                  type="radio"
                  name={`${lesson.id}-${index}`}
                  checked={Number(answers[index]) === optionIndex}
                  onChange={() => setAnswers({ ...answers, [index]: optionIndex })}
                />
                {option}
              </label>
            ))}
          </fieldset>
        ))}
        <button className="primary" type="button" onClick={checkQuiz}>Проверить ответы</button>
        {score !== undefined && <p className="quiz-result">Результат: {score} из {lesson.quiz.length}</p>}
      </div>
    </ContentBlock>
  );
}

function Practice({ completedTasks, onToggle }) {
  return (
    <section className="section">
      <SectionTitle kicker="Практические задания" title="Закрепляй навык руками" />
      <div className="task-grid">
        {practiceTasks.map((task) => (
          <label className="task-card" key={task.title}>
            <input type="checkbox" checked={completedTasks.includes(task.title)} onChange={() => onToggle(task.title)} />
            <span>
              <strong>{task.title}</strong>
              <small>{levelLabel(task.level)}</small>
              <p>{task.text}</p>
            </span>
          </label>
        ))}
      </div>
    </section>
  );
}

function AIAgent({ messages, progress, state, selectedLesson, onMessages, onOpenLesson }) {
  const [draft, setDraft] = useState("");
  const nextLesson = getNextLesson(state);
  const quickPrompts = [
    "Что учить дальше?",
    "Помоги написать промт",
    "Как исправлять ошибки?",
    "Дай практическое задание",
    "План финального проекта"
  ];

  function sendMessage(text = draft) {
    const cleanText = text.trim();
    if (!cleanText) return;

    const userMessage = { role: "user", text: cleanText };
    const agentMessage = {
      role: "agent",
      text: generateAgentReply(cleanText, { progress, state, selectedLesson, nextLesson })
    };

    onMessages([...(messages || defaultState.agentMessages), userMessage, agentMessage]);
    setDraft("");
  }

  function resetChat() {
    onMessages(defaultState.agentMessages);
  }

  return (
    <section className="section agent-section">
      <SectionTitle kicker="Локальный AI-агент" title="Наставник по vibe coding без внешних API" />
      <div className="agent-layout">
        <article className="agent-summary">
          <span className="agent-avatar">AI</span>
          <h3>Что умеет агент</h3>
          <p>
            Он работает на правилах и данных курса: анализирует твой прогресс, текущий урок, практики и типовые ошибки.
            Это не подключение к облачной модели, а безопасный локальный помощник для обучения.
          </p>
          <div className="agent-stats">
            <span>{progress}% прогресс</span>
            <span>{state.completedLessons.length}/{lessons.length} уроков</span>
            <span>{Object.keys(state.quizScores).length} тестов</span>
          </div>
          <div className="next-card compact">
            <span className="eyebrow">Рекомендация</span>
            <h3>{nextLesson.title}</h3>
            <p>{nextLesson.goal}</p>
            <button type="button" className="primary" onClick={() => onOpenLesson(nextLesson.id)}>Открыть урок</button>
          </div>
        </article>

        <article className="agent-chat">
          <div className="agent-messages" aria-live="polite">
            {(messages || defaultState.agentMessages).map((message, index) => (
              <div className={`agent-message ${message.role}`} key={`${message.role}-${index}`}>
                <span>{message.role === "agent" ? "AI-агент" : "Вы"}</span>
                <p>{message.text}</p>
              </div>
            ))}
          </div>
          <div className="agent-prompts">
            {quickPrompts.map((prompt) => (
              <button type="button" key={prompt} onClick={() => sendMessage(prompt)}>{prompt}</button>
            ))}
          </div>
          <form
            className="agent-form"
            onSubmit={(event) => {
              event.preventDefault();
              sendMessage();
            }}
          >
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Спроси про промт, ошибку, практику, следующий урок или финальный проект"
            />
            <button className="primary" type="submit">Спросить</button>
            <button type="button" onClick={resetChat}>Очистить</button>
          </form>
        </article>
      </div>
    </section>
  );
}

function normalizeText(value) {
  return value.toLowerCase().replaceAll("ё", "е");
}

function getNextLesson(state) {
  return lessons.find((lesson) => !state.completedLessons.includes(lesson.id)) || lessons[lessons.length - 1];
}

function findRelevantLesson(message, fallbackLesson) {
  const queryWords = normalizeText(message).split(/\s+/).filter((word) => word.length > 3);
  return lessons.find((lesson) => {
    const text = normalizeText(`${lesson.title} ${lesson.course} ${lesson.goal} ${lesson.theory} ${lesson.aiPrompt}`);
    return queryWords.some((word) => text.includes(word));
  }) || fallbackLesson;
}

function generateAgentReply(message, context) {
  const text = normalizeText(message);
  const relevantLesson = findRelevantLesson(message, context.selectedLesson);
  const unfinishedTask = practiceTasks.find((task) => !context.state.completedTasks.includes(task.title)) || practiceTasks[0];
  const bestPrompt = promptLibrary.find((prompt) => {
    const source = normalizeText(`${prompt.category} ${prompt.title} ${prompt.text}`);
    return text.split(/\s+/).some((word) => word.length > 3 && source.includes(word));
  }) || promptLibrary[0];

  if (text.includes("дальше") || text.includes("след") || text.includes("маршрут") || text.includes("учить")) {
    return `Сейчас прогресс ${context.progress}%. Следующий полезный шаг - урок «${context.nextLesson.title}». Цель: ${context.nextLesson.goal} После него сделай практику: ${context.nextLesson.practice}`;
  }

  if (text.includes("промт") || text.includes("prompt") || text.includes("запрос")) {
    return `Возьми структуру: роль + цель + контекст + ограничения + формат результата + критерии проверки. Для твоей темы подойдет такой старт: «${relevantLesson.aiPrompt}». Еще полезный шаблон из библиотеки: «${bestPrompt.text}»`;
  }

  if (text.includes("ошиб") || text.includes("баг") || text.includes("не работает") || text.includes("слом")) {
    return "Иди по спокойному алгоритму: 1. Воспроизведи ошибку. 2. Скопируй первое сообщение из консоли. 3. Опиши, что ожидалось и что получилось. 4. Попроси ИИ минимальное исправление, а не переписывание всего проекта. Частая проверка: селектор нашел элемент, скрипт подключен после HTML, localStorage читается с запасным значением.";
  }

  if (text.includes("практик") || text.includes("задани") || text.includes("трен")) {
    return `Практика на сейчас: «${unfinishedTask.title}». ${unfinishedTask.text} Критерий готовности: результат можно открыть в браузере, проверить по чек-листу и объяснить своими словами.`;
  }

  if (text.includes("финал") || text.includes("проект")) {
    return `Финальный проект лучше вести в 6 шагов: 1. Описать пользователя и цель. 2. Выбрать экраны. 3. Подготовить локальные данные. 4. Собрать интерфейс. 5. Добавить localStorage. 6. Проверить по README и чек-листам. Тема из курса: «${finalProject.title}».`;
  }

  if (text.includes("html") || text.includes("css") || text.includes("javascript") || text.includes("js")) {
    return `По этому вопросу ближе всего урок «${relevantLesson.title}». Главное в нем: ${relevantLesson.goal} Начни с примера кода, затем выполни практику: ${relevantLesson.practice}`;
  }

  if (text.includes("ревью") || text.includes("проверь") || text.includes("качество")) {
    return "Для ревью проверь 4 слоя: HTML-семантика, CSS-адаптивность, JS-ошибки в консоли и качество промта. Если хочешь, пришли в заметки проекта список проблем, а потом спроси меня: «как улучшить ревью проекта».";
  }

  return `Я бы начал с урока «${context.nextLesson.title}»: ${context.nextLesson.goal} Если хочешь точнее, спроси меня одним из форматов: «помоги с промтом», «дай практику», «как исправить ошибку» или «план финального проекта».`;
}

function Prompts({ prompts, query, onQuery }) {
  return (
    <section className="section">
      <SectionTitle kicker="Библиотека промтов" title="Готовые формулировки для AI-first работы" />
      <div className="filters single">
        <input value={query} onChange={(event) => onQuery(event.target.value)} placeholder="Поиск по промтам" />
      </div>
      <div className="prompt-grid">
        {prompts.map((prompt) => (
          <article key={prompt.title}>
            <span>{prompt.category}</span>
            <h3>{prompt.title}</h3>
            <p>{prompt.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Checklists() {
  return (
    <section className="section">
      <SectionTitle kicker="Чек-листы проверки кода" title="Перед тем как считать задачу готовой" />
      <div className="checklist-grid">
        {codeChecklists.map((group) => (
          <article key={group.title}>
            <h3>{group.title}</h3>
            <Checklist items={group.items} />
          </article>
        ))}
      </div>
    </section>
  );
}

function Tests({ scores }) {
  return (
    <section className="section">
      <SectionTitle kicker="Мини-тесты" title="Быстрая проверка понимания" />
      <div className="table-list">
        {lessons.map((lesson) => (
          <article key={lesson.id}>
            <strong>{lesson.title}</strong>
            <span>{scores[lesson.id] === undefined ? "Не пройден" : `${scores[lesson.id]} / ${lesson.quiz.length}`}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

function Projects({ notes, onNotes }) {
  return (
    <section className="section">
      <SectionTitle kicker="Мои проекты" title="Учебное портфолио и заметки" />
      <div className="project-grid">
        {projects.map((project) => (
          <article key={project.title}>
            <span>{project.status} · {project.stack}</span>
            <h3>{project.title}</h3>
            <p>{project.goal}</p>
          </article>
        ))}
      </div>
      <label className="notes">
        <span>Заметки по своим проектам</span>
        <textarea value={notes} onChange={(event) => onNotes(event.target.value)} placeholder="Например: что хочу собрать, какие промты сработали, какие ошибки нашел..." />
      </label>
    </section>
  );
}

function Mistakes() {
  return (
    <section className="section">
      <SectionTitle kicker="Типовые ошибки" title="Что чаще всего мешает новичку" />
      <div className="mistake-list">
        {commonMistakes.map((mistake) => (
          <article key={mistake.title}>
            <h3>{mistake.title}</h3>
            <p>{mistake.fix}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function FinalProject() {
  return (
    <section className="section final-project">
      <SectionTitle kicker="Финальный проект" title={finalProject.title} />
      <p>{finalProject.brief}</p>
      <div className="final-columns">
        <article>
          <h3>Что сдать</h3>
          <Checklist items={finalProject.deliverables} />
        </article>
        <article>
          <h3>Критерии готовности</h3>
          <Checklist items={finalProject.acceptance} />
        </article>
      </div>
    </section>
  );
}

function ContentBlock({ title, children }) {
  return (
    <section className="content-block">
      <h3>{title}</h3>
      {typeof children === "string" ? <p>{children}</p> : children}
    </section>
  );
}

function Checklist({ items }) {
  return (
    <ul className="checklist">
      {items.map((item) => <li key={item}>{item}</li>)}
    </ul>
  );
}

function Metric({ label, value }) {
  return (
    <article className="metric">
      <strong>{value}</strong>
      <span>{label}</span>
    </article>
  );
}

function SectionTitle({ kicker, title }) {
  return (
    <div className="section-title">
      <span className="eyebrow">{kicker}</span>
      <h2>{title}</h2>
    </div>
  );
}

function levelLabel(levelId) {
  return levels.find((level) => level.id === levelId)?.label || levelId;
}

createRoot(document.getElementById("root")).render(<App />);
