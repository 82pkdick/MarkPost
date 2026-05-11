<script module>
let targetUrl = $state("");

export const handleInputClear = () => {
  targetUrl = "";
};

// データ送信の成功 or 失敗の表示
let ResponseMessage = $state("");
let ResponseError = $state(false);

//-- 処理結果のメッセージを初期化
export const AddNewMessageInit = () => {
  ResponseMessage = '';
  ResponseError = false;
};
</script>

<script lang="ts">
import { error } from "@sveltejs/kit";
import { resolve } from '$app/paths';
import { invalidateAll } from "$app/navigation";
import type { responseResult } from "$lib/types";
import { delTrSlash } from "$lib/utils/locationUtils";
import { getPostId, getPostDate } from '$lib/utils/date-utils';
import LoadingComp from "$lib/components/editor/LoadingComp.svelte";
import MessageComp from "$lib/components/editor/MessageComp.svelte";
import { updateResourceData } from "$lib/index.svelte";

const baseUrl = delTrSlash(resolve('/'));

let isLoading = $state(false);

//--- 追加するソースのURLが有効であるかどうかのチェック
const chechSiteUrl = async (url: string) => {
  if (url === '' || !(URL.canParse(url))) {
    return { result: false, message: 'URLが未定義または不正です.'};
  }

  const checkRequest = new Request(`${baseUrl}/api/urlcheck`, {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ srcUrl: url }),
  });

  let check = await fetch(checkRequest);

  if (!check.ok) {
    targetUrl = "";
    return { result: false, message: 'そのURLのページは見つかりません.'};
  }

  return { result: true, message: 'URLは正常です.'};
};

/** 
 * request for download post resources and build post archive.
 */
const downloadPageResources = async (postId: string) => {
  const downloadPageResourcesRequest = new Request(`${baseUrl}/api/media-download`, {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ postId: postId }),
  });

  try {
    const response = await fetch(downloadPageResourcesRequest);

    const result: responseResult = await response.json();

    if (result.ok) {
      return { result: true, message: result.message };
    } else {
      error(500, {
        message: result.message
      });
    }
  } catch (error) {
    let errorMsg = '';
    if (error instanceof Error) {
      errorMsg = error.message;
    } else {
      errorMsg = JSON.parse(String(error)).message;
    }
    console.error(errorMsg);
  }
};

/**
 * 新規記事を作成した後の処理の流れ
 * 1. `/api/archive/new`にリクエストを送る。これは新規記事のアーカイブの単独再構築を伴う。新規記事のアーカイブは`content-html`に書き出され、新規記事は`content-original/unsorted`に移動される。
 * 2. 記事リソースの再構築を行う。これによって、`content-original/unsorted`の記事のリソースも再構築される。
 * 3. invalidateAll() を呼び出して、記事リストの再取得と再描画を行う。これによって、記事リストに新規記事が表示されるようになる。
*/
const postProcessOfAddNewArticle = async () => {
  /** request for create new post archive */
  const createNewPostArchiveRequest = new Request(`${baseUrl}/api/archive/new`, {
    method: 'PUT',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
  const response = await fetch(createNewPostArchiveRequest);

  if (response.ok) {
    const result: responseResult = await response.json();

    if (result.ok) {
      console.log(result.message);

      //** --- rebuild all resource data --- */
      const updateResourceResult = await updateResourceData();

      if (updateResourceResult.ok) {
        console.log(updateResourceResult.message);

        await invalidateAll();
      } else {
        error(500, {
          message: updateResourceResult.message
        });
      }
    } else {
      error(500, {
        message: result.message
      });
    }
  } else {
    error(500, {
      message: 'Failed to download page media resources.'
    });
  }
};

/**
 * `/api/addnew`の実態は Markdownloader の実行。
 * 新規記事は Markdownloader でいったん`work/unsorted`に書き出される。
 * 新規記事のアーカイブは Markdownloader の実行の後に裏で自動実行される
*/
const handleAddNewArticle = async () => {
  const srcUrl = $state.snapshot(targetUrl);
  let checked = await chechSiteUrl(srcUrl);

  if (!checked?.result) {
    ResponseError = true;
    ResponseMessage = checked.message;
    return;
  }

  isLoading = true;

  const postDate = getPostDate();
  const postId = getPostId(postDate);

  /** request for add new post */
  const addNewPostRequest = new Request(`${baseUrl}/api/addnew`, {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ srcUrl: targetUrl, postId: postId }),
  });

  try {
    const response = await fetch(addNewPostRequest);

    const result: responseResult = await response.json();

    if (result.ok) {

      ResponseError = false;
      ResponseMessage = 'New post created successfully.';
      console.log(`${result.message}.`);

      const dPRresponse = await downloadPageResources(postId);

      if (dPRresponse && dPRresponse.result) {
        console.log(dPRresponse.message);

        await postProcessOfAddNewArticle();
      } else {
        error(500, {
          message: 'Failed to download page media resources.'
        });
      }
    } else {
      //--- 新規記事作成に失敗した場合
      ResponseError = true;
      ResponseMessage = 'Failed to create a new post!';
      //--- error で投げることで catch の console.error がブラウザの開発コンソールに出る
      error(500, {
        message: result.message
      });
    } 
  } catch (error) {
    let errorMsg = '';
    if (error instanceof Error) {
      errorMsg = error.message;
    } else {
      errorMsg = JSON.parse(String(error)).message;
    }
    console.error(errorMsg);
  } finally {
    isLoading = false;
  }
};

