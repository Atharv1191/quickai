
const express = require("express");
const auth = require("../middeleweres/Auth");
const { generateArticle, generateBlogTitle, generateImage, removeImageBackground, removeImageObject, reviewResume } = require("../controllers/aiController");
const upload = require("../configs/multer");

const router = express.Router();

router.post('/generate-article',auth,generateArticle);
router.post('/generate-blog-title',auth,generateBlogTitle);
router.post('/generate-image',auth,generateImage)
router.post('/remove-image-background',upload.single("image"),auth,removeImageBackground)
router.post('/remove-image-object',upload.single("image"),auth,removeImageObject);
router.post('/resume-review',upload.single("resume"),auth,reviewResume)
module.exports = router;