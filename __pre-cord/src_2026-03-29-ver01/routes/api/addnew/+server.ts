import type { RequestHandler } from "./$types";
import { json, error } from "@sveltejs/kit";
import { markDownload } from "$lib/utils/cmd-utils";

/** 
 * POST handler for add new post 
 * markDownload(外部コマンド)にソースURLを渡して新規記事を作成
 */
export const POST: RequestHandler = async ({ params, request }) => {
  const data = await request.json();

  const siteUrl = data.siteUrl;

  try {
    const res = await markDownload(siteUrl);

    if (res.ok) {
      return json({ message: 'create new post success.', ok: true }, { status: 200 });
    } else {
      error(500, {
        message: res.message
      });
    }
  } catch(error) {
    console.error(error);
    const errMsg = error instanceof Error ? error.message : 'create new post failed. on /api/addnew PUT';
    console.error(errMsg);
    return json({ message: errMsg, ok: false }, { status: 400 });
  }

  return json({ success: true });
};