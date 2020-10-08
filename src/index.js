// ----- TO DO -----
/*
Deal with duplicate items --> Mostly completed aside from date
Responsive Design --> Up to 675px width
Deal with different timezones
Rename projects feature
Refactor into modules
Fix remove project error
*/

import { addNewTask } from './modules/addNewTask';
import { createTaskObject } from './modules/createTaskObject';
import { renderArray } from './modules/renderTaskArray';
import { newProject } from './modules/newProject';
import { createNewProject } from './modules/createNewProject';
import { addProjectTab } from './modules/addProjectTab';
import { findCurrentContainerHeader } from  './modules/findCurrentContainerHeader';
import { appendError } from './modules/appendError';

// ------- HTML ELEMENTS -------
const newTaskButton = document.querySelector('.header__add');
const container = document.querySelector('.content');
const sidebarToggle = document.querySelector('.header__sidebar-toggle')
const sidebar = document.querySelector('.sidebar')
const today = document.querySelector('#today');
const tomorrow = document.querySelector('#tomorrow');
const thisWeek = document.querySelector('#this-week')
const projectsSidebar = document.querySelector('#projects')
const addProject = document.querySelector('.projects__add');
const search = document.querySelector('.header__search');

// ------- ARRAYS -------
let allTasks = [];
let todayTasks = [];
let tomorrowTasks = [];
let thisWeekTasks = [];
let projects = [];

// ------- VARIABLES -------
let currentDate = new Date().getTime();
currentDate = (currentDate + 39600000) / 1000;   // Convert to AEST and seconds
let dayPassed = currentDate % 86400;
currentDate = currentDate - dayPassed;  // Todays datetime
let tomorrowDate = currentDate + 86400;

let addingTask = 0;    // Flag for adding new task
let addingProject = false; // Flag for adding new project to sidebar
let validDate = false; // Flag for checking dates aren't in past
let collapsedProjects = false; // Flag for whether projects are collapsed
let collapsedSidebar = false // Flag for whether sidebar collapsed

// -------- HELPER FUNCTIONS --------

function resetContainer() {
    const taskTitle = document.querySelector('.new__title');
    const taskDiv = document.querySelector('.new__div');
    const taskButtons = document.querySelector('.new__buttons');

    while (container.hasChildNodes()) {
        container.removeChild(container.lastChild);
    }

    addingTask = 0;
}

function addContainerHeader(headerName) {
    const header = document.createElement('h2');
    container.appendChild(header);
    header.className = 'content__header';
    header.textContent = headerName;
}

function populateFilteredArrays(array) {
    todayTasks = array.filter(task => task.datetime === currentDate);
    tomorrowTasks = array.filter(task => task.datetime === tomorrowDate);
    let lowerLimit = currentDate + (86400 * 2 - 1);
    let upperLimit = currentDate + (86400 * 7 + 1);
    thisWeekTasks = array.filter(task => {
        return task.datetime > lowerLimit && task.datetime < upperLimit;
    });
}

function validDateCheck() {
    const date = document.querySelector('.new__date');
    let dateToCheck = date.value;

    let dateTime = new Date(dateToCheck).getTime() / 1000;

    return dateTime >= currentDate ? true: false;
}

// Strikethrough for completed tasks
function addCompletedListener() {

    let targetItems = Array.from(document.querySelectorAll('.task__completed'));
    targetItems.forEach(element => {
        element.addEventListener('click', (e) => {
            // Find and update in all tasks
            let task = e.target.parentNode;
            const strikethroughTarget = task.querySelector('.task__title');
            const taskDescription = task.querySelector('.task__description').textContent;
            let taskProject = task.querySelector('.task__project');
            if (!taskProject) (taskProject = '');
            else { 
                taskProject = taskProject.textContent
                .split(' ')
                .slice(1)
                .join(' ');
            }
            const taskTitle = strikethroughTarget.textContent;
            let filteredTasks = allTasks.filter(task => {
                return task.title == taskTitle &&
                task.project == taskProject &&
                task.description == taskDescription;
            });
            let thisTask = filteredTasks[0];
            thisTask.completed = !thisTask.completed;

            // Find and update in project tasks
            let thisProjectsTasks = [];

            if (thisTask.project != '') {
                let filteredProjects = projects.filter(project => project.name == taskProject);
                thisProjectsTasks = filteredProjects[0].tasks;
                let projectTask = thisProjectsTasks.filter(task => {
                    return task.title == taskTitle &&
                    task.description == taskDescription;
                })[0];
                projectTask.completed = thisTask.completed;
            }         
            
            // Repopulate date arrays
            populateFilteredArrays(allTasks);

            // Re-render page
            let header = findCurrentContainerHeader();
            resetContainer();
            addContainerHeader(header);

            if (header == 'Today') { renderArray(todayTasks) }
            else if (header == 'Tomorrow') { renderArray(tomorrowTasks) }
            else if (header == 'This Week') { renderArray(thisWeekTasks) }
            else { renderArray(thisProjectsTasks); }

            // Add tasks listeners
            addCompletedListener();
            addRemoveListener();

            // Update local storage
            localStorage.setItem('allTasks', JSON.stringify(allTasks));
        })
    })
}

