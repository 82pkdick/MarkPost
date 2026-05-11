<!-- Archive Icon -->
<i class="icon inline switch-icon edit-props-icon">
  <svg data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <title>show post property</title>
  <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75a4.5 4.5 0 0 1-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 1 1-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 0 1 6.336-4.486l-3.276 3.276a3.004 3.004 0 0 0 2.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852Z"></path>
  <path stroke-linecap="round" stroke-linejoin="round" d="M4.867 19.125h.008v.008h-.008v-.008Z"></path>
  </svg>
</i>

<style lang="scss">
  @use "$lib/styles/mixin.scss" as mixin;

  .icon.inline.edit-props-icon {
    width: 24px;
    height: 24px;
    svg {
      fill: var(--icon-color-default);
      fill-opacity: 0.5;
      stroke-width: 0.5;
      width: 100%;
      height: 100%;
      transform:rotate(43deg);

      @include mixin.hover-action {
        fill: var(--icon-hover);
      }
    }
  }
</style>