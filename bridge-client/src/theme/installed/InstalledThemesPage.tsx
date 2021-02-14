import Navigation from "../../shared/components/Navigation";
import React, { useEffect, useState } from "react";
import { AxiosRequestConfig } from "axios";
import { ControlGroup, Divider, InputGroup, Spinner } from "@blueprintjs/core";
import useAPI from "../../shared/useAPI";
import GenericError from "../../shared/components/GenericError";
import InstalledThemesGrid from "./InstalledThemesGrid";
import { getPageItems } from "../../shared/helpers/pagingHelpers";
import Pagination from "../../shared/components/Pagination";
import NavigationTheme from "../NavigationTheme";
import search from "../../shared/helpers/searchHelper";
import { InstalledTheme } from "../types/types";

const installedThemesAPI: AxiosRequestConfig = {
  method: "GET",
  url: "theme/getInstalled",
};
export default function InstalledThemesPage() {
  const { loading: isLoading, error, data: allThemes } = useAPI(installedThemesAPI);
  const [currentThemeSelection, setCurrentThemeSelection] = useState<InstalledTheme[]>(new Array<InstalledTheme>());
  const itemsPerPage = 6;
  const [currentPageItems, setCurrentPageItems] = useState<InstalledTheme[]>(new Array<InstalledTheme>());
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  useEffect(() => {
    if (allThemes) {
      resetSelection();
    } //eslint-disable-next-line
  }, [allThemes]);

  function resetSelection() {
    setCurrentThemeSelection(allThemes);
    setCurrentPageNumber(1);
    setCurrentPageItems(getPageItems(allThemes, 1, itemsPerPage));
  }

  function onSearch(searchQuery: string) {
    const searchResult = search(searchQuery, allThemes, ["name", "description"]);
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
          <Pagination
            count={Math.ceil(currentThemeSelection.length / itemsPerPage)}
            currentPage={currentPageNumber}
            onChange={onPageChange}
          />
        </ControlGroup>
        <div className="grid-preview-container">
          <InstalledThemesGrid themes={currentPageItems} />
        </div>
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
