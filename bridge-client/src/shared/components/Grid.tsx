import React from 'react';
import Masonry from "react-masonry-css";


export default function Grid({columns = 2, className = "grid", columnClassName = "grid-column", ...props}): JSX.Element {
    return <Masonry breakpointCols={{default: columns}} className={className} columnClassName={columnClassName}>
        {props.children}
    </Masonry>
}