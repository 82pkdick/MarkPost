import type { RequestHandler } from "./$types";
import { json } from "@sveltejs/kit";
import { buildAllArchives } from "$lib/utils/cmd-utils";

//-- 全ての記事のアーカイブ(HTML)をアップデートするための Getハンドラ
export const GET: RequestHandler = async () => {

  try {
    //-- rebuild all post archives --
    const response = await buildAllArchives();

    return json({ ok: true, message: response.message }, { status: 200 });
  } catch(error) {
    console.error(`${error}`);
    return json({ ok: false, message: `${error}` }, { status: 500 });
  }
};