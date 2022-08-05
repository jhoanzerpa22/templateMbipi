module.exports = (sequelize, Sequelize) => {
    const Equipos = sequelize.define("equipos", {
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
      tableName: 'equipos',
      timestamps: false
    });
  
    return Equipos;
  };