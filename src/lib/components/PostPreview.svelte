<script module>
  let previewHtml = $state("");

  export const initPreview = () => {
    previewHtml = "";
  };
</script>

<script lang="ts">
  import { decodeEntities } from "$lib/utils/stringUtils";
  import { fixImageRelUrl } from "$lib/utils/locationUtils";
  import parseMd from '$lib/utils/parseMd';
  import { getCurrentPost } from "$lib/index.svelte";
  import { default as config } from '$lib/app-config';

  let { scrollTop }:
  { 
    scrollTop: Function; 
  } = $props();

  let archiveUrlBase = $state("");

  if (import.meta.env.MODE === 'production') {
    archiveUrlBase = `${config.JsonDataHostUrl.production}/${config.PostHtmlFilePath}`;
  } else {
    archiveUrlBase = `${config.JsonDataHostUrl.development}/${config.PostHtmlFilePath}`;
  }

  let post = $derived.by(() => {
    const currentPost = getCurrentPost();
    if (currentPost.available()) {
      return currentPost.post;
    }
  });

  let previewTitle = $state("");

  const readPreview = async () => {
    if (post && post.postId !== '') {
      previewTitle = decodeEntities(post.title);

      let postMdText = post.RawContent;
      if (postMdText) {
        postMdText = fixImageRelUrl(post.postId, postMdText, archiveUrlBase);
        previewHtml = await parseMd(postMdText);
      }
    }
  };

  $effect(() => {
    (async () => {
      await readPreview();
    })();
  });
</script>

<div class="post-md-preview">
  <div class="preview-title">
    <h2>{previewTitle}</h2>
  </div>

  {#if post}
  <p class="source-link">
    <span class="source-link-bracket">[</span>
    <a href={post.source} target="_blank" rel="noopener noreferrer">
      <span>{post.sitename}</span>
      {#if post.sourceDate !== ''}
      <span> : {post.sourceDate}</span>           
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
    <button onclick={(e) => scrollTop(e)} class="return-preview-top">
      <span class="arrow">⇧</span>
    </button>
  </div>

  {/if}
</div>


<style lang="scss">
  @use '$lib/styles/mixin.scss' as mixin;

  .post-md-preview {
    width: auto;
    max-width: 800px;
    height: auto;
    margin: 0 auto;
    padding-top: 0;
    padding-bottom: 5rem;
    font-size: 24px;
    line-height: 1.8;
    
    @include mixin.previewMarkdown;

    .preview-title {
      h2 {
        line-height: 1.4;
        font-size: 2.2rem;
        margin: 0.5em 0;
      }
    }
    .source-link {
      font-size: 1rem;
      margin: 0 1rem 0.5em;
    }

    .post-md-content {
      padding: 28px 0;
    }
  }

  #return-preview-top-btn {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: 20px;

    .return-preview-top {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 3rem;
      height: 3rem;
      border: 1px solid var(--thin-bdr);
      border-radius: 50%;
      text-align: center;
      padding: 8px 25px;

      .arrow {
        display: inline-block;
        position: relative;
        top: -1px;
        color: var(--ft-mid);
      }
    }
  }
</style>

