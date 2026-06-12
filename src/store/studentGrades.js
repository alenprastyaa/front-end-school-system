import { defineStore } from "pinia";
import { api } from "@/api";
import { pushToast } from "@/composables/useToast";

export const useStudentGradesStore = defineStore("studentGrades", {
  state: () => ({
    rows: [],
    summary: {
      total_assignments: 0,
      submitted_count: 0,
      pending_count: 0,
      graded_count: 0,
      average_score: null,
    },
    keyword: "",
    subjectFilter: "",
    statusFilter: "",
  }),

  getters: {
    subjectOptions: (state) => {
      const set = new Set(state.rows.map((item) => item.subject_name).filter(Boolean));
      return Array.from(set).sort((a, b) => String(a).localeCompare(String(b)));
    },
    filteredRows: (state) => {
      const q = String(state.keyword || "").trim().toLowerCase();
      return state.rows.filter((item) => {
        const matchKeyword = !q
          || String(item.subject_name || "").toLowerCase().includes(q)
          || String(item.title || "").toLowerCase().includes(q);
        const matchSubject = !state.subjectFilter || item.subject_name === state.subjectFilter;
        let matchStatus = true;
        if (state.statusFilter === "graded") {
          matchStatus = item.score !== null && item.score !== undefined;
        } else if (state.statusFilter === "submitted") {
          matchStatus = Boolean(item.submission_id) && (item.score === null || item.score === undefined);
        } else if (state.statusFilter === "pending") {
          matchStatus = !item.submission_id;
        }
        return matchKeyword && matchSubject && matchStatus;
      });
    },
  },

  actions: {
    async loadGrades() {
      try {
        const response = await api.get("/learning/grades/student");
        this.rows = response?.data?.rows || [];
        this.summary = {
          total_assignments: Number(response?.data?.summary?.total_assignments || 0),
          submitted_count: Number(response?.data?.summary?.submitted_count || 0),
          pending_count: Number(response?.data?.summary?.pending_count || 0),
          graded_count: Number(response?.data?.summary?.graded_count || 0),
          average_score: response?.data?.summary?.average_score ?? null,
        };
        return response;
      } catch (error) {
        pushToast({
          title: "Gagal Memuat Nilai",
          message: error.message,
          type: "error",
        });
        throw error;
      }
    },
  },
});
