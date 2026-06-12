import { defineStore } from "pinia";
import { api } from "@/api";

const currentMonth = () => new Date().toISOString().slice(0, 7);

const createEmptySlipForm = () => ({
  teacher_id: null,
  teacher_name: "",
  hourly_rate: 0,
  teaching_hours: 0,
  valid_attendance_days: 0,
  note: "",
  status: "DRAFT",
  items: [],
});

const createEmptyComponentForm = () => ({
  id: null,
  name: "",
  component_type: "ALLOWANCE",
  calculation_type: "FIXED",
  default_amount: 0,
  default_quantity: 1,
  applies_to_all: false,
  is_active: true,
});

const createEmptySettingsForm = () => ({
  hourly_rate: 40000,
  lesson_minutes: 45,
  teaching_hours_multiplier: 4,
  notes: "",
});

const isTransportItem = (item) => {
  const name = String(item?.name || "").toLowerCase();
  return (item?.calculation_type || "FIXED") === "DAILY" && (name.includes("transport") || name.includes("transpor"));
};

const applyTransportAttendance = (items, validAttendanceDays) => {
  const days = Math.max(Number(validAttendanceDays || 0), 0);
  return (Array.isArray(items) ? items : []).map((item) => {
    if (!isTransportItem(item)) return item;
    return {
      ...item,
      quantity: days,
      amount: Math.round(Math.abs(Number(item.unit_amount ?? item.amount ?? 0)) * days),
    };
  });
};

const itemTotal = (item) =>
  Math.round(Math.abs(Number(item?.unit_amount ?? item?.amount ?? 0)) * Math.max(Number(item?.quantity ?? 1), 0));

const componentTotal = (item) =>
  Math.round(Math.abs(Number(item?.default_amount || 0)) * Math.max(Number(item?.default_quantity || 1), 0));

const calculatedBaseAmount = (teacher) =>
  Number(teacher?.base_amount || Math.round(Number(teacher?.hourly_rate || 0) * Number(teacher?.teaching_hours || 0)));

const calculateTotalFromTeacher = (teacher) => {
  if (teacher?.payroll_id && teacher?.status === "PAID") return Number(teacher?.total_amount || 0);
  const items = applyTransportAttendance(Array.isArray(teacher?.items) ? teacher.items : [], teacher?.valid_attendance_days);
  const allowances = items.filter((item) => item.component_type !== "DEDUCTION").reduce((sum, item) => sum + itemTotal(item), 0);
  const deductions = items.filter((item) => item.component_type === "DEDUCTION").reduce((sum, item) => sum + itemTotal(item), 0);
  return calculatedBaseAmount(teacher) + allowances - deductions;
};

const normalizeSearch = (value) => String(value || "").trim();

const normalizePayrollItem = (item) => ({
  component_id: item.component_id || null,
  name: String(item.name || "").trim(),
  component_type: item.component_type || "ALLOWANCE",
  calculation_type: item.calculation_type || "FIXED",
  quantity: Number(item.quantity ?? 1),
  unit_amount: Number(item.unit_amount ?? item.amount ?? 0),
  amount: itemTotal(item),
});

const populateSlipFormFromTeacher = (teacher, activeComponents = []) => {
  const baseItems = Array.isArray(teacher?.items)
    ? applyTransportAttendance(teacher.items, teacher?.valid_attendance_days).map((item) => ({
      component_id: item.component_id || null,
      name: item.name,
      component_type: item.component_type || "ALLOWANCE",
      calculation_type: item.calculation_type || "FIXED",
      quantity: Number(item.quantity ?? 1),
      unit_amount: Number(item.unit_amount || item.amount || 0),
      amount: Number(item.amount || 0),
    }))
    : [];

  if (baseItems.length > 0) {
    return baseItems;
  }

  return applyTransportAttendance(
    activeComponents
      .filter((component) => component.applies_to_all === true)
      .map((component) => ({
        component_id: component.id,
        name: component.name,
        component_type: component.component_type,
        calculation_type: component.calculation_type || "FIXED",
        quantity: Number(component.default_quantity || 1),
        unit_amount: Number(component.default_amount || 0),
        amount: componentTotal(component),
      })),
    teacher?.valid_attendance_days
  );
};

