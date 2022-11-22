module.exports = (sequelize, Sequelize) => {
    const ScopeCanvasPropositos = sequelize.define("scopecanvas_propositos", {
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
      },
      position: {
        type: Sequelize.INTEGER
      },
      dragPosition: {
        type: Sequelize.STRING
      }
    }, {
      tableName: 'scopecanvas_propositos',
      timestamps: false
    });
  
    return ScopeCanvasPropositos;
  };