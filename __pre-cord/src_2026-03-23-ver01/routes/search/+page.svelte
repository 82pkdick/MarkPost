<script lang="ts">
  import type { PageData } from "./$types";
  import { onMount } from "svelte";
  import { navigating } from '$app/state';
  import { pushState } from '$app/navigation';
  import type { SearchPostData, SearchResultData } from "$lib/types";
  import PageHeader from "$lib/components/PageHeader.svelte";
  import SiteFooter from '$lib/components/site/SiteFooter.svelte';
  import PostPanel from "$lib/components/PostPanel.svelte";
  import InitSearchInput from "$lib/components/search/InitSearchInput.svelte";
  import SearchExec from "$lib/components/search/SearchExec.svelte";
  import HistorySelector, { initSelector } from "$lib/components/search/HistorySelector.svelte";
  import { Search, GetHistory } from "$lib/dataAssist/searchLogic";
  import { getAppliedPosts, getMatchingPoint } from "$lib/dataAssist/searchResultLogic";
  import { getParams } from "$lib/utils/locationUtils";
  import PostCard from "$lib/components/PostCard.svelte";

  type PropsData = {
    searchData: SearchPostData[];
  };
  
  const { data }: { data: PageData } = $props();

  // --- 検索文字列
  let qword = $state("");

  // --- 検索結果の件数
  let resultCount: number = $state(0);

  let currentPostId = $state("");

  // --- 検索文字列をクリア
  const handleInitSearchQ = () => {
    qword = "";
    resultCount = 0;
    showAppendix = false;
    initSelector();
    clearAppliedPosts();
  };

  // --- 検索文字列にセット
  const handleSetSearchQ = (qstr: string) => {
    qword = qstr;
    resultCount = 0;
    showAppendix = false;
  };

  /**
   * 記事のデータリスト(JSON: search-data.json)と件数を取得して保持
   */
  let postDataList: SearchPostData[] = $state([]);
  let postDataTotal: number = $state(0);

  const setData = () => {
    postDataList = data.searchData;
    postDataTotal = data.searchData.length;
  };

  $effect(() => {
    setData();
  });

  /**
   * 検索履歴
   */
  let queryHistory: string[] = $state([]);

  const setHistory = (hdata: string[]) => {
    if (hdata && hdata.length > 0) {
      queryHistory = hdata;
    }
  };

  const updateHistory = (): Array<string> => {
    let historyData = GetHistory();
    return historyData;
  };

  onMount(() => {
    queryHistory = updateHistory();
  });

  /**
   * 検索結果
   */
  let appliedPosts = $state([] as SearchResultData[]);

  const clearAppliedPosts = () => {
    appliedPosts = [];
  };

  /**
   * 検索結果の付加情報
   */

  // --- 検索結果の付加情報(ヒット件数等)の表示
  let showAppendix: boolean = $state(false);

  // 検索結果の付加情報をクリア
  const clearAppendix = () => {
    showAppendix = false;
  };

  const setMatchingStr = (entry: SearchResultData) => {
    let matchStr = getMatchingPoint(entry);
    return matchStr;
  };

  const StartSearch = async () => {
    let result: number[][] = [];
    let data = $state.snapshot(postDataList);
    let q = $state.snapshot(qword);

    //--- 検索して結果を受け取る
    result = await Search(q, data);

    if (result) {
      showAppendix = true;
      initSelector();
    }

    //--- 結果があれば
    if (result.length > 0) {
      //--- 履歴の保存
      let hdata = updateHistory();
      setHistory(hdata);

      //--- 検索結果の取得
      let resData = getAppliedPosts(result, data);
      if (resData) {
        for (let i = 0; i < resData.length; i++) {
          let entry = resData[i];

          let matchPoints = setMatchingStr(entry);
          resData[i].matchPoints = { ...matchPoints };
        }
        appliedPosts = resData;
      }
    } else {
      //--- 結果の件数が「0」なら結果表示をクリア
      clearAppliedPosts();
    }

    resultCount = result.length;
  };

  // URLロケーションにクエリーを追加(戻る・進む操作の対応)
  const pushLocationHistory = () => {
    if (qword) {
      pushState(`?q=${qword}`, {
        qword: true
      })
    }
  };

  const handleSearch = () => {
    if (qword && qword !== "") {
      StartSearch();
      pushLocationHistory();
    }
  };

  const handlePopState = () => {
    let qstr = getParams("q");
    if (qstr && qstr !== "") {
      handleSetSearchQ(qstr);
      StartSearch();
    }
  };

  const fixMatchStr = (post: SearchResultData) => {
    const expStart = post.matchPoints?.start;
    const expMatch = post.matchPoints?.match;
    const expEnd = post.matchPoints?.end;
    const rendered = `${expStart}<span class="excerpt-match">${expMatch}</span>${expEnd} ...`;
    let matchStr = rendered.trim();
    return matchStr;
  };

  $effect(() => {
    // console.log('data: ', searchData);
  });
</script>

<svelte:window onpopstate={handlePopState} />

