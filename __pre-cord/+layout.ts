import type { LayoutLoad } from './$types'

// export const trailingSlash = 'always';

export const load: LayoutLoad = async ({ fetch }) => {
  // 全ページで使用する共通データ
  // const navigation = await fetch('/api/navigation').then(r => r.json());
  
  const dummy = { val: 123 };
  return {
    dummy
  };
};