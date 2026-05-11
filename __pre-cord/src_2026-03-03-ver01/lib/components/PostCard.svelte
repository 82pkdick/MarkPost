<script lang="ts">
  import type { PostData } from "$lib/types";
  import { default as config } from "$lib/app-config";
  import { decodeEntities } from "$lib/utils/stringUtils";
  import { setPreviewState, setCurrentPostData } from "../../routes/+layout.svelte";

  let { post }:{ post: PostData } = $props();
  
  let postThumbUrl = $state('');

  let postTitle = $state('');
  let postDesc = $state('');

  const fixString = () => {
    postTitle = decodeEntities(post.title);
    postDesc = decodeEntities(post.description);
  };

  const setPostThumbUrl = () => {
    const postid = post.postId;
    const thumb = post.thumbnail;
    let thumbUrlBase = '';
    if (import.meta.env.MODE === 'production') {
      thumbUrlBase = `${config.JsonDataHostUrl.production}/${config.PostThumbnailsBasePath}`;
    } else {
      thumbUrlBase = `${config.JsonDataHostUrl.development}/${config.PostThumbnailsBasePath}`;
    }
    const thumbName = thumb.replace(/(\.\/)?_resources\//, '');
    postThumbUrl = `${thumbUrlBase}/${postid}/${thumbName}`
    // console.log('postThumbUrl: ', postThumbUrl);
  };

  $effect(() => {
    fixString();
    setPostThumbUrl();
  });

  const handlePostState = async (postid: string) => {
    setPreviewState(true);
    await setCurrentPostData(postid);
  };
</script>

<div class="card-main">
  <div class="card-head">
    <div class="card-title">
      <h3 class="resource-title ft-title">
        <div data-postid="{post.postId}">
          <button type="button" 
            class="resource-link base-bg-front ft-title"
            onclick={() => handlePostState(post.postId)}
          >
            <span class="title-text">
              {postTitle}
              <span class="abbrev">...</span>
            </span>
          </button>
        </div>
      </h3>
    </div>
  </div>
  <div class="card-body">
    <picture role="img" class="thumbnail card-header-thumbnail thin-bdr">
      <source media="(min-width: 500px)" srcset={postThumbUrl}>
      <img width="56" height="56" alt="post thumbnail" src={postThumbUrl}>
    </picture>
    <div class="card-head-info">
      <p class="post-desc ft-mid fs-x08">
        {postDesc}
      </p>
      <div class="post-section">
        <span class="section-title ft-weakened fs-x08 thin-bdr">
          {post.section}
        </span>
      </div>
    </div>
  </div>
</div>
<div class="card-footer">
  <div class="post-belong-tags">
    <ul class="tags">
      {#if post.tags && post.tags.length > 0}
        {#each post.tags as tag}
          <li class="tag-title">
            <span class="tag-hash ft-weakened fs-x08">#</span>
            <span class="tag-title-text ft-mid fs-x08">{tag}</span>
          </li>
        {/each}
      {/if}
    </ul>
  </div>
</div>

<style lang="scss">
  @use "$lib/styles/mixin.scss" as mixin;

  .card-main {
    grid-row: 1 / 2;
    grid-column: 1 / 2;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;

    .card-head {
      display: block;
      padding: 2px 3px 2px 8px;

      .card-title {
        width: 100%;
        max-height: 4.8em;
        margin-bottom: 8px;
        word-wrap: break-word;
        overflow: hidden;

        .resource-title {
          margin: 0;
          padding: 0;

          .resource-link {
            margin: 0;
            padding: 0;
            text-align: left;
            line-height: 1.3;
            border: none;
            outline: none;
            background-color: transparent;

            &:hover { font-weight: 800; }
            &:hover, &:focus, &:focus-visible {
              border: none;
              outline: none;
            }

            .title-text {
              font-size: 1.1rem;
              line-height: 1.5;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              overflow: hidden;
              text-overflow: ellipsis;
              -webkit-line-clamp: 2;
              max-height: calc(1.4em * 3);

              @include mixin.hover-action {
                color: var(--current-card-link);
                font-weight: 700;
              }
            }
            .abbrev {
              display: inline;
            }
          }
        }
      }
    }

    .card-body {
      display: grid;
      grid-template-rows: 1fr;
      grid-template-columns: 150px 1fr;
      width: 100%;
      min-height: 105px;
      margin-top: 8px;
      padding: 0 0 0 8px;

      .thumbnail {
        grid-row: 1 / 2;
        grid-column: 1 / 2;
        width: 150px;
        height: 150px;
        img {
          width: 100%;
          max-width: 150px;
          min-width: 150px;
          height: 150px;
          object-fit: cover;
        }
      }

      .card-head-info {
        grid-row: 1 / 2;
        grid-column: 2 / 3;
        padding: 0 0.2rem 0 0.8rem;

        .post-desc {
          height: 100%;
          padding: 0.3em 0 0;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          -webkit-line-clamp: 3;
          width: 100%;
          word-break: break-all;
          max-height: calc(1.3em * 3);
        }

        .post-section {
          display: inline-block;
          width: fit-content;
          height: fit-content;
          margin: 15px 2px 8px;

          .section-title {
            display: inline-block;
            width: fit-content;
            height: fit-content;
            padding: 2px 6px 2px;
            border-radius: 5px;
          }
        }
      }
    }
  }

  .card-footer {
    grid-row: 2 / 3;
    grid-column: 1 / 3;
    width: 100%;
    height: fit-content;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
    margin: 3px 0 0;

    .post-belong-tags {
      display: inline-flex;
      justify-content: flex-start;
      align-items: center;
      flex-wrap: wrap;
      width: fit-content;
      height: fit-content;
      margin: 8px 0 0;
      padding: 0;
      ul.tags {
        margin: 0;
        padding: 2px 0 3px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-wrap: wrap;
        line-height: 1.1;
        .tag-title {
          margin: 0 3px;
          padding: 4px 8px;
          border-radius: 5px;
          .tag-hash {
            margin-right: -2px;
          }
        }
      }
    }
  }
</style>