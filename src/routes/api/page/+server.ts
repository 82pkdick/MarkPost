import { json, type RequestHandler } from "@sveltejs/kit";
import { getTimeStamp } from "$lib/utils/locationUtils";

//-- Page number 1 に対する Getハンドラ
export const GET: RequestHandler = async ({ request, fetch }) => {
  const timestamp = getTimeStamp();
  const dataUrl = `/site-resources/json/index.json?v=${timestamp}`;
  // console.log('S01 dataUrl: ', dataUrl);
  try {
    const response = await fetch(dataUrl);
    const pageData = await response.json();
    // console.log('S02: ', data);

    return json({ pageData: pageData });
  } catch(err) {
    console.error(`${err}`);
    return json({ message: `${err}` }, { status: 400 });
  }
};