import { defineStore } from "pinia";

export const useStudentFaceEnrollmentStore = defineStore("studentFaceEnrollment", {
  state: () => ({
    faceReferenceFile: null,
    faceReferencePreview: "",
    isSaving: false,
    isCameraLoading: false,
    cameraActive: false,
  }),
});
