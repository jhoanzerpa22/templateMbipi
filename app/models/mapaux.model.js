module.exports = (sequelize, Sequelize) => {
    const MapaUx = sequelize.define("mapaux", {
      /*id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        defaultValue: sequelize.Sequelize.literal("nextval('referencias_id_seq')")
      },*/
      contenido: {
        type: Sequelize.TEXT
      }
    }, {
      tableName: 'mapaux',
      timestamps: false
    });
  
    return MapaUx;
  };