export const usePayrollStore = defineStore("payroll", {
  state: () => ({
    selectedPeriod: currentMonth(),
    searchQuery: "",
    appliedSearchQuery: "",
    currentPage: 1,
    limit: 10,
    totalTeachersCount: 0,
    totalPagesCount: 1,
    isLoading: false,
    isSavingSlip: false,
    isGeneratingSlips: false,
    isSavingComponent: false,
    isSavingSettings: false,
    teachers: [],
    components: [],
    teachingHoursMultiplier: 4,
    summary: {
      total_teachers: 0,
      paid_count: 0,
      unpaid_count: 0,
      paid_amount: 0,
      unpaid_amount: 0,
      total_payroll_amount: 0,
    },
    settings: createEmptySettingsForm(),
    slipModalOpen: false,
    slipForm: createEmptySlipForm(),
    componentFormOpen: false,
    componentForm: createEmptyComponentForm(),
    openedSlipDetailTeacherId: null,
    statusConfirmModalOpen: false,
    statusConfirmTeacher: null,
    statusConfirmTarget: "PAID",
    statusConfirmBusy: false,
  }),

  getters: {
    paidCount: (state) => state.teachers.filter((teacher) => teacher.status === "PAID").length,
    unpaidCount: (state) => state.teachers.filter((teacher) => teacher.status !== "PAID").length,
    paidAmount: (state) => state.teachers.filter((teacher) => teacher.status === "PAID").reduce((sum, teacher) => sum + calculateTotalFromTeacher(teacher), 0),
    unpaidAmount: (state) => state.teachers.filter((teacher) => teacher.status !== "PAID").reduce((sum, teacher) => sum + calculateTotalFromTeacher(teacher), 0),
    totalPayrollAmount: (state) => state.teachers.reduce((sum, teacher) => sum + calculateTotalFromTeacher(teacher), 0),
    paginationStart: (state) => (state.totalTeachersCount === 0 ? 0 : ((state.currentPage - 1) * state.limit) + 1),
    paginationEnd: (state) => Math.min(state.currentPage * state.limit, state.totalTeachersCount),
    activeComponents: (state) => state.components.filter((component) => component.is_active !== false),
    payrollPeriodLabel: (state) => {
      if (!state.selectedPeriod) return "Dashboard Bendahara";
      const [year, month] = state.selectedPeriod.split("-");
      return new Date(Number(year), Number(month) - 1).toLocaleDateString("id-ID", { month: "long", year: "numeric" });
    },
    payrollPaidRatio: (state) => {
      const total = Number(state.summary.total_teachers || 0);
      if (!total) return 0;
      return Math.round((Number(state.summary.paid_count || 0) / total) * 100);
    },
    slipBaseAmount: (state) => Math.round(Number(state.slipForm.hourly_rate || 0) * Number(state.slipForm.teaching_hours || 0)),
    slipAllowances: (state) => state.slipForm.items.filter((item) => item.component_type !== "DEDUCTION").reduce((sum, item) => sum + itemTotal(item), 0),
    slipDeductions: (state) => state.slipForm.items.filter((item) => item.component_type === "DEDUCTION").reduce((sum, item) => sum + itemTotal(item), 0),
    slipTotal: (state) => {
      const base = Math.round(Number(state.slipForm.hourly_rate || 0) * Number(state.slipForm.teaching_hours || 0));
      const allowances = state.slipForm.items.filter((item) => item.component_type !== "DEDUCTION").reduce((sum, item) => sum + itemTotal(item), 0);
      const deductions = state.slipForm.items.filter((item) => item.component_type === "DEDUCTION").reduce((sum, item) => sum + itemTotal(item), 0);
      return base + allowances - deductions;
    },
    openedSlipDetailTeacher: (state) =>
      state.teachers.find((teacher) => String(teacher?.teacher_id || teacher?.payroll_id || "") === String(state.openedSlipDetailTeacherId || "")) || null,
    statusConfirmTitle: (state) => (state.statusConfirmTarget === "PAID" ? "Tandai Lunas" : "Tandai Belum Lunas"),
    statusConfirmDescription: (state) => {
      const name = state.statusConfirmTeacher?.teacher_name || "guru ini";
      return state.statusConfirmTarget === "PAID"
        ? `Tandai slip ${name} sebagai lunas?`
        : `Batalkan status lunas slip ${name}?`;
    },
    statusConfirmActionLabel: (state) => (state.statusConfirmTarget === "PAID" ? "Ya, Tandai Lunas" : "Ya, Batalkan"),
  },

  actions: {
    resetQueryState() {
      this.searchQuery = "";
      this.appliedSearchQuery = "";
      this.currentPage = 1;
      this.limit = 10;
    },

    resetSlipForm() {
      this.slipForm = createEmptySlipForm();
    },

    resetComponentForm() {
      this.componentForm = createEmptyComponentForm();
    },

    resetSettingsForm() {
      this.settings = createEmptySettingsForm();
    },

    setSelectedPeriod(period) {
      if (period) {
        this.selectedPeriod = period;
      }
    },

    applySearch() {
      this.appliedSearchQuery = normalizeSearch(this.searchQuery);
      this.currentPage = 1;
      return this.loadOverview();
    },

    resetFilters() {
      this.searchQuery = "";
      this.appliedSearchQuery = "";
      this.currentPage = 1;
      this.limit = 10;
      return this.loadOverview();
    },

    changeLimit(nextLimit) {
      this.limit = Number(nextLimit || this.limit || 10);
      this.currentPage = 1;
      return this.loadOverview();
    },

    goToPage(page) {
      const nextPage = Math.min(Math.max(Number(page || 1), 1), this.totalPagesCount || 1);
      if (nextPage === this.currentPage) return Promise.resolve();
      this.currentPage = nextPage;
      return this.loadOverview();
    },

    async loadOverview({ period, page, limit, search } = {}) {
      this.isLoading = true;
      try {
        const response = await api.get("/payroll/overview", {
          params: {
            period: period || this.selectedPeriod,
            page: page || this.currentPage,
            limit: limit || this.limit,
            search: search !== undefined ? search : this.appliedSearchQuery,
          },
        });
        const data = response?.data || {};
        this.selectedPeriod = data.period || period || this.selectedPeriod || currentMonth();
        this.teachingHoursMultiplier = Number(data.settings?.teaching_hours_multiplier || 4);
        this.settings = {
          hourly_rate: Number(data.settings?.hourly_rate || 40000),
          lesson_minutes: Number(data.settings?.lesson_minutes || 45),
          teaching_hours_multiplier: Number(data.settings?.teaching_hours_multiplier || 4),
          notes: data.settings?.notes || "",
        };
        this.components = Array.isArray(data.components) ? data.components : [];
        this.teachers = Array.isArray(data.teachers) ? data.teachers : [];
        this.summary = {
          total_teachers: Number(data.summary?.total_teachers || 0),
          paid_count: Number(data.summary?.paid_count || 0),
          unpaid_count: Number(data.summary?.unpaid_count || 0),
          paid_amount: Number(data.summary?.paid_amount || 0),
          unpaid_amount: Number(data.summary?.unpaid_amount || 0),
          total_payroll_amount: Number(data.summary?.total_payroll_amount || 0),
        };
        this.totalTeachersCount = Number(data.total || data.summary?.total_teachers || 0);
        this.totalPagesCount = Math.max(Number(data.total_pages || 1), 1);
        this.currentPage = Math.min(Math.max(Number(data.page || this.currentPage || 1), 1), this.totalPagesCount);
        this.limit = Number(data.limit || this.limit || 10);
        return data;
      } finally {
        this.isLoading = false;
      }
    },

    openSlipDetail(teacher) {
      this.openedSlipDetailTeacherId = String(teacher?.teacher_id || teacher?.payroll_id || "");
    },

    closeSlipDetail() {
      this.openedSlipDetailTeacherId = null;
    },

    toggleSlipDetail(teacher) {
      const key = String(teacher?.teacher_id || teacher?.payroll_id || "");
      this.openedSlipDetailTeacherId = this.openedSlipDetailTeacherId === key ? null : key;
    },

    openStatusConfirm(teacher) {
      this.statusConfirmTeacher = teacher || null;
      this.statusConfirmTarget = teacher?.status === "PAID" ? "DRAFT" : "PAID";
      this.statusConfirmModalOpen = true;
    },

    closeStatusConfirm() {
      if (this.statusConfirmBusy) return;
      this.statusConfirmModalOpen = false;
      this.statusConfirmTeacher = null;
    },

    async confirmStatusChange() {
      if (!this.statusConfirmTeacher) return;
      this.statusConfirmBusy = true;
      try {
        const teacher = this.statusConfirmTeacher;
        const endpoint = this.statusConfirmTarget === "PAID"
          ? `/payroll/slips/${teacher.payroll_id}/mark-paid`
          : `/payroll/slips/${teacher.payroll_id}/mark-unpaid`;
        if (!teacher?.payroll_id) return;
        await api.post(endpoint);
        await this.loadOverview();
        this.statusConfirmModalOpen = false;
        this.statusConfirmTeacher = null;
      } finally {
        this.statusConfirmBusy = false;
      }
    },

    openSlipModal(teacher) {
      this.slipForm.teacher_id = teacher?.teacher_id || null;
      this.slipForm.teacher_name = teacher?.teacher_name || "";
      this.slipForm.hourly_rate = Number(teacher?.hourly_rate || 0);
      this.slipForm.teaching_hours = Number(teacher?.teaching_hours || teacher?.suggested_month_hours || 0);
      this.slipForm.valid_attendance_days = Number(teacher?.valid_attendance_days || 0);
      this.slipForm.note = teacher?.note || "";
      this.slipForm.status = teacher?.status === "PAID" ? "PAID" : "DRAFT";
      this.slipForm.items = populateSlipFormFromTeacher(teacher, this.activeComponents);
      this.slipModalOpen = true;
    },

    closeSlipModal() {
      this.slipModalOpen = false;
    },

    addComponentToSlip(value) {
      const componentId = String(value || "");
      if (!componentId) return;
      if (componentId === "__custom") {
        this.slipForm.items.push({
          component_id: null,
          name: "",
          component_type: "ALLOWANCE",
          calculation_type: "FIXED",
          quantity: 1,
          unit_amount: 0,
          amount: 0,
        });
        return;
      }
      const component = this.activeComponents.find((item) => String(item.id) === componentId);
      if (!component) return;
      this.slipForm.items.push({
        component_id: component.id,
        name: component.name,
        component_type: component.component_type,
        calculation_type: component.calculation_type || "FIXED",
        quantity: Number(component.default_quantity || 1),
        unit_amount: Number(component.default_amount || 0),
        amount: componentTotal(component),
      });
      this.slipForm.items = applyTransportAttendance(this.slipForm.items, this.slipForm.valid_attendance_days);
    },

    removeSlipItem(index) {
      this.slipForm.items.splice(index, 1);
    },

    async saveSlip() {
      this.isSavingSlip = true;
      try {
        const normalizedItems = applyTransportAttendance(this.slipForm.items, this.slipForm.valid_attendance_days).map(normalizePayrollItem);
        this.slipForm.items = normalizedItems.map((item) => ({
          ...item,
          amount: item.amount,
        }));
        const payload = {
          teacher_id: this.slipForm.teacher_id,
          period: this.selectedPeriod,
          hourly_rate: Number(this.slipForm.hourly_rate || 0),
          teaching_hours: Number(this.slipForm.teaching_hours || 0),
          note: this.slipForm.note || "",
          status: this.slipForm.status === "PAID" ? "PAID" : "DRAFT",
          items: normalizedItems.filter((item) => String(item.name || "").trim()),
        };
        const response = await api.post("/payroll/slips", payload);
        await this.loadOverview();
        this.slipModalOpen = false;
        return response?.data || null;
      } finally {
        this.isSavingSlip = false;
      }
    },

    async generateAllSlips() {
      this.isGeneratingSlips = true;
      try {
        const response = await api.post("/payroll/slips/generate", { period: this.selectedPeriod });
        await this.loadOverview();
        return response?.data || null;
      } finally {
        this.isGeneratingSlips = false;
      }
    },

    startNewComponent() {
      this.resetComponentForm();
      this.componentFormOpen = true;
    },

    editComponent(component) {
      this.componentForm = {
        id: component?.id || null,
        name: component?.name || "",
        component_type: component?.component_type || "ALLOWANCE",
        calculation_type: component?.calculation_type || "FIXED",
        default_amount: Number(component?.default_amount || 0),
        default_quantity: Number(component?.default_quantity || 1),
        applies_to_all: component?.applies_to_all === true,
        is_active: component?.is_active !== false,
      };
      this.componentFormOpen = true;
    },

    closeComponentForm() {
      this.componentFormOpen = false;
    },

    async saveComponent() {
      this.isSavingComponent = true;
      try {
        const payload = {
          name: String(this.componentForm.name || "").trim(),
          component_type: this.componentForm.component_type,
          calculation_type: this.componentForm.calculation_type,
          default_amount: Number(this.componentForm.default_amount || 0),
          default_quantity: Number(this.componentForm.default_quantity || 1),
          applies_to_all: this.componentForm.applies_to_all,
          is_active: this.componentForm.is_active,
        };
        let response;
        if (this.componentForm.id) {
          response = await api.put(`/payroll/components/${this.componentForm.id}`, payload);
        } else {
          response = await api.post("/payroll/components", payload);
        }
        await this.loadOverview();
        this.componentFormOpen = false;
        return response?.data || null;
      } finally {
        this.isSavingComponent = false;
      }
    },

    async deleteComponent(component) {
      const id = component?.id;
      if (!id) return null;
      const response = await api.delete(`/payroll/components/${id}`);
      await this.loadOverview();
      return response?.data || null;
    },

    async saveSettings() {
      this.isSavingSettings = true;
      try {
        const payload = {
          hourly_rate: Number(this.settings.hourly_rate || 0),
          lesson_minutes: Number(this.settings.lesson_minutes || 45),
          teaching_hours_multiplier: Number(this.settings.teaching_hours_multiplier || 4),
          notes: this.settings.notes || "",
        };
        const response = await api.put("/payroll/settings", payload);
        await this.loadOverview();
        return response?.data || null;
      } finally {
        this.isSavingSettings = false;
      }
    },
  },
});
