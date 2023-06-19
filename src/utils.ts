export const fracSecondsToTime = (fracSeconds: number): string => {
    let time = '';

    const seconds = Math.round(fracSeconds);

    const hours = Math.floor(fracSeconds / 60 / 60);
    if (hours) {
        time += hours + ':';
    }

    const minutes = Math.floor(fracSeconds / 60 - hours * 60);
    let minutesString = minutes.toString();
    if (minutesString.length === 1) {
        minutesString = '0' + minutesString;
    }
    time += minutesString + ':';

    const newSeconds = seconds - hours * 60 * 60 - minutes * 60;
    let secondsString = newSeconds.toString();
    if (secondsString.length === 1) {
        secondsString = '0' + secondsString;
    }

    time += secondsString;

    return time;
};
