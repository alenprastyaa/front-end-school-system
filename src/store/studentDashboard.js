import { defineStore } from "pinia";

export const useStudentDashboardStore = defineStore("studentDashboard", {
  state: () => ({
    dashboardData: {},
    selectedParentChildId: "",
    isLoading: false,
    errorMessage: "",
    attendanceEmailReportDate: new Date().toISOString().slice(0, 10),
    isSendingAttendanceEmailReport: false,
    attendanceEmailReportMessage: "",
    attendanceEmailReportError: false,
    attendanceEmailReportSummary: null,
    parentWhatsAppReportMonth: new Date().toISOString().slice(0, 7),
    parentWhatsAppReportClassId: "",
    parentWhatsAppReportClassOptions: [],
    isSendingParentWhatsAppReport: false,
    parentWhatsAppReportMessage: "",
    parentWhatsAppReportError: false,
    parentWhatsAppReportSummary: null,
    announcementModalOpen: false,
    currentAnnouncementIndex: 0,
    announcementTransitionName: "announcement-slide-next",
    announcementNoticeMessage: "",
  }),
});
