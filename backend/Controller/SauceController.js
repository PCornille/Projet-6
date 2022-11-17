const Sauce=require('../models/Sauce');
const User=require('../models/User');
// const fs=require('fs');
const iSuppr=require('../Handler/ImageSuppressor');
const sanitize=require('mongo-sanitize');

exports.findAll=(req,res,next)=>{
  Sauce.find().then((s)=>
    res.status(201).json(s)
  ).catch((e)=>{
    res.status(404).json({
      message:"Sauce introuvable"
    });
  });
}

exports.findOne=(req,res,next)=>{
  Sauce.findOne({_id:req.params.id}).then((s)=>{
    res.status(200);
    res.send(s);
  }).catch((e)=>{
    res.status(404).json({
        message:"Sauce introuvable"
      }
    );
  });
}

exports.newSauce=(req,res,next)=>{
  let SauceStr=JSON.parse(req.body.sauce);
  const sauce=new Sauce({...sanitize(SauceStr),imageUrl:sanitize(`${req.protocol}://${req.get('host')}/images/${req.file.filename}`)});
  sauce.save().then(()=>{
    return res.status(201).json({
      message: "Sauce créée : \n"+JSON.stringify(sauce)
    });
  }).catch((e)=>{
    console.log(e);
    return res.status(404).json({
      message:"Cette sauce éxiste déjà"
    })
  });
}

exports.updateSauce=(req,res,next)=>{
  Sauce.findOne({_id:req.params.id}).then((s)=>{
    if(s===null){
      return res.status(202).json({
        message:"Sauce introuvable"
      });
    }
    if(s.userId!=req.auth.userId){
      return res.status(401).json({
        message:"Cette Sauce appartient a un autre usager"
      });
    }
    Sauce.findOneAndUpdate({_id:req.params.id},{...sanitize(req.body)},{new:true}).then((s)=>{
      console.log(s);
      console.log(req.file);
        if(req.file?req.file.filename:false) {
          iSuppr.imageSuppressor(req, s);
          s.imageUrl = sanitize(req.protocol + "://" + req.get('host') + "/images/" + req.file.filename);
        }
      s.save().then(()=>{
        res.status(200).json({
          message:"Sauce mise à jour"
        });
      }).catch((e)=>{
        console.log(e,"impossible de mettre à jour la sauce");
      });
    });
  });
}

exports.deleteSauce=(req,res,next)=>{
  Sauce.findOne({_id:req.params.id}).then((sauce)=>{
    if(sauce.userId!=req.auth.userId){
      return res.status(401).json({
        message:"Cette Sauce appartient a un autre usager"
      });
    }
    iSuppr.imageSuppressor(req,sauce);
    sauce.remove().then(()=>{
      return res.status(200).json({
        message:"Sauce supprimée"
      })
    }).catch((err)=>{
      console.log("La sauce n'a pas pû être supprimée",err);
    });
  }).catch((err)=>{
    console.log(err);
    return res.status(202).json({
      message:"Sauce introuvable"
    });
  })
}

exports.likeSauce=(req,res,next)=>{
  Sauce.findOne({_id:req.params.id}).then((s)=>{
    if(s===null){
      return res.status(404).json({
        message:"Sauce introuvable"
      });
    }
    switch(req.body.like){
      case 1:
        if(!s.usersLiked.includes(req.body.userId)){
          // if(s.usersDisliked.includes(req.body.userId)){
          //   s.usersDisliked.splice(s.usersDisliked.indexOf(req.body.userId), 1);
          // }
          s.usersLiked.push(req.body.userId);
          s.likes+=1;
          s.save(()=>{
            return res.status(200).json({
              message:"\"Like\" ajouté"
            });
          });
          break;
        }
        return res.status(304).json({
          message:"L'utilisateur aime déjà cette sauce"
        });
      case 0:{
        if(s.usersLiked.includes(req.body.userId)){
          s.usersLiked.splice(s.usersLiked.indexOf(req.body.userId),1);
          s.likes-=1;
          s.save(()=>{
            return res.status(200).json({
              message:"\"like\" retiré"
            });
          });
          break;
        }
        if(s.usersDisliked.includes(req.body.userId)){
          s.usersDisliked.splice(s.usersDisliked.indexOf(req.body.userId),1);
          s.dislikes-=1;
          s.save(()=>{
            return res.status(200).json({
              message:"\"Dislike\" retiré"
            });
          });
          break;
        }
        break;//@todo fallthrought sinon
      }
      case -1:{
        if(!s.usersDisliked.includes(req.body.userId)){
          // if(s.usersLiked.includes(req.body.userId)){
          //   s.usersLiked.splice(s.usersLiked.indexOf(req.body.userId), 1);
          // }
          s.usersDisliked.push(req.body.userId);
          s.dislikes+=1;
          s.save(()=>{
            return res.status(200).json({
              message:"\"Dislike\" ajouté"
            });
          });
          break;
        }
        return res.status(304).json({
          message:"L'utilisateur n'aime déjà pas cette sauce"
        });
      }
    }
  });
}

/*
Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: req.body.like++ },
 $push: { usersLiked: req.body.userId } })
 */
