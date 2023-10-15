import { createContext, useMemo } from "react";
import useAPI from "./useAPI";
import { Extension } from "@uiw/react-codemirror";
import { githubDarkInit, githubLight } from "@uiw/codemirror-theme-github";
import { tags as t } from "@lezer/highlight";

//See _bridge.yml file for all possible config options.
export type UserPreferences = {
  //Editor
  editorDarkMode: boolean;
  editorFontSize: number;
  editorTheme: Extension;
  //All posts page
  post_list_itemsPerPage: number;
  post_list_showCategories: boolean;
  post_list_showTags: boolean;
  //All pages page
  page_list_itemsPerPage: number;
};

const defaultUserPreferences: UserPreferences = {
  editorDarkMode: false,
  editorFontSize: 14,
  editorTheme: githubLight,
  post_list_itemsPerPage: 7,
  post_list_showCategories: true,
  post_list_showTags: true,
  page_list_itemsPerPage: 7,
};

export const UserPreferencesContext = createContext<UserPreferences>(defaultUserPreferences);

const bridgeDarkTheme = githubDarkInit({
  settings: {
    lineHighlight: "#080808",
  },
  styles: [
    {
      tag: t.link,
      color: "#56c8d8",
      textDecoration: "underline",
      textUnderlinePosition: "under",
    },
    {
      tag: [t.url],
      color: "#facf4e",
    },
    {
      tag: [t.processingInstruction],
      color: "#ff5f52",
    },
  ],
});

export function UserPreferencesContextProvider({ children }: React.PropsWithChildren) {
  const { data, loading } = useAPI({
    method: "GET",
    url: "settings/bridge/getAsJson",
  });

  const userPreferences: UserPreferences = useMemo(() => {
    return {
      ...data,
      editorTheme: data.editorDarkMode ? bridgeDarkTheme : githubLight,
    };
  }, [data]);

  return (
    <UserPreferencesContext.Provider value={loading ? defaultUserPreferences : userPreferences}>
      {children}
    </UserPreferencesContext.Provider>
  );
}
