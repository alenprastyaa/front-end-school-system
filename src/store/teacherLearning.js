import { defineStore } from "pinia";

const baseMaterialForm = () => ({ title: "", content: "" });
const baseMaterialAiForm = () => ({ topic: "", slide_count: 8, learning_goals: "", additional_instructions: "" });
const baseAssignmentForm = () => ({ title: "", description: "", due_date: "", assignment_type: "FILE" });

export const useTeacherLearningStore = defineStore("teacherLearning", {
  state: () => ({
    selectedSubject: null,
    activeTab: "materials",
    materials: [],
    assignments: [],
    submissions: [],
    gradingAssignment: null,
    subjectError: "",
    message: "",
    isError: false,
    materialModalOpen: false,
    assignmentModalOpen: false,
    isSavingMaterial: false,
    isSavingAssignment: false,
    isGeneratingAiMaterial: false,
    isPublishingAiMaterial: false,
    materialFile: null,
    assignmentFile: null,
    materialCreationMode: "manual",
    materialAiPreview: null,
    editingMaterialId: null,
    editingAssignmentId: null,
    currentAssignmentAttachmentUrl: "",
    isDeleteModalOpen: false,
    isDeletingItem: false,
    deleteTargetType: "",
    deleteTargetItem: null,
    submissionSearch: "",
    submissionFilter: "ALL",
    assignmentSearch: "",
    assignmentTypeFilter: "ALL",
    assignmentSort: "NEWEST",
    openAssignmentActionId: null,
    assignmentActionMenuStyle: { top: "0px", right: "0px" },
    materialForm: baseMaterialForm(),
    materialAiForm: baseMaterialAiForm(),
    assignmentForm: baseAssignmentForm(),
  }),
});
