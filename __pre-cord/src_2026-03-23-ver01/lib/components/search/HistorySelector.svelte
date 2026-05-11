<script module>
let selected = $state();

  // 検索実行後にセレクターを初期化
  export const initSelector = () => {
    selected = "default";
  };
</script>

<script lang="ts">
  const { qlist, setHandler }: { qlist: string[]; setHandler: Function } = $props();
  
  let history = $derived(qlist);

  const selectQuery = (event: Event) => {
    const target = event.target as HTMLSelectElement;
    event.preventDefault();
    let selectedValue = target.value;
    setHandler(selectedValue);
  };
</script>

<select
  id="selectHistoryList"
  name="select-history"
  class="select-history-list"
  bind:value={selected}
  onchange={(e) => selectQuery(e)}
>
  <option value="default"></option>
  {#if history && history.length > 0}
    {#each history as item, index}
      <option data-item-idx={index + 1} value={item}>{item}</option>
    {/each}
  {/if}
</select>

<style lang="scss">
  @use '$lib/styles/scss-variables' as v;
  @use '$lib/styles/mixin.scss' as mixin;
  
  // SELECT FORM
  .select-history-list {
    display: inline-block;
    margin: 0;
    padding: 0 0.5em;
    width: 200px;
    height: 32px;
    overflow: hidden;
    border-width: 0.5px;
    border-style: solid;
    border-color: var(--bdr-color-default);
    box-shadow: none;
    background-color: var(--bg-front);
    // Select Menu Arrow
    appearance: none;
    > option {
      display: block;
      width: auto;
      box-shadow: none;
      background-color: var(--bg-front);
      color: var(--default-ft-color);
    }
  }
</style>