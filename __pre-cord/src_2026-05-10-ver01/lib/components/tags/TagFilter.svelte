<script lang="ts">
import type { PostData } from "$lib/types";
import { filterTag, resetTagFiltering } from "$lib/index.svelte";

interface TagFilterProps {
  pagePosts: PostData[];
}

let { pagePosts }: TagFilterProps = $props();

let postList: PostData[] = $state([]);

let tagsInPage: string[] = $state([]);

const setTagsInPage = (list: PostData[]) => {
  let tags_temp: string[] = [];
  list.forEach((post) => {
    tags_temp = [...tags_temp, ...post.tags];
  });
  tagsInPage = [...new Set(tags_temp)];
};

$effect.pre(() => {
  setTagsInPage(pagePosts);
  postList = [];
});

export const initFilter = () => {
  postList = pagePosts;
  setTagsInPage(pagePosts);
  resetTagFiltering();
};

const applyFilter = (tag: string) => {
  let list = [];
  if (postList.length < 1) {
    list = pagePosts;
  } else {
    list = postList;
  }
  let new_list = list.filter((post) => {
    return post.tags.includes(tag);
  });
  postList = [...new_list];
  setTagsInPage(postList);
  filterTag(tag);
};

const handleFilterClear = () => {
  initFilter();
};
</script>

{#if pagePosts.length > 1}
<details class="tag-filter-wrap">
  <summary class="tag-filter-title ft-mid">Tag Filter</summary>
  <div class="clear-tagfilter thin-bdr">
    <button
      type="button"
      class="clear-tagfilter-btn"
      onclick={handleFilterClear}
    >
      Clear Filter
    </button>
  </div>
  <div id="tagFilter" class="tag-filter">
    {#if tagsInPage && tagsInPage.length > 0}
      <ul class="taglist-for-tagfilter">
        {#each tagsInPage as tag}
          <li class="item-tag-title thin-bdr">
            <button
              type="button"
              class="tagfilter-btn"
              onclick={() => applyFilter(tag)}
            >
              {tag}
            </button>
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</details>
{/if}


<style lang="scss">
  @use '$lib/styles/scss-variables' as v;
  @use '$lib/styles/mixin' as mixin;

  details.tag-filter-wrap {
    position: relative;
    width: 92%;
    margin: 16px 5% 10px 3%;
    summary.tag-filter-title {
      padding-left: 1.5em;
      list-style: none;
      cursor: pointer;
      &::before {
        content: "□";
        position: absolute;
        top: 14px;
        left: 0;
        transform: translateY(-50%) rotate(0deg);
        transition: transform 0.3s ease;
      }
    }
    &::details-content {
      height: 0;
      overflow: clip;
      opacity: 0;
      transition:
        height 0.3s ease,
        opacity 0.3s ease,
        content-visibility 0.3s ease allow-discrete;
    }
    &[open]::details-content {
      height: auto; /* for unsupported browser */
      height: calc-size(auto, size);
      opacity: 1;
    }
    &[open] summary.tag-filter-title::before {
      content: "■";
      color: var(--link-color-active);
      transform: translateY(-50%) rotate(45deg);
    }
    .clear-tagfilter {
      position: absolute;
      top: -15px;
      right: 0;
      border-radius: 8px;
      @include mixin.hover-action {
        background-color: var(--selection-bg);
      }
      .clear-tagfilter-btn {
        margin: 0;
        padding: 10px 12px;
        @include mixin.hover-action {
          background-color: var(--selection-bg);
        }
      }
      @media only screen and (max-width: v.$TabletSize) {
        top: -10px;
        .clear-tagfilter-btn {
          margin: 0;
          padding: 8px 32px;
          font-size: 0.9rem 16.2px;
        }
      }
    }
    .tag-filter {
      .taglist-for-tagfilter {
        position: relative;
        top: 0;
        left: 0;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-wrap: wrap;
        margin: 12px 0.5rem 3px;

        .item-tag-title {
          width: fit-content;
          margin: 3px 10px;
          border-radius: 5px;
          @include mixin.hover-action {
            background-color: var(--focus-bg);
          }
          .tagfilter-btn {
            margin: 0;
            padding: 3px 12px 4px;
            @include mixin.hover-action {
              background-color: var(--focus-bg);
            }
          }
        }
      }
    }
  }
</style>