import { error } from "@sveltejs/kit";
import { resolve } from '$app/paths';
import type { PageLoad } from "./$types";
import type { LoadedPageData } from "$lib/types";

export const load: PageLoad = async ({ params, fetch }) => {
  const sectionName = params.name;

  const base = resolve('/');

  const response = await fetch(`${base}api/sections/${sectionName}`);

  if (!response.ok) {
    error(404, { message: 'Page not found' });
  }

  const pagedata: LoadedPageData = await response.json();

  return { name: sectionName, pageData: pagedata };
};