$effect(() => {
  // console.log('A01 targetUrl: ', targetUrl);
});
</script>

<div class="post-result-info">
  <div class="loading-spinner flex-center">
    <LoadingComp {isLoading} position='fixed' />
  </div>
  <div class="wrap-message flex-center">
    <MessageComp
      message={ResponseMessage}
      error={ResponseError}
      time={3000}
    />
  </div>
</div>
<div class="wrap-input-source-url flex-l-center bdr">
  <div class="label-head flex-l-center">
    <label class="label input-source-url" for="targetUrl">
      <span class="label-mark">■</span> 
      <span class="label-text fs-x10">Add Article</span>
    </label>
  </div>
  <div class="wrap-add-article-form form-panel flex-r-center">
    <div class="wrap-input flex-l-center">
      <input 
        type="text" 
        id="targetUrl" 
        name="targeturl" 
        class="input-source-url form-input form-input-url"
        bind:value={targetUrl} 
      />
      <button type="button" 
        class="clear-url form-btn"
        onclick={handleInputClear}>✕</button>
    </div>
    <div class="wrap-add-article-btn">
      <button type="button" 
        class="add-article-btn form-btn"
        disabled={isLoading}
        onclick={handleAddNewArticle}>
        Add
      </button>
    </div>
  </div>
  <div class="loading-spinner"></div>
</div>

<style lang="scss">
  @use "$lib/styles/scss-variables" as v;
  @use "$lib/styles/mixin.scss" as mixin;

  $switchingPoint: v.$TabletSize;
  $midsize: v.$TabletSizeMid;
  $minsize: v.$MobileSize;

  .post-result-info {
    position: relative;
    .loading-spinner {
      position: absolute;
      top: 5px;
      left: -35px;
    }
    .wrap-message {
      position: absolute;
      top: -1.5rem;
      left: 10rem;
      width: max-content;
    }
  }

  .wrap-input-source-url {
    width: auto;
    padding: 25px 1.5rem 20px;
    border-radius: 6px;

    .label-head {
      .label.input-source-url {
        width: auto;
        min-width: 7.5rem;
        margin-bottom: 0.5em;
        .label-mark {
          color: var(--link-color-active);
        }
        .label-text {
          padding-left: 0.2em;
          color: var(--form-label-color);
        }
      }
    }

    .wrap-add-article-form {
      width: 100%;
      .wrap-input {
        input.input-source-url {
          width: 100%;
          min-width: 30rem;
        }
        button.clear-url {
          --btn-w: 1.8em;
          --btn-mgn: 0 4px 4px 4px;
          --btn-pad: 5px;
          --btn-bdr-radius: 6px;
          background-color: inherit;
          color: var(--ft-weakened);
        }
      }
      .wrap-add-article-btn {
        width: stretch;
        max-width: calc(1.8em + 60px);

        button.add-article-btn {
          --btn-w: 60px;

          @include mixin.hover-action {
            border-width: 2px;
            color: var(--link-color-hover);
          }
        }
      }
    }
    .loading-spinner {

    }
  }

  @media only screen and (max-width: $switchingPoint) {
    .wrap-input-source-url {
      min-width: 80%;

      .label.input-source-url {
        margin-bottom: 0.5em;
        display: inline-block;
      }
    }
  }

  @media only screen and (max-width: $midsize) {
    .wrap-input-source-url {
      display: block;
    }
  }

  @media only screen and (max-width: $minsize) {
    .wrap-input-source-url {
      width: 100%;
      min-width: 100%;
      padding: 20px 0.6em 32px 1.0rem;

      .wrap-add-article-form {
        display: block;

        .wrap-input {
          input.input-source-url {
            max-width: calc(100% - 1.8em);
            min-width: unset;
          }
        }

        .wrap-add-article-btn {
          width: 100%;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          margin: 10px 0 -20px auto;
        }
      }
    }
  }
</style>