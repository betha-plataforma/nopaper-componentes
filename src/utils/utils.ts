
export function isNill(value: any): boolean {
    return value === null || value === undefined;
}

export function formatDate(dateString) {
    const isoDate = new Date(dateString);
    const date = `${ addZero(isoDate.getDate()) }/${ addZero(isoDate.getMonth() + 1) }/${ isoDate.getFullYear() }`;
    const hours = `${ addZero(isoDate.getHours()) }:${ addZero(isoDate.getMinutes()) }`;
    return `${ date } às ${ hours }`;
}

export function formatDateHtml(dateString) {
    const isoDate = new Date(dateString);
    const date = `${ addZero(isoDate.getDate()) }/${ addZero(isoDate.getMonth() + 1) }/${ isoDate.getFullYear() }`;
    const hours = `${ addZero(isoDate.getHours()) }:${ addZero(isoDate.getMinutes()) }:${ addZero(isoDate.getSeconds()) }`;
    return `
        <span class="fs-13">${ date }</span>
        <small class="text-muted text-nowrap fs-12">às ${ hours }</small>
    `;
}

function addZero(num) {
    if (num < 10) {
        return '0' + num;
    }
    return num;
}
