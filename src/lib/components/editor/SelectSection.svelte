<script lang="ts">
import { resolve } from '$app/paths';
import type { SectionItem } from "$lib/types";
import { getCurrentPost } from "$lib/index.svelte";
import { delTrSlash } from '$lib/utils/locationUtils';
import { default as config } from '$lib/app-config';

const currentPost = getCurrentPost();

let sections: SectionItem[] = $state([]);

let initSection = $derived(currentPost.section);
let newSection = $derived(currentPost.newSection);

$effect(() => {
  // console.log('A01 currentPost.section: ', currentPost.section);
  // console.log('A02 initSection: ', initSection);
  // console.log('A03 newSection: ', newSection);
  // console.log('A04 selected: ', selected);
});


let selected = $state('');

const baseUrl = delTrSlash(resolve('/'));

const fetchSectionsData = async () => {
  const response = await fetch(`${baseUrl}/api/sections/list`);
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

const setThisSection = () => {
  if (newSection !== '') {
    selected = newSection;
  } else {
    if (!initSection || initSection === '') {
      selected = `${config.DefaultSection}`;
    } else {
      selected = initSection;
    }
  }
};

$effect.pre(() => {
  setSectionsList();
});

$effect(() => {
  setThisSection();
});

const handleSetSection = (e: Event) => {
  const target = e.target as HTMLSelectElement;
  e.preventDefault();
  let selectedValue = target.value;
  if (currentPost.section !== selectedValue) {
    currentPost.newSection = selectedValue;
    newSection = selectedValue;
    selected = selectedValue;
  }
};
</script>

<select
  name="section"
  id="selectSection"
  class="select-section"
  bind:value={selected}
  onchange={(e) => handleSetSection(e)}
>
  <!-- {#each sections as section, index (section.id)} -->
  {#each sections as section, index (section.id)}
    <option
      value={section.name}
      data-section-id={section.id}
      data-item-index={index + 1}
      selected={section.name === selected ? true : undefined}
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