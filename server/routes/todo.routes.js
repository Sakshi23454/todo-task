const { readTodo, createTodo, updateTodo, deleteTodo } = require("../controllers/todo.controller.js")

const router = require("express").Router()

router
    .get("/", readTodo)
    .post("/create", createTodo)
    .patch("/modify/:todoID", updateTodo)
    .delete("/remove/:todoID", deleteTodo)

module.exports = router    