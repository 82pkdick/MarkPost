<script module>
  import { handleInputClear } from "$lib/components/AddArticle.svelte";
  let showInputPanel = $state(false);

  export const tglInputPanelState = () => {
    showInputPanel = !showInputPanel;
    if (!showInputPanel) {
      handleInputClear();
    }
  };
</script>

<script lang="ts">
  import type { PageData } from "./$types";
  import PageHeader from "$lib/components/PageHeader.svelte";
  import PostList from "$lib/components/PostList.svelte";
	import SiteFooter from '$lib/components/site/SiteFooter.svelte';
  import PostPanel from "$lib/components/PostPanel.svelte";
  import AddArticle from "$lib/components/AddArticle.svelte";

  const { data }: { data: PageData } = $props();

  let pageData = $derived(data.pageData);
  let numberOfPosts = $derived(pageData.pageinfo.NumberOfPosts);

  $effect(() => {
    // console.log('in list pageNumber: ', pageNumber);
    // console.log('in top pageData: ', pageData);
    // console.log('currentPostId: ', currentPostId);
  });
</script>

<div class="wrap-main-content">
  <div class="wrap-add-article flex-r-center {showInputPanel ? "expand" : ""}">
    <AddArticle />
  </div>

  <header id="pageHeader" class="list-header">
    <PageHeader pageName={`Recent ${numberOfPosts} articles`} />
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

<style lang="scss">
  @use "$lib/styles/scss-variables" as v;

  $switchingPoint: v.$TabletSize;
  $minsize: v.$MobileSize;

  .wrap-add-article {
    visibility: hidden;
    width: 0;
    height: 0;
    margin: 0;
    transform: translateY(-100%);
    transition: transform 0.3s ease-in-out;
  }

  .wrap-add-article.expand {
    visibility: visible;
    position: relative;
    width: auto;
    height: auto;
    margin: 25px 20px -20px auto;
    transform: translateY(0);
    transition: transform 0.3s ease-in-out;
  }

  @media only screen and (max-width: $switchingPoint) {
    .wrap-add-article.expand {
      margin: 28px 15px 0 auto;
    }
  }

  @media only screen and (max-width: $minsize) {
    .wrap-add-article.expand {
      margin: 28px 15px 0 1.0em;
    }
  }
</style>