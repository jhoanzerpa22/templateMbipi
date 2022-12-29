const db = require("../models");
const serverConfig = require("../config/server.config.js");

const Proyectos = db.proyectos;
const Equipos = db.equipos;
const EquiposUsuarios = db.equipos_usuarios;
const User = db.user;
const Usuario = db.usuario;
const ProyectoRecurso = db.proyecto_recurso;
const NotasCp = db.notascp;
const MetasLp = db.metaslp;
const PreguntaSprint = db.preguntasprint;
const MapaUx = db.mapaux;
const ScopeCanvasNecesidades = db.scopecanvas_necesidades;
const ScopeCanvasObjetivos = db.scopecanvas_objetivos;
const ScopeCanvasPropositos = db.scopecanvas_propositos;
const ScopeCanvasAcciones = db.scopecanvas_acciones;
const ScopeCanvasMetricas = db.scopecanvas_metricas;
const LeanCanvasProblema = db.leancanvas_problema;
const LeanCanvasClientes = db.leancanvas_clientes;
const LeanCanvasSolucion = db.leancanvas_solucion;
const LeanCanvasMetricasClave = db.leancanvas_metricas;
const LeanCanvasPropuesta = db.leancanvas_propuesta;
const LeanCanvasVentajas = db.leancanvas_ventajas;
const LeanCanvasCanales = db.leancanvas_canales;
const LeanCanvasEstructura = db.leancanvas_estructura;
const LeanCanvasFlujo = db.leancanvas_flujo;
const MapaCalor = db.mapa_calor;
const CloudUser = db.cloud_user;

const Op = db.Sequelize.Op;

var bcrypt = require("bcryptjs");
const { data } = require("jquery");

// Create and Save a new Proyectos
exports.create = (req, res) => {
  // Validate request
  if (!req.body.usuario_id) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Save Equipo to Database
      Equipos.create({
        nombre: 'Equipo - '+req.body.data.businessName
      }).then(equipo =>{

        const code = bcrypt.hashSync(req.body.data.businessName, 6);
        Proyectos.create({
            usuario_id: req.body.usuario_id,
            nombre: req.body.data.businessName,
            code: code,
            descripcion: req.body.data.businessDescription,
            aplicacion_tipo: req.body.data.accountType,
            estado: "Sin Iniciar",
            proyecto_tipo_id: req.body.data.accountPlan,
            equipo_id: equipo.id,
            metodologia_id: 1
            }).then(proyect =>{
              
                let decisor = req.body.data.members.findIndex(n => n.rol == 'Decisor');
                
                /*EquiposUsuarios.create({
                    usuario_id: req.body.usuario_id,
                    correo: req.body.correo,
                    rol: decisor != -1 ? 'Participante' : 'Decisor',
                    participante: true,
                    equipo_id: equipo.id,
                    }).then(ep =>{

                        */if(req.body.data.members.length > 0){
                            for (let i = 0; i < req.body.data.members.length; i++) {

                                EquiposUsuarios.create({
                                    usuario_id: req.body.data.members[i].existe == 1 ? req.body.data.members[i].id : null,
                                    correo: req.body.data.members[i].correo,
                                    rol: req.body.data.members[i].rol,
                                    participante: req.body.data.members[i].existe == 1 && req.body.usuario_id == req.body.data.members[i].id ? true : false,
                                    equipo_id: equipo.id,
                                    }).then(ep2 =>{
                                        if((i + 1) == req.body.data.members.length){
                                            res.send({ message: "Proyecto was registered successfully!", data: proyect});
                                        }

                                    }).catch(err => {
                                        res.status(500).send({
                                        message: "Error creating EquiposProyectos"
                                        });
                                    });
                            }
                        }else{
                            res.send({ message: "Proyecto was registered successfully!", data: proyect });
                        }
                    /*}).catch(err => {
                        res.status(500).send({
                        message: "Error creating EquipoProyecto"
                        });
                    });*/

        }).catch(err => {
            res.status(500).send({
            message: "Error creating Proyectos"
            });
        })
      }).catch(err => {
        res.status(500).send({
          message: "Error creating Equipo"
        });
      });

};

// Retrieve all Proyectoss from the database.
exports.findAll = (req, res) => {
  const nombre = req.query.nombre;
  var condition = nombre ? { nombre: { [Op.iLike]: `%${nombre}%` } } : null;

  Proyectos.findAll({ where: condition})
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving proyectoses."
      });
    });
};

// Find a single Proyectos with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Proyectos.findByPk(id, {
    include: [{
      model: Equipos, as: "proyecto_equipo", attributes:['id','nombre'], 
        include: [{
          model: EquiposUsuarios, as: "equipo_usuarios", attributes:['id','correo','rol','usuario_id'],
            include: [{
              model: Usuario, as: "eq_usu_plat"
            }]
        }]
      },
      {
        model: ProyectoRecurso, as: "proyecto_recursos", attributes:['id','notascp_id','metaslp_id', 'preguntasprint_id', 'scopecanvas_necesidades_id', 'scopecanvas_propositos_id', 'scopecanvas_objetivos_id', 'scopecanvas_acciones_id', 'scopecanvas_metricas_id', 'leancanvas_clientes_id', 'leancanvas_problema_id', 'leancanvas_solucion_id', 'leancanvas_metricas_clave_id', 'leancanvas_propuesta_id', 'leancanvas_ventajas_id', 'leancanvas_canales_id', 'leancanvas_estructura_id', 'leancanvas_flujo_id','bosquejar_id','mapa_calor_id','usuario_id'], 
          include: [{
            model: NotasCp/*, as: "equipo_usuarios"*/, attributes:['id','contenido','categoria','votos','detalle']
          }, {
            model: MetasLp/*, as: "equipo_usuarios"*/, attributes:['id','contenido','seleccionado','votos','detalle','position','dragPosition']
          }, {
            model: PreguntaSprint/*, as: "equipo_usuarios"*/, attributes:['id','contenido','votos','detalle','position','dragPosition']
          }, {
            model: MapaUx/*, as: "equipo_usuarios"*/, attributes:['id','contenido']
          }, {
            model: ScopeCanvasNecesidades/*, as: "equipo_usuarios"*/, attributes:['id','contenido','tipo','position','dragPosition']
          }, {
            model: ScopeCanvasPropositos/*, as: "equipo_usuarios"*/, attributes:['id','contenido','seleccionado','votos','detalle','position','dragPosition']
          }, {
            model: ScopeCanvasObjetivos/*, as: "equipo_usuarios"*/, attributes:['id','contenido','tipo','position','dragPosition']
          }, {
            model: ScopeCanvasAcciones/*, as: "equipo_usuarios"*/, attributes:['id','contenido','position','dragPosition']
          }, {
            model: ScopeCanvasMetricas/*, as: "equipo_usuarios"*/, attributes:['id','contenido','position','dragPosition']
          }, {
            model: LeanCanvasProblema/*, as: "equipo_usuarios"*/, attributes:['id','contenido','position','dragPosition']
          }, {
            model: LeanCanvasClientes/*, as: "equipo_usuarios"*/, attributes:['id','contenido','position','dragPosition']
          }, {
            model: LeanCanvasSolucion/*, as: "equipo_usuarios"*/, attributes:['id','contenido','position','dragPosition']
          }, {
            model: LeanCanvasMetricasClave/*, as: "equipo_usuarios"*/, attributes:['id','contenido','position','dragPosition']
          }, {
            model: LeanCanvasPropuesta/*, as: "equipo_usuarios"*/, attributes:['id','contenido','position','dragPosition']
          }, {
            model: LeanCanvasVentajas/*, as: "equipo_usuarios"*/, attributes:['id','contenido','position','dragPosition']
          }, {
            model: LeanCanvasCanales/*, as: "equipo_usuarios"*/, attributes:['id','contenido','position','dragPosition']
          }, {
            model: LeanCanvasEstructura/*, as: "equipo_usuarios"*/, attributes:['id','contenido','position','dragPosition']
          }, {
            model: LeanCanvasFlujo/*, as: "equipo_usuarios"*/, attributes:['id','contenido','position','dragPosition']
          }, {
            model: MapaCalor/*, as: "equipo_usuarios"*/, attributes:['id','contenido','position','dragPosition']
          }, {
            model: CloudUser/*, as: "equipo_usuarios"*/, attributes:['id','name','secure_url','cloudinary_id']
          }]
      }]
    })
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Proyectos with id=${id}.`
        });
      }
    })
    .catch(err => {
      console.log('error:'+err.message);
      res.status(500).send({
        message: "Error retrieving Proyectos with id=" + id
      });
    });
};

// Find Dashboard with an id usuario
exports.dashboard = (req, res) => {
    const usuario_id = req.params.id;
    const correo = req.params.correo;

    EquiposUsuarios.findAll({ where: {
      [Op.or]: [
        { correo: correo },
        { usuario_id: usuario_id }
      ],[Op.and]: [
        { participante: true }
      ]
    },
    include: [{
              model: Equipos, as: "equipos_equipo", attributes:['nombre'],
                  include: [{
                      model: Proyectos, as: "equipo_proyecto", attributes:['id','nombre','descripcion', 'estado', 'fecha_inicio']
                      },{
                      model: EquiposUsuarios, as: "equipo_usuarios", attributes:['id','correo','rol','usuario_id'],
                          include: [{
                          model: Usuario, as: "eq_usu_plat"/*, attributes: ['id']*/
                            /*,include: [{
                              model: Usuario, as: "usuario_usuario"/*, attributes: ['nombre']
                            }]*/
                          }]
                      }]
    }]
    })
    .then(data => {/*
      Proyectos.findAll({
        where: {equipo_id: data.equipo_id}
      })
      .then(proyectos =>{*/
        res.send(data)
      /*})
      .catch(err =>{
        res.send({'equipos': data})
      })*/
    })
    .catch(err =>{
      res.status(500).send({
        message:
          err.message || "Some error ocurred while retrieving proyectos."
      })
    })


    // Proyectos.findAll({ where: {usuario_id: usuario_id}})
    // .then(data => {
    //     EquiposUsuarios.findAll({ where: {usuario_id: usuario_id}})
    //     .then(equipos => {

    //         res.send({'proyectos': data, 'equipos': equipos});
    //     })
    //     .catch(err => {

    //         res.send({'proyectos': data});
    //     });
    // })
    // .catch(err => {
    //   res.status(500).send({
    //     message:
    //       err.message || "Some error occurred while retrieving proyectos."
    //   });
    // });
  };

// Update a Proyectos by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  let proyectos = {
      nombre: req.body.nombre,
      descripcion: req.body.descripcion,
      aplicacion_tipo: req.body.aplicacion_tipo,
      proyecto_tipo_id: req.body.proyecto_tipo_id
    };

  Proyectos.update(proyectos, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: `Proyecto with id=${id} was updated successfully.`
        });
      } else {
        res.send({
          message: `Cannot update Proyectos with id=${id}. Maybe Proyectos was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Proyectos with id=" + id
      });
    });
};

// Update status the Proyectos by the id in the request
exports.updateStatus = (req, res) => {
  const id = req.params.id;
  let proyectos = {
      estado: req.body.estado,
      fecha_inicio: req.body.fecha_inicio,
      etapa_activa: req.body.etapa_activa
    };

  Proyectos.update(proyectos, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: `Proyecto with id=${id} was updated successfully.`
        });
      } else {
        res.send({
          message: `Cannot update Proyectos with id=${id}. Maybe Proyectos was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Proyectos with id=" + id
      });
    });
};

// Update time the Proyectos by the id in the request
exports.updateTime = (req, res) => {
  const id = req.params.id;
  let proyectos = {
      tiempo: req.body.tiempo
    };

  Proyectos.update(proyectos, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: `Proyecto with id=${id} was updated successfully.`
        });
      } else {
        res.send({
          message: `Cannot update Proyectos with id=${id}. Maybe Proyectos was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Proyectos with id=" + id
      });
    });
};

// Update notacp the Proyectos by the id in the request
exports.updateNotaCp = (req, res) => {
  const id = req.params.id;
  let notacp = {
      votos: req.body.votos,
      detalle: JSON.stringify(req.body.detalle)
    };

  NotasCp.update(notacp, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: `Proyecto Notacp with id=${id} was updated successfully.`
        });

      } else {
        res.send({
          message: `Cannot update Proyectos notacp with id=${id}. Maybe Proyectos was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Proyectos notacp with id=" + id
      });
    });
};

// Create metalp the Proyectos by the id in the request
exports.createMetaLp = (req, res) => {
  
  let meta = {
                  contenido: req.body.content,
                  votos: 0,
                  detalle: JSON.stringify([]),
                  position: null,
                  dragPosition: JSON.stringify({x: 0, y: 0})
                };

          MetasLp.create(meta).then(nec =>{
                  
                let proyecto_recurso = {'proyecto_id': req.body.proyecto_id, 'metaslp_id': nec.dataValues.id, 'usuario_id': req.body.usuario_id };

                ProyectoRecurso.create(proyecto_recurso).then(pr =>{
                    res.send({
                      message: `Proyecto with id=${req.body.proyecto_id} was updated successfully.`, meta_id: nec.dataValues.id
                    });
    
                }).catch(err => {
                    res.status(500).send({
                    message: "Error creating ProyectoRecurso"
                    });
                });
  
            }).catch(err => {
                res.status(500).send({
                message: "Error creating MetaLp"
                });
            });
};

// Update metalp the Proyectos by the id in the request
exports.updateMetaLp = (req, res) => {
  const id = req.params.id;
  let metalp = {
      votos: req.body.votos,
      detalle: JSON.stringify(req.body.detalle),
      seleccionado: req.body.seleccionado,
      position: req.body.position,
      dragPosition: JSON.stringify(req.body.dragPosition)
    };
   
  MetasLp.update(metalp, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: `Proyecto Metalp with id=${id} was updated successfully.`
        });

      } else {
        res.send({
          message: `Cannot update Proyectos metalp with id=${id}. Maybe Proyectos was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Proyectos metalp with id=" + id
      });
    });
};

