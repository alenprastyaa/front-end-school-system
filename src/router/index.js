import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../views/Dashboard.vue";
import Schools from "../views/Schools.vue";
import SchoolUsers from "../views/SchoolUsers.vue";
import Classes from "../views/Classes.vue";
import Students from "../views/Users.vue";
import Attendance from "../views/Attendance.vue";
import Receipts from "../views/Tabungan.vue";
import TeacherStudents from "../views/TeacherStudents.vue";
import LearningAdmin from "../views/LearningAdmin.vue";
import LearningExamAdmin from "../views/LearningExamAdmin.vue";
import LearningExamTeacher from "../views/LearningExamTeacher.vue";
import LearningTeacher from "../views/LearningTeacher.vue";
import LearningStudent from "../views/LearningStudent.vue";
import LearningChat from "../views/LearningChat.vue";
import LearningGradesTeacher from "../views/LearningGradesTeacher.vue";
import LearningReportTeacher from "../views/LearningReportTeacher.vue";
import LearningQuizTeacher from "../views/LearningQuizTeacher.vue";
import LearningQuestionBankTeacher from "../views/LearningQuestionBankTeacher.vue";
import LearningQuizStudent from "../views/LearningQuizStudent.vue";
import LearningExamStudent from "../views/LearningExamStudent.vue";
import LearningGradesStudent from "../views/LearningGradesStudent.vue";
import AdminSettings from "../views/AdminSettings.vue";
import AcademicPeriods from "../views/AcademicPeriods.vue";
import PublicLanding from "../views/PublicLanding.vue";
import PublicStudentRegistration from "../views/PublicStudentRegistration.vue";
import Login from "../views/layouts/auth/Login.vue";
import Register from "../views/layouts/auth/Register.vue";
import ForgotPassword from "../views/layouts/auth/forgot-password.vue";
import Page404 from "../views/layouts/error/404.vue";
import Page500 from "../views/layouts/error/500.vue";
import PageMaintenance from "../views/layouts/error/maintenance.vue";
import { getStoredRole, isAuthenticated } from "@/utils/auth";

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
      roles: ["SUPER_ADMIN", "ADMIN", "GURU", "SISWA"],
    },
  },
  {
    path: "/schools",
    name: "Schools",
    component: Schools,
    meta: {
      title: "Sekolah" + appName,
      requiresAuth: true,
      roles: ["SUPER_ADMIN"],
    },
  },
  {
    path: "/school-users",
    name: "SchoolUsers",
    component: SchoolUsers,
    meta: {
      title: "User Sekolah" + appName,
      requiresAuth: true,
      roles: ["SUPER_ADMIN", "ADMIN"],
    },
  },
  {
    path: "/classes",
    name: "Classes",
    component: Classes,
    meta: {
      title: "Kelas" + appName,
      requiresAuth: true,
      roles: ["ADMIN"],
    },
  },
  {
    path: "/students",
    name: "Students",
    component: Students,
    meta: {
      title: "Siswa" + appName,
      requiresAuth: true,
      roles: ["ADMIN"],
    },
  },
  {
    path: "/attendance",
    name: "Attendance",
    component: Attendance,
    meta: {
      title: "Absensi" + appName,
      requiresAuth: true,
      roles: ["SISWA"],
    },
  },
  {
    path: "/homeroom-students",
    name: "TeacherStudents",
    component: TeacherStudents,
    meta: {
      title: "Siswa Wali Kelas" + appName,
      requiresAuth: true,
      roles: ["GURU"],
    },
  },
  {
    path: "/learning-admin",
    name: "LearningAdmin",
    component: LearningAdmin,
    meta: {
      title: "Pembelajaran Admin" + appName,
      requiresAuth: true,
      roles: ["ADMIN"],
    },
  },
  {
    path: "/learning-exams-admin",
    name: "LearningExamAdmin",
    component: LearningExamAdmin,
    meta: {
      title: "Ujian Resmi Admin" + appName,
      requiresAuth: true,
      roles: ["ADMIN"],
    },
  },
  {
    path: "/admin-settings",
    name: "AdminSettings",
    component: AdminSettings,
    meta: {
      title: "Setting Admin" + appName,
      requiresAuth: true,
      roles: ["ADMIN"],
    },
  },
  {
    path: "/academic-periods",
    name: "AcademicPeriods",
    component: AcademicPeriods,
    meta: {
      title: "Tahun Ajaran & Semester" + appName,
      requiresAuth: true,
      roles: ["ADMIN"],
    },
  },
  {
    path: "/learning-teacher",
    name: "LearningTeacher",
    component: LearningTeacher,
    meta: {
      title: "Pembelajaran Guru" + appName,
      requiresAuth: true,
      roles: ["GURU"],
    },
  },
  {
    path: "/learning-grades-teacher",
    name: "LearningGradesTeacher",
    component: LearningGradesTeacher,
    meta: {
      title: "Penilaian Guru" + appName,
      requiresAuth: true,
      roles: ["GURU"],
    },
  },
  {
    path: "/learning-report-teacher",
    name: "LearningReportTeacher",
    component: LearningReportTeacher,
    meta: {
      title: "Rapor Mapel Guru" + appName,
      requiresAuth: true,
      roles: ["GURU"],
    },
  },
  {
    path: "/learning-chat-teacher",
    name: "LearningChatTeacher",
    component: LearningChat,
    meta: {
      title: "Live Chat Guru" + appName,
      requiresAuth: true,
      roles: ["GURU"],
    },
  },
  {
    path: "/learning-question-bank-teacher",
    name: "LearningQuestionBankTeacher",
    component: LearningQuestionBankTeacher,
    meta: {
      title: "Bank Soal Guru" + appName,
      requiresAuth: true,
      roles: ["GURU"],
    },
  },
  {
    path: "/learning-quiz-teacher",
    name: "LearningQuizTeacher",
    component: LearningQuizTeacher,
    meta: {
      title: "Quiz Guru" + appName,
      requiresAuth: true,
      roles: ["GURU"],
    },
  },
  {
    path: "/learning-exams-teacher",
    name: "LearningExamTeacher",
    component: LearningExamTeacher,
    meta: {
      title: "Ujian Resmi Guru" + appName,
      requiresAuth: true,
      roles: ["GURU"],
    },
  },
  {
    path: "/learning-student",
    name: "LearningStudent",
    component: LearningStudent,
    meta: {
      title: "Pembelajaran Siswa" + appName,
      requiresAuth: true,
      roles: ["SISWA"],
    },
  },
  {
    path: "/learning-chat-student",
    name: "LearningChatStudent",
    component: LearningChat,
    meta: {
      title: "Live Chat Siswa" + appName,
      requiresAuth: true,
      roles: ["SISWA"],
    },
  },
  {
    path: "/learning-quiz-student",
    name: "LearningQuizStudent",
    component: LearningQuizStudent,
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
    component: LearningExamStudent,
    meta: {
      title: "Ujian Resmi Siswa" + appName,
      requiresAuth: true,
      roles: ["SISWA"],
    },
  },
  {
    path: "/learning-grades-student",
    name: "LearningGradesStudent",
    component: LearningGradesStudent,
    meta: {
      title: "Nilai Siswa" + appName,
      requiresAuth: true,
      roles: ["SISWA"],
    },
  },
  {
    path: "/receipts",
    name: "Receipts",
    component: Receipts,
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
    component: Register,
    meta: { title: "Register" + appName, hideNav: true, guestOnly: true },
  },
  {
    path: "/student-registration",
    name: "PublicStudentRegistration",
    component: PublicStudentRegistration,
    meta: { title: "Registrasi Siswa" + appName, hideNav: true },
  },
  {
    path: "/registrasi-siswa",
    redirect: { name: "PublicStudentRegistration" },
    meta: { hideNav: true },
  },
  {
    path: "/auth/forgot-password",
    name: "ForgotPassword",
    component: ForgotPassword,
    meta: { title: "Forgot Password" + appName, hideNav: true },
  },
  {
    path: "/500",
    name: "Page500",
    component: Page500,
    meta: { title: "Server Error" + appName, hideNav: true },
  },
  {
    path: "/maintenance",
    name: "maintenance",
    component: PageMaintenance,
    meta: { title: "Maintenance" + appName, hideNav: true },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "Page404",
    component: Page404,
    meta: { title: "404" + appName, hideNav: true },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkExactActiveClass: "exact-active",
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || appName;

  if (to.meta.guestOnly && isAuthenticated()) {
    next({ name: "Dashboard" });
    return;
  }

  if (to.meta.requiresAuth && !isAuthenticated()) {
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

  next();
});

export default router;
