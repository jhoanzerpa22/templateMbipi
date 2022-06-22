const { forEach } = require("lodash");
const db = require("../models");
const Course = db.course;
const Lesson = db.lesson;
const Op = db.Sequelize.Op;
const serverConfig = require("../config/server.config.js");

// Create and Save a new Curso
exports.create = (req, res) => {
  // Validate request
  if (!req.body.nombre) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a Curso
  const course = {
    nombre: req.body.nombre,
    subtitulo: req.body.subtitulo,
    duracion: req.body.duracion,
    categoria: req.body.categoria,
    etapa: req.body.etapa
  };

  // Save Curso in the database
  Course.create(course)
    .then(data => {
      const lessons = req.body.lessons;
      for (let i = 0; i < req.body.lessons.length; i++) {
          Lesson.create({
            nombre: lessons[i].nombre,
            subtitulo: lessons[i].subtitulo,
            orden: lessons[i].orden,
            url: lessons[i].url,
            curso_id: data.id
          }).then(() =>{
          });
      }
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Curso."
      });
    });
};

// Retrieve all Cursos from the database.
exports.findAll = (req, res) => {
  const etapa = req.query.etapa;
  var condition = etapa ? { etapa: etapa } : null;

  Course.findAll({ where: condition, include: ["lessons"] })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Courses."
      });
    });
};

exports.createBoard = (req, res) => {
  const sdk = require('api')('@miro-ea/v2.0#1b6pqzl5l43ydwtt');

  sdk.auth('eyJtaXJvLm9yaWdpbiI6ImV1MDEifQ_7t5_AcQqvKAMu0IrEbVtbK1UFuc');
  sdk['create-board']({
    name: 'Mbipi test',
    policy: {
      permissionsPolicy: {
        collaborationToolsStartAccess: 'all_editors',
        copyAccess: 'anyone',
        sharingAccess: 'team_members_with_editing_rights'
      },
      sharingPolicy: {
        access: 'view',
        inviteToAccountAndBoardLinkAccess: 'editor',
        organizationAccess: 'edit',
        teamAccess: 'private'
      }
    },
    description: 'Prueba crear board'
  })
    .then(data => { console.log(data) 
    res.send(data); })
    .catch(err => { console.error(err) 
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving Courses."
    }); });
};

exports.viewBoard = (req, res) => {
  
  const id = req.params.id;
  const sdk = require('api')('@miro-ea/v2.0#1b6pqzl5l43ydwtt');

sdk.auth('eyJtaXJvLm9yaWdpbiI6ImV1MDEifQ_7t5_AcQqvKAMu0IrEbVtbK1UFuc');
sdk['get-items']({limit: '10', board_id: id})
  .then(data => { console.log(data) 
    res.send(data); })
  .catch(err => console.error(err));
};


exports.createDataTxt = (req, res) => {
  
  const tablero = req.body.tablero;
  
require("fs").writeFile(serverConfig.HOST_SAVE+"tablero.txt", tablero, function(err) { console.log(err); 
});
    res.send(tablero);
};


// Find a single Curso with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Course.findByPk(id, { include: ["lessons"] })
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Curso with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Curso with id=" + id
      });
    });
};


exports.findCategorias = (req, res) => {

  Course.findAll({ group: ['categoria'], attributes: ['categoria',[db.Sequelize.fn('COUNT', db.Sequelize.col('categoria')), 'categoria_count']] })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving publicaciones."
      });
    });
};

// Update a Lesson of Curso by the id in the request
exports.changeLesson = (req, res) => {
  const id = req.params.id;

  Lesson.findByPk(id)
    .then(data => {
      if (data) {

          Lesson.update({completado: 1}, {
            where: { id: id }
          })
            .then(num => {
              if (num == 1) {
                
                const curso_id = data.curso_id;
                var condition = curso_id ? { curso_id: curso_id } : null;

                Lesson.findAll({ where: condition })
                  .then(data2 => {
                    const lessons = data2;
                    let completed = 0;
                      for (let i = 0; i < lessons.length; i++) {
                        if(lessons[i].completado == 1){
                          completed = completed + 1;
                        }
                      }

                      if(completed == lessons.length){
                          Course.update({completado: 1}, {
                              where: { id: curso_id }
                            })
                              .then(num2 => {
                                if (num2 == 1) {                                  
                                  res.send(data2);
                                }
                              }).catch(err => {
                                  res.status(500).send({
                                    message: "Error updating Course with id=" + curso_id
                                  });
                              });
                        }else{
                          res.send(data2);
                        }
                        })
                        .catch(err => {
                          res.status(500).send({
                            message:
                              err.message || "Some error occurred while retrieving lesson."
                          });
                        });
              } else {
                res.send({
                  message: `Cannot update Curso with id=${id}. Maybe Curso was not found or req.body is empty!`
                });
              }
          })
          .catch(err => {
            res.status(500).send({
              message: "Error updating Lesson with id=" + id
            });
          });
    
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

// Update a Curso by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Course.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        const lessons = req.body.lessons;
        for (let i = 0; i < req.body.lessons.length; i++) {
          let lesson = {
            nombre: lessons[i].nombre,
            subtitulo: lessons[i].subtitulo,
            orden: lessons[i].orden,
            url: lessons[i].url
          };

          Lesson.update(lesson, {
            where: { id: lessons[i].id }
          })
            .then(num2 => {
              if (num2 == 1) {
              }
            }).catch(err => {
                /*res.status(500).send({
                  message: "Error updating Lesson with id=" + lessons[i].id
                });*/
                Lesson.create({
                  nombre: lessons[i].nombre,
                  subtitulo: lessons[i].subtitulo,
                  orden: lessons[i].orden,
                  url: lessons[i].url,
                  curso_id: id
                  }).then(() =>{
                  });
            });
        }
        res.send({
          message: "Curso was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Curso with id=${id}. Maybe Curso was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Curso with id=" + id
      });
    });
};

// Delete a Curso with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Course.findByPk(id)
    .then(data => {
      
      if (data) {

   
  Lesson.destroy({
    where: { curso_id: data.id }
  })
    .then(num2 => {
            Course.destroy({
              where: { id: id }
            })
              .then(num => {
                if (num == 1) {
                  res.send({
                    message: "Curso was deleted successfully!"
                  });
                } else {
                  res.send({
                    message: `Cannot delete Curso with id=${id}. Maybe Curso was not found!`
                  });
                }
              })
              .catch(err => {
                res.status(500).send({
                  message: "Could not delete Curso with id=" + id
                });
              });
  })
  .catch(err => {
    res.status(500).send({
      message: "Could not delete Curso with id=" + id
    });
  });
  
  } else {
    res.status(404).send({
      message: `Cannot find Course with id=${id}.`
    });
  }

  })
  .catch(err => {
    res.status(500).send({
      message: "Error retrieving Course with id=" + id
    });
  });
};

// Delete all Courses from the database.
exports.deleteAll = (req, res) => {
  Course.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} All Courses were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all courses."
      });
    });
};

// Find all active Courses
exports.findAllActive = (req, res) => {
  Course.findAll({ where: { activo: true } })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Courses."
      });
    });
};
