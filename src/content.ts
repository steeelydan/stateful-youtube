import type { HistoryItem, SavedHistoryItem } from './types';

(async (): Promise<void> => {
    let currentUrl = window.location.href;
    let jumpedToTime = false;

    setInterval(async () => {
        const url = new URL(window.location.href);

        if (url.pathname === '/watch') {
            // READING SECTION

            const videoId = url.searchParams.get('v');

            const htmlVideoPlayer = document.getElementsByTagName('video')[0];

            if (!videoId || !htmlVideoPlayer) {
                return;
            }

            const savedVideoHistory: SavedHistoryItem = (await browser.storage.local.get(
                'video_' + videoId
            )) as SavedHistoryItem;

            let videoHistory: HistoryItem | null = null;

            if (savedVideoHistory) {
                videoHistory = savedVideoHistory['video_' + videoId];
            }

            //  Jump to current time only if newly loaded
            if (videoHistory && !jumpedToTime) {
                htmlVideoPlayer.currentTime = Math.floor(videoHistory.time);
                jumpedToTime = true;

                return;
            }

            if (url.href !== currentUrl) {
                currentUrl = url.href;
                jumpedToTime = false;
            }

            // WRITING SECTION

            if (htmlVideoPlayer.paused) {
                return;
            }

            const time = htmlVideoPlayer.currentTime;
            const duration = htmlVideoPlayer.duration;

            const metaContainer = document.querySelector('.watch-active-metadata');
            const titleContainer = metaContainer?.querySelector('div#title');
            const titleDiv = titleContainer?.querySelector('yt-formatted-string') as HTMLDivElement;

            if (!titleDiv) {
                return;
            }

            const channelDiv = metaContainer?.querySelector('yt-formatted-string.ytd-channel-name');
            const channelLink = channelDiv?.querySelector('a');
            const channel = channelLink?.innerText;

            if (!channel) {
                return;
            }

            videoHistory = {
                url: window.location.href,
                channel: channel,
                title: titleDiv.innerText,
                updated: new Date().toISOString(),
                time: time,
                duration: duration
            };

            browser.storage.local.set({ ['video_' + videoId]: videoHistory });

            jumpedToTime = true;
        }
    }, 1000);
})();
