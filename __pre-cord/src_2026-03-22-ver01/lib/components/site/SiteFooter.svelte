<script lang="ts">
  import { default as config } from "$lib/app-config";
</script>

<div class="footer-body bdr-top ft-mid">
  <h5 class="site-desc fs-x07 ft-mid">
    {config.Site.description}
  </h5>
  <!-- Copyright -->
  <div class="copyright fs-x06 ft-mid">
    <span>&copy; {config.Site.copyright}</span>
    <span>Power by <a href="https://svelte.jp/" target="_blank" rel="noreferrer" class="">SvelteKit</a></span>
  </div>
</div>

<style lang="scss">
  @use '$lib/styles/scss-variables' as v;

  .footer-body {
    position: relative;
    left: 0;
    bottom: 0;
    width: calc(100% - 2% - 20px);
    height: #{v.$site_footer_h}px;
    margin: 0 auto;
    text-align: right;
    padding: 5px 10px;
    line-height: 1.6;

    .site-desc, .copyright {
      margin-top: 5px;
      margin-bottom: 5px;
    }
  }
</style>