const workflowNameInput = document.getElementById('workflowName');
const triggerSelect = document.getElementById('trigger');
const actionsInput = document.getElementById('actions');
const createBtn = document.getElementById('createBtn');
const workflowsDiv = document.getElementById('workflows');

function createWorkflow() {
    const name = workflowNameInput.value.trim();
    const trigger = triggerSelect.value;
    const actions = actionsInput.value.split('\n').filter(a => a.trim()).map(a => a.trim());
    
    if (!name || actions.length === 0) {
        alert('Please fill in all fields');
        return;
    }
    
    let workflows = JSON.parse(localStorage.getItem('workflows') || '[]');
    workflows.push({
        id: Date.now(),
        name,
        trigger,
        actions,
        enabled: true,
        createdAt: new Date().toISOString()
    });
    
    localStorage.setItem('workflows', JSON.stringify(workflows));
    
    workflowNameInput.value = '';
    actionsInput.value = '';
    
    displayWorkflows();
}

function displayWorkflows() {
    const workflows = JSON.parse(localStorage.getItem('workflows') || '[]');
    const sorted = workflows.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    if (sorted.length === 0) {
        workflowsDiv.innerHTML = '<p class="empty">No workflows created yet</p>';
        return;
    }
    
    workflowsDiv.innerHTML = sorted.map(w => `
        <div class="workflow-item">
            <div class="workflow-header">
                <div class="workflow-name">${w.name}</div>
                <div class="workflow-status ${w.enabled ? 'enabled' : 'disabled'}">
                    ${w.enabled ? '✓ Enabled' : '✗ Disabled'}
                </div>
            </div>
            <div class="workflow-trigger">Trigger: ${w.trigger}</div>
            <div class="workflow-actions">
                <strong>Actions:</strong>
                <ul>
                    ${w.actions.map(a => `<li>${a}</li>`).join('')}
                </ul>
            </div>
            <div class="workflow-controls">
                <button onclick="toggleWorkflow(${w.id})" class="btn-toggle">${w.enabled ? 'Disable' : 'Enable'}</button>
                <button onclick="deleteWorkflow(${w.id})" class="btn-delete">Delete</button>
            </div>
        </div>
    `).join('');
}

function toggleWorkflow(id) {
    let workflows = JSON.parse(localStorage.getItem('workflows') || '[]');
    workflows = workflows.map(w => w.id == id ? { ...w, enabled: !w.enabled } : w);
    localStorage.setItem('workflows', JSON.stringify(workflows));
    displayWorkflows();
}

function deleteWorkflow(id) {
    let workflows = JSON.parse(localStorage.getItem('workflows') || '[]');
    workflows = workflows.filter(w => w.id != id);
    localStorage.setItem('workflows', JSON.stringify(workflows));
    displayWorkflows();
}

createBtn.addEventListener('click', createWorkflow);
window.toggleWorkflow = toggleWorkflow;
window.deleteWorkflow = deleteWorkflow;
displayWorkflows();

