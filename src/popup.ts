import { HistoryList } from './components/HistoryList';
import { TopBar } from './components/TopBar';

import type { FormattedHistoryItem, HistoryItem } from './types';

(async (): Promise<void> => {
    const benchStart = performance.now();

    const appContainerEl = document.getElementById('app');

    if (!appContainerEl) {
        return;
    }

    const allItems = await browser.storage.local.get();
    const allItemsEntries = Object.entries(allItems);

    let formattedHistory: FormattedHistoryItem[] = [];

    for (let i = 0; i < allItemsEntries.length; i++) {
        if (allItemsEntries[i][0].startsWith('video_')) {
            const historyItem: HistoryItem = allItemsEntries[i][1] as HistoryItem;

            formattedHistory.push({
                ...historyItem,
                searchChannel: historyItem.channel.toLowerCase(),
                searchTitle: historyItem.title.toLowerCase()
            });
        }
    }

    formattedHistory = formattedHistory.sort((a, b) => (a.updated > b.updated ? -1 : 1));

    console.debug(
        'Benchmark: Loading & formatting data: ' + (performance.now() - benchStart) + ' ms'
    );

    let filteredHistory = formattedHistory;

    const onSearchInput = (searchString: string): void => {
        const searchBenchStart = performance.now();

        const lowerSearchString = searchString.toLowerCase().trim();

        if (lowerSearchString.length > 1) {
            filteredHistory = [...formattedHistory].filter((entry) => {
                if (
                    entry.searchChannel.includes(lowerSearchString) ||
                    entry.searchTitle.includes(lowerSearchString)
                ) {
                    return true;
                }

                return false;
            });
        } else {
            filteredHistory = [...formattedHistory];
        }

        console.debug(
            'Benchmark: Search filtering: ' + (performance.now() - searchBenchStart) + ' ms'
        );

        HistoryList({ containerEl: appContainerEl, history: filteredHistory });
    };

    TopBar({ containerEl: appContainerEl, onSearchInput: onSearchInput });
    HistoryList({ containerEl: appContainerEl, history: filteredHistory });

    document.getElementById('searchInput')?.focus();
})();
