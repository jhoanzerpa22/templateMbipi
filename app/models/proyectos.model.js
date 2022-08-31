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
      code: {
        type: Sequelize.STRING
      },
      descripcion: {
        type: Sequelize.TEXT
      },
      aplicacion_tipo: {
        type: Sequelize.STRING
      },
      estado:{
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
      },
      etapa_activa:{
        type: Sequelize.STRING
      },
      tiempo: {
        type: Sequelize.STRING
      },
      fecha_inicio: {
        type: Sequelize.DATE
      },
      fecha_termino: {
        type: Sequelize.DATE
      }
    }, {
      tableName: 'proyectos',
      timestamps: false
    });

    return Proyectos;
  };