// Create notacp the Proyectos by the id in the request
exports.createNotaCp = (req, res) => {

  let nota = {
                  contenido: req.body.content,
                  categoria: 'como podriamos',
                  votos: 0,
                  detalle: JSON.stringify([])
                };

          NotasCp.create(nota).then(nec =>{
                  
                let proyecto_recurso = {'proyecto_id': req.body.proyecto_id, 'notascp_id': nec.dataValues.id, 'usuario_id': req.body.usuario_id };

                ProyectoRecurso.create(proyecto_recurso).then(pr =>{
                    res.send({
                      message: `Proyecto with id=${req.body.proyecto_id} was updated successfully.`, nota_id: nec.dataValues.id
                    });
    
                }).catch(err => {
                    res.status(500).send({
                    message: "Error creating ProyectoRecurso"
                    });
                });
  
            }).catch(err => {
                res.status(500).send({
                message: "Error creating NotaCp"
                });
            });
};

// Create preguntasprint the Proyectos by the id in the request
exports.createPreguntaSprint = (req, res) => {
  
  let pregunta = {
                  contenido: req.body.content,
                  votos: 0,
                  detalle: JSON.stringify([]),
                  position: null,
                  dragPosition: JSON.stringify({x: 0, y: 0})
                };

          PreguntaSprint.create(pregunta).then(nec =>{
                  
                let proyecto_recurso = {'proyecto_id': req.body.proyecto_id, 'preguntasprint_id': nec.dataValues.id, 'usuario_id': req.body.usuario_id };

                ProyectoRecurso.create(proyecto_recurso).then(pr =>{
                    res.send({
                      message: `Proyecto with id=${req.body.proyecto_id} was updated successfully.`, pregunta_id: nec.dataValues.id
                    });
    
                }).catch(err => {
                    res.status(500).send({
                    message: "Error creating ProyectoRecurso"
                    });
                });
  
            }).catch(err => {
                res.status(500).send({
                message: "Error creating Pregunta"
                });
            });
};

// Update preguntasprint the Proyectos by the id in the request
exports.updatePreguntaSprint = (req, res) => {
  const id = req.params.id;
  let pregunta = {
      votos: req.body.votos,
      detalle: JSON.stringify(req.body.detalle),
      position: req.body.position,
      dragPosition: JSON.stringify(req.body.dragPosition)
    };
   
  PreguntaSprint.update(pregunta, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: `Proyecto PreguntaSprint with id=${id} was updated successfully.`
        });

      } else {
        res.send({
          message: `Cannot update Proyectos PreguntaSprint with id=${id}. Maybe Proyectos was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Proyectos PreguntaSprint with id=" + id
      });
    });
};

// Update or Create mapaux the Proyectos by the id in the request
exports.updateMapaUx = (req, res) => {
  const id = req.params.id;
  let mapaux = {
      contenido: JSON.stringify(req.body.contenido)
    };

    ProyectoRecurso.findOne({
      where: {
        proyecto_id: id, 
        mapaux_id: {
          [Op.gt]: 0
        }} })
      .then(data => {
        if (data) {
          
          MapaUx.update(mapaux, {
            where: { id: data.mapaux_id }
          })
            .then(num => {
              if (num == 1) {
                res.send({
                  message: `Proyecto Mapaux with id=${data.mapaux_id} was updated successfully.`
                });
        
              } else {
                res.send({
                  message: `Cannot update Proyectos mapaux with id=${data.mapaux_id}. Maybe Proyectos was not found or req.body is empty!`
                });
              }
            })
            .catch(err => {
              res.status(500).send({
                message: "Error updating Proyectos mapaux with id=" + data.mapaux_id
              });
            });

        } else {

          MapaUx.create(mapaux).then(new_mapa =>{
              //console.log('new_mapa',new_mapa);
              //console.log('id_mapa', new_mapa.dataValues.id);
              ProyectoRecurso.create({'proyecto_id': id, 'mapaux_id': new_mapa.dataValues.id}).then(pr =>{
                  res.send({
                    message: `ProyectoRecurso of Proyecto with id=${id} was updated successfully.`
                  });

              }).catch(err => {
                  res.status(500).send({
                  message: "Error creating ProyectoRecurso"
                  });
              });
                
            }).catch(err => {
                res.status(500).send({
                message: "Error creating MapaUx"+err.message
                });
            });

        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving Proyecto with id=" + id
        });
      });
};

// Update necesidades the Proyectos by the id in the request
exports.updateNecesidades = (req, res) => {
  const id = req.params.id;
  let necesidades = {
      contenido: req.body.content,
      tipo: req.body.type,
      position: req.body.position,
      dragPosition: JSON.stringify(req.body.dragPosition)
    };
   
  ScopeCanvasNecesidades.update(necesidades, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: `Proyecto necesidades with id=${id} was updated successfully.`
        });

      } else {
        res.send({
          message: `Cannot update Proyectos necesidades with id=${id}. Maybe Proyectos was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Proyectos necesidades with id=" + id
      });
    });
};

// Update propositos the Proyectos by the id in the request
exports.updatePropositos = (req, res) => {
  const id = req.params.id;
  let proposito = {
      contenido: req.body.content,
      votos: 0,//req.body.votos,
      detalle: JSON.stringify([]/*req.body.detalle*/),
      seleccionado: false,//req.body.seleccionado,
      position: req.body.position,
      dragPosition: JSON.stringify(req.body.dragPosition)
    };
   
  ScopeCanvasPropositos.update(proposito, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: `Proyecto Propositos with id=${id} was updated successfully.`
        });

      } else {
        res.send({
          message: `Cannot update Proyectos propositos with id=${id}. Maybe Proyectos was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Proyectos propositos with id=" + id
      });
    });
};

// Update objetivos the Proyectos by the id in the request
exports.updateObjetivos = (req, res) => {
  const id = req.params.id;
  let objetivos = {
      contenido: req.body.content,
      tipo: req.body.type,
      position: req.body.position,
      dragPosition: JSON.stringify(req.body.dragPosition)
    };
   
  ScopeCanvasObjetivos.update(objetivos, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: `Proyecto objetivos with id=${id} was updated successfully.`
        });

      } else {
        res.send({
          message: `Cannot update Proyectos objetivos with id=${id}. Maybe Proyectos was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Proyectos objetivos with id=" + id
      });
    });
};


// Update acciones the Proyectos by the id in the request
exports.updateAcciones = (req, res) => {
  const id = req.params.id;
  let acciones = {
      contenido: req.body.content,
      position: req.body.position,
      dragPosition: JSON.stringify(req.body.dragPosition)
    };
   
  ScopeCanvasAcciones.update(acciones, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: `Proyecto acciones with id=${id} was updated successfully.`
        });

      } else {
        res.send({
          message: `Cannot update Proyectos acciones with id=${id}. Maybe Proyectos was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Proyectos acciones with id=" + id
      });
    });
};

// Update metricas the Proyectos by the id in the request
exports.updateMetricas = (req, res) => {
  const id = req.params.id;
  let metricas = {
      contenido: req.body.content,
      position: req.body.position,
      dragPosition: JSON.stringify(req.body.dragPosition)
    };
   
  ScopeCanvasMetricas.update(metricas, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: `Proyecto metricas with id=${id} was updated successfully.`
        });

      } else {
        res.send({
          message: `Cannot update Proyectos metricas with id=${id}. Maybe Proyectos was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Proyectos metricas with id=" + id
      });
    });
};


// Update problema the Proyectos by the id in the request
exports.updateProblema = (req, res) => {
  const id = req.params.id;
  let problema = {
      contenido: req.body.content,
      position: req.body.position,
      dragPosition: JSON.stringify(req.body.dragPosition)
    };
   
  LeanCanvasProblema.update(problema, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: `Proyecto problema with id=${id} was updated successfully.`
        });

      } else {
        res.send({
          message: `Cannot update Proyectos problema with id=${id}. Maybe Proyectos was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Proyectos problema with id=" + id
      });
    });
};

// Update clientes the Proyectos by the id in the request
exports.updateClientes = (req, res) => {
  const id = req.params.id;
  let cliente = {
      contenido: req.body.content,
      position: req.body.position,
      dragPosition: JSON.stringify(req.body.dragPosition)
    };
   
  LeanCanvasClientes.update(cliente, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: `Proyecto clientes with id=${id} was updated successfully.`
        });

      } else {
        res.send({
          message: `Cannot update Proyectos clientes with id=${id}. Maybe Proyectos was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Proyectos clientes with id=" + id
      });
    });
};

// Update solucion the Proyectos by the id in the request
exports.updateSolucion = (req, res) => {
  const id = req.params.id;
  let solucion = {
      contenido: req.body.content,
      position: req.body.position,
      dragPosition: JSON.stringify(req.body.dragPosition)
    };
   
  LeanCanvasSolucion.update(solucion, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: `Proyecto solucion with id=${id} was updated successfully.`
        });

      } else {
        res.send({
          message: `Cannot update Proyectos solucion with id=${id}. Maybe Proyectos was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Proyectos solucion with id=" + id
      });
    });
};


// Update metricas clave the Proyectos by the id in the request
exports.updateMetricasClave = (req, res) => {
  const id = req.params.id;
  let metricas_clave = {
      contenido: req.body.content,
      position: req.body.position,
      dragPosition: JSON.stringify(req.body.dragPosition)
    };
   
  LeanCanvasMetricasClave.update(metricas_clave, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: `Proyecto metricas clave with id=${id} was updated successfully.`
        });

      } else {
        res.send({
          message: `Cannot update Proyectos metricas clave with id=${id}. Maybe Proyectos was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Proyectos metricas clave with id=" + id
      });
    });
};

// Update propuesta the Proyectos by the id in the request
exports.updatePropuesta = (req, res) => {
  const id = req.params.id;
  let propuesta = {
      contenido: req.body.content,
      position: req.body.position,
      dragPosition: JSON.stringify(req.body.dragPosition)
    };
   
  LeanCanvasPropuesta.update(propuesta, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: `Proyecto propuesta with id=${id} was updated successfully.`
        });

      } else {
        res.send({
          message: `Cannot update Proyectos propuesta with id=${id}. Maybe Proyectos was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Proyectos propuesta with id=" + id
      });
    });
};
// Update ventajas the Proyectos by the id in the request
exports.updateVentajas = (req, res) => {
  const id = req.params.id;
  let ventajas = {
      contenido: req.body.content,
      position: req.body.position,
      dragPosition: JSON.stringify(req.body.dragPosition)
    };
   
  LeanCanvasVentajas.update(ventajas, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: `Proyecto ventajas with id=${id} was updated successfully.`
        });

      } else {
        res.send({
          message: `Cannot update Proyectos ventajas with id=${id}. Maybe Proyectos was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Proyectos ventajas with id=" + id
      });
    });
};
// Update canales the Proyectos by the id in the request
exports.updateCanales = (req, res) => {
  const id = req.params.id;
  let canales = {
      contenido: req.body.content,
      position: req.body.position,
      dragPosition: JSON.stringify(req.body.dragPosition)
    };
   
  LeanCanvasCanales.update(canales, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: `Proyecto canales with id=${id} was updated successfully.`
        });

      } else {
        res.send({
          message: `Cannot update Proyectos canales with id=${id}. Maybe Proyectos was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Proyectos canales with id=" + id
      });
    });
};


// Update estructura the Proyectos by the id in the request
exports.updateEstructura = (req, res) => {
  const id = req.params.id;
  let estructura = {
      contenido: req.body.content,
      position: req.body.position,
      dragPosition: JSON.stringify(req.body.dragPosition)
    };
   
  LeanCanvasEstructura.update(estructura, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: `Proyecto estructura with id=${id} was updated successfully.`
        });

      } else {
        res.send({
          message: `Cannot update Proyectos estructura with id=${id}. Maybe Proyectos was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Proyectos estructura with id=" + id
      });
    });
};

// Update flujo the Proyectos by the id in the request
exports.updateFlujo = (req, res) => {
  const id = req.params.id;
  let flujo = {
      contenido: req.body.content,
      position: req.body.position,
      dragPosition: JSON.stringify(req.body.dragPosition)
    };
   
  LeanCanvasFlujo.update(flujo, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: `Proyecto flujo with id=${id} was updated successfully.`
        });

      } else {
        res.send({
          message: `Cannot update Proyectos flujo with id=${id}. Maybe Proyectos was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Proyectos flujo with id=" + id
      });
    });
};

// Update mapa calor the Proyectos by the id in the request
exports.updateMapaCalor = (req, res) => {
  const id = req.params.id;
  let mapa_calor = {
      contenido: req.body.content,
      position: req.body.position,
      dragPosition: JSON.stringify(req.body.dragPosition)
    };
   
  MapaCalor.update(mapa_calor, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: `Proyecto mapa calor with id=${id} was updated successfully.`
        });

      } else {
        res.send({
          message: `Cannot update Proyectos mapa calor with id=${id}. Maybe Proyectos was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Proyectos mapa calor with id=" + id
      });
    });
};

