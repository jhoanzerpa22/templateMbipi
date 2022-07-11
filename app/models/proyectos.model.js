module.exports = (sequelize, Sequelize) => {
    const Proyectos = sequelize.define("proyectos", {
      /*id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        defaultValue: sequelize.Sequelize.literal("nextval('referencias_id_seq')")
      },*/
      nombre: {
        type: Sequelize.STRING
      },
      descripcion: {
        type: Sequelize.TEXT
      },
      aplicacion_tipo: {
        type: Sequelize.STRING
      },
      proyecto_tipo_id: {
        type: Sequelize.INTEGER
      },
      metodologia_id: {
        type: Sequelize.INTEGER
      },
      usuario_id: {
        type: Sequelize.INTEGER
      },
      equipo_id: {
        type: Sequelize.INTEGER
      }
    }, {
      tableName: 'proyectos',
      timestamps: false
    });
  
    return Proyectos;
  };