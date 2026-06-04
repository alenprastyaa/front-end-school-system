import { defineStore } from "pinia";

const baseFilters = () => ({
  subjectId: "",
  semesterId: "",
  keyword: "",
});

export const useTeacherReportStore = defineStore("teacherReport", {
  state: () => ({
    periods: [],
    report: null,
    currentPage: 1,
    pageSize: 20,
    totalRows: 0,
    filters: baseFilters(),
  }),
});
