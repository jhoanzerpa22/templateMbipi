module.exports = (sequelize, Sequelize) => {
    const ProyectoRecurso = sequelize.define("proyecto_recurso", {
      /*id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        defaultValue: sequelize.Sequelize.literal("nextval('referencias_id_seq')")
      },*/
      notascp_id: {
        type: Sequelize.INTEGER
      },
      proyecto_id: {
        type: Sequelize.INTEGER
      },
      usuario_id: {
        type: Sequelize.INTEGER
      }
    }, {
      tableName: 'proyecto_recurso',
      timestamps: false
    });
  
    return ProyectoRecurso;
  };