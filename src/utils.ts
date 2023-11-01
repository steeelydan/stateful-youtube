import type { FormattedHistoryItem, HistoryItem } from './types';

export const fracSecondsToTime = (fracSeconds: number): string => {
    let time = '';

    const seconds = Math.round(fracSeconds);

    const hours = Math.floor(fracSeconds / 60 / 60);
    if (hours) {
        time += hours + ':';
    }

    const minutes = Math.floor(fracSeconds / 60 - hours * 60);
    let minutesString = minutes.toString();
    if (minutesString.length === 1) {
        minutesString = '0' + minutesString;
    }
    time += minutesString + ':';

    const newSeconds = seconds - hours * 60 * 60 - minutes * 60;
    let secondsString = newSeconds.toString();
    if (secondsString.length === 1) {
        secondsString = '0' + secondsString;
    }

    time += secondsString;

    return time;
};

export const upsertHistoryItem = async (
    itemId: string,
    historyItem: HistoryItem
): Promise<void> => {
    await browser.storage.local.set({ ['video_' + itemId]: historyItem });
};

export const getFormattedHistoryFromStorage = async (): Promise<FormattedHistoryItem[] | null> => {
    const allItems = await browser.storage.local.get();
    const allItemsEntries = Object.entries(allItems);

    const formattedHistory: FormattedHistoryItem[] = [];

    for (let i = 0; i < allItemsEntries.length; i++) {
        if (allItemsEntries[i][0].startsWith('video_')) {
            const historyItem: HistoryItem = allItemsEntries[i][1] as HistoryItem;

            formattedHistory.push({
                ...historyItem,
                id: allItemsEntries[i][0].slice(6),
                searchChannel: historyItem.channel.toLowerCase(),
                searchTitle: historyItem.title.toLowerCase()
            });
        }
    }

    return formattedHistory;
};
