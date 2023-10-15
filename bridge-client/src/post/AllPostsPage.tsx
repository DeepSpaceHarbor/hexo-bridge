import React, { useContext, useEffect, useState } from "react";
import Navigation from "../shared/components/Navigation";
import { ControlGroup, Divider, InputGroup, Spinner } from "@blueprintjs/core";
import useAPI from "../shared/useAPI";
import Pagination from "../shared/components/Pagination";
import { sortByDate } from "../shared/helpers/sortByDate";
import { getPageItems } from "../shared/helpers/pagingHelpers";
import GenericError from "../shared/components/GenericError";
import { AxiosRequestConfig } from "axios";
import PostList from "./PostList";
import search from "../shared/helpers/searchHelper";
import type { Post } from "./types/types";
import { UserPreferencesContext } from "../shared/userPreferencesContext";

const getAllPostsAPI: AxiosRequestConfig = {
  method: "GET",
  url: "posts/getAll",
};

export default function AllPostsPage() {
  //All posts on the website.
  const { loading: isLoading, error, data: allPosts } = useAPI(getAllPostsAPI);
  //All posts which match the user criteria. Ex: posts which contain hexo in the title.
  const [currentPostSelection, setCurrentPostSelection] = useState<Post[]>(new Array<Post>());
  //Paging related
  const userPreferences = useContext(UserPreferencesContext);
  const postsPerPage = userPreferences.post_list_itemsPerPage;
  const [currentPagePosts, setCurrentPagePosts] = useState<Post[]>(new Array<Post>());
  const [currentPageNumber, setCurrentPageNumber] = useState(1);

  //Init
  useEffect(resetPostSelection, [allPosts, postsPerPage]);

  function resetPostSelection() {
    const sorted = allPosts.sort(sortByDate);
    setCurrentPostSelection(sorted);
    setCurrentPageNumber(1);
    setCurrentPagePosts(getPageItems(sorted, 1, postsPerPage));
  }

  //Search by title
  function searchByTitle(searchQuery: string) {
    const searchResult = search(searchQuery, allPosts, ["title"]).sort(sortByDate);
    const firstPage = getPageItems(searchResult, 1, postsPerPage);
    setCurrentPostSelection(searchResult);
    setCurrentPagePosts(firstPage);
    setCurrentPageNumber(1);
  }

  function onPageChange(newPage: number) {
    setCurrentPageNumber(newPage);
    setCurrentPagePosts(getPageItems(currentPostSelection, newPage, postsPerPage));
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
        <ControlGroup fill={false} vertical={false}>
          <InputGroup
            leftIcon="search"
            placeholder="Search"
            className="search-input"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => searchByTitle(event.target.value)}
          />
          <Divider />
          <Pagination
            count={Math.ceil(currentPostSelection.length / postsPerPage)}
            currentPage={currentPageNumber}
            onChange={onPageChange}
          />
        </ControlGroup>
        <div className="list-preview-container">
          <PostList
            posts={currentPagePosts}
            showCategories={userPreferences.post_list_showCategories}
            showTags={userPreferences.post_list_showTags}
          />
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
