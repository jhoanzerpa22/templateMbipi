module.exports = (sequelize, Sequelize) => {
    const LeanCanvasProblema = sequelize.define("leancanvas_problema", {
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
      tableName: 'leancanvas_problema',
      timestamps: false
    });
  
    return LeanCanvasProblema;
  };