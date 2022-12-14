const db = require("../models");
const path = require("path");
const serverConfig = require("../config/server.config.js");
const nodemailer = require("nodemailer");

const Usuario = db.usuario;
const User = db.user;
const Role = db.role;
const EquiposUsuarios = db.equipos_usuarios;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const { empty } = require("rxjs");
const { user } = require("../models");
var CryptoJS = require("crypto-js");

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

  User.findOne({
    where: {correo_login: req.body.correo_login}
  })
  .then(finduser => {
  if (!finduser) {

  if(!empty(req.body.img)){
    var base64Data1 = req.body.img.replace(/^data:image\/png;base64,/, ""); 
    var base64Data2 = base64Data1.replace(/^data:image\/jpeg;base64,/, ""); 
    var base64Data = base64Data2.replace(/^data:image\/jpg;base64,/, ""); 

    require("fs").writeFile(serverConfig.HOST_SAVE+"usuarios/usuario-"+req.body.nombre+".png", base64Data, 'base64', function(err) { console.log(err); });
  }
  const pass_verify = bcrypt.hashSync(req.body.correo_login, 8);
  // Save User to Database
  User.create({
    correo_login: req.body.correo_login,
    pass_hash: bcrypt.hashSync(req.body.password, 8),
    pass_token_verify: pass_verify,
    verify: req.body.verify
  })
    .then(user => {
      Usuario.create({
          nombre: req.body.nombre,
          rut: req.body.rut,
          fono: req.body.fono,
          correo: req.body.correo_login,
          completada: req.body.completada,
          //direccion: req.body.direccion,
          img: !empty(req.body.img) ? "assets/img/usuarios/usuario-"+req.body.nombre+".png" : null,
          login_id: user.id
        }).then(() =>{
        }).catch(err => {
          res.status(500).send({ message: 'Error Crear Datos de Usuario: '+err.message });
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
              // create reusable transporter object using the default SMTP transport
              const usuario_new = {
                correo_login: req.body.correo_login,
                pass_token_verify: pass_verify,
                nombre: req.body.nombre
              };
              
              res.send({ message: "User was registered successfully!", data: usuario_new });
            }).catch(err => {
              res.status(500).send({ message: 'Error Guardar rol: '+err.message });
            });
          }).catch(err => {
            res.status(500).send({ message: 'Error Busqueda rol: '+err.message });
          });
        } else {
          // user role = 1
          user.setRoles([1]).then(() => {
            res.send({ message: "User was registered successfully!" });
          }).catch(err => {
            res.status(500).send({ message: 'Error Guardar rol Usuario: '+err.message });
          });
        }
    })
    .catch(err => {
      res.status(500).send({ message: 'Error Crear Login: '+err.message });
    });
    }else{ 
      return res.status(404).send({ message: "Usuario ya existe." });
    }
  })
  .catch(err => {
    res.status(500).send({ message: 'Error Buscar Usuario: '+err.message });
  });
};