// Remove tasks
function addRemoveListener() {
    let targetItems = Array.from(document.querySelectorAll('.task__remove'));
    targetItems.forEach(element => {
        element.addEventListener('click', (e) => {
            // Remove from tasks array
            let parent = e.target.parentNode;
            let taskTitle = parent.querySelector('.task__title').textContent;
            const taskDescription = parent.querySelector('.task__description').textContent;
            let taskProject = parent.querySelector('.task__project');
            if (!taskProject) (taskProject = '');
            else { 
                taskProject = taskProject.textContent
                .split(' ')
                .slice(1)
                .join(' ');
            }
            let thisTask = allTasks.filter(task => {
                return task.title == taskTitle &&
                task.project == taskProject &&
                task.description == taskDescription;
            });
            let index = allTasks.indexOf(thisTask[0]);
            allTasks.splice(index, 1);

            // Remove from date array
            populateFilteredArrays(allTasks);

            // Remove from project tasks
            thisTask = thisTask[0];
            if (thisTask.project != '') {
                let projectArrayTasks = projects.filter(project => project.name == taskProject)[0].tasks;
                let thisProjectTask = projectArrayTasks.filter(task => {
                    task.title == taskTitle &&
                    task.description == taskDescription;
                })[0];
                let projectIndex = projectArrayTasks.indexOf(thisProjectTask);
                projectArrayTasks.splice(projectIndex, 1); 
            }
            // Delete from page
            container.removeChild(parent); 

            // Update local storage
            localStorage.setItem('allTasks', JSON.stringify(allTasks));
            localStorage.setItem('projects', JSON.stringify(projects));
        })
    })
}

// Remove project task 
function removeProjectTask() {
    let targetItems = Array.from(document.querySelectorAll('.task__remove'));
    targetItems.forEach(element => {
        element.addEventListener('click', (e) => {

            // Remove from project tasks
            let parent = e.target.parentNode;
            let taskTitle = parent.querySelector('.task__title').textContent;
            let containerHeader = container.querySelector('.content__header');
            let projectTitle = containerHeader.textContent.split(' ')[1];

            let projectTasks = projects.filter(project => project.name == projectTitle)[0].tasks;
            let thisTask = projectTasks.filter(task => task.title == taskTitle)[0];
            let taskIndex = projectTasks.indexOf(thisTask);
            projectTasks.splice(taskIndex, 1);
            localStorage.setItem('projects', JSON.stringify(projects));

            // Remove from tasks array
            let filteredTasks = allTasks.filter(task => {
                return task.project == projectTitle && task.title == taskTitle;
            })
            thisTask = filteredTasks[0];
            taskIndex = allTasks.indexOf(thisTask);
            allTasks.splice(taskIndex, 1);
            localStorage.setItem('allTasks', JSON.stringify(allTasks));

            // Delete from page
            container.removeChild(parent); 
        })
    })
}

