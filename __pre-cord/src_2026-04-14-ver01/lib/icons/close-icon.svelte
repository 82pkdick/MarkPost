<!-- Close Icon -->
<i class="icon inline switch-icon close-icon">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="24px"
    viewBox="0 -960 960 960"
    width="24px"
    fill="#333"
  >
    <title>close post panel</title>
    <path
      d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"
    /></svg
  >
</i>

<style lang="scss">
  @use "$lib/styles/mixin.scss" as mixin;

  .icon.inline.close-icon {
    width: 32px;
    height: 32px;
    svg {
      fill: var(--icon-color-default);
      fill-opacity: 0.6;
      stroke-width: 0.5;
      width: 100%;
      height: 100%;

      @include mixin.hover-action {
        fill: var(--icon-hover);
      }
    }
  }
</style>
