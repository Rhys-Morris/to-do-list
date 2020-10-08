const container = document.querySelector('.content');

function addNewTask() {
    const header = document.createElement('h2');
    container.appendChild(header);
    header.className = 'content__header';
    header.textContent = 'Add New Task';

    const taskTitle = document.createElement('input');
    taskTitle.type = 'text';
    taskTitle.className = 'new__title';
    taskTitle.placeholder = 'Task title';

    const taskDescription = document.createElement('textarea');
    taskDescription.className = 'new__description';
    taskDescription.placeholder = 'Task details';

    const taskProject = document.createElement('input');
    taskProject.type = 'text';
    taskProject.className = 'new__project';
    taskProject.placeholder = 'Project';

    const taskDate = document.createElement('input');
    taskDate.className = 'new__date';
    taskDate.type = 'date';

    const taskPriority = document.createElement('select');
    taskPriority.className = 'new__priority';

    const priorityLow = document.createElement('option');
    priorityLow.value = 'Low';
    priorityLow.textContent = 'Low';

    const priorityMedium = document.createElement('option');
    priorityMedium.value = 'Medium';
    priorityMedium.textContent = 'Medium';


    const priorityHigh = document.createElement('option');
    priorityHigh.value = 'High';
    priorityHigh.textContent = 'High';


    // Append priority options to select
    taskPriority.appendChild(priorityHigh);
    taskPriority.appendChild(priorityMedium);
    taskPriority.appendChild(priorityLow);

    const taskDiv = document.createElement('div');
    taskDiv.className = 'new__div';

    // Append date and priority to a div
    taskDiv.appendChild(taskDate);
    taskDiv.appendChild(taskPriority);

    const taskSubmit = document.createElement('button');
    taskSubmit.className = 'new__submit';
    taskSubmit.textContent = 'SUBMIT'

    const taskClear = document.createElement('button')
    taskClear.className = 'new__clear';
    taskClear.textContent = 'CLEAR';

    const taskButtons = document.createElement('div');
    taskButtons.className = 'new__buttons';

    const newTaskDiv = document.createElement('div');
    newTaskDiv.className = 'new';
    
    // Append buttons to div
    taskButtons.appendChild(taskSubmit);
    taskButtons.appendChild(taskClear);

    // Append elements to new form
    newTaskDiv.appendChild(taskTitle);
    newTaskDiv.appendChild(taskDescription);
    newTaskDiv.appendChild(taskProject);
    newTaskDiv.appendChild(taskDiv);
    newTaskDiv.appendChild(taskButtons);
    container.appendChild(newTaskDiv);
}

export { addNewTask };