// Remove project fully  --> THROWING AN ERROR BUT WORKING
function removeProject() {
    let targetItems = Array.from(document.querySelectorAll('.projects__tab__remove'));
    targetItems.forEach(item => {
        item.addEventListener('click', (e) => {
            // Go into the project tasks
            let parent = e.target.parentNode;
            let projectToRemove = parent.querySelector('.projects__tab__title').textContent;
            let filtered = projects.filter(project => project.name == projectToRemove);
            let projectIndex = projects.indexOf(filtered[0]);
            let projectTasks = projects[projectIndex].tasks;        // Error here when attempting to read tasks property

            // Remove each task from all tasks
            while (projectTasks.length != 0) {
                let taskToRemove = projectTasks[0];
                let taskTitle = taskToRemove.title;
                let taskProject = taskToRemove.project;
                let taskDescription = taskToRemove.description;
                let taskTimeDate = taskToRemove.timedate;
                let filteredAll = allTasks.filter(task => {
                    return task.title == taskTitle &&
                           task.project == taskProject &&
                           task.description == taskDescription &&
                           task.timedate == taskTimeDate;
                })
                let matchingTask = filteredAll[0];
                let taskIndex = allTasks.indexOf(matchingTask);
                allTasks.splice(taskIndex, 1);
                projectTasks.splice(0, 1);
            }

            // Remove the project from projects
            projects.splice(projectIndex, 1);

            // Update local storage
            localStorage.setItem('allTasks', JSON.stringify(allTasks));
            localStorage.setItem('projects', JSON.stringify(projects));

            // Reset the page
            populateFilteredArrays(allTasks);
            let header = findCurrentContainerHeader();
            resetContainer();
            addContainerHeader(header);

            if (header == 'Today') { renderArray(todayTasks) }
            else if (header == 'Tomorrow') { renderArray(tomorrowTasks) }
            else if (header == 'This Week') { renderArray(thisWeekTasks) }
            else {
                resetContainer();
                addContainerHeader('Today');
                renderArray(todayTasks); 
            }

            // Reset project tabs
             const currentProjectTabs = Array.from(document.querySelectorAll('.projects__tab'));
            for (let tab of currentProjectTabs) {
                sidebar.removeChild(tab);
            }

            // Populate projects tab
            for (let project of projects) {
                addProjectTab(project);
            }

            // Add tasks listeners
            addCompletedListener();
            addRemoveListener();
            selectProjectTab();
            removeProject();

        })
    })
}

// Ability to select projects
function selectProjectTab() {
    let projectTabs = Array.from(document.querySelectorAll('.projects__tab'));
    projectTabs.forEach(project => {
        project.addEventListener('click', (e) => {
            if (e.target.className == 'projects__tab__remove') { return }
            resetContainer();

            // Find in project array
            let projectName = project.textContent
                                     .split('')
                                     .slice(0, project.textContent.length - 1)
                                     .join('');
            let thisProject = projects.filter(project => project.name === projectName)[0];
            // Add header
            addContainerHeader(`Project: ${thisProject.name}`);

            // Add tasks to container - sort by date
            thisProject.tasks = thisProject.tasks.sort((a, b) => {
                return a.datetime > b.datetime ? -1 : 1;
            })
            renderArray(thisProject.tasks);
            addCompletedListener();
            removeProjectTask();            // Remove tasks from project array!
        })
    });
}

// ------- INITIALISE --------

// Pull data out of localStorage
if (localStorage.allTasks) {allTasks = JSON.parse(localStorage.allTasks)}
if (localStorage.projects) {projects = JSON.parse(localStorage.projects)}

// TO DO --> Check current time and remove all tasks that are in the past

// Populate our other arrays by filtering
populateFilteredArrays(allTasks);

// Render today and sidebar projects in DOM
renderArray(todayTasks);
for (let project of projects) {
    addProjectTab(project);
}

// Add listeners
addCompletedListener();
addRemoveListener();
selectProjectTab();
removeProject();

// ---------- EVENT LISTENERS -----------

// Add new task
newTaskButton.addEventListener('click', () => {

    if (addingTask == 1) { return } // Check already adding task
    addingTask = 1;

    resetContainer();
    addNewTask()

    // Clear functionality
    const reset = document.querySelector('.new__clear');

    reset.addEventListener('click', () => {
        resetContainer();
        addContainerHeader('Today');
        renderArray(todayTasks) ;
    });
    
    // Submit functionality
    const taskSubmit = document.querySelector('.new__submit');

    taskSubmit.addEventListener('click', () => {

        let newTask = {};
        validDate = validDateCheck();
        
        if (validDate) {
            newTask = createTaskObject();
            // Check if title empty
            if (newTask.title == '') {
                let titleError = document.createElement('div');
                titleError.textContent = 'Task requires a title!';
                titleError.className = 'error';
                appendError(titleError);
                return
            }
            // Prevent exact duplicate tasks
            let duplicateCheck = allTasks.some(task => {
                return task.title == newTask.title &&
                task.project == newTask.project &&
                task.datetime == newTask.datetime &&
                task.description == newTask.description;
            });
            if (duplicateCheck) {
                let duplicateError = document.createElement('div');
                duplicateError.textContent = 'An identical task already exists!';
                duplicateError.className = 'error';
                appendError(duplicateError);
                return
            }
            allTasks.push(newTask);
        } else {
            let dateError = document.createElement('div');
            dateError.textContent = 'Invalid date selected!';
            dateError.className = 'error';
            appendError(dateError);
            return    
        }

        // Add new task to project array
        let checkProjectName = newTask.project;

        let projectInArray = projects.filter(project => project.name == checkProjectName);

        if (checkProjectName.length != 0) {
            if (projectInArray.length == 0) {
                let newProject = {
                    'name': checkProjectName,
                    'tasks': [newTask]
                };
                projects.push(newProject);
                addProjectTab(newProject);
            } else {
                let index = projects.indexOf(projectInArray[0]);
                projects[index].tasks.push(newTask);
            }
        }

        // Update local storage
        localStorage.setItem('projects', JSON.stringify(projects));
        localStorage.setItem('allTasks', JSON.stringify(allTasks));

        populateFilteredArrays(allTasks);

        // Reset container to base
        resetContainer();
        addContainerHeader('Today');
        renderArray(todayTasks);

        // Add listeners
        selectProjectTab();
        addCompletedListener();
        addRemoveListener();
        removeProject();
    });
});

