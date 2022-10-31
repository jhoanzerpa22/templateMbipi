const dbConfig = require("../config/db.config.js");
var pg = require('pg');
//pg.defaults.ssl = true;

const Sequelize = require("sequelize");

/*Heroku*/
//const sequelize = new Sequelize('postgres://mtaligncgdmqzd:1ee6689d3e58a91bbb1da37be35d36191b1d3db6ba0bfa07f4e9bebb0b046e1c@ec2-3-225-110-188.compute-1.amazonaws.com:5432/d143lrl2dkme0e?sslmode=no-verify');

//LOCAL
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,/*
  native: true,
  ssl: true, 
    dialectOptions: {
      ssl: true
    },
  operatorsAliases: false,
  port: 5432,*/
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./user.model.js")(sequelize, Sequelize);
db.role = require("./role.model.js")(sequelize, Sequelize);
db.usuario = require("./usuario.model.js")(sequelize, Sequelize);
db.referencias = require("./referencias.model.js")(sequelize, Sequelize);
db.equipos = require("./equipos.model.js")(sequelize, Sequelize);
db.metodologias = require("./metodologias.model.js")(sequelize, Sequelize);
db.proyectos_tipos = require("./proyectos_tipos.model.js")(sequelize, Sequelize);
db.proyectos = require("./proyectos.model.js")(sequelize, Sequelize);
db.equipos_usuarios = require("./equipos_usuarios.model.js")(sequelize, Sequelize);
db.cloud_user = require("./cloud_user.js")(sequelize, Sequelize);
db.notascp = require("./notascp.model.js")(sequelize, Sequelize);
db.metaslp = require("./metaslp.model.js")(sequelize, Sequelize);
db.preguntasprint = require("./preguntasprint.model.js")(sequelize, Sequelize);
db.mapaux = require("./mapaux.model.js")(sequelize, Sequelize);
db.scopecanvas_necesidades = require("./scopecanvas_necesidades.model.js")(sequelize, Sequelize);
db.scopecanvas_propositos = require("./scopecanvas_propositos.model.js")(sequelize, Sequelize);
db.scopecanvas_objetivos = require("./scopecanvas_objetivos.model.js")(sequelize, Sequelize);
db.scopecanvas_acciones = require("./scopecanvas_acciones.model.js")(sequelize, Sequelize);
db.scopecanvas_metricas = require("./scopecanvas_metricas.model.js")(sequelize, Sequelize);
db.proyecto_recurso = require("./proyecto_recurso.model.js")(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId"
});

db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId"
});

db.usuario.belongsTo(db.user, {
  foreignKey: 'login_id'
});
/*
db.user.belongsTo(db.usuario, { as: "usuario_usuario",
targetKey: 'login_id',
foreignKey: 'id'
});*/

db.proyectos.belongsTo(db.user, {
  foreignKey: 'usuario_id'
});

db.user.hasMany(db.proyectos, { as: "proyectos",
  foreignKey: 'usuario_id'
 });

db.user.hasMany(db.equipos_usuarios, { as: "usuario_equipos",
  foreignKey: 'usuario_id'
});

db.equipos.hasMany(db.equipos_usuarios, { as: "equipo_usuarios",
  foreignKey: 'equipo_id'
 });

db.equipos.hasMany(db.proyectos, { as: "equipo_proyecto",
foreignKey: 'equipo_id'
});

db.equipos_usuarios.belongsTo(db.user, { as: "equipos_usuario" ,
  foreignKey: 'usuario_id'
});

db.equipos_usuarios.belongsTo(db.usuario, { as: "eq_usu_plat",
  targetKey: 'login_id',
  foreignKey: 'usuario_id'
});

db.equipos_usuarios.belongsTo(db.equipos, { as: "equipos_equipo",
  foreignKey: 'equipo_id'
});

db.proyectos.belongsTo(db.proyectos_tipos, {as: "proyecto_tipo",
  foreignKey: 'proyecto_tipo_id'
});

db.proyectos.belongsTo(db.equipos, { as: "proyecto_equipo",
  foreignKey: 'equipo_id'
});

db.proyectos.belongsTo(db.metodologias, {as: "proyecto_metodologia",
  foreignKey: 'metodologia_id'
});

db.proyectos.hasMany(db.proyecto_recurso, { as: "proyecto_recursos",
  foreignKey: 'proyecto_id'
 });

db.proyecto_recurso.belongsTo(db.user, {
  foreignKey: 'usuario_id'
});

db.proyecto_recurso.belongsTo(db.notascp, {
  foreignKey: 'notascp_id'
});

db.proyecto_recurso.belongsTo(db.metaslp, {
  foreignKey: 'metaslp_id'
});

db.proyecto_recurso.belongsTo(db.preguntasprint, {
  foreignKey: 'preguntasprint_id'
});

db.proyecto_recurso.belongsTo(db.mapaux, {
  foreignKey: 'mapaux_id'
});

db.proyecto_recurso.belongsTo(db.scopecanvas_necesidades, {
  foreignKey: 'scopecanvas_necesidades_id'
});

db.proyecto_recurso.belongsTo(db.scopecanvas_propositos, {
  foreignKey: 'scopecanvas_propositos_id'
});

db.proyecto_recurso.belongsTo(db.scopecanvas_objetivos, {
  foreignKey: 'scopecanvas_objetivos_id'
});

db.proyecto_recurso.belongsTo(db.scopecanvas_acciones, {
  foreignKey: 'scopecanvas_acciones_id'
});

db.proyecto_recurso.belongsTo(db.scopecanvas_metricas, {
  foreignKey: 'scopecanvas_metricas_id'
});

db.proyecto_recurso.belongsTo(db.proyectos, {
  foreignKey: 'proyecto_id'
});

db.ROLES = ["Administrador", "Usuario", "Invitado"];

module.exports = db;
