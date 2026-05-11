import { json, error } from "@sveltejs/kit";
import { getTimeStamp } from "$lib/utils/locationUtils";
import type { RequestHandler } from "./$types";
import type { LoadedPageData } from "$lib/types";
import { default as config } from "$lib/app-config";

//-- Sections Page Get Handler
export const GET: RequestHandler = async ({ params, fetch }) => {
  const timestamp = getTimeStamp();

  let sectionName = '';
  let dataUrl = '';
  let dataUrlBase = '';

  if (import.meta.env.MODE === 'production') {
    dataUrlBase = `${config.JsonDataHostUrl.production}/${config.JsonDataBasePath}`;
  } else {
    dataUrlBase = `${config.JsonDataHostUrl.development}/${config.JsonDataBasePath}`;
  }

  if (params.name) {
    sectionName = params.name;
  }

  dataUrl = `${dataUrlBase}/sections/${sectionName}/index.json?v=${timestamp}`;

  try {
    const response = await fetch(dataUrl);

    if (!response.ok) {
      throw error(404, `Can not get section ${sectionName} page.`);
    }

    const pagedata: LoadedPageData = await response.json();

    return json( pagedata );
  } catch(err) {
    console.error(`${err}`);
    return json({ message: `${err}` }, { status: 404 });
  }
};