// Update etapa the Proyectos by the id in the request
exports.updateEtapa = (req, res) => {
  const id = req.params.id;
  let proyectos = {
      etapa_activa: req.body.etapa_activa
    };
   
  let type_fase = req.body.type;
  let tablero = req.body.tablero;
  let como_podriamos = [];

  Proyectos.update(proyectos, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {

        /*Verificamos que fase guardar*/
        if(type_fase == 'notas'){
          let i = 0;
          for(let n in tablero){
          //for (let i = 0; i < req.body.tablero.length; i++) {
            if(tablero[n].id > 0){

              let notas_cp = {
                  contenido: tablero[n].content
                };

              NotasCp.update(notas_cp, {
                where: { id: tablero[n].id }
              })
                .then(num3 => {
                  
                }).catch(err => {
                  res.status(500).send({
                  message: "Error updating ProyectoRecurso NotasCp with id"+tablero[n].id
                  });
                });
              
            }else{
              como_podriamos.push({'contenido': tablero[n].content, 'categoria': 'como podriamos', 'votos': 0, 'detalle': JSON.stringify([])});
            }
          }

          let proyecto_recurso = [];

          if(como_podriamos.length > 0){

          NotasCp.bulkCreate(como_podriamos).then(cp =>{
                //if((i + 1) == req.body.tablero.length){
                  console.log('cp',cp);
                  for(let c in cp){
                  //for (let i = 0; i < req.body.tablero.length; i++) {
                    proyecto_recurso.push({'proyecto_id': id, 'notascp_id': cp[c].dataValues.id, 'usuario_id': tablero[c].usuario_id });
                  }
                  /*
                  cp [
                    notascp {
                      dataValues: {
                        id: 4,*/
                  //console.log('proyecto_recurso', proyecto_recurso);

                  /*res.send({
                    message: `Proyecto with id=${id} was updated successfully.`
                  });*/
                //}

                ProyectoRecurso.bulkCreate(proyecto_recurso).then(pr =>{
                    res.send({
                      message: `Proyecto with id=${id} was updated successfully.`
                    });
    
                }).catch(err => {
                    res.status(500).send({
                    message: "Error creating ProyectoRecurso"
                    });
                });
  
            }).catch(err => {
                res.status(500).send({
                message: "Error creating NotasCp"
                });
            });
          }else{
            res.send({
              message: `Proyecto with id=${id} was updated successfully.`
            });
          }
        }else if(type_fase == 'clasificacion'){

          let icp = 0;
          for(let nc in tablero){
          //for (let i = 0; i < req.body.tablero.length; i++) {
            let icp2 = 0;
            icp = icp + 1;
            
            for(let ncp in tablero[nc].data){
              icp2 = icp2 + 1;
    
              let idcp = tablero[nc].data[ncp].id;
              let proyectos_notas = {
                  categoria: tablero[nc].title
                };
            
              NotasCp.update(proyectos_notas, {
                where: { id: idcp }
              })
                .then(num2 => {
                  if (num2 == 1 && icp == tablero.length && icp2 == tablero[nc].data.length) {
                    res.send({
                      message: `Proyecto with id=${id} was updated successfully.`
                    });
                  }
                }).catch(err => {
                  res.status(500).send({
                  message: "Error creating ProyectoRecurso Clasi"
                  });
              });

            }
          }

        }else if(type_fase == 'voto'){
          
          let icp = 0;
          for(let nc in tablero){
          //for (let i = 0; i < req.body.tablero.length; i++) {
            let icp2 = 0;
            icp = icp + 1;
            
            for(let ncp in tablero[nc].data){
              
              icp2 = icp2 + 1;
    
              let idcp = tablero[nc].data[ncp].id;
              let proyectos_notas = {
                  votos: tablero[nc].data[ncp].votos,
                  detalle: JSON.stringify(tablero[nc].data[ncp].detalle)
                };

              NotasCp.update(proyectos_notas, {
                where: { id: idcp }
              })
                .then(num2 => {
                  if (num2 == 1 && icp == tablero.length && icp2 == tablero[nc].data.length) {
                    res.send({
                      message: `Proyecto with id=${id} was updated successfully.`
                    });
                  }
                }).catch(err => {
                  res.status(500).send({
                  message: "Error creating ProyectoRecurso Voto"
                  });
              });

            }
          }

        }else{
          res.send({
            message: `Proyecto with id=${id} was updated successfully.`
          });
        }

      } else {
        res.send({
          message: `Cannot update Proyectos with id=${id}. Maybe Proyectos was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Proyectos with id=" + id
      });
    });
};

// Update etapa meta the Proyectos by the id in the request
exports.updateEtapaMeta = (req, res) => {
  const id = req.params.id;
  let proyectos = {
      etapa_activa: req.body.etapa_activa
    };
   
  let type_fase = req.body.type;
  let tablero = req.body.tablero;
  let metas = [];

  Proyectos.update(proyectos, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {

        /*Verificamos que fase guardar*/
        if(type_fase == 'notas'){
          let i = 0;
          let position = 0;
          for(let n in tablero){
          //for (let i = 0; i < req.body.tablero.length; i++) {
            if(tablero[n].id > 0){

              let meta_lp = {
                  contenido: tablero[n].content,
                  position: position
                };

              MetasLp.update(meta_lp, {
                where: { id: tablero[n].id }
              })
                .then(num3 => {
                  
                }).catch(err => {
                  res.status(500).send({
                  message: "Error updating ProyectoRecurso Metas with id"+tablero[n].id
                  });
                });
              
            }else{
              metas.push({'contenido': tablero[n].content, 'seleccionado': false, 'votos': 0, 'detalle': JSON.stringify([]), position: position,
              dragPosition: JSON.stringify({x: 0, y: 0})});
            }

            position = position + 1;
          }

          let proyecto_recurso = [];

          if(metas.length > 0){
          
          MetasLp.bulkCreate(metas).then(mlp =>{
                  console.log('metas',mlp);
                  for(let c in mlp){
                    proyecto_recurso.push({'proyecto_id': id, 'metaslp_id': mlp[c].dataValues.id, 'usuario_id': tablero[c].usuario_id });
                  }

                ProyectoRecurso.bulkCreate(proyecto_recurso).then(pr =>{
                    res.send({
                      message: `Proyecto with id=${id} was updated successfully.`
                    });
    
                }).catch(err => {
                    res.status(500).send({
                    message: "Error creating ProyectoRecurso"
                    });
                });
  
            }).catch(err => {
                res.status(500).send({
                message: "Error creating MetasLp"
                });
            });
          
          }else{
            res.send({
              message: `Proyecto with id=${id} was updated successfully.`
            });
          }
        }else if(type_fase == 'voto'){
          
          let icp = 0;
          for(let nc in tablero){
          //for (let i = 0; i < req.body.tablero.length; i++) {
            let icp2 = 0;
            icp = icp + 1;
            
            for(let ncp in tablero[nc].data){
              
              icp2 = icp2 + 1;
    
              let idcp = tablero[nc].data[ncp].id;
              let proyectos_notas = {
                  votos: tablero[nc].data[ncp].votos,
                  seleccionado: tablero[nc].data[ncp].seleccionado,
                  detalle: JSON.stringify(tablero[nc].data[ncp].detalle),
                  position: tablero[nc].data[ncp].positon,
                  dragPosition: JSON.stringify(tablero[nc].data[ncp].dragPosition)
                };

              MetasLp.update(proyectos_notas, {
                where: { id: idcp }
              })
                .then(num2 => {
                  if (num2 == 1 && icp == tablero.length && icp2 == tablero[nc].data.length) {
                    res.send({
                      message: `Proyecto with id=${id} was updated successfully.`
                    });
                  }
                }).catch(err => {
                  res.status(500).send({
                  message: "Error creating ProyectoRecurso Meta Voto"+err.message
                  });
              });

            }
          }

        }else{
          res.send({
            message: `Proyecto with id=${id} was updated successfully.`
          });
        }

      } else {
        res.send({
          message: `Cannot update Proyectos with id=${id}. Maybe Proyectos was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Proyectos with id=" + id
      });
    });
};

// Update etapa preguntas the Proyectos by the id in the request
exports.updateEtapaPreguntas = (req, res) => {
  const id = req.params.id;
  let proyectos = {
      etapa_activa: req.body.etapa_activa
    };
   
  let type_fase = req.body.type;
  let tablero = req.body.tablero;
  let preguntas = [];

  Proyectos.update(proyectos, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {

        /*Verificamos que fase guardar*/
        if(type_fase == 'notas'){
          let i = 0;
          let position = 0;
          for(let n in tablero){
          //for (let i = 0; i < req.body.tablero.length; i++) {
            if(tablero[n].id > 0){

              let preg_sprint = {
                  contenido: tablero[n].content,
                  position: position
                };

              PreguntaSprint.update(preg_sprint, {
                where: { id: tablero[n].id }
              })
                .then(num3 => {
                  
                }).catch(err => {
                  res.status(500).send({
                  message: "Error updating ProyectoRecurso Preguntas Sprint with id"+tablero[n].id
                  });
                });
              
            }else{
              preguntas.push({'contenido': tablero[n].content, 'votos': 0, 'detalle': JSON.stringify([]),position: position, dragPosition: JSON.stringify(tablero[n].dragPosition)});
            }
            position = position + 1;
          }

          let proyecto_recurso = [];

          if(preguntas.length > 0){
          
            PreguntaSprint.bulkCreate(preguntas).then(mlp =>{
                  console.log('preguntas',mlp);
                  for(let c in mlp){
                    proyecto_recurso.push({'proyecto_id': id, 'preguntasprint_id': mlp[c].dataValues.id, 'usuario_id': tablero[c].usuario_id });
                  }

                ProyectoRecurso.bulkCreate(proyecto_recurso).then(pr =>{
                    res.send({
                      message: `Proyecto with id=${id} was updated successfully.`
                    });
    
                }).catch(err => {
                    res.status(500).send({
                    message: "Error creating ProyectoRecurso"
                    });
                });
  
            }).catch(err => {
                res.status(500).send({
                message: "Error creating Preguntas Sprint"
                });
            });
            }else{
              res.send({
                message: `Proyecto with id=${id} was updated successfully.`
              });
            }
        }else if(type_fase == 'voto'){
          
          let icp = 0;
          for(let nc in tablero){
          //for (let i = 0; i < req.body.tablero.length; i++) {
            let icp2 = 0;
            icp = icp + 1;
            
            for(let ncp in tablero[nc].data){
              
              icp2 = icp2 + 1;
    
              let idcp = tablero[nc].data[ncp].id;
              let proyectos_notas = {
                  votos: tablero[nc].data[ncp].votos,
                  detalle: JSON.stringify(tablero[nc].data[ncp].detalle),
                  position: tablero[nc].data[ncp].position,
                  dragPosition: JSON.stringify(tablero[nc].data[ncp].dragPosition)
                };

              PreguntaSprint.update(proyectos_notas, {
                where: { id: idcp }
              })
                .then(num2 => {
                  if (num2 == 1 && icp == tablero.length && icp2 == tablero[nc].data.length) {
                    res.send({
                      message: `Proyecto with id=${id} was updated successfully.`
                    });
                  }
                }).catch(err => {
                  res.status(500).send({
                  message: "Error creating ProyectoRecurso Preguntas Sprint"
                  });
              });

            }
          }

        }else{
          res.send({
            message: `Proyecto with id=${id} was updated successfully.`
          });
        }

      } else {
        res.send({
          message: `Cannot update Proyectos with id=${id}. Maybe Proyectos was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Proyectos with id=" + id
      });
    });
};

// Update etapa mapa the Proyectos by the id in the request
exports.updateEtapaMapa = (req, res) => {
  const id = req.params.id;
  let proyectos = {
      etapa_activa: req.body.etapa_activa
    };
   
  let type_fase = req.body.type;
  let mapa = [];

  Proyectos.update(proyectos, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
          res.send({
            message: `Proyecto with id=${id} was updated successfully.`
          });
        

      } else {
        res.send({
          message: `Cannot update Proyectos with id=${id}. Maybe Proyectos was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Proyectos with id=" + id
      });
    });
};


// Create necesidades the Proyectos by the id in the request
exports.createNecesidades = (req, res) => {
  
  let necesidad = {
                  contenido: req.body.content,
                  tipo: req.body.type,
                  position: null,
                  dragPosition: JSON.stringify({x: 0, y: 0})
                };

          ScopeCanvasNecesidades.create(necesidad).then(nec =>{
                  
                let proyecto_recurso = {'proyecto_id': req.body.proyecto_id, 'scopecanvas_necesidades_id': nec.dataValues.id, 'usuario_id': req.body.usuario_id };

                ProyectoRecurso.create(proyecto_recurso).then(pr =>{
                    res.send({
                      message: `Proyecto with id=${req.body.proyecto_id} was updated successfully.`, necesidad_id: nec.dataValues.id
                    });
    
                }).catch(err => {
                    res.status(500).send({
                    message: "Error creating ProyectoRecurso"
                    });
                });
  
            }).catch(err => {
                res.status(500).send({
                message: "Error creating Necesidades"
                });
            });
};

