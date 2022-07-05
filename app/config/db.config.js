module.exports = {

  //Local
  USER: "postgres",
  PASSWORD: "test01",
  DB: "mbipi",

  //Produccion
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
