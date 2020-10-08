function createNewProject() {
    const newProjectTitle = document.querySelector('.projects__new__title');

    const projectName = newProjectTitle.value;

    return {
         'name': projectName,
         'tasks': []
    }
}

export { createNewProject };