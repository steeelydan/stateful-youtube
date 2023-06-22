import type { HistoryItem, SavedHistoryItems } from './types';

const rootEl = document.getElementById('optionsRoot');

const getHistory = async (): Promise<SavedHistoryItems> => {
    const allItems = await browser.storage.local.get();
    const allItemsEntries = Object.entries(allItems);

    const history: SavedHistoryItems = {};

    for (let i = 0; i < allItemsEntries.length; i++) {
        if (allItemsEntries[i][0].startsWith('video_')) {
            const historyItem: HistoryItem = allItemsEntries[i][1] as HistoryItem;

            history[allItemsEntries[i][0]] = historyItem;
        }
    }

    return history;
};

(async (): Promise<void> => {
    if (rootEl) {
        // Load items

        const history = await getHistory();

        let files: FileList | null = null;

        const optionsContainerEl = document.createElement('div');

        // Export

        const exportImportContainer = document.createElement('div');
        exportImportContainer.style.marginBottom = '16px';

        const exportLinkEl = document.createElement('a');
        exportLinkEl.style.color = 'unset';
        exportLinkEl.style.marginRight = '8px';
        exportLinkEl.innerHTML = 'Export';
        exportLinkEl.href = `data:${
            'text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(history, null, 4))
        }`;
        exportLinkEl.download = `sfyt-export-${new Date()
            .toISOString()
            .split('.')[0]
            .replace(/:|T/g, '-')}.json`;

        // Import

        const importButtonEl = document.createElement('button');
        importButtonEl.style.background = 'none';
        importButtonEl.style.border = 'none';
        importButtonEl.style.padding = '0px';
        importButtonEl.style.color = 'unset';
        importButtonEl.style.fontSize = 'unset';
        importButtonEl.style.textDecoration = 'underline';
        importButtonEl.style.cursor = 'pointer';
        importButtonEl.style.fontFamily = 'unset';
        importButtonEl.innerText = 'Import';

        importButtonEl.onclick = (): void => {
            const importDialogEl = document.createElement('form');

            const importInputEl = document.createElement('input');
            importInputEl.type = 'file';
            importInputEl.multiple = false;
            importInputEl.onchange = (event): void => {
                files = (<HTMLInputElement>event.target).files;
            };

            const importSubmitEl = document.createElement('button');
            importSubmitEl.type = 'submit';
            importSubmitEl.innerText = 'Import';
            importSubmitEl.onclick = async (event): Promise<void> => {
                event.preventDefault();

                if (files) {
                    const text = await files[0].text();
                    const importedHistory = JSON.parse(text);

                    Object.keys(importedHistory).forEach((storageKey) => {
                        browser.storage.local.set({
                            [storageKey]: importedHistory[storageKey]
                        });
                    });

                    importDialogEl.removeChild(importInputEl);
                    importDialogEl.removeChild(importSubmitEl);
                }
            };

            importDialogEl.appendChild(importInputEl);
            importDialogEl.appendChild(importSubmitEl);

            optionsContainerEl.appendChild(importDialogEl);
        };

        exportImportContainer.appendChild(exportLinkEl);
        exportImportContainer.appendChild(importButtonEl);
        optionsContainerEl.appendChild(exportImportContainer);

        rootEl.appendChild(optionsContainerEl);
    }
})();
