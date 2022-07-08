module.exports = app => {
    const referencias = require("../controllers/referencias.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Referencias
    router.post("/", referencias.create);
  
    // Retrieve all Referencias
    router.get("/", referencias.findAll);
  
    // Retrieve all active Referencias
    router.get("/active", referencias.findAllActive);
  
    // Retrieve a single Referencias with id
    router.get("/:id", referencias.findOne);
  
    // Update a Referencias with id
    router.put("/:id", referencias.update);
  
    // Delete a Referencias with id
    router.delete("/:id", referencias.delete);
  
    // Create a new Referencias
    router.delete("/", referencias.deleteAll);
  
    app.use('/api/referencias', router);
  };