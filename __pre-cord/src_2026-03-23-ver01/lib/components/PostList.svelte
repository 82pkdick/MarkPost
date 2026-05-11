<script lang="ts">
  import type { LoadedPageData } from "$lib/types";
  import PostCard from "./PostCard.svelte";
  import { getCurrentPost, isFiltered } from "$lib/index.svelte";

  interface PostListProps {
    pageData: LoadedPageData;
    pageType: string;
  }

  let { pageData, pageType = '' }: PostListProps = $props();

  let currentPostId = $derived(getCurrentPost().pid);
</script>

<ul id="resultRoot" class="scrap-list base-bg-front">
  {#each pageData.posts as post }
  {#if pageType === 'tags'}
  <li class="post-card post-card-item base-bg-front bdr drop-shadow
    {(currentPostId === post.postId) ? 'current' : ''}
    {isFiltered(post) ? '' : 'filtered'}">
    <PostCard post={post}>
      <span></span>
    </PostCard>
  </li>
  {:else}
  <li 
    class="post-card post-card-item base-bg-front bdr drop-shadow
    {(currentPostId === post.postId) ? 'current' : ''}">
    <PostCard post={post}>
      <span></span>
    </PostCard>
  </li>
  {/if}
  {/each}
</ul>

<style lang="scss">
  .post-card {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: subgrid;
    grid-row: span 2;
    row-gap: 0;
    position: relative;
    height: auto;
    min-height: 145px;
    max-height: 200px;
    padding: 10px 0.3em 5px;
    border-radius: 3px;
    overflow: hidden;

    &.filtered {
      display: none;
    }

    &.current {
      background-color: var(--current-card-bg);
    }
  }
</style>