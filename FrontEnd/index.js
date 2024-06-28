document.addEventListener('DOMContentLoaded', function () {
    const taskForm = document.getElementById('form-tareas');
    const taskList = document.getElementById('lista-tareas');
    const taskEdit = document.getElementById('editTarea-form');
    const editTitulo = document.getElementById('nuevoTitulo-tarea');
    const editDescripcion = document.getElementById('nuevaDescripcion-tarea');
    let editTaskId = null;

    taskForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const title = document.getElementById('titulo-tarea').value;
        const description = document.getElementById('descripcion-tarea').value;

        const response = await fetch('http://127.0.0.1:5000/tareas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ titulo: title, descripcion: description })
        });

        if (response.ok) {
            console.log('Task created successfully');
            loadTasks();
            taskForm.reset();
        } else {
            console.error('Failed to create task', await response.text());
        }
    });

    taskList.addEventListener('click', async function (e) {
        if (e.target.tagName === 'BUTTON') {
            const action = e.target.dataset.action;
            const taskId = e.target.dataset.id;

            if(action === 'delete'){
                const response = await fetch(`http://127.0.0.1:5000/tareas/${taskId}`, {
                    method: 'DELETE'
                });

                if(response.ok){
                    loadTasks();
                }
            }else if(action === 'edit'){
                
                editTaskId = taskId;
                const response = await fetch(`http://127.0.0.1:5000/tareas/${taskId}`)
                const task =  await response.json();
                
                editTitulo.value = task.titulo;
                editDescripcion.value = task.descripcion;
                taskEdit.style.display = 'block';
                
            }
        }
    });

    taskEdit.addEventListener('submit', async function(e){
        e.preventDefault();
        
        if (!editTaskId) return;

        const titulo = editTitulo.value;
        const descripcion = editDescripcion.value;

        const response = await fetch(`http://127.0.0.1:5000/tareas/${editTaskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ titulo: titulo, descripcion: descripcion })
        })

        if (response.ok) {
            console.log('Task updated successfully');
            loadTasks();
            taskEdit.reset();
            taskEdit.style.display = 'none';
            editTaskId = null;
        } else {
            console.error('Failed to update task', await response.text());
        }

    });

    async function loadTasks() {
        const response = await fetch('http://127.0.0.1:5000/tareas');
        const tasks = await response.json();
        console.log('Tasks loaded:', tasks);
        taskList.innerHTML = '';

        tasks.forEach(task => {
            const li = document.createElement('li');
            li.textContent = `${task.titulo}: ${task.descripcion}`;
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Eliminar';
            deleteButton.dataset.id = task.id;
            deleteButton.dataset.action = 'delete'
            
            const editButton = document.createElement('button');
            editButton.textContent = 'Editar';
            editButton.dataset.id = task.id;
            editButton.dataset.action = 'edit';

            li.appendChild(editButton);
            li.appendChild(deleteButton);
            taskList.appendChild(li);
        });
    }

    loadTasks();
});
