<script lang="ts">
  import SearchIcon from "$lib/icons/search-icon.svelte";

  const { searchHandler }: { searchHandler: Function } = $props();

  // --- 検索の実行 ---
  const handleClick = () => {
    searchHandler();
  };
</script>

<div id="searchBtn" class="search-btn hdr-navi">
  <button type="button" class="navi-ctn search-btn" onclick={handleClick}>
    <SearchIcon />
  </button>
</div>

<style lang="scss">
  @use '$lib/styles/scss-variables' as v;
  @use '$lib/styles/mixin.scss' as mixin;
  
  .search-btn.hdr-navi {
    position: relative;
    top: 2px;
    left: 10px;
    button.navi-ctn.search-btn {
      position: relative;
      top: 0;
      left: 0;
      margin: 0;
      padding: 0;
      width: fit-content;
      height: fit-content;
      min-width: 29px;
      min-height: 29px;
      background-color: transparent;
      border: none;
    }
  }
</style>