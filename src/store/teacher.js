import { defineStore } from "pinia";
import { useMasterDataStore } from "@/store/masterData";

export const useTeacherStore = defineStore("teacher", {
  state: () => ({
    subjects: [],
    selectedSubjectId: null,
    subjectError: "",
    isLoadingSubjects: false,
  }),

  getters: {
    selectedSubject: (state) =>
      state.subjects.find((item) => String(item?.id || "") === String(state.selectedSubjectId || "")) || null,
  },

  actions: {
    setSelectedSubject(subject) {
      this.selectedSubjectId = subject?.id || null;
    },

    clearSelectedSubject() {
      this.selectedSubjectId = null;
    },

    async loadTeacherSubjects({ force = false } = {}) {
      this.isLoadingSubjects = true;
      this.subjectError = "";
      try {
        const masterDataStore = useMasterDataStore();
        this.subjects = await masterDataStore.getTeacherSubjects({ force });
        if (!this.selectedSubjectId && this.subjects.length > 0) {
          this.selectedSubjectId = this.subjects[0].id || null;
        }
        return this.subjects;
      } catch (error) {
        this.subjectError = error?.message || "Gagal memuat mapel guru";
        throw error;
      } finally {
        this.isLoadingSubjects = false;
      }
    },
  },
});
