import { json, error } from "@sveltejs/kit";
import { getTimeStamp } from "$lib/utils/locationUtils";
import type { RequestHandler } from "./$types";
import type { LoadedPageData } from "$lib/types";
import { default as config } from "$lib/app-config";

//-- Tags Page Get Handler
export const GET: RequestHandler = async ({ params, fetch }) => {
  const timestamp = getTimeStamp();

  let tagName = '';
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

  dataUrl = `${dataUrlBase}/tags/${tagName}/index.json?v=${timestamp}`;

  try {
    const response = await fetch(dataUrl);

    if (!response.ok) {
      throw error(404, `Can not get tag ${tagName} page.`);
    }

    const pagedata: LoadedPageData = await response.json();

    return json( pagedata );
  } catch(err) {
    console.error(`${err}`);
    return json({ message: `${err}` }, { status: 404 });
  }
};