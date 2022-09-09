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
    pass_token_verify: {
      type: Sequelize.STRING
    },
    pass_recovery_token: {
      type: Sequelize.STRING
    },
    tipo_rol: {
      type: Sequelize.STRING
    },
    verify: {
      type: Sequelize.BOOLEAN
    }
  }, {
    tableName: 'login',
    timestamps: false
  });

  return User;
};