// Update etapa necesidades the Proyectos by the id in the request
exports.updateEtapaNecesidades = (req, res) => {
  const id = req.params.id;
  let proyectos = {
      etapa_activa: req.body.etapa_activa
    };
   
  let type_fase = req.body.type;
  let tablero = req.body.tablero;
  let necesidades = [];

  Proyectos.update(proyectos, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {

        /*Verificamos que fase guardar*/
        if(type_fase == 'notas'){
          let i = 0;
          let position = 0;
          for(let n in tablero){
          //for (let i = 0; i < req.body.tablero.length; i++) {
            if(tablero[n].id > 0){

              let necesidad = {
                  contenido: tablero[n].content,
                  tipo: tablero[n].type,
                  position: position
                };

              ScopeCanvasNecesidades.update(necesidad, {
                where: { id: tablero[n].id }
              })
                .then(num3 => {
                  
                }).catch(err => {
                  res.status(500).send({
                  message: "Error updating ProyectoRecurso Necesidades with id"+tablero[n].id
                  });
                });
              
            }else{
              necesidades.push({'contenido': tablero[n].content,'tipo': tablero[n].type, position: position, dragPosition: JSON.stringify({x: 0, y: 0})});
            }
            
            position = position + 1;
          }

          let proyecto_recurso = [];

          if(necesidades.length > 0){
          
          ScopeCanvasNecesidades.bulkCreate(necesidades).then(nec =>{
                  console.log('necesidades',nec);
                  for(let c in nec){
                    proyecto_recurso.push({'proyecto_id': id, 'scopecanvas_necesidades_id': nec[c].dataValues.id, 'usuario_id': tablero[c].usuario_id });
                  }

                ProyectoRecurso.bulkCreate(proyecto_recurso).then(pr =>{
                    res.send({
                      message: `Proyecto with id=${id} was updated successfully.`
                    });
    
                }).catch(err => {
                    res.status(500).send({
                    message: "Error creating ProyectoRecurso"
                    });
                });
  
            }).catch(err => {
                res.status(500).send({
                message: "Error creating Necesidades"
                });
            });
          
          }else{
            res.send({
              message: `Proyecto with id=${id} was updated successfully.`
            });
          }
       }else{
          res.send({
            message: `Proyecto with id=${id} was updated successfully.`
          });
        }

      } else {
        res.send({
          message: `Cannot update Proyectos with id=${id}. Maybe Proyectos was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Proyectos with id=" + id
      });
    });
};


// Create propositos the Proyectos by the id in the request
exports.createPropositos = (req, res) => {
  
  let proposito = {
                  contenido: req.body.content,
                  votos: 0,
                  detalle: JSON.stringify([]),
                  position: null,
                  dragPosition: JSON.stringify({x: 0, y: 0})
                };

          ScopeCanvasPropositos.create(proposito).then(nec =>{
                  
                let proyecto_recurso = {'proyecto_id': req.body.proyecto_id, 'scopecanvas_propositos_id': nec.dataValues.id, 'usuario_id': req.body.usuario_id };

                ProyectoRecurso.create(proyecto_recurso).then(pr =>{
                    res.send({
                      message: `Proyecto with id=${req.body.proyecto_id} was updated successfully.`, proposito_id: nec.dataValues.id
                    });
    
                }).catch(err => {
                    res.status(500).send({
                    message: "Error creating ProyectoRecurso"
                    });
                });
  
            }).catch(err => {
                res.status(500).send({
                message: "Error creating Propositos"
                });
            });
};

// Update etapa propositos the Proyectos by the id in the request
exports.updateEtapaPropositos = (req, res) => {
  const id = req.params.id;
  let proyectos = {
      etapa_activa: req.body.etapa_activa
    };
   
  let type_fase = req.body.type;
  let tablero = req.body.tablero;
  let propositos = [];

  Proyectos.update(proyectos, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {

        /*Verificamos que fase guardar*/
        if(type_fase == 'notas'){
          let i = 0;
          let position = 0;
          for(let n in tablero){
          //for (let i = 0; i < req.body.tablero.length; i++) {
            if(tablero[n].id > 0){

              let proposito = {
                  contenido: tablero[n].content,
                  position: position
                };

              ScopeCanvasPropositos.update(proposito, {
                where: { id: tablero[n].id }
              })
                .then(num3 => {
                  
                }).catch(err => {
                  res.status(500).send({
                  message: "Error updating ProyectoRecurso Propositos with id"+tablero[n].id
                  });
                });
              
            }else{
              propositos.push({'contenido': tablero[n].content, 'seleccionado': false, 'votos': 0, 'detalle': JSON.stringify([]), position: position,
              dragPosition: JSON.stringify({x: 0, y: 0})});
            }
            position = position + 1;
          }

          let proyecto_recurso = [];

          if(propositos.length > 0){
          
          ScopeCanvasPropositos.bulkCreate(propositos).then(mlp =>{
                  console.log('propositos',mlp);
                  for(let c in mlp){
                    proyecto_recurso.push({'proyecto_id': id, 'scopecanvas_propositos_id': mlp[c].dataValues.id, 'usuario_id': tablero[c].usuario_id });
                  }

                ProyectoRecurso.bulkCreate(proyecto_recurso).then(pr =>{
                    res.send({
                      message: `Proyecto with id=${id} was updated successfully.`
                    });
    
                }).catch(err => {
                    res.status(500).send({
                    message: "Error creating ProyectoRecurso"
                    });
                });
  
            }).catch(err => {
                res.status(500).send({
                message: "Error creating Propositos"
                });
            });
          
          }else{
            res.send({
              message: `Proyecto with id=${id} was updated successfully.`
            });
          }
        }else if(type_fase == 'voto'){
          
          let icp = 0;
          for(let nc in tablero){
          //for (let i = 0; i < req.body.tablero.length; i++) {
            let icp2 = 0;
            icp = icp + 1;
            
            for(let ncp in tablero[nc].data){
              
              icp2 = icp2 + 1;
    
              let idcp = tablero[nc].data[ncp].id;
              let proyectos_notas = {
                  votos: tablero[nc].data[ncp].votos,
                  seleccionado: tablero[nc].data[ncp].seleccionado,
                  detalle: JSON.stringify(tablero[nc].data[ncp].detalle),
                  position: tablero[nc].data[ncp].position,
                  dragPosition: JSON.stringify(tablero[nc].data[ncp].dragPosition)
                };

              ScopeCanvasPropositos.update(proyectos_notas, {
                where: { id: idcp }
              })
                .then(num2 => {
                  if (num2 == 1 && icp == tablero.length && icp2 == tablero[nc].data.length) {
                    res.send({
                      message: `Proyecto with id=${id} was updated successfully.`
                    });
                  }
                }).catch(err => {
                  res.status(500).send({
                  message: "Error creating ProyectoRecurso Propositos Voto"+err.message
                  });
              });

            }
          }

        }else{
          res.send({
            message: `Proyecto with id=${id} was updated successfully.`
          });
        }

      } else {
        res.send({
          message: `Cannot update Proyectos with id=${id}. Maybe Proyectos was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Proyectos with id=" + id
      });
    });
};

// Create objetivos the Proyectos by the id in the request
exports.createObjetivos = (req, res) => {
  
  let objetivo = {
                  contenido: req.body.content,
                  tipo: req.body.type,
                  position: null,
                  dragPosition: JSON.stringify({x: 0, y: 0})
                };

          ScopeCanvasObjetivos.create(objetivo).then(nec =>{
                  
                let proyecto_recurso = {'proyecto_id': req.body.proyecto_id, 'scopecanvas_objetivos_id': nec.dataValues.id, 'usuario_id': req.body.usuario_id };

                ProyectoRecurso.create(proyecto_recurso).then(pr =>{
                    res.send({
                      message: `Proyecto with id=${req.body.proyecto_id} was updated successfully.`, objetivo_id: nec.dataValues.id
                    });
    
                }).catch(err => {
                    res.status(500).send({
                    message: "Error creating ProyectoRecurso"
                    });
                });
  
            }).catch(err => {
                res.status(500).send({
                message: "Error creating Objetivos"
                });
            });
};

// Update etapa objetivos the Proyectos by the id in the request
exports.updateEtapaObjetivos = (req, res) => {
  const id = req.params.id;
  let proyectos = {
      etapa_activa: req.body.etapa_activa
    };
   
  let type_fase = req.body.type;
  let tablero = req.body.tablero;
  let objetivos = [];

  Proyectos.update(proyectos, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {

        /*Verificamos que fase guardar*/
        if(type_fase == 'notas'){
          let i = 0;
          let position = 0;
          for(let n in tablero){
          //for (let i = 0; i < req.body.tablero.length; i++) {
            if(tablero[n].id > 0){

              let objetivo = {
                  contenido: tablero[n].content,
                  tipo: tablero[n].type,
                  position: position
                };

              ScopeCanvasObjetivos.update(objetivo, {
                where: { id: tablero[n].id }
              })
                .then(num3 => {
                  
                }).catch(err => {
                  res.status(500).send({
                  message: "Error updating ProyectoRecurso Objetivos with id"+tablero[n].id
                  });
                });
              
            }else{
              objetivos.push({'contenido': tablero[n].content,'tipo': tablero[n].type, position: position, dragPosition: JSON.stringify({x: 0, y: 0})});
            }
            position = position + 1;
          }

          let proyecto_recurso = [];

          if(objetivos.length > 0){
          
          ScopeCanvasObjetivos.bulkCreate(objetivos).then(nec =>{
                  console.log('objetivos',nec);
                  for(let c in nec){
                    proyecto_recurso.push({'proyecto_id': id, 'scopecanvas_objetivos_id': nec[c].dataValues.id, 'usuario_id': tablero[c].usuario_id });
                  }

                ProyectoRecurso.bulkCreate(proyecto_recurso).then(pr =>{
                    res.send({
                      message: `Proyecto with id=${id} was updated successfully.`
                    });
    
                }).catch(err => {
                    res.status(500).send({
                    message: "Error creating ProyectoRecurso"
                    });
                });
  
            }).catch(err => {
                res.status(500).send({
                message: "Error creating Objetivos"
                });
            });
          
          }else{
            res.send({
              message: `Proyecto with id=${id} was updated successfully.`
            });
          }
       }else{
          res.send({
            message: `Proyecto with id=${id} was updated successfully.`
          });
        }

      } else {
        res.send({
          message: `Cannot update Proyectos with id=${id}. Maybe Proyectos was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Proyectos with id=" + id
      });
    });
};

// Create acciones the Proyectos by the id in the request
exports.createAcciones = (req, res) => {
  
  let accion = {
                  contenido: req.body.content,
                  position: null,
                  dragPosition: JSON.stringify({x: 0, y: 0})
                };

          ScopeCanvasAcciones.create(accion).then(nec =>{
                  
                let proyecto_recurso = {'proyecto_id': req.body.proyecto_id, 'scopecanvas_acciones_id': nec.dataValues.id, 'usuario_id': req.body.usuario_id };

                ProyectoRecurso.create(proyecto_recurso).then(pr =>{
                    res.send({
                      message: `Proyecto with id=${req.body.proyecto_id} was updated successfully.`, accion_id: nec.dataValues.id
                    });
    
                }).catch(err => {
                    res.status(500).send({
                    message: "Error creating ProyectoRecurso"
                    });
                });
  
            }).catch(err => {
                res.status(500).send({
                message: "Error creating Acciones"
                });
            });
};

// Update etapa acciones the Proyectos by the id in the request
exports.updateEtapaAcciones = (req, res) => {
  const id = req.params.id;
  let proyectos = {
      etapa_activa: req.body.etapa_activa
    };
   
  let type_fase = req.body.type;
  let tablero = req.body.tablero;
  let acciones = [];

  Proyectos.update(proyectos, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {

        /*Verificamos que fase guardar*/
        if(type_fase == 'notas'){
          let i = 0;
          let position = 0;
          for(let n in tablero){
          //for (let i = 0; i < req.body.tablero.length; i++) {
            if(tablero[n].id > 0){

              let accion = {
                  contenido: tablero[n].content,
                  position: position
                };

              ScopeCanvasAcciones.update(accion, {
                where: { id: tablero[n].id }
              })
                .then(num3 => {
                  
                }).catch(err => {
                  res.status(500).send({
                  message: "Error updating ProyectoRecurso Acciones with id"+tablero[n].id
                  });
                });
              
            }else{
              acciones.push({'contenido': tablero[n].content, position: position, dragPosition: JSON.stringify({x: 0, y: 0})});
            }
            position = position + 1;
          }

          let proyecto_recurso = [];

          if(acciones.length > 0){
          
          ScopeCanvasAcciones.bulkCreate(acciones).then(nec =>{
                  console.log('acciones',nec);
                  for(let c in nec){
                    proyecto_recurso.push({'proyecto_id': id, 'scopecanvas_acciones_id': nec[c].dataValues.id, 'usuario_id': tablero[c].usuario_id });
                  }

                ProyectoRecurso.bulkCreate(proyecto_recurso).then(pr =>{
                    res.send({
                      message: `Proyecto with id=${id} was updated successfully.`
                    });
    
                }).catch(err => {
                    res.status(500).send({
                    message: "Error creating ProyectoRecurso"
                    });
                });
  
            }).catch(err => {
                res.status(500).send({
                message: "Error creating Acciones"
                });
            });
          
          }else{
            res.send({
              message: `Proyecto with id=${id} was updated successfully.`
            });
          }
       }else{
          res.send({
            message: `Proyecto with id=${id} was updated successfully.`
          });
        }

      } else {
        res.send({
          message: `Cannot update Proyectos with id=${id}. Maybe Proyectos was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Proyectos with id=" + id
      });
    });
};

// Create metricas the Proyectos by the id in the request
exports.createMetricas = (req, res) => {
  
  let metrica = {
                  contenido: req.body.content,
                  position: null,
                  dragPosition: JSON.stringify({x: 0, y: 0})
                };

          ScopeCanvasMetricas.create(metrica).then(nec =>{
                  
                let proyecto_recurso = {'proyecto_id': req.body.proyecto_id, 'scopecanvas_metricas_id': nec.dataValues.id, 'usuario_id': req.body.usuario_id };

                ProyectoRecurso.create(proyecto_recurso).then(pr =>{
                    res.send({
                      message: `Proyecto with id=${req.body.proyecto_id} was updated successfully.`, metrica_id: nec.dataValues.id
                    });
    
                }).catch(err => {
                    res.status(500).send({
                    message: "Error creating ProyectoRecurso"
                    });
                });
  
            }).catch(err => {
                res.status(500).send({
                message: "Error creating Metricas"
                });
            });
};

