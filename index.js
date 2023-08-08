const express = require("express");
const app = express();
const port = process.env.PORT || 5003;

app.use(express.json());

app.get("/", (req, res) => res.send("default route"));

const routes = require("./routes/users");

app.use(routes);

app.listen(port, () => {
  console.log("app is listening on:", port);
});
