const fs=require('fs');
// const filename = sauce.imageUrl.split("/images")[1];
/*
param sauce=entité sauce
 */
exports.imageSuppressor=(req,sauce)=>{
  fs.unlink("images"+sauce.imageUrl.split("/images")[1],(err)=>{
    if(err){
      console.log(err,"\n l'image n'a pas pû être supprimée");
    }
  })
}

