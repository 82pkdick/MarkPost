<script lang="ts">
import {default as config} from "$lib/app-config";
import SelectSection from "$lib/components/SelectSection.svelte";
import PostTags from "$lib/components/PostTags.svelte";
import type { LoadedPostData } from "$lib/types";
import { currentPostIns as currentPost } from "$lib/index.svelte";

// let { post }: { post: LoadedPostData; } = $props();

let post = $derived(currentPost.post);

let postThumbUrl = $state("");

const setPostThumbUrl = () => {
  const postid = post.postId;
  let thumb = post.thumbnail;

  // if (!thumb || thumb === '') {
  //   thumb = `_resources/thumbnail-${postid}.png`;
  // }

  if (postid && postid !== '' && thumb) {
    let thumbUrlBase = '';
    if (import.meta.env.MODE === 'production') {
      thumbUrlBase = `${config.JsonDataHostUrl.production}/${config.PostThumbnailsBasePath}`;
    } else {
      thumbUrlBase = `${config.JsonDataHostUrl.development}/${config.PostThumbnailsBasePath}`;
    }

    const thumbName = thumb.replace(/(\.\/)?_resources\//, '');
    postThumbUrl = `${thumbUrlBase}/${postid}/${thumbName}`
  }
};

const handleSubmit = async (e: Event) => {

};

const deletePost = async () => {};

$effect(() => {
  setPostThumbUrl();
  // console.log('currentPost.post: ', $state.snapshot(currentPost.post));
  console.log('testPostData: ', $state.snapshot(post));
});
</script>

<div class="post-props-editor">
  <div id="editPanelHeader" class="edit-panel-header flex-bth-end bdr-btm">
    <h4 class="panel-title">Edit Post</h4>
  </div>

  <div id="editPostData" class="edit-post-data base-bg">
    <!-- <div class="loading-spinner flex-center">
      <LoadingComp {isLoading} />
    </div> -->
    <!-- <div class="wrap-message flex-center">
      <MessageComp
        message={ResponseMessage}
        error={ResponseError}
        time={8000}
      />
    </div> -->

    <form onsubmit={handleSubmit} class="form-panel form-post-update">
      <div class="form-edit-post-save-btn flex-r-base">
        <div class="btn-change-post-save">
          <button type="submit" class="form-btn form-edit-btn-save">Save</button
          >
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
          <label class="label" for="postTags">
            <span class="label-mark">■</span>
            <span class="label-text">Tags</span>
          </label>
          <div id="postTags">
            <PostTags />
          </div>
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
        onclick={deletePost}
      >
        <span class="text-del">Delete</span>
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


      form.form-post-update {
        position: relative;
        top: 10px;

        .form-edit-post-save-btn {
          position: relative;
          z-index: 1000;
          margin-bottom: 0;
          padding-bottom: 0;
          .btn-change-post-save {

          }
        }

        .data-main-wrap {
          position: relative;
          top: -20px;

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
          padding: .5em 20px;
          display: inline-flex;
          justify-content: center;
          align-items: center;
          background-color: var(--bg-front);
          .text-del {
            display: inline-block;
            margin-left: .2em;
          }
        }
      }
    }

  }
</style>