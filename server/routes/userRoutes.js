
const express = require("express")
const auth = require("../middeleweres/Auth")
const { getUserCreations, getPublishedCreations, toggleLikeCreation } = require("../controllers/userController")

const router = express.Router()


router.get('/get-user-creations',auth,getUserCreations);
router.get('/get-published-creation',auth,getPublishedCreations);
router.post('/toggle-like-creation',auth,toggleLikeCreation);


module.exports = router