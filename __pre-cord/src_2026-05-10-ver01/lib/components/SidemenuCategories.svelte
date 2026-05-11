<script lang="ts">
  import { onMount } from "svelte";
  import { resolve } from '$app/paths';
  import type { LoadedSectionsData } from "$lib/types";
  import { setMenuState, setPostPanelState, clearCurrentPost } from "$lib/index.svelte";
  import { delTrSlash } from "$lib/utils/locationUtils";

  let sectionsData: LoadedSectionsData[] = $state([]);

  const baseUrl = delTrSlash(resolve('/'));

  onMount(async () => {
    const response = await fetch(`${baseUrl}/api/sections`);
    const data = await response.json();
    sectionsData = data;
  });

  const handleClick = (event: MouseEvent) => {
    setMenuState('N');
    setPostPanelState(false);
    clearCurrentPost();
  };

</script>

<div class="wrap-sidemenu">
  <div class="sidemenu-title bdr-btm">
    <h4 class="category-title top-title fs-x10">
      <span class="title-text">
        Category and Sections
      </span>
    </h4>
  </div>
  <div id="gotoAllPost" class="menu-item goto-all-post category-name">
    <!-- link for All Post -->
    <a href={`${baseUrl}/page/1`} 
      class="all-post-link bdr-btm" 
      onclick={(e) => handleClick(e)}>
      <h4 class="item-title">
        <span class="title-text">全ての記事</span>
      </h4>
    </a>
  </div>
  <ul class="resultList section-by-category-list">

    {#if sectionsData && sectionsData.length > 0}
      {#each sectionsData as category}
        {#if category.sections && category.sections.length > 0}
          <li id={category.id} class="category-name">
            <h4 class="category-title">
              <span class="title-text">{category.title}</span>
            </h4>
            <ul class="section-list">
              {#each category.sections as section}
                <li data-id={section.name} class="menu-item section-item">
                  <a href={`${baseUrl}/sections/${section.name}`} 
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
      padding: 4px 5px 10px;
      line-height: 1.8;

      @include mixin.hover-action {
        color: var(--link-color-hover);
      }

      h4.category-title {
        margin: 0;
        color: var(--ft-mid);
        text-align: center;
        .title-text {
          display: inline-block;
          margin-left: -0.4em;
        }
      }
    }

    .menu-item.goto-all-post {
      display: block;
      width: 100%;
      margin-top: 15px;
      padding: 0 0.3em;

      a.all-post-link {
        display: block;
        padding-left: 0.5em;
        margin: 10px 0 2px;
        font-size: 0.95rem;
        font-weight: normal;
        border-bottom: 3px dotted var(--thin-bdr);
        text-decoration: none;
        .item-title {
          color: var(--ft-mid);
        }

        @include mixin.hover-action {
          .item-title {
            color: var(--link-color-hover);
          }
        }
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