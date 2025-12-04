(() => {
  const STORAGE_KEY = "fisia-state-v1";
  const seedData = window.fisiaSeedData ? clone(window.fisiaSeedData) : { professionals: [], patients: [], sessions: [], invoices: [], reminders: [], tasks: [], analytics: {} };

  let state = loadState();
  ensureUiDefaults();
  ensureSidebarStyles();

  const formatCurrency = (value, currency = "EUR") => new Intl.NumberFormat("es-ES", { style: "currency", currency }).format(value || 0);
  const formatPercent = (value, options = {}) => new Intl.NumberFormat("es-ES", { style: "percent", maximumFractionDigits: options.maximumFractionDigits ?? 1 }).format(value || 0);
  const formatDate = (value, options = { dateStyle: "medium" }) => value ? new Intl.DateTimeFormat("es-ES", options).format(new Date(value)) : "";
  const formatTime = (value, options = { hour: "2-digit", minute: "2-digit" }) => value ? new Intl.DateTimeFormat("es-ES", options).format(new Date(value)) : "";
  const formatDateTime = (value) => value ? new Intl.DateTimeFormat("es-ES", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)) : "";

  const page = document.body.dataset.page || "dashboard";

  document.addEventListener("click", delegateActions, true);
  document.addEventListener("input", delegateInputs, true);

  renderPage(page);

  // -------------------- Persistence & state helpers --------------------
  function loadState() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = clone(seedData);
      saveState(initial);
      return initial;
    }
    try {
      const parsed = JSON.parse(raw);
      return mergeState(seedData, parsed);
    } catch (error) {
      console.warn("No se pudo leer el estado almacenado, se restaurará el seed.", error);
      const initial = clone(seedData);
      saveState(initial);
      return initial;
    }
  }

  function mergeState(base, override) {
    const result = clone(base);
    Object.keys(override || {}).forEach((key) => {
      const value = override[key];
      if (value && typeof value === "object" && !Array.isArray(value)) {
        result[key] = mergeState(base[key] || {}, value);
      } else {
        result[key] = value;
      }
    });
    return result;
  }

  function saveState(nextState = state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
    } catch (error) {
      console.warn("No se pudo guardar el estado", error);
    }
  }

  function ensureUiDefaults() {
    state.ui = state.ui || {};
    state.ui.calendar = state.ui.calendar || {};
    state.ui.calendar.date = state.ui.calendar.date || todayIso();
    state.ui.calendar.view = state.ui.calendar.view || "day";
    state.ui.calendar.statusFilter = state.ui.calendar.statusFilter || "all";
    state.ui.calendar.professional = state.ui.calendar.professional || "all";

    state.ui.billing = state.ui.billing || {};
    state.ui.billing.status = state.ui.billing.status || "all";
    state.ui.billing.method = state.ui.billing.method || "all";
    state.ui.billing.dateRange = state.ui.billing.dateRange || "all";
    state.ui.billing.search = state.ui.billing.search || "";

    state.ui.patient = state.ui.patient || {};
    if (!state.ui.patient.currentId) {
      state.ui.patient.currentId = (state.patients[0] && state.patients[0].id) || null;
    }

    state.ui.reports = state.ui.reports || {};
    state.ui.reports.range = state.ui.reports.range || "last-30";
  }

  function todayIso() {
    const today = new Date();
    return today.toISOString().split("T")[0];
  }

  function clone(value) {
    if (typeof structuredClone === "function") {
      return structuredClone(value);
    }
    return JSON.parse(JSON.stringify(value));
  }

  function generateId(prefix) {
    return `${prefix}-${Math.random().toString(16).slice(2, 8)}`;
  }

  function findProfessional(id) {
    return state.professionals.find((pro) => pro.id === id) || null;
  }

  function findPatient(id) {
    return state.patients.find((patient) => patient.id === id) || null;
  }

  function getSessionsByDate(dateIso) {
    return state.sessions.filter((session) => session.start && session.start.startsWith(dateIso));
  }

  function upsertPatient(patientPayload) {
    const existing = patientPayload.id ? findPatient(patientPayload.id) : null;
    if (existing) {
      Object.assign(existing, patientPayload);
      return existing;
    }
    const newPatient = {
      id: patientPayload.id || generateId("pat"),
      avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=120&q=80",
      status: "en_tratamiento",
      adherence: 0.8,
      adherenceHistory: [],
      plan: [],
      soapNotes: [],
      attachments: [],
      tags: [],
      ...patientPayload
    };
    state.patients.push(newPatient);
    return newPatient;
  }

  function addSession(sessionPayload) {
    const newSession = {
      id: generateId("ses"),
      status: "pending",
      channel: "presencial",
      ...sessionPayload
    };
    state.sessions.push(newSession);
    return newSession;
  }

  function addInvoice(invoicePayload) {
    const newInvoice = {
      id: generateId("INV"),
      currency: "EUR",
      status: "pending",
      issueDate: todayIso(),
      ...invoicePayload
    };
    state.invoices.push(newInvoice);
    return newInvoice;
  }

  function addReminder(reminderPayload) {
    const newReminder = {
      id: generateId("rem"),
      status: "scheduled",
      ...reminderPayload
    };
    state.reminders.push(newReminder);
    return newReminder;
  }

  function addSoapNote(patientId, notePayload) {
    const patient = findPatient(patientId);
    if (!patient) return null;
    const note = {
      id: generateId("soap"),
      date: todayIso(),
      authorId: notePayload.authorId || "pro-ana",
      painLevel: notePayload.painLevel || 0,
      ...notePayload
    };
    patient.soapNotes = patient.soapNotes || [];
    patient.soapNotes.unshift(note);
    return note;
  }

  function toggleTask(taskId, completed) {
    const task = state.tasks.find((item) => item.id === taskId);
    if (task) {
      task.completed = completed;
    }
  }

  // -------------------- Global Event Delegation --------------------
  function delegateActions(event) {
    const trigger = event.target.closest("[data-action]");
    if (!trigger) return;

    const action = trigger.dataset.action;
    if (action === "open-flow") {
      event.preventDefault();
      const startStep = trigger.dataset.flowStart || "patient";
      openFlowWizard(startStep);
      return;
    }

    if (action === "toggle-task") {
      event.preventDefault();
      const taskId = trigger.dataset.taskId;
      const completed = trigger.checked;
      toggleTask(taskId, completed);
      saveAndRefresh();
      return;
    }

    if (action === "calendar-prev") {
      event.preventDefault();
      shiftCalendarDate(-1);
      return;
    }

    if (action === "calendar-next") {
      event.preventDefault();
      shiftCalendarDate(1);
      return;
    }

    if (action === "calendar-today") {
      event.preventDefault();
      state.ui.calendar.date = todayIso();
      saveAndRefresh();
      return;
    }

    if (action === "open-patient-selector") {
      event.preventDefault();
      openPatientSelector();
      return;
    }

    if (action === "patient-tab") {
      event.preventDefault();
      const tabId = trigger.dataset.tab;
      setActivePatientTab(tabId);
      return;
    }

    if (action === "add-soap-note") {
      event.preventDefault();
      openSoapNoteForm(state.ui.patient.currentId);
      return;
    }

    if (action === "add-attachment") {
      event.preventDefault();
      showToast("Funcionalidad de adjuntos disponible próximamente.");
      return;
    }

    if (action === "complete-session") {
      event.preventDefault();
      handleSessionCompletion();
      return;
    }

    if (action === "billing-mark-paid") {
      event.preventDefault();
      const invoiceId = trigger.dataset.invoiceId;
      markInvoiceAsPaid(invoiceId);
      return;
    }

    if (action === "billing-filter") {
      event.preventDefault();
      openBillingFilter(trigger.dataset.filterType || "status");
      return;
    }

    if (action === "reports-range") {
      event.preventDefault();
      const range = trigger.dataset.range;
      state.ui.reports.range = range;
      saveAndRefresh();
      return;
    }

    if (action === "session-detail") {
      event.preventDefault();
      const sessionId = trigger.dataset.sessionId;
      openSessionDetail(sessionId);
      return;
    }
  }

  function delegateInputs(event) {
    const target = event.target;
    if (!target) return;

    if (target.matches("[data-billing-search]")) {
      state.ui.billing.search = target.value || "";
      renderBilling();
      saveState();
      return;
    }

    if (target.matches("[data-calendar-view-toggle] input[type=radio]")) {
      state.ui.calendar.view = target.value.toLowerCase();
      renderCalendar();
      saveState();
      return;
    }
  }

  function saveAndRefresh() {
    saveState();
    renderPage(page);
  }

  function ensureSidebarStyles() {
    if (document.getElementById("fisia-shared-sidebar-styles")) return;
    const style = document.createElement("style");
    style.id = "fisia-shared-sidebar-styles";
    style.textContent = `
[data-nav] a {
  transition: background-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
}
[data-nav] a[data-active="true"] {
  background-color: rgba(74, 154, 138, 0.16) !important;
  color: #135851 !important;
  box-shadow: inset 0 0 0 1px rgba(74, 154, 138, 0.35);
}
[data-nav] a[data-active="true"] p {
  font-weight: 600;
}
[data-nav] a[data-active="true"] .material-symbols-outlined {
  color: #135851 !important;
}
body.dark [data-nav] a[data-active="true"] {
  background-color: rgba(74, 154, 138, 0.32) !important;
  color: #F4F7F6 !important;
  box-shadow: inset 0 0 0 1px rgba(74, 154, 138, 0.6);
}
body.dark [data-nav] a[data-active="true"] .material-symbols-outlined {
  color: #F4F7F6 !important;
}`;
    document.head.append(style);
  }

  function syncNavigationState(activePage) {
    const derived = ({ session: "patient" })[activePage] || activePage;
    const links = document.querySelectorAll("[data-nav-link]");
    links.forEach((link) => {
      const isActive = link.dataset.navLink === derived;
      if (isActive) {
        link.setAttribute("data-active", "true");
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("data-active");
        link.removeAttribute("aria-current");
      }
    });
  }

  // -------------------- Render dispatch --------------------
  function renderPage(pageId) {
    syncNavigationState(pageId);
    switch (pageId) {
      case "dashboard":
        renderDashboard();
        break;
      case "calendar":
        renderCalendar();
        break;
      case "patient":
        renderPatient();
        break;
      case "session":
        renderSession();
        break;
      case "billing":
        renderBilling();
        break;
      case "reports":
        renderReports();
        break;
      default:
        renderDashboard();
    }
  }

  // -------------------- Dashboard --------------------
  function renderDashboard() {
    renderDashboardMetrics();
    renderDashboardAppointments();
    renderDashboardTasks();
  }

  function renderDashboardMetrics() {
    const container = document.querySelector("[data-dashboard-metrics]");
    if (!container) return;
    const today = new Date();
    const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const sessionsThisMonth = state.sessions.filter((session) => session.start && new Date(session.start) >= currentMonthStart);
    const invoicesThisMonth = state.invoices.filter((invoice) => invoice.issueDate && new Date(invoice.issueDate) >= currentMonthStart);

    const metrics = [
      {
        id: "sessions",
        label: "Sesiones completadas",
        value: sessionsThisMonth.filter((session) => session.status === "completed").length,
        trend: "+5% vs mes anterior",
        icon: "event_available",
        accent: "text-primary"
      },
      {
        id: "noShows",
        label: "No-shows",
        value: sessionsThisMonth.filter((session) => ["cancelled", "no-show"].includes(session.status)).length,
        trend: "-2 vs ayer",
        icon: "event_busy",
        accent: "text-danger"
      },
      {
        id: "activePatients",
        label: "Pacientes activos",
        value: state.patients.filter((patient) => patient.status !== "alta").length,
        trend: "+2% vs semana pasada",
        icon: "groups",
        accent: "text-secondary"
      },
      {
        id: "revenueToday",
        label: "Ingresos hoy",
        value: computeRevenueForDate(today),
        trend: `Pagos ${countPaidToday(today)}`,
        icon: "payments",
        accent: "text-primary"
      }
    ];

    container.innerHTML = metrics
      .map((metric) => `
        <article class="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-neutral-dark/40 border border-neutral-light dark:border-neutral-dark shadow-sm">
          <div class="flex items-center gap-2 text-sm font-semibold text-neutral-500 dark:text-neutral-300">
            <span class="material-symbols-outlined ${metric.accent}">${metric.icon}</span>
            <span>${metric.label}</span>
          </div>
          <p class="text-3xl font-bold text-neutral-dark dark:text-white">${metric.id === "revenueToday" ? formatCurrency(metric.value) : metric.value}</p>
          <p class="text-xs text-neutral-500 dark:text-neutral-400">${metric.trend}</p>
        </article>`)
      .join("");
  }

  function computeRevenueForDate(date) {
    return state.invoices
      .filter((invoice) => invoice.paidAt && isSameDate(new Date(invoice.paidAt), date))
      .reduce((acc, invoice) => acc + (invoice.amount || 0), 0);
  }

  function countPaidToday(date) {
    return state.invoices.filter((invoice) => invoice.paidAt && isSameDate(new Date(invoice.paidAt), date)).length;
  }

  function renderDashboardAppointments() {
    const container = document.querySelector("[data-dashboard-appointments]");
    if (!container) return;
    const dateIso = state.ui.calendar.date || todayIso();
    const sessions = getSessionsByDate(dateIso).sort((a, b) => new Date(a.start) - new Date(b.start)).slice(0, 5);

    if (!sessions.length) {
      container.innerHTML = `
        <div class="text-center py-10 rounded-lg border border-dashed border-neutral-light dark:border-neutral-dark bg-neutral-light/40 dark:bg-neutral-dark/40">
          <span class="material-symbols-outlined text-3xl text-neutral-400">event</span>
          <p class="mt-2 text-sm text-neutral-500">No hay citas programadas para este día.</p>
          <button type="button" data-action="open-flow" data-flow-start="session" class="mt-4 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90">Agendar nueva sesión</button>
        </div>`;
      return;
    }

    container.innerHTML = sessions
      .map((session) => renderAppointmentCard(session))
      .join("") + `<button class="w-full text-primary font-semibold py-2 rounded-lg hover:bg-primary/10" data-action="open-flow" data-flow-start="session" type="button">Ver agenda completa</button>`;
  }

  function renderAppointmentCard(session) {
    const patient = findPatient(session.patientId);
    const professional = findProfessional(session.professionalId);
    const statusConfig = getStatusPill(session.status);
    return `
      <article class="flex items-center justify-between p-3 rounded-lg border border-transparent hover:border-neutral-light dark:hover:border-neutral-dark transition" data-action="session-detail" data-session-id="${session.id}">
        <div class="flex items-center gap-4">
          <div class="flex flex-col items-center">
            <span class="text-lg font-bold text-neutral-dark dark:text-white">${formatTime(session.start)}</span>
            <span class="text-xs text-neutral-500">${professional ? professional.name.split(" ")[1] || professional.name : ""}</span>
          </div>
          <div>
            <p class="font-semibold text-neutral-dark dark:text-white">${patient ? patient.name : "Paciente"}</p>
            <p class="text-sm text-neutral-500 dark:text-neutral-400">${session.type || "Sesión"} • ${professional ? professional.name : ""}</p>
          </div>
        </div>
        <span class="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusConfig.className}"><span class="size-1.5 rounded-full ${statusConfig.dotClass}"></span>${statusConfig.label}</span>
      </article>`;
  }

  function getStatusPill(status) {
    switch (status) {
      case "completed":
        return { label: "Completada", className: "bg-success/15 text-success", dotClass: "bg-success" };
      case "confirmed":
        return { label: "Confirmada", className: "bg-secondary/15 text-secondary", dotClass: "bg-secondary" };
      case "pending":
        return { label: "Pendiente", className: "bg-warning/20 text-warning", dotClass: "bg-warning" };
      case "cancelled":
        return { label: "Cancelada", className: "bg-danger/15 text-danger", dotClass: "bg-danger" };
      case "available":
        return { label: "Disponible", className: "bg-neutral-light/60 text-neutral-500", dotClass: "bg-neutral-400" };
      default:
        return { label: status || "", className: "bg-neutral-light/60 text-neutral-500", dotClass: "bg-neutral-400" };
    }
  }

  function renderDashboardTasks() {
    const container = document.querySelector("[data-dashboard-tasks]");
    if (!container) return;
    if (!state.tasks.length) {
      container.innerHTML = `
        <div class="text-center py-8">
          <span class="material-symbols-outlined text-3xl text-success">task_alt</span>
          <p class="mt-2 text-sm text-neutral-500">No hay tareas pendientes.</p>
          <button class="mt-4 px-4 py-2 rounded-lg border border-primary text-primary text-sm font-semibold hover:bg-primary/10" data-action="open-flow" data-flow-start="patient" type="button">Crear flujo rápido</button>
        </div>`;
      return;
    }

    container.innerHTML = state.tasks
      .map((task) => `
        <label class="flex items-start gap-3 rounded-lg border border-transparent hover:border-neutral-light dark:hover:border-neutral-dark p-2">
          <input type="checkbox" class="h-5 w-5 rounded text-primary bg-neutral-light/50 border-gray-300 focus:ring-primary/40" ${task.completed ? "checked" : ""} data-action="toggle-task" data-task-id="${task.id}"/>
          <span class="text-sm ${task.completed ? "text-neutral-400 line-through" : "text-neutral-dark dark:text-neutral-200"}">${task.text}</span>
        </label>`)
      .join("");
  }

  // -------------------- Calendar --------------------
  function renderCalendar() {
    const rangeLabel = document.querySelector("[data-calendar-range]");
    if (rangeLabel) {
      const date = new Date(state.ui.calendar.date);
      rangeLabel.textContent = new Intl.DateTimeFormat("es-ES", { dateStyle: state.ui.calendar.view === "week" ? "long" : "full" }).format(date);
    }

    const viewToggle = document.querySelector("[data-calendar-view-toggle]");
    if (viewToggle) {
      const radios = viewToggle.querySelectorAll("input[type=radio]");
      radios.forEach((radio) => {
        radio.checked = radio.value.toLowerCase() === state.ui.calendar.view;
      });
    }

    [...document.querySelectorAll("[data-calendar-column]")].forEach((column) => {
      const body = column.querySelector("[data-calendar-column-body]");
      if (!body) return;
      body.innerHTML = "";
      const emptyState = column.querySelector("[data-empty-state]");
      const professionalId = column.dataset.calendarColumn;
      const sessions = filterSessionsForColumn(professionalId);
      if (!sessions.length) {
        if (emptyState) emptyState.classList.remove("hidden");
        return;
      }
      if (emptyState) emptyState.classList.add("hidden");
      sessions.forEach((session) => {
        const block = document.createElement("article");
        const metrics = computeBlockMetrics(session);
        block.className = `absolute inset-x-1 rounded-lg cursor-pointer overflow-hidden border-l-4 ${metrics.classes}`;
        block.style.top = metrics.top;
        block.style.height = metrics.height;
        block.dataset.action = "session-detail";
        block.dataset.sessionId = session.id;
        const patient = findPatient(session.patientId);
        const professional = findProfessional(session.professionalId);
        block.innerHTML = `
          <div class="h-full w-full px-3 py-2 text-xs text-neutral-800 dark:text-neutral-100 flex flex-col justify-between">
            <div class="flex items-center justify-between gap-2">
              <span class="font-semibold text-sm">${patient ? patient.name : "Paciente"}</span>
              <span>${formatTime(session.start)}</span>
            </div>
            <p class="text-[11px] opacity-80">${session.type || "Sesión"} • ${professional ? professional.name : ""}</p>
          </div>`;
        body.appendChild(block);
      });
    });
  }

  function filterSessionsForColumn(professionalId) {
    const dateIso = state.ui.calendar.date || todayIso();
    const daySessions = getSessionsByDate(dateIso);
    return daySessions.filter((session) => session.professionalId === professionalId);
  }

  function computeBlockMetrics(session) {
    const dayStart = 9 * 60;
    const dayEnd = 18 * 60;
    const start = new Date(session.start);
    const end = new Date(session.end || session.start);
    const startMinutes = start.getHours() * 60 + start.getMinutes();
    const endMinutes = end.getHours() * 60 + end.getMinutes();
    const total = dayEnd - dayStart;
    const topPercent = Math.max(((startMinutes - dayStart) / total) * 100, 0);
    const heightPercent = Math.max(((endMinutes - startMinutes) / total) * 100, 6);
    const status = getStatusPill(session.status);
    return {
      top: `calc(${topPercent}% + 2px)`,
      height: `calc(${heightPercent}% - 4px)`,
      classes: status.className.replace(/text-/g, "border-") + " bg-white/90 dark:bg-neutral-dark/70 backdrop-blur"
    };
  }

  function shiftCalendarDate(offsetDays) {
    const current = new Date(state.ui.calendar.date || todayIso());
    current.setDate(current.getDate() + offsetDays);
    state.ui.calendar.date = current.toISOString().split("T")[0];
    saveAndRefresh();
  }

  function openSessionDetail(sessionId) {
    const session = state.sessions.find((item) => item.id === sessionId);
    if (!session) return;
    const patient = findPatient(session.patientId);
    const professional = findProfessional(session.professionalId);

    const content = `
      <div class="p-6">
        <h3 class="text-lg font-semibold text-neutral-dark dark:text-white flex items-center gap-2">
          <span class="material-symbols-outlined text-primary">event</span>
          Detalle de sesión
        </h3>
        <div class="mt-4 space-y-2 text-sm text-neutral-600 dark:text-neutral-300">
          <p><strong>Paciente:</strong> ${patient ? patient.name : ""}</p>
          <p><strong>Profesional:</strong> ${professional ? professional.name : ""}</p>
          <p><strong>Horario:</strong> ${formatDateTime(session.start)} - ${formatTime(session.end)}</p>
          <p><strong>Estado:</strong> ${getStatusPill(session.status).label}</p>
          <p><strong>Tipo:</strong> ${session.type || "Sesión"}</p>
        </div>
        <div class="mt-6 flex flex-wrap gap-3">
          <button type="button" class="px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold" data-session-action="complete" data-session-id="${session.id}">Marcar completada</button>
          <button type="button" class="px-4 py-2 rounded-lg border border-danger text-danger text-sm font-semibold" data-session-action="cancel" data-session-id="${session.id}">Cancelar</button>
          <button type="button" class="px-4 py-2 rounded-lg bg-neutral-light text-neutral-700 text-sm font-semibold" data-close-modal>Cancelar</button>
        </div>
      </div>`;

    const modal = createModal(content);
    modal.mount();

    modal.container.addEventListener("click", (event) => {
      const actionBtn = event.target.closest("[data-session-action]");
      if (!actionBtn) return;
      const action = actionBtn.dataset.sessionAction;
      if (action === "complete") {
        session.status = "completed";
        addSoapNote(session.patientId, {
          date: todayIso(),
          title: "Sesión completada",
          authorId: session.professionalId,
          subjective: "Sesión marcada desde calendario.",
          objective: "",
          assessment: "",
          plan: ""
        });
        saveAndRefresh();
        modal.unmount();
        showToast("Sesión marcada como completada");
      }
      if (action === "cancel") {
        session.status = "cancelled";
        saveAndRefresh();
        modal.unmount();
        showToast("Sesión cancelada");
      }
    });
  }

  // -------------------- Patient --------------------
  function renderPatient() {
    const patient = findPatient(state.ui.patient.currentId);
    if (!patient) return;

    const avatar = document.querySelector("[data-patient-avatar]");
    if (avatar) {
      avatar.style.backgroundImage = `url('${patient.avatar || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=120&q=80"}')`;
      avatar.dataset.alt = `Foto de ${patient.name}`;
    }

    const nameEl = document.querySelector("[data-patient-name]");
    if (nameEl) nameEl.textContent = patient.name;

    const idEl = document.querySelector("[data-patient-id]");
    if (idEl) idEl.textContent = `ID Paciente: ${patient.id.toUpperCase()}`;

    const contactEl = document.querySelector("[data-patient-contact]");
    if (contactEl) contactEl.textContent = `${computeAge(patient.birthday)} años | ${patient.phone} | ${patient.email}`;

    const breadcrumb = document.querySelector("[data-patient-breadcrumb]");
    if (breadcrumb) breadcrumb.textContent = patient.name;

    renderPatientOverview(patient);
    renderPatientSoap(patient);
    renderPatientPlan(patient);
    renderPatientAttachments(patient);
    renderPatientAdherence(patient);
    setActivePatientTab(state.ui.patient.tab || "soap", { skipSave: true });
  }

  function renderPatientOverview(patient) {
    const container = document.querySelector("[data-patient-overview]");
    if (!container) return;
    const professional = findProfessional(patient.primaryTherapistId);
    const nextSession = state.sessions
      .filter((session) => session.patientId === patient.id && session.status !== "completed")
      .sort((a, b) => new Date(a.start) - new Date(b.start))[0];

    const overviewItems = [
      {
        label: "Fisioterapeuta principal",
        value: professional ? professional.name : "Sin asignar",
        icon: "person"
      },
      {
        label: "Próxima cita",
        value: nextSession ? `${formatDateTime(nextSession.start)} • ${findProfessional(nextSession.professionalId)?.name || ""}` : "Sin agendar",
        icon: "event_available"
      },
      {
        label: "Plan activo",
        value: patient.plan?.find((plan) => plan.status === "in_progress")?.title || "Ninguno",
        icon: "fact_check"
      },
      {
        label: "Adherencia",
        value: formatPercent(patient.adherence || 0, { maximumFractionDigits: 0 }),
        icon: "task_alt"
      }
    ];

    container.innerHTML = overviewItems
      .map((item) => `
        <div class="flex items-start gap-3 rounded-lg border border-neutral-border dark:border-neutral-text-light/20 bg-white dark:bg-background-dark px-4 py-3">
          <span class="material-symbols-outlined text-primary">${item.icon}</span>
          <div>
            <p class="text-xs uppercase tracking-wide text-neutral-text-light dark:text-neutral-text-light/70">${item.label}</p>
            <p class="text-sm font-semibold text-neutral-text-dark dark:text-white">${item.value}</p>
          </div>
        </div>`)
      .join("");
  }

  function renderPatientSoap(patient) {
    const container = document.querySelector("[data-patient-soap-list]");
    if (!container) return;
    const notes = (patient.soapNotes || []).slice().sort((a, b) => new Date(b.date) - new Date(a.date));
    if (!notes.length) {
      container.innerHTML = `
        <div class="col-span-2 text-center py-10 text-sm text-subtext-light dark:text-subtext-dark">
          Aún no hay notas registradas. Usa "Registrar nota" para añadir la primera.
        </div>`;
      return;
    }

    container.innerHTML = notes
      .map((note, index) => {
        const professional = findProfessional(note.authorId);
        const avatar = `<div class="bg-secondary-green/20 text-secondary-green p-2 rounded-full"><span class="material-symbols-outlined text-base">note_alt</span></div>`;
        return `
          <div class="flex flex-col items-center gap-1 ${index === 0 ? "pt-3" : "pt-6"}">${avatar}<div class="w-[2px] bg-neutral-border dark:bg-neutral-text-light/20 flex-1"></div></div>
          <div class="flex flex-col pb-6">
            <p class="text-sm font-semibold text-neutral-text-dark dark:text-white">${note.title || "Nota SOAP"}</p>
            <p class="text-xs text-subtext-light dark:text-subtext-dark mb-2">${formatDate(note.date)} • ${professional ? professional.name : "Equipo"} • Dolor ${note.painLevel ?? "-"}/10</p>
            <div class="space-y-1 text-xs text-neutral-text-light dark:text-subtext-dark">
              ${note.subjective ? `<p><strong>S:</strong> ${note.subjective}</p>` : ""}
              ${note.objective ? `<p><strong>O:</strong> ${note.objective}</p>` : ""}
              ${note.assessment ? `<p><strong>A:</strong> ${note.assessment}</p>` : ""}
              ${note.plan ? `<p><strong>P:</strong> ${note.plan}</p>` : ""}
            </div>
          </div>`;
      })
      .join("");
  }

  function renderPatientPlan(patient) {
    const container = document.querySelector("[data-patient-plan-list]");
    if (!container) return;
    const plans = patient.plan || [];
    if (!plans.length) {
      container.innerHTML = `<p class="text-sm text-subtext-light dark:text-subtext-dark">No hay planes activos.</p>`;
      return;
    }
    container.innerHTML = plans
      .map((plan) => {
        const professional = findProfessional(plan.assignedTo);
        const progress = plan.sessionsTotal ? Math.round((plan.sessionsCompleted / plan.sessionsTotal) * 100) : 0;
        return `
          <article class="border border-neutral-border dark:border-neutral-text-light/20 rounded-lg px-4 py-3">
            <header class="flex items-center justify-between gap-2 mb-2">
              <h4 class="text-sm font-semibold text-neutral-text-dark dark:text-white">${plan.title}</h4>
              <span class="text-xs px-2 py-0.5 rounded-full ${plan.status === "completed" ? "bg-success/15 text-success" : "bg-warning/20 text-warning"}">${plan.status === "completed" ? "Completado" : "En progreso"}</span>
            </header>
            <p class="text-xs text-subtext-light dark:text-subtext-dark">${plan.focus}</p>
            <div class="mt-3 flex items-center justify-between text-xs text-subtext-light dark:text-subtext-dark">
              <span>Responsable: ${professional ? professional.name : "Equipo"}</span>
              <span>${plan.sessionsCompleted}/${plan.sessionsTotal} sesiones (${progress}%)</span>
            </div>
            <div class="mt-2 h-2 rounded-full bg-neutral-border dark:bg-neutral-text-light/20 overflow-hidden">
              <div class="h-full bg-primary" style="width:${progress}%"></div>
            </div>
          </article>`;
      })
      .join("");
  }

  function renderPatientAttachments(patient) {
    const list = document.querySelector("[data-patient-attachments]");
    const empty = document.querySelector("[data-attachments-empty]");
    if (!list) return;
    const attachments = patient.attachments || [];
    if (!attachments.length) {
      if (empty) empty.classList.remove("hidden");
      list.innerHTML = "";
      return;
    }
    if (empty) empty.classList.add("hidden");
    list.innerHTML = attachments
      .map((file) => `
        <article class="border border-neutral-border dark:border-neutral-text-light/20 rounded-lg px-3 py-2 text-sm flex items-center justify-between gap-3 bg-white dark:bg-background-dark">
          <div>
            <p class="font-semibold text-neutral-text-dark dark:text-white">${file.name}</p>
            <p class="text-xs text-subtext-light dark:text-subtext-dark">${formatDate(file.uploadedAt)} • ${(file.sizeKB / 1024).toFixed(1)} MB</p>
          </div>
          <button class="text-primary text-xs font-semibold hover:underline" type="button">Ver</button>
        </article>`)
      .join("");
  }

  function renderPatientAdherence(patient) {
    const container = document.querySelector("[data-patient-adherence]");
    if (!container) return;
    const history = patient.adherenceHistory || [];
    if (!history.length) {
      container.innerHTML = `<p class="text-sm text-subtext-light dark:text-subtext-dark">Sin datos suficientes.</p>`;
      return;
    }
    const maxValue = Math.max(...history.map((point) => point.value));
    container.innerHTML = `
      <div class="grid grid-flow-col gap-4 items-end justify-items-center">
        ${history
          .map((point) => {
            const percent = maxValue ? Math.round((point.value / maxValue) * 90 + 10) : 0;
            return `
              <div class="flex flex-col items-center w-full">
                <div class="w-full rounded-t-md bg-secondary/40 dark:bg-secondary/30" style="height:${percent}%"></div>
                <p class="mt-2 text-xs text-subtext-light dark:text-subtext-dark">${point.label}</p>
                <p class="text-xs font-semibold text-neutral-text-dark dark:text-white">${formatPercent(point.value, { maximumFractionDigits: 0 })}</p>
              </div>`;
          })
          .join("")}
      </div>`;
  }

  function setActivePatientTab(tabId, options = {}) {
    state.ui.patient.tab = tabId;
    const tabs = document.querySelectorAll("[data-patient-tab]");
    tabs.forEach((tab) => {
      const active = tab.dataset.patientTab === tabId;
      tab.classList.toggle("border-b-primary-blue", active);
      tab.classList.toggle("text-primary-blue", active);
      tab.setAttribute("aria-current", active ? "true" : "false");
    });
    const panels = document.querySelectorAll("[data-patient-tab-panel]");
    panels.forEach((panel) => {
      panel.classList.toggle("hidden", panel.dataset.patientTabPanel !== tabId);
    });
    if (!options.skipSave) saveState();
  }

  function computeAge(dateString) {
    if (!dateString) return "-";
    const birth = new Date(dateString);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }

  function openPatientSelector() {
    const list = state.patients
      .map((patient) => `<button type="button" class="flex items-center justify-between w-full px-3 py-2 rounded-lg hover:bg-neutral-light/60 dark:hover:bg-neutral-dark/60" data-select-patient="${patient.id}"><span>${patient.name}</span><span class="text-xs text-neutral-500">${formatPercent(patient.adherence, { maximumFractionDigits: 0 })}</span></button>`)
      .join("");

    const modal = createModal(`
      <div class="p-6">
        <h3 class="text-lg font-semibold text-neutral-dark dark:text-white mb-4">Selecciona paciente</h3>
        <div class="grid gap-2" data-patient-selector-list>
          ${list}
        </div>
      </div>`);
    modal.mount();
    const listEl = modal.container.querySelector("[data-patient-selector-list]");
    listEl.addEventListener("click", (event) => {
      const button = event.target.closest("[data-select-patient]");
      if (!button) return;
      state.ui.patient.currentId = button.dataset.selectPatient;
      saveAndRefresh();
      modal.unmount();
    });
  }

  function openSoapNoteForm(patientId) {
    const patient = findPatient(patientId);
    if (!patient) {
      showToast("Paciente no encontrado");
      return;
    }
    const content = `
      <form class="p-6 space-y-4" data-soap-form>
        <h3 class="text-lg font-semibold text-neutral-dark dark:text-white">Registrar nota SOAP</h3>
        <div class="grid gap-3">
          <label class="flex flex-col gap-1 text-sm text-neutral-600 dark:text-neutral-200">
            <span>Descripción breve</span>
            <input name="title" type="text" class="rounded-lg border border-neutral-border dark:border-neutral-text-light/20 bg-white dark:bg-background-dark px-3 py-2" placeholder="Sesión de seguimiento" required>
          </label>
          <label class="flex flex-col gap-1 text-sm text-neutral-600 dark:text-neutral-200">
            <span>Dolor (0-10)</span>
            <input name="painLevel" type="number" min="0" max="10" class="rounded-lg border border-neutral-border dark:border-neutral-text-light/20 bg-white dark:bg-background-dark px-3 py-2" value="3">
          </label>
          <label class="flex flex-col gap-1 text-sm text-neutral-600 dark:text-neutral-200">
            <span>S - Subjetivo</span>
            <textarea name="subjective" rows="2" class="rounded-lg border border-neutral-border dark:border-neutral-text-light/20 bg-white dark:bg-background-dark px-3 py-2" placeholder="Cómo se siente el paciente..."></textarea>
          </label>
          <label class="flex flex-col gap-1 text-sm text-neutral-600 dark:text-neutral-200">
            <span>O - Objetivo</span>
            <textarea name="objective" rows="2" class="rounded-lg border border-neutral-border dark:border-neutral-text-light/20 bg-white dark:bg-background-dark px-3 py-2"></textarea>
          </label>
          <label class="flex flex-col gap-1 text-sm text-neutral-600 dark:text-neutral-200">
            <span>A - Análisis</span>
            <textarea name="assessment" rows="2" class="rounded-lg border border-neutral-border dark:border-neutral-text-light/20 bg-white dark:bg-background-dark px-3 py-2"></textarea>
          </label>
          <label class="flex flex-col gap-1 text-sm text-neutral-600 dark:text-neutral-200">
            <span>P - Plan</span>
            <textarea name="plan" rows="2" class="rounded-lg border border-neutral-border dark:border-neutral-text-light/20 bg-white dark:bg-background-dark px-3 py-2"></textarea>
          </label>
        </div>
        <div class="flex justify-end gap-3">
          <button type="button" class="px-4 py-2 text-sm font-semibold text-neutral-500 hover:text-neutral-700" data-close-modal>Cancelar</button>
          <button type="submit" class="px-4 py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary/90">Guardar nota</button>
        </div>
      </form>`;

    const modal = createModal(content);
    modal.mount();
    const form = modal.container.querySelector("[data-soap-form]");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const payload = Object.fromEntries(formData.entries());
      payload.painLevel = Number(payload.painLevel || 0);
      addSoapNote(patientId, payload);
      saveAndRefresh();
      modal.unmount();
      showToast("Nota registrada correctamente");
    });
  }

  // -------------------- Session page --------------------
  function renderSession() {
    const params = new URLSearchParams(window.location.search);
    const patientId = params.get("patient") || state.ui.patient.currentId;
    const sessionId = params.get("session");
    const patient = findPatient(patientId);
    const session = sessionId ? state.sessions.find((item) => item.id === sessionId) : null;

    const header = document.querySelector("main .flex.min-w-72");
    if (header && patient) {
      header.querySelector("p")?.replaceWith(createElementFromHTML(`<p class="text-text-light-primary dark:text-dark-primary text-3xl sm:text-4xl font-black leading-tight tracking-tighter">Progreso de la sesión para ${patient.name}</p>`));
    }

    const summaryMap = {
      dob: patient?.birthday ? formatDate(patient.birthday) : "-",
      diagnosis: patient?.diagnosis || "-",
      nextSession: session ? formatDateTime(session.start) : "Sin agendar"
    };

    Object.entries(summaryMap).forEach(([key, value]) => {
      const el = document.querySelector(`[data-session-summary="${key}"]`);
      if (el) el.textContent = value;
    });

    const form = document.querySelector("[data-session-form]");
    if (form) {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        handleSessionCompletion();
      });
    }
  }

  function handleSessionCompletion() {
    const form = document.querySelector("[data-session-form]");
    if (!form) return;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session");
    const session = sessionId ? state.sessions.find((item) => item.id === sessionId) : null;
    const patientId = session ? session.patientId : state.ui.patient.currentId;
    if (session) {
      session.status = "completed";
    }
    addSoapNote(patientId, {
      date: todayIso(),
      title: payload.title || "Sesión",
      subjective: payload.subjective,
      objective: payload.objective,
      assessment: payload.assessment,
      plan: payload.plan,
      painLevel: Number(payload.painLevel || 0),
      authorId: session ? session.professionalId : "pro-ana"
    });
    saveAndRefresh();
    showToast("Sesión actualizada correctamente");
  }

  // -------------------- Billing --------------------
  function renderBilling() {
    renderBillingMetrics();
    renderBillingTable();
    const search = document.querySelector("[data-billing-search]");
    if (search) search.value = state.ui.billing.search || "";
  }

  function renderBillingMetrics() {
    const container = document.querySelector("[data-billing-metrics]");
    if (!container) return;
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const invoicesThisMonth = state.invoices.filter((invoice) => invoice.issueDate && new Date(invoice.issueDate) >= startOfMonth);

    const metrics = [
      {
        label: "Ingresos del mes",
        value: invoicesThisMonth.filter((invoice) => invoice.status === "paid").reduce((acc, invoice) => acc + (invoice.amount || 0), 0),
        trend: `Pagos ${invoicesThisMonth.filter((invoice) => invoice.status === "paid").length}`,
        icon: "stacked_line_chart",
        accent: "text-primary"
      },
      {
        label: "Facturas pendientes",
        value: state.invoices.filter((invoice) => invoice.status === "pending").length,
        trend: "Necesitan seguimiento",
        icon: "hourglass",
        accent: "text-warning"
      },
      {
        label: "Total adeudado",
        value: state.invoices.filter((invoice) => ["pending", "overdue"].includes(invoice.status)).reduce((acc, invoice) => acc + (invoice.amount || 0), 0),
        trend: `${state.invoices.filter((invoice) => invoice.status === "overdue").length} vencidas",
        icon: "warning",
        accent: "text-danger"
      },
      {
        label: "Pagos hoy",
        value: computeRevenueForDate(today),
        trend: `${countPaidToday(today)} confirmados",
        icon: "payments",
        accent: "text-success"
      }
    ];

    container.innerHTML = metrics
      .map((metric) => `
        <article class="flex flex-col gap-2 rounded-lg p-6 border border-border-light dark:border-border-dark bg-white dark:bg-background-dark/60 shadow-sm">
          <div class="flex items-center gap-2 text-sm font-semibold text-subtext-light dark:text-subtext-dark">
            <span class="material-symbols-outlined ${metric.accent}">${metric.icon}</span>
            <span>${metric.label}</span>
          </div>
          <p class="text-3xl font-bold text-text-light dark:text-text-dark">${metric.label.toLowerCase().includes("facturas") ? metric.value : formatCurrency(metric.value)}</p>
          <p class="text-xs text-subtext-light dark:text-subtext-dark">${metric.trend}</p>
        </article>`)
      .join("");
  }

  function renderBillingTable() {
    const tbody = document.querySelector("[data-billing-table]");
    const pagination = document.querySelector("[data-billing-pagination]");
    if (!tbody) return;

    const filters = {
      status: state.ui.billing.status,
      method: state.ui.billing.method,
      dateRange: state.ui.billing.dateRange,
      search: (state.ui.billing.search || "").toLowerCase()
    };

    let invoices = state.invoices.slice().sort((a, b) => new Date(b.issueDate || 0) - new Date(a.issueDate || 0));

    if (filters.status && filters.status !== "all") {
      invoices = invoices.filter((invoice) => invoice.status === filters.status);
    }
    if (filters.method && filters.method !== "all") {
      invoices = invoices.filter((invoice) => (invoice.method || "").toLowerCase() === filters.method);
    }
    if (filters.dateRange && filters.dateRange !== "all") {
      invoices = invoices.filter((invoice) => {
        if (!invoice.issueDate) return false;
        const issue = new Date(invoice.issueDate);
        if (filters.dateRange === "month") {
          const now = new Date();
          const start = new Date(now.getFullYear(), now.getMonth(), 1);
          const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
          return issue >= start && issue <= end;
        }
        if (filters.dateRange === "last-month") {
          const now = new Date();
          const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          const end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
          return issue >= start && issue <= end;
        }
        return true;
      });
    }
    if (filters.search) {
      invoices = invoices.filter((invoice) => {
        const patient = findPatient(invoice.patientId);
        return (
          (invoice.id && invoice.id.toLowerCase().includes(filters.search)) ||
          (patient && patient.name.toLowerCase().includes(filters.search))
        );
      });
    }

    tbody.innerHTML = invoices
      .map((invoice) => {
        const patient = findPatient(invoice.patientId);
        const statusConfig = getInvoiceStatusChip(invoice.status);
        return `
          <tr class="hover:bg-background-light dark:hover:bg-border-dark transition-colors">
            <td class="p-3 whitespace-nowrap text-primary font-semibold">#${invoice.id}</td>
            <td class="p-3 whitespace-nowrap">${patient ? patient.name : "Paciente"}</td>
            <td class="p-3 whitespace-nowrap text-subtext-light dark:text-subtext-dark">${formatDate(invoice.issueDate)}</td>
            <td class="p-3 whitespace-nowrap text-subtext-light dark:text-subtext-dark">${formatDate(invoice.dueDate)}</td>
            <td class="p-3 whitespace-nowrap text-right font-semibold">${formatCurrency(invoice.amount || 0)}</td>
            <td class="p-3 whitespace-nowrap">
              <span class="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium ${statusConfig.className}"><span class="size-1.5 rounded-full ${statusConfig.dot}"></span>${statusConfig.label}</span>
            </td>
            <td class="p-3 text-right">
              ${invoice.status === "paid"
                ? `<span class="text-xs text-subtext-light dark:text-subtext-dark">Pagado el ${formatDate(invoice.paidAt)}</span>`
                : `<button class="text-sm font-semibold text-primary hover:underline" data-action="billing-mark-paid" data-invoice-id="${invoice.id}" type="button">Registrar pago</button>`}
            </td>
          </tr>`;
      })
      .join("");

    if (pagination) {
      pagination.textContent = `Mostrando ${invoices.length} resultados`;
    }
  }

  function getInvoiceStatusChip(status) {
    switch (status) {
      case "paid":
        return { label: "Pagada", className: "bg-success/20 text-success", dot: "bg-success" };
      case "pending":
        return { label: "Pendiente", className: "bg-warning/20 text-warning", dot: "bg-warning" };
      case "overdue":
        return { label: "Vencida", className: "bg-danger/20 text-danger", dot: "bg-danger" };
      default:
        return { label: status || "-", className: "bg-neutral-light/60 text-neutral-500", dot: "bg-neutral-400" };
    }
  }

  function markInvoiceAsPaid(invoiceId) {
    const invoice = state.invoices.find((item) => item.id === invoiceId);
    if (!invoice) return;
    invoice.status = "paid";
    invoice.paidAt = new Date().toISOString();
    saveAndRefresh();
    showToast("Pago registrado");
  }

  function openBillingFilter(type) {
    const optionsMap = {
      status: [
        { id: "all", label: "Todos los estados" },
        { id: "pending", label: "Pendiente" },
        { id: "paid", label: "Pagada" },
        { id: "overdue", label: "Vencida" }
      ],
      date: [
        { id: "all", label: "Todas las fechas" },
        { id: "month", label: "Este mes" },
        { id: "last-month", label: "Mes anterior" }
      ],
      method: [
        { id: "all", label: "Todos los métodos" },
        { id: "transferencia", label: "Transferencia" },
        { id: "tpv", label: "TPV" },
        { id: "efectivo", label: "Efectivo" }
      ]
    };

    const options = optionsMap[type] || [];
    const list = options
      .map((option) => `<button type="button" class="px-3 py-2 rounded-lg hover:bg-neutral-light/60 dark:hover:bg-neutral-dark/60 text-sm ${state.ui.billing[type] === option.id ? "bg-primary/10 text-primary" : "text-neutral-600 dark:text-neutral-200"}" data-filter-value="${option.id}">${option.label}</button>`)
      .join("");
    const modal = createModal(`<div class="p-6 space-y-3"><h3 class="text-lg font-semibold text-neutral-dark dark:text-white mb-2">Filtrar por ${type === "status" ? "estado" : "método"}</h3><div class="grid gap-2" data-filter-options>${list}</div></div>`);
    modal.mount();
    modal.container.querySelector("[data-filter-options]").addEventListener("click", (event) => {
      const button = event.target.closest("[data-filter-value]");
      if (!button) return;
      const value = button.dataset.filterValue;
      if (type === "date") {
        state.ui.billing.dateRange = value;
      } else {
        state.ui.billing[type] = value;
      }
      saveState();
      renderBilling();
      modal.unmount();
    });
  }

  // -------------------- Reports --------------------
  function renderReports() {
    renderReportsMetrics();
    renderReportsCharts();
    renderReportsTable();
    const rangeButtons = document.querySelectorAll("[data-action='reports-range']");
    rangeButtons.forEach((button) => {
      const active = button.dataset.range === state.ui.reports.range;
      button.classList.toggle("bg-primary/10", active);
      button.classList.toggle("text-primary", active);
    });
  }

  function renderReportsMetrics() {
    const container = document.querySelector("[data-reports-metrics]");
    if (!container) return;
    const metrics = computeReportMetrics();
    container.innerHTML = metrics
      .map((metric) => `
        <article class="flex flex-col gap-1 rounded-xl p-6 bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark">
          <p class="text-base font-medium text-subtext-light dark:text-subtext-dark">${metric.label}</p>
          <p class="text-3xl font-bold text-text-light dark:text-text-dark">${metric.isCurrency ? formatCurrency(metric.value) : metric.value}</p>
          <div class="flex items-center gap-1 ${metric.trendValue >= 0 ? "text-secondary" : "text-negative"}">
            <span class="material-symbols-outlined text-base">${metric.trendValue >= 0 ? "arrow_upward" : "arrow_downward"}</span>
            <p class="text-sm font-semibold">${formatPercent(Math.abs(metric.trendValue), { maximumFractionDigits: 1 })}</p>
          </div>
        </article>`)
      .join("");
  }

  function computeReportMetrics() {
    const analytics = state.analytics || {};
    const metrics = analytics.metrics || [];
    if (metrics.length) {
      return metrics.map((metric) => ({
        label: metric.label,
        value: metric.value,
        trendValue: metric.trend || 0,
        isCurrency: metric.id === "revenue"
      }));
    }
    // fallback simple computation
    const completed = state.sessions.filter((session) => session.status === "completed").length;
    const noShows = state.sessions.filter((session) => ["cancelled", "no-show"].includes(session.status)).length;
    return [
      { label: "Sesiones completadas", value: completed, trendValue: 0.05 },
      { label: "No-shows", value: noShows, trendValue: -0.015 },
      { label: "Ingresos", value: state.invoices.filter((invoice) => invoice.status === "paid").reduce((acc, invoice) => acc + (invoice.amount || 0), 0), trendValue: 0.12, isCurrency: true },
      { label: "Pacientes nuevos", value: state.patients.filter((patient) => patient.status !== "alta").length, trendValue: 0.08 }
    ];
  }

  function renderReportsCharts() {
    const chartSessionsSubtitle = document.querySelector('[data-chart-subtitle="sessions"]');
    if (chartSessionsSubtitle) {
      chartSessionsSubtitle.textContent = `Evolución (${state.ui.reports.range.replace("last-", "últimos ")})`;
    }

    const chartSessions = document.querySelector('[data-chart-visual="sessions"]');
    if (chartSessions) {
      const data = (state.analytics.sessionTrends || []).slice(0, 4);
      if (data.length) {
        const summary = data.map((point) => `${point.label}: ${point.completed} completadas / ${point.noshows} ausencias`).join(" · ");
        const caption = document.createElement("p");
        caption.className = "text-xs text-subtext-light dark:text-subtext-dark mt-3";
        caption.textContent = summary;
        const existing = chartSessions.querySelector("p");
        if (existing) existing.remove();
        chartSessions.appendChild(caption);
      }
    }

    const chartAdherence = document.querySelector('[data-chart-visual="adherence"]');
    if (chartAdherence) {
      const data = state.analytics.adherenceByMonth || [];
      chartAdherence.innerHTML = data
        .map((point) => {
          const percent = Math.round(point.value * 100);
          return `
            <div class="flex flex-col items-center w-full">
              <div class="w-full rounded-t-md bg-primary/30" style="height:${percent}%"></div>
              <p class="mt-2 text-xs text-subtext-light dark:text-subtext-dark">${point.label}</p>
              <p class="text-xs font-semibold text-text-light dark:text-text-dark">${percent}%</p>
            </div>`;
        })
        .join("");
    }
  }

  function renderReportsTable() {
    const tbody = document.querySelector("[data-reports-low-adherence]");
    if (!tbody) return;
    const rows = (state.analytics.lowAdherencePatients || []).map((entry) => {
      const patient = findPatient(entry.patientId);
      const therapist = findProfessional(entry.therapistId);
      return `
        <tr>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-light dark:text-text-dark">${patient ? patient.name : entry.patientId}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-subtext-light dark:text-subtext-dark">${therapist ? therapist.name : "Equipo"}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-subtext-light dark:text-subtext-dark">${entry.planned}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-negative">${entry.missed}</td>
          <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <button class="text-primary hover:text-primary/80" data-action="open-patient-selector" data-select-patient="${entry.patientId}" type="button">Ver ficha</button>
          </td>
        </tr>`;
    });
    tbody.innerHTML = rows.join("") || `<tr><td colspan="5" class="px-6 py-4 text-center text-sm text-subtext-light dark:text-subtext-dark">Sin pacientes con baja adherencia en el periodo seleccionado.</td></tr>`;
  }

  // -------------------- Flow Wizard --------------------
  function openFlowWizard(startStep = "patient") {
    const wizard = new FlowWizard(startStep);
    wizard.mount();
  }

  class FlowWizard {
    constructor(startStep) {
      this.data = {};
      this.steps = [
        {
          id: "patient",
          title: "Paciente",
          description: "Registra un paciente nuevo o selecciona uno existente.",
          render: () => `
            <form data-step-form class="space-y-4">
              <div class="grid gap-3">
                <label class="flex flex-col text-sm text-neutral-600 dark:text-neutral-200">
                  <span>Selecciona paciente guardado</span>
                  <select name="existingPatientId" class="rounded-lg border border-neutral-border dark:border-neutral-text-light/20 bg-white dark:bg-background-dark px-3 py-2">
                    <option value="">-- Nuevo paciente --</option>
                    ${state.patients.map((patient) => `<option value="${patient.id}">${patient.name}</option>`).join("")}
                  </select>
                </label>
                <label class="flex flex-col text-sm text-neutral-600 dark:text-neutral-200">
                  <span>Nombre completo</span>
                  <input name="fullName" type="text" class="rounded-lg border border-neutral-border dark:border-neutral-text-light/20 bg-white dark:bg-background-dark px-3 py-2" placeholder="Nombre Apellido" required>
                </label>
                <label class="flex flex-col text-sm text-neutral-600 dark:text-neutral-200">
                  <span>Teléfono</span>
                  <input name="phone" type="tel" class="rounded-lg border border-neutral-border dark:border-neutral-text-light/20 bg-white dark:bg-background-dark px-3 py-2" placeholder="+34 600 000 000">
                </label>
                <label class="flex flex-col text-sm text-neutral-600 dark:text-neutral-200">
                  <span>Correo electrónico</span>
                  <input name="email" type="email" class="rounded-lg border border-neutral-border dark:border-neutral-text-light/20 bg-white dark:bg-background-dark px-3 py-2" placeholder="usuario@email.com">
                </label>
                <label class="flex flex-col text-sm text-neutral-600 dark:text-neutral-200">
                  <span>Diagnóstico o motivo de consulta</span>
                  <textarea name="diagnosis" rows="2" class="rounded-lg border border-neutral-border dark:border-neutral-text-light/20 bg-white dark:bg-background-dark px-3 py-2" placeholder="Descripción breve"></textarea>
                </label>
                <label class="flex flex-col text-sm text-neutral-600 dark:text-neutral-200">
                  <span>Asignar profesional</span>
                  <select name="primaryTherapistId" class="rounded-lg border border-neutral-border dark:border-neutral-text-light/20 bg-white dark:bg-background-dark px-3 py-2" required>
                    <option value="">Selecciona profesional</option>
                    ${state.professionals.map((pro) => `<option value="${pro.id}">${pro.name}</option>`).join("")}
                  </select>
                </label>
              </div>
            </form>`
        },
        {
          id: "session",
          title: "Sesión",
          description: "Agenda la primera sesión en la agenda de la clínica.",
          render: () => `
            <form data-step-form class="space-y-4">
              <div class="grid gap-3 md:grid-cols-2">
                <label class="flex flex-col text-sm text-neutral-600 dark:text-neutral-200">
                  <span>Fecha</span>
                  <input name="date" type="date" class="rounded-lg border border-neutral-border dark:border-neutral-text-light/20 bg-white dark:bg-background-dark px-3 py-2" value="${state.ui.calendar.date}" required>
                </label>
                <label class="flex flex-col text-sm text-neutral-600 dark:text-neutral-200">
                  <span>Hora</span>
                  <input name="time" type="time" class="rounded-lg border border-neutral-border dark:border-neutral-text-light/20 bg-white dark:bg-background-dark px-3 py-2" required>
                </label>
                <label class="flex flex-col text-sm text-neutral-600 dark:text-neutral-200">
                  <span>Duración (min)</span>
                  <input name="duration" type="number" min="15" step="15" class="rounded-lg border border-neutral-border dark:border-neutral-text-light/20 bg-white dark:bg-background-dark px-3 py-2" value="45">
                </label>
                <label class="flex flex-col text-sm text-neutral-600 dark:text-neutral-200">
                  <span>Profesional</span>
                  <select name="professionalId" class="rounded-lg border border-neutral-border dark:border-neutral-text-light/20 bg-white dark:bg-background-dark px-3 py-2" required>
                    <option value="">Selecciona profesional</option>
                    ${state.professionals.map((pro) => `<option value="${pro.id}">${pro.name} • ${pro.specialty}</option>`).join("")}
                  </select>
                </label>
                <label class="flex flex-col text-sm text-neutral-600 dark:text-neutral-200 md:col-span-2">
                  <span>Tipo de sesión</span>
                  <input name="type" type="text" class="rounded-lg border border-neutral-border dark:border-neutral-text-light/20 bg-white dark:bg-background-dark px-3 py-2" placeholder="Evaluación inicial" required>
                </label>
                <label class="flex flex-col text-sm text-neutral-600 dark:text-neutral-200">
                  <span>Canal</span>
                  <select name="channel" class="rounded-lg border border-neutral-border dark:border-neutral-text-light/20 bg-white dark:bg-background-dark px-3 py-2">
                    <option value="presencial">Presencial</option>
                    <option value="online">Teleconsulta</option>
                  </select>
                </label>
                <label class="flex flex-col text-sm text-neutral-600 dark:text-neutral-200">
                  <span>Cabina</span>
                  <input name="cabin" type="text" class="rounded-lg border border-neutral-border dark:border-neutral-text-light/20 bg-white dark:bg-background-dark px-3 py-2" placeholder="Cabina 1">
                </label>
              </div>
            </form>`
        },
        {
          id: "progress",
          title: "Progreso",
          description: "Registra un breve resumen clínico inicial.",
          render: () => `
            <form data-step-form class="space-y-4">
              <div class="grid gap-3">
                <label class="flex flex-col text-sm text-neutral-600 dark:text-neutral-200">
                  <span>Dolor (0-10)</span>
                  <input name="painLevel" type="number" min="0" max="10" class="rounded-lg border border-neutral-border dark:border-neutral-text-light/20 bg-white dark:bg-background-dark px-3 py-2" value="3">
                </label>
                <label class="flex flex-col text-sm text-neutral-600 dark:text-neutral-200">
                  <span>Resumen subjetivo</span>
                  <textarea name="subjective" rows="2" class="rounded-lg border border-neutral-border dark:border-neutral-text-light/20 bg-white dark:bg-background-dark px-3 py-2"></textarea>
                </label>
                <label class="flex flex-col text-sm text-neutral-600 dark:text-neutral-200">
                  <span>Evaluación profesional</span>
                  <textarea name="assessment" rows="2" class="rounded-lg border border-neutral-border dark:border-neutral-text-light/20 bg-white dark:bg-background-dark px-3 py-2"></textarea>
                </label>
                <label class="flex flex-col text-sm text-neutral-600 dark:text-neutral-200">
                  <span>Plan inmediato</span>
                  <textarea name="plan" rows="2" class="rounded-lg border border-neutral-border dark:border-neutral-text-light/20 bg-white dark:bg-background-dark px-3 py-2"></textarea>
                </label>
              </div>
            </form>`
        },
        {
          id: "billing",
          title: "Cobro y recordatorio",
          description: "Genera la factura y automatiza el recordatorio.",
          render: () => `
            <form data-step-form class="space-y-4">
              <div class="grid gap-3 md:grid-cols-2">
                <label class="flex flex-col text-sm text-neutral-600 dark:text-neutral-200">
                  <span>Importe (€)</span>
                  <input name="amount" type="number" min="0" step="0.5" class="rounded-lg border border-neutral-border dark:border-neutral-text-light/20 bg-white dark:bg-background-dark px-3 py-2" value="60">
                </label>
                <label class="flex flex-col text-sm text-neutral-600 dark:text-neutral-200">
                  <span>Método de pago</span>
                  <select name="method" class="rounded-lg border border-neutral-border dark:border-neutral-text-light/20 bg-white dark:bg-background-dark px-3 py-2">
                    <option value="">A convenir</option>
                    <option value="tpv">TPV</option>
                    <option value="transferencia">Transferencia</option>
                    <option value="efectivo">Efectivo</option>
                  </select>
                </label>
                <label class="flex flex-col text-sm text-neutral-600 dark:text-neutral-200">
                  <span>Vencimiento</span>
                  <input name="dueDate" type="date" class="rounded-lg border border-neutral-border dark:border-neutral-text-light/20 bg-white dark:bg-background-dark px-3 py-2" value="${state.ui.calendar.date}">
                </label>
                <label class="inline-flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-200 mt-2">
                  <input type="checkbox" name="reminderEnabled" class="rounded border border-neutral-border dark:border-neutral-text-light/20">
                  Enviar recordatorio automático (WhatsApp)
                </label>
                <label class="flex flex-col text-sm text-neutral-600 dark:text-neutral-200 md:col-span-2">
                  <span>Mensaje personalizado</span>
                  <textarea name="reminderMessage" rows="2" class="rounded-lg border border-neutral-border dark:border-neutral-text-light/20 bg-white dark:bg-background-dark px-3 py-2" placeholder="Hola Laura, te esperamos mañana a las 11:00. Responde 1 para confirmar"></textarea>
                </label>
              </div>
            </form>`
        }
      ];
      this.currentIndex = Math.max(0, this.steps.findIndex((step) => step.id === startStep));
      if (this.currentIndex === -1) this.currentIndex = 0;
      this.modal = createModal("", { closable: true, extraClass: "max-w-3xl" });
      this.render();
    }

    mount() {
      this.modal.mount();
    }

    unmount() {
      this.modal.unmount();
    }

    render() {
      const step = this.steps[this.currentIndex];
      const progressItems = this.steps
        .map((item, index) => `
          <li class="flex-1">
            <div class="flex items-center gap-2 ${index <= this.currentIndex ? "text-primary" : "text-neutral-400"}">
              <span class="size-6 rounded-full border border-current flex items-center justify-center text-xs font-semibold">${index + 1}</span>
              <span class="text-sm font-medium">${item.title}</span>
            </div>
          </li>`)
        .join("");
      const isFirstStep = this.currentIndex === 0;
      const prevButtonHtml = `<button type="button" class="px-4 py-2 text-sm font-semibold ${isFirstStep ? "text-neutral-400 cursor-default opacity-50" : "text-neutral-500 hover:text-neutral-700"}" ${isFirstStep ? "disabled" : "data-flow-nav=\"prev\""}>Anterior</button>`;
      const nextLabel = this.currentIndex === this.steps.length - 1 ? "Finalizar" : "Continuar";

      this.modal.container.innerHTML = `
        <div class="p-6 space-y-6">
          <header class="space-y-3">
            <ol class="flex items-center gap-4">${progressItems}</ol>
            <div>
              <h2 class="text-xl font-semibold text-neutral-dark dark:text-white">${step.title}</h2>
              <p class="text-sm text-neutral-500 dark:text-neutral-300">${step.description}</p>
            </div>
          </header>
          <section>${step.render()}</section>
          <footer class="flex justify-between items-center pt-4 border-t border-neutral-border dark:border-neutral-text-light/20">
            ${prevButtonHtml}
            <div class="flex items-center gap-3">
              <button type="button" class="px-4 py-2 text-sm font-semibold text-neutral-500 hover:text-neutral-700" data-close-modal>Cancelar</button>
              <button type="button" class="px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90" data-flow-nav="next">${nextLabel}</button>
            </div>
          </footer>
        </div>`;

      const form = this.modal.container.querySelector("[data-step-form]");
      if (form) {
        form.addEventListener("submit", (event) => event.preventDefault());
        if (step.id === "patient") {
          const existingSelect = form.querySelector("select[name=existingPatientId]");
          const nameInput = form.querySelector("input[name=fullName]");
          const toggle = () => {
            const useExisting = Boolean(existingSelect.value);
            if (useExisting) {
              nameInput.removeAttribute("required");
              nameInput.disabled = true;
              nameInput.classList.add("opacity-60", "cursor-not-allowed");
            } else {
              nameInput.disabled = false;
              nameInput.setAttribute("required", "required");
              nameInput.classList.remove("opacity-60", "cursor-not-allowed");
            }
          };
          existingSelect.addEventListener("change", toggle);
          toggle();
        }
      }

      this.modal.container.querySelectorAll("[data-flow-nav]").forEach((button) => {
        button.addEventListener("click", () => {
          const direction = button.dataset.flowNav;
          if (direction === "prev") {
            this.currentIndex = Math.max(0, this.currentIndex - 1);
            this.render();
          }
          if (direction === "next") {
            if (this.handleStepSubmit()) {
              if (this.currentIndex === this.steps.length - 1) {
                this.complete();
              } else {
                this.currentIndex = Math.min(this.steps.length - 1, this.currentIndex + 1);
                this.render();
              }
            }
          }
        });
      });
    }

    handleStepSubmit() {
      const form = this.modal.container.querySelector("[data-step-form]");
      if (!form) return true;
      const formData = new FormData(form);
      const payload = Object.fromEntries(formData.entries());
      const valid = Array.from(form.querySelectorAll("[required]"))
        .every((input) => {
          if (!input.value) {
            input.classList.add("ring-2", "ring-danger/60");
            return false;
          }
          input.classList.remove("ring-2", "ring-danger/60");
          return true;
        });
      if (!valid) {
        showToast("Por favor completa los campos obligatorios", { tone: "danger" });
        return false;
      }
      this.data[this.steps[this.currentIndex].id] = payload;
      return true;
    }

    complete() {
      const patientData = this.data.patient || {};
      let patient;
      if (patientData.existingPatientId) {
        patient = findPatient(patientData.existingPatientId);
      }
      if (!patient) {
        patient = upsertPatient({
          id: patientData.existingPatientId,
          name: patientData.fullName,
          phone: patientData.phone,
          email: patientData.email,
          diagnosis: patientData.diagnosis,
          primaryTherapistId: patientData.primaryTherapistId
        });
      }

      const sessionData = this.data.session || {};
      const startIso = joinDateAndTime(sessionData.date, sessionData.time);
      const duration = Number(sessionData.duration || 45);
      const endIso = new Date(new Date(startIso).getTime() + duration * 60000).toISOString();
      const session = addSession({
        patientId: patient.id,
        professionalId: sessionData.professionalId || patient.primaryTherapistId,
        start: startIso,
        end: endIso,
        status: "confirmed",
        type: sessionData.type,
        channel: sessionData.channel,
        cabin: sessionData.cabin
      });

      const progressData = this.data.progress || {};
      addSoapNote(patient.id, {
        date: session.start,
        title: progressData.title || `Inicio plan - ${session.type}`,
        subjective: progressData.subjective,
        assessment: progressData.assessment,
        plan: progressData.plan,
        painLevel: Number(progressData.painLevel || 0),
        authorId: session.professionalId
      });

      const billingData = this.data.billing || {};
      if (billingData.amount) {
        addInvoice({
          patientId: patient.id,
          amount: Number(billingData.amount || 0),
          method: billingData.method,
          dueDate: billingData.dueDate,
          concept: session.type,
          status: "pending"
        });
      }

      if (billingData.reminderEnabled) {
        addReminder({
          patientId: patient.id,
          sessionId: session.id,
          channel: "whatsapp",
          sendAt: joinDateAndTime(sessionData.date, "09:00"),
          message: billingData.reminderMessage || "Hola, recuerda tu sesión." 
        });
      }

      state.tasks.unshift({
        id: generateId("task"),
        text: `Dar seguimiento a ${patient.name} tras la sesión`,
        relatedPatientId: patient.id,
        completed: false
      });

      state.ui.patient.currentId = patient.id;
      saveAndRefresh();
      this.unmount();
      showToast("Flujo completado: paciente y sesión registrados");
    }
  }

  function joinDateAndTime(date, time) {
    if (!date) return new Date().toISOString();
    if (!time) time = "09:00";
    return new Date(`${date}T${time}`).toISOString();
  }

  // -------------------- Modal & Toast utilities --------------------
  function createModal(content, options = {}) {
    const overlay = document.createElement("div");
    overlay.className = "fixed inset-0 z-[90] flex items-center justify-center px-4 bg-neutral-900/40 backdrop-blur-sm";
    overlay.innerHTML = `<div class="w-full ${options.extraClass || "max-w-2xl"} bg-white dark:bg-background-dark rounded-2xl shadow-2xl overflow-hidden relative">${content}</div>`;

    const modal = {
      container: overlay.querySelector("div"),
      mount() {
        document.body.appendChild(overlay);
        if (options.closable !== false) {
          overlay.addEventListener("click", (event) => {
            if (event.target.closest("[data-close-modal]") || event.target === overlay) {
              modal.unmount();
            }
          });
        }
      },
      unmount() {
        overlay.remove();
      }
    };
    return modal;
  }

  function showToast(message, options = {}) {
    const toast = document.createElement("div");
    toast.className = `fixed bottom-6 right-6 z-[120] px-4 py-3 rounded-lg shadow-lg text-sm font-medium text-white ${options.tone === "danger" ? "bg-danger" : "bg-primary"}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.classList.add("opacity-0", "translate-y-2");
      setTimeout(() => toast.remove(), 250);
    }, 2600);
  }

  function createElementFromHTML(html) {
    const template = document.createElement("template");
    template.innerHTML = html.trim();
    return template.content.firstChild;
  }

  function isSameDate(a, b) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  }
})();
