import fs from "node:fs";
import { json, error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { default as config } from '$lib/app-config';
import { pathSettings } from "$lib/server/settings";
import { buildArchive } from "$lib/utils/cmd-utils";

//-- MarkDownloader の作業ファイルから記事IDを読み込む
const readPostId = (filePath: string) => {
  let info = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(info);
  const { postId } = data; 
  return postId;
};

export const GET: RequestHandler = async () => {
  // let defaultSection = config.DefaultSection;

  // const medialistFile = pathSettings.MarkDownloaderMedialist;
  // const postId = readPostId(medialistFile);

  try {
    //-- rebuild one post archive --
    
    // const response = await buildArchive({ section: defaultSection, postId: postId });

    // createNewArchive();

    // if (response.ok) {
      // return json({ ok: true, message: response.message }, { status: 200 });
    // } else {
    //   error(500, {
    //     message: response.message
    //   });
    // }
    return json({ ok: true, message: 'success' }, { status: 200 });
  } catch(error) {
    console.error(`${error}`);
    return json({ ok: false, message: `${error}` }, { status: 500 });
  }
};