const firstNameInput = document.querySelector('#first-name-input');
const lastNameInput = document.querySelector('#last-name-input');
const genderInput = document.querySelectorAll('input[name="gender"]');
const maleRadio = document.querySelector('#male-radio');
const femaleRadio = document.querySelector('#female-radio');

const ageInput = document.querySelector('#age-input');
const birthdayInput = document.querySelector('#bday-input');
// const fileInput = document.querySelector('#file-input');
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
    } else {
        alert("Enter valid item");
    }
    
    firstNameInput.value = '';
    lastNameInput.value = '';
    ageInput.value = '';
    birthdayInput.value = '';
    uncheckRadio();
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
            firstNameInput.value = ''; 
            lastNameInput.value = '';
            ageInput.value = '';
            birthdayInput.value = '';
            uncheckRadio();
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
    const form = document.querySelector('.form-input');
    const formData = new FormData(form);
    const dataObj = {};

    for (const [key, value] of formData.entries()) {
        dataObj[key] = value;
    }

    return dataObj;
}

function loadListItems () {
    for (let i = 0; i < arrayOfFullNames.length; i++) {
        const listItem = document.createElement('li');
        listItem.setAttribute('class', 'list-item');
        listItem.textContent = Object.values(arrayOfFullNames[i]).join(' - ');
        inputList.appendChild(listItem);
        createButtonsInContainer(listItem);
    }
}

function checkForm() {
    const firstName = firstNameInput.value;
    const lastName = lastNameInput.value;
    const age = ageInput.value;
    const birthday = birthdayInput.value;

    if (firstName === '') {
        return false;
    }
    if (lastName === '') {
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
}

function handleNewListItem(object) {
    const listItem = document.createElement('li');
    listItem.setAttribute('class', 'list-item');
    listItem.textContent = Object.values(object).join(' - ');
    arrayOfFullNames.push(object);
    localStorage.setItem('arrayOfFullNames', JSON.stringify(arrayOfFullNames));
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