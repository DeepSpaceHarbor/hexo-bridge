export function getPageItems(items: any[], page: number, itemsPerPage: number) {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    if (items.length > end) {
        return items.slice(start, end);
    } else {
        return items.slice(start, items.length);
    }
}