const sourceInput = document.getElementById('source');
const amountInput = document.getElementById('amount');
const dateInput = document.getElementById('date');
const addBtn = document.getElementById('addBtn');
const totalRevenue = document.getElementById('totalRevenue');
const monthRevenue = document.getElementById('monthRevenue');
const revenueListDiv = document.getElementById('revenueList');

dateInput.valueAsDate = new Date();

function addRevenue() {
    const source = sourceInput.value.trim();
    const amount = parseFloat(amountInput.value);
    const date = dateInput.value;
    
    if (!source || !amount || amount <= 0) {
        alert('Please fill in all fields with valid values');
        return;
    }
    
    let revenues = JSON.parse(localStorage.getItem('revenues') || '[]');
    revenues.push({ id: Date.now(), source, amount, date });
    localStorage.setItem('revenues', JSON.stringify(revenues));
    
    sourceInput.value = '';
    amountInput.value = '';
    dateInput.valueAsDate = new Date();
    
    displayRevenues();
}

function displayRevenues() {
    const revenues = JSON.parse(localStorage.getItem('revenues') || '[]');
    const sorted = revenues.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    const total = revenues.reduce((sum, r) => sum + r.amount, 0);
    totalRevenue.textContent = `$${total.toFixed(2)}`;
    
    const now = new Date();
    const thisMonth = revenues
        .filter(r => {
            const rDate = new Date(r.date);
            return rDate.getMonth() === now.getMonth() && rDate.getFullYear() === now.getFullYear();
        })
        .reduce((sum, r) => sum + r.amount, 0);
    monthRevenue.textContent = `$${thisMonth.toFixed(2)}`;
    
    if (sorted.length === 0) {
        revenueListDiv.innerHTML = '<p class="empty">No revenue entries yet</p>';
        return;
    }
    
    revenueListDiv.innerHTML = sorted.map(r => `
        <div class="revenue-item">
            <div class="revenue-info">
                <div class="revenue-source">${r.source}</div>
                <div class="revenue-date">${new Date(r.date).toLocaleDateString()}</div>
            </div>
            <div class="revenue-amount">$${r.amount.toFixed(2)}</div>
            <button onclick="deleteRevenue(${r.id})" class="delete-btn">×</button>
        </div>
    `).join('');
}

function deleteRevenue(id) {
    let revenues = JSON.parse(localStorage.getItem('revenues') || '[]');
    revenues = revenues.filter(r => r.id != id);
    localStorage.setItem('revenues', JSON.stringify(revenues));
    displayRevenues();
}

addBtn.addEventListener('click', addRevenue);
window.deleteRevenue = deleteRevenue;
displayRevenues();

