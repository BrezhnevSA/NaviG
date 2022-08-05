
import moment from 'moment';

export const _convertDateToBdString = (date_str) => {
    const date    = new Date(date_str);
    let bd_string = null;
    if (date !== null) {
        let localISOTime = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
        bd_string        = localISOTime.slice(0,10);
    }
    return bd_string;
}

export const _convertDateToNormalViewString = (date_str) => {
    const date    = new Date(date_str);
    let bd_string = null;
    if (date !== null) {
        let localISOTime = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
        bd_string        = moment(localISOTime.slice(0,10)).format("DD.MM.YYYY");
    }
    return bd_string;
}

export const getRandomInt = (max) => { // max = 3, output = 0 or 1 or 2
    return Math.floor(Math.random() * Math.floor(max));
}

export const getShorterString = (string, neededLentgh) => {
    if (string) {
        return string.length > neededLentgh ? `${string.substring(0, neededLentgh - 1)}...` : string;
    } else {
        return undefined;
    }
}