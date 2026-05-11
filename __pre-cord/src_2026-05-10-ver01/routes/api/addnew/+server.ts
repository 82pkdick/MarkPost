import type { RequestHandler } from "./$types";
import { json, error } from "@sveltejs/kit";
import { markDownload } from "$lib/utils/cmd-utils";

/** 
 * POST handler for add new post 
 * markDownload にソースURLを渡して新規記事を作成
 */
export const POST: RequestHandler = async ({ request, fetch }) => {
  const data = await request.json();

  const srcUrl: string = data.srcUrl;
  const postId: string = data.postId;

  try {
    const res = await markDownload(srcUrl, postId);

    if (res.ok) {
      return json({ message: 'create new post success.', ok: true }, { status: 200 });
    } else {
      error(500, {
        message: res.message
      });
    }
  } catch(error) {
    const errMsg = error instanceof Error ? error.message : 'create new post failed. on /api/addnew PUT';
    console.error(errMsg);
    return json({ message: errMsg, ok: false }, { status: 400 });
  }
};