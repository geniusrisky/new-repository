
const express = require('express');
const router = express.Router();
const authorController= require("../controllers/authorController")
const blogsController =require("../controllers/blogsController")
const middleware = require("../middleware/auth")

router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})

router.post("/authors", authorController.authors)

router.post("/login", authorController.loginAuthor)

router.post("/blogs" , blogsController.blogs )

router.get("/blogs" , blogsController.getBlogs)

router.put("/blogs/:blogId" ,middleware.validateToken,middleware.authorisation,blogsController.putBlogs)

router.delete("/blogs/:blogId", middleware.validateToken,middleware.authorisation,blogsController.deleteBlog)

router.delete("/blogs",middleware.validateToken,middleware.authorisation,middleware.delQueryAuth , blogsController.blogDeletionQuery)

module.exports = router;      