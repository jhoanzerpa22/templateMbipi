module.exports = (sequelize, Sequelize) => {
    const Curso = sequelize.define("course", {
      /*id:{
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      defaultValue: sequelize.Sequelize.literal("nextval('evento_tipo_id_seq')")
    },*/
      nombre: {
        type: Sequelize.STRING
      },
      subtitulo: {
        type: Sequelize.TEXT
      },
      duracion: {
        type: Sequelize.INTEGER
      },
      categoria: {
        type: Sequelize.STRING
      },
      completado: {
        type: Sequelize.STRING
      },
      etapa: {
        type: Sequelize.STRING
      }
    }, {
      tableName: 'cursos',
      timestamps: false
    });
  
    return Curso;
  };