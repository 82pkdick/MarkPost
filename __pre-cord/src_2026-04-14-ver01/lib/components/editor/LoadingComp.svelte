<script lang="ts">
  import { resolve } from '$app/paths';
  import { delTrSlash } from '$lib/utils/locationUtils';

  const baseUrl = delTrSlash(resolve('/'));
  const loadingImg = `${baseUrl}/images/Loading_icon.gif`;

  interface LoadingCompProps {
    isLoading: boolean;
    position: string;
  }

  let { isLoading, position }: LoadingCompProps = $props();

  let isOn = $derived(isLoading);

  $effect(() => {
    // console.log('A01 isOn: ', isOn);
  });
</script>

{#if isOn}
  <div class="spinner {position}">
    <img src={loadingImg} alt="loading..." />
  </div>
{/if}

<style>
  .spinner {
    z-index: 1000;
    margin: 0 25px 10px;

    &.fixed {
      position: fixed;
    }

    &.relative {
      position: relative;
    }

    img {
      width: 40px;
      height: 40px;
    }
  }
</style>
