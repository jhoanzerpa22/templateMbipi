module.exports = (sequelize, Sequelize) => {
    const ScopeCanvasObjetivos = sequelize.define("scopecanvas_objetivos", {
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
      tableName: 'scopecanvas_objetivos',
      timestamps: false
    });
  
    return ScopeCanvasObjetivos;
  };