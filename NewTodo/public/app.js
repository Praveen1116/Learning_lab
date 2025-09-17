const input = document.querySelector("input");
const addBtn = document.querySelector("#add-btn");

const todosDiv = document.querySelector(".todos");

async function loadTodos() {
    todosDiv.innerHTML = "";
    const res = await fetch('/api/todos');
    const todos = await res.json();

    todos.forEach(todo => {
        addTodoToDOM(todo.title, todo.id);
    });
}

addBtn.addEventListener("click", async () => {
    const value = input.value.trim();
    if(value) {
        await fetch('/api/todos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ title: value })
        });
        input.value = "";
        loadTodos();
    }
});

function addTodoToDOM(title, id) {
    const todoItem = document.createElement("div");
    todoItem.className = "todoItems";
    todoItem.innerHTML = "";

    const titleSpan = document.createElement("span");
    titleSpan.textContent = title;
    todoItem.appendChild(titleSpan);

    const editDeleteDiv = document.createElement("div");
    editDeleteDiv.className = "edit-delete-div";

    const editBtn = document.createElement("button");
    editBtn.className = "edit-btn";
    editBtn.innerHTML = "Edit";
    editBtn.addEventListener("click", () => {
        const editInput = document.createElement("input");
        editInput.type = "text";
        editInput.className = "edit-input";
        editInput.value = title;
        todoItem.replaceChild(editInput, titleSpan);

        const saveBtn = document.createElement("button");
        saveBtn.innerHTML = "Save";
        saveBtn.className = "save-btn";
        saveBtn.addEventListener("click", async () => {
            const newTitle = editInput.value.trim();
            if (newTitle) {
                await fetch(`/api/todos/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title: newTitle })
                });
                loadTodos();
            }
        });

        editDeleteDiv.replaceChild(saveBtn, editBtn);
    });
    editDeleteDiv.appendChild(editBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.innerHTML = "Delete";
    deleteBtn.addEventListener("click", async () => {
        await fetch(`/api/todos/${id}`, {
            method: 'DELETE'
        });
        loadTodos();
    });
    editDeleteDiv.appendChild(deleteBtn);

    todoItem.appendChild(editDeleteDiv);
    todosDiv.appendChild(todoItem);
}

loadTodos();