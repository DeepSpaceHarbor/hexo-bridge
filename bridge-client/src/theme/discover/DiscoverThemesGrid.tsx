import React, { useState } from "react";
import Grid from "../../shared/components/Grid";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import DiscoverThemeCard from "./DiscoverThemeCard";
import { NonIdealState } from "@blueprintjs/core";
import type { Theme } from "../types/types";

export default function DiscoverThemesGrid({ themes }: { themes: Theme[] }) {
  const [showLightbox, setShowLightbox] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState("");
  const [lightboxTitle, setLightboxTitle] = useState("");
  const [lightboxCaption, setLightboxCaption] = useState("");

  function getLightbox() {
    if (showLightbox) {
      return (
        <Lightbox
          mainSrc={lightboxSrc}
          onCloseRequest={() => {
            setShowLightbox(false);
          }}
          imageTitle={lightboxTitle}
          imageCaption={lightboxCaption}
        />
      );
    }
  }

  function getState() {
    if (themes.length === 0) {
      return <NonIdealState icon="search" title="Oh snap!" description="I can't find the theme you're looking for." />;
    }
    return (
      <>
        <Grid columns={2}>
          {themes.map((theme: Theme) => {
            return (
              <DiscoverThemeCard
                theme={theme}
                key={`${theme.name}|${theme.link}`}
                setLightboxSrc={setLightboxSrc}
                setLightboxTitle={setLightboxTitle}
                setLightboxCaption={setLightboxCaption}
                setShowLightbox={setShowLightbox}
              />
            );
          })}
        </Grid>
        {getLightbox()}
      </>
    );
  }

  return getState();
}
