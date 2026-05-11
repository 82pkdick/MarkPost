import type { RequestHandler } from "./$types";
import { json } from "@sveltejs/kit";
import { buildArchive } from "$lib/utils/cmd-utils";
import { default as config } from '$lib/app-config';

//-- 新規記事のアーカイブ(HTML)を生成するための Putハンドラ
export const POST: RequestHandler = async ({ request }) => {
  const data = await request.json();
  const postId: string = data.postId;
  const sectionName = config.DefaultSection;

  try {
    //-- build new post archive --
    const response = await buildArchive({ section: sectionName, postId: postId });

    return json({ ok: true, message: response.message }, { status: 200 });
  } catch(error) {
    console.error(`${error}`);
    return json({ ok: false, message: `${error}` }, { status: 500 });
  }
};