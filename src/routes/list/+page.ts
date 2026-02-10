import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load = (async ({ fetch }) => {
  const response = await fetch('/api/page');
  const { pageData } = await response.json();

  console.log('A01 response.ok: ', response.ok);
  // console.log('X01 pageNumber: ', pageNumber);
  // console.log('X02 response data: ', data.pageinfo);

  if (!response.ok) {
    throw error(404, 'Page not found');
  }

  return { pageData };
}) satisfies PageLoad;;