<script lang="ts">
  import type { PageData } from "./$types";

  const { data }: { data: PageData } = $props();

  let pageData = $derived(data.pageData);
  // const pageData = data.pageData;

  $effect(() => {
    console.log('A02 pageData: ', pageData);
    // console.log('A01 page data: ', $state.snapshot(data));
    // console.log('A02 data: ', data);
  });
</script>

<article>
  <h1>List Page {pageData.pageinfo.Pagenumber}</h1>
</article>