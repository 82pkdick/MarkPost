import fs from "node:fs";
import ejs from "ejs";
import { json, error } from "@sveltejs/kit";
import { pathSettings } from '$lib/server/settings';
import { getTimeStamp } from "$lib/utils/locationUtils";
import type { RequestHandler } from "./$types";
import type { LoadedPostData } from "$lib/types";
import matter from "gray-matter";
import { default as config } from "$lib/app-config";
import { moveFile } from "$lib/utils/cmd-utils.js";

//-- テンプレートファイルの読み込み
const readTmpl = (): string => {
  let templPath = pathSettings.PostTemplate;
  let templ = fs.readFileSync(templPath, 'utf-8');
  return templ;
};

//-- Post id n に対する Getハンドラ
export const GET: RequestHandler = async ({ params, request, fetch }) => {
  const timestamp = getTimeStamp();

  let postId = '';
  let dataUrl = '';
  let dataUrlBase = '';

  if (import.meta.env.MODE === 'production') {
    dataUrlBase = `${config.JsonDataHostUrl.production}/${config.JsonDataBasePath}`;
  } else {
    dataUrlBase = `${config.JsonDataHostUrl.development}/${config.JsonDataBasePath}`;
  }

  if (params.pid) {
    postId = params.pid;
  }

  dataUrl = `${dataUrlBase}/posts/${postId}/index.json?v=${timestamp}`;

  try {
    const response = await fetch(dataUrl);

    if (!response.ok) {
      throw error(404, 'Unknown post id.');
    }

    const postdata: LoadedPostData = await response.json();

    return json( postdata );
  } catch(err) {
    console.error(`${err}`);
    return json({ message: `${err}` }, { status: 404 });
  }
};

//-- Post id n に対する PUT(update)ハンドラ
export const PUT: RequestHandler = async ({ params, request }) => {
  const { pid } = params;
  const { postData } = await request.json();

  const contentsDir = pathSettings.MdFilePath;
  const fileDir = `${contentsDir}/${postData.section}/${postData.postId}`;
  const filepath = `${fileDir}/${config.PostFilename}`;

  try {
    const fileContent = fs.readFileSync(filepath, 'utf-8');

    const { data, content } = matter(fileContent);

    const body = content;
    postData.content = body.trimStart();

    //--- データに newSection があり、section と違ったセクションなら移動
    let moveflag = false;
    let movedest = "";
    if (postData.newSection && postData.newSection !== '' && postData.newSection !== postData.section) {
      moveflag = true;
      movedest = `${contentsDir}/${postData.newSection}`;
    }

    //--- アップデート対象のファイルが存在しないならエラー
    if (!fs.existsSync(filepath)) {
      throw new Error('Post File not Exist!')
    }

    //--- テンプレートを元にファイルを書き出す.
    const updateTempl = readTmpl();
    const updatedContent = ejs.render(updateTempl, postData)

    fs.writeFileSync(filepath, updatedContent);

    //-- セクション変更の場合、いったん元のファイルに書き込んでから変更先セクションに移動
    if (moveflag) {
      await moveFile('', fileDir, movedest);
    }

    return json({ postId: pid, message: 'post update success.', ok: true }, { status: 200 });
  } catch(error) {
    console.error(error);
    const errMsg = error instanceof Error ? error.message : `post update failed. on /api/post/${pid} PUT`;
    console.error(errMsg);
    return json({ postId: pid, message: errMsg, ok: false }, { status: 400 });
  }
};

//-- Post id n に対する DELETEハンドラ
export const DELETE: RequestHandler = async ({ params, request }) => {
  const { pid } = params;
  const { postSection } = await request.json();

  const contentsDir = pathSettings.MdFilePath;
  const fileDir = `${contentsDir}/${postSection}/${pid}`;

  //--ゴミ箱
  const trashfolder = pathSettings.TrashFolder;

  try {
    const response = await moveFile('', fileDir, trashfolder);

    if (!response.ok) {
      throw new Error(response.message);
    } else {
      return json({ postId: pid, message: response.message, ok: true }, { status: 200 });
    }
  } catch(error) {
    const errMsg = error instanceof Error ? error.message : `delete post failed. on /api/post/${pid} DELETE`;
    console.error(errMsg);
    return json({ postId: pid, message: errMsg, ok: false }, { status: 500 });
  }
};