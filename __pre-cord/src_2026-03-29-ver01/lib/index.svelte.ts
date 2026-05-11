import { resolve } from '$app/paths';
import type { LoadedPostData } from "./types";
import type { responseResult } from "$lib/types";
import { delTrSlash } from './utils/locationUtils';
import {default as config} from "$lib/app-config";
import CurrentPost from "./CurrentPostState.svelte";

/** side menu state */
let menuState = $state('N');

const baseUrl = delTrSlash(resolve('/'));

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

/** editor mode */
let editorMode = $state(false);

export const getEditorMode = () => {
  return editorMode;
};

export const setEditorMode = (state: boolean) => {
  editorMode = state;
};


/** thumnail path */
export const getThumbnailPath = (post: LoadedPostData) => {
  let postid = '';
  let thumb = '';
  let thumbUrl = '';

  if (post) {
    postid = post.postId;
    thumb = post.thumbnail;
  }

  if (postid && postid !== '' && thumb && thumb !== '') {
    let thumbUrlBase = '';
    if (import.meta.env.MODE === 'production') {
      thumbUrlBase = `${config.JsonDataHostUrl.production}/${config.PostThumbnailsBasePath}`;
    } else {
      thumbUrlBase = `${config.JsonDataHostUrl.development}/${config.PostThumbnailsBasePath}`;
    }

    const thumbName = thumb.replace(/(\.\/)?_resources\//, '');
    thumbUrl = `${thumbUrlBase}/${postid}/${thumbName}`
  } else {
    thumbUrl = `${baseUrl}/${config.ThumbnailSubImage}`;
  }

  return thumbUrl;
};

/** current post data */
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

export const getPostInitData = () => {
  return initData;
};

const currentPostIns = new CurrentPost(initData);

export const getCurrentPost = () => {
  return currentPostIns;
};

export const setCurrentPost = async (postId: string) => {
  const dataIns = await currentPostIns.loadData(postId);
  return dataIns;
};

export const clearCurrentPost = () => {
  currentPostIns.post = initData;
  currentPostIns.pid = '';
}

export const fixSendPostData = (data: LoadedPostData) => {
  const { 
    title, 
    date, 
    description, 
    postId, 
    section, 
    sitename, 
    source, 
    sourceDate, 
    tags, 
    thumbnail, 
    url, 
    postType,
    videoUrl,
    movieArchive,
    fileDir, 
    filePath 
  } = data;

  const currentPost = getCurrentPost();
  let newSection = '';
  if (currentPost.hasNewSection()) {
    newSection = currentPost.newSection;
  }

  const sendData = {
    title: title, 
    date: date, 
    description: description, 
    postId: postId, 
    section: section, 
    sitename: sitename,
    source: source, 
    sourceDate: sourceDate, 
    tags: tags, 
    thumbnail: thumbnail, 
    url: url,
    postType: postType,
    videoUrl: videoUrl,
    movieArchive: movieArchive,
    fileDir: fileDir, 
    filePath: filePath,
    newSection: newSection,
  };
  return sendData;
};

/**
 * postUpdateState: Success or failure of the post update.
 * postUpdateMessage: Post Update Message.
 */
let postUpdateState = $state(true);
let postUpdateMessage = $state('');

export const setCurrentPostUpdateState = ({ result, message }
  : {result: boolean, message: string}) => {
  postUpdateState = result;
  postUpdateMessage = message;
};

export const getCurrentPostMessage = () => {
  return { result: postUpdateState, message: postUpdateMessage };
};

/**
 *  ------ tag filter state -----------------------------
 */

let inFiltering = $state(false);

let filteredTags: string[] = $state([]);

export const getTagFilterState = () => {
  return {
    inFiltering: inFiltering,
    filteredTags: filteredTags
  }
};

export const filterTag = (selectedTag: string) => {
  if (!filteredTags.includes(selectedTag)) {
    filteredTags = [...filteredTags, selectedTag];
  }
  inFiltering = true;
};

export const isFiltered = (post: LoadedPostData) => {
  if (!inFiltering) {
    return true;
  } else {
    return filteredTags.every((tag) => post.tags.includes(tag));
  }
};

export const resetTagFiltering = () => {
  inFiltering = false;
  filteredTags = [];
};

/**
 * ---------- update resource data ----------
 */
export const updateResourceData = async () => {
  //--- api url of update resources data
  const updateResourcesUrl = `${baseUrl}/api/data-update`;

  const updateResponse = await fetch(updateResourcesUrl);
  const updateResult: responseResult = await updateResponse.json();
  return updateResult;
};

//** --- rebuild single post archive --- */
export const updateOnePostArchive = async () => {
  const currentPost = getCurrentPost();
  const postId = currentPost.post.postId;
  let sectionPath = '';
  if (currentPost.hasNewSection()) {
    sectionPath = currentPost.newSection;
  } else {
    sectionPath = currentPost.section;
  }

  const updateArchiveUrl = `${baseUrl}/api/archive/${sectionPath}/${postId}`;

  const updateRequest = new Request(updateArchiveUrl, {
    method: 'PUT',
    headers: { "Content-Type": "application/json" },
  });

  const updateAcvResponse = await fetch(updateRequest);

  const updateAcvResult: responseResult = await updateAcvResponse.json();

  return updateAcvResult;
};


// ------------------- 廃止 -------------------------
/** --- build new single post archive --- */
export const createNewPostArchive = async () => {
  const createArchiveUrl = `${baseUrl}/api/archive/new`;

  const createdRequest = new Request(createArchiveUrl);
  const newAcvResponse = await fetch(createdRequest);

  const newAcvResult: responseResult = await newAcvResponse.json();
  return newAcvResult;
};
// ---------------------------------------------------

/** --- delete single post archive html file --- */
export const deleteOnePostArchive = async (pid: string) => {
  const deleteArchiveUrl = `${baseUrl}/api/archive/notrequired/${pid}`;

  const deleteRequest = new Request(deleteArchiveUrl, {
    method: 'DELETE',
    headers: { "Content-Type": "application/json" },
  });

  const deleteAcvResponse = await fetch(deleteRequest);

  const deleteAcvResult: responseResult = await deleteAcvResponse.json();

  return deleteAcvResult;
};

//** --- rebuild all post archives --- */
export const renderPostArchiveAll = async () => {
  const url = `${baseUrl}/api/archive`;

  const response = await fetch(url);

  const result: responseResult = await response.json();

  return result;
};