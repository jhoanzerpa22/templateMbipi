module.exports = app => {
  const lecciones = require("../controllers/lesson.controller.js");

  var router = require("express").Router();

  // Create a new Evento
  router.post("/", lecciones.create);

  // Retrieve all lecciones
  router.get("/", lecciones.findAll);

  // Retrieve all lesson by curso
  router.get("-by-curso/:id", lecciones.findByCurso);

  // Retrieve all active lecciones
  router.get("/active", lecciones.findAllActive);

  // Retrieve a single Evento with id
  router.get("/:id", lecciones.findOne);

  // Update a Evento with id
  router.put("/:id", lecciones.update);

  // Delete a Evento with id
  router.delete("/:id", lecciones.delete);

  // Create a new Evento
  router.delete("/", lecciones.deleteAll);

  app.use('/api/lecciones', router);
};