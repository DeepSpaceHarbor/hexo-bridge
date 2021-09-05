const frontMatterHelper = require("hexo-front-matter");

export function parsePageData(pageData: object) {
  try {
    // @ts-ignore
    const parsed = frontMatterHelper.parse(pageData.raw);
    const meta = (({ _content, ...others }) => ({ ...others }))(parsed);
    if (!meta.title) {
      // @ts-ignore
      meta.title = pageData.title || "";
    }
    if (!meta.date) {
      // @ts-ignore
      meta.date = pageData.date || new Date().toISOString();
    }
    return { content: parsed._content, meta: meta };
  } catch (error: any) {
    console.error("Error while parsing page data.", error);
    throw new Error(error);
  }
}

export function parsePostData(postData: object) {
  try {
    // @ts-ignore
    const parsed = frontMatterHelper.parse(postData.raw);
    const meta = (({ _content, ...others }) => ({ ...others }))(parsed);
    if (!meta.title) {
      // @ts-ignore
      meta.title = postData.title || "";
    }

    if (!meta.categories) {
      meta.categories = [];
    }

    if (!meta.tags) {
      meta.tags = [];
    }
    if (!meta.date) {
      // @ts-ignore
      meta.date = postData.date || new Date().toISOString();
    }
    return { content: parsed._content, meta: meta };
  } catch (error: any) {
    console.error("Error while parsing post data.", error);
    throw new Error(error);
  }
}

export function validateRequiredPostMetadataFields(data: string) {
  let meta = frontMatterHelper.parse(data);
  if (!meta.title) {
    // @ts-ignore
    meta.title = "Hello world";
  }

  if (!meta.categories) {
    meta.categories = [];
  }

  if (!meta.tags) {
    meta.tags = [];
  }
  if (!meta.date) {
    // @ts-ignore
    meta.date = new Date().toISOString();
  }
  return meta;
}

export function validateRequiredPageMetadataFields(data: string) {
  let meta = frontMatterHelper.parse(data);
  if (!meta.title) {
    // @ts-ignore
    meta.title = "Hello world";
  }
  return meta;
}
