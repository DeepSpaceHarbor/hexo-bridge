import Navigation from "../../shared/components/Navigation";
import React, { useEffect, useState } from "react";
import { AxiosRequestConfig } from "axios";
import { ControlGroup, Divider, InputGroup, Spinner, Tag } from "@blueprintjs/core";
import useAPI from "../../shared/useAPI";
import GenericError from "../../shared/components/GenericError";
import DiscoverThemesGrid from "./DiscoverThemesGrid";
import TagList from "../../plugin/discover/TagList";
import { getPageItems } from "../../shared/helpers/pagingHelpers";
import Pagination from "../../shared/components/Pagination";
import NavigationTheme from "../NavigationTheme";
import search from "../../shared/helpers/searchHelper";
import type { Theme } from "../types/types";

const discoverAddonsAPI: AxiosRequestConfig = {
  method: "GET",
  url: "theme/getAll",
};
export default function DiscoverThemesPage() {
  const { loading: isLoading, error, data: allThemes } = useAPI(discoverAddonsAPI);
  const [selectedTag, setSelectedTag] = useState("all");
  const [currentThemeSelection, setCurrentThemeSelection] = useState<Theme[]>(new Array<Theme>());
  const itemsPerPage = 6;
  const [currentPageItems, setCurrentPageItems] = useState<Theme[]>(new Array<Theme>());
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  useEffect(() => {
    if (allThemes.all) {
      resetSelection();
    } //eslint-disable-next-line
  }, [allThemes]);

  function resetSelection() {
    setCurrentThemeSelection(allThemes.all.themes);
    setSelectedTag("all");
    setCurrentPageNumber(1);
    setCurrentPageItems(getPageItems(allThemes.all.themes, 1, itemsPerPage));
  }

  function onTagChange(newTag: string) {
    setSelectedTag(newTag);
    setCurrentThemeSelection(allThemes[newTag].themes);
    setCurrentPageNumber(1);
    setCurrentPageItems(getPageItems(allThemes[newTag].themes, 1, itemsPerPage));
  }

  function onSearch(searchQuery: string) {
    onTagChange("all");
    const searchResult = search(searchQuery, allThemes.all.themes, ["name", "description"]);
    setCurrentThemeSelection(searchResult);
    setCurrentPageNumber(1);
    setCurrentPageItems(getPageItems(searchResult, 1, itemsPerPage));
  }

  function onPageChange(newPage: number) {
    setCurrentPageNumber(newPage);
    setCurrentPageItems(getPageItems(currentThemeSelection, newPage, itemsPerPage));
  }

  function getCurrentState() {
    if (isLoading) {
      return <Spinner />;
    }
    if (error) {
      return <GenericError />;
    }
    return (
      <>
        <ControlGroup>
          <InputGroup
            className="search-input"
            leftIcon="search"
            placeholder="Search"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              onSearch(event.target.value);
            }}
          />
          <Divider />
          <Tag icon="tag" minimal className="margin">
            <b>{selectedTag}</b>
          </Tag>
          <Divider />
          <Pagination
            count={Math.ceil(currentThemeSelection.length / itemsPerPage)}
            currentPage={currentPageNumber}
            onChange={onPageChange}
          />
        </ControlGroup>

        <div className="grid-preview-container">
          <DiscoverThemesGrid themes={currentPageItems} />
          <TagList allAddons={allThemes} selected={selectedTag} onChange={onTagChange} />
        </div>
        <span style={{ display: "flex" }}>
          <span style={{ flexGrow: 1 }} />
          <span style={{ marginRight: "15vw" }}>
            <Pagination
              count={Math.ceil(currentThemeSelection.length / itemsPerPage)}
              currentPage={currentPageNumber}
              onChange={(newPage: number) => {
                window.scrollTo({
                  top: 0,
                });
                onPageChange(newPage);
              }}
            />
          </span>
        </span>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <NavigationTheme />
      {getCurrentState()}
    </>
  );
}
