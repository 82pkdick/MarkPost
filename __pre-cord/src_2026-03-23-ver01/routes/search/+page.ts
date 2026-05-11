import { error } from "@sveltejs/kit";
import { resolve } from '$app/paths';
import type { PageLoad } from "./$types";
import type { SearchPostData } from "$lib/types";

const base = resolve('/');

export const load: PageLoad = async ({ params, fetch }) => {
  const response = await fetch(`${base}api/searchdata`);

  if (!response.ok) {
    error(404, { message: 'Search data not found' });
  }

  const data: SearchPostData[] = await response.json();

  return { searchData: data };
};