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
    router.get("/byUsuario/:id/:correo", proyectos.dashboard);
  
    // Retrieve a single Proyectos with id
    router.get("/:id", proyectos.findOne);
  
    // Update a Proyectos with id
    router.put("/:id", proyectos.update);

    // Update the members of Proyectos with id
    router.put("/updateMembers/:id", proyectos.updateMembers);

    // Delete the member of Proyectos with id
    router.delete("/deleteMember/:id", proyectos.deleteMember);

    // Update the status of Proyectos with id
    router.put("/updateStatus/:id", proyectos.updateStatus);

    // Update the etapa of Proyectos with id
    router.put("/updateEtapa/:id", proyectos.updateEtapa);
    
    // Update the etapa metas of Proyectos with id
    router.put("/updateEtapaMeta/:id", proyectos.updateEtapaMeta);

    // Update the etapa preguntas of Proyectos with id
    router.put("/updateEtapaPreguntas/:id", proyectos.updateEtapaPreguntas);

    // Update the notacp of Proyectos with id
    router.put("/updateNotaCp/:id", proyectos.updateNotaCp);

    // Update the metalp of Proyectos with id
    router.put("/updateMetaLp/:id", proyectos.updateMetaLp);

    // Update the preguntasprint of Proyectos with id
    router.put("/updatePreguntaSprint/:id", proyectos.updatePreguntaSprint);

    // Update the time of Proyectos with id
    router.put("/updateTime/:id", proyectos.updateTime);
  
    // Delete a Proyectos with id
    router.delete("/:id", proyectos.delete);
    
    // Delete the notacp of Proyectos with id
    router.delete("/deleteNotaCp/:id", proyectos.deleteNotaCp);
    
    // Delete the metalp of Proyectos with id
    router.delete("/deleteMetaLp/:id", proyectos.deleteMetaLp);
    
    // Delete the preguntasprint of Proyectos with id
    router.delete("/deletePreguntaSprint/:id", proyectos.deletePreguntaSprint);
  
    // Create a new Proyectos
    router.delete("/", proyectos.deleteAll);
  
    app.use('/api/proyectos', router);
  };