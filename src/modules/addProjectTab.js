function addProjectTab(project) {
    const sidebar = document.querySelector('.sidebar');

    const projectTabDiv = document.createElement('div');
    projectTabDiv.className = "projects__tab";

    const projectTitle = document.createElement('div');
    projectTitle.className = 'projects__tab__title';
    projectTitle.textContent = project.name;

    const projectRemove = document.createElement('div');
    projectRemove.className = 'projects__tab__remove';
    projectRemove.innerHTML = '&#10005;';

    projectTabDiv.appendChild(projectTitle);
    projectTabDiv.appendChild(projectRemove);
    sidebar.appendChild(projectTabDiv);
}

export { addProjectTab };