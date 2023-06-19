export type HistoryItem = {
    url: string;
    channel: string;
    title: string;
    updated: string;
    time: number;
    duration: number;
};

export type SavedHistoryItem = { [videoId: string]: HistoryItem };

export type FormattedHistoryItem = HistoryItem & { searchChannel: string; searchTitle: string };
