import type { RequestHandler } from "./$types";
import { json } from "@sveltejs/kit";
import { createNewArchive } from "$lib/utils/cmd-utils";

//-- 新規記事のアーカイブ(HTML)を生成するための Putハンドラ
export const PUT: RequestHandler = async () => {
  try {
    //-- build new post archive --
    const response = await createNewArchive();

    return json({ ok: true, message: response.message }, { status: 200 });
  } catch(error) {
    console.error(`${error}`);
    return json({ ok: false, message: `${error}` }, { status: 500 });
  }
};