import { defineStore } from "pinia";

const baseAssignmentForm = () => ({
  title: "",
  description: "",
  due_date: "",
  assignment_type: "MCQ",
  question_duration_mode: "PER_QUESTION",
  question_duration_seconds: 60,
  is_exam: false,
  exam_category: "CUSTOM",
});

export const useTeacherExamStore = defineStore("teacherExam", {
  state: () => ({
    selectedSubject: null,
    assignments: [],
    questionBank: [],
    questionBankTotal: 0,
    subjectError: "",
    message: "",
    isError: false,
    isSavingAssignment: false,
    bankSearch: "",
    bankTypeFilter: "ALL",
    bankPageSize: 20,
    bankCurrentPage: 1,
    activeExamRequestId: null,
    composerSectionRef: null,
    questionBankSectionRef: null,
    isComposerHighlighted: false,
    assignmentForm: baseAssignmentForm(),
  }),
});