// Select tasks for today
today.addEventListener('click', () => {
    resetContainer();
    addContainerHeader('Today');

    todayTasks = allTasks.filter(task => task.datetime === currentDate);

    renderArray(todayTasks); 

    // Add task listeners
    addCompletedListener();
    addRemoveListener();
})

// Select tasks for tomorrow
tomorrow.addEventListener('click', () => {
    resetContainer();
    addContainerHeader('Tomorrow');

    tomorrowTasks = allTasks.filter(task => task.datetime === tomorrowDate);

    renderArray(tomorrowTasks);
    
    // Add task listeners
    addCompletedListener();
    addRemoveListener();
})

// Select tasks this week
thisWeek.addEventListener('click', () => {
    resetContainer();
    addContainerHeader('This Week');

    let lowerLimit = currentDate + (86400 * 2 - 1);
    let upperLimit = currentDate + (86400 * 7 + 1);
    thisWeekTasks = allTasks.filter(task => {
        return task.datetime > lowerLimit && task.datetime < upperLimit;
    });

    renderArray(thisWeekTasks); 

    // Add task listeners
    addCompletedListener();
    addRemoveListener();
})

// Sidebar add project 
addProject.addEventListener('click', () => {
    if (addingProject) { return }
    addingProject = true;
    newProject();
    
    const submitNewProject = document.querySelector('.projects__new__submit')

    submitNewProject.addEventListener('click', () => {
        let newProject = createNewProject();
        projects.push(newProject);
        localStorage.setItem('projects', JSON.stringify(projects)); // Update local storage

        // Remove DOM elements to add new tab 
        const projectsTab = document.querySelector('.projects');
        const addNewTab = document.querySelector('.projects__new');
        projectsTab.removeChild(addNewTab);

        // Reset project tabs
        const currentProjectTabs = Array.from(document.querySelectorAll('.projects__tab'));
        for (let tab of currentProjectTabs) {
            sidebar.removeChild(tab);
        }

        // Populate projects tab
        if (collapsedProjects != true) {
             for (let project of projects) { addProjectTab(project) }
        }

        // Ability to select projects
        selectProjectTab();
        removeProject();

        addingProject = false;
    })
})

// Projects toggle collapse
projectsSidebar.addEventListener('click', (e) => {
    const collapseIcon = document.querySelector('.projects__collapse');
    if (e.target.className == 'projects__add' ||
        e.target.className == 'projects__new__submit' ||
        e.target.className == 'projects__new__title') { return }

        collapsedProjects = !collapsedProjects;

    if (collapsedProjects == true) {
        collapseIcon.innerHTML = '&#9650;';
        let projectTabs = Array.from(document.querySelectorAll('.projects__tab'));
        projectTabs.forEach(project => sidebar.removeChild(project));
    } else {
        collapseIcon.innerHTML = '&#9660;';
        for (let project of projects) {
            addProjectTab(project);
        }

        selectProjectTab();
        removeProject();
    }
})

// Toggle sidebar 
sidebarToggle.addEventListener('click', () => {

    if (collapsedSidebar) {
        sidebar.style.width = '30%';
        addProject.style.display = 'block';
    } else {
        sidebar.style.width = '0';
        addProject.style.display = 'none';
    }
    collapsedSidebar = !collapsedSidebar;
})

// Search highlighting
search.addEventListener('keyup', () => {
    let searchInput = search.value;
    let tasks = Array.from(container.querySelectorAll('.task__title'));
    let taskDescriptions = Array.from(container.querySelectorAll('.task__description'))
    let regex = new RegExp(searchInput, 'i');
    
    for (let task of tasks) {
        if (regex.test(task.textContent)) {
            task.classList.add('hl');
        } else {
            task.classList.remove('hl');
        }
    } 

    for (let i = 0; i < taskDescriptions.length; i++) {
        if (regex.test(taskDescriptions[i].textContent)) {
            tasks[i].classList.add('hl');
        }
    } 

    if (searchInput == '' || searchInput == ' ') {tasks.forEach(task => task.classList.remove('hl'))}
})