const db = require("../models");
const serverConfig = require("../config/server.config.js");

const Proyectos = db.proyectos;
const Equipos = db.equipos;
const EquiposUsuarios = db.equipos_usuarios;

const Op = db.Sequelize.Op;

var bcrypt = require("bcryptjs");

// Create and Save a new Invitacion
exports.create = (req, res) => {
  // Validate request
  if (!req.body.usuario_id) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

};

// Retrieve all Invitacions from the database.
exports.findAll = (req, res) => {
  const correo = req.query.correo;
  var condition = correo ? { correo: { [Op.iLike]: `%${correo}%` } } : null;

  EquiposUsuarios.findAll({ where: condition})
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving invitations."
      });
    });
};

// Find a single Invitacion with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  EquiposUsuarios.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Invitations with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Invitations with id=" + id
      });
    });
};

// Find Invitaciones with an email usuario
exports.findByEmail = (req, res) => {
    const correo = req.params.email;
  
    EquiposUsuarios.findAll({ where: {correo: correo, participante: false}, include: [{model: Equipos, as: "equipos_equipo" , attributes:['nombre'], include: [{model: Proyectos, as: "equipo_proyecto" , attributes:['id','nombre']}]}]})
    .then(data => {
            res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving invitations."
      });
    });
  };

// Update a Invitacion by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  let invitation = {
      participante: req.body.participante,
      usuario_id: req.body.usuario_id
    };

  EquiposUsuarios.update(invitation, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Invitation was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Invitation with id=${id}. Maybe Invitations was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Invitacion with id=" + id
      });
    });
};


// Delete a Invitacion with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

                EquiposUsuarios.destroy({
                  where: { id: id }
                })
                  .then(num2 => {
                    if (num2 == 1) {
                        res.send({
                            message: "Invitation was deleted successfully!"
                          });
                    } else {
                      res.send({
                        message: `Cannot delete Invitation with id=${id}. Maybe Invitation was not found!`
                      });
                    }
                  }).catch(err => {
                    res.status(500).send({
                      message: "Could not delete Invitation with id=" + id
                    });
                  });
};


// Delete all Invitacions from the database.
exports.deleteAll = (req, res) => {
  EquiposUsuarios.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Invitations were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Invitations."
      });
    });
};

// Find all active Invitacions
exports.findAllActive = (req, res) => {
  EquiposUsuarios.findAll({ where: { participante: true } })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Invitations."
      });
    });
};