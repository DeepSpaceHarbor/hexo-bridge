import { NonIdealState } from "@blueprintjs/core";
import React from "react";

export default function GenericError() {
  return (
    <NonIdealState
      icon="error"
      title="Oh no! Something bad happened 😟 "
      description="Can you check if everything is ok with hexo? Maybe reload this page?"
    />
  );
}
