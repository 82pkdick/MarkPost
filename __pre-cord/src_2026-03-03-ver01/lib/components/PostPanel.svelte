<script lang="ts">
  import type { LoadedPostData } from "$lib/types";
  import CloseIcon from '$lib/icons/close-icon.svelte';
  import ExternalLinkIcon from "$lib/icons/external-link-icon.svelte";
  import EditIcon from "$lib/icons/edit-icon.svelte";
  import { setPreviewState, getCurrentPostId, getCurrentPostData } from "../../routes/+layout.svelte";
  import parseMd from '$lib/utils/parseMd';
  import { getTimeStamp, fixImageRelUrl } from "$lib/utils/locationUtils";
  import { decodeEntities } from "$lib/utils/stringUtils";
  import { default as config } from '$lib/app-config';

  const closePreview = () => {
    setPreviewState(false);
  };

  let currentPostId = $derived(getCurrentPostId());
  let currentPostData: LoadedPostData | null = $state(null);

  // ---------------------------------------
  let previewTitle = $state("");
  let previewSourceUrl = $state("");
  let previewSitename = $state("");
  let previewSourceDate = $state("");
  let previewHtml = $state("");
  // ---------------------------------------

  let archiveUrl = $state("");
  let mdfilePath = $state("");
  const originalFileDir = config.PostsMarkdownFilePath;




  const readPreview = async () => {
    if (currentPostData) {
      const data = currentPostData;
    
      previewTitle = decodeEntities(data.title);
      previewSitename = data.sitename;
      previewSourceUrl = data.source;
      previewSourceDate = data.sourceDate;

      let postMdText = data.RawContent;
      postMdText = fixImageRelUrl(data.postId, postMdText);
      previewHtml = await parseMd(postMdText);
      const timestamp = getTimeStamp();

      archiveUrl = `${config.ArchiveBaseUrl}/${data.postId}/index.html?v=${timestamp}`;

      mdfilePath = `${originalFileDir}/${data.section}/${data.postId}/index.md`;
    }
    scrollPanelTop();
  };


  $effect(() => {
    if (currentPostId) {
      currentPostData = getCurrentPostData();
    }
  });

  let panelTop: HTMLElement | null = $state(null);

  const scrollPanelTop = () => {
    if (panelTop) {
      panelTop.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };


  $effect(() => {
    console.log('currentPostData: ', $state.snapshot(currentPostData));
    (async () => {
      await readPreview();
    })();
  });
</script>

<!-- Panel Header -->
<div id="postPanelHeader" class="post-panel-header bdr-btm">
  <div class="post-panel-header-rmod">
    <div class="post-panel-switch post-panel-close-button">
      <button
        type="button"
        class="post-panel-header-btn panel-close"
        onclick={closePreview}
      >
        <CloseIcon />
      </button>
    </div>
  </div>
  <div class="post-panel-header-lmod">
    <div class="post-panel-switch open-preview-external">
      <a target="_blank" rel="noopener noreferrer" href={archiveUrl}>
        <ExternalLinkIcon />
      </a>
    </div>
    <div class="post-panel-switch edit-post">
      <a href={`vscode://file${mdfilePath}`}>
        <EditIcon />
      </a>
    </div>
  </div>
</div>

<!-- Panel Body -->
<div id="postPanelBody" class="post-panel-body">
  <div id="previewTop" bind:this={panelTop}></div>

  <!-- Edit Panel -->
  <div id="editPanel" class="edit-panel">

  </div>

  <!-- Preview Panel -->
  <div id="previewPanel" class="preview-panel">

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

  </div>
</div>

<style lang="scss">
  @use '$lib/styles/scss-variables' as v;
  @use '$lib/styles/mixin.scss' as mixin;

  .post-panel-header {
    position: sticky;
    top: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 38px;
    margin-top: 4px;
    padding-right: 10px;
    padding-bottom: 3px;
    z-index: 1000;

    .post-panel-switch {
      width: 36px;
      height: 35px;
      display: inline-flex;
      justify-content: center;
      align-items: flex-start;

      .post-panel-header-btn {
        margin-left: 4px;
        padding: 2px;
        border: none;
        background-color: transparent;
        text-align: center;
      }
    }

    .post-panel-header-lmod {
      display: inline-flex;
      justify-content: flex-end;
      align-items: center;
    }
  }

  .post-panel-body {
    --offset: 15px;
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    height: calc(
      100svh -
        (#{v.$site_header_h}px + #{v.$postpanel_header_h}px + var(--offset))
    );
    margin: 0;
    padding: 28px calc(3.5vw - 8px) 30px 4vw;
    overflow-x: hidden;
    overflow-y: auto;
    box-sizing: border-box;

    #previewTop {
      position: absolute;
      top: 0;
    }

    #editPanel {
      display: none;
    }

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
  }
</style>