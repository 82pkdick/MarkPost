<!-- Search Icon -->
<i class="icon inline search-icon switch-icon">
  <svg class="svg-icon" x="0" y="0" width="56" height="56" viewBox="0 0 24 24">
    <title>search</title>
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
</i>

<style lang="scss">
  @use "$lib/styles/mixin.scss" as mixin;

  .icon.inline.search-icon {
    position: relative;
    top: 10;
    left: 0;
    svg {
      position: relative;
      fill-opacity: 0;
      stroke-width: 0.7;
    }
    @include mixin.hover-action {
      svg {
        fill-opacity: 0.2;
        stroke-width: 1.0;
      }
    }
  }
</style>
