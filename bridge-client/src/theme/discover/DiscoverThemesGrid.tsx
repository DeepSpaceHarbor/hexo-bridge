import React, { useMemo, useState } from "react";
import Grid from "../../shared/components/Grid";
import DiscoverThemeCard from "./DiscoverThemeCard";
import { NonIdealState } from "@blueprintjs/core";
import type { Theme } from "../types/types";
import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";

export default function DiscoverThemesGrid({ themes }: { themes: Theme[] }) {
  const [showLightbox, setShowLightbox] = useState(false);
  const [lightBoxIndex, setLightBoxIndex] = useState(0);
  const themesSlides = useMemo(() => {
    return themes.map((theme: Theme) => {
      return {
        src: theme.screenshot,
        title: theme.name,
        alt: theme.name,
        description: theme.description,
      };
    });
  }, [themes]);

  function getState() {
    if (themes.length === 0) {
      return <NonIdealState icon="search" title="Oh snap!" description="I can't find the theme you're looking for." />;
    }
    return (
      <>
        <Lightbox
          open={showLightbox}
          close={() => setShowLightbox(false)}
          plugins={[Captions]}
          carousel={{
            finite: true,
          }}
          index={lightBoxIndex}
          slides={themesSlides}
        />
        <Grid columns={2}>
          {themes.map((theme: Theme, index) => {
            return (
              <DiscoverThemeCard
                theme={theme}
                key={`${theme.name}|${theme.link}`}
                showLightbox={() => {
                  setShowLightbox(true);
                  setLightBoxIndex(index);
                }}
              />
            );
          })}
        </Grid>
      </>
    );
  }

  return getState();
}
