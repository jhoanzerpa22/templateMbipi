module.exports = (sequelize, Sequelize) => {
    const MetasLp = sequelize.define("metaslp", {
      /*id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        defaultValue: sequelize.Sequelize.literal("nextval('referencias_id_seq')")
      },*/
      contenido: {
        type: Sequelize.STRING
      },
      votos: {
        type: Sequelize.INTEGER
      },
      seleccionado: {
        type: Sequelize.BOOLEAN
      },
      detalle: {
        type: Sequelize.STRING
      }
    }, {
      tableName: 'metaslp',
      timestamps: false
    });
  
    return MetasLp;
  };