// DOM Elements
const assignmentNameInput = document.getElementById('assignmentName');
const assignmentGradeInput = document.getElementById('assignmentGrade');
const gpaValue = document.getElementById('gpaValue');
const errorMessage = document.getElementById('errorMessage');
const assignmentsList = document.getElementById('assignmentsList');
const assignmentsCount = document.getElementById('assignmentsCount');

let assignments = JSON.parse(localStorage.getItem('assignments')) || [];

// Initial render
renderAssignments();
updateGPA();

function addAssignment() {
  const name = assignmentNameInput.value.trim();
  const grade = parseFloat(assignmentGradeInput.value);

  // Validation
  if (!name || isNaN(grade) || grade < 0 || grade > 5) {
    errorMessage.textContent = '❗ Please enter a valid assignment name and grade between 0 and 5.';
    return;
  }

  errorMessage.textContent = ''; // Clear previous error
  const assignment = { name, grade };
  assignments.push(assignment);
  saveAndRender();
  assignmentNameInput.value = '';
  assignmentGradeInput.value = '';
}

function updateGPA() {
  if (assignments.length === 0) {
    gpaValue.textContent = '0.00';
    return;
  }
  const total = assignments.reduce((sum, item) => sum + item.grade, 0);
  const gpa = total / assignments.length;
  gpaValue.textContent = gpa.toFixed(2);
}

function renderAssignments() {
  assignmentsList.innerHTML = '';

  if (assignments.length === 0) {
    assignmentsList.innerHTML = `
      <div class="empty-state">
        No assignments added yet. Add your first assignment above!
      </div>
    `;
    assignmentsCount.textContent = '0 assignments';
    return;
  }

  assignments.forEach((a, index) => {
    const item = document.createElement('div');
    item.className = 'assignment-item';
    item.innerHTML = `
      <strong>${a.name}</strong> — Grade: ${a.grade}
    `;
    assignmentsList.appendChild(item);
  });

  assignmentsCount.textContent = `${assignments.length} ${assignments.length === 1 ? 'assignment' : 'assignments'}`;
}

function saveAndRender() {
  localStorage.setItem('assignments', JSON.stringify(assignments));
  renderAssignments();
  updateGPA();
}

// Keyboard "S" logs all data
document.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() === 's') {
    console.log('📚 All Assignments:', assignments);
  }
});
