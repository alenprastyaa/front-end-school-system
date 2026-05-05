import { defineStore } from "pinia";
import { api } from "@/api";

const SUMMARY_TTL = 15000;
const SUBJECT_TTL = 60000;

const normalizeSubjectList = (response) => {
  const items = response?.data || [];
  return Array.isArray(items) ? items : [];
};

const normalizeSummaryList = (response) => {
  const items = response?.data || [];
  return Array.isArray(items) ? items : [];
};

export const useSidebar = defineStore("sidebar", {
  state: () => ({
    menu: [
      {
        name: "MENU",
        children: [
          {
            name: "Dashboard",
            icon: "bxs:dashboard",
            type: "default",
            url: "/dashboard",
          },
          {
            name: "Components",
            icon: "",
            type: "accordion",
            url: false,
            isChildren: true,
            children: [
              {
                name: "Alert",
                icon: false,
                type: "default",
              },
            ],
          },
        ],
      },
    ],
    openGroupsByRole: {},
    liveChatSubjects: [],
    liveChatSummaryItems: [],
    liveChatUnreadBySubject: {},
    liveChatPendingUnreadBySubject: {},
    liveChatUnreadCount: 0,
    liveChatSummaryLoadedAt: 0,
    liveChatSubjectsLoadedAt: 0,
    liveChatSummaryInFlight: null,
    liveChatSubjectsInFlight: null,
  }),

  actions: {
    getOpenGroups(role) {
      return this.openGroupsByRole[role] || [];
    },

    setOpenGroups(role, groups = []) {
      this.openGroupsByRole = {
        ...this.openGroupsByRole,
        [role]: Array.isArray(groups) ? [...new Set(groups)] : [],
      };
    },

    toggleGroup(role, key) {
      const groups = this.getOpenGroups(role);
      if (groups.includes(key)) {
        this.setOpenGroups(role, groups.filter((item) => item !== key));
        return;
      }

      this.setOpenGroups(role, [...groups, key]);
    },

    clearOpenGroups(role) {
      if (!role) {
        return;
      }

      const next = { ...this.openGroupsByRole };
      delete next[role];
      this.openGroupsByRole = next;
    },

    recomputeLiveChatUnreadCount() {
      const subjectIds = new Set([
        ...Object.keys(this.liveChatUnreadBySubject || {}),
        ...Object.keys(this.liveChatPendingUnreadBySubject || {}),
      ]);

      this.liveChatUnreadCount = [...subjectIds].reduce((total, subjectId) => {
        const baseCount = Number(this.liveChatUnreadBySubject?.[subjectId] || 0);
        const pendingCount = Number(this.liveChatPendingUnreadBySubject?.[subjectId] || 0);
        return total + Math.max(baseCount, pendingCount);
      }, 0);
    },

    applyLiveChatSummary(summaryItems = []) {
      const nextMap = {};
      const normalizedItems = Array.isArray(summaryItems) ? summaryItems : [];

      normalizedItems.forEach((item) => {
        const subjectId = Number(item?.subject_id || 0);
        if (!subjectId) {
          return;
        }

        nextMap[subjectId] = Number(item?.unread_count || 0);
      });

      this.liveChatSummaryItems = normalizedItems;
      this.liveChatUnreadBySubject = nextMap;
      this.liveChatSummaryLoadedAt = Date.now();
      this.recomputeLiveChatUnreadCount();
    },

    bumpLiveChatUnread(subjectId) {
      const normalizedSubjectId = Number(subjectId || 0);
      if (!normalizedSubjectId) {
        return;
      }

      this.liveChatPendingUnreadBySubject = {
        ...this.liveChatPendingUnreadBySubject,
        [normalizedSubjectId]: Number(this.liveChatPendingUnreadBySubject?.[normalizedSubjectId] || 0) + 1,
      };
      this.recomputeLiveChatUnreadCount();
    },

    clearPendingLiveChatUnread() {
      if (Object.keys(this.liveChatPendingUnreadBySubject).length === 0) {
        return;
      }

      this.liveChatPendingUnreadBySubject = {};
      this.recomputeLiveChatUnreadCount();
    },

    async refreshLiveChatSummary({ force = false } = {}) {
      if (!force && this.liveChatSummaryLoadedAt && Date.now() - this.liveChatSummaryLoadedAt < SUMMARY_TTL) {
        return this.liveChatSummaryItems;
      }

      if (this.liveChatSummaryInFlight) {
        return this.liveChatSummaryInFlight;
      }

      this.liveChatSummaryInFlight = (async () => {
        try {
          const summaryItems = normalizeSummaryList(await api.get("/learning/chat/summary"));
          this.applyLiveChatSummary(summaryItems);
        } catch (error) {
          // Keep previous summary if the request fails.
        } finally {
          this.liveChatSummaryInFlight = null;
        }

        return this.liveChatSummaryItems;
      })();

      return this.liveChatSummaryInFlight;
    },

    async refreshLiveChatSubjects(role, { force = false } = {}) {
      const normalizedRole = String(role || "").toUpperCase();
      const endpoint = normalizedRole === "GURU" ? "/learning/subjects/teacher" : "/learning/subjects/student";

      if (!["GURU", "SISWA"].includes(normalizedRole)) {
        this.liveChatSubjects = [];
        return [];
      }

      if (!force && this.liveChatSubjectsLoadedAt && Date.now() - this.liveChatSubjectsLoadedAt < SUBJECT_TTL) {
        return this.liveChatSubjects;
      }

      if (this.liveChatSubjectsInFlight) {
        return this.liveChatSubjectsInFlight;
      }

      this.liveChatSubjectsInFlight = (async () => {
        try {
          const response = await api.get(endpoint);
          this.liveChatSubjects = normalizeSubjectList(response);
          this.liveChatSubjectsLoadedAt = Date.now();
        } catch (error) {
          if (!this.liveChatSubjects.length) {
            this.liveChatSubjects = [];
          }
        } finally {
          this.liveChatSubjectsInFlight = null;
        }

        return this.liveChatSubjects;
      })();

      return this.liveChatSubjectsInFlight;
    },

    invalidateLiveChatCache() {
      this.liveChatSummaryLoadedAt = 0;
      this.liveChatSubjectsLoadedAt = 0;
    },
  },
});
