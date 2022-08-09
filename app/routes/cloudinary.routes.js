const router = require('express').Router();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'tresideambipi',
  api_key: '735689747739288',
  api_secret: 'oPjl3NwlqAmOIWewUnbc01Jt8Jc',
  secure: true
});

router.get('/', async(req, res)=>{
  options = {
    resource_type : "video",
    // public_id: "videos/video_test_clgg4o"
  }
  cloudinary.api.resources(options, function(error, result) {console.log(result.resources[0].url, error); });

})

// module.exports = app =>{
//   var router = require("express").Router();

//   router.get("/", (req, res)=>{
//     try {
//       console.log(req)
//     }catch(error){
//       console.log(error)
//     }
//   })

//   app.use('/api/cloudinary', router)
// }

module.exports = router

