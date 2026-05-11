import type { RequestHandler } from "./$types";
import { json } from "@sveltejs/kit";
import { buildResources } from "$lib/utils/cmd-utils";

//-- リソースをアップデートするための Getハンドラ
export const GET: RequestHandler = async ({ fetch }) => {
  
  try {
    //-- rebuild all resource data --
    const response = await buildResources();

    return json({ ok: true, message: response.message }, { status: 200 });
  } catch(error) {
    console.error(`${error}`);
    return json({ ok: false, message: `${error}` }, { status: 500 });
  }
};