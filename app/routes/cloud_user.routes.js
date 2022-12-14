const router = require('express').Router();
const upload = require('../config/multer');
const cloudinary = require("cloudinary").v2;
var fs = require('fs');

const db = require('../models');
const CloudUser = db.cloud_user;
const ProyectoRecurso = db.proyecto_recurso;

cloudinary.config({
  cloud_name: 'tresideambipi',
  api_key: '735689747739288',
  api_secret: 'oPjl3NwlqAmOIWewUnbc01Jt8Jc',
  secure: true
});

router.post('/', upload.single('image'),async (req, res)=>{
  try{
    const result = await cloudinary.uploader.upload(req.file.path)
    //Crea una instancia de cloud_user
    let cloud_user = {
      name: req.body.name,
      secure_url: result.secure_url,
      cloudinary_id: result.public_id
    };

    await CloudUser.create(cloud_user);
    res.json(result);

  } catch(err) {
    console.log(err)
  }
})

router.post('/saveFiles/:proyecto_id/:usuario_id', upload.single('file'),async (req, res)=>{
  try{
    const result = await cloudinary.uploader.upload(req.file.path)
    //Crea una instancia de cloud_user
    let cloud_user = {
      name: 'Bosquejo-'+req.params.proyecto_id+'-'+req.params.usuario_id,//req.body.name,
      secure_url: result.secure_url,
      cloudinary_id: result.public_id
    };

    console.log('cloud_user', cloud_user);
    console.log('parametros',req.params);

    await CloudUser.create(cloud_user).then(cloud =>{
      console.log('cloud:',cloud); 
      let proyecto_recurso = {'proyecto_id': req.params.proyecto_id, 'bosquejar_id': cloud.dataValues.id, 'usuario_id': req.params.usuario_id };

      ProyectoRecurso.create(proyecto_recurso).then(pr =>{
          res.send({
            message: `Proyecto with id=${req.params.proyecto_id} was updated successfully.`, cloud_id: cloud.dataValues.id
          });

      }).catch(err => {
          res.status(500).send({
          message: "Error creating ProyectoRecurso. Error:"+err.message
          });
      });

    }).catch(err => {
        res.status(500).send({
        message: "Error creating CloudUser. Error:"+err.message
        });
    });

    //await CloudUser.create(cloud_user);
    //res.json(result);
    //res.json({message: res.file});
  } catch(err) {
    console.log(err)
  }
})

router.get("/", async (req, res) =>{

  const nombre = req.query.name;
  var condition = nombre ? { name: { [Op.iLike]: `%${nombre}%` } } : null;

  CloudUser.findAll({ where: condition})
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
        err.message || "Some error occurred while retrieving Cloud Users."
    });
  });

})



module.exports = router;
