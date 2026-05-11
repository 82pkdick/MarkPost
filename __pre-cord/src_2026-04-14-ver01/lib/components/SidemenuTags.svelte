<script lang="ts">
  import { onMount } from "svelte";
  import { resolve } from '$app/paths';
  import type { LoadedTagsData } from "$lib/types";
  import { setMenuState, setPostPanelState, getEditorMode, getCurrentPost, clearCurrentPost, resetTagFiltering } from "$lib/index.svelte";
  import { keepTagInputPosition } from "./PostEditor.svelte";
  import { delTrSlash } from "$lib/utils/locationUtils";

  let tagsData: LoadedTagsData[] = $state([]);

  let editorMode = $derived(getEditorMode());

  const baseUrl = delTrSlash(resolve('/'));

  onMount(async () => {
    const response = await fetch(`${baseUrl}/api/tags`);
    const data = await response.json();
    tagsData = data;
  });

  const handleClick = (event: MouseEvent) => {
    setMenuState('N');
    setPostPanelState(false);
    clearCurrentPost();
    resetTagFiltering();
  };

  const addNewTag = async (event: MouseEvent, title: string) => {
    event.preventDefault();
    let currentPost = getCurrentPost();
    let postId = currentPost.pid;
    if (!postId) {
      // postId が未定（データ入力前）なら実行しない
      return;
    }
    currentPost.addTag(title);
    keepTagInputPosition();
  };

  $effect(() => {
    // console.log('editorMode: ', editorMode);
  });
</script>

<div class="wrap-sidemenu">
  <a href="/" class="sidemenu-title bdr-btm">
    <h4 class="tag-title fs-x10">
      <span class="title-text">Tags</span>
    </h4>
  </a>
  <ul class="resultList tags-list">
    {#if tagsData && tagsData.length > 0}
      {#each tagsData as tag}
        <li data-id={tag.name} class="menu-item tag-item">
        {#if editorMode}
          <button
          type="button"
          class="add-tag-btn linklike fs-x10"
          onclick={(e) => addNewTag(e, tag.title)}
          >
            <i class="hashtag">&#x266f;</i>
            <span class="tagname">{tag.title}</span>
          </button>
        {:else}
          <a href={`${baseUrl}/tags/${tag.name}`} 
            class="navigate-link-btn tag-link"
            onclick={(e) => handleClick(e)}>
            <span class="link-title">{tag.title}</span>
          </a>
        {/if}
        </li>
      {/each}
    {/if}
  </ul>
</div>

<style lang="scss">
  @use "$lib/styles/mixin.scss" as mixin;

  .wrap-sidemenu {
    display: block;
    height: inherit;
    margin-top: -6px;
    padding-bottom: 100px;

    .sidemenu-title {
      display: block;
      margin: 3px 0 0;
      padding: 4px 5px 10px;
      line-height: 1.8;

      @include mixin.hover-action {
        color: var(--link-color-hover);
      }

      h4.tag-title {
        margin: 0;
        // font-size: 0.9rem;
        color: var(--ft-mid);
        text-align: center;
        .title-text {
          display: inline-block;
          margin-left: -0.5em;
        }
      }
    }

    .resultList.tags-list {
      display: block;
      width: 100%;
      height: auto;
      margin: 5px 0;
      list-style-type: none;
      font-size: 1.1rem;
      line-height: 1.7;
      padding: 10px 5px 100px 0.5rem;

      .tag-item {
        padding: 1px 0.5em 0;
        margin-right: 0.5em;
        line-height: 2.0;

        .add-tag-btn {
          width: 100%;
          padding: 0;
        }
      }
    }
  }
</style>
