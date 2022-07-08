module.exports = (sequelize, Sequelize) => {
    const EquiposUsuarios = sequelize.define("equipos_usuarios", {
      /*id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        defaultValue: sequelize.Sequelize.literal("nextval('referencias_id_seq')")
      },*/
      correo: {
        type: Sequelize.STRING
      },
      rol: {
        type: Sequelize.STRING
      },
      participante: {
        type: Sequelize.BOOLEAN
      },
      usuario_id: {
        type: Sequelize.INTEGER
      },
      equipo_id: {
        type: Sequelize.INTEGER
      }
    }, {
      tableName: 'equipos_usuarios',
      timestamps: false
    });
  
    return EquiposUsuarios;
  };