module.exports = (sequelize, Sequelize) => {
    const LeanCanvasMetricasClave = sequelize.define("leancanvas_metricas", {
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
      tableName: 'leancanvas_metricas',
      timestamps: false
    });
  
    return LeanCanvasMetricasClave;
  };