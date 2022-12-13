const express = require("express");
const path = require("path");
const app = express();
const dbPath = path.join(__dirname, "todoApplication.db");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
let db = null;

const initializeDBAndServer = async () => {
  try {
    db = open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB ERROR: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

//get rows based on scenarios
app.get("/todos/", async (request, response) => {
  const {
    search_q = "",
    order_by = "id",
    order = "ASC",
    priority = "",
    status = "",
    id = "",
  } = request.query;
  const getResultsQuery = `
    SELECT * FROM todo WHERE todo LIKE '%${search_q}%' priority LIKE '%${priority}%' status LIKE '%${status}%' id= '${id}';`;
  const result = await db.all(getResultsQuery);
  response.send(result);
});

//get todo based on todo id
app.get("/todos/:todoId", async (request, response) => {
  const { todoId } = request.params;
  const getTodoBasedOnId = `
    SELECT * FROM todo WHERE id= '${todoId}'`;
  const resultTodo = await db.get(getTodoBasedOnId);
  response.send(resultTodo);
});
