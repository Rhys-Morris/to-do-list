function newProject() {
    const projectsTab = document.querySelector('.projects');

    const newTab = document.createElement('div');
    newTab.className = ('projects__new');

    const projectTitle = document.createElement('input');
    projectTitle.type = 'text';
    projectTitle.placeholder = 'New project title';
    projectTitle.className = "projects__new__title";

    const projectSubmit = document.createElement('button');
    projectSubmit.className = 'projects__new__submit';
    projectSubmit.innerHTML = '&#8618;'

    newTab.appendChild(projectTitle);
    newTab.appendChild(projectSubmit);
    projectsTab.appendChild(newTab);
}

export { newProject }