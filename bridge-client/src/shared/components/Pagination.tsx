import React from "react";
import {Button, ButtonGroup, Intent,} from "@blueprintjs/core";

interface PaginationProps {
    count: number,
    currentPage: number,
    onChange: (newPage: number) => void
}

export default function Pagination({count, currentPage, onChange}: PaginationProps) {

    function calculateStartEnd(): number[] {
        //Bad data cases
        if (count === 0) {
            return [1, 1]
        }
        if (currentPage > count) {
            return [1, 1]
        }

        //First 5 pages
        if (count <= 5) {
            return [1, count];
        }

        //TODO: Simplify start & end page logic.
        //When count > 5, always show 5 buttons.
        let newStart = currentPage - 2;
        if (newStart <= 0) {
            newStart = 1;
        }
        let newEnd = newStart + 4;

        if (newEnd > count) {
            newEnd = count;
        }
        if (newEnd - newStart !== 4) {
            newStart = newEnd - 4;
        }
        return [newStart, newEnd];
    }

    function createPagination() {
        const [start, end] = calculateStartEnd();
        let pagination = [];
        for (let index: number = start; index <= end; index++) {
            pagination.push(index)
        }
        return <>
            <ButtonGroup>
                <Button key="first-page"
                        onClick={() => onChange(1)}
                        disabled={start === 1}
                        icon="double-chevron-left"
                />
                <Button key="previous-page"
                        onClick={() => onChange(currentPage - 1)}
                        disabled={currentPage === 1 || count === 0}
                        icon="chevron-left"

                />
                {
                    pagination.map(pageNumber =>
                        <Button text={pageNumber} key={pageNumber}
                                onClick={() => onChange(pageNumber)}
                                intent={pageNumber === currentPage ? Intent.PRIMARY : Intent.NONE}

                        />
                    )
                }

                <Button key="next-page"
                        onClick={() => onChange(currentPage + 1)}
                        disabled={currentPage === count || count === 0}
                        icon="chevron-right"
                />
                <Button key="last-page"
                        onClick={() => onChange(count)}
                        disabled={start + 5 > count}
                        icon="double-chevron-right"
                />
            </ButtonGroup>
        </>
    }

    return (<>
            <div style={{margin: 5}}>
                {createPagination()}
            </div>
        </>
    )

}