import { defineStore } from "pinia";
import { useMasterDataStore } from "@/store/masterData";

export const useStudentStore = defineStore("student", {
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

    async loadStudentSubjects({ force = false } = {}) {
      this.isLoadingSubjects = true;
      this.subjectError = "";
      try {
        const masterDataStore = useMasterDataStore();
        this.subjects = await masterDataStore.getStudentSubjects({ force });
        if (!this.selectedSubjectId && this.subjects.length > 0) {
          this.selectedSubjectId = this.subjects[0].id || null;
        }
        return this.subjects;
      } catch (error) {
        this.subjectError = error?.message || "Gagal memuat mapel siswa";
        throw error;
      } finally {
        this.isLoadingSubjects = false;
      }
    },
  },
});
