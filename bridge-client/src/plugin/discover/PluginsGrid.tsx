import React from "react";
import {Card, Divider, NonIdealState, Tag} from "@blueprintjs/core";
import Grid from "../../shared/components/Grid";
import {Plugin} from "../types/types";

export default function PluginsGrid({plugins}: { plugins: Plugin[] }) {
    function getState() {
        if (plugins.length === 0) {
            return <NonIdealState icon="search"
                                  title="Oh snap!"
                                  description="I can't find the plugin you're looking for."
            />;
        }
        return <Grid columns={2}>
            {
                plugins.map((plugin: Plugin) => {
                    return <Card className="margin" key={plugin.link}>
                        <h3><a href={plugin.link} target="_blank" rel="noopener noreferrer">{plugin.name}</a></h3>
                        <p>
                            {plugin.description}
                        </p>
                        <Divider/>
                        {plugin.tags.map((tag: string) => {
                            return <Tag key={tag} minimal className="margin">{tag}</Tag>
                        })}
                    </Card>
                })
            }
        </Grid>
    }

    return getState();
}