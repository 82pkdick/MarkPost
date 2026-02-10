import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import type { LoadedPageData } from "$lib/types";

export const load: PageLoad = async ({ fetch }) => {
  const response = await fetch('/markpost/api/page/1');
  // const response = await fetch('/api/page/1');

  if (!response.ok) {
    error(404, { message: 'Page not found' });
  }

  const pagedata: LoadedPageData = await response.json();

  // console.log('X01 response.ok: ', response.ok);
  // console.log('X01 response.status: ', response.status);
  // console.log('X02 response data: ', pagedata.pageinfo);
  
  return { number: '1', pageData: pagedata };
};