// Update etapa metricas the Proyectos by the id in the request
exports.updateEtapaMetricas = (req, res) => {
  const id = req.params.id;
  let proyectos = {
      etapa_activa: req.body.etapa_activa
    };
   
  let type_fase = req.body.type;
  let tablero = req.body.tablero;
  let metricas = [];

  Proyectos.update(proyectos, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {

        /*Verificamos que fase guardar*/
        if(type_fase == 'notas'){
          let i = 0;
          let position = 0;
          for(let n in tablero){
          //for (let i = 0; i < req.body.tablero.length; i++) {
            if(tablero[n].id > 0){

              let metrica = {
                  contenido: tablero[n].content,
                  position: position
                };

              ScopeCanvasMetricas.update(metrica, {
                where: { id: tablero[n].id }
              })
                .then(num3 => {
                  
                }).catch(err => {
                  res.status(500).send({
                  message: "Error updating ProyectoRecurso Metricas with id"+tablero[n].id
                  });
                });
              
            }else{
              metricas.push({'contenido': tablero[n].content, position: position, dragPosition: JSON.stringify({x: 0, y: 0})});
            }
            position = position + 1;
          }

          let proyecto_recurso = [];

          if(metricas.length > 0){
          
          ScopeCanvasMetricas.bulkCreate(metricas).then(nec =>{
                  console.log('metricas',nec);
                  for(let c in nec){
                    proyecto_recurso.push({'proyecto_id': id, 'scopecanvas_metricas_id': nec[c].dataValues.id, 'usuario_id': tablero[c].usuario_id });
                  }

                ProyectoRecurso.bulkCreate(proyecto_recurso).then(pr =>{
                    res.send({
                      message: `Proyecto with id=${id} was updated successfully.`
                    });
    
                }).catch(err => {
                    res.status(500).send({
                    message: "Error creating ProyectoRecurso"
                    });
                });
  
            }).catch(err => {
                res.status(500).send({
                message: "Error creating Acciones"
                });
            });
          
          }else{
            res.send({
              message: `Proyecto with id=${id} was updated successfully.`
            });
          }
       }else{
          res.send({
            message: `Proyecto with id=${id} was updated successfully.`
          });
        }

      } else {
        res.send({
          message: `Cannot update Proyectos with id=${id}. Maybe Proyectos was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Proyectos with id=" + id
      });
    });
};


// Create problema the Proyectos by the id in the request
exports.createProblema = (req, res) => {
  
  let problema = {
                  contenido: req.body.content,
                  position: null,
                  dragPosition: JSON.stringify({x: 0, y: 0})
                };

          LeanCanvasProblema.create(problema).then(nec =>{
                  
                let proyecto_recurso = {'proyecto_id': req.body.proyecto_id, 'leancanvas_problema_id': nec.dataValues.id, 'usuario_id': req.body.usuario_id };

                ProyectoRecurso.create(proyecto_recurso).then(pr =>{
                    res.send({
                      message: `Proyecto with id=${req.body.proyecto_id} was updated successfully.`, problema_id: nec.dataValues.id
                    });
    
                }).catch(err => {
                    res.status(500).send({
                    message: "Error creating ProyectoRecurso"
                    });
                });
  
            }).catch(err => {
                res.status(500).send({
                message: "Error creating Problema"
                });
            });
};

// Update etapa problema the Proyectos by the id in the request
exports.updateEtapaProblema = (req, res) => {
  const id = req.params.id;
  let proyectos = {
      etapa_activa: req.body.etapa_activa
    };
   
  let type_fase = req.body.type;
  let tablero = req.body.tablero;
  let problema = [];

  Proyectos.update(proyectos, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {

        /*Verificamos que fase guardar*/
        if(type_fase == 'notas'){
          let i = 0;
          let position = 0;
          for(let n in tablero){
          //for (let i = 0; i < req.body.tablero.length; i++) {
            if(tablero[n].id > 0){

              let problem = {
                  contenido: tablero[n].content,
                  position: position
                };

              LeanCanvasProblema.update(problem, {
                where: { id: tablero[n].id }
              })
                .then(num3 => {
                  
                }).catch(err => {
                  res.status(500).send({
                  message: "Error updating ProyectoRecurso Problema with id"+tablero[n].id
                  });
                });
              
            }else{
              problema.push({'contenido': tablero[n].content, position: position,
              dragPosition: JSON.stringify({x: 0, y: 0})});
            }

            position = position + 1;
          }

          let proyecto_recurso = [];

          if(problema.length > 0){
          
          LeanCanvasProblema.bulkCreate(problema).then(nec =>{
                  console.log('problema',nec);
                  for(let c in nec){
                    proyecto_recurso.push({'proyecto_id': id, 'leancanvas_problema_id': nec[c].dataValues.id, 'usuario_id': tablero[c].usuario_id });
                  }

                ProyectoRecurso.bulkCreate(proyecto_recurso).then(pr =>{
                    res.send({
                      message: `Proyecto with id=${id} was updated successfully.`
                    });
    
                }).catch(err => {
                    res.status(500).send({
                    message: "Error creating ProyectoRecurso"
                    });
                });
  
            }).catch(err => {
                res.status(500).send({
                message: "Error creating Problema"
                });
            });
          
          }else{
            res.send({
              message: `Proyecto with id=${id} was updated successfully.`
            });
          }
       }else{
          res.send({
            message: `Proyecto with id=${id} was updated successfully.`
          });
        }

      } else {
        res.send({
          message: `Cannot update Proyectos with id=${id}. Maybe Proyectos was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Proyectos with id=" + id
      });
    });
};


// Create clientes the Proyectos by the id in the request
exports.createClientes = (req, res) => {
  
  let cliente = {
                  contenido: req.body.content,
                  position: null,
                  dragPosition: JSON.stringify({x: 0, y: 0})
                };

          LeanCanvasClientes.create(cliente).then(nec =>{
                  
                let proyecto_recurso = {'proyecto_id': req.body.proyecto_id, 'leancanvas_clientes_id': nec.dataValues.id, 'usuario_id': req.body.usuario_id };

                ProyectoRecurso.create(proyecto_recurso).then(pr =>{
                    res.send({
                      message: `Proyecto with id=${req.body.proyecto_id} was updated successfully.`, cliente_id: nec.dataValues.id
                    });
    
                }).catch(err => {
                    res.status(500).send({
                    message: "Error creating ProyectoRecurso"
                    });
                });
  
            }).catch(err => {
                res.status(500).send({
                message: "Error creating Clientes"
                });
            });
};

// Update etapa clientes the Proyectos by the id in the request
exports.updateEtapaClientes = (req, res) => {
  const id = req.params.id;
  let proyectos = {
      etapa_activa: req.body.etapa_activa
    };
   
  let type_fase = req.body.type;
  let tablero = req.body.tablero;
  let clientes = [];

  Proyectos.update(proyectos, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {

        /*Verificamos que fase guardar*/
        if(type_fase == 'notas'){
          let i = 0;
          let position = 0;
          for(let n in tablero){
          //for (let i = 0; i < req.body.tablero.length; i++) {
            if(tablero[n].id > 0){

              let cliente = {
                  contenido: tablero[n].content,
                  position: position
                };

              LeanCanvasClientes.update(cliente, {
                where: { id: tablero[n].id }
              })
                .then(num3 => {
                  
                }).catch(err => {
                  res.status(500).send({
                  message: "Error updating ProyectoRecurso Clientes with id"+tablero[n].id
                  });
                });
              
            }else{
              clientes.push({'contenido': tablero[n].content, position: position,
              dragPosition: JSON.stringify({x: 0, y: 0})});
            }

            position = position + 1;
          }

          let proyecto_recurso = [];

          if(clientes.length > 0){
          
          LeanCanvasClientes.bulkCreate(clientes).then(nec =>{
                  console.log('clientes',nec);
                  for(let c in nec){
                    proyecto_recurso.push({'proyecto_id': id, 'leancanvas_clientes_id': nec[c].dataValues.id, 'usuario_id': tablero[c].usuario_id });
                  }

                ProyectoRecurso.bulkCreate(proyecto_recurso).then(pr =>{
                    res.send({
                      message: `Proyecto with id=${id} was updated successfully.`
                    });
    
                }).catch(err => {
                    res.status(500).send({
                    message: "Error creating ProyectoRecurso"
                    });
                });
  
            }).catch(err => {
                res.status(500).send({
                message: "Error creating Clientes"
                });
            });
          
          }else{
            res.send({
              message: `Proyecto with id=${id} was updated successfully.`
            });
          }
       }else{
          res.send({
            message: `Proyecto with id=${id} was updated successfully.`
          });
        }

      } else {
        res.send({
          message: `Cannot update Proyectos with id=${id}. Maybe Proyectos was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Proyectos with id=" + id
      });
    });
};


// Create solucion the Proyectos by the id in the request
exports.createSolucion = (req, res) => {
  
  let solucion = {
                  contenido: req.body.content,
                  position: null,
                  dragPosition: JSON.stringify({x: 0, y: 0})
                };

          LeanCanvasSolucion.create(solucion).then(nec =>{
                  
                let proyecto_recurso = {'proyecto_id': req.body.proyecto_id, 'leancanvas_solucion_id': nec.dataValues.id, 'usuario_id': req.body.usuario_id };

                ProyectoRecurso.create(proyecto_recurso).then(pr =>{
                    res.send({
                      message: `Proyecto with id=${req.body.proyecto_id} was updated successfully.`, solucion_id: nec.dataValues.id
                    });
    
                }).catch(err => {
                    res.status(500).send({
                    message: "Error creating ProyectoRecurso"
                    });
                });
  
            }).catch(err => {
                res.status(500).send({
                message: "Error creating Solucion"
                });
            });
};

// Update etapa solucion the Proyectos by the id in the request
exports.updateEtapaSolucion = (req, res) => {
  const id = req.params.id;
  let proyectos = {
      etapa_activa: req.body.etapa_activa
    };
   
  let type_fase = req.body.type;
  let tablero = req.body.tablero;
  let solucion = [];

  Proyectos.update(proyectos, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {

        /*Verificamos que fase guardar*/
        if(type_fase == 'notas'){
          let i = 0;
          let position = 0;
          for(let n in tablero){
          //for (let i = 0; i < req.body.tablero.length; i++) {
            if(tablero[n].id > 0){

              let solucio = {
                  contenido: tablero[n].content,
                  position: position
                };

              LeanCanvasSolucion.update(solucio, {
                where: { id: tablero[n].id }
              })
                .then(num3 => {
                  
                }).catch(err => {
                  res.status(500).send({
                  message: "Error updating ProyectoRecurso Solucion with id"+tablero[n].id
                  });
                });
              
            }else{
              solucion.push({'contenido': tablero[n].content, position: position,
              dragPosition: JSON.stringify({x: 0, y: 0})});
            }

            position = position + 1;
          }

          let proyecto_recurso = [];

          if(solucion.length > 0){
          
          LeanCanvasSolucion.bulkCreate(solucion).then(nec =>{
                  console.log('solucion',nec);
                  for(let c in nec){
                    proyecto_recurso.push({'proyecto_id': id, 'leancanvas_solucion_id': nec[c].dataValues.id, 'usuario_id': tablero[c].usuario_id });
                  }

                ProyectoRecurso.bulkCreate(proyecto_recurso).then(pr =>{
                    res.send({
                      message: `Proyecto with id=${id} was updated successfully.`
                    });
    
                }).catch(err => {
                    res.status(500).send({
                    message: "Error creating ProyectoRecurso"
                    });
                });
  
            }).catch(err => {
                res.status(500).send({
                message: "Error creating Solucion"
                });
            });
          
          }else{
            res.send({
              message: `Proyecto with id=${id} was updated successfully.`
            });
          }
       }else{
          res.send({
            message: `Proyecto with id=${id} was updated successfully.`
          });
        }

      } else {
        res.send({
          message: `Cannot update Proyectos with id=${id}. Maybe Proyectos was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Proyectos with id=" + id
      });
    });
};


// Create metricas clave the Proyectos by the id in the request
exports.createMetricasClave = (req, res) => {
  
  let metricas_clave = {
                  contenido: req.body.content,
                  position: null,
                  dragPosition: JSON.stringify({x: 0, y: 0})
                };

          LeanCanvasMetricasClave.create(metricas_clave).then(nec =>{
                  
                let proyecto_recurso = {'proyecto_id': req.body.proyecto_id, 'leancanvas_metricas_clave_id': nec.dataValues.id, 'usuario_id': req.body.usuario_id };

                ProyectoRecurso.create(proyecto_recurso).then(pr =>{
                    res.send({
                      message: `Proyecto with id=${req.body.proyecto_id} was updated successfully.`, metricas_clave_id: nec.dataValues.id
                    });
    
                }).catch(err => {
                    res.status(500).send({
                    message: "Error creating ProyectoRecurso"
                    });
                });
  
            }).catch(err => {
                res.status(500).send({
                message: "Error creating Metricas Clave"
                });
            });
};

