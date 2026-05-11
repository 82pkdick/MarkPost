import { json, error } from "@sveltejs/kit";
import { getTimeStamp } from "$lib/utils/locationUtils";
import type { RequestHandler } from "./$types";
import type { LoadedPageData } from "$lib/types";
import { default as config } from "$lib/app-config";

//-- Tags Page number n に対する Getハンドラ
export const GET: RequestHandler = async ({ params, fetch }) => {
  const timestamp = getTimeStamp();

  let tagName = '';
  let pageNumber = 0;
  let dataUrl = '';
  let dataUrlBase = '';

  if (import.meta.env.MODE === 'production') {
    dataUrlBase = `${config.JsonDataHostUrl.production}/${config.JsonDataBasePath}`;
  } else {
    dataUrlBase = `${config.JsonDataHostUrl.development}/${config.JsonDataBasePath}`;
  }

  if (params.name) {
    tagName = params.name;
  }

  if (params.num) {
    pageNumber = parseInt(params.num, 10);
  }

  if (pageNumber === 1) {
    dataUrl = `${dataUrlBase}/tags/${tagName}/index.json?v=${timestamp}`;    
  } else {
    dataUrl = `${dataUrlBase}/tags/${tagName}/page/${pageNumber}/index.json?v=${timestamp}`;
  } 
  
  try {
    const response = await fetch(dataUrl);

    if (!response.ok) {
      throw error(404, 'Unknown page number.');
    }

    const pagedata: LoadedPageData = await response.json();

    return json( pagedata );
  } catch(err) {
    console.error(`${err}`);
    return json({ message: `${err}` }, { status: 404 });
  }
};