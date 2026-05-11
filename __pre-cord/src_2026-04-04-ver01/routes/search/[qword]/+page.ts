import { error } from "@sveltejs/kit";
import { resolve } from '$app/paths';
import { delTrSlash } from "$lib/utils/locationUtils";
import type { PageLoad } from "./$types";
import type { SearchPostData } from "$lib/types";

export const load: PageLoad = async ({ params, fetch }) => {
  const baseUrl = delTrSlash(resolve('/'));
  const response = await fetch(`${baseUrl}/api/searchdata`);

  if (!response.ok) {
    error(404, { message: 'Search data not found' });
  }

  const data: SearchPostData[] = await response.json();

  return { searchData: data };
};