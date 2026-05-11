import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import type { SearchPostData } from "$lib/types";

export const load: PageLoad = async ({ params, fetch }) => {
  const response = await fetch(`/api/searchdata`);

  if (!response.ok) {
    error(404, { message: 'Search data not found' });
  }

  const data: SearchPostData[] = await response.json();

  return { searchData: data };
};