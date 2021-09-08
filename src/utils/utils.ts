
export function isNill(value: any): boolean {
    return value === null || value === undefined;
}

export function formatDate(dateString) {
    const isoDate = new Date(dateString);
    // console.warn(dateString);
    // console.warn(isoDate);
    const date = `${ addZero(isoDate.getDate()) }/${ addZero(isoDate.getMonth() + 1) }/${ isoDate.getFullYear() }`;
    const hours = `${ addZero(isoDate.getHours()) }:${ addZero(isoDate.getMinutes()) }`;
    return `${ date } às ${ hours }`;
}

function addZero(num) {
    if (num < 10) {
        return '0' + num;
    }
    return num;
}
