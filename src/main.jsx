import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { finalProjects, lessons, levels, miniProjects, practiceTasks, reference } from "./data/course.js";
import "./styles/main.css";

const STORAGE_KEY = "webcoding-platform-state";

const defaultState = {
  completedLessons: [],
  completedTasks: [],
  quizScores: {},
  code: "",
  theme: "light"
};

function loadState() {
  try {
    return { ...defaultState, ...JSON.parse(localStorage.getItem(STORAGE_KEY)) };
  } catch {
    return defaultState;
  }
}

function saveState(nextState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
}

function App() {
  const [state, setState] = useState(loadState);
  const [activeSection, setActiveSection] = useState("home");
  const [levelFilter, setLevelFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [selectedLessonId, setSelectedLessonId] = useState(lessons[0].id);

  const selectedLesson = lessons.find((lesson) => lesson.id === selectedLessonId) || lessons[0];
  const completedSet = new Set(state.completedLessons);
  const progress = Math.round((state.completedLessons.length / lessons.length) * 100);

  const filteredLessons = useMemo(() => {
    return lessons.filter((lesson) => {
      const matchesLevel = levelFilter === "all" || lesson.level === levelFilter;
      const searchText = `${lesson.title} ${lesson.description} ${lesson.theory}`.toLowerCase();
      return matchesLevel && searchText.includes(query.trim().toLowerCase());
    });
  }, [levelFilter, query]);

  function updateState(patch) {
    setState((current) => {
      const next = { ...current, ...patch };
      saveState(next);
      return next;
    });
  }

  function toggleLesson(id) {
    const exists = state.completedLessons.includes(id);
    updateState({
      completedLessons: exists
        ? state.completedLessons.filter((lessonId) => lessonId !== id)
        : [...state.completedLessons, id]
    });
  }

  function toggleTask(title) {
    const exists = state.completedTasks.includes(title);
    updateState({
      completedTasks: exists
        ? state.completedTasks.filter((taskTitle) => taskTitle !== title)
        : [...state.completedTasks, title]
    });
  }

  function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    updateState({ theme });
  }

  React.useEffect(() => {
    document.documentElement.dataset.theme = state.theme;
  }, [state.theme]);

  const sectionMap = {
    home: <Home progress={progress} setActiveSection={setActiveSection} />,
    roadmap: <Roadmap progress={progress} />,
    lessons: (
      <Lessons
        lessons={filteredLessons}
        selectedLesson={selectedLesson}
        completedSet={completedSet}
        levelFilter={levelFilter}
        query={query}
        onLevelFilter={setLevelFilter}
        onQuery={setQuery}
        onSelect={setSelectedLessonId}
        onToggle={toggleLesson}
        onQuizScore={(lessonId, score) => updateState({ quizScores: { ...state.quizScores, [lessonId]: score } })}
        score={state.quizScores[selectedLesson.id]}
      />
    ),
    practice: <Practice tasks={practiceTasks} completedTasks={state.completedTasks} onToggle={toggleTask} />,
    projects: <Projects projects={miniProjects} />,
    tests: <Tests lessons={lessons} scores={state.quizScores} />,
    progress: <Progress state={state} progress={progress} />,
    reference: <Reference items={reference} />,
    finals: <FinalProjects projects={finalProjects} />,
    senior: <SeniorPath />
  };

  return (
    <div className="app-shell">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <main className="workspace">
        <Topbar theme={state.theme} setTheme={setTheme} progress={progress} />
        {sectionMap[activeSection]}
        <CodeEditor value={state.code} onChange={(code) => updateState({ code })} />
      </main>
    </div>
  );
}

function Topbar({ theme, setTheme, progress }) {
  return (
    <header className="topbar">
      <div>
        <span className="eyebrow">Локально. Бесплатно. Без API.</span>
        <h1>Вебкодинг: от новичка до синьора</h1>
      </div>
      <div className="topbar-actions">
        <div className="compact-progress" aria-label={`Прогресс ${progress}%`}>
          <span style={{ width: `${progress}%` }} />
        </div>
        <button type="button" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
          {theme === "light" ? "Темная тема" : "Светлая тема"}
        </button>
      </div>
    </header>
  );
}

function Sidebar({ activeSection, setActiveSection }) {
  const items = [
    ["home", "Главная"],
    ["roadmap", "Дорожная карта"],
    ["lessons", "Уроки"],
    ["practice", "Практика"],
    ["projects", "Мини-проекты"],
    ["tests", "Тесты"],
    ["progress", "Личный прогресс"],
    ["reference", "Справочник"],
    ["finals", "Финальные проекты"],
    ["senior", "Путь до Senior"]
  ];

  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark">{"</>"}</span>
        <strong>Вебкодинг</strong>
      </div>
      <nav aria-label="Разделы курса">
        {items.map(([id, label]) => (
          <button key={id} className={activeSection === id ? "active" : ""} type="button" onClick={() => setActiveSection(id)}>
            {label}
          </button>
        ))}
      </nav>
    </aside>
  );
}

