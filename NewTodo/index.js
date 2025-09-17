const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

app.use(express.json());
app.use(express.static('public'));

const TODOS_FILE = path.join(__dirname, 'todos.json');

app.get('/api/todos', (req, res) => {
    const todos = JSON.parse(fs.readFileSync(TODOS_FILE, "utf-8"));
    todos.sort((a, b) => b.id-a.id);
    res.json(todos);
});

app.post('/api/todos', (req, res) => {
    const todos = JSON.parse(fs.readFileSync(TODOS_FILE, "utf-8"));
    const newTodo = { id: Date.now(), title: req.body.title };

    todos.push(newTodo);
    fs.writeFileSync(TODOS_FILE, JSON.stringify(todos, null, 2));
    res.json(newTodo);
});

app.put("/api/todos/:id", (req, res) => {
    const todos = JSON.parse(fs.readFileSync(TODOS_FILE, "utf-8"));
    const id = Number(req.params.id);
    const { title } = req.body;

    const updatedTodos = todos.map(todo => 
        todo.id === id ? { ...todo, title } : todo
    );
    fs.writeFileSync(TODOS_FILE, JSON.stringify(updatedTodos, null, 2));
    res.json({ sucess: true });
});

app.delete("/api/todos/:id", (req, res) => {
    const todos = JSON.parse(fs.readFileSync(TODOS_FILE, "utf-8"));
    const id = Number(req.params.id);

    const index = todos.findIndex(todo => todo.id === id);

    if(index !== -1) {
        todos.splice(index, 1);
        fs.writeFileSync(TODOS_FILE, JSON.stringify(todos, null, 2));
        res.json({ success: true });
    }
    else {
        res.json({ success: false, message: "Todo not found" });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.listen(3000);
