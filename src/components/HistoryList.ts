import { entryRowElCache } from '../cache/entryRowElCache';
import { fracSecondsToTime, getFormattedHistoryFromStorage, upsertHistoryItem } from '../utils';
import { ProgressBar } from './ProgressBar';

import type { FormattedHistoryItem, HistoryItem } from '../types';

type Props = { containerEl: HTMLElement; history: FormattedHistoryItem[] };

const pageItems = 20;
let sort: 'none' | 'starred' = 'none';

const changeStarred = async (
    item: FormattedHistoryItem,
    newStarred: boolean,
    starEl: HTMLElement
): Promise<void> => {
    const updatedHistoryItem: HistoryItem = {
        channel: item.channel,
        duration: item.duration,
        time: item.time,
        title: item.title,
        updated: item.updated, // We don't update here because updated is rather some kind of "last time watched".
        starred: newStarred
    };

    await upsertHistoryItem(item.id, updatedHistoryItem);

    if (newStarred) {
        starEl.style.opacity = '1.0';
        starEl.onmouseenter = null;
        starEl.onmouseleave = null;
        starEl.onclick = (): Promise<void> => changeStarred(item, false, starEl);
    } else {
        starEl.style.opacity = '0.2';
        starEl.onmouseenter = (): void => {
            starEl.style.opacity = '1.0';
        };
        starEl.onmouseleave = (): void => {
            starEl.style.opacity = '0.2';
        };
        starEl.onclick = (): Promise<void> => changeStarred(item, true, starEl);
    }
};

const appendHistoryItems = (
    history: FormattedHistoryItem[],
    page: number,
    tableEl: HTMLTableElement
): void => {
    const historyListBenchStart = performance.now();

    for (let i = page * pageItems; i < page * pageItems + pageItems && i < history.length; i++) {
        const historyItem = history[i];

        const cachedHistoryItemRowEl = entryRowElCache[historyItem.id];

        if (cachedHistoryItemRowEl) {
            tableEl.appendChild(cachedHistoryItemRowEl);

            continue;
        }

        const entryRowEl = document.createElement('tr');
        entryRowEl.style.marginBottom = '4px';

        const ytLinkEl = document.createElement('a');
        ytLinkEl.innerText = historyItem.title;
        ytLinkEl.target = '_blank';
        ytLinkEl.rel = 'noopener noreferrer';
        const newUrl = new URL('https://www.youtube.com/watch?v=' + historyItem.id);
        ytLinkEl.href = `${newUrl.toString()}`;

        const entryChannelColEl = document.createElement('td');
        entryChannelColEl.innerText = historyItem.channel;

        const entryTitleColEl = document.createElement('td');
        entryTitleColEl.appendChild(ytLinkEl);

        const entryDateColEl = document.createElement('td');
        const entryDate = new Date(historyItem.updated);
        entryDateColEl.innerText = `${entryDate.toLocaleString('DE-de', {
            weekday: 'short'
        })} ${entryDate.toLocaleString('DE-de', {
            timeStyle: 'short',
            dateStyle: 'medium'
        })} `;

        const entryDurationColEl = document.createElement('td');
        entryDurationColEl.style.textAlign = 'right';
        entryDurationColEl.innerText = `${fracSecondsToTime(historyItem.duration)}`;

        const percentColEl = document.createElement('td');
        ProgressBar({ containerEl: percentColEl, value: historyItem.time / historyItem.duration });

        const starColEl = document.createElement('td');
        starColEl.style.display = 'flex';
        starColEl.style.justifyContent = 'center';
        starColEl.style.alignItems = 'center';

        const starEl = document.createElement('div');
        starEl.style.transform = 'translateY(-5px)';
        starEl.style.fontSize = '13pt';
        starEl.innerText = '★';
        starEl.style.opacity = historyItem.starred ? '1.0' : '0.2';
        starEl.style.cursor = 'pointer';
        starEl.onmouseenter = (): void => {
            starEl.style.opacity = '1.0';
        };
        starEl.onmouseleave = (): void => {
            if (!historyItem.starred) {
                starEl.style.opacity = '0.2';
            }
        };
        starEl.onclick = async (): Promise<void> => {
            changeStarred(historyItem, historyItem.starred ? false : true, starEl);
        };
        starColEl.appendChild(starEl);

        entryRowEl.appendChild(entryChannelColEl);
        entryRowEl.appendChild(entryTitleColEl);
        entryRowEl.appendChild(entryDateColEl);
        entryRowEl.appendChild(entryDurationColEl);
        entryRowEl.appendChild(percentColEl);
        entryRowEl.appendChild(starColEl);

        if (!cachedHistoryItemRowEl) {
            entryRowElCache[historyItem.id] = entryRowEl;
        }

        tableEl.appendChild(entryRowEl);
    }

    console.debug(`SFYT: HistoryList: ${performance.now() - historyListBenchStart} ms`);
};

