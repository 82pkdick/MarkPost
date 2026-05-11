<script lang="ts">
  import { onMount } from "svelte";
  import type { LoadedTagsData } from "$lib/types";
  import { setMenuState, setPreviewState } from "../../routes/+layout.svelte";

  let tagsData: LoadedTagsData[] = $state([]);

  onMount(async () => {
    const response = await fetch('/api/tags');
    const data = await response.json();
    tagsData = data;
  });

  const handleClick = (event: MouseEvent) => {
    setMenuState('N');
    setPreviewState(false);
  };
</script>

<div class="wrap-sidemenu">
  <a href="/" class="sidemenu-title bdr-btm">
    <h3 class="fs-x11">Tags</h3>
  </a>
  <ul class="resultList tags-list">
    {#if tagsData && tagsData.length > 0}
      {#each tagsData as tag}
        <li data-id={tag.name} class="menu-item tag-item">
          <a href={`/tags/${tag.name}`} 
            class="navigate-link-btn tag-link"
            onclick={(e) => handleClick(e)}>
            <span class="link-title">{tag.title}</span>
          </a>
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
      padding: 0 5px 8px;
      line-height: 1.8;
      color: var(--ft-mid);

      @include mixin.hover-action {
        color: var(--link-color-hover);
      }

      h3 {
        margin: 0;
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
      }
    }
  }
</style>
