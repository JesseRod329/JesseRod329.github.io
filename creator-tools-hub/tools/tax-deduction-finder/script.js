const expenseType = document.getElementById('expenseType');
const amountInput = document.getElementById('amount');
const checkBtn = document.getElementById('checkBtn');
const result = document.getElementById('result');
const deductions = document.getElementById('deductions');

const deductibleExpenses = {
    equipment: { deductible: true, percentage: 100, note: 'Fully deductible if used for business' },
    software: { deductible: true, percentage: 100, note: 'Software subscriptions are deductible' },
    'home-office': { deductible: true, percentage: 20, note: 'Home office deduction (simplified method)' },
    travel: { deductible: true, percentage: 100, note: 'Business travel expenses are deductible' },
    education: { deductible: true, percentage: 100, note: 'Education related to your business is deductible' },
    marketing: { deductible: true, percentage: 100, note: 'Marketing and advertising expenses are deductible' }
};

let totalDeductions = JSON.parse(localStorage.getItem('taxDeductions') || '[]');

function checkDeductibility() {
    const type = expenseType.value;
    const amount = parseFloat(amountInput.value) || 0;
    
    if (amount === 0) {
        alert('Please enter an amount');
        return;
    }
    
    const expense = deductibleExpenses[type];
    const deductibleAmount = (amount * expense.percentage) / 100;
    
    result.innerHTML = `
        <div class="result-card ${expense.deductible ? 'deductible' : 'not-deductible'}">
            <div class="result-status">${expense.deductible ? '✓ Deductible' : '✗ Not Deductible'}</div>
            <div class="result-amount">$${deductibleAmount.toFixed(2)}</div>
            <div class="result-note">${expense.note}</div>
        </div>
    `;
    
    if (expense.deductible) {
        totalDeductions.push({
            id: Date.now(),
            type,
            amount: deductibleAmount,
            date: new Date().toISOString()
        });
        localStorage.setItem('taxDeductions', JSON.stringify(totalDeductions));
        displayDeductions();
    }
    
    amountInput.value = '';
}

function displayDeductions() {
    const total = totalDeductions.reduce((sum, d) => sum + d.amount, 0);
    deductions.innerHTML = `
        <div class="total-card">
            <div class="total-label">Total Deductions</div>
            <div class="total-value">$${total.toFixed(2)}</div>
        </div>
    `;
}

checkBtn.addEventListener('click', checkDeductibility);
displayDeductions();

