function createTaskObject() {
    const taskTitle = document.querySelector('.new__title');
    const taskDate = document.querySelector('.new__date');
    const taskPriority = document.querySelector('.new__priority');
    const taskProject = document.querySelector('.new__project');
    const taskDescription = document.querySelector('.new__description')
    
    let title = taskTitle.value;
    let date = taskDate.value;
    let priority = taskPriority.value;
    let project = taskProject.value;
    let description = taskDescription.value;

    // Add priority rank for ease of sorting
    if (priority == 'High') {
        priority = 1;
    } else if (priority == 'Medium') {
        priority = 2;
    } else {
        priority = 3;
    }

    // Date time in seconds
    let dateTime = new Date(date).getTime() / 1000;

    return {
        'title': title,
        'date': date,
        'datetime': dateTime,
        'priority': priority,
        'project': project,
        'completed': false,
        'description': description
    };
}

export { createTaskObject };