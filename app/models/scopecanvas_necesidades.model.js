module.exports = (sequelize, Sequelize) => {
    const ScopeCanvasNecesidades = sequelize.define("scopecanvas_necesidades", {
      /*id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        defaultValue: sequelize.Sequelize.literal("nextval('referencias_id_seq')")
      },*/
      contenido: {
        type: Sequelize.STRING
      },
      tipo: {
        type: Sequelize.STRING
      },
      position: {
        type: Sequelize.INTEGER
      },
      dragPosition: {
        type: Sequelize.STRING
      }
    }, {
      tableName: 'scopecanvas_necesidades',
      timestamps: false
    });
  
    return ScopeCanvasNecesidades;
  };