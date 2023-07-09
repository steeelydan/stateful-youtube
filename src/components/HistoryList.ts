import { entryRowElCache } from '../cache/entryRowElCache';
import { fracSecondsToTime } from '../utils';
import { ProgressBar } from './ProgressBar';
import type { FormattedHistoryItem } from '../types';

type Props = { containerEl: HTMLElement; history: FormattedHistoryItem[] };

const pageItems = 20;

const appendHistoryItems = (
    history: FormattedHistoryItem[],
    page: number,
    tableEl: HTMLTableElement
): void => {
    const historyListBenchStart = performance.now();

    for (let i = page * pageItems; i < page * pageItems + pageItems && i < history.length; i++) {
        const entry = history[i];

        const cachedEntryRowEl = entryRowElCache[entry.id];

        if (cachedEntryRowEl) {
            tableEl.appendChild(cachedEntryRowEl);

            continue;
        }

        const entryRowEl = document.createElement('tr');
        entryRowEl.style.marginBottom = '4px';

        const ytLinkEl = document.createElement('a');
        ytLinkEl.innerText = entry.title;
        ytLinkEl.target = '_blank';
        ytLinkEl.rel = 'noopener noreferrer';
        const newUrl = new URL('https://www.youtube.com/watch?v=' + entry.id);
        ytLinkEl.href = `${newUrl.toString()}`;

        const entryChannelColEl = document.createElement('td');
        entryChannelColEl.innerText = entry.channel;

        const entryTitleColEl = document.createElement('td');
        entryTitleColEl.appendChild(ytLinkEl);

        const entryDateColEl = document.createElement('td');
        const entryDate = new Date(entry.updated);
        entryDateColEl.innerText = `${entryDate.toLocaleString('DE-de', {
            weekday: 'short'
        })} ${entryDate.toLocaleString('DE-de', {
            timeStyle: 'short',
            dateStyle: 'medium'
        })} `;

        const entryDurationColEl = document.createElement('td');
        entryDurationColEl.style.textAlign = 'right';
        entryDurationColEl.innerText = `${fracSecondsToTime(entry.duration)}`;

        const percentColEl = document.createElement('td');
        ProgressBar({ containerEl: percentColEl, value: entry.time / entry.duration });

        entryRowEl.appendChild(entryChannelColEl);
        entryRowEl.appendChild(entryTitleColEl);
        entryRowEl.appendChild(entryDateColEl);
        entryRowEl.appendChild(entryDurationColEl);
        entryRowEl.appendChild(percentColEl);

        if (!cachedEntryRowEl) {
            entryRowElCache[entry.id] = entryRowEl;
        }

        tableEl.appendChild(entryRowEl);
    }

    console.debug(`SFYT: HistoryList: ${performance.now() - historyListBenchStart} ms`);
};

let historyListEventListener: () => void;

export const HistoryList = ({ containerEl, history }: Props): void => {
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
    thChannelEl.style.width = '18%';
    thChannelEl.innerText = 'Channel';

    const thTitleEl = document.createElement('th');
    thTitleEl.style.paddingBottom = '4px';
    thTitleEl.innerText = 'Title';

    const thDateEl = document.createElement('th');
    thDateEl.style.width = '18%';
    thDateEl.innerText = 'Last viewed';

    const thDurationEl = document.createElement('th');
    thDurationEl.style.width = '7%';
    thDurationEl.style.textAlign = 'right';
    thDurationEl.innerText = 'Dur.';

    const thDoneEl = document.createElement('th');
    thDoneEl.style.width = '7%';
    thDoneEl.innerText = 'Done';

    headRowEl.appendChild(thChannelEl);
    headRowEl.appendChild(thTitleEl);
    headRowEl.appendChild(thDateEl);
    headRowEl.appendChild(thDurationEl);
    headRowEl.appendChild(thDoneEl);

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
