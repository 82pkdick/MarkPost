<!-- Del-Search Icon -->
<i class="icon inline del-search-icon switch-icon">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="24px"
    viewBox="0 -960 960 960"
    width="24px"
    fill="#333"
  >
    <title>close preview tab</title>
    <path
      d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"
    /></svg
  >
</i>

<style lang="scss">
  @use "$lib/styles/mixin.scss" as mixin;

  .icon.inline.del-search-icon {
    svg {
      position: relative;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      fill-opacity: 0.3;

      @include mixin.hover-action {
        fill-opacity: 0.5;
      }
    }
  }
</style>
