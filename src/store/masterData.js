import { defineStore } from "pinia";
import { api } from "@/api";

const DEFAULT_TTL = 60 * 1000;

const normalizeList = (response) => {
  const items = response?.data || [];
  return Array.isArray(items) ? items : [];
};

export const useMasterDataStore = defineStore("masterData", {
  state: () => ({
    cache: {},
    inFlight: {},
  }),

  actions: {
    async fetchCachedList(key, endpoint, { force = false, ttl = DEFAULT_TTL } = {}) {
      const cached = this.cache[key];
      if (!force && cached && Date.now() - cached.loadedAt < ttl) {
        return cached.items;
      }

      if (this.inFlight[key]) {
        return this.inFlight[key];
      }

      this.inFlight[key] = (async () => {
        try {
          const response = await api.get(endpoint);
          const items = normalizeList(response);
          this.cache[key] = {
            items,
            loadedAt: Date.now(),
          };
          return items;
        } finally {
          this.inFlight[key] = null;
        }
      })();

      return this.inFlight[key];
    },

    invalidate(keys = []) {
      const nextCache = { ...this.cache };
      keys.forEach((key) => {
        delete nextCache[key];
      });
      this.cache = nextCache;
    },

    getClasses(options = {}) {
      return this.fetchCachedList("classes", "/class", options);
    },

    getAcademicPeriods(options = {}) {
      const key = "academicPeriods";
      const ttl = options.ttl || DEFAULT_TTL;
      const cached = this.cache[key];

      if (!options.force && cached && Date.now() - cached.loadedAt < ttl) {
        return cached.value;
      }

      if (this.inFlight[key]) {
        return this.inFlight[key];
      }

      this.inFlight[key] = (async () => {
        try {
          const response = await api.get("/academic-periods");
          const value = {
            years: Array.isArray(response?.data?.years) ? response.data.years : [],
            active: response?.data?.active || null,
          };
          this.cache[key] = {
            value,
            loadedAt: Date.now(),
          };
          return value;
        } finally {
          this.inFlight[key] = null;
        }
      })();

      return this.inFlight[key];
    },

    getTeacherUsers(options = {}) {
      return this.fetchCachedList("teacherUsers", "/auth/user-school?role=GURU", options);
    },

    getAdminSubjects(options = {}) {
      return this.fetchCachedList("adminSubjects", "/learning/subjects/admin", options);
    },

    getTeacherSubjects(options = {}) {
      return this.fetchCachedList("teacherSubjects", "/learning/subjects/teacher", options);
    },

    getStudentSubjects(options = {}) {
      return this.fetchCachedList("studentSubjects", "/learning/subjects/student", options);
    },
  },
});
