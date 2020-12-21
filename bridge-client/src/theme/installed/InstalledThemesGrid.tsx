import React, {useState} from "react";
import Grid from "../../shared/components/Grid";
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import InstalledThemeCard from "./InstalledThemeCard";
import {Theme} from "../types/types";
import {NonIdealState} from "@blueprintjs/core";

export default function InstalledThemesGrid({themes}: { themes: Theme[] }) {

    const [showLightbox, setShowLightbox] = useState(false);
    const [lightboxSrc, setLightboxSrc] = useState("");
    const [lightboxTitle, setLightboxTitle] = useState();
    const [lightboxCaption, setLightboxCaption] = useState();

    function getLightbox() {
        if (showLightbox) {
            return <Lightbox mainSrc={lightboxSrc} onCloseRequest={() => {
                setShowLightbox(false)
            }} imageTitle={lightboxTitle} imageCaption={lightboxCaption}/>
        }
    }

    function getState() {
        if (themes.length === 0) {
            return <NonIdealState icon="search"
                                  title="Oh snap!"
                                  description="I can't find the theme you're looking for."
            />;
        }
        return <>
            <Grid columns={2}>
                {
                    themes.map((theme: any) => {
                        return <InstalledThemeCard theme={theme}
                                                   key={`${theme.name}|${theme.link}`}
                                                   setLightboxSrc={setLightboxSrc}
                                                   setLightboxTitle={setLightboxTitle}
                                                   setLightboxCaption={setLightboxCaption}
                                                   setShowLightbox={setShowLightbox}/>
                    })
                }
            </Grid>
            {getLightbox()}
        </>
    }


    return getState();
}