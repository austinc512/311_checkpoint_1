const express = require("express");
const router = express.Router();

const controllers = require("../controllers/users");

// router.get("/comments", controllers.getComments), etc.

router.get("/users", controllers.listUsers);
router.get("/users/:id", controllers.showUser);
router.post("/users", controllers.createUser);
router.put("/users/:id", controllers.updateUser);
router.delete("/users/:id", controllers.deleteUser);

module.exports = router;
