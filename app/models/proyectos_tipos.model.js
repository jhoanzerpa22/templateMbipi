module.exports = (sequelize, Sequelize) => {
    const ProyectosTipos = sequelize.define("proyectos_tipos", {
      /*id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        defaultValue: sequelize.Sequelize.literal("nextval('referencias_id_seq')")
      },*/
      nombre: {
        type: Sequelize.STRING
      }
    }, {
      tableName: 'proyectos_tipos',
      timestamps: false
    });
  
    return ProyectosTipos;
  };