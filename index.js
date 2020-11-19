const listTemplate = document.querySelector('[data-list-template]');
const listContainer = document.querySelector('[data-list-container]');
const cardContainer = document.querySelector('[data-cards-container]');
const cardTemplate = document.querySelector('[data-card-template]');
const addListButton = document.querySelector('[data-add-list]');
const addListName = document.querySelector('[data-list-name]');
const listCards = document.querySelector('[data-lists]');

const LOCAL_STORAGE_LIST_NAMES = "lists.names"
//localStorage.clear();
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_NAMES)) || [];
let clicked = null;
let selectedListId = 1;


addListButton.addEventListener("click", event => {
    const listName = addListName.value;
    if (listName.trim()) {
        const listObj = addList(listName);
        lists.push(listObj);
        addListName.value ='';
        saveRender();
    }
});

function addList(listName) {
    return ({
        id: Date.now().toString().concat(listName),
        name: listName,
        cards: []
    });
}

function addCard(cardName, cardDate, cardDesc) {
    return ({
        id: Date.now().toString().concat(cardName),
        name: cardName,
        date: cardDate,
        desc: cardDesc,
        completed: false
    });
}

function render() {
    const listName = lists.find(list => list.id === selectedListId);
    clearLists();
    renderLists();
}

function addCardButton(event) {
    event.preventDefault();

    let eventButton = event.target;
    event = event.target.parentNode;
    const cardTitle = event.querySelector('input[type=text]');
    const cardDate = event.querySelector('input[type=date]');
    const cardDesc = event.querySelector('textarea');
    const cardTitleError = event.querySelector('[data-title-error]');
    if (clicked === eventButton.id) {
        if (cardTitle.value) {
            cardTitle.style.display = 'none';
            cardDate.style.display = 'none';
            cardDesc.style.display = 'none';
            clicked = false;
            cardTitleError.style.display = "none";
            const selectedList = lists.find(list => list.id === eventButton.id);
            const card = addCard(cardTitle.value, cardDate.value, cardDesc.value);
            selectedList.cards.push(card);
            saveRender();
        } else {
            cardTitleError.style.display = "block";
        }
    } else if (!clicked) {
        eventButton.style.backgroundColor = "#e9c46a";
        eventButton.style.color = 'black';
        cardTitle.style.display = 'block';
        cardDate.style.display = 'block';
        cardDesc.style.display = 'block';
        clicked = eventButton.id;
    }

} 
function renderLists() {
    lists.forEach(list => {
        const listEl = document.importNode(listTemplate.content, true);
        const curList = listEl.querySelector('div');
        curList.id = list.id;
        for (let i = 0; i < list.cards.length; i++) {
            const cardDiv = document.createElement('div');
            cardDiv.className = 'card';
            const cardTitl = document.createElement('h2');
            const cardDesc = document.createElement('p');
            const cardTitleEdit = document.createElement('input');
            const cardDescEdit = document.createElement('input');
            const cardDateEdit = document.createElement('input');
            cardTitl.innerText = list.cards[i].name;
            cardDiv.id = list.cards[i].id;
            cardTitl.id = list.id;
            cardDesc.innerText = list.cards[i].desc;
            if (list.cards[i].completed) {
                cardDiv.classList.add('completed');
            }
            cardDiv.append(cardTitl);
            if (list.cards[i].date) {
                const cardDate = document.createElement('h4');
                cardDate.className = 'dateText';
                cardDate.innerText = list.cards[i].date;
                cardDiv.append(cardDate);
            }
            cardDiv.append(cardDesc);
            curList.append(cardDiv);
            cardDiv.addEventListener('dblclick', function (e) {
                cardDiv.classList.toggle('completed');
                let selectedListObj = lists.find(list => list.id === e.target.parentNode.id);
                let selectedListCard = selectedListObj.cards.find(card => card.id === e.target.id);
                selectedListCard.completed = !selectedListCard.completed;
                saveRender();
            });
        }
        const listTitle = listEl.querySelector('[data-list-title]');
        listTitle.innerText = list.name;
        listTitle.id = list.id;
        const cardTitle = listEl.querySelector('input[type=text]');
        const cardDate = listEl.querySelector('[data-card-title-input]');
        const cardDesc = listEl.querySelector('[data-card-desc-input]');
        const addCardBtn = listEl.querySelector('[data-add-card-to-list-button]');
        addCardBtn.id = list.id;
        listContainer.append(listEl);

    });
}

function clearLists() {
    while (listContainer.firstChild) {
        listContainer.removeChild(listContainer.firstChild);
    }
}
function save() {
    localStorage.setItem(LOCAL_STORAGE_LIST_NAMES, JSON.stringify(lists));
}

function saveRender() {
    save();
    render();
    deleteEl();
}
function deleteEl() {
    const Els = document.querySelectorAll('h2');
    Els.forEach(el => {
        el.addEventListener('click', function (e) {
            if (e.target.parentNode.classList.toString() === "list") {
                lists = lists.filter(list => list.id !== e.target.id);
                saveRender();
            } else {
                if(!clicked){
                let cardTitleId = e.target.parentNode;
                cardTitleId = cardTitleId.firstChild;
                e.target.parentNode.classList.add('fall');
                e.target.parentNode.addEventListener('transitionend', function anim() {
                    selectedListId = lists.find(list => list.id === cardTitleId.id);
                    selectedListId.cards = selectedListId.cards.filter(card => card.id !== e.target.parentNode.id);
                    saveRender();
                });
                }
            }
        })

    });
}
saveRender();