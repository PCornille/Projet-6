const express = require('express');
const router = express.Router();
const upload=require('../MiddleWare/Multer');
const auth = require('../MiddleWare/Auth');

const SauceController = require('../Controller/SauceController');

router.get("/",auth, SauceController.findAll);
router.get("/:id",auth, SauceController.findOne);
router.post("/",auth, upload.single("image"),SauceController.newSauce);
router.put("/:id",auth, upload.single("image"),SauceController.updateSauce);
router.delete("/:id",auth, SauceController.deleteSauce);
router.post("/:id/like",auth, SauceController.likeSauce);

module.exports=router;
