<script lang="ts">
  import type { PageData } from "./$types";
  import PageHeader from "$lib/components/PageHeader.svelte";
  import PostList from "$lib/components/PostList.svelte";
  import NavPagination from "$lib/components/NavPagination.svelte";
  import SiteFooter from '$lib/components/site/SiteFooter.svelte';
  import PostPanel from "$lib/components/PostPanel.svelte";
  import TagFilter from "$lib/components/tags/TagFilter.svelte";

  const { data }: { data: PageData } = $props();

  let tagName = $derived(data.name);
  let pageNumber = $derived(data.number);
  let pageData = $derived(data.pageData);
  let pageInfo = $derived(pageData.pageinfo);

  $effect(() => {
    // console.log('Section Data: ', data);
    // console.log('in list/[num] pageNumber: ', tagName);
    // console.log('in list/[num] pageData: ', pageData);
    // console.log('A02 filteredTags: ', $state.snapshot(filteredTags));
  });

</script>

<div class="wrap-main-content">
  <header id="pageHeader" class="list-header">
    <PageHeader pageName={`Tag ${tagName} Page ${pageNumber}`} />
  </header>

  <!-- article list panel -->
  <article id="post-article" class="article post-article type-list">
    <section id="listSection" class="list-setion">
      <TagFilter pagePosts={pageData.posts} />
      <PostList pageData={pageData} pageType='tags' />
    </section>

    <NavPagination pageInfo={pageInfo} pathSegment={`/tags/${tagName}`} />

    <footer id="siteFooter" class="site-footer base-bg">
      <SiteFooter />
    </footer>
  </article>
</div>

<!-- post-panel -->
<section id="postPanel" class="post-panel base-bg">
  <PostPanel />
</section>

