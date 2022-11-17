// def de l'endroit et du nom(nom timestamp)
const express = require('express');
const multer  = require('multer');
const path="images/";

const _storage=multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,path);
  },
  filename:(req,file,cb)=>{
    cb(null,Date.now()+"!$"+file.originalname);
  }
});
const upload = multer({storage: _storage});

module.exports=upload;