// Retrieve all Usuarios from the database.
exports.findAll = (req, res) => {
  const nombre = req.query.nombre;
  var condition = nombre ? { nombre: { [Op.iLike]: `%${nombre}%` } } : null;

  Usuario.findAll({ where: condition, include: [{model: User, attributes:['correo_login'], include: [{model: Role, attributes:['id','nombre']}, {
    model: EquiposUsuarios, as: "usuario_equipos", attributes:['id','correo','rol','usuario_id']}] }]})
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

// Find a single Usuario with an id
exports.getInfo = (req, res) => {
  const id = req.params.id;

  /*Usuario.findByPk(id,*/Usuario.findOne({
    where: {login_id: id}
  , include: [{model: User, attributes:['correo_login'], include: [{model: Role, attributes:['id','nombre']}]}] })
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

// Find a single Usuario with an id
exports.findMenu = (req, res) => {
  const id = req.params.id;
  const correo = req.params.correo;

  User.findByPk(id, {include: /*[{model: User, attributes:['correo_login'], include: */[{model: Role, attributes:['id','nombre']}]}/*}] }*/)
    .then(data => {
      if (data) {
      EquiposUsuarios.findAll({ where: {
        [Op.or]: [
          { correo: correo },
          { usuario_id: id }
        ]
      }})
          .then(invitaciones => {
              const usuario = {
                usuario: data,
                invitaciones: invitaciones
              }
              res.send(usuario);
          }).catch(err => {
            res.status(500).send({
              message: "Error retrieving Invitaciones"
            });
          });
          
        }else{
          res.status(500).send({
            message: "Error retrieving clear Usuario with id=" + id
          });
        }
      }).catch(err => {
            res.status(500).send({
              message: "Error retrieving Usuario with id=" + id
            });
      });
};

exports.getPayment = async (req, res) => {

  //const payment = async function(a, b) {
    const WebpayPlus = require("transbank-sdk").WebpayPlus; // CommonJS
    const { Options, IntegrationApiKeys, Environment, IntegrationCommerceCodes } = require("transbank-sdk"); // CommonJS

    // Versión 3.x del SDK
    const tx = new WebpayPlus.Transaction(new Options(IntegrationCommerceCodes.WEBPAY_PLUS, IntegrationApiKeys.WEBPAY, Environment.Integration));
    const buyOrder = '123456';
    const sessionId = '123';
    const amount = 20;
    const returnUrl = serverConfig.HOST+'/usuarios/payment-sucess';//'http://localhost:5000/usuarios/payment-sucess';
    const response = await tx.create(buyOrder, sessionId, amount, returnUrl);
    console.log('response',response);
  /*  return response;
  }*/
  // Versión 2.x del SDK
  /*const response = await WebpayPlus.Transaction.create(buyOrder, sessionId, amount, returnUrl);*/

  // Versión 2.x del SDK
  /*
  WebpayPlus.commerceCode = 597055555532;
  WebpayPlus.apiKey = '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C';
  WebpayPlus.environment = Environment.Integration;*/
  //const response = await payment();
  res.send({
    message: "Respuesta:"+JSON.stringify(response)
  });
}

exports.savePayment = async (req, res) => {

    const TransaccionCompleta = require('transbank-sdk').TransaccionCompleta; // ES5

    const buyOrder = '123456';
    const sessionId = '123';
    const amount = 20;
    const cvv = req.body.cardCvv;
    const cardNumber = req.body.cardNumber;
    const cardExpirationDate = req.body.cardExpiryYear.substr(2)+'/'+(req.body.cardExpiryMonth > 9 ? req.body.cardExpiryMonth : '0'+req.body.cardExpiryMonth);
    
    // Es necesario ejecutar dentro de una función async para utilizar await
    const createResponse = await (new TransaccionCompleta.Transaction()).create(
      buyOrder, 
      sessionId, 
      amount, 
      cvv,
      cardNumber,
      cardExpirationDate
    );

    console.log('response',createResponse);

    const commitResponse = await (new TransaccionCompleta.Transaction()).commit(
      createResponse.token
    );
  
    res.send(commitResponse);
}

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

// Update a Account Usuario by the id in the request
exports.updateAccount = (req, res) => {
  const id = req.params.id;
  
  // Encrypt
  var cardCvv = req.body.accountPlan != 'gratuito' ? CryptoJS.AES.encrypt(req.body.cardCvv, 'mbipi123').toString() : '';
  var cardNumber = req.body.accountPlan != 'gratuito' ? CryptoJS.AES.encrypt(req.body.cardNumber, 'mbipi123').toString() : '';

  // Decrypt
  /*var bytes  = CryptoJS.AES.decrypt(ciphertext, 'mbipi123');
  var originalText = bytes.toString(CryptoJS.enc.Utf8);*/

  let usuario = {
      tipo_plan: req.body.accountPlan,
      tipo_cuenta: req.body.accountType,
      informacion: req.body.businessDescription,
      nombre_empresa: req.body.businessName,
      tipo_financiamiento: req.body.business == 'si' ? req.body.businessType : null,
      financiamiento: req.body.business,
      completada: true,
      cardCvv: req.body.accountPlan != 'gratuito' ? cardCvv : '',
      cardExpiryMonth: req.body.accountPlan != 'gratuito' ? req.body.cardExpiryMonth : '',
      cardExpiryYear: req.body.accountPlan != 'gratuito' ? req.body.cardExpiryYear : '',
      cardNumber: req.body.accountPlan != 'gratuito' ? cardNumber : '',
      nameOnCard: req.body.accountPlan != 'gratuito' ? req.body.nameOnCard : ''/*
      saveCard: "1"*/
    };

  Usuario.update(usuario, {
    where: { login_id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Usuario was updated successfully.",
          user: usuario
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

// Verify a Usuario by the pass_token in the request
exports.verifyLogin = (req, res) => {
	let usuario = {};
    usuario = {
      verify: true
    };

  User.update(usuario, {
    where: { pass_token_verify: req.body.pass_token }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Usuario was verify successfully."
        });
      } else {
        res.send({
          message: `Cannot verify Usuario with pass_token=${req.body.pass_token}. Maybe Usuario was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Usuario with pass_token=" + req.body.pass_token
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
          err.message || "Some error occurred while retrieving Usuarios."
      });
    });
};