module.exports = app => {
  const usuarios = require("../controllers/usuario.controller.js");

  var router = require("express").Router();

  // Create a new Usuario
  router.post("/", usuarios.create);

  // Retrieve all usuarios
  router.get("/", usuarios.findAll);

  // Retrieve all active usuarios
  router.get("/getInfo/:id", usuarios.getInfo);

  // Retrieve all active usuarios
  router.get("/getMenu/:id/:correo", usuarios.findMenu);

  // Retrieve all active usuarios
  router.get("/active", usuarios.findAllActive);

  // Retrieve payment usuarios
  router.get("/payment", usuarios.getPayment);

  // Retrieve payment usuarios
  router.post("/payment", usuarios.savePayment);

  // Verify usuarios
  router.post("/verify", usuarios.verifyLogin);

  // Retrieve a single Usuario with id
  router.get("/:id", usuarios.findOne);

  router.put("/account/:id", usuarios.updateAccount);

  // Update a Usuario with id
  router.put("/:id", usuarios.update);

  // Delete a Usuario with id
  router.delete("/:id", usuarios.delete);

  // Create a new Usuario
  router.delete("/", usuarios.deleteAll);

  app.use('/api/usuarios', router);
};