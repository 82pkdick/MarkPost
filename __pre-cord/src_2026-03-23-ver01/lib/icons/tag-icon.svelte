<i class="icon inline switch-icon tag-icon">
  <svg data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <title>open tags list</title>
    <path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z"></path>
    <path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6Z"></path>
  </svg>
</i>

<style lang="scss">
  @use "$lib/styles/mixin.scss" as mixin;
  
  .icon.inline.tag-icon {
    svg {
      fill: none;
      width: 100%;
      height: 100%;
      @include mixin.hover-action {
        stroke-width: 1.5;
      }
    }
  }
</style>