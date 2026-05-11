import { error } from "@sveltejs/kit";
import { resolve } from '$app/paths';
import { delTrSlash } from "$lib/utils/locationUtils";
import type { PageLoad } from "./$types";
import type { LoadedPageData } from "$lib/types";

export const load: PageLoad = async ({ params, fetch }) => {
  const sectionName = params.name;
  const pageNumber = params.num;

  const baseUrl = delTrSlash(resolve('/'));

  const response = await fetch(`${baseUrl}/api/sections/${sectionName}/page/${pageNumber}`);

  if (!response.ok) {
    error(404, { message: 'Page not found' });
  }

  const pagedata: LoadedPageData = await response.json();

  return { name: sectionName, number: pageNumber, pageData: pagedata };
};