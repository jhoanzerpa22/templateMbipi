module.exports = (sequelize, Sequelize) => {
  const Usuarios = sequelize.define("usuarios", {
    /*id:{
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      defaultValue: sequelize.Sequelize.literal("nextval('usuario_plataforma_id_seq')")
    },*/
    nombre: {
      type: Sequelize.STRING
    },
    rut: {
      type: Sequelize.STRING
    },
    fono: {
      type: Sequelize.STRING
    },
    correo: {
      type: Sequelize.STRING
    },/*
    direccion: {
      type: Sequelize.STRING
    },*/
    img: {
      type: Sequelize.STRING
    },
    login_id: {
      type: Sequelize.INTEGER
    }
  }, {
    tableName: 'usuario_plataforma',
    timestamps: false
  });

  return Usuarios;
};