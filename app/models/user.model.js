module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    /*id:{
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      defaultValue: sequelize.Sequelize.literal("nextval('login_id_seq')")
    },*/
    correo_login: {
      type: Sequelize.STRING
    },
    pass_hash: {
      type: Sequelize.STRING
    },
    pass_recovery_hash: {
      type: Sequelize.STRING
    },
    pass_recovery_time: {
      type: Sequelize.DATE
    },
    tipo_rol: {
      type: Sequelize.STRING
    }
  }, {
    tableName: 'login',
    timestamps: false
  });

  return User;
};