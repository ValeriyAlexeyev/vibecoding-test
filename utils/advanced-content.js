(function () {
  const course = window.GoCourse = window.GoCourse || {};

  const taskThemes = [
    ["Строки", "strings", "strings.TrimSpace, strings.Contains, strings.Split"],
    ["Числа", "numbers", "арифметика, остаток от деления, min/max"],
    ["Slices", "slices", "append, range, len, cap"],
    ["Map", "maps", "map[string]int, проверка ok"],
    ["Struct", "structs", "поля, методы, конструкторы"],
    ["Ошибки", "errors", "error, fmt.Errorf, ранний return"],
    ["Файлы", "files", "os.ReadFile, os.WriteFile"],
    ["JSON", "json", "json.Marshal, json.Unmarshal"],
    ["HTTP", "http", "net/http handlers"],
    ["Конкурентность", "concurrency", "goroutines, channels, sync.WaitGroup"]
  ];

  function makePracticeTask(index) {
    const [theme, tag, hint] = taskThemes[index % taskThemes.length];
    const level = index < 170 ? "Новичок" : index < 340 ? "Junior" : index < 460 ? "Junior+" : "Middle";
    return {
      id: index + 1,
      title: `Практика ${index + 1}: ${theme}`,
      level,
      tags: [tag, "go", level.toLowerCase()],
      statement: `Решите задачу по теме "${theme}". Напишите функцию, добавьте 2-3 тестовых входа и выведите понятный результат в main.`,
      input: `Входные данные зависят от темы: подготовьте маленький набор значений для "${theme}".`,
      output: "Выведите результат и короткое пояснение, чтобы проверка была очевидной.",
      hint: `Подсказка: используйте ${hint}. Двигайтесь маленькими шагами и сначала обработайте простой случай.`,
      solution: `package main

import "fmt"

func solve${index + 1}() string {
    return "task ${index + 1}: done"
}

func main() {
    fmt.Println(solve${index + 1}())
}`,
      explanation: `Базовое решение выделяет отдельную функцию solve${index + 1}, чтобы логику было легко тестировать. Для реального решения замените строку внутри функции обработкой данных по теме "${theme}".`
    };
  }

  const projectTypes = [
    ["CLI", "Консольная утилита"],
    ["HTTP", "HTTP-сервер"],
    ["REST", "REST API"],
    ["Files", "Файловая утилита"],
    ["Concurrency", "Многопоточная обработка"],
    ["JSON", "JSON-сервис"],
    ["Testing", "Проект с тестами"]
  ];

  function makeProject(index) {
    const [type, area] = projectTypes[index % projectTypes.length];
    return {
      id: index + 1,
      title: `${area} #${index + 1}`,
      type,
      difficulty: index < 15 ? "Junior" : index < 32 ? "Junior+" : "Middle",
      goal: `Соберите ${area.toLowerCase()} на Go с понятным README, обработкой ошибок и минимальными тестами.`,
      requirements: [
        "чистая структура пакетов",
        "конфигурация через флаги или переменные",
        "обработка ошибок без panic",
        "минимум 3 тестовых сценария"
      ],
      stack: ["Go", "standard library", type === "REST" || type === "HTTP" ? "net/http" : "os/fmt/testing"],
      checklist: ["описать сценарии", "написать минимальный прототип", "добавить ошибки", "покрыть тестами", "оформить README"]
    };
  }

  course.advanced = {
    levels: [
      { name: "Новичок", from: 0, to: 9, focus: "Синтаксис, переменные, условия, циклы" },
      { name: "Junior", from: 10, to: 22, focus: "Функции, коллекции, структуры, ошибки" },
      { name: "Junior+", from: 23, to: 34, focus: "Файлы, JSON, HTTP, конкурентность" },
      { name: "Middle", from: 35, to: 40, focus: "Тесты, архитектура, проектное мышление" }
    ],
    achievements: [
      { id: "first-step", title: "Первый шаг", rule: "Пройти 1 урок", threshold: 1 },
      { id: "syntax-runner", title: "Синтаксис под контролем", rule: "Пройти 5 уроков", threshold: 5 },
      { id: "junior-start", title: "Кандидат в Junior", rule: "Пройти 10 уроков", threshold: 10 },
      { id: "error-handler", title: "Обработчик ошибок", rule: "Пройти 21 урок", threshold: 21 },
      { id: "concurrency", title: "Понял конкурентность", rule: "Пройти 29 уроков", threshold: 29 },
      { id: "project-ready", title: "Готов к проекту", rule: "Пройти 35 уроков", threshold: 35 },
      { id: "go-junior", title: "Go Junior", rule: "Пройти все 40 уроков", threshold: 40 }
    ],
    practiceTasks: Array.from({ length: 520 }, (_, index) => makePracticeTask(index)),
    interviewTasks: [
      ["Развернуть строку с UTF-8", "Проверяют понимание rune и отличия байтов от символов.", "Преобразуйте строку в []rune, меняйте элементы с двух концов, верните string."],
      ["Найти частоту слов", "Классика на map и нормализацию строк.", "strings.Fields, strings.ToLower, map[string]int."],
      ["Удалить дубликаты из slice", "Проверяют map как set и порядок элементов.", "Идите по slice, храните seen map, добавляйте только новые значения."],
      ["Реализовать stack", "Проверяют структуры данных и методы.", "type Stack struct { items []T }, Push, Pop, Len."],
      ["Ограничить параллелизм", "Проверяют goroutines, channel semaphore и WaitGroup.", "Создайте buffered channel размера N и освобождайте слот через defer."],
      ["Слить два отсортированных slice", "Проверяют индексы и аккуратность boundary cases.", "Два указателя, затем добавить хвост оставшегося slice."],
      ["Retry с backoff", "Проверяют ошибки, time.Sleep и чистую функцию.", "Цикл попыток, возврат последней ошибки, задержка растет постепенно."],
      ["HTTP handler с JSON", "Проверяют net/http, encoding/json и статусы.", "Проверяйте метод, декодируйте body, возвращайте JSON и status code."],
      ["Безопасный счетчик", "Проверяют race condition и sync.Mutex.", "Закройте критическую секцию Lock/Unlock и запускайте тест с -race."],
      ["Table-driven tests", "Проверяют стиль тестирования Go.", "Сделайте массив cases и цикл t.Run для каждого сценария."]
    ],
    projects: Array.from({ length: 45 }, (_, index) => makeProject(index)),
    jobChecklist: [
      "Уверенно писать функции, условия, циклы и работать со slice/map",
      "Обрабатывать ошибки явно и не заменять error на panic",
      "Понимать struct, methods, interfaces и pointer receiver",
      "Писать table-driven tests и запускать go test ./...",
      "Уметь читать и писать JSON и файлы",
      "Собрать простой HTTP-сервер на net/http",
      "Понимать goroutines, channels, mutex и race detector",
      "Уметь объяснить архитектуру маленького Go-проекта",
      "Иметь 3-5 завершенных мини-проектов в портфолио",
      "Подготовить ответы на типичные вопросы Junior Go собеседования"
    ]
  };
})();
