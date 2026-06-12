import { defineStore } from "pinia";
import { api } from "@/api";
import { pushToast } from "@/composables/useToast";

export const useStudentAttendanceStore = defineStore("studentAttendance", {
  state: () => ({
    currentTime: "",
    currentDate: "",
    selectedFile: null,
    selectedPreviewUrl: "",
    attendances: [],
    todayAttendance: null,
    isCheckingIn: false,
    isCheckingOut: false,
    isCheckoutConfirmOpen: false,
    isLoadingAttendance: false,
    isVerifyingFace: false,
    isCameraLoading: false,
    cameraActive: false,
    isMobileClient: false,
    geoCoords: {
      latitude: null,
      longitude: null,
      accuracy: null,
    },
    faceVerification: {
      status: "idle",
      distance: null,
      message: "Aktifkan kamera untuk mulai verifikasi wajah.",
    },
    attendancePage: 1,
    attendanceLimit: 10,
    attendanceSearch: "",
    attendanceSearchInput: "",
    attendanceTotal: 0,
    attendanceTotalPages: 0,
  }),

  getters: {
    attendanceRangeLabel: (state) => {
      if (state.attendanceTotal === 0) return "0 data";
      const start = (state.attendancePage - 1) * state.attendanceLimit + 1;
      const end = Math.min(state.attendancePage * state.attendanceLimit, state.attendanceTotal);
      return `${start}-${end} dari ${state.attendanceTotal}`;
    },
    hasCheckedInToday: (state) => !!state.todayAttendance,
    hasCheckedOutToday: (state) => !!state.todayAttendance?.clock_out,
    todayRecord: (state) => state.todayAttendance || null,
    todayStatusLabel: (state) => {
      if (state.todayAttendance?.clock_out) return "Sesi selesai";
      if (state.todayAttendance) return "Sedang aktif";
      return "Belum check-in";
    },
  },

  actions: {
    resetFaceVerification(status = "idle", message = "Aktifkan kamera untuk mulai verifikasi wajah.") {
      this.faceVerification = { status, distance: null, message };
    },

    setGeoCoords(coords) {
      this.geoCoords = {
        latitude: coords?.latitude ?? null,
        longitude: coords?.longitude ?? null,
        accuracy: coords?.accuracy ?? null,
      };
    },

    clearGeoCoords() {
      this.setGeoCoords({ latitude: null, longitude: null, accuracy: null });
    },

    setSelectedFile(file, previewUrl = "") {
      this.selectedFile = file || null;
      this.selectedPreviewUrl = previewUrl || "";
    },

    clearSelectedFile() {
      this.selectedFile = null;
      this.selectedPreviewUrl = "";
    },

    openCheckoutConfirm() {
      if (this.isCheckingOut || this.hasCheckedOutToday) return;
      this.isCheckoutConfirmOpen = true;
    },

    closeCheckoutConfirm() {
      if (this.isCheckingOut) return;
      this.isCheckoutConfirmOpen = false;
    },

    async loadTodayAttendance() {
      try {
        const response = await api.get("/dashboard/siswa", { silentLoading: true });
        this.todayAttendance = response?.data?.todayAttendance || null;
      } catch (error) {
        this.todayAttendance = null;
      }
    },

    async loadAttendance({ page } = {}) {
      this.isLoadingAttendance = true;
      try {
        const response = await api.get("/attendance", {
          params: {
            page: page || this.attendancePage,
            limit: this.attendanceLimit,
            search: this.attendanceSearch || undefined,
          },
        });
        const payload = response?.data || {};
        this.attendances = Array.isArray(payload.data) ? payload.data : [];
        this.attendancePage = Number(payload.page || page || 1);
        this.attendanceLimit = Number(payload.limit || this.attendanceLimit || 10);
        this.attendanceTotal = Number(payload.total || 0);
        this.attendanceTotalPages = Number(payload.total_pages || 0);
      } catch (error) {
        pushToast({
          title: "Gagal Memuat Absensi",
          message: error.message,
          type: "error",
        });
      } finally {
        this.isLoadingAttendance = false;
      }
    },

    async applyAttendanceSearch() {
      this.attendanceSearch = String(this.attendanceSearchInput || "").trim();
      this.attendancePage = 1;
      await this.loadAttendance({ page: 1 });
    },

    async clearAttendanceSearch() {
      this.attendanceSearchInput = "";
      this.attendanceSearch = "";
      this.attendancePage = 1;
      await this.loadAttendance({ page: 1 });
    },

    async changeAttendanceLimit() {
      this.attendancePage = 1;
      await this.loadAttendance({ page: 1 });
    },

    async goAttendancePage(page) {
      const nextPage = Math.max(1, Math.min(Number(page || 1), this.attendanceTotalPages || 1));
      if (nextPage === this.attendancePage || this.isLoadingAttendance) return;
      await this.loadAttendance({ page: nextPage });
    },

    async submitCheckIn(formData) {
      if (this.isCheckingIn || !this.selectedFile) return;
      this.isCheckingIn = true;
      try {
        const response = await api.post("/attendance", formData);
        pushToast({
          title: "Check-in Berhasil",
          message: response?.message || "Check-in berhasil. Selamat beraktivitas!",
          type: "success",
        });
        await Promise.all([this.loadTodayAttendance(), this.loadAttendance({ page: 1 })]);
        return response;
      } catch (error) {
        pushToast({
          title: "Check-in Gagal",
          message: error.message,
          type: "error",
        });
        throw error;
      } finally {
        this.isCheckingIn = false;
      }
    },

    async submitCheckOut() {
      if (this.isCheckingOut) return null;
      this.isCheckingOut = true;
      try {
        const response = await api.post("/attendance/checkout", {});
        pushToast({
          title: "Check-out Berhasil",
          message: response?.message || "Check-out berhasil dicatat. Sampai jumpa besok!",
          type: "success",
        });
        this.isCheckoutConfirmOpen = false;
        await Promise.all([this.loadTodayAttendance(), this.loadAttendance({ page: this.attendancePage })]);
        return response;
      } catch (error) {
        pushToast({
          title: "Check-out Gagal",
          message: error.message,
          type: "error",
        });
        throw error;
      } finally {
        this.isCheckingOut = false;
      }
    },
  },
});
