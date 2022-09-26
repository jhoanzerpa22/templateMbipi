module.exports = (sequelize, Sequelize) => {
    const PreguntaSprint = sequelize.define("preguntasprint", {
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
      }
    }, {
      tableName: 'preguntasprint',
      timestamps: false
    });
  
    return PreguntaSprint;
  };