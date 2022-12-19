module.exports = {

  //Local
  USER: "postgres",
  PASSWORD: "20588459jz",
  DB: "mbipi_test",

//Heroku
  /*
  USER: "mtaligncgdmqzd",
  PASSWORD: "1ee6689d3e58a91bbb1da37be35d36191b1d3db6ba0bfa07f4e9bebb0b046e1c",
  DB: "d143lrl2dkme0e",
  HOST: "ec2-3-225-110-188.compute-1.amazonaws.com",*/
  //PORT: 5432,

  //Produccion
  //HOST: "45.7.229.117",
  //USER: "tresidea_mbipidb",
  //PASSWORD: "k{ndin[m}maR",
  //DB: "tresidea_mbipi",
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
