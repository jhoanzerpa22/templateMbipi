module.exports = app => {
    const proyectos = require("../controllers/proyectos.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Proyectos
    router.post("/", proyectos.create);
  
    // Retrieve all Proyectos
    router.get("/", proyectos.findAll);
  
    // Retrieve all active Proyectos
    router.get("/active", proyectos.findAllActive);
    
    //dashboard
    router.get("/byUsuario/:id", proyectos.dashboard);
  
    // Retrieve a single Proyectos with id
    router.get("/:id", proyectos.findOne);
  
    // Update a Proyectos with id
    router.put("/:id", proyectos.update);
  
    // Delete a Proyectos with id
    router.delete("/:id", proyectos.delete);
  
    // Create a new Proyectos
    router.delete("/", proyectos.deleteAll);
  
    app.use('/api/proyectos', router);
  };