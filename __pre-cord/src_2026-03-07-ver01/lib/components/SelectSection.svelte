<script lang="ts">
import type { SectionItem } from "$lib/types";
import { currentPostIns as currentPost } from "$lib/index.svelte";

let sections: SectionItem[] = $state([]);

let selected = $state();

const fetchSectionsData = async () => {
  const response = await fetch('/api/sections/list');
  const data: SectionItem[] = await response.json();
  if (data.length > 0) {
    sections = data;
  } else {
    throw new Error("セクションのデータ取得中にエラー");
  }
};

const setSectionsList = () => {
  try {
    fetchSectionsData();
  } catch (error) {
    console.error(`${error}`);
  }
};

$effect.pre(() => {
  setSectionsList();
});

$effect(() => {
  let section = currentPost.section;
  // セクション未定の場合の初期値は"unsorted"
  if (!section) {
    section = "unsorted";
  }
  selected = section;
});

const handleSetSection = (e: Event) => {
  const target = e.target as HTMLSelectElement;
  e.preventDefault();
  let selectedValue = target.value;
  currentPost.section = selectedValue;
};
</script>

<select
  name="section"
  id="selectSection"
  class="select-section"
  bind:value={selected}
  onchange={(e) => handleSetSection(e)}
>
  {#each sections as section, index (section.id)}
    <option
      value={section.name}
      data-section-id={section.id}
      data-item-index={index + 1}
    >
      {section.title}
    </option>
  {/each}
</select>

<style lang="scss">
  .select-section {
    display: block;
    width: auto;
    min-width: 12rem;
    font-family: inherit;
    font-size: inherit;
    margin-right: 6px;
    margin-bottom: 6px;
    padding: 8px;
    border: none;
    border-radius: 6px;
    outline: none;
    background-color: var(--form-parts-bg);
    appearance: auto;
  }
</style>