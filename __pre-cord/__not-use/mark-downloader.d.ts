declare const createNewPost: ({ source, postId }: {
    source: string;
    postId?: string | undefined;
}) => Promise<{
    ok: boolean;
} | undefined>;
export default createNewPost;
//# sourceMappingURL=mark-downloader.d.ts.map