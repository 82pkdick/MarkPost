<script lang="ts">
  import { resolve } from '$app/paths';
  import { onMount } from "svelte";
  import CloseIcon from '$lib/icons/close-icon.svelte';
  import EditPropsIcon from "$lib/icons/edit-props-icon.svelte";
  import PreviewIcon from "$lib/icons/preview-icon.svelte";
  import ExternalLinkIcon from "$lib/icons/external-link-icon.svelte";
  import EditIcon from "$lib/icons/edit-icon.svelte";
  import { 
    setPreviewPanelState, 
    getPreviewPanelState,
  } from "$lib/index.svelte";
  import { getTimeStamp } from "$lib/utils/locationUtils";
  import { default as config } from '$lib/app-config';
  import PostPreview, { initPreview } from "$lib/components/PostPreview.svelte";
  import PostEditor from "$lib/components/PostEditor.svelte";
  import { 
    setPostPanelState, 
    setMenuState, 
    getCurrentPost, 
    clearCurrentPost, 
    setEditorMode, 
    getEditorMode 
  } from "$lib/index.svelte";

  const { contentsDir }: { contentsDir: string } = $props();

  let editorMode = $derived(getEditorMode());

  const base = resolve('/');

  // 初期表示はプレヴュー
  onMount(() => {
    setPreviewPanelState(true);
    setEditorMode(false);
  });

  const closePreview = () => {
    setPostPanelState(false);
    initPreview();
    clearCurrentPost();
    setEditorMode(false);
    setMenuState('N');
  };

  const openEditPropsPanel = () => {
    setPreviewPanelState(false);
    setEditorMode(true);
  };

  const openPreviewPanel = () => {
    setPreviewPanelState(true);
    setEditorMode(false);
  };

  let archiveUrl = $state("");
  let mdfilePath = $state("");

  let previewState = $derived(getPreviewPanelState());

  const setArchiveUrl = () => {
    const  currentPost = getCurrentPost();
    if (currentPost.available()) {
      const data = currentPost.post;
    
      const timestamp = getTimeStamp();
      archiveUrl = `${base}${config.ArchiveBaseUrl}/${data.postId}/index.html?v=${timestamp}`;
      mdfilePath = `${contentsDir}/${data.section}/${data.postId}/index.md`;
    }
    scrollPanelTop();
  };

  let panelTop: HTMLElement | null = $state(null);

  const scrollPanelTop = () => {
    if (panelTop && !editorMode) {
      panelTop.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  $effect(() => {
    setArchiveUrl();
    // console.log('EditorMode: ', getEditorMode());
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
  <div class="post-panel-header-centermod">
    <div class="post-panel-switch post-panel-toggle-button">
      <button
        type="button"
        class="post-panel-header-btn switch-editor {editorMode ? 'active' : ''}"
        onclick={openEditPropsPanel}
      >
        <EditPropsIcon />
      </button>
      <button
        type="button"
        class="post-panel-header-btn switch-preview {editorMode ? '' : 'active'}"
        onclick={openPreviewPanel}
      >
        <PreviewIcon />
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
<div id="postPanelBody" class="post-panel-body {previewState ? 'show-preview' : ''}">
  <div id="previewTop" bind:this={panelTop}></div>

  <!-- Edit Panel -->
  <div id="editPanel" class="edit-panel">
    <PostEditor />
  </div>

  <!-- Preview Panel -->
  <div id="previewPanel" class="preview-panel">
    <PostPreview scrollTop={scrollPanelTop} />
  </div>
</div>

<style lang="scss">
  @use '$lib/styles/scss-variables' as v;
  @use '$lib/styles/mixin.scss' as mixin;

  $switchingPoint: v.$TabletSize;

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

    .post-panel-header-centermod {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      position: relative;
      top: 0;
      left: 8px;

      .post-panel-switch.post-panel-toggle-button {
        width: 150px;
        display: inline-flex;
        justify-content: space-between;
        align-items: center;
        button.post-panel-header-btn {
          padding: 1px 20px;
          border: 1px solid var(--bdr-color-default);

          @include mixin.hover-action {
            background-color: rgb(from var(--icon-color-default) r g b/0.2);
          }

          &.active {
            border-width: 2px;
            border-color: var(--btn-active);
          }
        }
      }
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
    padding: 10px calc(4.8vw - 8px) 30px 4.8vw;
    overflow-x: hidden;
    overflow-y: auto;
    box-sizing: border-box;

    @media only screen and (max-width: $switchingPoint) {
      padding: 2vh calc(2.5vw - 8px) 30px 2.8vw;
    }

    #previewTop {
      position: absolute;
      top: 0;
    }

    #editPanel {
      display: block;
      padding: 0 5%;
      padding-bottom: 45rem;
      box-sizing: content-box;
    }

    #previewPanel {
      display: none;
    }

    &.show-preview {
      #editPanel {
        display: none;
      }

      #previewPanel {
        display: block;
      }
    }
  }
</style>