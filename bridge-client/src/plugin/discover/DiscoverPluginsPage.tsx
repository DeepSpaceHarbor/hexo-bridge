import Navigation from "../../shared/components/Navigation";
import React, { useEffect, useState } from "react";
import NavigationPlugins from "../NavigationPlugins";
import { AxiosRequestConfig } from "axios";
import { ControlGroup, Divider, InputGroup, Spinner, Tag } from "@blueprintjs/core";
import useAPI from "../../shared/useAPI";
import GenericError from "../../shared/components/GenericError";
import PluginsGrid from "./PluginsGrid";
import TagList from "./TagList";
import { getPageItems } from "../../shared/helpers/pagingHelpers";
import Pagination from "../../shared/components/Pagination";
import search from "../../shared/helpers/searchHelper";
import { Plugin } from "../types/types";

const discoverAddonsAPI: AxiosRequestConfig = {
  method: "GET",
  url: "plugins/getAll",
};
export default function DiscoverPluginsPage() {
  const { loading: isLoading, error, data: allAddons } = useAPI(discoverAddonsAPI);
  const [selectedTag, setSelectedTag] = useState("all");
  const [currentAddonSelection, setCurrentAddonSelection] = useState<Plugin[]>(new Array<Plugin>());
  const itemsPerPage = 6;
  const [currentPageItems, setCurrentPageItems] = useState<Plugin[]>(new Array<Plugin>());
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  useEffect(() => {
    if (allAddons.all) {
      resetSelection();
    } //eslint-disable-next-line
  }, [allAddons]);

  function resetSelection() {
    setCurrentAddonSelection(allAddons.all.plugins);
    setSelectedTag("all");
    setCurrentPageNumber(1);
    setCurrentPageItems(getPageItems(allAddons.all.plugins, 1, itemsPerPage));
  }

  function onTagChange(newTag: string) {
    setSelectedTag(newTag);
    setCurrentAddonSelection(allAddons[newTag].plugins);
    setCurrentPageNumber(1);
    setCurrentPageItems(getPageItems(allAddons[newTag].plugins, 1, itemsPerPage));
  }

  function onSearch(searchQuery: string) {
    onTagChange("all");
    const searchResult = search(searchQuery, allAddons.all.plugins, ["name", "description"]);
    setCurrentAddonSelection(searchResult);
    setCurrentPageNumber(1);
    setCurrentPageItems(getPageItems(searchResult, 1, itemsPerPage));
  }

  function onPageChange(newPage: number) {
    setCurrentPageNumber(newPage);
    setCurrentPageItems(getPageItems(currentAddonSelection, newPage, itemsPerPage));
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
            count={Math.ceil(currentAddonSelection.length / itemsPerPage)}
            currentPage={currentPageNumber}
            onChange={onPageChange}
          />
        </ControlGroup>

        <div className="grid-preview-container">
          <PluginsGrid plugins={currentPageItems} />
          <TagList allAddons={allAddons} selected={selectedTag} onChange={onTagChange} />
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <NavigationPlugins />
      {getCurrentState()}
    </>
  );
}
