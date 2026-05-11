<script module>
export const keepTagInputPosition = () => {
  const pageTagList = document.getElementById('pageTagList') as HTMLElement;
  if (pageTagList) {
    pageTagList.scrollIntoView({ block: "center" });
  }
};

// データ取得・送信等の成功 or 失敗の表示
let ResponseMessage = $state("");
let ResponseError = $state(false);

//-- 処理結果のメッセージを初期化
export const responseMessageInit = () => {
  ResponseMessage = '';
};
</script>

<script lang="ts">
import { error } from "@sveltejs/kit";
import { resolve } from '$app/paths';
import { invalidateAll } from "$app/navigation";
import SelectSection from "$lib/components/editor/SelectSection.svelte";
import PostTags from "$lib/components/tags/PostTags.svelte";
import { 
  getCurrentPost, 
  getThumbnailPath, 
  getPostInitData, 
  fixSendPostData,
  updateResourceData,
  updateOnePostArchive,
  deleteOnePostArchive,
  closePostPanel,
} from "$lib/index.svelte";
import TrashIcon from "$lib/icons/trash-icon.svelte";
import LoadingComp from "$lib/components/editor/LoadingComp.svelte";
import MessageComp from "$lib/components/editor/MessageComp.svelte";
import type { SendPostData, responseResult } from "$lib/types";
import Error from "../../routes/+error.svelte";
import { escapeDoubleQuotes } from "$lib/utils/stringUtils";
import { delTrSlash } from "$lib/utils/locationUtils";

let postInitData = $state(getPostInitData());

const baseUrl = delTrSlash(resolve('/'));

let post = $derived.by(() => {
  const currentPost = getCurrentPost();
  if (currentPost.available()) {
    return currentPost.post;
  } else {
    return postInitData;
  }
});

let editPanelTop: HTMLElement | null = $state(null);

const scrollPanelTop = () => {
  if (editPanelTop) {
    editPanelTop.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
};

let postThumbUrl = $state("");

const setPostThumbPath = () => {
  if (post) {
    postThumbUrl = getThumbnailPath(post);
  }
};

const closePanel = () => {
  closePostPanel();
};

let isLoading = $state(false);

let serverMsg = $state('');

//** --- rebuild this post archive --- */
const updatePostArchive = async () => {
  const updateAcvResult: responseResult = await updateOnePostArchive();

  if (updateAcvResult.ok) {
    console.log(updateAcvResult.message);
  } else {
    error(500, {
      message: updateAcvResult.message
    });
  }
};

const handleSubmit = async (event: Event) => {
  isLoading = true;

  event.preventDefault();
  const dataCurrent = $state.snapshot(post);
  const postId = post.postId;
  const postSection = dataCurrent.section;

  const sendData: SendPostData = fixSendPostData(dataCurrent);

  /** backslash escape double quote */
  const fixedTitle = escapeDoubleQuotes(sendData.title);
  sendData.title = fixedTitle;

  const fixedDesc = escapeDoubleQuotes(sendData.description);
  sendData.description = fixedDesc;
  /** ----------------------------- */

  /** update resources data */
  const updateRequest = new Request(`${baseUrl}/api/post/${postId}`, {
    method: 'PUT',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ postData: sendData }),
  });

  try {
    const response = await fetch(updateRequest);

    const result: responseResult = await response.json();
    
    if (result.ok) {
      ResponseError = false;
      ResponseMessage = 'post update success.';
      console.log(`ID: ${result.postId} ${result.message}.`);

      //** --- rebuild all resource data --- */
      const updateResult = await updateResourceData();

      if (updateResult.ok) {
        console.log(updateResult.message);
        //--- rebuild this post archive
        await updatePostArchive();
        closePanel();
        await invalidateAll();
      } else {
        error(500, {
          message: updateResult.message
        });
      }
    } else {
      //--- 記事更新に失敗した場合
      ResponseError = true;
      ResponseMessage = 'post update failed.';
      //--- error で投げることで catch の console.error がブラウザの開発コンソールに出る
      error(500, {
        message: result.message
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
    isLoading = false;
  }
};

const deletePost = async (event: Event) => {
  isLoading = true;

  event.preventDefault();
  const dataCurrent = $state.snapshot(post);
  const postId = post.postId;
  const postSection = dataCurrent.section;

  alert(`本当に記事(ID:${postId})を削除しますか？`);

  const deleteRequest = new Request(`${baseUrl}/api/post/${postId}`, {
    method: 'DELETE',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ postSection: postSection }),
  });

  scrollPanelTop();

  try {
    const response = await fetch(deleteRequest);

    const result: responseResult = await response.json();
    
    serverMsg = result.message;
    
    if (result.ok) {
      console.log(serverMsg);

      //** --- rebuild all resource data --- */
      const updateResult = await updateResourceData();

      if (updateResult.ok) {
        ResponseError = false;
        ResponseMessage = `ID: ${result.postId} -- post deleted.`;

        console.log(updateResult.message);

        //--- この記事のアーカイブ(HTMLファイル)は削除
        deleteOnePostArchive(postId);

        await invalidateAll();

        window.setTimeout(() => {
          closePanel();
        }, 2000);
      } else {
        error(500, {
          message: updateResult.message
        });
      }
    } else {
      //--- 記事の削除に失敗した場合
      ResponseError = true;
      const errorMsg = result.message;
      error(500, {
        message: errorMsg
      });
    }
  } catch (error) {
    const errorMsg = JSON.parse(String(error));
    console.error(errorMsg.message);
    ResponseMessage = `delete post failed.`
  } finally {
    isLoading = false;
  }
};

