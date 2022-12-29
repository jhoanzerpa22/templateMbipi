module.exports = (sequelize, Sequelize) => {
    const MapaCalor = sequelize.define("mapa_calor", {
      /*id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        defaultValue: sequelize.Sequelize.literal("nextval('referencias_id_seq')")
      },*/
      contenido: {
        type: Sequelize.STRING
      },
      position: {
        type: Sequelize.INTEGER
      },
      dragPosition: {
        type: Sequelize.STRING
      }
    }, {
      tableName: 'mapa_calor',
      timestamps: false
    });
  
    return MapaCalor;
  };