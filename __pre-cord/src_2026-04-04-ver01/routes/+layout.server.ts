import { pathSettings } from "$lib/server/settings";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async () => {

  return { pathSettings: pathSettings }
}