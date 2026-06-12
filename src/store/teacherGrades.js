import { defineStore } from "pinia";

const baseGradeModal = () => ({
  open: false,
  row: null,
  scoreDraft: "",
  feedbackDraft: "",
  saving: false,
});

const baseFilters = () => ({
  subjectId: "",
  assignmentId: "",
  gradeStatus: "",
  assignmentType: "",
  keyword: "",
});

export const useTeacherGradesStore = defineStore("teacherGrades", {
  state: () => ({
    assignments: [],
    rows: [],
    totalRows: 0,
    loadError: "",
    message: "",
    isError: false,
    reviewRow: null,
    gradeModal: baseGradeModal(),
    currentPage: 1,
    pageSize: 20,
    filters: baseFilters(),
  }),
});
