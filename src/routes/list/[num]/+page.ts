import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import type { LoadedPageData } from "$lib/types";

export const load: PageLoad = async ({ params, fetch }) => {
  // console.log('A01 params: ', params.num);

  const pageNumber = params.num;

  const response = await fetch(`/markpost/api/page/${pageNumber}`);

  if (!response.ok) {
    error(404, { message: 'Page not found' });
  }

  const pagedata: LoadedPageData = await response.json();

  // console.log('X-num-01 response.ok: ', response.ok);
  // console.log('X-num-01 response.status: ', response.status);
  // console.log('X-num-02 pageNumber: ', pageNumber);
  // console.log('X-num-03 response data: ', pagedata.pageinfo);

  
  return { number: pageNumber, pageData: pagedata };
};