let historyListEventListener: () => void;

const render = (containerEl: HTMLElement, history: FormattedHistoryItem[]): void => {
    let page = 0;

    const potentialOldListEl = document.getElementById('historyList');

    if (potentialOldListEl) {
        containerEl.removeChild(potentialOldListEl);
    }

    window.removeEventListener('scroll', historyListEventListener);

    const tableEl = document.createElement('table');
    tableEl.id = 'historyList';
    tableEl.style.marginTop = '32px';
    tableEl.style.marginBottom = '8px';

    const headRowEl = document.createElement('tr');

    const thChannelEl = document.createElement('th');
    thChannelEl.style.width = '20%';
    thChannelEl.innerText = 'Channel';

    const thTitleEl = document.createElement('th');
    thTitleEl.style.paddingBottom = '4px';
    thTitleEl.innerText = 'Title';

    const thDateEl = document.createElement('th');
    thDateEl.style.width = '20%';
    thDateEl.innerText = 'Last viewed';

    const thDurationEl = document.createElement('th');
    thDurationEl.style.width = '7%';
    thDurationEl.style.textAlign = 'right';
    thDurationEl.innerText = 'Dur.';

    const thDoneEl = document.createElement('th');
    thDoneEl.style.width = '7%';
    thDoneEl.innerText = 'Done';

    const thStarredEl = document.createElement('th');
    thStarredEl.style.width = '5%';
    thStarredEl.innerText = 'Star';
    thStarredEl.style.cursor = 'pointer';
    thStarredEl.onclick = async (): Promise<void> => {
        if (sort === 'none') {
            sort = 'starred';
        } else {
            sort = 'none';
        }

        const freshHistory = await getFormattedHistoryFromStorage();

        if (!freshHistory) {
            return;
        }

        const sortedHistory =
            sort === 'starred'
                ? [...freshHistory].sort((a, b) =>
                      a.starred && !b.starred
                          ? -1
                          : b.starred && !a.starred
                          ? 1
                          : a.updated > b.updated
                          ? -1
                          : 1
                  )
                : [...freshHistory].sort((a, b) => (a.updated > b.updated ? -1 : 1));

        render(containerEl, sortedHistory);
    };

    headRowEl.appendChild(thChannelEl);
    headRowEl.appendChild(thTitleEl);
    headRowEl.appendChild(thDateEl);
    headRowEl.appendChild(thDurationEl);
    headRowEl.appendChild(thDoneEl);
    headRowEl.appendChild(thStarredEl);

    tableEl.appendChild(headRowEl);

    appendHistoryItems(history, page, tableEl);

    historyListEventListener = (): void => {
        if (
            history.length > page * pageItems &&
            window.scrollY + window.innerHeight > tableEl.clientHeight - 20
        ) {
            page++;
            appendHistoryItems(history, page, tableEl);
        }
    };

    window.addEventListener('scroll', historyListEventListener);

    containerEl.appendChild(tableEl);
};

export const HistoryList = ({ containerEl, history }: Props): void => {
    render(containerEl, history);
};
