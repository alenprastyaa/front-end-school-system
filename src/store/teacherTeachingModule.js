import { defineStore } from "pinia";

const baseSuggestionCatalog = () => ({
  items: [],
  selected: null,
});

const baseForm = () => ({
  title: "",
  description: "",
});

const baseCustomForm = () => ({
  topic: "",
});

export const useTeacherTeachingModuleStore = defineStore("teacherTeachingModule", {
  state: () => ({
    selectedSubject: null,
    subjectError: "",
    topicSuggestions: [],
    topicSuggestionError: "",
    customTopic: "",
    isLoadingTopicSuggestions: false,
    isLoadingSuggestionCatalog: false,
    suggestionCatalogError: "",
    isGenerating: false,
    isSavingDraft: false,
    isLoadingSavedModules: false,
    isDeletingSavedModule: false,
    draft: null,
    savedModules: [],
    savedModuleError: "",
    editingModuleId: null,
    showSavedModuleActions: false,
    showDeleteConfirmation: false,
    activeSavedModule: null,
    suggestionCatalog: baseSuggestionCatalog(),
    form: baseForm(),
    customForm: baseCustomForm(),
  }),
});
