import { upsertHistoryItem } from './utils';

import type { HistoryItem, SavedHistoryItems } from './types';

(async (): Promise<void> => {
    let currentUrl = window.location.href;
    let jumpedToPosition = false;

    let htmlVideoPlayer: HTMLVideoElement | null = null;
    let historyItem: HistoryItem | null = null;
    let titleDiv: HTMLDivElement | null = null;
    let channelLink: HTMLLinkElement | null = null;

    setInterval(async () => {
        const domAccessBenchStart = performance.now();

        const url = new URL(window.location.href);

        if (url.pathname === '/watch') {
            // READING SECTION

            // Reset when different video is loaded
            if (url.href !== currentUrl) {
                currentUrl = url.href;
                jumpedToPosition = false;
                historyItem = null;
                titleDiv = null;
                channelLink = null;
                jumpedToPosition = false;
            }

            const videoId = url.searchParams.get('v');
            const playlistId = url.searchParams.get('list');

            if (!videoId) {
                return;
            }

            if (!htmlVideoPlayer) {
                htmlVideoPlayer = document.getElementsByTagName('video')[0];
                console.debug('SFYT: Got video player from DOM');
            }

            // I suppose clientside rendered elements might still be missing from the page.
            if (!htmlVideoPlayer) {
                return;
            }

            if (jumpedToPosition && htmlVideoPlayer.paused) {
                console.debug(
                    `SFYT: Early return: DOM access in interval: ${
                        performance.now() - domAccessBenchStart
                    } ms`
                );

                return;
            }

            if (!historyItem) {
                const savedHistoryItem: SavedHistoryItems = (await browser.storage.local.get(
                    'video_' + videoId
                )) as SavedHistoryItems;

                console.debug('SFYT: Got historyItem from storage');

                if (savedHistoryItem) {
                    historyItem = savedHistoryItem['video_' + videoId];
                }
            }

            // We do not abort if historyItem missing - in this case we've simply not seen the video before.

            //  Jump to current time only if video seen before
            if (historyItem && !jumpedToPosition) {
                htmlVideoPlayer.currentTime = Math.floor(historyItem.time);
                jumpedToPosition = true;

                return;
            }

            // WRITING SECTION

            const time = htmlVideoPlayer.currentTime;
            const duration = htmlVideoPlayer.duration;

            if (!titleDiv) {
                titleDiv = document.querySelector(
                    '.watch-active-metadata div#title yt-formatted-string'
                ) as HTMLDivElement;

                console.debug('SFYT: Got title div from DOM');
            }

            if (!titleDiv) {
                return;
            }

            if (!channelLink) {
                channelLink = document.querySelector(
                    '.watch-active-metadata yt-formatted-string.ytd-channel-name a'
                ) as HTMLLinkElement;

                console.debug('SFYT: Got channel link from DOM');
            }

            if (!channelLink) {
                return;
            }

            // We always write the whole current data.
            historyItem = {
                channel: channelLink.innerText,
                playlistId: playlistId || undefined,
                title: titleDiv.innerText,
                updated: new Date().toISOString(),
                time: time,
                duration: duration
            };

            await upsertHistoryItem(videoId, historyItem);

            jumpedToPosition = true;
        }

        console.debug(
            `SFYT: DOM access in interval: ${performance.now() - domAccessBenchStart} ms`
        );
    }, 1000);
})();
