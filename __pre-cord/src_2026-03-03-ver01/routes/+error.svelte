<script lang="ts">
  import { page } from "$app/state";
  import SiteFooter from '$lib/components/SiteFooter.svelte';
</script>

<main id="mainContent" class="main-content base-bg">

  <article id="post-article" class="article post-article type-error">

    <section class="section-error-content">
      <div class="error-content">
        <h2 class="error-status ft-mid">{page.status}</h2>
        <h2 class="error-message ft-mid">{page.error?.message}</h2>
      </div>
    </section>

    <footer id="siteFooter" class="site-footer base-bg">
      <SiteFooter />
    </footer>
  </article>

</main>

<style lang="scss">
  @use '$lib/styles/scss-variables' as v;

  .article.type-error {
    .section-error-content {
      height: calc(90vh - #{v.$site_header_h}px - #{v.$site_footer_h}px);
      .error-content {
        width: auto;
        max-width: 70%;
        margin: 5% auto;
        h2 {
          font-size: 1.3rem;
          text-align: center;
        }
      }
    }
  }
</style>