import React, {useEffect, useState} from "react";
import HtmlPreview from "./HtmlPreview";
import useAPI from "../useAPI";

export default function MarkdownPreview({content}: { content: string }) {
    const [htmlContent, setHtmlContent] = useState("");
    const {execute: renderContent} = useAPI({
        method: 'POST',
        url: "render",
        data: {
            text: content
        }
    }, true);

    useEffect(() => {
        const renderMarkdown = async () => {
            try {
                const res = await renderContent();
                // @ts-ignore
                setHtmlContent(res.data);
            } catch (error) {
                console.error("Unable to render markdown content.", error);
            }
        }
        renderMarkdown();
        //eslint-disable-next-line
    }, [content]);

    return <HtmlPreview code={htmlContent} className="markdown-preview-editor"/>
}