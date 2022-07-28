const db = require("../models");
const serverConfig = require("../config/server.config.js");

const Proyectos = db.proyectos;
const Equipos = db.equipos;
const EquiposUsuarios = db.equipos_usuarios;

const Op = db.Sequelize.Op;

var bcrypt = require("bcryptjs");
const { data } = require("jquery");

// Create and Save a new Proyectos
exports.create = (req, res) => {
  // Validate request
  if (!req.body.usuario_id) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Save Equipo to Database
      Equipos.create({
        nombre: 'Equipo - '+req.body.data.businessName
      }).then(equipo =>{

        const code = bcrypt.hashSync(req.body.data.businessName, 6);
        Proyectos.create({
            usuario_id: req.body.usuario_id,
            nombre: req.body.data.businessName,
            code: code,
            descripcion: req.body.data.businessDescription,
            aplicacion_tipo: req.body.data.accountType,
            estado: "Sin Iniciar",
            proyecto_tipo_id: req.body.data.accountPlan,
            equipo_id: equipo.id,
            metodologia_id: 1
            }).then(proyect =>{

                EquiposUsuarios.create({
                    usuario_id: req.body.usuario_id,
                    correo: req.body.correo,
                    rol: 'Decisor',
                    participante: true,
                    equipo_id: equipo.id,
                    }).then(ep =>{

                        if(req.body.data.members.length > 0){
                            for (let i = 0; i < req.body.data.members.length; i++) {

                                EquiposUsuarios.create({
                                    usuario_id: null,
                                    correo: req.body.data.members[i].nombre,
                                    rol: req.body.data.members[i].rol,
                                    participante: false,
                                    equipo_id: equipo.id,
                                    }).then(ep2 =>{
                                        if((i + 1) == req.body.data.members.length){
                                            res.send({ message: "Proyecto was registered successfully!", data: proyect});
                                        }

                                    }).catch(err => {
                                        res.status(500).send({
                                        message: "Error creating EquiposProyectos"
                                        });
                                    });;
                            }
                        }else{
                            res.send({ message: "Proyecto was registered successfully!", data: proyect });
                        }
                    }).catch(err => {
                        res.status(500).send({
                        message: "Error creating EquipoProyecto"
                        });
                    });

        }).catch(err => {
            res.status(500).send({
            message: "Error creating Proyectos"
            });
        })
      }).catch(err => {
        res.status(500).send({
          message: "Error creating Equipo"
        });
      });

};

// Retrieve all Proyectoss from the database.
exports.findAll = (req, res) => {
  const nombre = req.query.nombre;
  var condition = nombre ? { nombre: { [Op.iLike]: `%${nombre}%` } } : null;

  Proyectos.findAll({ where: condition})
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving proyectoses."
      });
    });
};

// Find a single Proyectos with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Proyectos.findByPk(id, {include: [{
    model: Equipos, as: "proyecto_equipo", attributes:['id','nombre'], include: [{
      model: EquiposUsuarios, as: "equipo_usuarios", attributes:['id','correo']}]}]})
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Proyectos with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Proyectos with id=" + id
      });
    });
};

// Find Dashboard with an id usuario
exports.dashboard = (req, res) => {
    const usuario_id = req.params.id;
    const correo = req.params.correo;

    EquiposUsuarios.findAll({ where: {
      [Op.or]: [
        { correo: correo },
        { usuario_id: usuario_id }
      ]
    },
    include: [{
              model: Equipos, as: "equipos_equipo", attributes:['nombre'],      include: [{
              model: Proyectos, as: "equipo_proyecto", attributes:['id','nombre', 'estado']},/*
              include: [{
              model: Equipos, as: "proyecto_equipo", attributes:['id','nombre'],
              include: [*/{
              model: EquiposUsuarios, as: "equipo_usuarios", attributes:['id','correo']
              /*}]*/
              /*}]*/
              }]
            }]
    })
    .then(data => {/*
      Proyectos.findAll({
        where: {equipo_id: data.equipo_id}
      })
      .then(proyectos =>{*/
        res.send(data)
      /*})
      .catch(err =>{
        res.send({'equipos': data})
      })*/
    })
    .catch(err =>{
      res.status(500).send({
        message:
          err.message || "Some error ocurred while retrieving proyectos."
      })
    })


    // Proyectos.findAll({ where: {usuario_id: usuario_id}})
    // .then(data => {
    //     EquiposUsuarios.findAll({ where: {usuario_id: usuario_id}})
    //     .then(equipos => {

    //         res.send({'proyectos': data, 'equipos': equipos});
    //     })
    //     .catch(err => {

    //         res.send({'proyectos': data});
    //     });
    // })
    // .catch(err => {
    //   res.status(500).send({
    //     message:
    //       err.message || "Some error occurred while retrieving proyectos."
    //   });
    // });
  };

// Update a Proyectos by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  let proyectos = {
      nombre: req.body.nombre
    };

  Proyectos.update(proyectos, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Proyectos was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Proyectos with id=${id}. Maybe Proyectos was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Proyectos with id=" + id
      });
    });
};


// Delete a Proyectos with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

                Proyectos.destroy({
                  where: { id: id }
                })
                  .then(num2 => {
                    if (num2 == 1) {
                        res.send({
                            message: "Proyectos was deleted successfully!"
                          });
                    } else {
                      res.send({
                        message: `Cannot delete Proyectos Login with id=${id}. Maybe Proyectos was not found!`
                      });
                    }
                  }).catch(err => {
                    res.status(500).send({
                      message: "Could not delete Proyectos Login with id=" + data.login_id + ' | error:' + err.message
                    });
                  });
};


// Delete all Proyectoss from the database.
exports.deleteAll = (req, res) => {
  Proyectos.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Proyectos were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Proyectos."
      });
    });
};

// Find all active Proyectoss
exports.findAllActive = (req, res) => {
  Proyectos.findAll({ where: { activo: true } })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Proyectos."
      });
    });
};