// Update etapa metricas_clave the Proyectos by the id in the request
exports.updateEtapaMetricasClave = (req, res) => {
  const id = req.params.id;
  let proyectos = {
      etapa_activa: req.body.etapa_activa
    };
   
  let type_fase = req.body.type;
  let tablero = req.body.tablero;
  let metricas_clave = [];

  Proyectos.update(proyectos, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {

        /*Verificamos que fase guardar*/
        if(type_fase == 'notas'){
          let i = 0;
          let position = 0;
          for(let n in tablero){
          //for (let i = 0; i < req.body.tablero.length; i++) {
            if(tablero[n].id > 0){

              let metrica_clave = {
                  contenido: tablero[n].content,
                  position: position
                };

              LeanCanvasMetricasClave.update(metrica_clave, {
                where: { id: tablero[n].id }
              })
                .then(num3 => {
                  
                }).catch(err => {
                  res.status(500).send({
                  message: "Error updating ProyectoRecurso Metricas Clave with id"+tablero[n].id
                  });
                });
              
            }else{
              metricas_clave.push({'contenido': tablero[n].content, position: position, dragPosition: JSON.stringify({x: 0, y: 0})});
            }

            position = position + 1;
          }

          let proyecto_recurso = [];

          if(metricas_clave.length > 0){
          
          LeanCanvasMetricasClave.bulkCreate(metricas_clave).then(nec =>{
                  console.log('metricas_clave',nec);
                  for(let c in nec){
                    proyecto_recurso.push({'proyecto_id': id, 'leancanvas_metricas_clave_id': nec[c].dataValues.id, 'usuario_id': tablero[c].usuario_id });
                  }

                ProyectoRecurso.bulkCreate(proyecto_recurso).then(pr =>{
                    res.send({
                      message: `Proyecto with id=${id} was updated successfully.`
                    });
    
                }).catch(err => {
                    res.status(500).send({
                    message: "Error creating ProyectoRecurso"
                    });
                });
  
            }).catch(err => {
                res.status(500).send({
                message: "Error creating Metricas clave"
                });
            });
          
          }else{
            res.send({
              message: `Proyecto with id=${id} was updated successfully.`
            });
          }
       }else{
          res.send({
            message: `Proyecto with id=${id} was updated successfully.`
          });
        }

      } else {
        res.send({
          message: `Cannot update Proyectos with id=${id}. Maybe Proyectos was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Proyectos with id=" + id
      });
    });
};


// Create propuesta the Proyectos by the id in the request
exports.createPropuesta = (req, res) => {
  
  let propuesta = {
                  contenido: req.body.content,
                  position: null,
                  dragPosition: JSON.stringify({x: 0, y: 0})
                };

          LeanCanvasPropuesta.create(propuesta).then(nec =>{
                  
                let proyecto_recurso = {'proyecto_id': req.body.proyecto_id, 'leancanvas_propuesta_id': nec.dataValues.id, 'usuario_id': req.body.usuario_id };

                ProyectoRecurso.create(proyecto_recurso).then(pr =>{
                    res.send({
                      message: `Proyecto with id=${req.body.proyecto_id} was updated successfully.`, propuesta_id: nec.dataValues.id
                    });
    
                }).catch(err => {
                    res.status(500).send({
                    message: "Error creating ProyectoRecurso"
                    });
                });
  
            }).catch(err => {
                res.status(500).send({
                message: "Error creating propuesta"
                });
            });
};

// Update etapa propuesta the Proyectos by the id in the request
exports.updateEtapaPropuesta = (req, res) => {
  const id = req.params.id;
  let proyectos = {
      etapa_activa: req.body.etapa_activa
    };
   
  let type_fase = req.body.type;
  let tablero = req.body.tablero;
  let propuesta = [];

  Proyectos.update(proyectos, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {

        /*Verificamos que fase guardar*/
        if(type_fase == 'notas'){
          let i = 0;
          let position = 0;
          for(let n in tablero){
          //for (let i = 0; i < req.body.tablero.length; i++) {
            if(tablero[n].id > 0){

              let solucio = {
                  contenido: tablero[n].content,
                  position: position
                };

              LeanCanvasPropuesta.update(solucio, {
                where: { id: tablero[n].id }
              })
                .then(num3 => {
                  
                }).catch(err => {
                  res.status(500).send({
                  message: "Error updating ProyectoRecurso Propuesta with id"+tablero[n].id
                  });
                });
              
            }else{
              propuesta.push({'contenido': tablero[n].content, position: position,
              dragPosition: JSON.stringify({x: 0, y: 0})});
            }

            position = position + 1;
          }

          let proyecto_recurso = [];

          if(propuesta.length > 0){
          
          LeanCanvasPropuesta.bulkCreate(propuesta).then(nec =>{
                  console.log('propuesta',nec);
                  for(let c in nec){
                    proyecto_recurso.push({'proyecto_id': id, 'leancanvas_propuesta_id': nec[c].dataValues.id, 'usuario_id': tablero[c].usuario_id });
                  }

                ProyectoRecurso.bulkCreate(proyecto_recurso).then(pr =>{
                    res.send({
                      message: `Proyecto with id=${id} was updated successfully.`
                    });
    
                }).catch(err => {
                    res.status(500).send({
                    message: "Error creating ProyectoRecurso"
                    });
                });
  
            }).catch(err => {
                res.status(500).send({
                message: "Error creating Propuesta"
                });
            });
          
          }else{
            res.send({
              message: `Proyecto with id=${id} was updated successfully.`
            });
          }
       }else{
          res.send({
            message: `Proyecto with id=${id} was updated successfully.`
          });
        }

      } else {
        res.send({
          message: `Cannot update Proyectos with id=${id}. Maybe Proyectos was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Proyectos with id=" + id
      });
    });
};

// Create ventajas the Proyectos by the id in the request
exports.createVentajas = (req, res) => {
  
  let ventajas = {
                  contenido: req.body.content,
                  position: null,
                  dragPosition: JSON.stringify({x: 0, y: 0})
                };

          LeanCanvasVentajas.create(ventajas).then(nec =>{
                  
                let proyecto_recurso = {'proyecto_id': req.body.proyecto_id, 'leancanvas_ventajas_id': nec.dataValues.id, 'usuario_id': req.body.usuario_id };

                ProyectoRecurso.create(proyecto_recurso).then(pr =>{
                    res.send({
                      message: `Proyecto with id=${req.body.proyecto_id} was updated successfully.`, ventajas_id: nec.dataValues.id
                    });
    
                }).catch(err => {
                    res.status(500).send({
                    message: "Error creating ProyectoRecurso"
                    });
                });
  
            }).catch(err => {
                res.status(500).send({
                message: "Error creating Ventajas"
                });
            });
};

// Update etapa ventajas the Proyectos by the id in the request
exports.updateEtapaVentajas = (req, res) => {
  const id = req.params.id;
  let proyectos = {
      etapa_activa: req.body.etapa_activa
    };
   
  let type_fase = req.body.type;
  let tablero = req.body.tablero;
  let ventajas = [];

  Proyectos.update(proyectos, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {

        /*Verificamos que fase guardar*/
        if(type_fase == 'notas'){
          let i = 0;
          let position = 0;
          for(let n in tablero){
          //for (let i = 0; i < req.body.tablero.length; i++) {
            if(tablero[n].id > 0){

              let solucio = {
                  contenido: tablero[n].content,
                  position: position
                };

              LeanCanvasVentajas.update(solucio, {
                where: { id: tablero[n].id }
              })
                .then(num3 => {
                  
                }).catch(err => {
                  res.status(500).send({
                  message: "Error updating ProyectoRecurso Ventajas with id"+tablero[n].id
                  });
                });
              
            }else{
              ventajas.push({'contenido': tablero[n].content, position: position,
              dragPosition: JSON.stringify({x: 0, y: 0})});
            }

            position = position + 1;
          }

          let proyecto_recurso = [];

          if(ventajas.length > 0){
          
          LeanCanvasVentajas.bulkCreate(ventajas).then(nec =>{
                  console.log('ventajas',nec);
                  for(let c in nec){
                    proyecto_recurso.push({'proyecto_id': id, 'leancanvas_ventajas_id': nec[c].dataValues.id, 'usuario_id': tablero[c].usuario_id });
                  }

                ProyectoRecurso.bulkCreate(proyecto_recurso).then(pr =>{
                    res.send({
                      message: `Proyecto with id=${id} was updated successfully.`
                    });
    
                }).catch(err => {
                    res.status(500).send({
                    message: "Error creating ProyectoRecurso"
                    });
                });
  
            }).catch(err => {
                res.status(500).send({
                message: "Error creating Ventajas"
                });
            });
          
          }else{
            res.send({
              message: `Proyecto with id=${id} was updated successfully.`
            });
          }
       }else{
          res.send({
            message: `Proyecto with id=${id} was updated successfully.`
          });
        }

      } else {
        res.send({
          message: `Cannot update Proyectos with id=${id}. Maybe Proyectos was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Proyectos with id=" + id
      });
    });
};

// Create canales the Proyectos by the id in the request
exports.createCanales = (req, res) => {
  
  let canales = {
                  contenido: req.body.content,
                  position: null,
                  dragPosition: JSON.stringify({x: 0, y: 0})
                };

          LeanCanvasCanales.create(canales).then(nec =>{
                  
                let proyecto_recurso = {'proyecto_id': req.body.proyecto_id, 'leancanvas_canales_id': nec.dataValues.id, 'usuario_id': req.body.usuario_id };

                ProyectoRecurso.create(proyecto_recurso).then(pr =>{
                    res.send({
                      message: `Proyecto with id=${req.body.proyecto_id} was updated successfully.`, canales_id: nec.dataValues.id
                    });
    
                }).catch(err => {
                    res.status(500).send({
                    message: "Error creating ProyectoRecurso"
                    });
                });
  
            }).catch(err => {
                res.status(500).send({
                message: "Error creating Canales"
                });
            });
};

// Update etapa canales the Proyectos by the id in the request
exports.updateEtapaCanales = (req, res) => {
  const id = req.params.id;
  let proyectos = {
      etapa_activa: req.body.etapa_activa
    };
   
  let type_fase = req.body.type;
  let tablero = req.body.tablero;
  let canales = [];

  Proyectos.update(proyectos, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {

        /*Verificamos que fase guardar*/
        if(type_fase == 'notas'){
          let i = 0;
          let position = 0;
          for(let n in tablero){
          //for (let i = 0; i < req.body.tablero.length; i++) {
            if(tablero[n].id > 0){

              let solucio = {
                  contenido: tablero[n].content,
                  position: position
                };

              LeanCanvasCanales.update(solucio, {
                where: { id: tablero[n].id }
              })
                .then(num3 => {
                  
                }).catch(err => {
                  res.status(500).send({
                  message: "Error updating ProyectoRecurso Canales with id"+tablero[n].id
                  });
                });
              
            }else{
              canales.push({'contenido': tablero[n].content, position: position,
              dragPosition: JSON.stringify({x: 0, y: 0})});
            }

            position = position + 1;
          }

          let proyecto_recurso = [];

          if(canales.length > 0){
          
          LeanCanvasCanales.bulkCreate(canales).then(nec =>{
                  console.log('canales',nec);
                  for(let c in nec){
                    proyecto_recurso.push({'proyecto_id': id, 'leancanvas_canales_id': nec[c].dataValues.id, 'usuario_id': tablero[c].usuario_id });
                  }

                ProyectoRecurso.bulkCreate(proyecto_recurso).then(pr =>{
                    res.send({
                      message: `Proyecto with id=${id} was updated successfully.`
                    });
    
                }).catch(err => {
                    res.status(500).send({
                    message: "Error creating ProyectoRecurso"
                    });
                });
  
            }).catch(err => {
                res.status(500).send({
                message: "Error creating Canales"
                });
            });
          
          }else{
            res.send({
              message: `Proyecto with id=${id} was updated successfully.`
            });
          }
       }else{
          res.send({
            message: `Proyecto with id=${id} was updated successfully.`
          });
        }

      } else {
        res.send({
          message: `Cannot update Proyectos with id=${id}. Maybe Proyectos was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Proyectos with id=" + id
      });
    });
};


// Create estructura the Proyectos by the id in the request
exports.createEstructura = (req, res) => {
  
  let estructura = {
                  contenido: req.body.content,
                  position: null,
                  dragPosition: JSON.stringify({x: 0, y: 0})
                };

          LeanCanvasEstructura.create(estructura).then(nec =>{
                  
                let proyecto_recurso = {'proyecto_id': req.body.proyecto_id, 'leancanvas_estructura_id': nec.dataValues.id, 'usuario_id': req.body.usuario_id };

                ProyectoRecurso.create(proyecto_recurso).then(pr =>{
                    res.send({
                      message: `Proyecto with id=${req.body.proyecto_id} was updated successfully.`, estructura_id: nec.dataValues.id
                    });
    
                }).catch(err => {
                    res.status(500).send({
                    message: "Error creating ProyectoRecurso"
                    });
                });
  
            }).catch(err => {
                res.status(500).send({
                message: "Error creating Estructura"
                });
            });
};

// Update etapa estructura the Proyectos by the id in the request
exports.updateEtapaEstructura = (req, res) => {
  const id = req.params.id;
  let proyectos = {
      etapa_activa: req.body.etapa_activa
    };
   
  let type_fase = req.body.type;
  let tablero = req.body.tablero;
  let estructura = [];

  Proyectos.update(proyectos, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {

        /*Verificamos que fase guardar*/
        if(type_fase == 'notas'){
          let i = 0;
          let position = 0;
          for(let n in tablero){
          //for (let i = 0; i < req.body.tablero.length; i++) {
            if(tablero[n].id > 0){

              let solucio = {
                  contenido: tablero[n].content,
                  position: position
                };

              LeanCanvasEstructura.update(solucio, {
                where: { id: tablero[n].id }
              })
                .then(num3 => {
                  
                }).catch(err => {
                  res.status(500).send({
                  message: "Error updating ProyectoRecurso Estructura with id"+tablero[n].id
                  });
                });
              
            }else{
              estructura.push({'contenido': tablero[n].content, position: position,
              dragPosition: JSON.stringify({x: 0, y: 0})});
            }

            position = position + 1;
          }

          let proyecto_recurso = [];

          if(estructura.length > 0){
          
          LeanCanvasEstructura.bulkCreate(estructura).then(nec =>{
                  console.log('estructura',nec);
                  for(let c in nec){
                    proyecto_recurso.push({'proyecto_id': id, 'leancanvas_estructura_id': nec[c].dataValues.id, 'usuario_id': tablero[c].usuario_id });
                  }

                ProyectoRecurso.bulkCreate(proyecto_recurso).then(pr =>{
                    res.send({
                      message: `Proyecto with id=${id} was updated successfully.`
                    });
    
                }).catch(err => {
                    res.status(500).send({
                    message: "Error creating ProyectoRecurso"
                    });
                });
  
            }).catch(err => {
                res.status(500).send({
                message: "Error creating Estructura"
                });
            });
          
          }else{
            res.send({
              message: `Proyecto with id=${id} was updated successfully.`
            });
          }
       }else{
          res.send({
            message: `Proyecto with id=${id} was updated successfully.`
          });
        }

      } else {
        res.send({
          message: `Cannot update Proyectos with id=${id}. Maybe Proyectos was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Proyectos with id=" + id
      });
    });
};

// Create flujo the Proyectos by the id in the request
exports.createFlujo = (req, res) => {
  
  let flujo = {
                  contenido: req.body.content,
                  position: null,
                  dragPosition: JSON.stringify({x: 0, y: 0})
                };

          LeanCanvasFlujo.create(flujo).then(nec =>{
                  
                let proyecto_recurso = {'proyecto_id': req.body.proyecto_id, 'leancanvas_flujo_id': nec.dataValues.id, 'usuario_id': req.body.usuario_id };

                ProyectoRecurso.create(proyecto_recurso).then(pr =>{
                    res.send({
                      message: `Proyecto with id=${req.body.proyecto_id} was updated successfully.`, flujo_id: nec.dataValues.id
                    });
    
                }).catch(err => {
                    res.status(500).send({
                    message: "Error creating ProyectoRecurso"
                    });
                });
  
            }).catch(err => {
                res.status(500).send({
                message: "Error creating Flujo"
                });
            });
};

// Create mapa calor the Proyectos by the id in the request
exports.createMapaCalor = (req, res) => {
  
  let mapa_calor = {
                  contenido: req.body.content,
                  position: null,
                  dragPosition: JSON.stringify({x: 0, y: 0})
                };

          MapaCalor.create(mapa_calor).then(nec =>{
                  
                let proyecto_recurso = {'proyecto_id': req.body.proyecto_id, 'mapa_calor_id': nec.dataValues.id, 'usuario_id': req.body.usuario_id };

                ProyectoRecurso.create(proyecto_recurso).then(pr =>{
                    res.send({
                      message: `Proyecto with id=${req.body.proyecto_id} was updated successfully.`, mapa_calor_id: nec.dataValues.id
                    });
    
                }).catch(err => {
                    res.status(500).send({
                    message: "Error creating ProyectoRecurso"
                    });
                });
  
            }).catch(err => {
                res.status(500).send({
                message: "Error creating MapaCalor"
                });
            });
};

// Update etapa flujo the Proyectos by the id in the request
exports.updateEtapaFlujo = (req, res) => {
  const id = req.params.id;
  let proyectos = {
      etapa_activa: req.body.etapa_activa
    };
   
  let type_fase = req.body.type;
  let tablero = req.body.tablero;
  let flujo = [];

  Proyectos.update(proyectos, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {

        /*Verificamos que fase guardar*/
        if(type_fase == 'notas'){
          let i = 0;
          let position = 0;
          for(let n in tablero){
          //for (let i = 0; i < req.body.tablero.length; i++) {
            if(tablero[n].id > 0){

              let solucio = {
                  contenido: tablero[n].content,
                  position: position
                };

              LeanCanvasFlujo.update(solucio, {
                where: { id: tablero[n].id }
              })
                .then(num3 => {
                  
                }).catch(err => {
                  res.status(500).send({
                  message: "Error updating ProyectoRecurso Flujo with id"+tablero[n].id
                  });
                });
              
            }else{
              flujo.push({'contenido': tablero[n].content, position: position,
              dragPosition: JSON.stringify({x: 0, y: 0})});
            }

            position = position + 1;
          }

          let proyecto_recurso = [];

          if(flujo.length > 0){
          
          LeanCanvasFlujo.bulkCreate(flujo).then(nec =>{
                  console.log('flujo',nec);
                  for(let c in nec){
                    proyecto_recurso.push({'proyecto_id': id, 'leancanvas_flujo_id': nec[c].dataValues.id, 'usuario_id': tablero[c].usuario_id });
                  }

                ProyectoRecurso.bulkCreate(proyecto_recurso).then(pr =>{
                    res.send({
                      message: `Proyecto with id=${id} was updated successfully.`
                    });
    
                }).catch(err => {
                    res.status(500).send({
                    message: "Error creating ProyectoRecurso"
                    });
                });
  
            }).catch(err => {
                res.status(500).send({
                message: "Error creating Flujo"
                });
            });
          
          }else{
            res.send({
              message: `Proyecto with id=${id} was updated successfully.`
            });
          }
       }else{
          res.send({
            message: `Proyecto with id=${id} was updated successfully.`
          });
        }

      } else {
        res.send({
          message: `Cannot update Proyectos with id=${id}. Maybe Proyectos was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Proyectos with id=" + id
      });
    });
};

