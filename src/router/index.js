import { createRouter, createWebHistory } from "vue-router";
import { cancelPendingApiRequests } from "@/api";
import { clearSession, getStoredRole, getStoredUser, isAuthenticated } from "@/utils/auth";
import { clearChunkReloadAttempt, isChunkLoadError, lazyRoute, recoverFromChunkLoadError } from "./lazyRoute";
import PublicLanding from "../views/PublicLanding.vue";
import Dashboard from "../views/Dashboard.vue";
import Login from "../views/layouts/auth/Login.vue";

const appName = " - School System LMS";

const routes = [
  {
    path: "/",
    name: "PublicLanding",
    component: PublicLanding,
    meta: {
      title: "School System LMS" + appName,
      hideNav: true,
      guestOnly: true,
    },
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: {
      title: "Dashboard" + appName,
      requiresAuth: true,
      roles: ["SUPER_ADMIN", "ADMIN", "KOPERASI", "BENDAHARA", "SARPRAS", "GURU", "SISWA", "ORANG_TUA"],
    },
  },
  {
    path: "/inventory",
    name: "Inventory",
    component: lazyRoute(() => import("../views/Inventory.vue")),
    meta: {
      title: "Inventaris" + appName,
      requiresAuth: true,
      roles: ["ADMIN", "SARPRAS", "SISWA"],
      moduleKey: "inventory",
    },
  },
  {
    path: "/koperasi",
    name: "Koperasi",
    component: lazyRoute(() => import("../views/Koperasi.vue")),
    meta: {
      title: "Koperasi" + appName,
      requiresAuth: true,
      roles: ["ADMIN", "KOPERASI", "SARPRAS", "GURU", "SISWA"],
      moduleKey: "koperasi",
      hideHeaderOnMobile: true,
    },
  },
  {
    path: "/payroll",
    redirect: "/payroll/slips",
  },
  {
    path: "/payroll/slips",
    name: "PayrollSlips",
    component: lazyRoute(() => import("../views/PayrollSlips.vue")),
    meta: {
      title: "Daftar Slip Gaji" + appName,
      requiresAuth: true,
      roles: ["BENDAHARA"],
      moduleKey: "payroll",
    },
  },
  {
    path: "/payroll/components",
    name: "PayrollComponents",
    component: lazyRoute(() => import("../views/PayrollComponents.vue")),
    meta: {
      title: "Komponen Gaji" + appName,
      requiresAuth: true,
      roles: ["BENDAHARA"],
      moduleKey: "payroll",
    },
  },
  {
    path: "/payroll/settings",
    name: "PayrollSettings",
    component: lazyRoute(() => import("../views/PayrollSettings.vue")),
    meta: {
      title: "Setting Tarif" + appName,
      requiresAuth: true,
      roles: ["BENDAHARA"],
      moduleKey: "payroll",
    },
  },
  {
    path: "/schools",
    name: "Schools",
    component: lazyRoute(() => import("../views/Schools.vue")),
    meta: {
      title: "Sekolah" + appName,
      requiresAuth: true,
      roles: ["SUPER_ADMIN"],
    },
  },
  {
    path: "/module-settings",
    name: "ModuleSettings",
    component: lazyRoute(() => import("../views/ModuleSettings.vue")),
    meta: {
      title: "Setting Modul" + appName,
      requiresAuth: true,
      roles: ["SUPER_ADMIN"],
    },
  },
  {
    path: "/school-users",
    name: "SchoolUsers",
    component: lazyRoute(() => import("../views/SchoolUsers.vue")),
    meta: {
      title: "User Sekolah" + appName,
      requiresAuth: true,
      roles: ["ADMIN"],
    },
  },
  {
    path: "/classes",
    name: "Classes",
    component: lazyRoute(() => import("../views/Classes.vue")),
    meta: {
      title: "Kelas" + appName,
      requiresAuth: true,
      roles: ["ADMIN"],
    },
  },
  {
    path: "/students",
    name: "Students",
    // Perhatikan nama file aslinya adalah Users.vue
    component: lazyRoute(() => import("../views/Users.vue")),
    meta: {
      title: "Siswa" + appName,
      requiresAuth: true,
      roles: ["ADMIN"],
    },
  },
  {
    path: "/attendance",
    name: "Attendance",
    component: lazyRoute(() => import("../views/Attendance.vue")),
    meta: {
      title: "Absensi" + appName,
      requiresAuth: true,
      roles: ["GURU", "SISWA"],
      moduleKey: "attendance",
    },
  },
  {
    path: "/face-enrollment",
    name: "FaceEnrollment",
    component: lazyRoute(() => import("../views/FaceEnrollment.vue")),
    meta: {
      title: "Enrol Wajah" + appName,
      requiresAuth: true,
      roles: ["GURU", "SISWA"],
      moduleKey: "attendance",
    },
  },
  {
    path: "/homeroom-students",
    name: "TeacherStudents",
    component: lazyRoute(() => import("../views/TeacherStudents.vue")),
    meta: {
      title: "Siswa Wali Kelas" + appName,
      requiresAuth: true,
      roles: ["GURU"],
    },
  },
  {
    path: "/chat",
    name: "ChatUnified",
    component: lazyRoute(() => import("../views/UnifiedChat.vue")),
    meta: {
      title: "Pesan" + appName,
      requiresAuth: true,
      roles: ["ADMIN", "KOPERASI", "BENDAHARA", "GURU", "SISWA"],
    },
  },
  {
    path: "/private-chat",
    redirect: "/chat"
  },
  {
    path: "/learning-admin",
    name: "LearningAdmin",
    component: lazyRoute(() => import("../views/CurriculumAdmin.vue")),
    props: { section: "subjects" },
    meta: {
      title: "Kurikulum Admin" + appName,
      requiresAuth: true,
      roles: ["ADMIN"],
    },
  },
  {
    path: "/learning-admin/teacher-loads",
    name: "LearningAdminTeacherLoads",
    component: lazyRoute(() => import("../views/CurriculumAdmin.vue")),
    props: { section: "teacher-loads" },
    meta: {
      title: "Beban Mengajar Guru" + appName,
      requiresAuth: true,
      roles: ["ADMIN"],
    },
  },
  {
    path: "/learning-admin/class-distributions",
    name: "LearningAdminClassDistributions",
    component: lazyRoute(() => import("../views/CurriculumAdmin.vue")),
    props: { section: "class-distributions" },
    meta: {
      title: "Distribusi Guru ke Kelas" + appName,
      requiresAuth: true,
      roles: ["ADMIN"],
    },
  },
  {
    path: "/learning-admin/schedule",
    name: "LearningAdminSchedule",
    component: lazyRoute(() => import("../views/CurriculumAdmin.vue")),
    props: { section: "schedule" },
    meta: {
      title: "Jadwal Pembelajaran" + appName,
      requiresAuth: true,
      roles: ["ADMIN"],
    },
  },
  {
    path: "/learning-admin/generate",
    name: "LearningAdminGenerate",
    component: lazyRoute(() => import("../views/CurriculumAdmin.vue")),
    props: { section: "generate" },
    meta: {
      title: "Generate Pembagian" + appName,
      requiresAuth: true,
      roles: ["ADMIN"],
    },
  },
  {
    path: "/learning-subjects",
    name: "LearningSubjectsAdmin",
    component: lazyRoute(() => import("../views/LearningAdmin.vue")),
    meta: {
      title: "Guru Mapel" + appName,
      requiresAuth: true,
      roles: ["ADMIN"],
    },
  },
  {
    path: "/learning-exams-admin",
    name: "LearningExamAdmin",
    component: lazyRoute(() => import("../views/LearningExamAdmin.vue")),
    meta: {
      title: "Ujian Resmi Admin" + appName,
      requiresAuth: true,
      roles: ["ADMIN"],
      moduleKey: "official_exam",
    },
  },
  {
    path: "/admin-settings",
    name: "AdminSettings",
    component: lazyRoute(() => import("../views/AdminSettings.vue")),
    meta: {
      title: "Setting Admin" + appName,
      requiresAuth: true,
      roles: ["SUPER_ADMIN", "ADMIN"],
    },
  },
  {
    path: "/announcements",
    name: "Announcements",
    component: lazyRoute(() => import("../views/Announcements.vue")),
    meta: {
      title: "Pengumuman" + appName,
      requiresAuth: true,
      roles: ["ADMIN"],
    },
  },
  {
    path: "/billing",
    name: "Billing",
    component: lazyRoute(() => import("../views/Billing.vue")),
    meta: {
      title: "Billing" + appName,
      requiresAuth: true,
      roles: ["SUPER_ADMIN", "ADMIN"],
    },
  },
  {
    path: "/academic-periods",
    name: "AcademicPeriods",
    component: lazyRoute(() => import("../views/AcademicPeriods.vue")),
    meta: {
      title: "Tahun Ajaran & Semester" + appName,
      requiresAuth: true,
      roles: ["ADMIN"],
    },
  },
  {
    path: "/learning-teacher",
    name: "LearningTeacher",
    component: lazyRoute(() => import("../views/LearningTeacher.vue")),
    meta: {
      title: "Pembelajaran Guru" + appName,
      requiresAuth: true,
      roles: ["GURU"],
    },
  },
  {
    path: "/learning-grades-teacher",
    name: "LearningGradesTeacher",
    component: lazyRoute(() => import("../views/LearningGradesTeacher.vue")),
    meta: {
      title: "Penilaian Guru" + appName,
      requiresAuth: true,
      roles: ["GURU"],
    },
  },
  {
    path: "/learning-report-teacher",
    name: "LearningReportTeacher",
    component: lazyRoute(() => import("../views/LearningReportTeacher.vue")),
    meta: {
      title: "Rapor Mapel Guru" + appName,
      requiresAuth: true,
      roles: ["GURU"],
    },
  },
  {
    path: "/learning-chat-teacher",
    redirect: "/chat"
  },
  {
    path: "/learning-question-bank-teacher",
    name: "LearningQuestionBankTeacher",
    component: lazyRoute(() => import("../views/LearningQuestionBankTeacher.vue")),
    meta: {
      title: "Bank Soal Guru" + appName,
      requiresAuth: true,
      roles: ["GURU"],
    },
  },
  {
    path: "/learning-teaching-module-teacher",
    name: "LearningTeachingModuleTeacher",
    component: lazyRoute(() => import("../views/LearningTeachingModuleTeacher.vue")),
    meta: {
      title: "Modul Ajar AI Guru" + appName,
      requiresAuth: true,
      roles: ["GURU"],
      moduleKey: "teaching_module_ai",
    },
  },
  {
    path: "/learning-quiz-teacher",
    name: "LearningQuizTeacher",
    component: lazyRoute(() => import("../views/LearningQuizTeacher.vue")),
    meta: {
      title: "Quiz Guru" + appName,
      requiresAuth: true,
      roles: ["GURU"],
    },
  },
  {
    path: "/learning-exams-teacher",
    name: "LearningExamTeacher",
    component: lazyRoute(() => import("../views/LearningExamTeacher.vue")),
    meta: {
      title: "Ujian Resmi Guru" + appName,
      requiresAuth: true,
      roles: ["GURU"],
      moduleKey: "official_exam",
    },
  },
  {
    path: "/learning-student",
    redirect: "/learning-student/materials",
  },
  {
    path: "/learning-student/materials",
    name: "LearningStudentMaterials",
    component: lazyRoute(() => import("../views/LearningStudent.vue")),
    props: { mode: "materials" },
    meta: {
      title: "Materi Siswa" + appName,
      requiresAuth: true,
      roles: ["SISWA"],
    },
  },
  {
    path: "/learning-student/assignments",
    name: "LearningStudentAssignments",
    component: lazyRoute(() => import("../views/LearningStudent.vue")),
    props: { mode: "assignments" },
    meta: {
      title: "Tugas File Siswa" + appName,
      requiresAuth: true,
      roles: ["SISWA"],
    },
  },
  {
    path: "/learning-chat-student",
    redirect: "/chat"
  },
  {
    path: "/learning-quiz-student",
    name: "LearningQuizStudent",
    component: lazyRoute(() => import("../views/LearningQuizStudent.vue")),
    props: { mode: "quiz" },
    meta: {
      title: "Quiz Siswa" + appName,
      requiresAuth: true,
      roles: ["SISWA"],
    },
  },
  {
    path: "/learning-exams-student",
    name: "LearningExamStudent",
    component: lazyRoute(() => import("../views/LearningExamStudent.vue")),
    meta: {
      title: "Ujian Resmi Siswa" + appName,
      requiresAuth: true,
      roles: ["SISWA"],
      moduleKey: "official_exam",
    },
  },
  {
    path: "/learning-grades-student",
    name: "LearningGradesStudent",
    component: lazyRoute(() => import("../views/LearningGradesStudent.vue")),
    meta: {
      title: "Nilai Siswa" + appName,
      requiresAuth: true,
      roles: ["SISWA"],
    },
  },
  {
    path: "/receipts",
    name: "Receipts",
    // Perhatikan nama file aslinya adalah Tabungan.vue
    component: lazyRoute(() => import("../views/Tabungan.vue")),
    meta: {
      title: "Bukti Pembayaran" + appName,
      requiresAuth: true,
      roles: ["SISWA"],
    },
  },
  {
    path: "/auth/login",
    name: "Login",
    component: Login,
    meta: { title: "Login" + appName, hideNav: true, guestOnly: true },
  },
  {
    path: "/auth/register",
    name: "Register",
    component: lazyRoute(() => import("../views/layouts/auth/Register.vue")),
    meta: { title: "Register" + appName, hideNav: true, guestOnly: true },
  },
  {
    path: "/student-registration",
    name: "PublicStudentRegistration",
    component: lazyRoute(() => import("../views/PublicStudentRegistration.vue")),
    meta: { title: "Registrasi Siswa" + appName, hideNav: true },
  },
  {
    path: "/payment/success",
    name: "PaymentSuccess",
    component: lazyRoute(() => import("../views/PaymentResult.vue")),
    props: { status: "success" },
    meta: { title: "Payment Success" + appName, hideNav: true },
  },
  {
    path: "/payment/failed",
    name: "PaymentFailed",
    component: lazyRoute(() => import("../views/PaymentResult.vue")),
    props: { status: "failed" },
    meta: { title: "Payment Failed" + appName, hideNav: true },
  },
  {
    path: "/failed",
    redirect: { name: "PaymentFailed" },
    meta: { hideNav: true },
  },
  {
    path: "/registrasi-siswa",
    redirect: { name: "PublicStudentRegistration" },
    meta: { hideNav: true },
  },
  {
    path: "/auth/forgot-password",
    name: "ForgotPassword",
    component: lazyRoute(() => import("../views/layouts/auth/forgot-password.vue")),
    meta: { title: "Forgot Password" + appName, hideNav: true },
  },
  {
    path: "/500",
    name: "Page500",
    component: lazyRoute(() => import("../views/layouts/error/500.vue")),
    meta: { title: "Server Error" + appName, hideNav: true },
  },
  {
    path: "/maintenance",
    name: "maintenance",
    component: lazyRoute(() => import("../views/layouts/error/maintenance.vue")),
    meta: { title: "Maintenance" + appName, hideNav: true },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "Page404",
    component: lazyRoute(() => import("../views/layouts/error/404.vue")),
    meta: { title: "404" + appName, hideNav: true },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkExactActiveClass: "exact-active",
});

