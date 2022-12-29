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

exports.uploads = async (file, folder, params) => {
  /*return new Promise(resolve => {
  */  
    const result = await cloudinary.uploader.upload(file);
    return result;
    /*cloudinary.uploader.upload(file, (result) => {
      resolve(result{
        //secure_url: result.secure_url,
        //cloudinary_id: result.public_id
      })
    },{
      resource_type: "auto",
      folder: folder
    })
  })*/

  /*try{
    const result = await cloudinary.uploader.upload(file.path)
    //Crea una instancia de cloud_user
    let cloud_user = {
      name: 'Bosquejo-'+params.proyecto_id+'-'+params.usuario_id,//req.body.name,
      secure_url: result.secure_url,
      cloudinary_id: result.public_id
    };

    console.log('cloud_user', cloud_user);
    console.log('parametros', params);

    await CloudUser.create(cloud_user).then(cloud =>{
      console.log('cloud:',cloud); 
      let proyecto_recurso = {'proyecto_id': params.proyecto_id, 'bosquejar_id': cloud.dataValues.id, 'usuario_id': params.usuario_id };

      ProyectoRecurso.create(proyecto_recurso).then(pr =>{
        console.log('Exito');

      }).catch(err => {
        console.log("Error creating ProyectoRecurso. Error:"+err.message);
      });

    }).catch(err => {
      console.log("Error creating CloudUser. Error:"+err.message)  
    });
  } catch(err) {
    console.log(err)
  }*/
}

router.delete('/deleteImg/:id/:cloudinary_id', async (req, res) =>{

const id = req.params.id;
const cloudinary_id = req.params.cloudinary_id;


ProyectoRecurso.destroy({
  where: { bosquejar_id: id }
})
  .then(num3 => {
    if (num3 == 1) {
    
  CloudUser.destroy({
    where: { id: id }
  })
    .then(num2 => {
      if (num2 == 1) {
        cloudinary.uploader
        .destroy(cloudinary_id)
        .then(result=> {
          console.log(result);
          res.send({
            message: "Cloud User Web was deleted successfully!"
          });
        }).catch(err => {
          res.status(500).send({
            message: "Could not delete Cloud User Web with cloudinary_id=" + cloudinary_id + ' | error:' + err.message
          });
        });
          /*res.send({
              message: "Cloud User was deleted successfully!"
            });*/
      } else {
        res.send({
          message: `Cannot delete Cloud User with id=${id}. Maybe Proyectos was not found!`
        });
      }
    }).catch(err => {
      res.status(500).send({
        message: "Could not delete Cloud User with id=" + id + ' | error:' + err.message
      });
    });
  } else {
    res.send({
      message: `Cannot delete Bosquejar Proyecto Recurso with id=${id}. Maybe Bosquejar was not found!`
    });
  }
  }).catch(err => {
    res.status(500).send({
      message: "Could not delete Bosquejar Proyecto Recurso with id=" + id + ' | error:' + err.message
    });
  });
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

router.post('/saveFilesMulti', upload.array('files[]'),async (req, res)=>{
  try{
    const uploader = async (path) => await this.uploads(path, 'Images', req.params)
    
    //if(req.method === 'POST'){
      const urls = [];
      const files = req.files;
      for (const file of files){
        const {path} = file;
        const result = await uploader(path, 'Images', req.params);
        console.log('uploader:',result);
        //urls.push(newPath);
        //fs.unlinkSync(path);
        try{
          //const result = await cloudinary.uploader.upload(file.path)
          //Crea una instancia de cloud_user
          let cloud_user = {
            name: 'Bosquejo-'+req.body.proyecto_id+'-'+req.body.usuario_id,//req.body.name,
            secure_url: result.secure_url,
            cloudinary_id: result.public_id
          };
      
          console.log('cloud_user', cloud_user);
      
          await CloudUser.create(cloud_user).then(cloud =>{
            console.log('cloud:',cloud); 
            let proyecto_recurso = {'proyecto_id': req.body.proyecto_id, 'bosquejar_id': cloud.dataValues.id, 'usuario_id': req.body.usuario_id };
      
            ProyectoRecurso.create(proyecto_recurso).then(pr =>{
              console.log('Exito');
      
            }).catch(err => {
              console.log("Error creating ProyectoRecurso. Error:"+err.message);
            });
      
          }).catch(err => {
            console.log("Error creating CloudUser. Error:"+err.message)  
          });
        } catch(err) {
          console.log(err)
        }
      }

      res.status(200).json({
        message: 'image uploaded successfully',
        data: urls
      });
    /*}else{
      res.status(405).json({
        err: 'No se pudo'
      });
    }*/
  /*  
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
*/
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
