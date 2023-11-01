import { HistoryList } from './components/HistoryList';
import { TopBar } from './components/TopBar';

import { getFormattedHistoryFromStorage } from './utils';

(async (): Promise<void> => {
    const benchStart = performance.now();

    const appContainerEl = document.getElementById('app');

    if (!appContainerEl) {
        return;
    }

    let formattedHistory = await getFormattedHistoryFromStorage();

    if (!formattedHistory) {
        console.error('Error reading formatted history');

        return;
    }

    formattedHistory = formattedHistory.sort((a, b) => (a.updated > b.updated ? -1 : 1));

    console.debug(`SFYT: Loading & formatting data: ${performance.now() - benchStart} ms`);

    let filteredHistory = formattedHistory;

    const onSearchInput = (searchString: string): void => {
        if (!formattedHistory) {
            return;
        }

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

        console.debug(`SFYT: Search filtering: ${performance.now() - searchBenchStart} ms`);

        if (window.scrollY > 0) {
            window.scrollTo({ top: 0 });
        }

        HistoryList({ containerEl: appContainerEl, history: filteredHistory });
    };

    TopBar({ containerEl: appContainerEl, onSearchInput: onSearchInput });
    HistoryList({ containerEl: appContainerEl, history: filteredHistory });

    document.getElementById('searchInput')?.focus();
})();
