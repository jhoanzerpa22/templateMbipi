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
      metaslp_id: {
        type: Sequelize.INTEGER
      },
      preguntasprint_id: {
        type: Sequelize.INTEGER
      },
      mapaux_id: {
        type: Sequelize.INTEGER
      },
      scopecanvas_necesidades_id: {
        type: Sequelize.INTEGER
      },
      scopecanvas_propositos_id: {
        type: Sequelize.INTEGER
      },
      scopecanvas_objetivos_id: {
        type: Sequelize.INTEGER
      },
      scopecanvas_acciones_id: {
        type: Sequelize.INTEGER
      },
      scopecanvas_metricas_id: {
        type: Sequelize.INTEGER
      },
      leancanvas_problema_id: {
        type: Sequelize.INTEGER
      },
      leancanvas_clientes_id: {
        type: Sequelize.INTEGER
      },
      leancanvas_solucion_id: {
        type: Sequelize.INTEGER
      },
      leancanvas_metricas_clave_id: {
        type: Sequelize.INTEGER
      },
      leancanvas_propuesta_id: {
        type: Sequelize.INTEGER
      },
      leancanvas_ventajas_id: {
        type: Sequelize.INTEGER
      },
      leancanvas_canales_id: {
        type: Sequelize.INTEGER
      },
      leancanvas_estructura_id: {
        type: Sequelize.INTEGER
      },
      leancanvas_flujo_id: {
        type: Sequelize.INTEGER
      },
      bosquejar_id: {
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