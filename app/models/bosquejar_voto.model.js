module.exports = (sequelize, Sequelize) => {
    const BosquejarVoto = sequelize.define("bosquejar_voto", {
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
      tableName: 'bosquejar_voto',
      timestamps: false
    });
  
    return BosquejarVoto;
  };