// Update etapa bosquejar the Proyectos by the id in the request
exports.updateEtapaBosquejar = (req, res) => {
  const id = req.params.id;
  let proyectos = {
      etapa_activa: req.body.etapa_activa
    };
   
  Proyectos.update(proyectos, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {

        res.send({
          message: `Proyecto with id=${id} was updated successfully.`
        });

      } else {
        res.send({
          message: `Cannot update Proyectos with id=${id}. Maybe Proyectos was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Proyectos with id=" + id
      });
    });
};

// Update etapa mapa calor the Proyectos by the id in the request
exports.updateEtapaMapaCalor = (req, res) => {
  const id = req.params.id;
  let proyectos = {
      etapa_activa: req.body.etapa_activa
    };
   
  let type_fase = req.body.type;
  let tablero = req.body.tablero;
  let mapa_calor = [];

  Proyectos.update(proyectos, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {

        /*Verificamos que fase guardar*/
        if(type_fase == 'notas'){
          let i = 0;
          let position = 0;
          for(let n in tablero){
          //for (let i = 0; i < req.body.tablero.length; i++) {
            if(tablero[n].id > 0){

              let solucio = {
                  contenido: tablero[n].content,
                  position: position
                };

              MapaCalor.update(solucio, {
                where: { id: tablero[n].id }
              })
                .then(num3 => {
                  
                }).catch(err => {
                  res.status(500).send({
                  message: "Error updating ProyectoRecurso MapaCalor with id"+tablero[n].id
                  });
                });
              
            }else{
              mapa_calor.push({'contenido': tablero[n].content, position: position,
              dragPosition: JSON.stringify({x: 0, y: 0})});
            }

            position = position + 1;
          }

          let proyecto_recurso = [];

          if(mapa_calor.length > 0){
          
          MapaCalor.bulkCreate(mapa_calor).then(nec =>{
                  console.log('mapa_calor',nec);
                  for(let c in nec){
                    proyecto_recurso.push({'proyecto_id': id, 'mapa_calor_id': nec[c].dataValues.id, 'usuario_id': tablero[c].usuario_id });
                  }

                ProyectoRecurso.bulkCreate(proyecto_recurso).then(pr =>{
                    res.send({
                      message: `Proyecto with id=${id} was updated successfully.`
                    });
    
                }).catch(err => {
                    res.status(500).send({
                    message: "Error creating ProyectoRecurso"
                    });
                });
  
            }).catch(err => {
                res.status(500).send({
                message: "Error creating MapaCalor"
                });
            });
          
          }else{
            res.send({
              message: `Proyecto with id=${id} was updated successfully.`
            });
          }
       }else{
          res.send({
            message: `Proyecto with id=${id} was updated successfully.`
          });
        }

      } else {
        res.send({
          message: `Cannot update Proyectos with id=${id}. Maybe Proyectos was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Proyectos with id=" + id
      });
    });
};

// Update the members of Proyectos by the id in the request
exports.updateMembers = (req, res) => {
  const id = req.params.id;

    for (let i = 0; i < req.body.invitados.length; i++) {

      EquiposUsuarios.create({
          usuario_id: req.body.invitados[i].existe == 1 ? req.body.invitados[i].id : null,
          correo: req.body.invitados[i].correo,
          rol: req.body.invitados[i].rol,
          participante: false,
          equipo_id: req.body.equipo_id,
          }).then(ep2 =>{
              if((i + 1) == req.body.invitados.length){
                  res.send({ message: "Members was registered successfully!"});
              }

          }).catch(err => {
              res.status(500).send({
              message: "Error creating Members"
              });
          });
    }

};

// Delete the member of Proyectos by the id in the request
exports.deleteMember = (req, res) => {
  const id = req.params.id;

  EquiposUsuarios.destroy({
    where: { id: id }
  })
    .then(num2 => {
      if (num2 == 1) {
          res.send({
              message: "Equipo Usuario was deleted successfully!"
            });
      } else {
        res.send({
          message: `Cannot delete Equipo Usuario Login with id=${id}. Maybe Proyectos was not found!`
        });
      }
    }).catch(err => {
      res.status(500).send({
        message: "Could not delete Equipo Usuario Login with id=" + id + ' | error:' + err.message
      });
    });

};

// Delete a Proyectos with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

                Proyectos.destroy({
                  where: { id: id }
                })
                  .then(num2 => {
                    if (num2 == 1) {
                        res.send({
                            message: "Proyectos was deleted successfully!"
                          });
                    } else {
                      res.send({
                        message: `Cannot delete Proyectos with id=${id}. Maybe Proyectos was not found!`
                      });
                    }
                  }).catch(err => {
                    res.status(500).send({
                      message: "Could not delete Proyectos with id=" + id + ' | error:' + err.message
                    });
                  });
};

// Delete a NotaCp with the specified id in the request
exports.deleteNotaCp = (req, res) => {
  const id = req.params.id;

  ProyectoRecurso.destroy({
    where: { notascp_id: id }
  })
    .then(num3 => {
      if (num3 == 1) {
        
        NotasCp.destroy({
          where: { id: id }
        })
          .then(num2 => {
            if (num2 == 1) {
                res.send({
                    message: "NotaCp was deleted successfully!"
                  });
            } else {
              res.send({
                message: `Cannot delete Nota Cp with id=${id}. Maybe NotaCp was not found!`
              });
            }
          }).catch(err => {
            res.status(500).send({
              message: "Could not delete NotaCp with id=" + id + ' | error:' + err.message
            });
          });

      } else {
        res.send({
          message: `Cannot delete Nota Cp Proyecto Recurso with id=${id}. Maybe NotaCp was not found!`
        });
      }
    }).catch(err => {
      res.status(500).send({
        message: "Could not delete NotaCp Proyecto Recurso with id=" + id + ' | error:' + err.message
      });
    });

                
};

// Delete a MetaLp with the specified id in the request
exports.deleteMetaLp = (req, res) => {
  const id = req.params.id;

  ProyectoRecurso.destroy({
    where: { metaslp_id: id }
  })
    .then(num3 => {
      if (num3 == 1) {
  
                MetasLp.destroy({
                  where: { id: id }
                })
                  .then(num2 => {
                    if (num2 == 1) {
                        res.send({
                            message: "MetaLp was deleted successfully!"
                          });
                    } else {
                      res.send({
                        message: `Cannot delete MetaLp with id=${id}. Maybe MetaLp was not found!`
                      });
                    }
                  }).catch(err => {
                    res.status(500).send({
                      message: "Could not delete MetaLp with id=" + id + ' | error:' + err.message
                    });
                  });
                } else {
                  res.send({
                    message: `Cannot delete Metas Lp Proyecto Recurso with id=${id}. Maybe Metas Lp was not found!`
                  });
                }
              }).catch(err => {
                res.status(500).send({
                  message: "Could not delete MetasLp Proyecto Recurso with id=" + id + ' | error:' + err.message
                });
              });
};

// Delete a PreguntaSprint with the specified id in the request
exports.deletePreguntaSprint = (req, res) => {
  const id = req.params.id;

  ProyectoRecurso.destroy({
    where: { preguntasprint_id: id }
  })
    .then(num3 => {
      if (num3 == 1) {
  
                PreguntaSprint.destroy({
                  where: { id: id }
                })
                  .then(num2 => {
                    if (num2 == 1) {
                        res.send({
                            message: "PreguntaSprint was deleted successfully!"
                          });
                    } else {
                      res.send({
                        message: `Cannot delete PreguntaSprint with id=${id}. Maybe PreguntaSprint was not found!`
                      });
                    }
                  }).catch(err => {
                    res.status(500).send({
                      message: "Could not delete PreguntaSprint with id=" + id + ' | error:' + err.message
                    });
                  });

                } else {
                  res.send({
                    message: `Cannot delete PreguntaSprint Proyecto Recurso with id=${id}. Maybe PreguntaSprint was not found!`
                  });
                }
              }).catch(err => {
                res.status(500).send({
                  message: "Could not delete PreguntaSprint Proyecto Recurso with id=" + id + ' | error:' + err.message
                });
              });
};

// Delete a necesidades with the specified id in the request
exports.deleteNecesidades = (req, res) => {
  const id = req.params.id;

  ProyectoRecurso.destroy({
    where: { scopecanvas_necesidades_id: id }
  })
    .then(num3 => {
      if (num3 == 1) {
  
                ScopeCanvasNecesidades.destroy({
                  where: { id: id }
                })
                  .then(num2 => {
                    if (num2 == 1) {
                        res.send({
                            message: "necesidades was deleted successfully!"
                          });
                    } else {
                      res.send({
                        message: `Cannot delete necesidades with id=${id}. Maybe necesidades was not found!`
                      });
                    }
                  }).catch(err => {
                    res.status(500).send({
                      message: "Could not delete necesidades with id=" + id + ' | error:' + err.message
                    });
                  }); 

                } else {
                  res.send({
                    message: `Cannot delete necesidades Proyecto Recurso with id=${id}. Maybe necesidades was not found!`
                  });
                }
              }).catch(err => {
                res.status(500).send({
                  message: "Could not delete necesidades Proyecto Recurso with id=" + id + ' | error:' + err.message
                });
              });
};

// Delete a Propositos with the specified id in the request
exports.deletePropositos = (req, res) => {
  const id = req.params.id;

  ProyectoRecurso.destroy({
    where: { scopecanvas_propositos_id: id }
  })
    .then(num3 => {
      if (num3 == 1) {
  
                ScopeCanvasPropositos.destroy({
                  where: { id: id }
                })
                  .then(num2 => {
                    if (num2 == 1) {
                        res.send({
                            message: "Propositos was deleted successfully!"
                          });
                    } else {
                      res.send({
                        message: `Cannot delete Propositos with id=${id}. Maybe Propositos was not found!`
                      });
                    }
                  }).catch(err => {
                    res.status(500).send({
                      message: "Could not delete Propositos with id=" + id + ' | error:' + err.message
                    });
                  });
                  

                } else {
                  res.send({
                    message: `Cannot delete Propositos Proyecto Recurso with id=${id}. Maybe Propositos was not found!`
                  });
                }
              }).catch(err => {
                res.status(500).send({
                  message: "Could not delete Propositos Proyecto Recurso with id=" + id + ' | error:' + err.message
                });
              });
};


// Delete a objetivos with the specified id in the request
exports.deleteObjetivos = (req, res) => {
  const id = req.params.id;

  ProyectoRecurso.destroy({
    where: { scopecanvas_objetivos_id: id }
  })
    .then(num3 => {
      if (num3 == 1) {
  
                ScopeCanvasObjetivos.destroy({
                  where: { id: id }
                })
                  .then(num2 => {
                    if (num2 == 1) {
                        res.send({
                            message: "Objetivos was deleted successfully!"
                          });
                    } else {
                      res.send({
                        message: `Cannot delete objetivos with id=${id}. Maybe objetivos was not found!`
                      });
                    }
                  }).catch(err => {
                    res.status(500).send({
                      message: "Could not delete objetivos with id=" + id + ' | error:' + err.message
                    });
                  });
                  

                } else {
                  res.send({
                    message: `Cannot delete Objetivos Proyecto Recurso with id=${id}. Maybe Objetivos was not found!`
                  });
                }
              }).catch(err => {
                res.status(500).send({
                  message: "Could not delete Objetivos Proyecto Recurso with id=" + id + ' | error:' + err.message
                });
              });
};

