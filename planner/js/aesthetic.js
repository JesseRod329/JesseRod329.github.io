/* Vanilla JS Aesthetic Planner (CSP-safe, no external libs) */
(function(){
  const phoneSpecs = {
    'iPhone 15 Pro': { width: 393, height: 852 },
    'iPhone 15': { width: 393, height: 852 },
    'iPhone 14 Pro': { width: 393, height: 852 },
    'iPhone 14': { width: 390, height: 844 },
    'iPhone 13': { width: 390, height: 844 },
    'iPhone 12': { width: 390, height: 844 },
    'Samsung S24': { width: 384, height: 854 },
    'Samsung S23': { width: 384, height: 854 },
    'Google Pixel 8': { width: 412, height: 915 },
    'Google Pixel 7': { width: 412, height: 915 }
  };

  let state = {
    currentStep: 'input',
    tasks: [{ id: 1, title: '', description: '', time: '', timeLabel: 'Morning', priority: 'Medium', completed: false, color: 'morning' }],
    notes: [''],
    userName: '',
    plannerDate: '',
    selectedPhone: 'iPhone 15 Pro'
  };

  function initAestheticPlanner(){
    const today = new Date();
    const dateInput = document.getElementById('planner-date');
    if (dateInput) {
      dateInput.value = today.toISOString().split('T')[0];
    }
    state.plannerDate = today.toLocaleDateString('en-US', { month:'long', day:'numeric', year:'numeric' });
    setupListeners();
    renderTasks();
    renderNotes();
  }

  function setupListeners(){
    byId('add-task-btn')?.addEventListener('click', addTask);
    byId('add-note-btn')?.addEventListener('click', addNote);
    byId('generate-planner-btn')?.addEventListener('click', generatePlanner);
    byId('edit-planner-btn')?.addEventListener('click', ()=>showStep('input'));
    byId('download-regular-btn')?.addEventListener('click', downloadRegular);
    byId('download-phone-btn')?.addEventListener('click', togglePhoneSelector);
    byId('download-lockscreen-btn')?.addEventListener('click', downloadLockscreen);
    byId('user-name')?.addEventListener('input', e=>{ state.userName = e.target.value; });
    byId('planner-date')?.addEventListener('change', e=>{
      state.plannerDate = new Date(e.target.value).toLocaleDateString('en-US', { month:'long', day:'numeric', year:'numeric' });
    });
  }

  function showStep(step){
    document.querySelectorAll('.step').forEach(el=>el.classList.remove('active'));
    const stepEl = byId(step+'-step');
    if (stepEl) stepEl.classList.add('active');
    state.currentStep = step;
  }

  function addTask(){
    const nextId = Math.max(0, ...state.tasks.map(t=>t.id)) + 1;
    const periods = ['Morning','Afternoon','Evening'];
    const used = state.tasks.map(t=>t.timeLabel);
    const available = periods.find(p=>!used.includes(p)) || 'Morning';
    state.tasks.push({ id:nextId, title:'', description:'', time:'', timeLabel:available, priority:'Medium', completed:false, color:available.toLowerCase() });
    renderTasks();
  }

  window.removeTask = function(id){
    if (state.tasks.length > 1){
      state.tasks = state.tasks.filter(t=>t.id!==id);
      renderTasks();
    }
  }

  window.updateTask = function(id, field, value){
    const t = state.tasks.find(x=>x.id===id);
    if (!t) return;
    t[field] = value;
    if (field === 'timeLabel') t.color = value.toLowerCase();
  }

  function addNote(){ state.notes.push(''); renderNotes(); }
  window.updateNote = function(idx, val){ state.notes[idx] = val; }
  window.removeNote = function(idx){ if (state.notes.length>1){ state.notes.splice(idx,1); renderNotes(); } }

  function renderTasks(){
    const c = byId('tasks-container'); if (!c) return; c.innerHTML = '';
    state.tasks.forEach((task, i)=>{
      const card = document.createElement('div');
      card.className = 'task-card';
      card.innerHTML = `
        <h3>Task ${i+1}</h3>
        ${state.tasks.length>1?`<button type="button" class="btn btn-remove" onclick="removeTask(${task.id})">×</button>`:''}
        <div class="task-card-grid">
          <div class="form-group">
            <label class="form-label">Task Title *</label>
            <input type="text" class="form-input" value="${escapeHtml(task.title)}" placeholder="e.g., Website Work" onchange="updateTask(${task.id}, 'title', this.value)">
          </div>
          <div class="form-group">
            <label class="form-label">Time</label>
            <input type="text" class="form-input" value="${escapeHtml(task.time)}" placeholder="e.g., 9:00 AM - 10:00 AM" onchange="updateTask(${task.id}, 'time', this.value)">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Description</label>
          <textarea class="form-textarea" placeholder="Describe what you need to do..." onchange="updateTask(${task.id}, 'description', this.value)">${escapeHtml(task.description)}</textarea>
        </div>
        <div class="task-card-grid">
          <div class="form-group">
            <label class="form-label">Time Period</label>
            <select class="form-select" onchange="updateTask(${task.id}, 'timeLabel', this.value)">
              ${['Morning','Afternoon','Evening'].map(p=>`<option ${task.timeLabel===p?'selected':''}>${p}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Priority</label>
            <select class="form-select" onchange="updateTask(${task.id}, 'priority', this.value)">
              ${['High','Medium','Low'].map(p=>`<option ${task.priority===p?'selected':''}>${p}</option>`).join('')}
            </select>
          </div>
        </div>`;
      c.appendChild(card);
    });
  }

  function renderNotes(){
    const container = byId('notes-container'); if (!container) return; container.innerHTML = '';
    state.notes.forEach((note, idx)=>{
      const row = document.createElement('div');
      row.className = 'note-row';
      row.innerHTML = `
        <span class="note-emoji">💡</span>
        <input type="text" class="form-input note-input" value="${escapeHtml(note)}" placeholder="Add a helpful reminder..." onchange="updateNote(${idx}, this.value)">
        ${state.notes.length>1?`<button type="button" class="btn-note-remove" onclick="removeNote(${idx})">×</button>`:''}
      `;
      container.appendChild(row);
    });
  }

  function generatePlanner(){
    const valid = state.tasks.some(t=>String(t.title).trim().length>0 || String(t.description).trim().length>0);
    if (!valid){ alert('Please add at least one task!'); return; }
    byId('planner-date-display').textContent = state.plannerDate || 'Today';
    byId('planner-subtitle').textContent = state.userName? `${state.userName}'s Daily Journey` : 'Your Daily Journey';
    renderPlannerCircles();
    renderNotesDisplay();
    showStep('planner');
  }

  function renderPlannerCircles(){
    const mount = byId('task-circles'); if (!mount) return; mount.innerHTML = '';
    const validTasks = state.tasks.filter(t=>String(t.title).trim().length>0 || String(t.description).trim().length>0);
    validTasks.forEach((task, idx)=>{
      const el = document.createElement('div');
      el.className = `task-circle ${task.color}`;
      const priorityClass = task.priority==='High'?'priority-high': task.priority==='Low'?'priority-low':'priority-medium';
      el.innerHTML = `
        <div class="priority-badge ${priorityClass}">${task.priority.toUpperCase()}</div>
        <div class="completion-checkbox" aria-label="Toggle completion"></div>
        <div class="time-label">${escapeHtml(task.timeLabel)} ${task.time? '• '+escapeHtml(task.time):''}</div>
        <div class="task-title">${escapeHtml(task.title||task.description)}</div>
        ${task.title && task.description? `<div class="task-description">${escapeHtml(task.description)}</div>`:''}
      `;
      el.addEventListener('click',()=>{
        el.classList.toggle('completed');
        const cb = el.querySelector('.completion-checkbox');
        if (cb) cb.classList.toggle('completed');
      });
      mount.appendChild(el);
    });
  }

  function renderNotesDisplay(){
    const notesWrap = byId('notes-display');
    const list = byId('notes-list');
    if (!notesWrap || !list) return;
    const clean = state.notes.map(n=>String(n).trim()).filter(Boolean);
    if (clean.length){
      notesWrap.style.display = 'block';
      list.innerHTML = clean.map(n=>`<div class="note-display">💡 <span>${escapeHtml(n)}</span></div>`).join('');
    } else {
      notesWrap.style.display = 'none';
      list.innerHTML = '';
    }
  }

  function togglePhoneSelector(){ byId('phone-selector')?.classList.toggle('hidden'); buildPhoneGrid(); }
  function buildPhoneGrid(){
    const grid = byId('phone-grid'); if (!grid) return;
    grid.innerHTML = Object.keys(phoneSpecs).map(name=>`<button class="phone-button ${state.selectedPhone===name?'selected':''}" data-model="${name}">${name}</button>`).join('');
    grid.querySelectorAll('.phone-button').forEach(btn=>{
      btn.addEventListener('click',()=>{
        state.selectedPhone = btn.getAttribute('data-model');
        grid.querySelectorAll('.phone-button').forEach(b=>b.classList.remove('selected'));
        btn.classList.add('selected');
        const spec = phoneSpecs[state.selectedPhone];
        byId('phone-size-display').textContent = `Size: ${spec.width} x ${spec.height}`;
      });
    });
  }

  function downloadRegular(){
    alert('Regular download is handled by existing canvas-export.js. Use Export in planner if needed.');
  }
  function downloadLockscreen(){
    alert('Lockscreen download is handled by existing canvas-export.js. Use Export in planner if needed.');
  }

  function byId(id){ return document.getElementById(id); }
  function escapeHtml(t){ const d=document.createElement('div'); d.textContent=String(t||''); return d.innerHTML; }

  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', initAestheticPlanner);
  else initAestheticPlanner();
})();


