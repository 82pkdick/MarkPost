<script lang="ts">
  import { error } from "@sveltejs/kit";
  import { invalidateAll } from "$app/navigation";
  import PageHeader from "$lib/components/PageHeader.svelte";
	import SiteFooter from '$lib/components/site/SiteFooter.svelte';
  import { 
    getCurrentTheme, 
    changeThemeMode, 
    getCurrentFontSize, 
    changeBaseFontSize,
    updateResourceData,
    renderPostArchiveAll
  } from "$lib/index.svelte";
  import LoadingComp from "$lib/components/editor/LoadingComp.svelte";
  import MessageComp from "$lib/components/editor/MessageComp.svelte";

  let currentThemeName = $derived(getCurrentTheme());
  let currentFontSize = $derived(getCurrentFontSize());

  //-- _rbrs --> rebuildResources
  let isLoading_rbrs = $state(false);
  let ResponseMessage_rbrs = $state("");
  let ResponseError_rbrs = $state(false);

  //-- _raacs --> renderAllArchives
  let isLoading_raacs = $state(false);
  let ResponseMessage_raacs = $state("");
  let ResponseError_raacs = $state(false);

  const rebuidResources = async () => {
    isLoading_rbrs = true;

    try {
      const updateResult = await updateResourceData();

      if (updateResult.ok) {
        console.log(updateResult.message);
        ResponseError_rbrs = false;
        ResponseMessage_rbrs = 'rebuid site resources success.';

        await invalidateAll();
      } else {
        ResponseError_rbrs = true;
        ResponseMessage_rbrs = 'rebuid site resources failed.';

        error(500, {
          message: updateResult.message
        });
      }
    } catch (error) {
      const errorMsg = { message: '' };
      if (error instanceof Error) {
        errorMsg.message = error.message;
      } else {
        errorMsg.message = JSON.parse(String(error)).message;
      }
      console.error(errorMsg.message);
    } finally {
      isLoading_rbrs = false;
    }
  };

  const renderAllArchives = async () => {
    isLoading_raacs = true;

    try {
      const updateResult = await renderPostArchiveAll();

      if (updateResult.ok) {
        console.log(updateResult.message);
        ResponseError_raacs = false;
        ResponseMessage_raacs = 'render all archives success.';

        await invalidateAll();
      } else {
        ResponseError_raacs = true;
        ResponseMessage_raacs = 'render all archives failed.';

        error(500, {
          message: updateResult.message
        });
      }
    } catch (error) {
      const errorMsg = { message: '' };
      if (error instanceof Error) {
        errorMsg.message = error.message;
      } else {
        errorMsg.message = JSON.parse(String(error)).message;
      }
      console.error(errorMsg.message);
    } finally {
      isLoading_raacs = false;
    }
  };

</script>

