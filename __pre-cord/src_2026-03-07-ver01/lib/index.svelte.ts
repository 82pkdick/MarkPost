
import type { LoadedPostData } from "./types";
import CurrentPost from "./CurrentPostState.svelte";

/** side menu state */
let menuState = $state('N');

export type MenuStateType = 'N'|'C'|'T';

export const getMenuState = () => {
  return menuState;
};

export const setMenuState = (choice: MenuStateType) => {
  menuState = choice;
};

/** theme state */
export const defaultThemeName = 'default';

let currentTheme = $state('');

export const getCurrentTheme = () => {
  return currentTheme;
};

export const changeThemeMode = (color: string = defaultThemeName) => {
  document.documentElement.dataset['theme'] = color;
  currentTheme = color;
  localStorage.setItem('theme-color', color);
};

/** base font size state */
const ftsizeEntry = { small: '16px', normal: '18px', large: '20px'};

export type FtsizeType = keyof typeof ftsizeEntry;

export const defaultFontSize = 'normal';

let currentFontSize = $state('');

export const getCurrentFontSize = () => {
  return currentFontSize;
};

export const changeBaseFontSize = (size: FtsizeType = defaultFontSize) => {
  const fontsize = ftsizeEntry[size];
  currentFontSize = size;
  let fsizedef = `:root {--default-ft-size: ${fontsize};}`;
  const styledef = document.getElementById('base-font-size-def') as HTMLElement;
  styledef.innerHTML = fsizedef;
  localStorage.setItem('base-fontsize', size);
};

/** post panel state */
let showPostPanel = $state(false);

export const getPostPanelState = () => {
  return showPostPanel;
};

export const setPostPanelState = (show: boolean) => {
  showPostPanel = show;
};

/** show preview or not */
let showPreview = $state(false);

export const getPreviewPanelState = () => {
  return showPreview;
};

export const setPreviewPanelState = (show: boolean) => {
  showPreview = show;
};

const initData: LoadedPostData = {
  title: "",
  date: "",
  description: "",
  postId: "",
  section: "",
  sitename: "",
  source: "",
  sourceDate: "",
  tags: [],
  thumbnail: "",
  url: "",
  fileDir: "",
  filePath: "",
  RawContent: "",
};

export const currentPostIns = new CurrentPost(initData);

export const clearCurrentPost = () => {
  currentPostIns.post = initData;
}