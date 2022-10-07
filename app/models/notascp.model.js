module.exports = (sequelize, Sequelize) => {
    const NotasCp = sequelize.define("notascp", {
      /*id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        defaultValue: sequelize.Sequelize.literal("nextval('referencias_id_seq')")
      },*/
      contenido: {
        type: Sequelize.STRING
      },
      categoria: {
        type: Sequelize.STRING
      },
      votos: {
        type: Sequelize.INTEGER
      },
      detalle: {
        type: Sequelize.STRING
      }
    }, {
      tableName: 'notascp',
      timestamps: false
    });
  
    return NotasCp;
  };