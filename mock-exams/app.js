(() => {
  "use strict";

  const STORAGE_KEY = "dpcpMockSubjectsSep2026";
  const GROUPS = ["Sciences", "Individuals and societies", "Languages", "Mathematics"];
  const WEEKS = [
    { label: "Week 1", dates: ["2026-09-21", "2026-09-22", "2026-09-23", "2026-09-24", "2026-09-25"] },
    { label: "Week 2", dates: ["2026-09-28", "2026-09-29", "2026-09-30"] }
  ];

  const courses = [
    { id: "bio-hl", group: "Sciences", name: "Biology", level: "HL", exams: [
      ["2026-09-21", "12:20", 120, "Paper 1 (1A + 1B)", "MPH"],
      ["2026-09-22", "08:00", 150, "Paper 2", "MPH"] ] },
    { id: "bio-sl", group: "Sciences", name: "Biology", level: "SL", exams: [
      ["2026-09-21", "12:20", 90, "Paper 1 (1A + 1B)", "MPH"],
      ["2026-09-22", "08:00", 90, "Paper 2", "MPH"] ] },
    { id: "ess-sl", group: "Sciences", name: "Environmental Systems and Societies", level: "SL", exams: [
      ["2026-09-21", "12:20", 60, "Paper 1", "MPH"],
      ["2026-09-22", "08:00", 120, "Paper 2", "MPH"] ] },
    { id: "physics-hl", group: "Sciences", name: "Physics", level: "HL", exams: [
      ["2026-09-21", "12:20", 120, "Paper 1 (1A + 1B)", "MPH"],
      ["2026-09-22", "08:00", 150, "Paper 2", "MPH"] ] },
    { id: "physics-sl", group: "Sciences", name: "Physics", level: "SL", exams: [
      ["2026-09-21", "12:20", 90, "Paper 1 (1A + 1B)", "MPH"],
      ["2026-09-22", "08:00", 90, "Paper 2", "MPH"] ] },
    { id: "chem-hl", group: "Sciences", name: "Chemistry", level: "HL", exams: [
      ["2026-09-29", "12:20", 120, "Paper 1 (1A + 1B)", "MPH"],
      ["2026-09-30", "08:00", 150, "Paper 2", "MPH"] ] },
    { id: "chem-sl", group: "Sciences", name: "Chemistry", level: "SL", exams: [
      ["2026-09-29", "12:20", 90, "Paper 1 (1A + 1B)", "MPH"],
      ["2026-09-30", "08:00", 90, "Paper 2", "MPH"] ] },

    { id: "business-hl", group: "Individuals and societies", name: "Business Management", level: "HL", exams: [
      ["2026-09-22", "12:20", 90, "Paper 1", "MPH"],
      ["2026-09-22", "14:05", 75, "Paper 3", "MPH"],
      ["2026-09-23", "08:00", 105, "Paper 2", "BF-04 & BF-02"] ] },
    { id: "business-sl", group: "Individuals and societies", name: "Business Management", level: "SL", exams: [
      ["2026-09-22", "12:20", 90, "Paper 1", "MPH"],
      ["2026-09-23", "08:00", 90, "Paper 2", "BF-04 & BF-02"] ] },
    { id: "psych-hl", group: "Individuals and societies", name: "Psychology", level: "HL", exams: [
      ["2026-09-22", "12:20", 120, "Paper 1", "MPH"],
      ["2026-09-23", "08:00", 120, "Paper 2", "BF-04 & BF-02"],
      ["2026-09-23", "10:15", 60, "Paper 3", "BF-04 & BF-02"] ] },
    { id: "psych-sl", group: "Individuals and societies", name: "Psychology", level: "SL", exams: [
      ["2026-09-22", "12:20", 120, "Paper 1", "MPH"],
      ["2026-09-23", "08:00", 60, "Paper 2", "BF-04 & BF-02"] ] },
    { id: "econ-hl", group: "Individuals and societies", name: "Economics", level: "HL", exams: [
      ["2026-09-29", "12:20", 105, "Paper 2", "MPH"],
      ["2026-09-30", "08:00", 75, "Paper 1", "MPH"],
      ["2026-09-30", "09:30", 105, "Paper 3", "MPH"] ] },
    { id: "econ-sl", group: "Individuals and societies", name: "Economics", level: "SL", exams: [
      ["2026-09-29", "12:20", 105, "Paper 2", "MPH"],
      ["2026-09-30", "08:00", 75, "Paper 1", "MPH"] ] },

    { id: "english-a-hl", group: "Languages", name: "English A", level: "HL", exams: [
      ["2026-09-23", "12:30", 135, "Paper 1", "MPH"],
      ["2026-09-24", "08:00", 105, "Paper 2", "MPH"] ] },
    { id: "english-a-sl", group: "Languages", name: "English A", level: "SL", exams: [
      ["2026-09-23", "12:30", 75, "Paper 1", "MPH"],
      ["2026-09-24", "08:00", 105, "Paper 2", "MPH"] ] },
    { id: "english-b-hl", group: "Languages", name: "English B", level: "HL", exams: [
      ["2026-09-23", "12:30", 90, "Paper 1 (Writing)", "MPH"],
      ["2026-09-23", "14:15", 60, "Paper 2 (Reading)", "MPH"],
      ["2026-09-24", "08:00", 60, "Paper 2 (Listening)", "BF-04"] ] },
    { id: "english-b-sl", group: "Languages", name: "English B", level: "SL", exams: [
      ["2026-09-23", "12:30", 75, "Paper 1 (Writing)", "MPH"],
      ["2026-09-23", "14:15", 60, "Paper 2 (Reading)", "MPH"],
      ["2026-09-24", "08:00", 45, "Paper 2 (Listening)", "BF-02"] ] },
    { id: "chinese-a-sl", group: "Languages", name: "Chinese A: Language and Literature", level: "SL", exams: [
      ["2026-09-24", "12:20", 75, "Paper 1", "MPH"],
      ["2026-09-25", "08:00", 105, "Paper 2", "BF-01"] ] },
    { id: "chinese-b-sl", group: "Languages", name: "Chinese B - Mandarin", level: "SL", exams: [
      ["2026-09-24", "12:20", 75, "Paper 1 (Writing)", "MPH"],
      ["2026-09-24", "13:50", 60, "Paper 2 (Reading)", "MPH"],
      ["2026-09-25", "08:00", 45, "Paper 2 (Listening)", "BF-02"] ] },
    { id: "french-ab-sl", group: "Languages", name: "French ab initio", level: "SL", exams: [
      ["2026-09-24", "12:20", 60, "Paper 1 (Writing)", "MPH"],
      ["2026-09-24", "13:35", 60, "Paper 2 (Reading)", "MPH"],
      ["2026-09-25", "08:00", 45, "Paper 2 (Listening)", "BF-04"] ] },
    { id: "japanese-a-sl", group: "Languages", name: "Japanese A: Literature", level: "SL", exams: [
      ["2026-09-24", "12:20", 75, "Paper 1", "MPH"],
      ["2026-09-25", "08:00", 105, "Paper 2", "BF-01"] ] },
    { id: "mandarin-ab-sl", group: "Languages", name: "Mandarin ab initio", level: "SL", exams: [
      ["2026-09-24", "12:20", 60, "Paper 1 (Writing)", "MPH"],
      ["2026-09-24", "13:35", 60, "Paper 2 (Reading)", "MPH"],
      ["2026-09-25", "08:00", 45, "Paper 2 (Listening)", "BF-03"] ] },

    { id: "math-aa-hl", group: "Mathematics", name: "Mathematics: Analysis and Approaches", level: "HL", exams: [
      ["2026-09-28", "12:20", 120, "Paper 1", "MPH"],
      ["2026-09-29", "08:00", 120, "Paper 2", "MPH"],
      ["2026-09-30", "12:20", 75, "Paper 3", "MPH"] ] },
    { id: "math-aa-sl", group: "Mathematics", name: "Mathematics: Analysis and Approaches", level: "SL", exams: [
      ["2026-09-28", "12:20", 90, "Paper 1", "MPH"],
      ["2026-09-29", "08:00", 90, "Paper 2", "MPH"] ] },
    { id: "math-ai-hl", group: "Mathematics", name: "Mathematics: Applications and Interpretation", level: "HL", exams: [
      ["2026-09-28", "12:20", 120, "Paper 1", "MPH"],
      ["2026-09-29", "08:00", 120, "Paper 2", "MPH"],
      ["2026-09-30", "12:20", 75, "Paper 3", "MPH"] ] },
    { id: "math-ai-sl", group: "Mathematics", name: "Mathematics: Applications and Interpretation", level: "SL", exams: [
      ["2026-09-28", "12:20", 90, "Paper 1", "MPH"],
      ["2026-09-29", "08:00", 90, "Paper 2", "MPH"] ] }
  ];

  const groupRoot = document.querySelector("#subject-groups");
  const scheduleRoot = document.querySelector("#schedule");
  const conflictRoot = document.querySelector("#conflict-panel");
  const countRoot = document.querySelector("#selection-count");
  const summaryRoot = document.querySelector("#result-summary");
  const viewButton = document.querySelector("#view-schedule");
  const printButton = document.querySelector("#print-schedule");
  const clearButton = document.querySelector("#clear-selections");

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, character => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
    })[character]);
  }

  function loadSelection() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return new Set(saved.filter(id => courses.some(course => course.id === id)));
    } catch (_) {
      return new Set();
    }
  }

  const selected = loadSelection();

  function renderChoices() {
    groupRoot.innerHTML = GROUPS.map(group => {
      const choices = courses.filter(course => course.group === group).map(course => `
        <label class="subject-choice">
          <input type="checkbox" value="${course.id}" ${selected.has(course.id) ? "checked" : ""}>
          <span><span class="choice-name">${escapeHtml(course.name)}</span><span class="choice-level">${course.level}</span></span>
        </label>`).join("");
      return `<section class="subject-group"><h3>${group}</h3><div class="subject-grid">${choices}</div></section>`;
    }).join("");
  }

  function toMinutes(time) {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  }

  function durationLabel(minutes) {
    const hours = Math.floor(minutes / 60);
    const remainder = minutes % 60;
    if (!hours) return `${remainder} min`;
    if (!remainder) return `${hours} ${hours === 1 ? "hr" : "hrs"}`;
    return `${hours} hr ${remainder} min`;
  }

  function dateLabel(isoDate) {
    return new Intl.DateTimeFormat("en-GB", {
      weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC"
    }).format(new Date(`${isoDate}T12:00:00Z`));
  }

  function boardDateLabel(isoDate) {
    const date = new Date(`${isoDate}T12:00:00Z`);
    const weekday = new Intl.DateTimeFormat("en-GB", { weekday: "short", timeZone: "UTC" }).format(date);
    const dayMonth = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", timeZone: "UTC" }).format(date);
    return `<span>${weekday}</span><strong>${dayMonth}</strong>`;
  }

  function selectedExams() {
    return courses.filter(course => selected.has(course.id)).flatMap(course => course.exams.map(exam => ({
      date: exam[0], start: exam[1], duration: exam[2], paper: exam[3], room: exam[4],
      courseId: course.id, course: course.name, level: course.level,
      title: `${course.name} ${course.level} - ${exam[3]}`
    }))).sort((a, b) => a.date.localeCompare(b.date) || a.start.localeCompare(b.start) || a.title.localeCompare(b.title));
  }

  function findConflicts(exams) {
    const conflicts = [];
    for (let i = 0; i < exams.length; i += 1) {
      for (let j = i + 1; j < exams.length; j += 1) {
        const a = exams[i];
        const b = exams[j];
        if (a.date !== b.date || a.courseId === b.courseId) continue;
        const aStart = toMinutes(a.start);
        const bStart = toMinutes(b.start);
        if (aStart < bStart + b.duration && bStart < aStart + a.duration) conflicts.push([a, b]);
      }
    }
    return conflicts;
  }

  function renderExamCards(exams, className) {
    if (!exams.length) return '<p class="no-exam">You have no examination scheduled this session.</p>';
    return `<div class="exam-list">${exams.map(exam => `
      <article class="exam-card ${className}">
        <div class="exam-card-topline">
          <time class="exam-time" datetime="${exam.date}T${exam.start}">${exam.start}</time>
          <span class="exam-room" aria-label="Location: ${escapeHtml(exam.room)}">${escapeHtml(exam.room)}</span>
        </div>
        <div class="exam-subject">${escapeHtml(exam.course)} <span>${exam.level}</span></div>
        <div class="exam-paper">${escapeHtml(exam.paper)}</div>
        <div class="exam-duration">${durationLabel(exam.duration)}</div>
      </article>`).join("")}</div>`;
  }

  function examsForSession(exams, date, className) {
    return exams.filter(exam => exam.date === date && (className === "morning" ? toMinutes(exam.start) < 720 : toMinutes(exam.start) >= 720));
  }

  function renderMobileDay(exams, date) {
    return `<section class="mobile-day" aria-label="${dateLabel(date)}">
      <h4 class="day-heading">${boardDateLabel(date)}</h4>
      <div class="mobile-session"><div class="session-label morning">Morning</div>${renderExamCards(examsForSession(exams, date, "morning"), "morning")}</div>
      <div class="mobile-session"><div class="session-label afternoon">Afternoon</div>${renderExamCards(examsForSession(exams, date, "afternoon"), "afternoon")}</div>
    </section>`;
  }

  function renderSchedule() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...selected]));
    countRoot.textContent = selected.size;
    viewButton.disabled = selected.size === 0;
    printButton.disabled = selected.size === 0;
    const exams = selectedExams();
    if (!exams.length) {
      summaryRoot.textContent = "Select at least one subject to build your timetable.";
      conflictRoot.innerHTML = "";
      scheduleRoot.innerHTML = '<div class="empty-state">Your personal mock timetable will appear here.</div>';
      return;
    }

    summaryRoot.textContent = `${exams.length} examination${exams.length === 1 ? "" : "s"} across ${new Set(exams.map(exam => exam.date)).size} day${new Set(exams.map(exam => exam.date)).size === 1 ? "" : "s"}.`;
    const conflicts = findConflicts(exams);
    conflictRoot.innerHTML = conflicts.length ? `<div class="conflict-warning"><strong>Check your subject selections</strong>${conflicts.map(([a, b]) => `${dateLabel(a.date)}: ${escapeHtml(a.course)} ${a.level} overlaps with ${escapeHtml(b.course)} ${b.level}.`).join("<br>")}</div>` : "";

    scheduleRoot.innerHTML = WEEKS.map(week => `<section class="exam-week" aria-label="${week.label}">
      <h3 class="week-title">${week.label}</h3>
      <div class="week-board desktop-board">
        ${week.dates.map(date => `<h4 class="day-heading" aria-label="${dateLabel(date)}">${boardDateLabel(date)}</h4>`).join("")}
        <div class="session-row-label morning">Morning</div>
        ${week.dates.map(date => `<section class="session-cell morning" aria-label="${dateLabel(date)}, morning">${renderExamCards(examsForSession(exams, date, "morning"), "morning")}</section>`).join("")}
        <div class="session-row-label afternoon">Afternoon</div>
        ${week.dates.map(date => `<section class="session-cell afternoon" aria-label="${dateLabel(date)}, afternoon">${renderExamCards(examsForSession(exams, date, "afternoon"), "afternoon")}</section>`).join("")}
      </div>
      <div class="mobile-board">${week.dates.map(date => renderMobileDay(exams, date)).join("")}</div>
    </section>`).join("");
  }

  groupRoot.addEventListener("change", event => {
    const input = event.target.closest('input[type="checkbox"]');
    if (!input) return;
    if (input.checked) selected.add(input.value); else selected.delete(input.value);
    renderSchedule();
  });

  viewButton.addEventListener("click", () => document.querySelector("#results").scrollIntoView({ behavior: "smooth", block: "start" }));
  printButton.addEventListener("click", () => window.print());
  clearButton.addEventListener("click", () => {
    selected.clear();
    groupRoot.querySelectorAll('input[type="checkbox"]').forEach(input => { input.checked = false; });
    renderSchedule();
  });

  renderChoices();
  renderSchedule();
})();