$effect(() => {
  setPostThumbPath();
  // escapeTextQuotes();
  // console.log('currentPostData: ', $state.snapshot(getCurrentPost().post));
  // console.log('newSection: ', $state.snapshot(newSection));
  // console.log('hasNewSection: ', getCurrentPost().hasNewSection());
});
</script>

<div class="post-props-editor">
  <div id="editPanelTop" bind:this={editPanelTop}></div>
  <div id="editPanelHeader" class="edit-panel-header flex-bth-end bdr-btm">
    <h4 class="panel-title">Edit Post</h4>
  </div>

  <div id="editPostData" class="edit-post-data base-bg">
    <div class="loading-spinner flex-center">
      <LoadingComp {isLoading} position='fixed' />
    </div>
    <div class="wrap-message flex-center">
      <MessageComp
        message={ResponseMessage}
        error={ResponseError}
        time={8000}
      />
    </div>

    <form onsubmit={(e) => handleSubmit(e)} class="form-panel form-post-update">
      <div class="form-edit-post-save-btn flex-r-base">
        <div class="btn-change-post-save">
          <button 
            type="submit" 
            class="form-btn form-edit-btn-save"
            disabled={isLoading}>
            Save
          </button>
        </div>
      </div>

      <section class="data-main-wrap">
        <div class="wrapper post-main-wrap-head flex-l-center">
          <div class="head-post-thumbnail">
            {#if postThumbUrl}
              <img
                src={postThumbUrl}
                alt="Post Thumbnail"
                class="post-thumbnail-image"
              />
            {:else}
              <p class="img-box bdr"></p>
            {/if}
          </div>
          <div class="wrapper input post-title">
            <label class="label" for="inputPostTitle">
              <span class="label-mark">■</span>
              <span class="label-text">Title</span>
            </label>
            <textarea
              id="inputPostTitle"
              class="textarea form-input post-title-input"
              name="title"
              bind:value={post.title}
            >
            </textarea>
          </div>
        </div>

        <div class="wrapper input post-desc">
          <label class="label" for="inputPostDesc">
            <span class="label-mark">■</span>
            <span class="label-text">Description</span>
          </label>
          <textarea
            id="inputPostDesc"
            class="textarea form-input"
            name="description"
            rows="5"
            cols="15"
            bind:value={post.description}
          >
          </textarea>
        </div>

        <div class="wrapper input post-source">
          <label class="label" for="inputPostSource">
            <span class="label-mark">■</span>
            <span class="label-text">Source</span>
          </label>
          <div class="source-input flex-l-base">
            <input
              type="text"
              name="source"
              id="inputPostSource"
              class="form-input post-source-input"
              placeholder=""
              bind:value={post.source}
            />
            <input
              type="hidden"
              name="sitename"
              class="form-input post-sourcehost-input"
              bind:value={post.sitename}
            />
            <div class="btn-for-input to-source fs-x08">
              <a href={post?.source} target="_blank">サイトを参照</a>
            </div>
          </div>
        </div>

        <div class="wrapper input post-sourcedate flex-r-start">
          <label class="label post-sourcedate" for="inputSourcedate">
            <span class="label-mark">■</span>
            <span class="label-text">sourceDate</span>
          </label>
          <input
            type="text"
            name="sourcedate"
            id="inputSourcedate"
            class="form-input post-sourcedate-input"
            placeholder=""
            bind:value={post.sourceDate}
          />
        </div>

        <div class="wrapper input post-sitename">
          <label class="label" for="inputSitename">
            <span class="label-mark">■</span>
            <span class="label-text">Sitename</span>
          </label>
          <input
            type="text"
            name="sitename"
            id="inputSitename"
            class="form-input post-sitename-input"
            placeholder=""
            bind:value={post.sitename}
          />
        </div>

        <div class="wrapper input post-thumbnail">
          <label class="label" for="inputPostThumbnail">
            <span class="label-mark">■</span>
            <span class="label-text">Thumbnail</span>
          </label>
          <div class="post-thumbnail-state">
            <input
              type="text"
              name="thumbnail"
              id="inputPostThumbnail"
              class="form-input post-thumbnail-input"
              placeholder=""
              bind:value={post.thumbnail}
            />
          </div>
        </div>

      </section>

      <section class="data-classify-wrap">
        <div class="wrapper input post-section">
          <label class="label" for="selectSection">
            <span class="label-mark">■</span>
            <span class="label-text">Section</span>
          </label>
          <SelectSection />
        </div>

        <div class="wrapper input post-taglist">
          <label class="label" for="inputtedTag">
            <span class="label-mark">■</span>
            <span class="label-text">Tags</span>
          </label>
          <PostTags />
        </div>
      </section>

      <section class="data-info-wrap">
        <div class="unify">
          <div class="wrapper input post-id unified-left">
            <label class="label" for="inputPostId">
              <span class="label-mark">■</span>
              <span class="label-text">Post Id</span>
            </label>
            <input
              type="text"
              name="postId"
              id="inputPostId"
              class="form-input postid-input"
              placeholder=""
              bind:value={post.postId}
              readonly
            />
          </div>
          <div class="wrapper input post-date unified-right">
            <label class="label" for="inputPostDate">
              <span class="label-mark">■</span>
              <span class="label-text">Date</span>
            </label>
            <input
              type="text"
              name="date"
              id="inputPostDate"
              class="form-input post-date-input"
              placeholder=""
              bind:value={post.date}
              readonly
            />
          </div>
        </div>

        <div class="wrapper input post-url">
          <label class="label" for="inputPostUrl">
            <span class="label-mark">■</span>
            <span class="label-text">URL</span>
          </label>
          <input
            type="text"
            name="url"
            id="inputPostUrl"
            class="form-input post-url-input"
            placeholder=""
            bind:value={post.url}
            readonly
          />
        </div>

        <!-- Attributes specific to video articles  -->
        <div class="unify">
          <div class="wrapper input post-type">
            <label class="label" for="inputPostType">
              <span class="label-mark">■</span>
              <span class="label-text">Post Type</span>
            </label>
            <input
              type="text"
              name="posttype"
              id="inputPostType"
              class="form-input post-type-input"
              placeholder=""
              bind:value={post.postType}
              readonly
            />
          </div>

          <div class="wrapper input post-videourl">
            <label class="label" for="inputPostVideoUrl">
              <span class="label-mark">■</span>
              <span class="label-text">Video Url</span>
            </label>
            <input
              type="text"
              name="postvideourl"
              id="inputPostVideoUrl"
              class="form-input post-videourl-input"
              placeholder=""
              bind:value={post.videoUrl}
              readonly
            />
          </div>

          <div class="wrapper input post-moviearchive">
            <label class="label" for="inputPostMovieArchive">
              <span class="label-mark">■</span>
              <span class="label-text">Movie Archive</span>
            </label>
            <input
              type="text"
              name="postmoviearchive"
              id="inputPostMovieArchive"
              class="form-input post-moviearchive-input"
              placeholder=""
              bind:value={post.movieArchive}
              readonly
            />
          </div>

        </div>

        <div class="unify">
          <div class="wrapper input post-filedir unified-left">
            <label class="label" for="inputFileDir">
              <span class="label-mark">■</span>
              <span class="label-text">File Dir</span>
            </label>
            <input
              type="text"
              name="fileDir"
              id="inputFileDir"
              class="form-input filedir-input"
              placeholder=""
              bind:value={post.fileDir}
              readonly
            />
          </div>

          <div class="wrapper input post-filepath unified-right">
            <label class="label" for="inputFilePath">
              <span class="label-mark">■</span>
              <span class="label-text">File Path</span>
            </label>
            <input
              type="text"
              name="filePath"
              id="inputFilePath"
              class="form-input filepath-input"
              placeholder=""
              bind:value={post.filePath}
              readonly
            />
          </div>
        </div>
      </section>
    </form>

    <div class="delete-this-post form-panel flex-r-center">
      <button
        type="button"
        class="delete-post-btn form-btn"
        disabled={isLoading}
        onclick={(e) => deletePost(e)}
      >
        <span class="text-del">
          <TrashIcon />
          Delete
        </span>
      </button>
    </div>

  </div>
</div>

<style lang="scss">
  @use '$lib/styles/scss-variables' as v;
  @use '$lib/styles/mixin.scss' as mixin;

  .post-props-editor {
    width: max(330px, 100%);
    min-width: 330px;
    max-width: 100%;
    height: calc(100svh - #{v.$site_header_h}px);
    padding: 0 10px 0 0;

    .edit-panel-header {
      position: relative;
      top: 0;
      left: 0;
      width: 100%;
      height: 40px;

      .panel-title {
        position: relative;
        top: 0;
        left: 0;
        width: 100%;
        margin: 0;
        padding-bottom: 4px;
        text-align: center;
        font-weight: 400;
        color: var(--ft-mid);
      }
    }

    .edit-post-data {

      .loading-spinner {
        position: absolute;
        top: 20px;
        left: calc(50% - 45px);
        width: 90px;
        height: 40px;
        z-index: 1001;
      }
      .wrap-message {
        position: absolute;
        top: 8px;
        left: 0;
        width: 100%;
        background-color: transparent;
        z-index: 1000;
      }

      form.form-post-update {
        position: relative;
        top: 20px;

        .form-edit-post-save-btn {
          position: relative;
          z-index: 1000;
          margin-bottom: 0;
          padding-bottom: 0;
        }

        .data-main-wrap {
          position: relative;
          top: -25px;

          .wrapper.post-main-wrap-head {
            margin-bottom: 0;

            .head-post-thumbnail {
              img.post-thumbnail-image {
                width: 100px;
                height: 100px;
                max-width: 115px;
                max-height: 115px;
                margin-right: 15px;
                margin-top: auto;
                margin-bottom: auto;
                overflow: hidden;
                object-fit: cover;
              }
              .img-box {
                width: 100px;
                height: 100px;
                max-width: 115px;
                max-height: 115px;
                margin-right: 15px;
                margin-top: auto;
                margin-bottom: auto;
                overflow: hidden;
              }
            }

            .wrapper.input.post-title {
              width: 100%;
              textarea.form-input.post-title-input {
                width: 100%;
                height: 4.5em;
              }
            }
          }

          .wrapper.input.post-desc {
            textarea.textarea.form-input {
              height: 6.0rem;
            }
          }

          .wrapper.input.post-source {
            .source-input {
              input.form-input.post-source-input {
                width: calc(100% - 8.0rem);
              }
              .to-source {
                position: relative;
                top: -5px;
                width: 8em;
                padding: 8px;
                margin-left: .8rem;
                line-height: 1.4;
                border: 1px solid var(--thin-bdr);
                border-radius: 5px;
              }
            }
          }

          .wrapper.input.post-sourcedate {
            margin-top: 15px;
            input.form-input.post-sourcedate-input {
              width: 12rem;
              margin: 0 0 0 12px;
            }
          }
        }

        .data-classify-wrap {
          position: relative;
        }

        .data-info-wrap {
          position: relative;
        }
      }

      .delete-this-post {
        margin-top: 40px;

        button.delete-post-btn {
          padding: 0.5em 14px 0.6em 22px;
          display: inline-flex;
          justify-content: center;
          align-items: center;
          background-color: var(--bg-front);
          .text-del {
            position: relative;
            display: inline-flex;
            justify-content: flex-start;
            align-items: center;
          }
        }
      }
    }

  }
</style>