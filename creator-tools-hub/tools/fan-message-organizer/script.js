const fanNameInput = document.getElementById('fanName');
const messageInput = document.getElementById('message');
const prioritySelect = document.getElementById('priority');
const addBtn = document.getElementById('addBtn');
const messagesDiv = document.getElementById('messages');
const tabs = document.querySelectorAll('.tab');

let currentFilter = 'all';

function addMessage() {
    const name = fanNameInput.value.trim();
    const message = messageInput.value.trim();
    const priority = prioritySelect.value;
    
    if (!name || !message) {
        alert('Please fill in all fields');
        return;
    }
    
    let messages = JSON.parse(localStorage.getItem('fanMessages') || '[]');
    messages.push({
        id: Date.now(),
        name,
        message,
        priority,
        read: false,
        date: new Date().toISOString()
    });
    
    localStorage.setItem('fanMessages', JSON.stringify(messages));
    
    fanNameInput.value = '';
    messageInput.value = '';
    
    displayMessages();
}

function displayMessages() {
    const messages = JSON.parse(localStorage.getItem('fanMessages') || '[]');
    let filtered = messages;
    
    if (currentFilter === 'high') {
        filtered = messages.filter(m => m.priority === 'high');
    } else if (currentFilter === 'unread') {
        filtered = messages.filter(m => !m.read);
    }
    
    const sorted = filtered.sort((a, b) => {
        if (a.priority === 'high' && b.priority !== 'high') return -1;
        if (b.priority === 'high' && a.priority !== 'high') return 1;
        return new Date(b.date) - new Date(a.date);
    });
    
    if (sorted.length === 0) {
        messagesDiv.innerHTML = '<p class="empty">No messages found</p>';
        return;
    }
    
    messagesDiv.innerHTML = sorted.map(m => `
        <div class="message-item ${m.read ? 'read' : ''} priority-${m.priority}">
            <div class="message-header">
                <div class="message-name">${m.name}</div>
                <div class="message-priority ${m.priority}">${m.priority}</div>
            </div>
            <div class="message-content">${m.message}</div>
            <div class="message-actions">
                <button onclick="toggleRead(${m.id})" class="btn-read">${m.read ? 'Mark Unread' : 'Mark Read'}</button>
                <button onclick="deleteMessage(${m.id})" class="btn-delete">Delete</button>
            </div>
        </div>
    `).join('');
}

function toggleRead(id) {
    let messages = JSON.parse(localStorage.getItem('fanMessages') || '[]');
    messages = messages.map(m => m.id == id ? { ...m, read: !m.read } : m);
    localStorage.setItem('fanMessages', JSON.stringify(messages));
    displayMessages();
}

function deleteMessage(id) {
    let messages = JSON.parse(localStorage.getItem('fanMessages') || '[]');
    messages = messages.filter(m => m.id != id);
    localStorage.setItem('fanMessages', JSON.stringify(messages));
    displayMessages();
}

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentFilter = tab.dataset.filter;
        displayMessages();
    });
});

addBtn.addEventListener('click', addMessage);
window.toggleRead = toggleRead;
window.deleteMessage = deleteMessage;
displayMessages();

