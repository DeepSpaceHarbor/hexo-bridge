import React from "react";

export default function HtmlPreview({code, className = ""}: { code: string, className?: string }): JSX.Element {
    return <div className={className} dangerouslySetInnerHTML={{__html: code}}/>;
}