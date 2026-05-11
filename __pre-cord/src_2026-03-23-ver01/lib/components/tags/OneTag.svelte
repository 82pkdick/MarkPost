<script lang="ts">
type OneTagProps = {
  tag: string;
  index: number;
  delHandler: Function;
};

let { tag, index, delHandler }: OneTagProps = $props();

const handleClick = (event: MouseEvent, title: string) => {
  delHandler(title);
};
</script>

<li
  class="tagitem fs-x09"
  data-tag-id={`tag-${index + 1}`}
  data-tag-title={tag}
>
  <button type="button" class="delmark" onclick={(e) => handleClick(e, tag)}>
    ✕
  </button>
  {tag}
</li>

<style lang="scss">
  .tagitem {
    display: list-item;
    margin-right: 0.4rem;
    margin-bottom: 5px;
    padding: 6px 12px 0 5px;
    border: 1px solid var(--thin-bdr);
    border-radius: 5px;
    background-color: var(--bg-default);

    .delmark {
      position: relative;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      width: 1.2rem;
      height: 1.5rem;
      max-width: 1.2rem;
      max-height: 1.5rem;
      min-width: 1.2rem;
      min-height: 1.5rem;
      margin-right: -3px;
      padding: 0;
      color: var(--ft-weakened);
      background-color: inherit;
      border: none;
      pointer-events: auto;
      z-index: 1000;
      &:hover,
      &:focus,
      &:focus-visible {
        border: none;
        outline: none;
      }
    }
  }
</style>