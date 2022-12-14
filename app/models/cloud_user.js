module.exports = (sequelize, Sequelize) => {
  const CloudUser = sequelize.define("cloud_user", {
    /*id:{
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      defaultValue: sequelize.Sequelize.literal("nextval('cloud_user_id_seq')")
    },*/
    name: {
      type: Sequelize.STRING
    },
    secure_url: {
      type: Sequelize.STRING
    },
    cloudinary_id: {
      type: Sequelize.STRING
    }
  }, {
    tableName: 'cloud_user',
    timestamps: false
  });

  return CloudUser;
};
