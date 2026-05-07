import { createRouter, createWebHistory } from "vue-router";
import { getStoredRole, isAuthenticated } from "@/utils/auth";

const appName = " - School System LMS";

const routes = [
  {
    path: "/",
    name: "PublicLanding",
    component: () => import("../views/PublicLanding.vue"),
    meta: {
      title: "School System LMS" + appName,
      hideNav: true,
      guestOnly: true,
    },
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: () => import("../views/Dashboard.vue"),
    meta: {
      title: "Dashboard" + appName,
      requiresAuth: true,
      roles: ["SUPER_ADMIN", "ADMIN", "GURU", "SISWA"],
    },
  },
  {
    path: "/schools",
    name: "Schools",
    component: () => import("../views/Schools.vue"),
    meta: {
      title: "Sekolah" + appName,
      requiresAuth: true,
      roles: ["SUPER_ADMIN"],
    },
  },
  {
    path: "/school-users",
    name: "SchoolUsers",
    component: () => import("../views/SchoolUsers.vue"),
    meta: {
      title: "User Sekolah" + appName,
      requiresAuth: true,
      roles: ["ADMIN"],
    },
  },
  {
    path: "/classes",
    name: "Classes",
    component: () => import("../views/Classes.vue"),
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
    component: () => import("../views/Users.vue"), 
    meta: {
      title: "Siswa" + appName,
      requiresAuth: true,
      roles: ["ADMIN"],
    },
  },
  {
    path: "/attendance",
    name: "Attendance",
    component: () => import("../views/Attendance.vue"),
    meta: {
      title: "Absensi" + appName,
      requiresAuth: true,
      roles: ["SISWA"],
    },
  },
  {
    path: "/face-enrollment",
    name: "FaceEnrollment",
    component: () => import("../views/FaceEnrollment.vue"),
    meta: {
      title: "Enrol Wajah" + appName,
      requiresAuth: true,
      roles: ["SISWA"],
    },
  },
  {
    path: "/homeroom-students",
    name: "TeacherStudents",
    component: () => import("../views/TeacherStudents.vue"),
    meta: {
      title: "Siswa Wali Kelas" + appName,
      requiresAuth: true,
      roles: ["GURU"],
    },
  },
  {
    path: "/learning-admin",
    name: "LearningAdmin",
    component: () => import("../views/CurriculumAdmin.vue"),
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
    component: () => import("../views/CurriculumAdmin.vue"),
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
    component: () => import("../views/CurriculumAdmin.vue"),
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
    component: () => import("../views/CurriculumAdmin.vue"),
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
    component: () => import("../views/CurriculumAdmin.vue"),
    props: { section: "generate" },
    meta: {
      title: "Generate Pembagian" + appName,
      requiresAuth: true,
      roles: ["ADMIN"],
    },
  },
  {
    path: "/learning-exams-admin",
    name: "LearningExamAdmin",
    component: () => import("../views/LearningExamAdmin.vue"),
    meta: {
      title: "Ujian Resmi Admin" + appName,
      requiresAuth: true,
      roles: ["ADMIN"],
    },
  },
  {
    path: "/admin-settings",
    name: "AdminSettings",
    component: () => import("../views/AdminSettings.vue"),
    meta: {
      title: "Setting Admin" + appName,
      requiresAuth: true,
      roles: ["ADMIN"],
    },
  },
  {
    path: "/academic-periods",
    name: "AcademicPeriods",
    component: () => import("../views/AcademicPeriods.vue"),
    meta: {
      title: "Tahun Ajaran & Semester" + appName,
      requiresAuth: true,
      roles: ["ADMIN"],
    },
  },
  {
    path: "/learning-teacher",
    name: "LearningTeacher",
    component: () => import("../views/LearningTeacher.vue"),
    meta: {
      title: "Pembelajaran Guru" + appName,
      requiresAuth: true,
      roles: ["GURU"],
    },
  },
  {
    path: "/learning-grades-teacher",
    name: "LearningGradesTeacher",
    component: () => import("../views/LearningGradesTeacher.vue"),
    meta: {
      title: "Penilaian Guru" + appName,
      requiresAuth: true,
      roles: ["GURU"],
    },
  },
  {
    path: "/learning-report-teacher",
    name: "LearningReportTeacher",
    component: () => import("../views/LearningReportTeacher.vue"),
    meta: {
      title: "Rapor Mapel Guru" + appName,
      requiresAuth: true,
      roles: ["GURU"],
    },
  },
  {
    path: "/learning-chat-teacher",
    name: "LearningChatTeacher",
    component: () => import("../views/LearningChat.vue"),
    meta: {
      title: "Live Chat Guru" + appName,
      requiresAuth: true,
      roles: ["GURU"],
    },
  },
  {
    path: "/learning-question-bank-teacher",
    name: "LearningQuestionBankTeacher",
    component: () => import("../views/LearningQuestionBankTeacher.vue"),
    meta: {
      title: "Bank Soal Guru" + appName,
      requiresAuth: true,
      roles: ["GURU"],
    },
  },
  {
    path: "/learning-quiz-teacher",
    name: "LearningQuizTeacher",
    component: () => import("../views/LearningQuizTeacher.vue"),
    meta: {
      title: "Quiz Guru" + appName,
      requiresAuth: true,
      roles: ["GURU"],
    },
  },
  {
    path: "/learning-exams-teacher",
    name: "LearningExamTeacher",
    component: () => import("../views/LearningExamTeacher.vue"),
    meta: {
      title: "Ujian Resmi Guru" + appName,
      requiresAuth: true,
      roles: ["GURU"],
    },
  },
  {
    path: "/learning-student",
    name: "LearningStudent",
    component: () => import("../views/LearningStudent.vue"),
    meta: {
      title: "Pembelajaran Siswa" + appName,
      requiresAuth: true,
      roles: ["SISWA"],
    },
  },
  {
    path: "/learning-chat-student",
    name: "LearningChatStudent",
    component: () => import("../views/LearningChat.vue"),
    meta: {
      title: "Live Chat Siswa" + appName,
      requiresAuth: true,
      roles: ["SISWA"],
    },
  },
  {
    path: "/learning-quiz-student",
    name: "LearningQuizStudent",
    component: () => import("../views/LearningQuizStudent.vue"),
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
    component: () => import("../views/LearningExamStudent.vue"),
    meta: {
      title: "Ujian Resmi Siswa" + appName,
      requiresAuth: true,
      roles: ["SISWA"],
    },
  },
  {
    path: "/learning-grades-student",
    name: "LearningGradesStudent",
    component: () => import("../views/LearningGradesStudent.vue"),
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
    component: () => import("../views/Tabungan.vue"),
    meta: {
      title: "Bukti Pembayaran" + appName,
      requiresAuth: true,
      roles: ["SISWA"],
    },
  },
  {
    path: "/auth/login",
    name: "Login",
    component: () => import("../views/layouts/auth/Login.vue"),
    meta: { title: "Login" + appName, hideNav: true, guestOnly: true },
  },
  {
    path: "/auth/register",
    name: "Register",
    component: () => import("../views/layouts/auth/Register.vue"),
    meta: { title: "Register" + appName, hideNav: true, guestOnly: true },
  },
  {
    path: "/student-registration",
    name: "PublicStudentRegistration",
    component: () => import("../views/PublicStudentRegistration.vue"),
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
    component: () => import("../views/layouts/auth/forgot-password.vue"),
    meta: { title: "Forgot Password" + appName, hideNav: true },
  },
  {
    path: "/500",
    name: "Page500",
    component: () => import("../views/layouts/error/500.vue"),
    meta: { title: "Server Error" + appName, hideNav: true },
  },
  {
    path: "/maintenance",
    name: "maintenance",
    component: () => import("../views/layouts/error/maintenance.vue"),
    meta: { title: "Maintenance" + appName, hideNav: true },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "Page404",
    component: () => import("../views/layouts/error/404.vue"),
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
