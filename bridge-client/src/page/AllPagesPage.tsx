import React, { useEffect, useState } from "react";
import Navigation from "../shared/components/Navigation";
import useAPI from "../shared/useAPI";
import { ControlGroup, Divider, InputGroup, Spinner } from "@blueprintjs/core";
import { sortByDate } from "../shared/helpers/sortByDate";
import { getPageItems } from "../shared/helpers/pagingHelpers";
import Pagination from "../shared/components/Pagination";
import PageList from "./PageList";
import { AxiosRequestConfig } from "axios";
import GenericError from "../shared/components/GenericError";
import search from "../shared/helpers/searchHelper";
import type { Page } from "./types/types";

//API Config section
const getAllPagesAPI: AxiosRequestConfig = {
  method: "GET",
  url: "pages/getAll",
};
const getUserPrefsAPI: AxiosRequestConfig = {
  method: "GET",
  url: "settings/bridge/getAsJson",
};

export default function AllPagesPage() {
  //All pages on the website.
  const { loading: isLoading, error, data: allPages } = useAPI(getAllPagesAPI);
  //All pages which match the user criteria. Ex: pages which contain hexo in the title.
  const [currentPageSelection, setCurrentPageSelection] = useState<Page[]>(new Array<Page>());
  //Paging related
  const { loading: isUserPrefsLoading, data: userPrefs } = useAPI(getUserPrefsAPI);
  const itemsPerPage = userPrefs.page_list_itemsPerPage || 4;
  const [currentPageItems, setCurrentPageItems] = useState<Page[]>(new Array<Page>());
  const [currentPageNumber, setCurrentPageNumber] = useState(1);

  //Init
  useEffect(resetPageSelection, [allPages, itemsPerPage]);

  function resetPageSelection() {
    const sorted = allPages.sort(sortByDate);
    setCurrentPageSelection(sorted);
    setCurrentPageNumber(1);
    setCurrentPageItems(getPageItems(sorted, 1, itemsPerPage));
  }

  //Search by title
  function searchByTitle(searchQuery: string) {
    const searchResult = search(searchQuery, allPages, ["title"]).sort(sortByDate);
    const firstPage = getPageItems(searchResult, 1, itemsPerPage);
    setCurrentPageSelection(searchResult);
    setCurrentPageItems(firstPage);
    setCurrentPageNumber(1);
  }

  function onPageChange(newPage: number) {
    setCurrentPageNumber(newPage);
    setCurrentPageItems(getPageItems(currentPageSelection, newPage, itemsPerPage));
  }

  function getCurrentState() {
    if (isLoading || isUserPrefsLoading) {
      return <Spinner />;
    }
    if (error) {
      return <GenericError />;
    }
    return (
      <>
        <ControlGroup fill={false} vertical={false}>
          <InputGroup
            className="search-input"
            leftIcon="search"
            placeholder="Search"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => searchByTitle(event.target.value)}
          />
          <Divider />
          <Pagination
            count={Math.ceil(currentPageSelection.length / itemsPerPage)}
            currentPage={currentPageNumber}
            onChange={onPageChange}
          />
        </ControlGroup>
        <div className="list-preview-container">
          <PageList pages={currentPageItems} />
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      {getCurrentState()}
    </>
  );
}
