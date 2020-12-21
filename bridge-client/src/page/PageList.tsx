import React, {useState} from "react";
import {NonIdealState} from "@blueprintjs/core";
import PageCard from "./PageCard";
import HtmlPreview from "../shared/components/HtmlPreview";
import type {Page} from "./types/types";

const undefinedPage = {
    _id: "",
    title: "",
    date: "",
    content: ""
}

export default function PageList({pages}: { pages: Page[] }) {
    const [selectedPage, setSelectedPage] = useState<Page>(undefinedPage);

    function getState() {
        if (pages.length === 0) {
            return <NonIdealState icon="path-search"
                                  title="Sorry, I can't find the page you're looking for."
            />;
        }
        return <>
            <div>
                {pages.map(page =>
                    <PageCard key={page._id} page={page} selectedPage={selectedPage} setSelectedPage={setSelectedPage}/>
                )}
            </div>
            <HtmlPreview className="card-preview-panel" code={selectedPage.content}/>
        </>
    }

    return getState();
}
