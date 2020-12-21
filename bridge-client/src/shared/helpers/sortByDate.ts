export function sortByDate(first: object, second: object) {
    // @ts-ignore
    const date1 = new Date(first.date);
    // @ts-ignore
    const date2 = new Date(second.date);
    // @ts-ignore
    return date2 - date1;
}