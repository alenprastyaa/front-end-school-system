import { defineStore } from "pinia";

const createSort = (key = "", direction = "asc") => ({ key, direction });

export const useTeacherStudentsStore = defineStore("teacherStudents", {
  state: () => ({
    homeroomClass: null,
    students: [],
    search: "",
    currentPage: 1,
    pageSize: 10,
    selectedStudent: null,
    attendances: [],
    receipts: [],
    showAttendanceModal: false,
    showReceiptModal: false,
    showCheckedInModal: false,
    showAbsentModal: false,
    summaryError: "",
    listError: "",
    attendanceError: "",
    receiptError: "",
    studentTableSort: createSort("full_name"),
    checkedInTableSort: createSort("clock_in", "desc"),
    absentTableSort: createSort("full_name"),
    attendanceTableSort: createSort("attendance_date", "desc"),
    receiptTableSort: createSort("created_at", "desc"),
  }),
});
