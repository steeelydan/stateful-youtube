type Props = {
    containerEl: HTMLElement;
    onSearchInput: (searchString: string) => void;
};

export const TopBar = ({ containerEl, onSearchInput }: Props): void => {
    const topBarEl = document.createElement('div');
    topBarEl.style.display = 'flex';
    topBarEl.style.position = 'fixed';
    topBarEl.style.width = '100%';
    topBarEl.style.top = '0px';
    topBarEl.style.left = '0px';
    topBarEl.style.padding = '4px';
    topBarEl.style.background = 'white';
    topBarEl.style.zIndex = '100';
    topBarEl.style.boxShadow = 'rgba(0, 0, 0, 0.16) 0px 1px 4px';
    topBarEl.style.justifyContent = 'space-between';

    const left = document.createElement('div');
    const right = document.createElement('div');

    const searchEl = document.createElement('input');
    searchEl.id = 'searchInput';
    searchEl.oninput = (event: Event): void =>
        onSearchInput((<HTMLInputElement>event.target).value);

    const searchLabelEl = document.createElement('label');
    searchLabelEl.htmlFor = 'searchInput';
    searchLabelEl.innerText = 'Search ';

    right.appendChild(searchLabelEl);
    right.appendChild(searchEl);

    topBarEl.appendChild(left);
    topBarEl.appendChild(right);

    containerEl.appendChild(topBarEl);
};
