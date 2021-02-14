import { AnchorButton, ButtonGroup, Card, Divider, Tag } from "@blueprintjs/core";
import React from "react";
import { Theme } from "../types/types";

export type DiscoverThemeCardProps = {
  theme: Theme;
  setLightboxSrc: (src: string) => void;
  setLightboxTitle: any; //TODO: find a way to implement better type for this.
  setLightboxCaption: any; //TODO: find a way to implement better type for this.
  setShowLightbox: (showLightbox: boolean) => void;
};

export default function DiscoverThemeCard({
  theme,
  setLightboxSrc,
  setLightboxTitle,
  setLightboxCaption,
  setShowLightbox,
}: DiscoverThemeCardProps) {
  return (
    <Card className="margin" key={theme.link}>
      <h2>
        <a href={theme.link} target="_blank" rel="noopener noreferrer">
          {theme.name}
        </a>
      </h2>
      <div
        style={{ cursor: "pointer" }}
        onClick={() => {
          setLightboxSrc(theme.screenshot);
          setLightboxTitle(<b>{theme.name}</b>);
          setLightboxCaption(<b>{theme.description}</b>);
          setShowLightbox(true);
        }}
      >
        <img src={theme.screenshot} alt={theme.name} style={{ maxWidth: "30vw" }} />
      </div>
      <p>{theme.description}</p>
      <Divider />

      {theme.tags.map((tag: any) => {
        return (
          <Tag key={tag} minimal className="margin">
            {tag}{" "}
          </Tag>
        );
      })}

      <Divider />
      <span style={{ display: "flex" }}>
        <span style={{ flexGrow: 1 }} />
        <ButtonGroup>
          <AnchorButton
            outlined
            text="Demo"
            icon="share"
            href={theme.preview}
            target="_blank"
            rel="noopener noreferrer"
          />
          <AnchorButton
            outlined
            text="Download"
            icon="import"
            href={theme.link}
            target="_blank"
            rel="noopener noreferrer"
          />
        </ButtonGroup>
      </span>
    </Card>
  );
}
