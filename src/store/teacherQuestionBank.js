import { defineStore } from "pinia";

const baseQuizOverviewModal = () => ({
  open: false,
  assignment: null,
  loading: false,
  analytics: {},
  submittedStudents: [],
  pendingStudents: [],
});

const baseQuestionPreviewModal = () => ({
  open: false,
  question: null,
  source: "bank",
  sourceLabel: "",
  questionNumber: null,
});

const baseDeleteQuestionConfirmModal = () => ({
  open: false,
  question: null,
});

const baseQuestionPreviewForm = () => ({
  question_type: "MCQ",
  question_text: "",
  question_image_url: "",
  options: [],
  correct_option: 0,
  rubric: "",
});

const baseAssignmentForm = () => ({
  title: "",
  description: "",
  due_date: "",
  assignment_type: "MCQ",
  shuffle_questions: false,
  question_duration_seconds: 10,
  selected_question_bank_ids: [],
});

const baseQuestionBankForm = () => ({
  question_type: "MCQ",
  question_text: "",
  question_image_url: "",
  options: ["", "", "", "", ""],
  correct_option: 0,
  rubric: "",
});

const baseAiGeneratorForm = () => ({
  question_type: "MCQ",
  question_count: 5,
  difficulty: "MENENGAH",
  topic: "",
  include_illustration: false,
  additional_instructions: "",
});

export const useTeacherQuestionBankStore = defineStore("teacherQuestionBank", {
  state: () => ({
    selectedSubject: null,
    subjectDropdownOpen: false,
    assignments: [],
    questionBank: [],
    questionBankForAssignment: [],
    questionBankTotal: 0,
    subjectError: "",
    message: "",
    isError: false,
    isSavingAssignment: false,
    isSavingQuestionBank: false,
    isSavingQuestionPreview: false,
    isUploadingQuestionImage: false,
    isUploadingPreviewQuestionImage: false,
    isDownloadingTemplate: false,
    isImportingQuestionBank: false,
    isGeneratingAiQuestions: false,
    isSavingGeneratedAiQuestions: false,
    aiGeneratorModalOpen: false,
    aiPreviewSectionRef: null,
    aiGeneratorScrollRef: null,
    aiTopicSuggestions: [],
    aiCustomTopic: "",
    aiTopicSuggestionError: "",
    isLoadingAiTopicSuggestions: false,
    questionBankModalOpen: false,
    bulkImportModalOpen: false,
    questionBankDocumentInput: null,
    questionBankImportFile: null,
    bankSearch: "",
    bankTypeFilter: "ALL",
    bankPageSize: 20,
    bankCurrentPage: 1,
    randomQuestionCount: 5,
    quizOverviewModal: baseQuizOverviewModal(),
    questionPreviewModal: baseQuestionPreviewModal(),
    deleteQuestionConfirmModal: baseDeleteQuestionConfirmModal(),
    questionPreviewForm: baseQuestionPreviewForm(),
    assignmentForm: baseAssignmentForm(),
    questionBankForm: baseQuestionBankForm(),
    aiGeneratorForm: baseAiGeneratorForm(),
    generatedAiQuestions: [],
    selectedGeneratedAiQuestionIds: [],
    aiGenerationStageIndex: 0,
  }),
});
