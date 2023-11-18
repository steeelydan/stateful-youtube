import { upsertHistoryItem } from './utils';

import type { HistoryItem, SavedHistoryItems } from './types';

(async (): Promise<void> => {
    let currentUrl = window.location.href;

    let historyItem: HistoryItem | null = null;
    let titleDiv: HTMLDivElement | null = null;
    let channelLink: HTMLLinkElement | null = null;

    setInterval(async () => {
        const domAccessBenchStart = performance.now();

        const url = new URL(window.location.href);

        if (url.pathname === '/watch') {
            // Reset when different video is loaded
            if (url.href !== currentUrl) {
                currentUrl = url.href;
                historyItem = null;
                titleDiv = null;
                channelLink = null;
            }

            const videoId = url.searchParams.get('v');
            const playlistId = url.searchParams.get('list');

            if (!videoId) {
                console.debug('SFYT: Video id not in url');

                return;
            }

            const htmlVideoPlayer = document.getElementsByTagName('video')[0];

            // I suppose JS rendered elements might still be missing from the page.
            if (!htmlVideoPlayer) {
                console.debug('SFYT: Video player not found');

                return;
            }

            if (htmlVideoPlayer.paused) {
                console.debug(
                    `SFYT: Early return because paused: DOM access in interval: ${
                        performance.now() - domAccessBenchStart
                    } ms`
                );

                return;
            }

            const savedHistoryItem: SavedHistoryItems = (await browser.storage.local.get(
                'video_' + videoId
            )) as SavedHistoryItems;

            if (savedHistoryItem) {
                historyItem = savedHistoryItem['video_' + videoId];
            }

            const time = htmlVideoPlayer.currentTime;
            const duration = htmlVideoPlayer.duration;

            if (!titleDiv) {
                titleDiv = document.querySelector(
                    '.watch-active-metadata div#title yt-formatted-string'
                ) as HTMLDivElement;
            }

            if (!titleDiv) {
                console.debug('SFYT: Title div not found');

                return;
            }

            if (!channelLink) {
                channelLink = document.querySelector(
                    '.watch-active-metadata yt-formatted-string.ytd-channel-name a'
                ) as HTMLLinkElement;
            }

            if (!channelLink) {
                console.debug('SFYT: Channel link not found');

                return;
            }

            // We always write the whole current data.
            historyItem = {
                channel: channelLink.innerText,
                playlistId: playlistId || undefined,
                title: titleDiv.innerText,
                updated: new Date().toISOString(),
                time: time,
                duration: duration,
                starred: historyItem?.starred
            };

            await upsertHistoryItem(videoId, historyItem);
        }

        console.debug(
            `SFYT: DOM access in interval: ${performance.now() - domAccessBenchStart} ms`
        );
    }, 1000);
})();
