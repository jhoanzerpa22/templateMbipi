module.exports = (sequelize, Sequelize) => {
    const LeanCanvasSolucion = sequelize.define("leancanvas_solucion", {
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
      tableName: 'leancanvas_solucion',
      timestamps: false
    });
  
    return LeanCanvasSolucion;
  };