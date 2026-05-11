/**
 * State of Current Post Class
 */
import { resolve } from '$app/paths';
import type { LoadedPostData } from "./types";
import { setCurrentPostUpdateState } from "./index.svelte";

const base = resolve('/');

class CurrentPost {
  #post = $state({} as LoadedPostData);
  #pid = $state('');
  #newSection = $state('');

  constructor(data: LoadedPostData) {
    this.#post = data;
    this.#pid = data.postId;
    this.#newSection = '';
  }

  get post() {
    return this.#post;
  }

  set post(data: LoadedPostData) {
    this.#post = { ...data };
  }

  get pid() {
    return this.#pid;
  }

  set pid(pid: string) {
    this.#pid = pid;
  }

  get title() {
    return this.#post.title;
  }

  get date() {
    return this.#post.date;
  }

  get description() {
    return this.#post.description;
  }

  get section() {
    return this.#post.section;
  }

  set section(name: string) {
    this.#post = { ...this.#post, section: name };
  }

  get source() {
    return this.#post.source;
  }

  set source(url: string) {
    this.#post = { ...this.#post, source: url };
  }

  get sitename() {
    return this.#post.sitename;
  }

  set sitename(name: string) {
    this.#post = { ...this.#post, sitename: name };
  }

  get sourceDate() {
    return this.#post.sourceDate;
  }

  set sourceDate(d: string) {
    this.#post = { ...this.#post, sourceDate: d };
  }

  get tags() {
    return this.#post.tags;
  }

  get newSection() {
    return this.#newSection;
  }

  set newSection(newsec: string) {
    this.#newSection = newsec;
  }

  hasNewSection() {
    if (this.#newSection !== '' && this.#post.section !== this.#newSection) {
      return true;
    } else {
      return false;
    }
  }

  // set tags(newTags) {
  //   this.#post = { ...this.#post, tags: newTags };
  // }

  // タグ名の重複回避
  #isSame(name: string) {
    if (name === "" || !name) {
      return;
    }
    const data = this.#post.tags as string[];
    const tags = $state.snapshot(data);
    return tags && tags.includes(name);
  }

  setPostTags(tagData: string[] = []) {
    // this.#post.tags = tagData;
    this.#post = { ...this.#post, tags: tagData };
  }

  // タグの削除
  deleteTag(title: string) {
    // タグデータの更新
    const tags = this.#post.tags as string[];
    let newTags = tags.filter((tag) => {
      if (tag !== title) {
        return tag;
      }
    });

    this.setPostTags(newTags);
  }

  addTag(newtag: string) {
    if (newtag === "") {
      return;
    }
    let tagsUpdated: string[] = this.#post.tags;

    if (!this.#isSame(newtag)) {
      // this.#post.tags?.push(newtag);
      tagsUpdated.push(newtag);
      this.setPostTags(tagsUpdated);
      setCurrentPostUpdateState({ result: true, message: 'success' })
      return true;
    } else {
      const errorMsg = `The tag ${newtag} is already registered`;
      console.error(errorMsg);
      setCurrentPostUpdateState({ result: false, message: errorMsg });
      return false;
    }
  }

  clearTags() {
    this.#post.tags = [];
  }

  get thumbnail() {
    return this.#post.thumbnail;
  }

  get url() {
    return this.#post.url;
  }

  get postType() {
    return this.#post.postType;
  }

  get videoUrl() {
    return this.#post.videoUrl;
  }

  get movieArchive() {
    return this.#post.movieArchive;
  }

  get fileDir() {
    return this.#post.fileDir;
  }

  get filePath() {
    return this.#post.filePath;
  }

  get content() {
    return this.#post.RawContent;
  }

  available() {
    const pid = this.#post.postId;
    if (pid && pid !== '') {
      return true;
    } else {
      return false;
    }
  }

  async loadData(postId: string) {
    this.#pid = postId;

    try {
      const response = await fetch(`${base}api/post/${postId}`);
      const data = await response.json();

      this.#post = { ...this.#post, ...data };
      this.#pid = this.#post.postId;

      return this;
    } catch (error) {
      console.error(`${error}`);
    }
  }
}

export default CurrentPost;