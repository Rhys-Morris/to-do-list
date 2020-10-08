function convertDay(number) {
    if (number === 0) { return 'Sunday' }
    else if (number === 1) { return 'Monday' }
    else if (number === 2) { return 'Tuesday' }
    else if (number === 3) { return 'Wednesday' }
    else if (number === 4) { return 'Thursday' }
    else if (number === 5) { return 'Friday' }
    else { return 'Saturday' }
}

function convertToOrdinal(number) {
    number = number.toString();
    let numberSplit = number.split('');

    if (numberSplit[number.length - 1] == 1) {
        return `${number}st`
    } else if (numberSplit[number.length - 1] == 2){
        return `${number}nd`
    }  else if (numberSplit[number.length - 1] == 3) {
        return `${number}rd`
    } else { return `${number}th` }
}

function convertMonth(number) {
    if (number === 0) { return 'January' }
    else if (number === 1) { return 'February' }
    else if (number === 2) { return 'March' }
    else if (number === 3) { return 'April' }
    else if (number === 4) { return 'May' }
    else if (number === 5) { return 'June' }
    else if (number === 6) { return 'July' }
    else if (number === 7) { return 'August' }
    else if (number === 8) { return 'September' }
    else if (number === 9) { return 'October' }
    else if (number === 10) { return 'November' }
    else { return 'December' }
}

function renderArray(array) {
    const container = document.querySelector('.content');

    array = array.sort((a, b) => a.priority > b.priority ? 1 : -1);

    for (let item of array) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'task';

        const itemPriority = document.createElement('div');
        itemPriority.className = 'task__priority';
        
        // Add colour priority
        if (item.priority == '1') {
            itemPriority.classList.add('task__priority--high');
        } else if (item.priority == '2') {
            itemPriority.classList.add('task__priority--medium');
        } else {
            itemPriority.classList.add('task__priority--low');
        }
    
        const itemTitle = document.createElement('span')
        itemTitle.className = 'task__title';
        itemTitle.textContent = item.title;

        const itemCompleted = document.createElement('div');
        itemCompleted.className = 'task__completed';
        itemCompleted.innerHTML = '	&#10003;';

        const itemRemove = document.createElement('div');
        itemRemove.className = 'task__remove';
        itemRemove.innerHTML = '&#10005;';

        const itemDetails = document.createElement('div');
        itemDetails.className = "task__details"

        if (item.project == '') {
            console.log('empty');
        }
        const itemProject = document.createElement('span');
        itemProject.className = 'task__project';
        itemProject.textContent = `Project: ${item.project}`;
        
        // Date conversions
        const dateToComplete = new Date(item.date);
        let day = convertDay(dateToComplete.getDay());
        let date = convertToOrdinal(dateToComplete.getDate());
        let month = convertMonth(dateToComplete.getMonth());
        let year = dateToComplete.getFullYear();

        const itemDate = document.createElement('span');
        itemDate.className = 'task__date';
        itemDate.textContent = `Due Date:   ${day} ${date} ${month}, ${year}`;

        const itemDescription = document.createElement('p');
        itemDescription.className = 'task__description';
        itemDescription.textContent = item.description;

        // Check completed and add strikethrough
        if (item.completed == true) {
            itemTitle.style["text-decoration"] = 'line-through';
        } else {
            itemTitle.style["text-decoration"] = 'none';
        }
        
        if (item.project != '') { itemDetails.appendChild(itemProject) }
        itemDetails.appendChild(itemDate);
        itemDiv.appendChild(itemPriority);
        itemDiv.appendChild(itemTitle);
        itemDiv.appendChild(itemCompleted);
        itemDiv.appendChild(itemRemove);
        itemDiv.appendChild(itemDetails);
        itemDiv.appendChild(itemDescription);
        container.appendChild(itemDiv);
    }
}

export { renderArray };