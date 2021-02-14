import { AnchorButton, ButtonGroup, Card, Divider, Tag } from "@blueprintjs/core";
import React from "react";
import { InstalledTheme } from "../types/types";

export type InstalledThemeCardProps = {
  theme: InstalledTheme;
  setLightboxSrc: (src: string) => void;
  setLightboxTitle: any; //TODO: find a way to implement better type for this.
  setLightboxCaption: any; //TODO: find a way to implement better type for this.
  setShowLightbox: (showLightbox: boolean) => void;
};

export default function InstalledThemeCard({
  theme,
  setLightboxSrc,
  setLightboxTitle,
  setLightboxCaption,
  setShowLightbox,
}: InstalledThemeCardProps) {
  return (
    <Card className="margin" key={`${theme.name}|${theme.link}`}>
      <h2>
        {theme.name}
        {theme.isActive && (
          <Tag intent="success" style={{ marginLeft: "5px" }}>
            Active
          </Tag>
        )}
      </h2>
      {theme.screenshot && (
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
      )}
      {theme.description && (
        <>
          <p>{theme.description}</p>
          <Divider />
        </>
      )}

      {theme.tags &&
        theme.tags.map((tag: any) => {
          return (
            <Tag key={tag} minimal className="margin">
              {tag}
            </Tag>
          );
        })}
      <Divider />

      <span style={{ display: "flex" }}>
        <span style={{ flexGrow: 1 }} />
        <ButtonGroup>
          {theme.preview && (
            <AnchorButton
              outlined
              text="Demo"
              icon="share"
              href={theme.preview}
              target="_blank"
              rel="noopener noreferrer"
            />
          )}
          {theme.link && (
            <AnchorButton
              outlined
              text="Website"
              icon="link"
              href={theme.link}
              target="_blank"
              rel="noopener noreferrer"
            />
          )}
        </ButtonGroup>
      </span>
    </Card>
  );
}
