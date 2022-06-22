module.exports = app => {
    const course = require("../controllers/course.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Evento
    router.post("/", course.create);
  
    // Retrieve all course
    router.get("/", course.findAll);
    
    // Retrieve a single Publicacion with categorias
    router.get("/categorias", course.findCategorias);

    router.get("/change-lesson/:id", course.changeLesson);

    router.get("/create-board", course.createBoard);

    router.get("/view-board/:id", course.viewBoard);

    router.post("/create-txt", course.createDataTxt);
  
    // Retrieve all active course
    router.get("/active", course.findAllActive);
  
    // Retrieve a single Evento with id
    router.get("/:id", course.findOne);
  
    // Update a Evento with id
    router.put("/:id", course.update);
  
    // Delete a Evento with id
    router.delete("/:id", course.delete);
  
    // Create a new Evento
    router.delete("/", course.deleteAll);
  
    app.use('/api/cursos', router);
  };