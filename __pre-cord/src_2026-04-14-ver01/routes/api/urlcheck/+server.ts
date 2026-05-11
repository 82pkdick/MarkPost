import type { RequestHandler } from "./$types";
import { json, error } from "@sveltejs/kit";

//-- URLの有効無効を判定するための POSTハンドラ
export const POST: RequestHandler = async ({ request, fetch }) => {
  const data = await request.json();

  const srcUrl = data.srcUrl;
  
  try {
    const response = await fetch(srcUrl, { method: 'HEAD' });

    const ok = response.ok;
    const resStatus = response.status;
    const statusText = response.statusText;

    if (ok && resStatus === 200) {
      return json({ ok: true, message: 'URLは正常です.' }, { status: 200 });
    } else {
      error(resStatus, {
        message: statusText
      });
    }
  } catch(error) {
    console.error(`${error}`);
    const errMsg = error instanceof Error ? error.message : 'そのURLのページは見つかりません.';
    return json({ ok: false, message: errMsg }, { status: 404 });
  }
};