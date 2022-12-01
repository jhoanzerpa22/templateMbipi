module.exports = (sequelize, Sequelize) => {
    const LeanCanvasPropuesta = sequelize.define("leancanvas_propuesta", {
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
      tableName: 'leancanvas_propuesta',
      timestamps: false
    });
  
    return LeanCanvasPropuesta;
  };