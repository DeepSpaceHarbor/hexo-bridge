import { AnchorButton, ButtonGroup, Card, Divider, Tag } from "@blueprintjs/core";
import React from "react";
import { Theme } from "../types/types";

export type DiscoverThemeCardProps = {
  theme: Theme;
  showLightbox: () => void;
};

export default function DiscoverThemeCard({ theme, showLightbox }: DiscoverThemeCardProps) {
  return (
    <>
      <Card className="margin" key={theme.link}>
        <h2>
          <a href={theme.link} target="_blank" rel="noopener noreferrer">
            {theme.name}
          </a>
        </h2>
        <div
          style={{ cursor: "pointer" }}
          onClick={() => {
            showLightbox();
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
    </>
  );
}
