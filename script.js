// Variable qui stock la ref de l'élément en déplacement pr le drag & drop
let draggableTask = null;

// Fonction pour add une nvlle tâche à la to-do list
function addTask() {
    const input = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');
    const taskText = input.value.trim();

    if (taskText !== '') {
        const li = document.createElement('li');
        li.draggable = true;
        
        // Contenu de la tâche (texte entré dans l'input quoi)
        const taskContent = document.createElement('span');
        taskContent.textContent = taskText;
        li.appendChild(taskContent);
        
        // Bouton supprimer
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Supprimer';
        deleteButton.classList.add('delete');
        deleteButton.addEventListener('click', deleteTask);
        li.appendChild(deleteButton);

        // Bouton modifier
        const editButton = document.createElement('button');
        editButton.textContent = 'Modifier';
        editButton.classList.add('modify');
        editButton.addEventListener('click', editTask);
        li.appendChild(editButton);

        // Ajout de la tâche à la to-do list
        taskList.appendChild(li);

        // Events pour le drag & drop
        li.addEventListener('dragstart', dragStart);
        li.addEventListener('dragover', dragOver);
        li.addEventListener('drop', drop);

        // Event pour valider une tâche (au double clic)
        li.addEventListener('dblclick', markAsDone);

        input.value = '';
    } else {
        alert('Tu peux pas créer une tâche vide, ça n\'a pas de sens enfin! ;)');
    }
}

// Fonction pour commencer le déplacement de la tâche
function dragStart(event) {
    draggableTask = event.target;
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setDragImage(event.target, 0, 0);
}

// Fonction pour gérer le survol pdt le déplacement
function dragOver(event) {
    event.preventDefault();
    const prevElement = draggableTask.previousElementSibling;
    const nextElement = draggableTask.nextElementSibling;
    // Effet de défilement qd on déplace un élément
    if (prevElement && event.clientY < prevElement.getBoundingClientRect().top + prevElement.offsetHeight / 2) {
        prevElement.before(draggableTask);
    } else if (nextElement && event.clientY > nextElement.getBoundingClientRect().top - nextElement.offsetHeight / 2) {
        nextElement.after(draggableTask);
    }
}

// Fonction pour gérer le drop et déplacer la tâche
function drop(event) {
    event.preventDefault();
    if (event.target.tagName === 'LI') {
        event.target.parentNode.insertBefore(draggableTask, event.target.nextSibling);
    } else {
        event.target.appendChild(draggableTask);
    }
}

// Fonction pour modifier une tâche
function editTask(event) {
    const newText = prompt('Modifier la tâche:', event.target.previousSibling.textContent.trim());
    if (newText !== null) {
        event.target.previousSibling.textContent = newText.trim();
    }
}

// Fonction pour supprimer une tâche
function deleteTask(event) {
    event.target.parentNode.remove();
}

// Fonction pour marquer une tâche comme validée
function markAsDone(event) {
    const task = event.currentTarget;
    task.classList.add('done');
    
    // Masquer les boutons "modifier" et "supprimer"
    const buttons = task.querySelectorAll('button');
    buttons.forEach(button => button.style.display = 'none');
    
    // Création du container pour le symbole de validation
    const validationContainer = document.createElement('span');
    validationContainer.classList.add('validation-symbol');
    
    // Ajout symbole de validation "✓" dans le container
    const validationSymbol = document.createElement('span');
    validationSymbol.textContent = '✓';
    validationContainer.appendChild(validationSymbol);
    
    // Ajout container pour la tâche
    task.appendChild(validationContainer);
    
    // Debug pour empêcher de valider plsrs fois une même tâche
    task.removeEventListener('dblclick', markAsDone);
}