<div class="wrap-main-content">
  <header id="pageHeader" class="list-header">
    <PageHeader pageName='Settings' />
  </header>

  <article id="post-article" class="article post-article settings-page-article type-list">
    <section id="listSection" class="list-setion">

      <!-- Change Theme Color -->
      <div class="settings-menu-item change-color bdr-top">
        <h3 class="settings-menu-title ft-subtitle">
          <span class="menu-title-text">Theme Color</span>
        </h3>
        <div id="changeTheme" class="change-theme change-props-item">
          <ul id="settings-change-theme" class="settings-item color-change">
            <li class="menu-color-change-item item-default">
              <button type="button" 
                class="item-switch default" 
                onclick={() => changeThemeMode('default')}
              >
                <div class="option-color default thin-bdr">
                  <div class="sample"></div>
                </div>
                <div class="name fs-x09 {(currentThemeName === 'default') ? 'current' : ''}">Default</div>
              </button>
            </li>

            <li class="menu-color-change-item item-dark">
              <button type="button" 
                class="item-switch dark" 
                onclick={() => changeThemeMode('dark')}
              >
                <div class="option-color dark thin-bdr">
                  <div class="sample"></div>
                </div>
                <div class="name fs-x09 {(currentThemeName === 'dark') ? 'current' : ''}">Dark</div>
              </button>
            </li>
          </ul>
        </div>
      </div>

      <!-- Change Font Size -->
      <div class="settings-menu-item change-fontsize bdr-top">
        <h3 class="settings-menu-title ft-subtitle">
          <span class="menu-title-text">Font Size</span>
        </h3>
        <div id="changeFtsize" class="change-theme change-props-item">
          <ul id="settings-change-base-ftsize" class="settings-item base-ftsize-change">

            <li class="menu-ftsize-change-item item-small">
              <button type="button" 
                class="item-switch small" 
                onclick={() => changeBaseFontSize('small')}
              >
                <div class="option-ftsize small {(currentFontSize === 'small') ? 'current' : ''}">
                  <div class="sample" 
                    style="font-size: 1.4em;">A</div>
                </div>
              </button>
            </li>
            <li class="menu-ftsize-change-item item-normal">
              <button type="button" 
                class="item-switch normal" 
                onclick={() => changeBaseFontSize('normal')}
              >
                <div class="option-ftsize normal {(currentFontSize === 'normal') ? 'current' : ''}">
                  <div class="sample" 
                    style="font-size: 1.8rem;">A</div>
                </div>
              </button>
            </li>
            <li class="menu-ftsize-change-item item-large">
              <button type="button" 
                class="item-switch large" 
                onclick={() => changeBaseFontSize('large')}
              >
                <div class="option-ftsize large {(currentFontSize === 'large') ? 'current' : ''}">
                  <div class="sample" style="font-size: 2.0rem;">A</div>
                </div>
              </button>
            </li>

          </ul>
        </div>
      </div>

      <!-- build all resources -->
      <div class="settings-menu-item wrap-build-action bdr-top">
        <h3 class="settings-menu-title ft-subtitle">
          <span class="menu-title-text">Rebuild Resources</span>
        </h3>
        <div id="buildResources" class="wrap-build-btn build-resources change-props-item form-panel">
          <button type="button"
            id="rebuidResourcesBtn"
            class="item-switch form-btn site-rebuid-resources-btn" 
            onclick={rebuidResources}
          >
          Rebuild
          </button>

          <div class="loading-spinner flex-center">
            <LoadingComp isLoading={isLoading_rbrs} position='relative' />
          </div>
          <div class="wrap-message flex-center">
            <MessageComp
              message={ResponseMessage_rbrs}
              error={ResponseError_rbrs}
              time={8000}
            />
          </div>

        </div>
      </div>
      

      <!-- build all post archives -->
      <div class="settings-menu-item wrap-build-action bdr-top">
        <h3 class="settings-menu-title ft-subtitle">
          <span class="menu-title-text">Render All Archives</span>
        </h3>
        <div id="renderAllArchives" class="wrap-build-btn render-all-archives change-props-item form-panel">
          <button type="button"
            id="renderAllArchivesBtn"
            class="item-switch form-btn render-all-archives-btn" 
            onclick={renderAllArchives}
          >
          Render
          </button>

          <div class="loading-spinner flex-center">
            <LoadingComp isLoading={isLoading_raacs} position='relative' />
          </div>
          <div class="wrap-message flex-center">
            <MessageComp
              message={ResponseMessage_raacs}
              error={ResponseError_raacs}
              time={8000}
            />
          </div>
        </div>
      </div>

    </section>

    <footer id="siteFooter" class="site-footer base-bg">
      <SiteFooter />
    </footer>
  </article>
</div>

<style lang="scss">
  .article.settings-page-article {
    margin-top: 5px;
    padding: 5px 15px 25px;

    .settings-menu-item {
      padding: 8px 20px 12px;

      .settings-menu-title {
        margin: 10px 0;
        .menu-title-text {
          font-size: 1.2rem;
          color: var(--default-ft-color);
        }
      }

      .change-theme {
        ul.settings-item {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          margin: 0.6rem 1rem 0;
          padding: 0;
          list-style-type: none;

          &.color-change {
            .menu-color-change-item {
              position: relative;
              button.item-switch {
                margin: 2px 5px;
                padding: 10px;
                background-color: transparent;
                .option-color {
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                  align-items: center;
                  width: 90px;
                  height: 50px;
                  margin: 0 0 10px;
                  padding: 10px;
                  border-radius: 10%;
                  &.default {
                    background-color: #efefef;
                  }
                  &.dark {
                    background-color: #111;
                  }
                }
                .name {
                  width: 100%;
                  padding-bottom: 4px;
                  text-align: center;
                  color: var(--default-ft-color);
                  &.current {
                    border-bottom: 4px solid var(--link-color-current);
                  }
                }
              }
            }
          }

          &.base-ftsize-change {
            .menu-ftsize-change-item {
              position: relative;
              button.item-switch {
                margin: 2px 6px;
                padding: 14px;
                background-color: transparent;

                .option-ftsize {
                  &.current {
                    border-bottom: 4px solid var(--link-color-current);
                  }
                  .sample {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 1em;
                    height: calc(1em + 5px);
                    padding-bottom: 5px;
                    color: var(--default-ft-color);
                  }
                }
              }
            }
          }
        }
      }
    }

    .settings-menu-item.wrap-build-action {
      .wrap-build-btn {
        margin: 24px 1.0rem 18px;
        display: flex;
        justify-content: flex-start;
        align-items: center;

        button.item-switch {
          margin: 2px 5px;
          padding: 10px;
          width: 8.0rem;
        }

        .loading-spinner {
          position: relative;
        }

        .wrap-message {
          position: relative;
          margin-left: 1.0rem;
        }
      }
    }

  }
</style>