const personalTeacherModeBlockedRoutes = new Set([
  "Inventory",
  "Koperasi",
  "SchoolUsers",
  "TeacherStudents",
  "LearningAdminTeacherLoads",
  "LearningAdminClassDistributions",
  "LearningAdminSchedule",
  "LearningAdminGenerate",
  "LearningExamAdmin",
  "LearningExamTeacher",
  "LearningExamStudent",
  "LearningReportTeacher",
  "Announcements",
  "Billing",
]);

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || appName;

  if (from.name && to.fullPath !== from.fullPath) {
    cancelPendingApiRequests();
  }

  if (to.meta.guestOnly && isAuthenticated()) {
    next({ name: "Dashboard" });
    return;
  }

  if (to.meta.requiresAuth && !isAuthenticated()) {
    clearSession();
    next({ name: "Login" });
    return;
  }

  if (to.meta.roles?.length) {
    const role = getStoredRole();
    if (!to.meta.roles.includes(role)) {
      next({ name: "Dashboard" });
      return;
    }
  }

  if (to.meta.moduleKey) {
    const storedUser = getStoredUser() || {};
    const moduleFlagByKey = {
      inventory: "inventory_module_enabled",
      attendance: getStoredRole() === "GURU" ? "attendance_teacher_module_enabled" : "attendance_module_enabled",
      official_exam: "official_exam_module_enabled",
      koperasi: "koperasi_module_enabled",
      private_chat: "private_chat_module_enabled",
      teaching_module_ai: "teaching_module_ai_enabled",
      payroll: "payroll_module_enabled",
    };
    const moduleFlag = moduleFlagByKey[to.meta.moduleKey];
    const moduleEnabled = moduleFlag ? storedUser[moduleFlag] !== false : true;
    if (!moduleEnabled) {
      next({ name: "Dashboard" });
      return;
    }
  }

  if (personalTeacherModeBlockedRoutes.has(to.name)) {
    const storedUser = getStoredUser() || {};
    if (storedUser.personal_teacher_mode_enabled === true) {
      next({ name: "Dashboard" });
      return;
    }
  }

  next();
});

router.onError((error) => {
  if (isChunkLoadError(error) && recoverFromChunkLoadError()) {
    return;
  }
});

router.afterEach(() => {
  clearChunkReloadAttempt();
});

export default router;
