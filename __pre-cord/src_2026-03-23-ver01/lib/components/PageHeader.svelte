<script lang="ts">
  let { pageName }: { pageName: string } = $props();
</script>

<div class="list-title-block">
  <h4 class="list-title fs-x09">{pageName}</h4>
</div>

<style lang="scss">
  .list-title-block {
    display: flex;
    justify-content: flex-start;
    align-items: baseline;
    margin-bottom: -10px;
    .list-title {
      margin-top: 0;
      margin-bottom: 0;
      font-size: clamp(0.9rem, 0.775rem + 0.4vw, 1rem);
      line-height: 2rem;
      color: var(--ft-weakened);
    }
  }
</style>