async function signup(event) {
    event.preventDefault();
    const username = document.getElementById("signupUsername").value;
    const password = document.getElementById("signupPassword").value;

    const response = await axios.post("http://127.0.0.1:3000/signup", {
        username: username,
        password: password,
    });

    alert(response.data.message);

    document.querySelector(".signup-section").style.display = "none";
    document.querySelector(".signin-section").style.display = "block";
}

async function signin(event) {
    event.preventDefault();
    const username = document.getElementById("signinUsername").value;
    const password = document.getElementById("signinPassword").value;

    const response = await axios.post("http://127.0.0.1:3000/signin", {
        username: username,
        password: password,
    });

    alert(response.data.message);

    localStorage.setItem("token", response.data.token);
    localStorage.setItem("username", username);
    document.getElementById("user").innerHTML = username;  // 1 day fixed code

    document.querySelector(".signin-section").style.display = "none";
    document.querySelector("#todosSection").style.display = "block";
    loadTodos();
}

async function addTodo(event) {
    event.preventDefault();
    const title = document.getElementById("todoInput").value;

    await axios.post("http://127.0.0.1:3000/api/todos/" + document.getElementById("user").innerHTML, {
        title: title
    }, {
        headers: { token: localStorage.getItem("token") }
    });

    document.getElementById("todoInput").value = "";

    loadTodos();
}

async function loadTodos() {
    let response;
    try {
        response = await axios.get("http://127.0.0.1:3000/me", {
            headers: { token: localStorage.getItem("token") }
        });
    } catch(err) {
        logout();
    }
    const todos = response.data.todos;
    todos.sort((a, b) => b.id - a.id);

    const todoList = document.getElementById("todosList");
    todoList.innerHTML = "";
    todos.forEach(function(todo) {
        let li = document.createElement("li");
        li.textContent = todo.title;

        if(todo.done) {
            li.style.textDecoration = "line-through";
            li.style.opacity = "0.8";
        }

        const actionsDiv = document.createElement("div");
        actionsDiv.className = "todo-actions";

        // done
        const doneBtn = document.createElement("button");
        doneBtn.innerHTML = todo.done ? "Undone" : "Mark as Done";
        doneBtn.className = "done-btn";
        doneBtn.onclick = async function() {
            await axios.put("http://127.0.0.1:3000/api/todos/" + document.getElementById("user").innerHTML, {
                id: todo.id,
                done: !todo.done
            }, {
                headers: { token: localStorage.getItem("token") }
            });
            loadTodos();
        }
        actionsDiv.appendChild(doneBtn);

        //Edit-button
        const editBtn = document.createElement("button");
        editBtn.innerHTML = "Edit";
        editBtn.className = "edit-btn";
        editBtn.onclick = async function() {
            const newTitle = prompt("Edit todo:", todo.title);
            if(newTitle && newTitle.trim()) {
                await axios.put("http://127.0.0.1:3000/api/todos/" + document.getElementById("user").innerHTML, {
                    id: todo.id,
                    title: newTitle.trim()
                }, {
                    headers: { token: localStorage.getItem("token") }
                });
                loadTodos();
            }
        }
        actionsDiv.appendChild(editBtn);

        //Delete-button
        let deleteBtn = document.createElement("button");
        deleteBtn.innerHTML = "Delete";
        deleteBtn.className = "delete-btn"
        deleteBtn.onclick = async function() {
            if(confirm("Are you sure you want to delete this todo?")) {
                await axios.delete("http://127.0.0.1:3000/api/todos/" + document.getElementById("user").innerHTML, {
                    data: { id: todo.id },
                    headers: { token: localStorage.getItem("token") }
                });
                loadTodos();
            }
        };
        actionsDiv.appendChild(deleteBtn);

        li.appendChild(actionsDiv);

        todoList.appendChild(li);
    });
}

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    document.getElementById("user").innerHTML = "";
    document.querySelector("#todosSection").style.display = "none";
    document.querySelector(".signin-section").style.display = "block";
}


window.onload = function() {
    const token = localStorage.getItem("token");
    const username = this.localStorage.getItem("username");
    if (!token) {
        document.querySelector(".signup-section").style.display = "block";
        document.querySelector(".signin-section").style.display = "none";
        document.querySelector("#todosSection").style.display = "none";
        document.getElementById("user").innerHTML = "";
    } else {
        document.querySelector(".signup-section").style.display = "none";
        document.querySelector(".signin-section").style.display = "none";
        document.querySelector("#todosSection").style.display = "block";
        document.getElementById("user").innerHTML = username || "";
        // Optionally, load user info and todos
        loadTodos();
    }
};