import { json, error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import type { LoadedSectionsData } from "$lib/types";
import { default as config } from "$lib/app-config";
import { getTimeStamp } from "$lib/utils/locationUtils";

//-- Sections by Category に対する Getハンドラ
export const GET: RequestHandler = async ({ fetch }) => {
  const timestamp = getTimeStamp();

  let dataUrlBase = '';
  let dataUrl = '';
  
  if (import.meta.env.MODE === 'production') {
    dataUrlBase = `${config.JsonDataHostUrl.production}/${config.JsonDataBasePath}`;
  } else {
    dataUrlBase = `${config.JsonDataHostUrl.development}/${config.JsonDataBasePath}`;
  }

  dataUrl = `${dataUrlBase}/data/section-by-category.json?v=${timestamp}`;

  try {
    const response = await fetch(dataUrl);

    if (!response.ok) {
      throw error(404, 'Can not get sections list.');
    }

    const sectiondata: LoadedSectionsData[] = await response.json();
    
    return json( sectiondata );

  } catch(err) {
    console.error(`${err}`);
    return json({ message: `${err}` }, { status: 404 });
  }
};