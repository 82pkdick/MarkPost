<script lang="ts">
  type PutNewTagProps = {
    addHandler: Function;
  };

  let { addHandler }: PutNewTagProps = $props();

  let newtag = $state("");

  const clearInput = () => {
    newtag = "";
  };

  const addNewTag = async () => {
    if (newtag === "") {
      return;
    }
    addHandler(newtag);
    clearInput();
  };
</script>

<div class="new-tag flex-l-center">
  <input
    type="text"
    class="new-tag-input"
    id="inputtedTag"
    placeholder="Input New Tag"
    bind:value={newtag}
  />
  <button type="button" class="form-btn del-input" onclick={clearInput}>
    ✕
  </button>
  <div class="put-new-tag-btn flex-center">
    <button
      type="button"
      class="form-btn add-new-tag"
      onclick={addNewTag}>Add</button
    >
  </div>
</div>

<style lang="scss">
  @use '$lib/styles/mixin.scss' as mixin;

  .new-tag {
    position: relative;
    height: 3rem;

    input[type="text"].new-tag-input {
      width: 100%;
      max-width: 20rem;
      height: 2.6rem;
      margin: 0;
      border: 1px solid var(--thin-bdr);
      background-color: var(--form-parts-bg);
    }
    button.del-input {
      position: relative;
      top: 3px;
      right: 40px;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      width: 1.2rem;
      height: 1.5rem;
      max-width: 1.2rem;
      max-height: 1.5rem;
      min-width: 1.2rem;
      min-height: 1.5rem;
      margin-top: 2px;
      margin-right: 2px;
      padding: 14px;
      color: var(--ft-weakened);
      background-color: var(--bg-default);
      border: 1px solid var(--thin-bdr-light);
      pointer-events: auto;
      opacity: 0.8;
      z-index: 1000;
    }
    .put-new-tag-btn {
      position: relative;
      top: 0;
      left: -20px;
      margin-left: 0px;
      width: 4.5rem;
      height: 2rem;

      button.add-new-tag {
        width: 4rem;
        height: 38px;
        min-width: 75px;
        min-height: 32px;
        margin: auto;
        padding: 0;
        text-align: center;

        @include mixin.hover-action {
          width: 4.5rem;
          height: 40px;
          font-size: 102%;
          color: var(--link-color-hover);
        }
      }
    }
  }
</style>