<!-- Edit Icon -->
<i class="icon inline edit-icon switch-icon">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="24px"
    viewBox="0 -960 960 960"
    width="24px"
    fill="#333"
  >
    <title>edit post</title>
    <path
      d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h357l-80 80H200v560h560v-278l80-80v358q0 33-23.5 56.5T760-120H200Zm280-360ZM360-360v-170l367-367q12-12 27-18t30-6q16 0 30.5 6t26.5 18l56 57q11 12 17 26.5t6 29.5q0 15-5.5 29.5T897-728L530-360H360Zm481-424-56-56 56 56ZM440-440h56l232-232-28-28-29-28-231 231v57Zm260-260-29-28 29 28 28 28-28-28Z"
    />
  </svg>
</i>

<style lang="scss">
  @use "$lib/styles/mixin.scss" as mixin;

  .icon.inline.edit-icon {
    width: 30px;
    height: 30px;
    svg {
      fill: var(--icon-color-default);
      fill-opacity: 0.5;
      stroke-width: 0.5;
      width: 100%;
      height: 100%;

      @include mixin.hover-action {
        fill: var(--icon-hover);
      }
    }
  }
</style>
