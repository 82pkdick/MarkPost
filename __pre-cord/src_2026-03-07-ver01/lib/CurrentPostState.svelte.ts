/**
 * State of Current Post Class
 */
import type { LoadedPostData } from "./types";

class CurrentPost {
  #post = $state({} as LoadedPostData);
  #pid = $state('');

  constructor(data: LoadedPostData) {
    this.#post = data;
    this.#pid = data.postId;
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
    } else {
      console.error(`The tag ${newtag} is already registered`);
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

  get fileDir() {
    return this.#post.fileDir;
  }

  get filePath() {
    return this.#post.filePath;
  }

  get content() {
    return this.#post.RawContent;
  }

  async loadData(pid: string) {
    this.#pid = pid;

    try {
      const response = await fetch(`/api/post/${pid}`);
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