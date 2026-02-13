require("dotenv").config({ path: "./.env" })
const express = require("express")
const cors = require("cors")

const mongoose = require("mongoose")

mongoose.connect(process.env.MONGO_URL)

const app = express()

app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? 'https://todo-task-client-xi.vercel.app'
        : 'http://localhost:3000',
    credentials: true
}));

app.use(express.json())

app.use("/api/todo", require("./routes/todo.routes.js"))


mongoose.connection.once("open", () => {
    console.log("db connected");
    app.listen(process.env.PORT, console.log("server running..."))
})

module.exports = app;