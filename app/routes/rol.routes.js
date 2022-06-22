module.exports = app => {
  const roles = require("../controllers/rol.controller.js");

  var router = require("express").Router();

  // Retrieve all roles
  router.get("/", roles.findAll);

  // Retrieve all active roles
  router.get("/active", roles.findAllActive);

  // Retrieve a single rol with id
  router.get("/:id", roles.findOne);

  app.use('/api/roles', router);
};