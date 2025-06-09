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
            if (assignmentsList) {
                assignmentsList.innerHTML = '<div class="empty-state">No assignments added yet. Add your first assignment above!</div>';
            }
            return;
        }
        const total = assignments.reduce((sum, assignment) => sum + parseFloat(assignment.grade), 0);
        const gpa = (total / assignments.length).toFixed(2);
        gpaValue.textContent = isNaN(gpa) ? '0.00' : gpa;
        assignmentsCount.textContent = `${assignments.length} assignment${assignments.length === 1 ? '' : 's'}`;
    }

    // Render assignments
    function renderAssignments() {
        if (!assignmentsList) {
            console.error('assignmentsList element not found!');
            return;
        }
        assignmentsList.innerHTML = '';
        if (assignments.length === 0) {
            assignmentsList.innerHTML = '<div class="empty-state">No assignments added yet. Add your first assignment above!</div>';
        } else {
            assignments.forEach(assignment => {
                const div = document.createElement('div');
                div.classList.add('assignment-item');
                div.textContent = `${assignment.name}: ${assignment.grade}/5`;
                assignmentsList.appendChild(div);
            });
        }
        calculateGPA(); // Ensure GPA is updated after rendering
    }

    // Save to localStorage
    function saveAssignments() {
        localStorage.setItem('assignments', JSON.stringify(assignments));
    }

    // Add new input fields for additional assignments
    function addNewInputField() {
        const newInputGroup = document.createElement('div');
        newInputGroup.classList.add('input-group', 'additional-input');
        newInputGroup.innerHTML = `
            <div class="input-field">
                <label>Assignment Name</label>
                <input type="text" class="assignment-name" placeholder="Enter assignment name" maxlength="50">
            </div>
            <div class="input-field">
                <label>Grade (0-5)</label>
                <input type="number" class="assignment-grade" placeholder="Enter grade" min="0" max="5" step="0.1">
            </div>
            <button class="remove-btn" onclick="this.parentElement.remove()">Remove</button>
        `;
        document.querySelector('.input-section').insertBefore(newInputGroup, document.querySelector('.add-btn'));
    }

    // Add assignments (globally accessible)
    window.addAssignment = function() {
        const nameInputs = [assignmentNameInput, ...document.querySelectorAll('.assignment-name')];
        const gradeInputs = [assignmentGradeInput, ...document.querySelectorAll('.assignment-grade')];
        let validAssignments = [];
        let errors = [];

        nameInputs.forEach((nameInput, index) => {
            const name = nameInput.value.trim();
            const grade = parseFloat(gradeInputs[index].value);

            if (name && grade >= 0 && grade <= 5 && !isNaN(grade)) {
                validAssignments.push({ name, grade });
            } else if (name || gradeInputs[index].value) {
                errors.push(`Assignment ${index + 1}: Invalid name or grade (must be 0-5).`);
            }
        });

        if (validAssignments.length > 0) {
            assignments.push(...validAssignments);
            saveAssignments();
            renderAssignments(); // Render assignments after adding
            console.log('Assignments added:', assignments); // Debug log
            // Clear input fields
            nameInputs.forEach(input => input.value = '');
            gradeInputs.forEach(input => input.value = '');
            // Remove additional input fields
            document.querySelectorAll('.additional-input').forEach(el => el.remove());
            errorMessage.textContent = '';
        } else {
            errorMessage.textContent = errors.length > 0 ? errors.join(' | ') : 'Please enter at least one valid assignment.';
        }
    };

    // Reset GPA and assignments (globally accessible)
    window.resetGPA = function() {
        assignments = []; // Clear assignments array
        localStorage.removeItem('assignments'); // Clear localStorage
        saveAssignments(); // Ensure localStorage is updated
        // Force UI reset
        gpaValue.textContent = '0.00'; // Explicitly set GPA to 0.00
        if (assignmentsList) {
            assignmentsList.innerHTML = '<div class="empty-state">No assignments added yet. Add your first assignment above!</div>';
        }
        assignmentsCount.textContent = '0 assignments';
        // Clear initial input fields
        assignmentNameInput.value = '';
        assignmentGradeInput.value = '';
        // Remove additional input fields
        document.querySelectorAll('.additional-input').forEach(el => el.remove());
        errorMessage.textContent = '';
        console.log('GPA reset to 0.00'); // Debug log
    };

    // Add new input field button
    const addMoreButton = document.createElement('button');
    addMoreButton.classList.add('add-btn');
    addMoreButton.textContent = 'Add Another Assignment';
    addMoreButton.addEventListener('click', addNewInputField);
    document.querySelector('.input-section').insertBefore(addMoreButton, document.querySelector('.add-btn'));

    // Log data on 'S' key press
    document.addEventListener('keydown', (event) => {
        if (event.key.toLowerCase() === 's') {
            console.log('Assignments:', assignments);
            console.log('Current GPA:', gpaValue.textContent);
        }
    });

    // Initial render
    renderAssignments();
});
