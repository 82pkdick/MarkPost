<script lang="ts">
  import DelSearchIcon from "$lib/icons/del-search-icon.svelte";
  
  const { initHandler }: { initHandler: Function } = $props();
  
  // --- 検索文字列の削除 ---
  const handleClick = () => {
    initHandler();
  };
</script>

<div id="ctlSearchInput" class="ctl-search-input">
  <button type="button" class="navi-ctn init-search-btn" onclick={handleClick}>
    <DelSearchIcon />
  </button>
</div>

<style lang="scss">
  @use '$lib/styles/scss-variables' as v;
  @use '$lib/styles/mixin.scss' as mixin;
  
  .ctl-search-input {
    position: relative;
    top: 0;
    left: 0;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 32px;
    height: 32px;
    padding: 2px;
    border-style: solid;
    border-width: 1.5px 1.5px 1.5px 2px;
    border-radius: 0 5px 5px 0;
    border-color: var(--bdr-color-default);
    button.navi-ctn.init-search-btn {
      position: relative;
      top: 0;
      left: 0;
      margin: 0;
      padding: 1px;
      width: fit-content;
      height: fit-content;
      min-width: 29px;
      min-height: 29px;
      background-color: transparent;
      border: none;
    }
  }
</style>