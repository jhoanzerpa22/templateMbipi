const db = require("../models");
const serverConfig = require("../config/server.config.js");

const Referencias = db.referencias;

const Op = db.Sequelize.Op;

// Create and Save a new Referencias
exports.create = (req, res) => {
  // Validate request
  if (!req.body.nombre) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Save User to Database
      Referencias.create({
          nombre: req.body.nombre
        }).then(user =>{
            res.send({ message: "Referencia was registered successfully!" });
      }).catch(err => {
        res.status(500).send({
          message: "Error creating Referencias"
        });
      });;

};

// Retrieve all Referenciass from the database.
exports.findAll = (req, res) => {
  const nombre = req.query.nombre;
  var condition = nombre ? { nombre: { [Op.iLike]: `%${nombre}%` } } : null;

  Referencias.findAll({ where: condition})
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving referenciases."
      });
    });
};

// Find a single Referencias with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Referencias.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Referencias with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Referencias with id=" + id
      });
    });
};

// Update a Referencias by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  let referencias = {
      nombre: req.body.nombre
    };

  Referencias.update(referencias, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Referencias was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Referencias with id=${id}. Maybe Referencias was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Referencias with id=" + id
      });
    });
};


// Delete a Referencias with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

                Referencias.destroy({
                  where: { id: id }
                })
                  .then(num2 => {
                    if (num2 == 1) {
                        res.send({
                            message: "Referencias was deleted successfully!"
                          });
                    } else {
                      res.send({
                        message: `Cannot delete Referencias Login with id=${id}. Maybe Referencias was not found!`
                      });
                    }
                  }).catch(err => {
                    res.status(500).send({
                      message: "Could not delete Referencias Login with id=" + data.login_id + ' | error:' + err.message
                    });
                  });
};


// Delete all Referenciass from the database.
exports.deleteAll = (req, res) => {
  Referencias.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Referencias were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Referencias."
      });
    });
};

// Find all active Referenciass
exports.findAllActive = (req, res) => {
  Referencias.findAll({ where: { activo: true } })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Referencias."
      });
    });
};