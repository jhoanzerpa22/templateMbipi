module.exports = (sequelize, Sequelize) => {
    const LeanCanvasFlujo = sequelize.define("leancanvas_flujo", {
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
      tableName: 'leancanvas_flujo',
      timestamps: false
    });
  
    return LeanCanvasFlujo;
  };