// Delete a acciones with the specified id in the request
exports.deleteAcciones = (req, res) => {
  const id = req.params.id;
  
  ProyectoRecurso.destroy({
    where: { scopecanvas_acciones_id: id }
  })
    .then(num3 => {
      if (num3 == 1) {
  

                ScopeCanvasAcciones.destroy({
                  where: { id: id }
                })
                  .then(num2 => {
                    if (num2 == 1) {
                        res.send({
                            message: "Acciones was deleted successfully!"
                          });
                    } else {
                      res.send({
                        message: `Cannot delete acciones with id=${id}. Maybe acciones was not found!`
                      });
                    }
                  }).catch(err => {
                    res.status(500).send({
                      message: "Could not delete acciones with id=" + id + ' | error:' + err.message
                    });
                  });
                  

                } else {
                  res.send({
                    message: `Cannot delete Acciones Proyecto Recurso with id=${id}. Maybe Acciones was not found!`
                  });
                }
              }).catch(err => {
                res.status(500).send({
                  message: "Could not delete Acciones Proyecto Recurso with id=" + id + ' | error:' + err.message
                });
              });
};

// Delete a metricas with the specified id in the request
exports.deleteMetricas = (req, res) => {
  const id = req.params.id;

  ProyectoRecurso.destroy({
    where: { scopecanvas_metricas_id: id }
  })
    .then(num3 => {
      if (num3 == 1) {
  
                ScopeCanvasMetricas.destroy({
                  where: { id: id }
                })
                  .then(num2 => {
                    if (num2 == 1) {
                        res.send({
                            message: "Metricas was deleted successfully!"
                          });
                    } else {
                      res.send({
                        message: `Cannot delete metricas with id=${id}. Maybe metricas was not found!`
                      });
                    }
                  }).catch(err => {
                    res.status(500).send({
                      message: "Could not delete metricas with id=" + id + ' | error:' + err.message
                    });
                  });

                } else {
                  res.send({
                    message: `Cannot delete Metricas Proyecto Recurso with id=${id}. Maybe Metricas was not found!`
                  });
                }
              }).catch(err => {
                res.status(500).send({
                  message: "Could not delete Metricas Proyecto Recurso with id=" + id + ' | error:' + err.message
                });
              });
};

// Delete a problema with the specified id in the request
exports.deleteProblema = (req, res) => {
  const id = req.params.id;
  
  ProyectoRecurso.destroy({
    where: { leancanvas_problema_id: id }
  })
    .then(num3 => {
      if (num3 == 1) {

                LeanCanvasProblema.destroy({
                  where: { id: id }
                })
                  .then(num2 => {
                    if (num2 == 1) {
                        res.send({
                            message: "Problema was deleted successfully!"
                          });
                    } else {
                      res.send({
                        message: `Cannot delete problema with id=${id}. Maybe problema was not found!`
                      });
                    }
                  }).catch(err => {
                    res.status(500).send({
                      message: "Could not delete problema with id=" + id + ' | error:' + err.message
                    });
                  });
                  
                } else {
                  res.send({
                    message: `Cannot delete Problema Proyecto Recurso with id=${id}. Maybe Problema was not found!`
                  });
                }
              }).catch(err => {
                res.status(500).send({
                  message: "Could not delete Problema Proyecto Recurso with id=" + id + ' | error:' + err.message
                });
              });
};


// Delete a clientes with the specified id in the request
exports.deleteClientes = (req, res) => {
  const id = req.params.id;

  ProyectoRecurso.destroy({
    where: { leancanvas_clientes_id: id }
  })
    .then(num3 => {
      if (num3 == 1) {
  
                LeanCanvasClientes.destroy({
                  where: { id: id }
                })
                  .then(num2 => {
                    if (num2 == 1) {
                        res.send({
                            message: "Clientes was deleted successfully!"
                          });
                    } else {
                      res.send({
                        message: `Cannot delete clientes with id=${id}. Maybe clientes was not found!`
                      });
                    }
                  }).catch(err => {
                    res.status(500).send({
                      message: "Could not delete clientes with id=" + id + ' | error:' + err.message
                    });
                  });
                  
                } else {
                  res.send({
                    message: `Cannot delete Clientes Proyecto Recurso with id=${id}. Maybe CLientes was not found!`
                  });
                }
              }).catch(err => {
                res.status(500).send({
                  message: "Could not delete Clientes Proyecto Recurso with id=" + id + ' | error:' + err.message
                });
              });
};


// Delete a solucion with the specified id in the request
exports.deleteSolucion = (req, res) => {
  const id = req.params.id;

  ProyectoRecurso.destroy({
    where: { leancanvas_solucion_id: id }
  })
    .then(num3 => {
      if (num3 == 1) {
  
                LeanCanvasSolucion.destroy({
                  where: { id: id }
                })
                  .then(num2 => {
                    if (num2 == 1) {
                        res.send({
                            message: "Solucion was deleted successfully!"
                          });
                    } else {
                      res.send({
                        message: `Cannot delete solucion with id=${id}. Maybe solucion was not found!`
                      });
                    }
                  }).catch(err => {
                    res.status(500).send({
                      message: "Could not delete solucion with id=" + id + ' | error:' + err.message
                    });
                  });
                  
                } else {
                  res.send({
                    message: `Cannot delete Solucion Proyecto Recurso with id=${id}. Maybe Solucion was not found!`
                  });
                }
              }).catch(err => {
                res.status(500).send({
                  message: "Could not delete Solucion Proyecto Recurso with id=" + id + ' | error:' + err.message
                });
              });
};

// Delete a metricas_clave with the specified id in the request
exports.deleteMetricasClave = (req, res) => {
  const id = req.params.id;

  ProyectoRecurso.destroy({
    where: { leancanvas_metricas_clave_id: id }
  })
    .then(num3 => {
      if (num3 == 1) {
  
                LeanCanvasMetricasClave.destroy({
                  where: { id: id }
                })
                  .then(num2 => {
                    if (num2 == 1) {
                        res.send({
                            message: "Metrica clave was deleted successfully!"
                          });
                    } else {
                      res.send({
                        message: `Cannot delete metrica clave with id=${id}. Maybe metrica_clave was not found!`
                      });
                    }
                  }).catch(err => {
                    res.status(500).send({
                      message: "Could not delete metrica clave with id=" + id + ' | error:' + err.message
                    });
                  }); 
                  
                } else {
                  res.send({
                    message: `Cannot delete Metricas Proyecto Recurso with id=${id}. Maybe Metricas was not found!`
                  });
                }
              }).catch(err => {
                res.status(500).send({
                  message: "Could not delete Metricas Proyecto Recurso with id=" + id + ' | error:' + err.message
                });
              });
};


// Delete a propuesta with the specified id in the request
exports.deletePropuesta = (req, res) => {
  const id = req.params.id;

  ProyectoRecurso.destroy({
    where: { leancanvas_propuesta_id: id }
  })
    .then(num3 => {
      if (num3 == 1) {

                LeanCanvasPropuesta.destroy({
                  where: { id: id }
                })
                  .then(num2 => {
                    if (num2 == 1) {
                        res.send({
                            message: "Propuesta was deleted successfully!"
                          });
                    } else {
                      res.send({
                        message: `Cannot delete propuesta with id=${id}. Maybe propuesta was not found!`
                      });
                    }
                  }).catch(err => {
                    res.status(500).send({
                      message: "Could not delete propuesta with id=" + id + ' | error:' + err.message
                    });
                  });
                  
                } else {
                  res.send({
                    message: `Cannot delete Propuesta Proyecto Recurso with id=${id}. Maybe Propuesta was not found!`
                  });
                }
              }).catch(err => {
                res.status(500).send({
                  message: "Could not delete Propuesta Proyecto Recurso with id=" + id + ' | error:' + err.message
                });
              });
};


// Delete a ventajas with the specified id in the request
exports.deleteVentajas = (req, res) => {
  const id = req.params.id;

  ProyectoRecurso.destroy({
    where: { leancanvas_ventajas_id: id }
  })
    .then(num3 => {
      if (num3 == 1) {

                LeanCanvasVentajas.destroy({
                  where: { id: id }
                })
                  .then(num2 => {
                    if (num2 == 1) {
                        res.send({
                            message: "Ventajas was deleted successfully!"
                          });
                    } else {
                      res.send({
                        message: `Cannot delete ventajas with id=${id}. Maybe ventajas was not found!`
                      });
                    }
                  }).catch(err => {
                    res.status(500).send({
                      message: "Could not delete ventajas with id=" + id + ' | error:' + err.message
                    });
                  });
                  
                } else {
                  res.send({
                    message: `Cannot delete Ventajas Proyecto Recurso with id=${id}. Maybe Ventajas was not found!`
                  });
                }
              }).catch(err => {
                res.status(500).send({
                  message: "Could not delete Ventajas Proyecto Recurso with id=" + id + ' | error:' + err.message
                });
              });
};


// Delete a canales with the specified id in the request
exports.deleteCanales = (req, res) => {
  const id = req.params.id;

  ProyectoRecurso.destroy({
    where: { leancanvas_canales_id: id }
  })
    .then(num3 => {
      if (num3 == 1) {

                LeanCanvasCanales.destroy({
                  where: { id: id }
                })
                  .then(num2 => {
                    if (num2 == 1) {
                        res.send({
                            message: "Canales was deleted successfully!"
                          });
                    } else {
                      res.send({
                        message: `Cannot delete canales with id=${id}. Maybe canales was not found!`
                      });
                    }
                  }).catch(err => {
                    res.status(500).send({
                      message: "Could not delete canales with id=" + id + ' | error:' + err.message
                    });
                  });
                  
                } else {
                  res.send({
                    message: `Cannot delete Canales Proyecto Recurso with id=${id}. Maybe canales was not found!`
                  });
                }
              }).catch(err => {
                res.status(500).send({
                  message: "Could not delete Canales Proyecto Recurso with id=" + id + ' | error:' + err.message
                });
              });
};


// Delete a estructura with the specified id in the request
exports.deleteEstructura = (req, res) => {
  const id = req.params.id;

  ProyectoRecurso.destroy({
    where: { leancanvas_estructura_id: id }
  })
    .then(num3 => {
      if (num3 == 1) {
  
                LeanCanvasEstructura.destroy({
                  where: { id: id }
                })
                  .then(num2 => {
                    if (num2 == 1) {
                        res.send({
                            message: "Estructura was deleted successfully!"
                          });
                    } else {
                      res.send({
                        message: `Cannot delete estructura with id=${id}. Maybe estructura was not found!`
                      });
                    }
                  }).catch(err => {
                    res.status(500).send({
                      message: "Could not delete estructura with id=" + id + ' | error:' + err.message
                    });
                  });
                  
                } else {
                  res.send({
                    message: `Cannot delete estructura Proyecto Recurso with id=${id}. Maybe estructura was not found!`
                  });
                }
              }).catch(err => {
                res.status(500).send({
                  message: "Could not delete estructura Proyecto Recurso with id=" + id + ' | error:' + err.message
                });
              });
};

// Delete a flujo with the specified id in the request
exports.deleteFlujo = (req, res) => {
  const id = req.params.id;

  ProyectoRecurso.destroy({
    where: { leancanvas_flujo_id: id }
  })
    .then(num3 => {
      if (num3 == 1) {
  
                LeanCanvasFlujo.destroy({
                  where: { id: id }
                })
                  .then(num2 => {
                    if (num2 == 1) {
                        res.send({
                            message: "Flujo was deleted successfully!"
                          });
                    } else {
                      res.send({
                        message: `Cannot delete flujo with id=${id}. Maybe flujo was not found!`
                      });
                    }
                  }).catch(err => {
                    res.status(500).send({
                      message: "Could not delete flujo with id=" + id + ' | error:' + err.message
                    });
                  });
                  
                } else {
                  res.send({
                    message: `Cannot delete flujo Proyecto Recurso with id=${id}. Maybe flujo was not found!`
                  });
                }
              }).catch(err => {
                res.status(500).send({
                  message: "Could not delete flujo Proyecto Recurso with id=" + id + ' | error:' + err.message
                });
              });
};

// Delete a mapa calor with the specified id in the request
exports.deleteMapaCalor = (req, res) => {
  const id = req.params.id;

  ProyectoRecurso.destroy({
    where: { mapa_calor_id: id }
  })
    .then(num3 => {
      if (num3 == 1) {
  
                MapaCalor.destroy({
                  where: { id: id }
                })
                  .then(num2 => {
                    if (num2 == 1) {
                        res.send({
                            message: "MapaCalor was deleted successfully!"
                          });
                    } else {
                      res.send({
                        message: `Cannot delete mapa calor with id=${id}. Maybe mapa calor was not found!`
                      });
                    }
                  }).catch(err => {
                    res.status(500).send({
                      message: "Could not delete mapa calor with id=" + id + ' | error:' + err.message
                    });
                  });
                  
                } else {
                  res.send({
                    message: `Cannot delete mapa calor Proyecto Recurso with id=${id}. Maybe mapa calor was not found!`
                  });
                }
              }).catch(err => {
                res.status(500).send({
                  message: "Could not delete mapa calor Proyecto Recurso with id=" + id + ' | error:' + err.message
                });
              });
};

// Delete all Proyectoss from the database.
exports.deleteAll = (req, res) => {
  Proyectos.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Proyectos were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Proyectos."
      });
    });
};

// Find all active Proyectoss
exports.findAllActive = (req, res) => {
  Proyectos.findAll({ where: { activo: true } })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Proyectos."
      });
    });
};
