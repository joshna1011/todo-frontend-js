document.addEventListener('DOMContentLoaded', function() {
    const baseUrl = 'http://18.233.96.113:8000/api/todos/';

    // Function to fetch all todos from the backend
    function fetchTodos() {
        fetch(baseUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch todos');
                }
                return response.json();
            })
            .then(data => {
                displayTodos(data);
            })
            .catch(error => {
                console.error('Error fetching todos:', error);
            });
    }

    // Function to display todos in the UI
    function displayTodos(todos) {
        const todoList = document.getElementById('todoList');
        todoList.innerHTML = '';

        todos.forEach(todo => {
            const listItem = document.createElement('li');
            listItem.classList.add('todo-item');

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = todo.completed;
            checkbox.classList.add('todo-checkbox');
            checkbox.addEventListener('change', function() {
                updateTodoStatus(todo.id, this.checked);
            });

            const todoDetails = document.createElement('div');
            todoDetails.classList.add('todo-details');

            const title = document.createElement('span');
            title.textContent = todo.title;
            title.classList.add('todo-title');
            if (todo.completed) {
                title.classList.add('completed');
            }

            const description = document.createElement('p');
            description.textContent = todo.description;
            description.classList.add('todo-description');
            if (todo.completed) {
                description.classList.add('completed');
            }

            const deleteIcon = document.createElement('span');
            deleteIcon.textContent = '\u00D7';
            deleteIcon.classList.add('delete-icon');
            deleteIcon.addEventListener('click', function() {
                deleteTodoConfirm(todo.id);
            });

            todoDetails.append(title, description);
            listItem.append(checkbox, todoDetails, deleteIcon);
            todoList.appendChild(listItem);
        });
    }

    // Function to add a new todo
    document.getElementById('todoForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const title = document.getElementById('titleInput').value;
        const description = document.getElementById('descriptionInput').value;

        if (title && description) {
            const newTodo = {
                title: title,
                description: description,
                completed: false
            };

            fetch(baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newTodo)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to add todo');
                }
                fetchTodos();
                document.getElementById('titleInput').value = '';
                document.getElementById('descriptionInput').value = '';
            })
            .catch(error => {
                console.error('Error adding todo:', error);
            });
        }
    });

    // Function to update todo status (completed or not)
    function updateTodoStatus(id, completed) {
        const updateData = {
            completed: completed
        };

        fetch(baseUrl + id + '/', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update todo');
            }
            fetchTodos();
        })
        .catch(error => {
            console.error('Error updating todo:', error);
        });
    }

    // Function to confirm and delete a todo
    function deleteTodoConfirm(id) {
        const confirmDelete = confirm('Are you sure you want to delete this todo?');
        if (confirmDelete) {
            deleteTodo(id);
        }
    }

    // Function to delete a todo
    function deleteTodo(id) {
        fetch(baseUrl + id + '/', {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete todo');
            }
            fetchTodos();
        })
        .catch(error => {
            console.error('Error deleting todo:', error);
        });
    }

    // Initial fetch of todos when the page loads
    fetchTodos();
});
