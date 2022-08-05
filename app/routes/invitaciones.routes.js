module.exports = app => {
    const invitaciones = require("../controllers/invitaciones.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Invitaciones
    router.post("/", invitaciones.create);
  
    // Retrieve all Invitaciones
    router.get("/", invitaciones.findAll);
  
    // Retrieve all active Invitaciones
    router.get("/active", invitaciones.findAllActive);
    
    //dashboard
    router.get("/byEmail/:email", invitaciones.findByEmail);
  
    // Retrieve a single Invitaciones with id
    router.get("/:id", invitaciones.findOne);
  
    // Update a Invitaciones with id
    router.put("/:id", invitaciones.update);
  
    // Delete a Invitaciones with id
    router.delete("/:id", invitaciones.delete);
  
    // Create a new Invitaciones
    router.delete("/", invitaciones.deleteAll);
  
    app.use('/api/invitaciones', router);
  };