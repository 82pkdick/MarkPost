<script lang="ts">

</script>

<div class="post-md-preview">
  <div class="preview-title">
    <h2>{previewTitle}</h2>
  </div>

  <p class="source-link">
    <span class="source-link-bracket">[</span>
    <a href={previewSourceUrl} target="_blank" rel="noopener noreferrer">
      <span>{previewSitename}</span>
      {#if previewSourceDate !== ''}
      <span> : {previewSourceDate}</span>           
      {/if}
    </a>
    <span class="source-link-bracket">]</span>
  </p>

  <hr />

  <div class="post-md-content">
    {@html previewHtml}
  </div>

  <hr />

  <div id="return-preview-top-btn">
    <button onclick={scrollPanelTop} class="return-preview-top">
      <span class="arrow">⇧</span>
    </button>
  </div>
</div>