function findCurrentContainerHeader() {
    let header = document.querySelector('.content__header').textContent;
    let headerSplit = header.split(' ');
    if (headerSplit.length == 1 || headerSplit[1] == 'Week') {
        return header;
    } else {
        headerSplit.splice(0, 1);
        header = headerSplit.join(' ');
        return `Project: ${header}`;
    }
}

export {findCurrentContainerHeader};