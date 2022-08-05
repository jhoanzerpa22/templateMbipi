const db = require("../models");
const Rol = db.role;
const Op = db.Sequelize.Op;

//var fs = require('fs');

// Retrieve all roles from the database.
exports.findAll = (req, res) => {
  const nombre = req.query.nombre;
  var condition = nombre ? { nombre: { [Op.iLike]: `%${nombre}%` } } : null;

  Rol.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Roles."
      });
    });
};

// Find a single Rol with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Rol.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Rol with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Rol with id=" + id
      });
    });
};

// Find all active Roles
exports.findAllActive = (req, res) => {
  Rol.findAll({ where: { activo: true } })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Roles."
      });
    });
};