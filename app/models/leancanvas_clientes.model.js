module.exports = (sequelize, Sequelize) => {
    const LeanCanvasClientes = sequelize.define("leancanvas_clientes", {
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
      tableName: 'leancanvas_clientes',
      timestamps: false
    });
  
    return LeanCanvasClientes;
  };