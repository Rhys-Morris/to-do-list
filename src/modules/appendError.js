function appendError(error) {
    const errorPlacement = document.querySelector('.new__buttons');
    errorPlacement.appendChild(error);
    setTimeout(() => errorPlacement.removeChild(error), 2500);
} 

export {appendError};