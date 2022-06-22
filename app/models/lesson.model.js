module.exports = (sequelize, Sequelize) => {
  const Lesson = sequelize.define("lesson", {
    /*id:{
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      defaultValue: sequelize.Sequelize.literal("nextval('evento_id_seq')")
    },*/
    nombre: {
      type: Sequelize.STRING
    },
    subtitulo: {
      type: Sequelize.TEXT
    },
    completado: {
      type: Sequelize.TEXT
    },
    orden: {
      type: Sequelize.INTEGER
    },
    curso_id: {
      type: Sequelize.INTEGER
    },
    url: {
      type: Sequelize.TEXT
    }
  }, {
    tableName: 'lecciones',
    timestamps: false
  });

  return Lesson;
};