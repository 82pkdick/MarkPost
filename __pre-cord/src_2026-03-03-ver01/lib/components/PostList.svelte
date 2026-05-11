<script lang="ts">
  import type { LoadedPageData } from "$lib/types";
  import PostCard from "./PostCard.svelte";

  let { pageData }: { pageData: LoadedPageData } = $props();

</script>

<ul id="resultRoot" class="scrap-list base-bg-front">
  {#each pageData.posts as post }
  <li class="post-card post-card-item base-bg-front bdr drop-shadow">
    <PostCard post={post} />
  </li>
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
  }
</style>