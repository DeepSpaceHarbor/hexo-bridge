import React from "react";
import { Elevation } from "@blueprintjs/core";
import { Link } from "react-router-dom";
import { Card, Divider } from "@blueprintjs/core";
import type { Page } from "./types/types";
type PageCardProps = {
  page: Page;
  selectedPage: Page;
  setSelectedPage: (page: Page) => void;
};

export default function PageCard({ page, selectedPage, setSelectedPage }: PageCardProps) {
  return (
    <Card className="card-list-item" interactive elevation={Elevation.ZERO} onClick={() => setSelectedPage(page)}>
      <Link className={page._id === selectedPage._id ? "selected-item" : undefined} to={`/page/edit/${page._id}`}>
        <b>{page.title}</b>
      </Link>
      <Divider />
      <p className="bp4-text-muted">
        {new Date(page.date).toLocaleString(undefined, {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}{" "}
      </p>
    </Card>
  );
}
