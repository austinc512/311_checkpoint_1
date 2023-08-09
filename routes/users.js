const express = require("express");
const router = express.Router();

const controllers = require("../controllers/users");

// router.get("/comments", controllers.getComments), etc.

router.get("/users", controllers.listUsers);
router.get("/users/:id", controllers.showUser);
router.post("/users", controllers.createUser);

router.put("/users/:id", controllers.updateUser);
router.put("/users/", function (req, res) {
  res.status(400).json({ message: "please specify a user" });
});

router.delete("/users/:id", controllers.deleteUser);
router.delete("/users/", function (req, res) {
  res.status(400).json({ message: "please specify a user" });
});

module.exports = router;
