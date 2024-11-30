loadSavedHTML();
console.log('hello');

function loadSavedHTML() {
    const savedHTML = localStorage.getItem('htmlPage');
    console.log(savedHTML);
    if (savedHTML) {
        const newWindow = window.open('', '_blank');
        if (newWindow) {
            newWindow.document.write(savedHTML);
            newWindow.document.close()
        } else {
            alert('Popup blocked! Please allow popups for this website.')
        }
    } else {
        alert('No HTML content found in local storage')
    }
}


