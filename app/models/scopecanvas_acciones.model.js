module.exports = (sequelize, Sequelize) => {
    const ScopeCanvasAcciones = sequelize.define("scopecanvas_acciones", {
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
      tableName: 'scopecanvas_acciones',
      timestamps: false
    });
  
    return ScopeCanvasAcciones;
  };