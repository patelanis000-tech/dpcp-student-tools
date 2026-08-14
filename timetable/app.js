(function () {
  "use strict";

  const DAY_ORDER = {
    Monday: 0,
    Tuesday: 1,
    Wednesday: 2,
    Thursday: 3,
    Friday: 4,
  };
  const DAYS = Object.keys(DAY_ORDER).sort((a, b) => DAY_ORDER[a] - DAY_ORDER[b]);
  const payload = window.TIMETABLE_DATA;

  const elements = {
    masterTab: document.getElementById("masterTab"),
    builderTab: document.getElementById("builderTab"),
    masterView: document.getElementById("masterView"),
    builderView: document.getElementById("builderView"),
    personalView: document.getElementById("personalView"),
    loadError: document.getElementById("loadError"),
    masterTimetable: document.getElementById("masterTimetable"),
    personalTimetable: document.getElementById("personalTimetable"),
    masterCount: document.getElementById("masterCount"),
    legendSearch: document.getElementById("legendSearch"),
    subjectGroupLegend: document.getElementById("subjectGroupLegend"),
    classCodeLegend: document.getElementById("classCodeLegend"),
    classDetailDialog: document.getElementById("classDetailDialog"),
    classDetailContent: document.getElementById("classDetailContent"),
    closeClassDetail: document.getElementById("closeClassDetail"),
    programmeFilter: document.getElementById("programmeFilter"),
    cohortFilter: document.getElementById("cohortFilter"),
    subjectFilter: document.getElementById("subjectFilter"),
    dayFilter: document.getElementById("dayFilter"),
    teacherFilter: document.getElementById("teacherFilter"),
    roomFilter: document.getElementById("roomFilter"),
    teacherFilterLabel: document.getElementById("teacherFilterLabel"),
    resetFiltersButton: document.getElementById("resetFiltersButton"),
    printMasterButton: document.getElementById("printMasterButton"),
    studentBuilder: document.getElementById("studentBuilder"),
    studentProgramme: document.getElementById("studentProgramme"),
    studentCohort: document.getElementById("studentCohort"),
    subjectStep: document.getElementById("subjectStep"),
    nameStep: document.getElementById("nameStep"),
    builderActions: document.getElementById("builderActions"),
    subjectChoices: document.getElementById("subjectChoices"),
    subjectSearch: document.getElementById("subjectSearch"),
    requiredSummary: document.getElementById("requiredSummary"),
    studentName: document.getElementById("studentName"),
    clearBuilderButton: document.getElementById("clearBuilderButton"),
    personalName: document.getElementById("personalName"),
    personalMeta: document.getElementById("personalMeta"),
    generatedDate: document.getElementById("generatedDate"),
    personalSubjects: document.getElementById("personalSubjects"),
    personalWarnings: document.getElementById("personalWarnings"),
    editSelectionsButton: document.getElementById("editSelectionsButton"),
    printPersonalButton: document.getElementById("printPersonalButton"),
    clearTimetableButton: document.getElementById("clearTimetableButton"),
    returnMasterButton: document.getElementById("returnMasterButton"),
  };

  if (!payload || !Array.isArray(payload.rows)) {
    elements.masterView.hidden = true;
    elements.builderView.hidden = true;
    elements.loadError.hidden = false;
    return;
  }

  function timeToMinutes(value) {
    const [hours, minutes] = value.split(":").map(Number);
    return hours * 60 + minutes;
  }

  function compareLessons(a, b) {
    return (DAY_ORDER[a.day] ?? Number.MAX_SAFE_INTEGER) - (DAY_ORDER[b.day] ?? Number.MAX_SAFE_INTEGER)
      || timeToMinutes(a.start_time) - timeToMinutes(b.start_time)
      || timeToMinutes(a.end_time) - timeToMinutes(b.end_time)
      || Number(a.display_order) - Number(b.display_order)
      || a.display_code.localeCompare(b.display_code);
  }

  const rows = payload.rows;
  const lessonRows = rows.filter((row) => row.record_type === "LESSON").sort(compareLessons);
  const cohortLabels = {
    YEAR_1: "Year 1 (Batch 2027)",
    YEAR_2: "Year 2 (Batch 2026)",
  };
  const subjectGroupLabels = {
    LANGUAGE: "Languages",
    INDIVIDUALS_SOCIETIES: "Individuals and Societies",
    SCIENCE: "Sciences",
    MATHEMATICS: "Mathematics",
    ARTS: "Arts",
    CORE: "Core / Research / Studio",
    CP: "CP-specific",
  };
  let currentMasterRows = lessonRows;

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function programmeApplies(rowProgramme, selectedProgramme) {
    return rowProgramme === "BOTH" || rowProgramme === selectedProgramme;
  }

  function formatTime(value) {
    if (!value) return "";
    const [hoursText, minutes] = value.split(":");
    const hours = Number(hoursText);
    const suffix = hours >= 12 ? "pm" : "am";
    const displayHour = hours % 12 || 12;
    return `${displayHour}:${minutes} ${suffix}`;
  }

  function formatTimeRange(row) {
    return `${formatTime(row.start_time)}–${formatTime(row.end_time)}`;
  }

  function formatRoom(value) {
    return String(value || "Not provided").split("/").map((part) => part.trim()).filter(Boolean).join(" / ");
  }

  function cohortLabel(value) {
    return cohortLabels[value] || value.replaceAll("_", " ");
  }

  function classCard(row) {
    const badge = row.programme === "DP" || row.programme === "CP"
      ? row.programme
      : row.subject_group === "CORE" ? "CORE" : "";
    return `
      <article class="class-card${row.attendance === "discretion" ? " is-discretion" : ""}" data-programme="${escapeHtml(row.programme)}" data-subject-group="${escapeHtml(row.subject_group)}">
        <div class="class-card-heading">
          <strong class="class-name">${escapeHtml(row.class_name)}</strong>
          ${badge ? `<span class="programme-tag">${escapeHtml(badge)}</span>` : ""}
        </div>
        <span class="class-room">${escapeHtml(formatRoom(row.room))}</span>
        ${row.teacher ? `<span class="class-teacher">${escapeHtml(row.teacher)}</span>` : ""}
      </article>`;
  }

  function fixedSlotsForDay(day, timetableRows) {
    const cohorts = new Set(timetableRows.map((row) => row.cohort));
    const slotSource = lessonRows.filter((row) => row.day === day && (!cohorts.size || cohorts.has(row.cohort)));
    const slots = new Map();
    slotSource.slice().sort(compareLessons).forEach((row) => slots.set(`${row.start_time}|${row.end_time}`, [row.start_time, row.end_time]));
    return [...slots.values()].sort((a, b) => timeToMinutes(a[0]) - timeToMinutes(b[0]) || timeToMinutes(a[1]) - timeToMinutes(b[1]));
  }

  function renderTimetable(container, timetableRows, selectedDay) {
    const days = selectedDay && selectedDay !== "ALL" ? [selectedDay] : DAYS;
    if (!timetableRows.length) {
      container.innerHTML = '<div class="empty-state"><strong>No scheduled lessons match this view.</strong><br>Change the filters or edit the subject selections.</div>';
      return;
    }

    const columns = days.map((day) => {
      const dayRows = timetableRows
        .filter((row) => row.day === day)
        .sort(compareLessons);
      const groups = new Map();
      dayRows.forEach((row) => {
        const key = `${row.start_time}|${row.end_time}`;
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(row);
      });
      const blocks = fixedSlotsForDay(day, timetableRows).map(([start, end]) => {
        const classes = groups.get(`${start}|${end}`) || [];
        return `
          <section class="time-block${classes.length ? "" : " is-empty"}">
            <div class="time-label"><span>${formatTime(start)}</span><span>${formatTime(end)}</span></div>
            <div class="class-stack">${classes.length ? classes.map(classCard).join("") : '<span class="blank-period" aria-label="No lesson"></span>'}</div>
          </section>`;
      }).join("");
      return `
        <section class="day-column">
          <h3 class="day-heading">${day}</h3>
          ${blocks || '<div class="empty-state">No lessons</div>'}
        </section>`;
    }).join("");

    container.innerHTML = `<div class="timetable-days${days.length === 1 ? " single-day" : ""}">${columns}</div>`;
  }

  function masterDetailMarkup(row) {
    const subjectLevel = [row.subject, row.level].filter(Boolean).join(" — ");
    const programme = row.programme === "BOTH" ? "DP / CP" : row.programme;
    return `
      <strong>${escapeHtml(row.class_name)}</strong>
      <span>${escapeHtml(subjectLevel || row.subject)}</span>
      <span>Teacher: ${escapeHtml(row.teacher || "Not verified")}</span>
      <span>Programme: ${escapeHtml(programme)} · ${escapeHtml(cohortLabel(row.cohort))}</span>
      <span>Room: ${escapeHtml(row.room || "Not provided")}</span>
      <span>${escapeHtml(row.day)} · ${escapeHtml(formatTimeRange(row))}</span>`;
  }

  function masterChip(row) {
    const tooltipId = `tooltip-${row.lesson_id}`;
    return `
      <span class="master-chip-wrap">
        <button class="master-chip" type="button" data-lesson-id="${escapeHtml(row.lesson_id)}" data-subject-group="${escapeHtml(row.subject_group)}" aria-describedby="${tooltipId}">
          ${escapeHtml(row.display_code)}
        </button>
        <span class="master-chip-tooltip" id="${tooltipId}" role="tooltip">${masterDetailMarkup(row)}</span>
      </span>`;
  }

  function renderMasterTimetable(timetableRows, selectedDay) {
    const days = (selectedDay && selectedDay !== "ALL" ? [selectedDay] : DAYS)
      .slice().sort((a, b) => DAY_ORDER[a] - DAY_ORDER[b]);
    if (!timetableRows.length) {
      elements.masterTimetable.innerHTML = '<div class="empty-state"><strong>No scheduled lessons match these filters.</strong></div>';
      return;
    }
    const sortedLessons = timetableRows.slice().sort(compareLessons);
    const columns = days.map((day) => {
      const groups = new Map();
      sortedLessons.filter((row) => row.day === day).forEach((row) => {
        const key = `${row.start_time}|${row.end_time}`;
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(row);
      });
      const blocks = fixedSlotsForDay(day, sortedLessons).map(([start, end]) => {
        const classes = (groups.get(`${start}|${end}`) || []).sort((a, b) => a.display_code.localeCompare(b.display_code));
        return `
          <section class="master-time-block${classes.length ? "" : " is-empty"}">
            <div class="master-time-label">${formatTime(start)}–${formatTime(end)}</div>
            <div class="master-chip-grid">${classes.map(masterChip).join("")}</div>
          </section>`;
      }).join("");
      return `<section class="master-day-column"><h3 class="day-heading">${day}</h3>${blocks}</section>`;
    }).join("");
    elements.masterTimetable.innerHTML = `<div class="master-timetable-grid${days.length === 1 ? " single-day" : ""}">${columns}</div>`;
  }

  function renderSubjectGroupLegend() {
    elements.subjectGroupLegend.innerHTML = Object.entries(subjectGroupLabels).map(([value, label]) => `
      <span class="group-key" data-subject-group="${value}"><span class="group-swatch"></span>${escapeHtml(label)}</span>`).join("");
  }

  function renderClassCodeLegend() {
    const query = elements.legendSearch.value.trim().toLowerCase();
    const offerings = new Map();
    currentMasterRows.forEach((row) => {
      if (!offerings.has(row.class_id)) offerings.set(row.class_id, { ...row, teachers: new Set(), rooms: new Set() });
      if (row.teacher) offerings.get(row.class_id).teachers.add(row.teacher);
      if (row.room) offerings.get(row.class_id).rooms.add(row.room);
    });
    const entries = [...offerings.values()].filter((row) => {
      const searchable = [row.display_code, row.class_name, ...row.teachers, ...row.rooms].join(" ").toLowerCase();
      return !query || searchable.includes(query);
    }).sort((a, b) => a.display_code.localeCompare(b.display_code));
    elements.classCodeLegend.innerHTML = entries.length ? entries.map((row) => `
      <div class="legend-entry" data-subject-group="${escapeHtml(row.subject_group)}">
        <strong>${escapeHtml(row.display_code)}</strong>
        <span>${escapeHtml(row.class_name)}</span>
        <small>${escapeHtml([...row.teachers].join(", ") || "Teacher not verified")} · ${escapeHtml([...row.rooms].join(", ") || "Room not provided")}</small>
      </div>`).join("") : '<p class="legend-empty">No legend entries match that search.</p>';
  }

  function openClassDetail(lessonId) {
    const row = lessonRows.find((item) => item.lesson_id === lessonId);
    if (!row) return;
    elements.classDetailContent.innerHTML = `<div class="dialog-code" data-subject-group="${escapeHtml(row.subject_group)}">${escapeHtml(row.display_code)}</div><div class="dialog-details">${masterDetailMarkup(row)}</div>`;
    elements.classDetailDialog.showModal();
  }

  function uniqueSorted(values) {
    return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b));
  }

  function addOptions(select, values, labelFunction) {
    values.forEach((value) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = labelFunction ? labelFunction(value) : value;
      select.append(option);
    });
  }

  function populateMasterFilters() {
    addOptions(elements.cohortFilter, uniqueSorted(lessonRows.map((row) => row.cohort)), cohortLabel);
    const subjects = uniqueSorted(lessonRows.map((row) => row.subject));
    addOptions(elements.subjectFilter, subjects);
    const teachers = uniqueSorted(lessonRows.map((row) => row.teacher));
    addOptions(elements.teacherFilter, teachers);
    addOptions(elements.roomFilter, uniqueSorted(lessonRows.map((row) => row.room)));
    elements.teacherFilterLabel.hidden = teachers.length === 0;
  }

  function renderMaster() {
    const programme = elements.programmeFilter.value;
    const cohort = elements.cohortFilter.value;
    const subject = elements.subjectFilter.value;
    const day = elements.dayFilter.value;
    const teacher = elements.teacherFilter.value;
    const room = elements.roomFilter.value;
    const filtered = lessonRows.filter((row) =>
      (programme === "ALL" || programmeApplies(row.programme, programme)) &&
      (cohort === "ALL" || row.cohort === cohort) &&
      (subject === "ALL" || row.subject === subject) &&
      (day === "ALL" || row.day === day) &&
      (teacher === "ALL" || row.teacher === teacher) &&
      (room === "ALL" || row.room === room)
    );
    currentMasterRows = filtered;
    renderMasterTimetable(filtered, day);
    renderClassCodeLegend();
    elements.masterCount.textContent = `${filtered.length} lesson row${filtered.length === 1 ? "" : "s"} shown · ${new Set(filtered.map((row) => row.class_id)).size} class offering${new Set(filtered.map((row) => row.class_id)).size === 1 ? "" : "s"}`;
  }

  function resetMasterFilters() {
    elements.programmeFilter.value = "ALL";
    elements.cohortFilter.value = "ALL";
    elements.subjectFilter.value = "ALL";
    elements.dayFilter.value = "ALL";
    elements.teacherFilter.value = "ALL";
    elements.roomFilter.value = "ALL";
    renderMaster();
  }

  function showView(view) {
    elements.masterView.hidden = view !== "master";
    elements.builderView.hidden = view !== "builder";
    elements.personalView.hidden = view !== "personal";
    elements.masterTab.classList.toggle("is-active", view === "master");
    elements.builderTab.classList.toggle("is-active", view === "builder");
    elements.masterTab.setAttribute("aria-selected", String(view === "master"));
    elements.builderTab.setAttribute("aria-selected", String(view === "builder"));
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function availableCohorts(programme) {
    return uniqueSorted(rows.filter((row) => programmeApplies(row.programme, programme)).map((row) => row.cohort));
  }

  function requiredRows(programme, cohort) {
    return lessonRows.filter((row) => row.cohort === cohort && row.required && programmeApplies(row.programme, programme));
  }

  function optionMetadata(programme, cohort) {
    const options = new Map();
    rows.filter((row) => row.cohort === cohort && !row.required && programmeApplies(row.programme, programme)).forEach((row) => {
      if (!options.has(row.subject_code)) {
        options.set(row.subject_code, {
          selection_id: row.subject_code,
          subject: row.subject,
          subject_short_label: row.subject_short_label,
          class_name: row.subject,
          selection_group: row.selection_group,
          subject_group: row.subject_group,
          exclusive_group: row.exclusive_group,
          display_order: row.display_order,
          record_type: row.record_type,
        });
      } else if (row.record_type === "LESSON") {
        options.get(row.subject_code).record_type = "LESSON";
      }
    });
    return [...options.values()].sort((a, b) => a.display_order - b.display_order || a.class_name.localeCompare(b.class_name));
  }

  function renderBuilderChoices() {
    const programme = elements.studentProgramme.value;
    const cohort = elements.studentCohort.value;
    if (!programme || !cohort) {
      elements.subjectStep.hidden = true;
      elements.nameStep.hidden = true;
      elements.builderActions.hidden = true;
      return;
    }

    const required = requiredRows(programme, cohort);
    const requiredNames = uniqueSorted(required.map((row) => row.class_name));
    elements.requiredSummary.innerHTML = `<strong>Automatically included:</strong> ${requiredNames.map(escapeHtml).join(", ") || "No required components listed"}`;

    const query = elements.subjectSearch.value.trim().toLowerCase();
    const options = optionMetadata(programme, cohort).filter((option) =>
      !query || `${option.subject} ${option.class_name}`.toLowerCase().includes(query)
    );
    const groups = new Map();
    options.forEach((option) => {
      if (!groups.has(option.subject_group)) groups.set(option.subject_group, []);
      groups.get(option.subject_group).push(option);
    });
    elements.subjectChoices.innerHTML = options.length ? [...groups.entries()].map(([group, groupOptions]) => `
      <details class="subject-dropdown">
        <summary><span>${escapeHtml(subjectGroupLabels[group] || group)}</span><span class="selection-count">0 selected</span></summary>
        <div class="dropdown-options">
          ${groupOptions.map((option) => `
            <label class="subject-choice">
              <input type="checkbox" name="subjectSelection" value="${escapeHtml(option.selection_id)}" data-exclusive-group="${escapeHtml(option.exclusive_group)}">
              <span>
                <span class="choice-title">${escapeHtml(option.class_name)}</span>
                <span class="choice-detail">${option.record_type === "OPTION" ? "Online / flexible — no fixed lesson time" : "All fixed lesson times included"}</span>
              </span>
            </label>`).join("")}
        </div>
      </details>`).join("") : '<p class="selected-subject-empty">No subjects match this search.</p>';

    elements.subjectChoices.querySelectorAll('input[name="subjectSelection"]').forEach((input) => {
      input.addEventListener("change", () => {
        const dropdown = input.closest("details");
        const count = dropdown.querySelectorAll('input[name="subjectSelection"]:checked').length;
        dropdown.querySelector(".selection-count").textContent = `${count} selected`;
      });
    });

    elements.subjectStep.hidden = false;
    elements.nameStep.hidden = false;
    elements.builderActions.hidden = false;
  }

  function updateCohorts() {
    const programme = elements.studentProgramme.value;
    elements.studentCohort.innerHTML = '<option value="">Select cohort</option>';
    elements.studentCohort.disabled = !programme;
    if (programme) addOptions(elements.studentCohort, availableCohorts(programme), cohortLabel);
    renderBuilderChoices();
  }

  function selectedIds() {
    return [...elements.subjectChoices.querySelectorAll('input[name="subjectSelection"]:checked')].map((input) => input.value);
  }

  function buildPersonalRows(programme, cohort, selections) {
    const selectedSet = new Set(selections);
    const timetable = [];
    rows.forEach((row) => {
      if (row.cohort !== cohort || !programmeApplies(row.programme, programme) || row.record_type !== "LESSON") return;
      if (row.required) {
        timetable.push({ ...row, attendance: "required" });
      } else if (selectedSet.has(row.subject_code)) {
        timetable.push({ ...row, attendance: "required" });
      }
    });
    return timetable;
  }

  function detectWarnings(programme, cohort, selections, timetable) {
    const warnings = [];
    const options = optionMetadata(programme, cohort);
    const optionMap = new Map(options.map((option) => [option.selection_id, option]));

    selections.forEach((id) => {
      const scheduled = timetable.some((row) => row.subject_code === id);
      if (!scheduled) {
        const option = optionMap.get(id);
        warnings.push({ title: "No scheduled lesson", text: `${option?.class_name || id} has no fixed timetable lesson. Follow the flexible/online arrangements provided by the school.` });
      }
    });

    const exclusive = new Map();
    selections.forEach((id) => {
      const option = optionMap.get(id);
      if (!option?.exclusive_group) return;
      if (!exclusive.has(option.exclusive_group)) exclusive.set(option.exclusive_group, []);
      exclusive.get(option.exclusive_group).push(option.class_name);
    });
    exclusive.forEach((names) => {
      if (names.length > 1) warnings.push({ title: "Mutually exclusive choices selected", text: names.join(" and ") });
    });

    const duplicateMap = new Map();
    timetable.forEach((row) => {
      const key = [row.class_id, row.day, row.start_time, row.end_time, row.room].join("|");
      if (!duplicateMap.has(key)) duplicateMap.set(key, []);
      duplicateMap.get(key).push(row);
    });
    duplicateMap.forEach((duplicates) => {
      if (duplicates.length > 1) warnings.push({ title: "Duplicate lesson rows", text: `${duplicates[0].class_name} appears ${duplicates.length} times on ${duplicates[0].day} at ${formatTimeRange(duplicates[0])}.` });
    });

    const byDay = new Map();
    timetable.forEach((row) => {
      if (!byDay.has(row.day)) byDay.set(row.day, []);
      byDay.get(row.day).push(row);
    });
    byDay.forEach((dayRows, day) => {
      const sorted = dayRows.slice().sort(compareLessons);
      for (let firstIndex = 0; firstIndex < sorted.length; firstIndex += 1) {
        for (let secondIndex = firstIndex + 1; secondIndex < sorted.length; secondIndex += 1) {
          const first = sorted[firstIndex];
          const second = sorted[secondIndex];
          if (first.lesson_id === second.lesson_id) continue;
          if (timeToMinutes(second.start_time) >= timeToMinutes(first.end_time)) break;
          if (timeToMinutes(first.start_time) < timeToMinutes(second.end_time) && timeToMinutes(second.start_time) < timeToMinutes(first.end_time)) {
            warnings.push({
              title: `Time conflict — ${day}`,
              text: `${formatTimeRange(first)} ${first.class_name} conflicts with ${formatTimeRange(second)} ${second.class_name}.`,
            });
          }
        }
      }
    });

    timetable.forEach((row) => {
      if (!row.room) warnings.push({ title: "Missing room", text: `${row.class_name} on ${row.day} at ${formatTimeRange(row)} has no room listed.` });
      else if (["TBC", "TBD", "UNKNOWN"].includes(row.room.toUpperCase())) warnings.push({ title: "Room not yet confirmed", text: `${row.class_name} on ${row.day} at ${formatTimeRange(row)} is currently listed as ${row.room}.` });
    });

    const unique = new Map();
    warnings.forEach((warning) => unique.set(`${warning.title}|${warning.text}`, warning));
    return [...unique.values()];
  }

  function renderWarnings(warnings) {
    if (!warnings.length) {
      elements.personalWarnings.innerHTML = '<p class="conflict-clear">No timetable conflicts detected.</p>';
      return;
    }
    elements.personalWarnings.innerHTML = warnings.map((warning) => `
      <div class="warning-item" role="alert">
        <strong>${escapeHtml(warning.title)}</strong>
        <span>${escapeHtml(warning.text)}</span>
      </div>`).join("");
  }

  function generateTimetable(event) {
    event.preventDefault();
    const programme = elements.studentProgramme.value;
    const cohort = elements.studentCohort.value;
    const name = elements.studentName.value.trim();
    if (!programme || !cohort || !name) {
      elements.studentBuilder.reportValidity();
      return;
    }
    const selections = selectedIds();
    const options = optionMetadata(programme, cohort);
    const optionMap = new Map(options.map((option) => [option.selection_id, option]));
    const timetable = buildPersonalRows(programme, cohort, selections);
    const warnings = detectWarnings(programme, cohort, selections, timetable);

    elements.personalName.textContent = `${name} — Individual Timetable`;
    elements.personalMeta.textContent = `${programme === "DP" ? "Diploma Programme" : "Career-related Programme"} · ${cohortLabel(cohort)} · Semester 2, 2026`;
    elements.generatedDate.textContent = `Generated ${new Intl.DateTimeFormat(undefined, { dateStyle: "long" }).format(new Date())}`;
    elements.personalSubjects.innerHTML = selections.length
      ? selections.map((id) => `<span class="selected-subject-chip">${escapeHtml(optionMap.get(id)?.subject_short_label || optionMap.get(id)?.class_name || id)}</span>`).join("")
      : '<span class="selected-subject-empty">Required programme components only</span>';
    renderWarnings(warnings);
    renderTimetable(elements.personalTimetable, timetable, "ALL");
    showView("personal");
  }

  function clearBuilder() {
    elements.studentProgramme.value = "";
    elements.studentCohort.innerHTML = '<option value="">Select cohort</option>';
    elements.studentCohort.disabled = true;
    elements.studentName.value = "";
    elements.subjectSearch.value = "";
    elements.subjectChoices.innerHTML = "";
    elements.subjectStep.hidden = true;
    elements.nameStep.hidden = true;
    elements.builderActions.hidden = true;
  }

  function clearPersonal() {
    clearBuilder();
    elements.personalName.textContent = "";
    elements.personalMeta.textContent = "";
    elements.personalSubjects.textContent = "";
    elements.personalWarnings.innerHTML = "";
    elements.personalTimetable.innerHTML = "";
    showView("builder");
  }

  function printView(section) {
    document.querySelectorAll(".print-target").forEach((item) => item.classList.remove("print-target"));
    if (section === elements.masterView) {
      elements.legendSearch.value = "";
      renderClassCodeLegend();
    }
    document.body.classList.toggle("printing-master", section === elements.masterView);
    section.classList.add("print-target");
    window.print();
  }

  function initialise() {
    populateMasterFilters();
    renderSubjectGroupLegend();
    renderMaster();
    [elements.programmeFilter, elements.cohortFilter, elements.subjectFilter, elements.dayFilter, elements.teacherFilter, elements.roomFilter]
      .forEach((control) => control.addEventListener("change", renderMaster));
    elements.resetFiltersButton.addEventListener("click", resetMasterFilters);
    elements.legendSearch.addEventListener("input", renderClassCodeLegend);
    elements.masterTimetable.addEventListener("click", (event) => {
      const chip = event.target.closest(".master-chip");
      if (chip) openClassDetail(chip.dataset.lessonId);
    });
    elements.closeClassDetail.addEventListener("click", () => elements.classDetailDialog.close());
    elements.classDetailDialog.addEventListener("click", (event) => {
      if (event.target === elements.classDetailDialog) elements.classDetailDialog.close();
    });
    elements.masterTab.addEventListener("click", () => showView("master"));
    elements.builderTab.addEventListener("click", () => showView("builder"));
    elements.studentProgramme.addEventListener("change", updateCohorts);
    elements.studentCohort.addEventListener("change", renderBuilderChoices);
    elements.subjectSearch.addEventListener("input", renderBuilderChoices);
    elements.studentBuilder.addEventListener("submit", generateTimetable);
    elements.clearBuilderButton.addEventListener("click", clearBuilder);
    elements.editSelectionsButton.addEventListener("click", () => showView("builder"));
    elements.clearTimetableButton.addEventListener("click", clearPersonal);
    elements.returnMasterButton.addEventListener("click", () => showView("master"));
    elements.printMasterButton.addEventListener("click", () => printView(elements.masterView));
    elements.printPersonalButton.addEventListener("click", () => printView(elements.personalView));
    window.addEventListener("afterprint", () => {
      document.querySelectorAll(".print-target").forEach((item) => item.classList.remove("print-target"));
      document.body.classList.remove("printing-master");
    });
  }

  initialise();
})();