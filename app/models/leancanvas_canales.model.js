module.exports = (sequelize, Sequelize) => {
    const LeanCanvasCanales = sequelize.define("leancanvas_canales", {
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
      tableName: 'leancanvas_canales',
      timestamps: false
    });
  
    return LeanCanvasCanales;
  };