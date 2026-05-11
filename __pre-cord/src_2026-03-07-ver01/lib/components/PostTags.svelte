<script lang="ts">
import type { TagItem } from "$lib/types";
import { currentPostIns as currentPost } from "$lib/index.svelte";
import OneTag from "./OneTag.svelte";
import PutNewTag from "./PutNewTag.svelte";

// 文字列の配列としてのページタグ
let pageTags: string[] = $state([]);

const setPageTags = () => {
  let postTags = currentPost.tags;

  if (postTags && postTags.length > 0) {
    pageTags = postTags;
  } else {
    pageTags = [];
  }
};

$effect(() => {
  setPageTags();
});

const addPageTag = (newtag: string) => {
  let postId = currentPost.pid;
  if (!postId) {
    // postId が未定（データ入力前）なら実行しない
    return;
  }
  currentPost.addTag(newtag);
  setPageTags();
};

const deleteTag = (name: string) => {
  let postId = currentPost.pid;
  if (!postId) {
    // postId が未定（データ入力前）なら実行しない
    return;
  }
  currentPost.deleteTag(name);
  setPageTags();
};
</script>

<ul id="pageTagList" class="page-taglist">
  {#if pageTags && pageTags.length > 0}
    {#each pageTags as tag, index}
      <OneTag {tag} {index} delHandler={deleteTag} />
    {/each}
  {/if}
</ul>
<input type="hidden" name="tags" id="postTags" bind:value={pageTags} />

<PutNewTag addHandler={addPageTag} />

<style lang="scss">
  .page-taglist {
    list-style: none;
    display: inline-flex;
    flex-flow: row wrap;
    align-content: flex-start;
    width: auto;
    min-width: 8rem;
    min-height: 48px;
    margin: 0 0 10px;
    padding: 8px 0.5rem 4px;
    background-color: var(--form-parts-bg);
    border: none;
    border-radius: 4px;
  }
</style>