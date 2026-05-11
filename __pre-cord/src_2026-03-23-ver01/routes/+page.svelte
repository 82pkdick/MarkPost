<script lang="ts">
  import type { PageData } from "./$types";
  import PageHeader from "$lib/components/PageHeader.svelte";
  import PostList from "$lib/components/PostList.svelte";
	import SiteFooter from '$lib/components/site/SiteFooter.svelte';
  import PostPanel from "$lib/components/PostPanel.svelte";

  const { data }: { data: PageData } = $props();

  // let pageNumber = $derived(data.number);
  let pageData = $derived(data.pageData);
  let numberOfPosts = $derived(pageData.pageinfo.NumberOfPosts);

  $effect(() => {
    // console.log('in list pageNumber: ', pageNumber);
    // console.log('in top pageData: ', pageData);
    // console.log('currentPostId: ', currentPostId);
  });
</script>

<div class="wrap-main-content">
  <header id="pageHeader" class="list-header">
    <PageHeader pageName={`First ${numberOfPosts} articles`} />
  </header>

  <!-- article list panel -->
  <article id="post-article" class="article post-article type-list">
    <section id="listSection" class="list-setion">
      <PostList pageData={pageData} pageType='page' />
    </section>

    <footer id="siteFooter" class="site-footer base-bg">
      <SiteFooter />
    </footer>
  </article>
</div>

<!-- post-panel -->
<section id="postPanel" class="post-panel base-bg">
  <PostPanel contentsDir={data.pathSettings.MdFilePath} />
</section>

