import type { RequestHandler } from "./$types";
import { json } from "@sveltejs/kit";
import { pathSettings } from '$lib/server/settings';
import { buildArchive, moveFile } from "$lib/utils/cmd-utils";

//-- 単一記事のアーカイブ(HTML)をアップデートするための Putハンドラ
export const PUT: RequestHandler = async ({ params }) => {
  let sectionName = '';
  let postId = '';

  if (params.section) {
    sectionName = params.section;
  }

  if (params.pid) {
    postId = params.pid;
  }

  try {
    //-- rebuild one post archive --
    const response = await buildArchive({ section: sectionName, postId: postId });

    return json({ ok: true, message: response.message }, { status: 200 });
  } catch(error) {
    console.error(`${error}`);
    return json({ ok: false, message: `${error}` }, { status: 500 });
  }
};

//-- 単一記事のアーカイブ(HTML)を削除するための DELETEハンドラ
export const DELETE: RequestHandler = async ({ params }) => {
  const { pid } = params;

  //-- html file
  const fileDir = `${pathSettings.HtmlFilePath}/${pid}`;
  //--ゴミ箱
  const trashfolder = pathSettings.TrashHtmlFolder;

  try {
    const response = await moveFile('', fileDir, trashfolder);

    if (!response.ok) {
      throw new Error(response.message);
    } else {
      return json({ postId: pid, message: response.message, ok: true }, { status: 200 });
    }
  } catch(error) {
    const errMsg = error instanceof Error ? error.message : `delete post(ID: ${pid}) html failed.`;
    console.error(errMsg);
    return json({ postId: pid, message: errMsg, ok: false }, { status: 500 });
  }
};