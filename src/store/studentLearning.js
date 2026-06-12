import { defineStore } from "pinia";

const baseSubmissionForm = () => ({
  answers: [],
  submission_text: "",
});

const baseExamCodeForm = () => ({
  code: "",
});

export const useStudentLearningStore = defineStore("studentLearning", {
  state: () => ({
    materials: [],
    assignments: [],
    submissionTarget: null,
    submissionFile: null,
    isSubmitting: false,
    message: "",
    isError: false,
    submissionForm: baseSubmissionForm(),
    activeQuestionIndex: 0,
    questionTimeLeftMs: 0,
    violationCount: 0,
    antiCheatMessage: "",
    fullscreenRecoveryRequired: false,
    pseudoFullscreenActive: false,
    pseudoViewportHeight: null,
    examCodeModalOpen: false,
    confirmSubmitModalOpen: false,
    pendingExamAssignmentForCode: null,
    reviewTarget: null,
    maxViolations: 3,
    examCodeForm: baseExamCodeForm(),
  }),
});
