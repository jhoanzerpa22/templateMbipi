module.exports = (sequelize, Sequelize) => {
    const Referencias = sequelize.define("referencias", {
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
      tableName: 'referencias',
      timestamps: false
    });
  
    return Referencias;
  };