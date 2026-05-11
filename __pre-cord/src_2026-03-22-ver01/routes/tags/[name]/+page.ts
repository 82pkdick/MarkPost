import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import type { LoadedPageData } from "$lib/types";

export const load: PageLoad = async ({ params, fetch }) => {
  const tagName = params.name;

  const response = await fetch(`/api/tags/${tagName}`);

  if (!response.ok) {
    error(404, { message: 'Page not found' });
  }

  const pagedata: LoadedPageData = await response.json();

  return { name: tagName, pageData: pagedata };
};