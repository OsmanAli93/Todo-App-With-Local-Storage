

const time = document.querySelector('#date');
const clock = document.getElementById('clock');

function getCurrentDate () {

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    let now = new Date(),
        date = now.getDate(),
        year = now.getFullYear(),
        day = days[now.getDay()],
        month = months[now.getMonth()];

    time.innerHTML = `${day}, ${month} ${date}, ${year}`;

    console.log(date);
}

function showTime () {

    let timer = setInterval(() => {

        let now = new Date(),
            hour = now.getHours(),
            min = now.getMinutes();

        hour = hour % 12 || 12;

        clock.textContent = `${hour} : ${min < 10 ? '0' : ''}${min} ${hour >= 12 ? 'PM' : 'AM'}`;

    }, 1000);

}

function dynamicBackground () {

    let now = new Date(),
        hour = now.getHours();

    if (hour >= 6) {
        document.querySelector('.todo-app__header').style.backgroundImage = "url('/img/Morning.jpg')";
        document.querySelector('#greeting').textContent = 'Good Morning';

    } else if (hour >= 13) {
        document.querySelector('.todo-app__header').style.backgroundImage = "url('/img/Afternoon.jpg')";
        document.querySelector('#greeting').textContent = 'Good Afternoon';

    } else if (hour >= 17) {
        document.querySelector('.todo-app__header').style.backgroundImage = "url('/img/Evening.jpg')";
        document.querySelector('#greeting').textContent = 'Good Evening';

    } else if (hour <= 6) {
        document.querySelector('.todo-app__header').style.backgroundImage = "url('/img/Night.jpg')";
        document.querySelector('#greeting').textContent = 'Good Night';
    }
    
    console.log(hour);
}


const input = document.getElementById('input');
const listItem = document.getElementById('todo-list');
let items = JSON.parse(localStorage.getItem('items')) || [];

function addItem (e) {
    
    const text = document.getElementById('input').value;
    
    const item = {
        text,
        done: false
    };

    if (e.type === 'keypress') {
        if (e.keyCode == 13 || e.which == 13) {
            if (!text) {
                
                alert(`Can't Leave Input Field Empty`);
                return;
            }
            
            items.push(item);
            populateList(items, listItem);
            localStorage.setItem('items', JSON.stringify(items));
            e.target.value = '';   
            
        } 
    }
    
}

// GENERATE DYNAMIC HTML MARKUP

function populateList (todoList = [], todoItems) {

    todoItems.innerHTML = todoList.map((list, index) => { 
        return `
            <li>
                <div class="todo-list__container">
                    <input type="checkbox" data-index="${index}" id="item ${index}" ${list.done ? 'checked' : ''}/>
                    <label for="item ${index}">${list.text}</label>
                </div>
                <button class="del">
                    <i class="ion-ios-trash" data-index="${index}" data-target="${list.text}"></i>
                </button>
            </li>
        `;
    }).join('');

}

// GET CHECKBOX CHECKED ON CLICK

function getCheckboxToggle (e) {
    
    if (!e.target.matches('input')) return;  // if click does not match input, do nothing

    const index = e.target.dataset.index;
    items[index].done = !items[index].done; // toggle true/false 

    localStorage.setItem('items', JSON.stringify(items)); // update local storage
    populateList(items, listItem);  // populate markup 
    console.log(index);
}

// REMOVE LIST ITEM ON CLICK

function deleteTodoList (e) {

    const el = e.target.dataset.target;
    const index = e.target.dataset.index;

    if (!e.target.classList.contains('ion-ios-trash')) return;
    console.log(e.target);
    
    items.forEach(item => {  // loop through an array of items
        if (item.text === el) {  // check if data attribute is match to items object of text
            if (confirm('Are You Sure ?')) {

                items.splice(index, 1);  // remove list based on selected index
            }
        }
    })

    localStorage.setItem('items', JSON.stringify(items));
    populateList(items, listItem);

}

function clearLocalStorage () {

    const checkAll = document.getElementById('checkAll');
    const checkText = document.querySelector('.check');
    
    localStorage.removeItem('items'); // clear local storage of items
    
    if (checkAll.checked) {
        localStorage.setItem('checkall', checkAll.checked = '');
        localStorage.setItem('checkText', checkText.textContent = 'Check All');

    } 

    while (listItem.firstChild) {   // Remove all child elements at once

        listItem.removeChild(listItem.firstChild);
    }

    window.location.reload(true); // refresh browser

}

function checkAll () {
    
    const checkBoxAll = document.getElementById('checkAll');

    if (this.checked) {

        const checkbox = document.querySelector('.check');
        localStorage.setItem('checkall', checkBoxAll.checked);
        localStorage.setItem('checkText', checkbox.textContent = 'Uncheck All');
        

        for (let key in items) {

            items[key].done = true;
        } 

    } else {

        const checkbox = document.querySelector('.check');
        localStorage.setItem('checkall', checkBoxAll.checked = '');
        localStorage.setItem('checkText', checkbox.textContent = 'Check All');
        
        for (let key in items) {

            items[key].done = false;
        } 

    }

    localStorage.setItem('items', JSON.stringify(items));
    populateList(items, listItem);
}

function loadCheckbox () {

    const checked = localStorage.getItem('checkall');
    const checkText = localStorage.getItem('checkText');

    document.getElementById('checkAll').checked = checked;
    document.querySelector('.check').textContent = checkText;
}


document.addEventListener('DOMContentLoaded', getCurrentDate);
document.addEventListener('DOMContentLoaded', dynamicBackground);
document.addEventListener('DOMContentLoaded', showTime);

input.addEventListener('keypress', addItem);
listItem.addEventListener('click', getCheckboxToggle);
listItem.addEventListener('click', deleteTodoList);
document.getElementById('refresh').addEventListener('click', clearLocalStorage);
document.getElementById('checkAll').addEventListener('click', checkAll);
populateList(items, listItem);
loadCheckbox();
console.log(items);
