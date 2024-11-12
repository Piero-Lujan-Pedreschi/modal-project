const firstNameInput = document.querySelector('#first-name-input');
const lastNameInput = document.querySelector('#last-name-input');
const submitButton = document.querySelector('.submit-input');
const inputList = document.querySelector('.input-list-dynamic');
const errorMessage = document.querySelector('.hidden');

firstNameInput.placeholder = "Please enter first name";
lastNameInput.placeholder = "Please enter last name";

const arrayOfFullNames = JSON.parse(localStorage.getItem('arrayOfFullNames')) || [];
loadListItems();

function appendNewItem() {
    const firstName = firstNameInput.value.trim(); 
    const lastName = firstNameInput.value.trim();
    const fullName = assignFormNamesToObject();

    if (checkForm()) {
        handleNewListItem(fullName);
    } else {
        alert("Enter valid item");
    }
    
    firstNameInput.value = '';
    lastNameInput.value = '';
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
        submitButton.onclick = () => {
            object.firstName = firstNameInput.value
            object.lastName = lastNameInput.value
            localStorage.setItem('arrayOfFullNames', JSON.stringify(arrayOfFullNames));
            listItem.firstChild.textContent = Object.values(object).join(' ');
            submitButton.onclick = appendNewItem;
            firstNameInput.value = ''; 
            lastNameInput.value = '';
        }
    }
    return editButton;
}

firstNameInput.addEventListener('input', () => {
    if (/\d/.test(firstNameInput.value) || /\d/.test(lastNameInput.value)) {
        errorMessage.style.display = "inline-block"
        submitButton.disabled = true;
    } else {
        errorMessage.style.display = "none"
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
    const namesObj = {};

    for (const [key, value] of formData.entries()) {
        namesObj[key] = value;
    }

    return namesObj;
}

function loadListItems () {
    for (let i = 0; i < arrayOfFullNames.length; i++) {
        const listItem = document.createElement('li');
        listItem.setAttribute('class', 'list-item');
        listItem.textContent = Object.values(arrayOfFullNames[i]).join(' ');
        inputList.appendChild(listItem);
        createButtonsInContainer(listItem);
    }
}

function checkForm() {
    const firstName = firstNameInput.value;
    const lastName = lastNameInput.value;

    if (firstName === '' || lastName === '') {
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
    listItem.textContent = Object.values(object).join(' ');
    arrayOfFullNames.push(object);
    localStorage.setItem('arrayOfFullNames', JSON.stringify(arrayOfFullNames));
    createButtonsInContainer(listItem);
    inputList.appendChild(listItem);
}