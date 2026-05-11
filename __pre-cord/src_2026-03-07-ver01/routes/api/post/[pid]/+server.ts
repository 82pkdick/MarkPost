import { json, error } from "@sveltejs/kit";
import { getTimeStamp } from "$lib/utils/locationUtils";
import type { RequestHandler } from "./$types";
import type { LoadedPostData } from "$lib/types";
import { default as config } from "$lib/app-config";

//-- Post id n に対する Getハンドラ
export const GET: RequestHandler = async ({ params, request, fetch }) => {
  const timestamp = getTimeStamp();

  let postId = '';
  let dataUrl = '';
  let dataUrlBase = '';

  if (import.meta.env.MODE === 'production') {
    dataUrlBase = `${config.JsonDataHostUrl.production}/${config.JsonDataBasePath}`;
  } else {
    dataUrlBase = `${config.JsonDataHostUrl.development}/${config.JsonDataBasePath}`;
  }

  if (params.pid) {
    postId = params.pid;
  }

  dataUrl = `${dataUrlBase}/posts/${postId}/index.json?v=${timestamp}`;

  try {
    const response = await fetch(dataUrl);

    if (!response.ok) {
      throw error(404, 'Unknown post id.');
    }

    const postdata: LoadedPostData = await response.json();

    return json( postdata );
  } catch(err) {
    console.error(`${err}`);
    return json({ message: `${err}` }, { status: 404 });
  }
};