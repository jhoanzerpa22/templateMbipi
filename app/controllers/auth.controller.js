const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Usuario = db.usuario;
const Role = db.role;
const Proyectos = db.proyectos;
const EquiposUsuarios = db.equipos_usuarios;
const serverConfig = require("../config/server.config.js");

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");



exports.signup = (req, res) => {
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
          login_id: user.id
        }).then(() =>{
  		});

	      if (req.body.roles) {
	        Role.findAll({
	          where: {
	            nombre: {
	              [Op.or]: req.body.roles
	            }
	          }
	        }).then(roles => {
	          user.setRoles(roles).then(() => {
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

exports.signin = (req, res) => {
  User.findOne({
    where: {correo_login: req.body.email}/*db.Sequelize.where(
      db.Sequelize.fn('upper',db.Sequelize.col('correo_login')), req.body.correo_login.toUpperCase())*/, include: ['proyectos']
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.pass_hash
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });

      var authorities = [];
      user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push(roles[i].nombre.toUpperCase());
        }
        Usuario.findOne({
		    where: {
		      login_id: user.id
		    }
		    }).then(usuario => {

          EquiposUsuarios.findOne({
            where: {correo: user.correo_login, participante: false}
          })
            .then(invitacion => {
              if (!invitacion) {
                res.status(200).send({
                  id: user.id,
                  nombre: usuario.nombre,
                  rut: usuario.rut,
                  fono: usuario.fono,
                  email: usuario.correo,
                  correo_login: user.correo_login,
                  img: serverConfig.HOST+'/'+usuario.img,
                  roles: authorities,
                  accessToken: token,
                  verify: user.verify,
                  completada: usuario.completada,
                  proyectos: user.proyectos,
                  invitaciones: []
                });
              }else{

                res.status(200).send({
                  id: user.id,
                  nombre: usuario.nombre,
                  rut: usuario.rut,
                  fono: usuario.fono,
                  email: usuario.correo,
                  correo_login: user.correo_login,
                  img: serverConfig.HOST+'/'+usuario.img,
                  roles: authorities,
                  accessToken: token,
                  verify: user.verify,
                  completada: usuario.completada,
                  proyectos: user.proyectos,
                  invitaciones: invitacion
                });

              }
            }).catch(err => {
              res.status(200).send({
                id: user.id,
                nombre: usuario.nombre,
                rut: usuario.rut,
                fono: usuario.fono,
                email: usuario.correo,
                correo_login: user.correo_login,
                img: serverConfig.HOST+'/'+usuario.img,
                roles: authorities,
                accessToken: token,
                verify: user.verify,
                completada: usuario.completada,
                proyectos: user.proyectos,
                invitaciones: []
              });
            });

		    }).catch(err => {
          res.status(500).send({ message: err.message });
        });
      }).catch(err => {
        res.status(500).send({ message: err.message });
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.updatePassword = (req, res) => {
  const id = req.params.id;
	let usuario = {
        pass_hash: bcrypt.hashSync(req.body.new_password, 8)
    };

    User.findOne({
      where: {
        id: id
      }
    })
      .then(user => {
        if (!user) {
          return res.status(404).send({ message: "User Not found." });
        }

        var passwordIsValid = bcrypt.compareSync(
          req.body.old_password,
          user.pass_hash
        );

        if (!passwordIsValid) {
          return res.status(401).send({
            message: "Invalid Password!"
          });
        }

  User.update(usuario, {
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
    });
};

exports.forgotPassword = (req, res) => {
  User.findOne({
    where: {correo_login: req.body.email},
    /*include: ['proyectos']*/
  })
    .then(user => {
      if (!user) {
        return res.send({
          message: "User Not found(Recuperar pass).",
          data: { isEmailOnDb: false }
        });
      }

      const id = user.id;
      const email = user.correo_login;
      const pass_recovery_token = jwt.sign({userId: id}, process.env.SECRET_JWT_SEED, {expiresIn: '10m'})
      //pass_recovery_token
      //Crea nueva clave provisoria
      const pass_recovery = Math.random().toString(36).split("").slice(2,7).join("");
      const pass_recovery_hash = bcrypt.hashSync(pass_recovery, 8);
      const provisory_passandtoken = {
        pass_recovery_hash : pass_recovery_hash,
        pass_recovery_token: pass_recovery_token
      }



      // console.log(token);

      User.update(provisory_passandtoken, {
        where: { id: id }
        })
          .then(num => {
            if (num == 1) {
              res.send({
                message: "Usuario was updated successfully.",
                data: {
                        id : user.id,
                        correo_login : user.correo_login,
                        pass_recovery : pass_recovery,
                        pass_recovery_hash: pass_recovery_hash,
                        pass_recovery_token :  pass_recovery_token
                      }
              });
            } else {
              res.send({
                message: `Cannot update Usuario with id=${id}. Maybe Usuario was not found or req.body is empty!`
              });
            }
          })
          .catch(err => {
            console.log(err);
            // res.write(err)
            // res.status(500).send({
            //   message: "Error updating Usuario with id=" + id
            // });
          });
    });

}

exports.verifyCode = (req, res) => {
  // console.log(req.body.data)
  const id = req.body.data.userId
  const pass_recovery_token = req.body.data.pass_recovery_token

  try{
    userId = jwt.verify(pass_recovery_token, process.env.SECRET_JWT_SEED)
  }catch{
    return res.send({
      message: "TOKEN INVALIDO",
      data: {
        invalidToken : true
      }
    })
  }

  User.findOne({
    where: {id: id},
  }).then(
    (user)=>{
      if (!user) {
        return res.send({
          message: "User Not found.",
        });
      }
      var codeIsValid = bcrypt.compareSync(
        req.body.data.verifyCode,
        user.pass_recovery_hash
      );

      if (!codeIsValid) {
        return res.send({
          message: "Invalid Password!",
          data: {
            isCodeValid : false
          }
        });
      }else {
        return res.send({
          message: "OK!",
          data: {
            userId : user.id,
            isCodeValid : true
          }
        })
      }
    }
  )


}

exports.changePassword=(req, res) =>{
  const id = req.body.data.userId
  const newPass = req.body.data.newPass
  const newPassHash = bcrypt.hashSync(newPass, 8);

  User.findOne({
    where: {id: id},
  }).then(
    (user)=>{
      if (!user) {
        return res.send({
          message: "User Not found.",
        });
      }


      //Paquete de datos a actualizar
      const newPassword = {
        pass_hash : newPassHash
      }

      User.update(newPassword, {
        where: { id: id }
        })
          .then(num => {
            if (num == 1) {
              res.send({
                message: "Usuario was updated successfully.",
                data: {
                  updateSuccess : true
                }
              });
            } else {
              res.send({
                message: `Cannot update Usuario with id=${id}. Maybe Usuario was not found or req.body is empty!`,
                data: {
                  updateSuccess : false
                }
              });
            }
          })
          .catch(err => {
            console.log(err);
          });


    }
  )
}
