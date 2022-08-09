const router = require('express').Router();
const upload = require('../config/multer');
const cloudinary = require("cloudinary").v2;

const db = require('../models');
const CloudUser = db.cloud_user;

cloudinary.config({
  cloud_name: 'tresideambipi',
  api_key: '735689747739288',
  api_secret: 'oPjl3NwlqAmOIWewUnbc01Jt8Jc',
  secure: true
});

router.post('/', upload.single('image'),async (req, res)=>{
  try{
    const result = await cloudinary.uploader.upload(req.file.path)

    //Crea una instancia de cloud_user
    let cloud_user = {
      name: req.body.name,
      secure_url: result.secure_url,
      cloudinary_id: result.public_id
    };

    await CloudUser.create(cloud_user);
    res.json(result);
  } catch(err) {
    console.log(err)
  }
})

router.get("/", async (req, res) =>{

  const nombre = req.query.name;
  var condition = nombre ? { name: { [Op.iLike]: `%${nombre}%` } } : null;

  CloudUser.findAll({ where: condition})
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
        err.message || "Some error occurred while retrieving Cloud Users."
    });
  });

})



module.exports = router;
