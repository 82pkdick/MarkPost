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
	postType?: string;
  videoUrl?: string;
  movieArchive?: string;
}

export interface LoadedPostData extends PostData {
	RawContent?: string;
}

export interface SendPostData extends PostData {
	newSection?: string;
}

export interface PageInfo {
	NextURL: string;
	NumberOfPosts: string;
	PageName: string;
	PageType: string;
	PageURL: string;
	Pagenumber: string;
	PrevURL: string | null;
	TotalNumberOfPosts: string;
	TotalPages: string;
}

//-- ページのデータ
export interface LoadedPageData {
	pageinfo: PageInfo;
	posts: LoadedPostData[];
}

export interface SectionType {
	category: string;
	id: string;
	name: string;
	title: string;
	postsCount: number;
}

export interface LoadedSectionsData {
	id: string;
	name: string;
	title: string;
	sections: SectionType[];
}

export interface LoadedTagsData {
	id: number;
  name: string;
  title: string;
  postsCount: number;
}

export interface SectionItem {
  category: string;
  id: string;  
  name: string;
  title: string;
	postsCount?: number;
}

export interface TagItem {
	id: number;
	name: string;
	title: string;
	postsCount?: number;
}

//-- 記事検索関連
export interface SearchPostData extends PostData {
	contentsPlain: string;
}

export interface SearchResultData extends SearchPostData {
	startPos: number;
  endPos: number;
  matchPoints?: {
    start: string;
    match: string;
    end: string;
  }
}

//-- 記事と記事データ、アーカイブの更新等のレスポンス結果
export type responseResult = {
  postId?: string; 
  message: string; 
  ok: boolean;
};