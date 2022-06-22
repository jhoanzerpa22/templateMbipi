module.exports = app => {
  const usuarios = require("../controllers/usuario.controller.js");

  var router = require("express").Router();

  // Create a new Usuario
  router.post("/", usuarios.create);

  // Retrieve all usuarios
  router.get("/", usuarios.findAll);

  // Retrieve all active usuarios
  router.get("/active", usuarios.findAllActive);

  // Retrieve a single Usuario with id
  router.get("/:id", usuarios.findOne);

  // Update a Usuario with id
  router.put("/:id", usuarios.update);

  // Delete a Usuario with id
  router.delete("/:id", usuarios.delete);

  // Create a new Usuario
  router.delete("/", usuarios.deleteAll);

  app.use('/api/usuarios', router);
};