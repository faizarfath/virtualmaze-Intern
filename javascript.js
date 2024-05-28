let dragSrcEl = null;

function createButton(text, onClick, ariaLabel) {
    const button = document.createElement('button');
    button.textContent = text;
    button.onclick = onClick;
    button.setAttribute('aria-label', ariaLabel);
    return button;
}

function addItem() {
    const userInput = document.getElementById('userInput').value;
    if (userInput === '') return;

    const itemList = document.getElementById('itemList');

    const item = createItem(userInput);
    itemList.appendChild(item);

    sortItems();

    document.getElementById('userInput').value = '';
}

function createItem(text) {
    const item = document.createElement('div');
    item.className = 'item';
    item.draggable = true;
    item.addEventListener('dragstart', handleDragStart);
    item.addEventListener('dragover', handleDragOver);
    item.addEventListener('drop', handleDrop);
    item.addEventListener('dragend', handleDragEnd);

    const textSpan = document.createElement('span');
    textSpan.textContent = text;

    const editButton = createButton('Edit', () => {
        const newText = prompt('Edit the text', textSpan.textContent);
        if (newText !== null) {
            textSpan.textContent = newText;
            textSpan.classList.add('edited');
            sortItems();
        }
    }, 'Edit this item');

    const deleteButton = createButton('Delete', () => {
        const itemList = document.getElementById('itemList');
        itemList.removeChild(item);
    }, 'Delete this item');

    item.appendChild(textSpan);
    item.appendChild(editButton);
    item.appendChild(deleteButton);

    return item;
}

function sortItems() {
    const itemList = document.getElementById('itemList');
    const items = Array.from(itemList.children);

    items.sort((a, b) => {
        const textA = a.querySelector('span').textContent.toLowerCase();
        const textB = b.querySelector('span').textContent.toLowerCase();
        return textA.localeCompare(textB);
    });

    itemList.innerHTML = '';
    items.forEach(item => itemList.appendChild(item));
}

function handleDragStart(e) {
    this.style.opacity = '0.4';
    dragSrcEl = this;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault(); // Necessary. Allows us to drop.
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation(); // Stops some browsers from redirecting.
    }

    if (dragSrcEl !== this) {
        dragSrcEl.innerHTML = this.innerHTML;
        this.innerHTML = e.dataTransfer.getData('text/html');
        reattachEventListeners(dragSrcEl);
        reattachEventListeners(this);
    }

    return false;
}

function handleDragEnd(e) {
    this.style.opacity = '1.0';
}

function reattachEventListeners(item) {
    const editButton = item.querySelector('button[aria-label="Edit this item"]');
    const deleteButton = item.querySelector('button[aria-label="Delete this item"]');
    const textSpan = item.querySelector('span');

    editButton.onclick = () => {
        const newText = prompt('Edit the text', textSpan.textContent);
        if (newText !== null) {
            textSpan.textContent = newText;
            textSpan.classList.add('edited');
            sortItems();
        }
    };

    deleteButton.onclick = () => {
        const itemList = document.getElementById('itemList');
        itemList.removeChild(item);
    };
}

document.getElementById('userInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addItem();
    }
});
