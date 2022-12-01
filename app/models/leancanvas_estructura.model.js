module.exports = (sequelize, Sequelize) => {
    const LeanCanvasEstructura = sequelize.define("leancanvas_estructura", {
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
      tableName: 'leancanvas_estructura',
      timestamps: false
    });
  
    return LeanCanvasEstructura;
  };