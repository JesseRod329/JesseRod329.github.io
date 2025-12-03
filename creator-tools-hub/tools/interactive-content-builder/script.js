const contentType = document.getElementById('contentType');
const titleInput = document.getElementById('title');
const addQuestionBtn = document.getElementById('addQuestionBtn');
const generateBtn = document.getElementById('generateBtn');
const questionsContainer = document.getElementById('questionsContainer');
const preview = document.getElementById('preview');

let questionCount = 0;

function addQuestion() {
    questionCount++;
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question-item';
    questionDiv.innerHTML = `
        <div class="question-header">
            <label>Question ${questionCount}</label>
            <button onclick="removeQuestion(this)" class="remove-btn">×</button>
        </div>
        <input type="text" class="question-text" placeholder="Enter question">
        <div class="options">
            <input type="text" placeholder="Option 1">
            <input type="text" placeholder="Option 2">
            <input type="text" placeholder="Option 3">
            <input type="text" placeholder="Option 4">
        </div>
    `;
    questionsContainer.appendChild(questionDiv);
}

function removeQuestion(btn) {
    btn.closest('.question-item').remove();
    updateQuestionNumbers();
}

function updateQuestionNumbers() {
    const questions = questionsContainer.querySelectorAll('.question-item');
    questions.forEach((q, i) => {
        q.querySelector('label').textContent = `Question ${i + 1}`;
    });
    questionCount = questions.length;
}

function generateContent() {
    const title = titleInput.value.trim();
    if (!title) {
        alert('Please enter a title');
        return;
    }
    
    const questions = Array.from(questionsContainer.querySelectorAll('.question-item')).map(q => {
        const questionText = q.querySelector('.question-text').value;
        const options = Array.from(q.querySelectorAll('.options input')).map(inp => inp.value).filter(v => v);
        return { question: questionText, options };
    });
    
    if (questions.length === 0) {
        alert('Please add at least one question');
        return;
    }
    
    const type = contentType.value;
    let html = `<div class="interactive-content ${type}">`;
    html += `<h2>${title}</h2>`;
    
    questions.forEach((q, i) => {
        html += `<div class="question-block">`;
        html += `<h3>${i + 1}. ${q.question}</h3>`;
        html += `<div class="options-list">`;
        q.options.forEach((opt, j) => {
            html += `<label class="option"><input type="${type === 'poll' ? 'radio' : 'checkbox'}" name="q${i}" value="${j}"> ${opt}</label>`;
        });
        html += `</div></div>`;
    });
    
    html += `<button class="submit-btn">Submit</button>`;
    html += `</div>`;
    
    preview.innerHTML = html;
}

addQuestionBtn.addEventListener('click', addQuestion);
generateBtn.addEventListener('click', generateContent);
window.removeQuestion = removeQuestion;

