const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

const TODOS_FILE = path.join(__dirname, "todos.json");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

function readUsers() {
    if(!fs.existsSync(TODOS_FILE)) {
        return [];
    }
    return JSON.parse(fs.readFileSync(TODOS_FILE, "utf-8"));
}

function writeUsers(users) {
    fs.writeFileSync(TODOS_FILE, JSON.stringify(users, null, 2));
}

app.post("/signup", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    let users = readUsers();

    const userExists = users.find(u => u.username === username);

    if(userExists) {
        res.json({ message: "User already exists" });
    } else {
        users.push({
            username,
            password,
            todos: []
        });

        writeUsers(users);

        res.json({ message: "You are signed up!" });
    }
});

app.post("/signin", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    let users = readUsers();

    const foundUser = users.find(u => u.username === username && u.password === password);

    if(!foundUser) {
        res.json({ message: "You are not signed up!" });
    } else {
        const token = jwt.sign({ username: username }, JWT_SECRET, { expiresIn: "1h" });

        res.json({ message: "Signin successful", token });
    }
});

function auth(req, res, next) {
    const token = req.headers.token;
    if (!token) {
        return res.json({ message: "Token missing!" });
    }
    const decodedData = jwt.verify(token, JWT_SECRET);

    if(decodedData.username) {
        req.username = decodedData.username;
        next();
    } else {
        res.status(401).json({
            message: "Token invalid!"
        })
    }
}

app.get("/me", auth, (req, res) => {
    const currentUser = req.username;

    let users = readUsers();
    const foundUser = users.find(u => u.username === currentUser);

    if(foundUser) {
        res.json({
            username: foundUser.username,
            todos: foundUser.todos
        });
    } else {
        res.status(401).json({ message: "User not found" })
    }
});

app.post("/api/todos/:username", auth, (req, res) => {
    const username = req.params.username;
    let users = readUsers();

    const user = users.find(u => u.username === username && u.username === req.username);

    if(user) {
        if(req.body.title) {
            user.todos.push({ id: Date.now(), title: req.body.title, done: false });
            writeUsers(users);
            res.json({ message: "Todo added", todos: user.todos });
        } else {
            res.json({ message: "Title is required" });
        }
    }
    else{
        res.status(401).json({ message: "User not found "});
    }
});

app.put("/api/todos/:username", auth, (req, res) => {
    const username = req.params.username;
    let users = readUsers();

    const user = users.find(u => u.username === username && u.username === req.username);

    if(user) {
        const todoId = Number(req.body.id);
        const todoIndex = user.todos.findIndex(t => t.id === todoId);

        if(todoIndex !== -1) {
            if (typeof req.body.title !== "undefined") {
                user.todos[todoIndex].title = req.body.title;
            }
            if (typeof req.body.done !== "undefined") {
                user.todos[todoIndex].done = req.body.done;
            }
            writeUsers(users);
            return res.json({ message: "Todo updated", todos: user.todos })
        } else {
            res.json({ message: "Todo not found "});
        }
    } else {
        res.json({ message: "User not found" });
    }
});

app.delete("/api/todos/:username", auth, (req, res) => {
    const username = req.params.username;
    let users = readUsers();

    const user = users.find(u => u.username === username && u.username === req.username);

    if(user) {
        const todoId = Number(req.body.id);
        const initialLength = user.todos.length;

        user.todos = user.todos.filter(t => t.id !== todoId);
        if(user.todos.length < initialLength)
        {
            writeUsers(users);
            res.json({ message: "Todo deleted", todos: user.todos });
        } else {
            res.json({ message: "Todo not found" });
        }
    } else {
        res.json({ message: "User not found" });
    }
})

app.listen(3000);
