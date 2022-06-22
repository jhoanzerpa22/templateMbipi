const db = require("../models");
const path = require("path");
const serverConfig = require("../config/server.config.js");

const Usuario = db.usuario;
const User = db.user;
const Role = db.role;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const { empty } = require("rxjs");

//var fs = require('fs');

// Create and Save a new Usuario
exports.create = (req, res) => {
  // Validate request
  if (!req.body.nombre) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  if(!empty(req.body.img)){
    var base64Data1 = req.body.img.replace(/^data:image\/png;base64,/, ""); 
    var base64Data2 = base64Data1.replace(/^data:image\/jpeg;base64,/, ""); 
    var base64Data = base64Data2.replace(/^data:image\/jpg;base64,/, ""); 

    require("fs").writeFile(serverConfig.HOST_SAVE+"usuarios/usuario-"+req.body.nombre+".png", base64Data, 'base64', function(err) { console.log(err); });
  }
    
  // Save User to Database
  User.create({
    correo_login: req.body.correo_login,
    pass_hash: bcrypt.hashSync(req.body.password, 8)
  })
    .then(user => {
      Usuario.create({
          nombre: req.body.nombre,
          rut: req.body.rut,
          fono: req.body.fono,
          correo: req.body.correo,
          //direccion: req.body.direccion,
          img: !empty(req.body.img) ? "assets/img/usuarios/usuario-"+req.body.nombre+".png" : null,
          login_id: user.id
        }).then(() =>{
      });

        if (req.body.roles) {
          /*Role.findAll({
            where: {
              nombre: {
                [Op.or]: req.body.roles
              }
            }
          }).then(roles => {
            user.setRoles(roles).then(() => {
              res.send({ message: "User was registered successfully!" });
            });
          });*/
          Role.findByPk(req.body.roles)
          .then(roles => {
            user.setRoles([roles]).then(() => {
                    res.send({ message: "User was registered successfully!" });
                  });
          });
        } else {
          // user role = 1
          user.setRoles([1]).then(() => {
            res.send({ message: "User was registered successfully!" });
          });
        }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

// Retrieve all Usuarios from the database.
exports.findAll = (req, res) => {
  const nombre = req.query.nombre;
  var condition = nombre ? { nombre: { [Op.iLike]: `%${nombre}%` } } : null;

  Usuario.findAll({ where: condition, include: [{model: User, attributes:['correo_login'], include: [{model: Role, attributes:['id','nombre']}]}] })
    .then(data => {
      for (let i = 0; i < data.length; i++) {
        if(data[i].img != null){
          data[i].img = serverConfig.HOST+'/'+data[i].img;
        }
        }
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving usuarioes."
      });
    });
};

// Find a single Usuario with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Usuario.findByPk(id,{ include: [{model: User, attributes:['correo_login'], include: [{model: Role, attributes:['id','nombre']}]}] })
    .then(data => {
      if (data) {
        if(data.img != null){
          data.img = serverConfig.HOST+'/'+data.img;
        }
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Usuario with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Usuario with id=" + id
      });
    });
};

// Update a Usuario by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  var imagen = "assets/img/usuarios/usuario-"+req.body.nombre+".png";
	let usuario = {};
	if(req.body.img_changed){
		var base64Data1 = req.body.img.replace(/^data:image\/png;base64,/, ""); 
    var base64Data2 = base64Data1.replace(/^data:image\/jpeg;base64,/, ""); 
    var base64Data = base64Data2.replace(/^data:image\/jpg;base64,/, ""); 

    require("fs").writeFile(serverConfig.HOST_SAVE+"usuarios/usuario-"+req.body.nombre+".png", base64Data, 'base64', function(err) { console.log(err); });
	   
    usuario = {
      nombre: req.body.nombre,
      rut: req.body.rut,
      fono: req.body.fono,
      correo_login: req.body.correo_login,
      img: imagen,
      //direccion: req.body.direccion
    };
  }else{
		
    usuario = {
      nombre: req.body.nombre,
      rut: req.body.rut,
      fono: req.body.fono,
      correo_login: req.body.correo_login,
      //direccion: req.body.direccion
    };
  }

  Usuario.update(usuario, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Usuario was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Usuario with id=${id}. Maybe Usuario was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Usuario with id=" + id
      });
    });
};

// Delete a Usuario with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Usuario.findByPk(id)
    .then(data => {
      if (data) {

        User.findOne({
          where: {id: data.login_id}
        })
          .then(user => {

            user.getRoles().then(roles => {
              for (let i = 0; i < roles.length; i++) {
                user.removeRoles(roles[i].id);
              }
            //user.removeRoles().then(num3 => {
              //if (num3 == 1) {
                Usuario.destroy({
                  where: { id: id }
                })
                  .then(num2 => {
                    if (num2 == 1) {
                      User.destroy({
                        where: { id: user.id }
                      })
                        .then(num => {
                          if (num == 1) {
                            res.send({
                              message: "Usuario was deleted successfully!"
                            });
                          } else {
                            res.send({
                              message: `Cannot delete Usuario with id=${id}. Maybe Usuario was not found!`
                            });
                          }
                        })
                        .catch(err => {
                          res.status(500).send({
                            message: "Could not delete Usuario with id=" + id
                          });
                        });
                    } else {
                      res.send({
                        message: `Cannot delete Usuario Login with id=${data.login_id}. Maybe Usuario was not found!`
                      });
                    }
                  }).catch(err => {
                    res.status(500).send({
                      message: "Could not delete Usuario Login with id=" + data.login_id + ' | error:' + err.message
                    });
                  });
              /*}else{
                res.send({
                  message: `Cannot delete Roles!`
                });
              }*/
            }).catch(err => {
              res.status(500).send({
                message: "Could not delete error: " + err.message
              });
            });
          }).catch(err => {
            res.status(500).send({
              message: "Could not find Usuario Login with id=" + data.login_id+" | error: "+err.message
            });
          });
          
      } else {
        res.status(404).send({
          message: `Cannot find Usuario with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Usuario with id=" + id
      });
    });
};


// Delete all Usuarios from the database.
exports.deleteAll = (req, res) => {
  Usuario.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Usuario were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Usuario."
      });
    });
};

// Find all active Usuarios
exports.findAllActive = (req, res) => {
  Usuario.findAll({ where: { activo: true } })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Usuarioes."
      });
    });
};