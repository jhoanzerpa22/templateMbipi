module.exports = (sequelize, Sequelize) => {
    const Metodologias = sequelize.define("metodologias", {
      /*id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        defaultValue: sequelize.Sequelize.literal("nextval('referencias_id_seq')")
      },*/
      nombre: {
        type: Sequelize.STRING
      }
    }, {
      tableName: 'metodologias',
      timestamps: false
    });
  
    return Metodologias;
  };