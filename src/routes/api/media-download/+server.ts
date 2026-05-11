import type { RequestHandler } from "./$types";
import { json, error } from "@sveltejs/kit";
import { mediaDownload } from "$lib/utils/cmd-utils";

/** 
 * POST handler for post media download 
 * mediaDownload に記事のIDを渡して新規記事のリソースをダウンロード
 */
export const POST: RequestHandler = async ({ request }) => {
  const data = await request.json();

  const postId: string = data.postId;

  try {
    const res = await mediaDownload(postId);

    if (res.ok) {
      return json({ ok: true, message: 'download resources for the new post success.' }, { status: 200 });
    } else {
      error(500, {
        message: res.message
      });
    }
  } catch(error) {
    const errMsg = error instanceof Error ? error.message : 'download resources for the new post failed. on /api/media-download PUT';
    console.error(errMsg);
    return json({ ok: false, message: errMsg }, { status: 400 });
  }
};