function Home({ progress, setActiveSection }) {
  return (
    <section className="home-grid">
      <article className="hero-panel">
        <span className="eyebrow">Учебная платформа</span>
        <h2>Учись веб-разработке шаг за шагом, прямо в браузере.</h2>
        <p>
          Курс ведет от первой HTML-страницы до архитектуры, React, тестирования, оптимизации и технического лидерства.
          Все работает локально: уроки лежат в файлах, прогресс сохраняется в localStorage.
        </p>
        <div className="hero-actions">
          <button type="button" onClick={() => setActiveSection("lessons")}>Начать уроки</button>
          <button type="button" onClick={() => setActiveSection("roadmap")}>Открыть карту</button>
        </div>
      </article>
      <article className="visual-panel" aria-label="Учебный интерфейс">
        <div className="browser-mock">
          <div className="browser-dots"><span /><span /><span /></div>
          <pre>{`const path = ["HTML", "CSS", "JS", "React"];
path.forEach(skill => learn(skill));

if (practice.every(day => day.done)) {
  level.up("Senior mindset");
}`}</pre>
        </div>
      </article>
      <Metric label="Всего прогресс" value={`${progress}%`} />
      <Metric label="Уроков" value={lessons.length} />
      <Metric label="Мини-проектов" value={miniProjects.length} />
      <Metric label="Уровней" value={levels.length} />
    </section>
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

function Roadmap({ progress }) {
  return (
    <section className="section">
      <SectionTitle kicker="Дорожная карта" title="От первой страницы до инженерного мышления" />
      <div className="roadmap">
        {levels.map((level, index) => (
          <article key={level.id}>
            <span className="step">{index + 1}</span>
            <h3>{level.title}</h3>
            <p>{level.focus}</p>
            <ul>{level.skills.map((skill) => <li key={skill}>{skill}</li>)}</ul>
          </article>
        ))}
      </div>
      <div className="progress-card">
        <strong>{progress}%</strong>
        <p>Твой общий прогресс по урокам. Завершай уроки и возвращайся к карте, чтобы видеть следующий этап.</p>
      </div>
    </section>
  );
}

function Lessons(props) {
  const { lessons, selectedLesson, completedSet, levelFilter, query, onLevelFilter, onQuery, onSelect, onToggle, onQuizScore, score } = props;

  return (
    <section className="section lessons-layout">
      <div className="lesson-list-panel">
        <SectionTitle kicker="Уроки" title="Выбери тему" />
        <div className="filters">
          <input value={query} onChange={(event) => onQuery(event.target.value)} placeholder="Поиск по урокам" />
          <select value={levelFilter} onChange={(event) => onLevelFilter(event.target.value)} aria-label="Фильтр уровня">
            <option value="all">Все уровни</option>
            {levels.map((level) => <option key={level.id} value={level.id}>{level.short}</option>)}
          </select>
        </div>
        <div className="lesson-list">
          {lessons.map((lesson) => (
            <button key={lesson.id} type="button" className={selectedLesson.id === lesson.id ? "lesson-card active" : "lesson-card"} onClick={() => onSelect(lesson.id)}>
              <span>{levels.find((level) => level.id === lesson.level)?.short}</span>
              <strong>{lesson.title}</strong>
              <small>{completedSet.has(lesson.id) ? "Пройден" : lesson.duration}</small>
            </button>
          ))}
        </div>
      </div>
      <LessonReader lesson={selectedLesson} done={completedSet.has(selectedLesson.id)} onToggle={onToggle} onQuizScore={onQuizScore} score={score} />
    </section>
  );
}

function LessonReader({ lesson, done, onToggle, onQuizScore, score }) {
  return (
    <article className="reader">
      <div className="reader-head">
        <div>
          <span className="eyebrow">{levels.find((level) => level.id === lesson.level)?.title}</span>
          <h2>{lesson.title}</h2>
          <p>{lesson.description}</p>
        </div>
        <button type="button" className={done ? "success" : ""} onClick={() => onToggle(lesson.id)}>
          {done ? "Урок пройден" : "Отметить пройденным"}
        </button>
      </div>
      <h3>Теория</h3>
      <p>{lesson.theory}</p>
      <h3>Пример кода</h3>
      <pre className="code-block">{lesson.code}</pre>
      <h3>Практическое задание</h3>
      <p className="task-box">{lesson.practice}</p>
      <Quiz lesson={lesson} onQuizScore={onQuizScore} savedScore={score} />
    </article>
  );
}

function Quiz({ lesson, onQuizScore, savedScore }) {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(savedScore);

  function check() {
    const correct = lesson.quiz.reduce((sum, question, index) => sum + (Number(answers[index]) === question.answer ? 1 : 0), 0);
    setResult(correct);
    onQuizScore(lesson.id, correct);
  }

  return (
    <div className="quiz">
      <h3>Тест</h3>
      {lesson.quiz.map((question, index) => (
        <fieldset key={question.question}>
          <legend>{question.question}</legend>
          {question.options.map((option, optionIndex) => (
            <label key={option}>
              <input
                type="radio"
                name={`${lesson.id}-${index}`}
                value={optionIndex}
                checked={Number(answers[index]) === optionIndex}
                onChange={(event) => setAnswers({ ...answers, [index]: event.target.value })}
              />
              {option}
            </label>
          ))}
        </fieldset>
      ))}
      <button type="button" onClick={check}>Проверить ответы</button>
      {result !== undefined && <p className="quiz-result">Результат: {result} из {lesson.quiz.length}</p>}
    </div>
  );
}

function Practice({ tasks, completedTasks, onToggle }) {
  return (
    <section className="section">
      <SectionTitle kicker="Практические задания" title="Тренируй навык руками" />
      <div className="task-grid">
        {tasks.map((task) => (
          <label key={task.title} className="task-card">
            <input type="checkbox" checked={completedTasks.includes(task.title)} onChange={() => onToggle(task.title)} />
            <span>
              <strong>{task.title}</strong>
              <small>{levels.find((level) => level.id === task.level)?.short}</small>
              <p>{task.text}</p>
            </span>
          </label>
        ))}
      </div>
    </section>
  );
}

function Projects({ projects }) {
  return (
    <section className="section">
      <SectionTitle kicker="Мини-проекты" title="Проекты для портфолио и закрепления" />
      <div className="project-grid">
        {projects.map((project) => (
          <article key={project.id}>
            <span>{project.stack}</span>
            <h3>{project.title}</h3>
            <ol>{project.steps.map((step) => <li key={step}>{step}</li>)}</ol>
          </article>
        ))}
      </div>
    </section>
  );
}

function Tests({ lessons, scores }) {
  return (
    <section className="section">
      <SectionTitle kicker="Тесты" title="Контрольные точки по каждому уроку" />
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

function Progress({ state, progress }) {
  return (
    <section className="section">
      <SectionTitle kicker="Личный прогресс" title="Что уже сделано" />
      <div className="progress-dashboard">
        <Metric label="Уроков пройдено" value={`${state.completedLessons.length}/${lessons.length}`} />
        <Metric label="Практик закрыто" value={`${state.completedTasks.length}/${practiceTasks.length}`} />
        <Metric label="Тестов решено" value={Object.keys(state.quizScores).length} />
        <Metric label="Общий прогресс" value={`${progress}%`} />
      </div>
      <div className="wide-progress"><span style={{ width: `${progress}%` }} /></div>
    </section>
  );
}

function Reference({ items }) {
  return (
    <section className="section">
      <SectionTitle kicker="Справочник HTML/CSS/JS" title="Короткие подсказки рядом с практикой" />
      <div className="reference-grid">
        {items.map((item) => (
          <article key={`${item.area}-${item.title}`}>
            <span>{item.area}</span>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function FinalProjects({ projects }) {
  return (
    <section className="section">
      <SectionTitle kicker="Финальные проекты" title="Собери большой результат" />
      <div className="final-list">
        {projects.map((project, index) => (
          <article key={project}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h3>{project}</h3>
            <p>Опиши требования, сделай макет, разбей на компоненты, добавь localStorage, тест-кейсы и финальный review.</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function SeniorPath() {
  return (
    <section className="section">
      <SectionTitle kicker="Путь до Senior" title="Не только код, но и инженерные решения" />
      <div className="senior-grid">
        {["Чистая архитектура", "Проектирование интерфейсов", "Оптимизация", "Безопасность", "Тестирование", "Code review", "Техническое лидерство", "Коммуникация решений"].map((item) => (
          <article key={item}>
            <h3>{item}</h3>
            <p>Сформулируй критерии качества, риски, компромиссы и способ проверки результата.</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function CodeEditor({ value, onChange }) {
  const starterCode = "<h1>Мой код</h1>\n<p>Измени HTML слева и посмотри результат.</p>\n<button>Кнопка</button>";
  const code = value || starterCode;

  return (
    <section className="section editor-section">
      <SectionTitle kicker="Мини-редактор" title="Песочница HTML/CSS/JS" />
      <div className="editor-grid">
        <textarea value={code} onChange={(event) => onChange(event.target.value)} spellCheck="false" aria-label="Редактор кода" />
        <iframe title="Предпросмотр кода" srcDoc={code} sandbox="allow-scripts" />
      </div>
    </section>
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

createRoot(document.getElementById("root")).render(<App />);
