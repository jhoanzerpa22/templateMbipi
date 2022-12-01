module.exports = (sequelize, Sequelize) => {
    const ScopeCanvasMetricas = sequelize.define("scopecanvas_metricas", {
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
      tableName: 'scopecanvas_metricas',
      timestamps: false
    });
  
    return ScopeCanvasMetricas;
  };