<script lang="ts">
  import type { PageData } from "./$types";

  const { data }: { data: PageData } = $props();

  let pageNumber = $derived(data.number);
  let pageData = $derived(data.pageData);

  $effect(() => {
    // console.log('in list/[num] pageNumber: ', pageNumber);
    // console.log('in list/[num] pageData: ', pageData);
  });
</script>

<article>
  <h1>Page {pageNumber} : 記事一覧</h1>

  <ul>
    {#each pageData.posts as post }
    <li>
      <h3>{post.title}</h3>
      <p>{post.description}</p>
    </li>
    {/each}
  </ul>
</article>