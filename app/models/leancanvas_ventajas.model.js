module.exports = (sequelize, Sequelize) => {
    const LeanCanvasVentajas = sequelize.define("leancanvas_ventajas", {
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
      tableName: 'leancanvas_ventajas',
      timestamps: false
    });
  
    return LeanCanvasVentajas;
  };