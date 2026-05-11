import { error } from "@sveltejs/kit";
import { resolve } from '$app/paths';
import type { PageLoad } from "./$types";
import type { LoadedPageData } from "$lib/types";

export const load: PageLoad = async ({ params, fetch }) => {
  const pageNumber = params.num;

  const base = resolve('/');
  const response = await fetch(`${base}api/page/${pageNumber}`);

  if (!response.ok) {
    error(404, { message: 'Page not found' });
  }

  const pagedata: LoadedPageData = await response.json();

  return { number: pageNumber, pageData: pagedata };
};