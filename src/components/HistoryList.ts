import { fracSecondsToTime } from '../utils';
import { ProgressBar } from './ProgressBar';

import type { FormattedHistoryItem } from '../types';

type Props = { containerEl: HTMLElement; history: FormattedHistoryItem[] };

export const HistoryList = ({ containerEl, history }: Props): void => {
    const historyListBenchStart = performance.now();

    const potentialOldListEl = document.getElementById('historyList');

    if (potentialOldListEl) {
        containerEl.removeChild(potentialOldListEl);
    }

    const tableEl = document.createElement('table');
    tableEl.id = 'historyList';
    tableEl.style.marginTop = '30px';

    const headRowEl = document.createElement('tr');

    const thChannelEl = document.createElement('th');
    thChannelEl.style.width = '18%';
    thChannelEl.innerText = 'Channel';

    const thVideoEl = document.createElement('th');
    thVideoEl.innerText = 'Title';

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
    headRowEl.appendChild(thVideoEl);
    headRowEl.appendChild(thDateEl);
    headRowEl.appendChild(thDurationEl);
    headRowEl.appendChild(thDoneEl);

    tableEl.appendChild(headRowEl);

    history.forEach((entry) => {
        const entryRowEl = document.createElement('tr');
        entryRowEl.style.marginBottom = '4px';

        const ytLinkEl = document.createElement('a');
        ytLinkEl.innerText = entry.title;
        ytLinkEl.target = '_blank';
        ytLinkEl.rel = 'noopener noreferrer';
        const newUrl = new URL(entry.url);
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

        tableEl.appendChild(entryRowEl);
    });

    containerEl.appendChild(tableEl);

    console.debug('Benchmark: HistoryList: ' + (performance.now() - historyListBenchStart) + ' ms');
};
