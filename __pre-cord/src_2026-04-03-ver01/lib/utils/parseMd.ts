import { marked } from 'marked';
import createDOMPurify from 'dompurify';

const parseMd = async (mdText: string ) => {
  try {
    const cleanContent = createDOMPurify.sanitize(mdText, { 
      ADD_TAGS: ["iframe"], ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling'] 
    });
    const html = marked.parse(cleanContent);

    return html;
  } catch(error) {
    throw new Error(`An error occurred in parseMd: ${error}`);
  }
};

export default parseMd;
