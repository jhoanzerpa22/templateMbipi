const db = require("../models");
const serverConfig = require("../config/server.config.js");
const Lesson = db.lesson;
const Course = db.course;
const Op = db.Sequelize.Op;

// Create and Save a new Lesson
exports.create = (req, res) => {
// Validate request
  if (!req.body.nombre) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a Lesson
  const lesson = {
    nombre: req.body.nombre,
    subtitulo: req.body.subtitulo,
    orden: req.body.orden,
    url: req.body.url,
    curso_id: req.body.curso_id
  };

  // Save lesson in the database
  Lesson.create(lesson)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Lesson."
      });
    });
};

// Retrieve all Lessons from the database.
exports.findAll = (req, res) => {
  const curso_id = req.query.curso_id;
  var condition = curso_id ? { curso_id: curso_id } : null;

  Lesson.findAll({ where: condition, include: [{model: Course, attributes:['nombre','duracion','subtitulo','categoria','etapa']}] })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving lessons."
      });
    });
};

// Retrieve all Lessons from the database.
exports.findByCurso = (req, res) => {
  const id = req.params.id;
  var condition = id ? { curso_id: id } : null;

  Lesson.findAll({ where: condition, include: [{model: Course, attributes:['nombre','duracion','subtitulo','categoria','etapa']}] })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving lessons."
      });
    });
};

// Find a single Lesson with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Lesson.findByPk(id)
    .then(data => {
      if (data) {
        
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Lesson with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Lesson with id=" + id
      });
    });
};


// Update a Lesson by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  let lesson = {};
  
    lesson = {
      nombre: req.body.nombre,
      subtitulo: req.body.subtitulo,
      orden: req.body.orden,
      url: req.body.url,
      curso_id: req.body.curso_id
    };
  

  Lesson.update(lesson, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Lesson was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Lesson with id=${id}. Maybe Lesson was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Lesson with id=" + id
      });
    });
};


// Delete a Lesson with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Lesson.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Lesson was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Lesson with id=${id}. Maybe Lesson was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Lesson with id=" + id
      });
    });
};

// Delete all Evetos from the database.
exports.deleteAll = (req, res) => {
  Lesson.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Lesson were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Lesson."
      });
    });
};

// Find all active Lessons
exports.findAllActive = (req, res) => {
  Lesson.findAll({ where: { activo: true } })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Lessons."
      });
    });
};
