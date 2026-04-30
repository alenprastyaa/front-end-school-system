import { reactive } from "vue";

const layoutChromeState = reactive({
  hidden: false,
});

export const setLayoutChromeHidden = (hidden) => {
  layoutChromeState.hidden = Boolean(hidden);
};

export const useLayoutChrome = () => layoutChromeState;
