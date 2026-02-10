//-- 個別記事のデータ
export interface PostData {
	date: string;
	description: string;
	fileDir: string;
	filePath: string;
	postId: string;
	section: string;
	sitename: string;
	source: string;
	sourceDate: string;
	tags: string[];
	thumbnail: string;
	title: string;
	url: string;
}

//-- ページのデータ
export interface LoadedPageData {
	pageinfo: {
		NextURL: string;
		NumberOfPosts: string;
		PageName: string;
		PageType: string;
		PageURL: string;
		Pagenumber: string;
		PrevURL: string | null;
		TotalNumberOfPosts: string;
		TotalPages: string;
	},
		posts: PostData[];
}

// //-- ページのデータ、ページ番号付加
// export interface PageInfo {
// 	number: string;
// 	pageData: PageData;
// }
