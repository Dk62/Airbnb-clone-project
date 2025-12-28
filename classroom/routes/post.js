const express = require("express");
const router = express.Router();

//posts
// index
router.get("/",(req, res) => {
    res.send("hii, i am root");
});

// show
router.get("/:id",(req, res) => {
    res.send("GET for user id");
});

// post
router.post("/",(req, res) => {
    res.send("Post for users");
});

//DELETE
router.delete("/:id",(req, res) => {
    res.send("DELETE for users id");
});

module.exports = router;