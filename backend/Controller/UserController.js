const User = require("../models/User");
const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken');
const _secret='a3ze20p8oi48uf01g1a5o6z9f94z';

exports.register = (req, res, next) => {
  User.findOne({email: req.body.email}).then((u) => {
    if (u != undefined) {
      return res.status(404).json({
        message: "Courriel déjà utilisé"
      });
    }
    bcrypt.hash(req.body.password, 3).then((h) => {
      const user = new User({
        email: req.body.email,
        password: h
      });
      user.save().then(() => {
        res.status(201).json({
          userId:user._id,
          token:jwt.sign(
            {userId:user._id},
            _secret,
            {expiresIn:"15h"},
            null
          )
        })
      }).catch((e) => {
        res.status(400).json({
          message: "erreur :" + e
        })
      });
    }).catch((e)=>{
      res.status(500);
    })
  });
}

exports.login = (req, res, next) => {
  User.findOne({email: req.body.email}).then((u) => {
    if (u === null) {
      return res.status(401).json({
        message: "Utilisateur inconnu"
      });
    } else {
      bcrypt.compare(req.body.password, u.password).then((r) => {
        r?res.status(200).json({
            userId:u._id,
            token:jwt.sign(
              {userId:u._id},
              _secret,
              {expiresIn:"15h"},
              null
            )
          })
          :res.status(401).json({
          message:"Utilisateur inconnu"
          })
      });
    }
  }).catch((e)=>{
    res.status(500);
  })
}
