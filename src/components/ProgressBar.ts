type Props = {
    containerEl: HTMLElement;
    value: number;
};

export const ProgressBar = ({ containerEl, value }: Props): void => {
    const casing = document.createElement('div');
    casing.style.display = 'flex';

    const filledBar = document.createElement('div');
    filledBar.style.height = '2px';
    filledBar.style.background = '#1e1e1e';
    filledBar.style.marginTop = '7px';
    filledBar.style.width = value * 100 + '%';

    const nonFilledBar = document.createElement('div');
    nonFilledBar.style.height = '2px';
    nonFilledBar.style.background = 'lightgray';
    nonFilledBar.style.marginTop = '7px';
    nonFilledBar.style.width = (1 - value) * 100 + '%';

    casing.appendChild(filledBar);
    casing.appendChild(nonFilledBar);

    containerEl.appendChild(casing);
};
