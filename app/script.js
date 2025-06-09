document.addEventListener('DOMContentLoaded', () => {
  // Load assignments from localStorage
  let assignments = JSON.parse(localStorage.getItem('assignments')) || [];
  
  // DOM Elements
  const assignmentNameInput = document.getElementById('assignmentName');
  const assignmentGradeInput = document.getElementById('assignmentGrade');
  const gpaValue = document.getElementById('gpaValue');
  const assignmentsList = document.getElementById('assignmentsList');
  const assignmentsCount = document.getElementById('assignmentsCount');
  const errorMessage = document.getElementById('errorMessage');
  
  // Calculate and update GPA
  function calculateGPA() {
      if (assignments.length === 0) {
          gpaValue.textContent = '0.00';
          assignmentsCount.textContent = '0 assignments';
          return;
      }
      const total = assignments.reduce((sum, assignment) => sum + parseFloat(assignment.grade), 0);
      const gpa = (total / assignments.length).toFixed(2);
      gpaValue.textContent = isNaN(gpa) ? '0.00' : gpa;
      assignmentsCount.textContent = `${assignments.length} assignment${assignments.length === 1 ? '' : 's'}`;
  }

  // Render assignments with proper structure
  function renderAssignments() {
      if (!assignmentsList) {
          console.error('assignmentsList element not found!');
          return;
      }
      
      assignmentsList.innerHTML = '';
      
      if (assignments.length === 0) {
          assignmentsList.innerHTML = '<div class="empty-state">No assignments added yet. Add your first assignment above!</div>';
      } else {
          assignments.forEach((assignment, index) => {
              const div = document.createElement('div');
              div.classList.add('assignment-item');
              
              // Create assignment name element
              const nameElement = document.createElement('span');
              nameElement.classList.add('assignment-name');
              nameElement.textContent = assignment.name;
              
              // Create grade element
              const gradeElement = document.createElement('span');
              gradeElement.classList.add('assignment-grade');
              gradeElement.textContent = `${assignment.grade}/5`;
              
              // Create delete button
              const deleteButton = document.createElement('button');
              deleteButton.classList.add('delete-btn');
              deleteButton.textContent = 'Delete';
              deleteButton.onclick = () => deleteAssignment(index);
              
              // Append elements to the assignment item
              div.appendChild(nameElement);
              div.appendChild(gradeElement);
              div.appendChild(deleteButton);
              
              assignmentsList.appendChild(div);
          });
      }
      calculateGPA();
  }

  // Delete assignment function
  function deleteAssignment(index) {
      assignments.splice(index, 1);
      saveAssignments();
      renderAssignments();
  }

  // Save to localStorage
  function saveAssignments() {
      localStorage.setItem('assignments', JSON.stringify(assignments));
  }

  // Show error message
  function showError(message) {
      errorMessage.textContent = message;
      errorMessage.style.display = 'block';
      setTimeout(() => {
          errorMessage.style.display = 'none';
      }, 3000);
  }

  // Add assignment function (globally accessible)
  window.addAssignment = function() {
      const name = assignmentNameInput.value.trim();
      const grade = parseFloat(assignmentGradeInput.value);

      // Validation
      if (!name) {
          showError('Please enter an assignment name.');
          return;
      }

      if (isNaN(grade) || grade < 0 || grade > 5) {
          showError('Please enter a valid grade between 0 and 5.');
          return;
      }

      // Add the assignment
      assignments.push({ name, grade });
      saveAssignments();
      renderAssignments();
      
      // Clear input fields
      assignmentNameInput.value = '';
      assignmentGradeInput.value = '';
      
      console.log('Assignment added:', { name, grade });
      console.log('All assignments:', assignments);
  };

  // Reset GPA and assignments (globally accessible)
  window.resetGPA = function() {
      if (confirm('Are you sure you want to reset all assignments? This cannot be undone.')) {
          assignments = [];
          localStorage.removeItem('assignments');
          renderAssignments();
          
          // Clear input fields
          assignmentNameInput.value = '';
          assignmentGradeInput.value = '';
          errorMessage.style.display = 'none';
          
          console.log('GPA reset - all assignments cleared');
      }
  };

  // Enter key support for adding assignments
  [assignmentNameInput, assignmentGradeInput].forEach(input => {
      input.addEventListener('keypress', (event) => {
          if (event.key === 'Enter') {
              addAssignment();
          }
      });
  });

  // Log data on 'S' key press
  document.addEventListener('keydown', (event) => {
      if (event.key.toLowerCase() === 's') {
          console.log('Current assignments:', assignments);
          console.log('Current GPA:', gpaValue.textContent);
          console.log('Total assignments:', assignments.length);
      }
  });

  renderAssignments();
});