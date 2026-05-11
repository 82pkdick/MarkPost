import { mvNLtoSpace, trimStartSpace, replaceContinuousSpace, escapeDoubleQuotes } from '../utils/string-utils.js';
// Site Title
const getTitle = (headEls) => {
    let titleStr = "";
    const titleElem = headEls.getElementsByTagName('title')[0];
    if ((titleElem != undefined) && titleElem.textContent) {
        titleStr = titleElem.textContent;
    }
    else {
        titleStr = "";
    }
    return titleStr;
};
// Head Meta
const getMeta = (headEls) => {
    if (!headEls) {
        return null;
    }
    const meta = Array.from(headEls.getElementsByTagName('meta')).map(v => v);
    return meta;
};
// Site Description
const getDesc = (metaEls) => {
    const descEls = metaEls.filter((v) => {
        return v.getAttribute('name') === 'description';
    });
    const desc = (descEls[0] === undefined ? "" : descEls[0].content);
    return desc;
};
// Article Published Date
const getSourceDate = (metaEls) => {
    const metaDate = metaEls.filter((v) => {
        return v.getAttribute('name') === 'date';
    });
    const metaPubdate = metaEls.filter((v) => {
        return v.getAttribute('name') === 'pubdate';
    });
    let dateData = null;
    if (metaDate[0]) {
        dateData = metaDate[0].content;
    }
    else if (metaPubdate[0]) {
        dateData = metaPubdate[0].content;
    }
    else {
        dateData = '';
    }
    return dateData;
};
// Site OGP
const getOGP = (metaEls) => {
    const metaList = metaEls;
    let ogp = {
        source: '', title: '', description: '', thumbnail: '', sitename: '', videoUrl: '',
    };
    let result = Array.from(metaList).map((v) => {
        const prop = v.getAttribute('property');
        if (!prop)
            return;
        return { prop: prop.replace("og:", ""), content: v.getAttribute("content") };
    }).filter(v => v);
    // OGP not supported
    if (result.length === 0) {
        return ogp;
    }
    else {
        // or Twitter
        let is_twitter = result.filter((v) => {
            return v && v.prop === "site_name";
        });
        if (is_twitter[0] && is_twitter[0].content === "Twitter") {
            return ogp;
        }
    }
    // OGP.url
    for (let v of result) {
        if (v && v.prop) {
            switch (v.prop) {
                case 'url':
                    ogp.source = v.content ? v.content : '';
                    break;
                case 'title':
                    ogp.title = v.content ? v.content : '';
                    break;
                case 'description':
                    ogp.description = v.content ? v.content : '';
                    break;
                case 'image':
                    ogp.thumbnail = v.content ? v.content : '';
                    break;
                case 'site_name':
                    ogp.sitename = v.content ? v.content : '';
                case 'video:url':
                    ogp.videoUrl = v.content ? v.content : '';
                default:
                    break;
            }
        }
    }
    return ogp;
};
// Description の改行や空白の処理
const fixDescSpace = (text) => {
    let text_str = text;
    text_str = mvNLtoSpace(text_str);
    text_str = trimStartSpace(text_str);
    text_str = replaceContinuousSpace(text_str);
    return text_str;
};
// Site Data Completion
const dataComp = (ogp, title, desc, sourceDate, pageUrl) => {
    const site_data = {
        source: '', title: '', description: '', sourceDate: '', thumbnail: '', sitename: '', videoUrl: '',
    };
    const uriobj = new URL(pageUrl);
    const hostname = uriobj.hostname || "";
    // source
    site_data.source = ogp.source ? ogp.source : pageUrl;
    // Title
    let title_text = ogp.title ? ogp.title : title;
    site_data.title = escapeDoubleQuotes(title_text);
    // Description
    let desc_text = ogp.description ? ogp.description : desc;
    desc_text = escapeDoubleQuotes(desc_text);
    site_data.description = fixDescSpace(desc_text);
    // Published Date
    site_data.sourceDate = sourceDate ? sourceDate : "";
    // Image
    site_data.thumbnail = ogp.thumbnail ? ogp.thumbnail : "";
    // Site Name
    site_data.sitename = ogp.sitename ? ogp.sitename : hostname;
    // Video URL (for Youtube)
    site_data.videoUrl = ogp.videoUrl ? ogp.videoUrl : "";
    return site_data;
};
const fetchData = async (headEls, pageUrl) => {
    let title = "", desc = "", sourceDate = "";
    let meta = null;
    let result, ogp;
    result = ogp = { source: '', title: '', description: '', sourceDate: '', thumbnail: '' };
    if (headEls) {
        title = getTitle(headEls);
        meta = getMeta(headEls);
    }
    if (meta) {
        desc = getDesc(meta);
        sourceDate = getSourceDate(meta);
        ogp = getOGP(meta);
    }
    result = dataComp(ogp, title, desc, sourceDate, pageUrl);
    return result;
};
const readSite = async (headEls, pageUrl) => {
    try {
        if (headEls) {
            const result = await fetchData(headEls, pageUrl);
            return result;
        }
    }
    catch (error) {
        throw new Error(`${error}`);
    }
};
export default readSite;
