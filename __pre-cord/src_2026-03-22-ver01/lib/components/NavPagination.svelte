<script lang="ts">
  import type { PageInfo } from "$lib/types";
  import { default as config } from '$lib/app-config';
  import { resetTagFiltering } from "$lib/index.svelte";

  type PaginationProps = {
    pageInfo: PageInfo;
    pathSegment: string; 
  };

  let { pageInfo, pathSegment = '' }: PaginationProps = $props();

  $effect(() => {
    // console.log('pageInfo: ', $state.snapshot(pageInfo));
  });

  let pageLinks: { number: number; path: string }[] = $state([]);

  const shiftNumber = config.PaginationShiftNumber;

  let totalPages: number = $state(0);
  let prevUrl: string | null = $state("");
  let nextUrl: string | null = $state("");
  let firstUrl: string | null = $state("");
  let lastUrl: string | null = $state("");
  let currentPage: string | null = $state("");
  let pageNumber: number | null = $state(0);
  // let currentPageNumber: number | null = $state(0);

  const setPageInfos = () => {
    let {
      NextURL, 
      Pagenumber, 
      PrevURL, 
      TotalPages
    } = pageInfo;

    totalPages = parseInt(TotalPages, 10);
    pageNumber = parseInt(Pagenumber, 10)

    prevUrl = PrevURL ? `${pathSegment}/page/${(pageNumber - 1)}` : null;
    nextUrl = NextURL ? `${pathSegment}/page/${(pageNumber + 1)}` : null;
    firstUrl = `${pathSegment}/page/1`;
    lastUrl = `${pathSegment}/page/${totalPages}`;
    currentPage = `${pathSegment}/page/${pageNumber}`;
  };

  const setPageLinks = () => {
    const total = totalPages;
    let link = { number: 0, path: ""};
    const pageNumbers = Array(total).fill(1).map((_, i) => i+1);
    let links = pageNumbers.map((number, idx) => {
      link = { number: number, path: `${pathSegment}/page/${number}` };
      return link;
    });
    pageLinks = links;
  };

  $effect(() => {
    setPageInfos();
    setPageLinks();
  });

  const isOutSide = (number: number): boolean => {
    let current = pageNumber ?? 0;
    if (
      number < current - shiftNumber ||
      number > current + shiftNumber
    ) {
      return true;
    } else {
      return false;
    }
  };

  const isListFront = (number: number): boolean => {
    let current = pageNumber ? pageNumber : null;
    if (current && number === current - shiftNumber && number !== 1) {
      return true;
    } else {
      return false;
    }
  };

  const isListEnd = (number: number): boolean => {
    let current = pageNumber ? pageNumber : null;
    if (
      current &&
      number === current + shiftNumber &&
      number !== totalPages
    ) {
      return true;
    } else {
      return false;
    }
  };

  const handleClick = (event: MouseEvent) => {
    const elem = document.getElementById('pageHeader') as HTMLElement;
    elem.scrollIntoView({ behavior: "smooth", block: "start" });
    resetTagFiltering();
  };
</script>

<section id="navPagination" class="nav-pagination">
{#if totalPages > 1}
  <ul class="pagelist">
    <!-- first Page -->
    {#if firstUrl}
    <li class="pagelink nav-first {pageNumber === 1 ? 'disabled' : ''}">
      <a href={firstUrl} 
        class="navigate-link-btn page-link {pageNumber === 1 ? 'disabled' : ''}" onclick={(e) => handleClick(e)}>
        <span class="link-title">««</span>
      </a>
    </li>
    {/if}

    <!-- Previous Page -->
    <li class="pagelink nav-prev {prevUrl ? '' : 'disabled'}">
      <a href={prevUrl} class="navigate-link-btn page-link {prevUrl ? '' : 'disabled'}" onclick={(e) => handleClick(e)}>
        <span class="link-title">«</span>
      </a>
    </li>
    
    <!-- Each Page Number -->
    {#if pageLinks && pageLinks.length > 1}
      {#each pageLinks as pagelink, index}
        {@const isOutside = isOutSide(pagelink.number)}
        {#if isListFront(pagelink.number)}
          <li class="abbrev">...</li>
        {/if}
        <li class="pagelink nav-each-page 
          {isOutside ? 'outside' : ''} 
          {currentPage === pagelink.path ? 'active' : ''}"
          data-pageid={`page-${index + 1}`}
        >
          <a href={pagelink.path} 
            class="navigate-link-btn page-link {pageNumber === pagelink.number ? 'active' : ''}" 
            onclick={(e) => handleClick(e)}>
            <span class="link-title">{pagelink.number}</span>
          </a>
        </li>
        {#if isListEnd(pagelink.number)}
          <li class="abbrev">...</li>
        {/if}
      {/each}
    {/if}

    <!-- Next Page -->
    <li class="pagelink nav-next {nextUrl ? '' : 'disabled'}">
      <a href={nextUrl} class="navigate-link-btn page-link {nextUrl ? '' : 'disabled'}" onclick={(e) => handleClick(e)}>
        <span class="link-title">»</span>
      </a>
    </li>

    <!-- Last Page -->
    {#if lastUrl}
    <li class="pagelink nav-last {currentPage === lastUrl ? 'disabled' : ''}">
      <a href={lastUrl} class="navigate-link-btn page-link {currentPage === lastUrl ? 'disabled' : ''}" onclick={(e) => handleClick(e)}>
        <span class="link-title">»»</span>
      </a>
    </li>
    {/if}
  </ul>
{/if}
</section>

<style lang="scss">
  @use "$lib/styles/mixin.scss" as mixin;

  #navPagination {
    width: 100%;
    height: 4rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  ul.pagelist {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0;
    padding: 0;
    list-style-type: none;

    li.pagelink {
      &.nav-each-page.outside {
        display: none;
      }
      &.nav-each-page.active {
        pointer-events: none;
      }

      &.nav-first,
      &.nav-prev,
      &.nav-next,
      &.nav-last {
        display: inline-flex;
        align-items: center;
      }

      &.nav-first.disabled,
      &.nav-prev.disabled,
      &.nav-next.disabled,
      &.nav-last.disabled {
        pointer-events: none;
      }
    }

    li.abbrev {
      color: var(--abbrev-color);
      opacity: 0.7;
    }

    li.pagelink {
      .navigate-link-btn {
        color: var(--default-ft-color);
        text-decoration: none;
        background-color: transparent;

        &.page-link {
          border: none;
          background-color: transparent;
          padding: 5px 10px;

          color: var(--page-link-color);
          font-size: 1.3rem;
          @include mixin.hover-action {
            color: var(--page-link-hover-color);
            font-size: 1.5rem;
          }
        }

        &.page-link.disabled {
          color: var(--page-link-disabled-color);
          opacity: 0.7;
        }

        &.active {
          font-size: 1.5rem;
          color: var(--page-link-active-color);
        }

        .link-title {
          pointer-events: none;
        }
      }
    }
  }
</style>