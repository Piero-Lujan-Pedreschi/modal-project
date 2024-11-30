const form = document.querySelector('.form-input');

const firstNameInput = document.querySelector('#first-name-input');
const lastNameInput = document.querySelector('#last-name-input');
const genderInput = document.querySelectorAll('input[name="gender"]');
const ageInput = document.querySelector('#age-input');
const birthdayInput = document.querySelector('#bday-input');
const submitButton = document.querySelector('.submit-input');


const modal = document.querySelector('.modal');
const modalTriggerButton = document.querySelector('.modal-trigger');
const modalCloseButton = document.querySelector('.modal-close');

const inputList = document.querySelector('.input-list-dynamic');
const textErrorMessage = document.querySelector('.hidden-text-input');
const numErrorMessage = document.querySelector('.hidden-num-input');

firstNameInput.placeholder = "Please enter first name";
lastNameInput.placeholder = "Please enter last name";

const arrayOfFullNames = JSON.parse(localStorage.getItem('arrayOfFullNames')) || [];
loadListItems();

modalTriggerButton.onclick = () => {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // prevent scrolling while modal is open
};

modalCloseButton.onclick = () => {
    modal.style.display = 'none';
    document.body.style.overflow = 'initial';
};

function appendNewItem() {
    const fullName = assignFormNamesToObject();

    if (checkForm()) {
        handleNewListItem(fullName);
        arrayOfFullNames.push(fullName);
        localStorage.setItem('arrayOfFullNames', JSON.stringify(arrayOfFullNames));
    } else {
        alert("Enter valid item");
    }
    form.reset();
}

function createRemoveButton() {
    const removeButton = document.createElement('button');
    removeButton.setAttribute('class', 'remove-button');
    removeButton.textContent = "X";
    removeButton.onclick = (event) => {
        const listItem = event.target.parentNode.parentNode;
        arrayOfFullNames.splice([...listItem.parentNode.children].indexOf(listItem), 1);
        localStorage.setItem('arrayOfFullNames', JSON.stringify(arrayOfFullNames));
        inputList.removeChild(listItem);
        console.log("removed");
    };
    return removeButton;
}

function createEditButton() {
    const editButton = document.createElement('button');
    editButton.setAttribute('class', 'edit-button');
    editButton.textContent = "Edit";
    editButton.onclick = (event) => {
        const listItem = event.target.parentNode.parentNode;
        const object = arrayOfFullNames[[...listItem.parentNode.children].indexOf(listItem)];     
        firstNameInput.value = object.firstName;
        lastNameInput.value = object.lastName;
        ageInput.value = object.age;
        birthdayInput.value = object.birthday;
        repopulateRadio(object.gender);
        submitButton.onclick = () => {
            object.firstName = firstNameInput.value;
            object.lastName = lastNameInput.value;
            object.age = ageInput.value;
            object.birthday = birthdayInput.value;
            object.gender = document.querySelector('input[name="gender"]:checked').value;
            localStorage.setItem('arrayOfFullNames', JSON.stringify(arrayOfFullNames));
            listItem.firstChild.textContent = Object.values(object).join(' - ');
            submitButton.onclick = appendNewItem;
            form.reset();
        }
    }
    return editButton;
}

firstNameInput.addEventListener('input', () => {
    if (/\d/.test(firstNameInput.value)) {
        textErrorMessage.style.display = "inline-block"
        submitButton.disabled = true;
    } else {
        textErrorMessage.style.display = "none"
        submitButton.disabled = false;
    }
});

lastNameInput.addEventListener('input', () => {
    if (/\d/.test(lastNameInput.value)) {
        textErrorMessage.style.display = "inline-block"
        submitButton.disabled = true;
    } else {
        textErrorMessage.style.display = "none"
        submitButton.disabled = false;
    }
});

// input.addEventListener("keypress", function (event) {
//     if (event.key === 'Enter') {
//         appendNewItem();
//     }
// });

function assignFormNamesToObject() {
    const formData = new FormData(form);
    const dataObj = {};

    for (const [key, value] of formData.entries()) {
        dataObj[key] = value;
    }

    return dataObj;
}

function loadListItems () {
    arrayOfFullNames.forEach(object => handleNewListItem(object));
}

function checkForm() {
    const firstName = firstNameInput.value;
    const lastName = lastNameInput.value;
    const age = ageInput.value;
    const birthday = birthdayInput.value;
    const gender = document.querySelector('input[name="gender"]:checked')?.value || null;

    if (firstName === '') {
        return false;
    }
    if (lastName === '') {
        return false;
    }
    if (gender === null) {
        return false;
    }
    if (age === '') {
        return false;
    }
    if (birthday === '') {
        return false;
    }
    return true;
}

function createButtonsInContainer(item) {
    const buttonContainer = document.createElement('div');
    buttonContainer.setAttribute('class', 'button-container');
    buttonContainer.appendChild(createEditButton());
    buttonContainer.appendChild(createRemoveButton());
    item.append(buttonContainer);
    return buttonContainer;
}

function handleNewListItem(object) {
    const linkContainer = document.createElement('a');
    const listItem = document.createElement('li');
    linkContainer.setAttribute('href', '#');
    linkContainer.setAttribute('target', '_blank');
    listItem.setAttribute('class', 'list-item');
    linkContainer.textContent = Object.values(object).join(' - ');
    linkContainer.addEventListener('click', (event) => {
        event.preventDefault();
        createNewHTML(object);
    });      
    listItem.appendChild(linkContainer);
    createButtonsInContainer(listItem);
    inputList.appendChild(listItem);
}

function uncheckRadio() {
    for (const gender of genderInput) {
        gender.checked = false;
    }
}


function repopulateRadio(objValue) {
    for (const gender of genderInput) {
        if (gender.value === objValue) {
            gender.checked = true;
            break;
        }
    }
}

function createNewHTML(object) {
    const htmlContent = `
        <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>List Item Details</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        padding: 20px;
                        line-height: 1.6;
                    }
                </style>
            </head>
            <body>
                <h1>List Item Details</h1>
                <p>${Object.entries(object).map(([key, value]) => `${key}: ${value}`).join('<br>')}</p>
                <a href="#" onclick="window.close()">Close</a>
                <script src="secondary.js" type="module" defer></script>
            </body>
            </html>
        `;
    localStorage.setItem('htmlPage', htmlContent);

    // const newWindow = window.open('', '_blank');
    // if (newWindow) {
    //     newWindow.document.write(htmlContent);
    //     newWindow.document.close();
    // } else {
    //     alert('Popup blocked! Please allow popups for this website.')
    // }
    

    loadSavedHTML();
}
