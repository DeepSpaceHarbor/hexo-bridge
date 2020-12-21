export default function search(searchQuery: string,
                               allItems: Object[],
                               searchKeys: string[]): any[] {

    const query = searchQuery.trim().toLowerCase();
    if (query.length === 0) {
        return allItems;
    }

    return allItems.filter(
        (item) => {
            let searchThrough = "";
            searchKeys.forEach((searchKey: string) => {
                if (item.hasOwnProperty(searchKey)) {
                    // @ts-ignore
                    searchThrough += item[searchKey].trim().toLowerCase();
                }
            })
            return searchThrough.includes(query);
        }
    );
}