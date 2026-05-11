<script lang="ts">
  import { onMount } from "svelte";
  import type { LoadedSectionsData } from "$lib/types";
  import { setMenuState, setPostPanelState } from "$lib/index.svelte";

  let sectionsData: LoadedSectionsData[] = $state([]);

  onMount(async () => {
    const response = await fetch('/api/sections');
    const data = await response.json();
    sectionsData = data;
  });

  const handleClick = (event: MouseEvent) => {
    setMenuState('N');
    setPostPanelState(false);
  };

</script>

<div class="wrap-sidemenu">
  <a href="/" class="sidemenu-title bdr-btm">
    <h3 class="fs-x11">Category and Sections</h3>
  </a>
  <ul class="resultList section-by-category-list">
    {#if sectionsData && sectionsData.length > 0}
      {#each sectionsData as category}
        {#if category.sections && category.sections.length > 0}
          <li id={category.id} class="category-name">
            <h4 class="category-title">{category.title}</h4>
            <ul class="section-list">
              {#each category.sections as section}
                <li data-id={section.name} class="menu-item section-item">
                  <a href={`/sections/${section.name}`} 
                    class="navigate-link-btn section-link"
                    onclick={(e) => handleClick(e)}>
                    <span class="link-title">{section.title}</span>
                  </a>
                </li>
              {/each}
            </ul>
          </li>
        {/if}
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

    .resultList.section-by-category-list {
      display: block;
      width: 100%;
      height: 100%;
      list-style-type: none;
      font-size: 1rem;
      line-height: 2;
      padding: 0 5px;

      ul {
        list-style-type: none;
      }

      .category-name {
        .category-title {
          padding-left: 0.3em;
          margin: 10px 0 2px;
          font-size: 0.95rem;
          font-weight: normal;
          color: var(--ft-mid);
          border-bottom: 3px dotted var(--thin-bdr);
        }

        .section-list {
          padding-left: 1rem;
        }
      }
    }

  }

</style>