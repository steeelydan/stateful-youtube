export type HistoryItem = {
    channel: string;
    title: string;
    updated: string;
    time: number;
    duration: number;
};

export type SavedHistoryItem = { [videoId: string]: HistoryItem };

export type FormattedHistoryItem = HistoryItem & {
    id: string;
    searchChannel: string;
    searchTitle: string;
};