<div class="wrap-main-content">
  <header id="pageHeader" class="list-header search-page-header base-bg-rear">
    <PageHeader pageName='Search Posts' />
  </header>

  <article id="post-article" class="article post-article search-page-article type-list">
    <section id="listSection" class="list-setion">

      <!-- search navi -->
      <section id="searchNavi" class="search-navi base-bg-rear">
        <div class="search-navi-main search-mod-item">
          <div class="search-navi-input">
            <p class="list-desc search-label">記事を検索：</p>
            <div class="search-input-mod">
              <div id="modSearch" class="mod-search">
                <div class="search-input">
                  <input id="search-query" class="inputq base-bg bdr form-input" autoComplete="off"
                    placeholder="Search" name="searchq" type="text"
                    bind:value={qword}
                    oninput={clearAppendix}
                  />
                </div>
              </div>
              <InitSearchInput initHandler={handleInitSearchQ} />
              <SearchExec searchHandler={handleSearch} />
            </div>
          </div>
        </div>

        <div id="ctlSearchResult" class="ctl-search-result search-mod-item">
          <div class="section-select-history">
            <label for="selectHistoryList" class="label-select-history search-label">
              検索履歴：
            </label>
            <div id="selectHistory" class="select-history">
              <HistorySelector qlist={queryHistory} setHandler={handleSetSearchQ} />
            </div>
          </div>
        </div>

        <!-- 現在の検索ワードとヒット数の表示 -->
        {#if qword && showAppendix}
          <div class="result-msg">
            <span id="inputWord" class="input-word">
            「<span class="appendix-msg">{qword}</span>」を検索：
            </span>
            <span id="resultCount" class="result-count">
              <span class="appendix-msg">{resultCount}</span>件（{postDataTotal}件中）
            </span>
          </div>
        {/if}
      </section>

      <!-- search result -->
      <ul id="searchResult" class="scrap-list search-result flex">
        {#if appliedPosts && appliedPosts.length > 0}
          {#each appliedPosts as post}
            <li class="post-card searched-post-card base-bg-front bdr drop-shadow block-bg-hover-lt
            {post.postId === currentPostId ? 'current' : ''}">
              <PostCard post={post}>
                <div class="item-excerpt fs-x09">
                  <p>{@html fixMatchStr(post)}</p>
                </div>
              </PostCard>
            </li>
          {/each}
        {/if}
      </ul>

    </section>

    <footer id="siteFooter" class="site-footer base-bg">
      <SiteFooter />
    </footer>
  </article>
</div>

<!-- post-panel -->
<section id="postPanel" class="post-panel base-bg">
  <PostPanel contentsDir={data.pathSettings.MdFilePath} />
</section>

<style lang="scss">
  @use '$lib/styles/scss-variables' as v;
  @use '$lib/styles/mixin.scss' as mixin;

  .search-page-header {
    padding-bottom: 8px;
  }

  #searchNavi.search-navi {
    grid-row: 1 / 2;
    grid-column: 1 / 2;
    padding: 16px 10px;
    padding-bottom: 20px;
    border-bottom: 1px solid var(--thin-bdr);
  }

  #searchResult.search-result {
    grid-row: 2 / 3;
    grid-column: 1 / 2;
  }

  #searchResult.search-result .post-card.searched-post-card {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: subgrid;
    grid-row: span 3;
    row-gap: 0;
    position: relative;
    width: min(100%, 94vw);
    height: auto;
    min-height: 145px;
    max-height: fit-content;
    padding: 11px .5em 9px .6em;
    border-radius: 3px;
    overflow: hidden;
  }

  // search header layout
  .search-navi {
    position: relative;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    margin-top: 0;

    .search-mod-item {
      margin: 5px 0;
      .search-label {
        margin: 0 0.5em;
        padding: 0;
        min-width: 7.5em;
        text-align: right;
        @media only screen and (max-width: v.$TabletSize) {
          font-size: 0.8rem;
          width: 6em;
          margin: 0;
        }
      }
    }
  }

  // search input
  .search-navi .search-navi-main {
    display: inline-flex;
    justify-content: flex-start;
    align-items: center;
    width: auto;
    min-width: 46%;
    margin-right: 1rem;

    .search-navi-input {
      display: inline-flex;
      justify-content: flex-start;
      align-items: center;
      width: 100%;

      .search-input-mod {
        display: inline-flex;
        justify-content: flex-start;
        align-items: center;
        width: fit-content;

        .mod-search {
          display: inline-flex;
          justify-content: flex-start;
          align-items: center;
          width: fit-content;

          .search-input {
            position: relative;
            top: 0;
            right: -3px;
            width: auto;
            min-width: 148px;
            background-color: transparent;

            @media only screen and (max-width: v.$TabletSize) {
              width: 180px;
              min-width: 180px;
            }

            input.inputq {
              width: 100%;
              height: 32px;
              margin: 0;
              font-size: 1rem;
              padding: 4px 6px;
              border-width: 1.5px 0 1.5px 1.5px;
              border-radius: 5px 0 0 5px;
              color: var(--ft-weakened);
            }
          }
        }
      }
    }
  }

  // search history
  .search-navi .ctl-search-result {
    display: inline-flex;
    justify-content: flex-start;
    align-items: center;
    width: auto;
    min-width: 45%;

    @media only screen and (max-width: v.$TabletSize) {
      margin-top: 10px;
    }

    .section-select-history {
      display: inline-flex;
      justify-content: flex-start;
      align-items: center;

      .select-history {
        margin-left: 2.5px;
        position: relative;

        &::after {
          content: "";
          position: absolute;
          top: 12px;
          right: 10px;
          width: 8px;
          height: 8px;
          border-style: solid;
          border-bottom-width: 2px;
          border-left-width: 2px;
          border-top: none;
          border-right: none;
          opacity: 0.5;
          transform: scale(0.8, 1.2) rotate(-45deg);
          pointer-events: none;
        }
      }
    }
  }

  .result-msg {
    margin: 18px 3rem 2px;
    line-height: 1.5;
    .appendix-msg {
      color: var(--msg-success);
    }
    @media only screen and (max-width: v.$TabletSize) {
      margin: 15px 15px 0;
    }
  }
</style>