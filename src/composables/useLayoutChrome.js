import { reactive } from "vue";

const layoutChromeState = reactive({
  hidden: false,
  mobileChatHeaderVisible: false,
});

export const setLayoutChromeHidden = (hidden) => {
  layoutChromeState.hidden = Boolean(hidden);
};

export const setMobileChatHeaderVisible = (visible) => {
  layoutChromeState.mobileChatHeaderVisible = Boolean(visible);
};

export const useLayoutChrome = () => layoutChromeState;
