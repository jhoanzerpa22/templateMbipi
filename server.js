const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const cors = require('cors');
var bcrypt = require("bcryptjs");
var CryptoJS = require("crypto-js");
const nodemailer = require("nodemailer");
const path = require("path");
const mailConfig = require("./app/config/mail.config.js");
const serverConfig = require("./app/config/server.config.js");

require('dotenv').config();

app.use(cors({ origin: true, credentials: true, methods: 'GET,POST,PUT,DELETE,OPTIONS' }));
const options = {
  cors: {
    origin: true,
    methods: 'GET,POST,PUT,DELETE,OPTIONS'
  },
  allowEIO3: true,
  transports: ['websocket'],
  jsonp:false,
  forceNew: true
};

// parse requests of content-type - application/json
app.use(bodyParser.json({limit: '50mb'}));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({limit: '50mb' ,extended: true }));

app.post("/api/sendmail", (req, res) => {
  console.log("request came");
  let user = req.body;
  sendMail(user, info => {
    console.log(`The mail has beed send and the id is ${info.messageId}`);
    res.send(info);
  });

});

app.put("/api/sendresume/:id/:correo", (req, res) => {
  console.log("sendresume");
  const user = {
    user_id: req.params.id,
    correo_login: req.params.correo,
    data: req.body
  };

  sendMailResume(user, info => {
    console.log(`The mail has beed send and the id is ${info.messageId}`);
    res.send(info);
  });

});

app.post("/api/invitacions", (req, res) => {
  console.log("request came");
  let user = req.body;
  sendMailInvitacions(user, info => {
    console.log(`The mail has beed send and the id is ${info.messageId}`);
    res.send(info);
  });
});

app.post("/api/sendmail-confirm-pass", (req, res) => {
  console.log("request came");
  let user = req.body.data;
  sendMailConfirmPass(user, info => {
    console.log(`The mail has beed send and the id is ${info.messageId}`);
    res.send(info);
  });

});

// app.get("/api/cloudinary", (req, res) =>{
//   cloudinary.v2.api.resources(
//     function(error, result) {console.log(result, error); });
// })

const server = require('http').Server(app);
const io = require('socket.io')(server, /*{ transports: ['websocket'], jsonp:false, forceNew: true }*/options);

/*
app.get('/', function (req, res) {
  res.send('Hello World!');
});*/

let usuarios_mbipi = [];
let notas_tablero = [];
let notas_tablero_all = {};
let notas_tablero_all_clasi = {};

let notas_tablero_meta = [];
let notas_tablero_all_meta = {};
let notas_tablero_preguntas = [];
let notas_tablero_all_preguntas = {};
let etapa_active = '';
let mapa = [];
let notas_tablero_necesidades = [];
let notas_tablero_all_necesidades = {};

let notas_tablero_propositos = [];
let notas_tablero_all_propositos = {};

let notas_tablero_objetivos = [];
let notas_tablero_all_objetivos = {};

let notas_tablero_acciones = [];
let notas_tablero_all_acciones = {};

let notas_tablero_metricas = [];
let notas_tablero_all_metricas = {};

let notas_tablero_problema = [];
let notas_tablero_all_problema = {};

let notas_tablero_clientes = [];
let notas_tablero_all_clientes = {};

let notas_tablero_solucion = [];
let notas_tablero_all_solucion = {};

let notas_tablero_metricas_clave = [];
let notas_tablero_all_metricas_clave = {};

let notas_tablero_propuesta = [];
let notas_tablero_all_propuesta = {};

let notas_tablero_ventajas = [];
let notas_tablero_all_ventajas = {};

let notas_tablero_canales = [];
let notas_tablero_all_canales = {};

let notas_tablero_estructura = [];
let notas_tablero_all_estructura = {};

let notas_tablero_flujo = [];
let notas_tablero_all_flujo = {};

io.on('connection', function (socket) {

  const handshake = socket.id;
  //let nombreCurso = 'Mbipi';
  const {nombreCurso} = socket.handshake.query;
  let nombreSala = '';

  socket.on('login', (res) => {
    nombreSala = 'Proyecto-'+res;
    console.log(`Nuevo dispositivo: ${handshake} conectado a la ${nombreSala}`);
    socket.join(nombreSala);
  })

  socket.on('evento', (res) => {
    console.log('evento', res);

    notas_tablero_all = res;
    // Emite el mensaje a todos lo miembros de las sala menos a la persona que envia el mensaje
    socket.to(nombreSala).emit('evento', res);
  })

  socket.on('evento_get_etapa', (res) => {
    
    console.log('evento_get_etapa', etapa_active);
    // Emite el mensaje a todos lo miembros de las sala menos a la persona que envia el mensaje
    io.in(nombreSala).emit('evento_etapa_active', etapa_active);
  })

  socket.on('evento_set_etapa', (res) => {
    
    console.log('evento_set_etapa', res);
    etapa_active = res;
  })

  socket.on('evento_get', (res) => {
    console.log('evento_get', res);
    
    // Emite el mensaje a todos lo miembros de las sala menos a la persona que envia el mensaje
    io.in(nombreSala).emit('evento', notas_tablero_all);
  })

  socket.on('evento_get_clasi', (res) => {
    console.log('evento_get_clasi', res);
    
    // Emite el mensaje a todos lo miembros de las sala menos a la persona que envia el mensaje
    io.in(nombreSala).emit('evento_tablero_voto', notas_tablero_all_clasi);
  })

  socket.on('evento_tablero_voto', (res) => {
    console.log('evento_tablero_voto', res);
    // Emite el mensaje a todos lo miembros de las sala menos a la persona que envia el mensaje
    
    notas_tablero_all_clasi = res;
    socket.to(nombreSala).emit('evento_tablero_voto', res);
  })

  socket.on('evento2', (res) => {
    //console.log('evento2', res);
    // Emite el mensaje a todos lo miembros de las sala menos a la persona que envia el mensaje
    socket.to(nombreSala).emit('evento2', res);
  })

  socket.on('evento_usuarios_activos', (res) => {
    console.log('usuario', res);
    //let index = usuarios_mbipi.findIndex((c) => c.id_socket == handshake);
    
    let index = usuarios_mbipi.findIndex((c) => c.id == res.id);

    if (index == -1) {
      //usuarios_mbipi.splice(index, 1);
      usuarios_mbipi.push({'id': res.id, 'id_socket': handshake, 'nombre': res.nombre, 'active': true, 'sala': nombreSala});
    }else{
      usuarios_mbipi[index].active = res.active;
      usuarios_mbipi[index].nombreSala = nombreSala;
    }

    let usuarios_filter = usuarios_mbipi.filter(
      (op) => (
        op.sala == nombreSala)
      );

    console.log('evento_usuarios_activos',usuarios_filter);
    //socket.to(nombreSala).emit('evento_usuarios_activos', {'usuarios_active': JSON.stringify(usuarios_mbipi)});
    io.in(nombreSala).emit('evento_usuarios_activos', {'usuarios_active': JSON.stringify(usuarios_filter)});
  })

  socket.on('evento_usuarios_inactivos', (res) => {
    
    let index = usuarios_mbipi.findIndex((c) => c.id == res.id);

    if (index != -1) {/*
      usuarios_mbipi.splice(index, 1);*/
      usuarios_mbipi[index].active = false;
    }

    socket.leave(nombreSala);
    
    let usuarios_filter = usuarios_mbipi.filter(
      (op) => (
        op.sala == nombreSala)
      );

    console.log('evento_usuarios_inactivos', usuarios_filter);
     
    socket.to(nombreSala).emit('evento_usuarios_activos', {'usuarios_active': JSON.stringify(usuarios_filter)});
  })

  socket.on('evento_usuarios', (res) => {
    console.log('evento_usuarios', res);
    // Emite el mensaje a todos lo miembros de las sala menos a la persona que envia el mensaje
    socket.to(nombreSala).emit('evento_usuarios', res);
  })

  socket.on('evento_tablero', (res) => {
    let data = res.tablero;
    let tablero = JSON.parse(data);

    for(let c in tablero){
      let index3 = notas_tablero.findIndex((n) => n.id == tablero[c].id);

        if (index3 != -1) {
          //notas_tablero[index3].content = tablero[c].content;
        }else{
          notas_tablero.push({'id': tablero[c].id, 'content': tablero[c].content, 'usuario_id': tablero[c].usuario_id});
        }
    }
    // Emite el mensaje a todos lo miembros de las sala menos a la persona que envia el mensaje
    //socket.to(nombreSala).emit('evento_tablero', res);
    io.in(nombreSala).emit('evento_tablero', {'tablero': JSON.stringify(notas_tablero)});
  })

  socket.on('evento_tablero_save', (res) => {
    if(Object.keys(notas_tablero_all).length === 0){
      //notas_tablero_all = res;
    }
    
    notas_tablero_all = [];
    // Emite el mensaje a todos lo miembros de las sala menos a la persona que envia el mensaje
    //socket.to(nombreSala).emit('evento_tablero', res);
    io.in(nombreSala).emit('evento_continue');
  })

  socket.on('evento_tablero_save_clasi', (res) => {
    if(Object.keys(notas_tablero_all_clasi).length === 0){
      notas_tablero_all_clasi = res;
    }
    // Emite el mensaje a todos lo miembros de las sala menos a la persona que envia el mensaje
    //socket.to(nombreSala).emit('evento_tablero', res);
    io.in(nombreSala).emit('evento_continue_voto');
  })
  
  socket.on('evento_tablero_save_voto', (res) => {
    // Emite el mensaje a todos lo miembros de las sala menos a la persona que envia el mensaje
    //socket.to(nombreSala).emit('evento_tablero', res);
    io.in(nombreSala).emit('evento_continue_voto');
  })

  socket.on('evento_tablero_update', (res) => {
    
    let index = notas_tablero.findIndex((n) => n.id == res.id);

        if (index != -1) {
          notas_tablero[index].content = res.content;
        }else{
          notas_tablero.push({'id': res.id, 'content': res.content, 'usuario_id': res.usuario_id});
        }
    io.in(nombreSala).emit('evento_tablero', {'tablero': JSON.stringify(notas_tablero)});
  })

  socket.on('evento_tablero_delete', (res) => {
  
    let index = notas_tablero.findIndex((n) => n.id == res.id);

      if (index != -1) {
        notas_tablero.splice(index, 1);
      }
    io.in(nombreSala).emit('evento_tablero', {'tablero': JSON.stringify(notas_tablero)});
  })

  /* Eventos Metas*/
  socket.on('evento_tablero_meta', (res) => {
    let data = res.tablero;
    let tablero = JSON.parse(data);
    
    for(let c in tablero){
      let index3 = notas_tablero_meta.findIndex((n) => n.id == tablero[c].id);

        if (index3 != -1) {
          //notas_tablero[index3].content = tablero[c].content;
        }else{
          notas_tablero_meta.push({'id': tablero[c].id, 'content': tablero[c].content, 'usuario_id': tablero[c].usuario_id});
        }
    }
    // Emite el mensaje a todos lo miembros de las sala menos a la persona que envia el mensaje
    //socket.to(nombreSala).emit('evento_tablero', res);
    io.in(nombreSala).emit('evento_tablero_meta', {'tablero': JSON.stringify(notas_tablero_meta)});
  })

  socket.on('evento_tablero_voto_meta', (res) => {
    console.log('evento_tablero_voto_meta', res);
    // Emite el mensaje a todos lo miembros de las sala menos a la persona que envia el mensaje
    
    notas_tablero_all_meta = res;
    socket.to(nombreSala).emit('evento_tablero_voto_meta', res);
  })

  socket.on('evento_tablero_save_meta', (res) => {
    if(Object.keys(notas_tablero_all_meta).length === 0){
      //notas_tablero_all_meta = res;
    }
    notas_tablero_all_meta = [];
    // Emite el mensaje a todos lo miembros de las sala menos a la persona que envia el mensaje
    //socket.to(nombreSala).emit('evento_tablero', res);
    console.log('nombreSala',nombreSala);
    io.in(nombreSala).emit('evento_continue');
  })
  
  socket.on('evento_tablero_save_voto_meta', (res) => {
    // Emite el mensaje a todos lo miembros de las sala menos a la persona que envia el mensaje
    //socket.to(nombreSala).emit('evento_tablero', res);
    io.in(nombreSala).emit('evento_continue_voto');
  })

  socket.on('evento_tablero_update_meta', (res) => {

      let index = notas_tablero_meta.findIndex((n) => n.id == res.id);

        if (index != -1) {
          notas_tablero_meta[index].content = res.content;
        }else{
          notas_tablero_meta.push({'id': res.id, 'content': res.content, 'usuario_id': res.usuario_id});
        }
    io.in(nombreSala).emit('evento_tablero_meta', {'tablero': JSON.stringify(notas_tablero_meta)});
  })

  socket.on('evento_tablero_delete_meta', (res) => {
    let index = notas_tablero_meta.findIndex((n) => n.id == res.id);

      if (index != -1) {
        notas_tablero_meta.splice(index, 1);
      }
    io.in(nombreSala).emit('evento_tablero_meta', {'tablero': JSON.stringify(notas_tablero_meta)});
  })

  /* Eventos Preguntas*/
  socket.on('evento_tablero_preguntas', (res) => {
    let data = res.tablero;
    let tablero = JSON.parse(data);
    
    for(let c in tablero){
      let index3 = notas_tablero_preguntas.findIndex((n) => n.id == tablero[c].id);

        if (index3 != -1) {
          //notas_tablero[index3].content = tablero[c].content;
        }else{
          notas_tablero_preguntas.push({'id': tablero[c].id, 'content': tablero[c].content, 'usuario_id': tablero[c].usuario_id});
        }
    }
    // Emite el mensaje a todos lo miembros de las sala menos a la persona que envia el mensaje
    //socket.to(nombreSala).emit('evento_tablero', res);
    io.in(nombreSala).emit('evento_tablero_preguntas', {'tablero': JSON.stringify(notas_tablero_preguntas)});
  })

  socket.on('evento_tablero_voto_preguntas', (res) => {
    console.log('evento_tablero_voto_preguntas', res);
    // Emite el mensaje a todos lo miembros de las sala menos a la persona que envia el mensaje
    console.log('nombre_curso',nombreSala);

    notas_tablero_all_preguntas = res;
    socket.to(nombreSala).emit('evento_tablero_voto_preguntas', res);
  })

  socket.on('evento_tablero_save_preguntas', (res) => {
    if(Object.keys(notas_tablero_all_preguntas).length === 0){
      //notas_tablero_all_preguntas = res;
    }
    notas_tablero_all_preguntas = [];
    // Emite el mensaje a todos lo miembros de las sala menos a la persona que envia el mensaje
    //socket.to(nombreSala).emit('evento_tablero', res);
    io.in(nombreSala).emit('evento_continue');
  })
  
  socket.on('evento_tablero_save_voto_preguntas', (res) => {
    // Emite el mensaje a todos lo miembros de las sala menos a la persona que envia el mensaje
    //socket.to(nombreSala).emit('evento_tablero', res);
    io.in(nombreSala).emit('evento_continue_voto');
  })

  socket.on('evento_tablero_update_preguntas', (res) => {
    
      let index = notas_tablero_preguntas.findIndex((n) => n.id == res.id);

        if (index != -1) {
          notas_tablero_preguntas[index].content = res.content;
        }else{
          notas_tablero_preguntas.push({'id': res.id, 'content': res.content, 'usuario_id': res.usuario_id});
        }
    io.in(nombreSala).emit('evento_tablero_preguntas', {'tablero': JSON.stringify(notas_tablero_preguntas)});
  })

  socket.on('evento_tablero_delete_preguntas', (res) => {
    
    let index = notas_tablero_preguntas.findIndex((n) => n.id == res.id);

      if (index != -1) {
        notas_tablero_preguntas.splice(index, 1);
      }
    io.in(nombreSala).emit('evento_tablero_preguntas', {'tablero': JSON.stringify(notas_tablero_preguntas)});
  })

  socket.on('evento_tablero_save_mapa', (res) => {
    mapa = [];
    // Emite el mensaje a todos lo miembros de las sala menos a la persona que envia el mensaje
    //socket.to(nombreSala).emit('evento_tablero', res);
    io.in(nombreSala).emit('evento_continue');
  })

  /* Eventos necesidades*/
  socket.on('evento_tablero_necesidades', (res) => {
    let data = res.tablero;
    let tablero = JSON.parse(data);

    //console.log('notas_necesidades',notas_tablero_necesidades);
    
    for(let c in tablero){
      let index3 = notas_tablero_necesidades.findIndex((n) => n.id == tablero[c].id);

        if (index3 != -1) {
          notas_tablero_necesidades[index3].content = tablero[c].content;
          notas_tablero_necesidades[index3].position = tablero[c].position;
          notas_tablero_necesidades[index3].dragPosition = tablero[c].dragPosition;
        }else{
          notas_tablero_necesidades.push({'id': tablero[c].id, 'content': tablero[c].content, 'type': tablero[c].type, 'usuario_id': tablero[c].usuario_id, 'position': tablero[c].position, 'dragPosition': tablero[c].dragPosition});
        }
    }
    // Emite el mensaje a todos lo miembros de las sala menos a la persona que envia el mensaje
    //socket.to(nombreSala).emit('evento_tablero', res);
    io.in(nombreSala).emit('evento_tablero_necesidades', {'tablero': JSON.stringify(notas_tablero_necesidades)});
  })

  socket.on('evento_tablero_save_necesidades', (res) => {
    if(Object.keys(notas_tablero_all_necesidades).length === 0){
      //notas_tablero_all_necesidades = res;
    }
    notas_tablero_all_necesidades = [];
    notas_tablero_necesidades = [];
    // Emite el mensaje a todos lo miembros de las sala menos a la persona que envia el mensaje
    //socket.to(nombreSala).emit('evento_tablero', res);
    console.log('nombreSala',nombreSala);
    io.in(nombreSala).emit('evento_continue');
  })

  socket.on('evento_tablero_update_necesidades', (res) => {
    
      let index = notas_tablero_necesidades.findIndex((n) => n.id == res.id);

        if (index != -1) {
          notas_tablero_necesidades[index].content = res.content;
        }else{
          notas_tablero_necesidades.push({'id': res.id, 'content': res.content, 'type': res.type, 'usuario_id': res.usuario_id, 'position': res.position, 'dragPosition': res.dragPosition});
        }
    io.in(nombreSala).emit('evento_tablero_necesidades', {'tablero': JSON.stringify(notas_tablero_necesidades)});
  })

  socket.on('evento_tablero_delete_necesidades', (res) => {
    
    let index = notas_tablero_necesidades.findIndex((n) => n.id == res.id);

      if (index != -1) {
        notas_tablero_necesidades.splice(index, 1);
      }
    io.in(nombreSala).emit('evento_tablero_necesidades', {'tablero': JSON.stringify(notas_tablero_necesidades)});
  })
  
  /* Eventos Propositos*/
  socket.on('evento_tablero_propositos', (res) => {
    let data = res.tablero;
    let tablero = JSON.parse(data);
    
    for(let c in tablero){
      let index3 = notas_tablero_propositos.findIndex((n) => n.id == tablero[c].id);

        if (index3 != -1) {
          notas_tablero_propositos[index3].content = tablero[c].content;
          notas_tablero_propositos[index3].position = tablero[c].position;
          notas_tablero_propositos[index3].dragPosition = tablero[c].dragPosition;
        }else{
          notas_tablero_propositos.push({'id': tablero[c].id, 'content': tablero[c].content, 'usuario_id': tablero[c].usuario_id, 'position': tablero[c].position, 'dragPosition': tablero[c].dragPosition});
        }
    }
    // Emite el mensaje a todos lo miembros de las sala menos a la persona que envia el mensaje
    //socket.to(nombreSala).emit('evento_tablero', res);
    io.in(nombreSala).emit('evento_tablero_propositos', {'tablero': JSON.stringify(notas_tablero_propositos)});
  })

  socket.on('evento_tablero_voto_propositos', (res) => {
    console.log('evento_tablero_voto_propositos', res);
    // Emite el mensaje a todos lo miembros de las sala menos a la persona que envia el mensaje
    
    notas_tablero_all_propositos = res;
    socket.to(nombreSala).emit('evento_tablero_voto_propositos', res);
  })

  socket.on('evento_tablero_save_propositos', (res) => {
    if(Object.keys(notas_tablero_all_propositos).length === 0){
      //notas_tablero_all_propositos = res;
    }
    notas_tablero_all_propositos = [];
    notas_tablero_propositos = [];
    // Emite el mensaje a todos lo miembros de las sala menos a la persona que envia el mensaje
    //socket.to(nombreSala).emit('evento_tablero', res);
    console.log('nombreSala',nombreSala);
    io.in(nombreSala).emit('evento_continue');
  })
  
  socket.on('evento_tablero_save_voto_propositos', (res) => {
    // Emite el mensaje a todos lo miembros de las sala menos a la persona que envia el mensaje
    //socket.to(nombreSala).emit('evento_tablero', res);
    io.in(nombreSala).emit('evento_continue_voto');
  })

  socket.on('evento_tablero_update_propositos', (res) => {

      let index = notas_tablero_propositos.findIndex((n) => n.id == res.id);

        if (index != -1) {
          notas_tablero_propositos[index].content = res.content;
        }else{
          notas_tablero_propositos.push({'id': res.id, 'content': res.content, 'usuario_id': res.usuario_id});
        }
    io.in(nombreSala).emit('evento_tablero_propositos', {'tablero': JSON.stringify(notas_tablero_propositos)});
  })

  socket.on('evento_tablero_delete_propositos', (res) => {
    let index = notas_tablero_propositos.findIndex((n) => n.id == res.id);

      if (index != -1) {
        notas_tablero_propositos.splice(index, 1);
      }
    io.in(nombreSala).emit('evento_tablero_propositos', {'tablero': JSON.stringify(notas_tablero_propositos)});
  })

  /* Eventos Objetivos*/
  socket.on('evento_tablero_objetivos', (res) => {
    let data = res.tablero;
    let tablero = JSON.parse(data);
    
    for(let c in tablero){
      let index3 = notas_tablero_objetivos.findIndex((n) => n.id == tablero[c].id);

        if (index3 != -1) {
          notas_tablero_objetivos[index3].content = tablero[c].content;
          notas_tablero_objetivos[index3].position = tablero[c].position;
          notas_tablero_objetivos[index3].dragPosition = tablero[c].dragPosition;
        }else{
          notas_tablero_objetivos.push({'id': tablero[c].id, 'content': tablero[c].content, 'type': tablero[c].type, 'usuario_id': tablero[c].usuario_id, 'position': tablero[c].position, 'dragPosition': tablero[c].dragPosition});
        }
    }
    // Emite el mensaje a todos lo miembros de las sala menos a la persona que envia el mensaje
    //socket.to(nombreSala).emit('evento_tablero', res);
    io.in(nombreSala).emit('evento_tablero_objetivos', {'tablero': JSON.stringify(notas_tablero_objetivos)});
  })

  socket.on('evento_tablero_save_objetivos', (res) => {
    if(Object.keys(notas_tablero_all_objetivos).length === 0){
      //notas_tablero_all_objetivos = res;
    }
    notas_tablero_all_objetivos = [];
    notas_tablero_objetivos = [];
    // Emite el mensaje a todos lo miembros de las sala menos a la persona que envia el mensaje
    //socket.to(nombreSala).emit('evento_tablero', res);
    console.log('nombreSala',nombreSala);
    io.in(nombreSala).emit('evento_continue');
  })

  socket.on('evento_tablero_update_objetivos', (res) => {
    
      let index = notas_tablero_objetivos.findIndex((n) => n.id == res.id);

        if (index != -1) {
          notas_tablero_objetivos[index].content = res.content;
        }else{
          notas_tablero_objetivos.push({'id': res.id, 'content': res.content, 'type': res.type, 'usuario_id': res.usuario_id});
        }
    io.in(nombreSala).emit('evento_tablero_objetivos', {'tablero': JSON.stringify(notas_tablero_objetivos)});
  })

  socket.on('evento_tablero_delete_objetivos', (res) => {
    
    let index = notas_tablero_objetivos.findIndex((n) => n.id == res.id);

      if (index != -1) {
        notas_tablero_objetivos.splice(index, 1);
      }
    io.in(nombreSala).emit('evento_tablero_objetivos', {'tablero': JSON.stringify(notas_tablero_objetivos)});
  })

  
  /* Eventos Acciones*/
  socket.on('evento_tablero_acciones', (res) => {
    let data = res.tablero;
    let tablero = JSON.parse(data);
    
    for(let c in tablero){
      let index3 = notas_tablero_acciones.findIndex((n) => n.id == tablero[c].id);

        if (index3 != -1) {
          notas_tablero_acciones[index3].content = tablero[c].content;
          notas_tablero_acciones[index3].position = tablero[c].position;
          notas_tablero_acciones[index3].dragPosition = tablero[c].dragPosition;
        }else{
          notas_tablero_acciones.push({'id': tablero[c].id, 'content': tablero[c].content, 'usuario_id': tablero[c].usuario_id, 'position': tablero[c].position, 'dragPosition': tablero[c].dragPosition});
        }
    }
    // Emite el mensaje a todos lo miembros de las sala menos a la persona que envia el mensaje
    //socket.to(nombreSala).emit('evento_tablero', res);
    io.in(nombreSala).emit('evento_tablero_acciones', {'tablero': JSON.stringify(notas_tablero_acciones)});
  })

  socket.on('evento_tablero_save_acciones', (res) => {
    if(Object.keys(notas_tablero_all_acciones).length === 0){
      //notas_tablero_all_acciones = res;
    }
    notas_tablero_all_acciones = [];
    notas_tablero_acciones = [];
    // Emite el mensaje a todos lo miembros de las sala menos a la persona que envia el mensaje
    //socket.to(nombreSala).emit('evento_tablero', res);
    console.log('nombreSala',nombreSala);
    io.in(nombreSala).emit('evento_continue');
  })

  socket.on('evento_tablero_update_acciones', (res) => {
    
      let index = notas_tablero_acciones.findIndex((n) => n.id == res.id);

        if (index != -1) {
          notas_tablero_acciones[index].content = res.content;
        }else{
          notas_tablero_acciones.push({'id': res.id, 'content': res.content, 'usuario_id': res.usuario_id});
        }
    io.in(nombreSala).emit('evento_tablero_acciones', {'tablero': JSON.stringify(notas_tablero_acciones)});
  })

  socket.on('evento_tablero_delete_acciones', (res) => {
    
    let index = notas_tablero_acciones.findIndex((n) => n.id == res.id);

      if (index != -1) {
        notas_tablero_acciones.splice(index, 1);
      }
    io.in(nombreSala).emit('evento_tablero_acciones', {'tablero': JSON.stringify(notas_tablero_acciones)});
  })

  
  /* Eventos Metricas*/
  socket.on('evento_tablero_metricas', (res) => {
    let data = res.tablero;
    let tablero = JSON.parse(data);
    
    for(let c in tablero){
      let index3 = notas_tablero_metricas.findIndex((n) => n.id == tablero[c].id);

        if (index3 != -1) {
          notas_tablero_metricas[index3].content = tablero[c].content;
          notas_tablero_metricas[index3].position = tablero[c].position;
          notas_tablero_metricas[index3].dragPosition = tablero[c].dragPosition;
        }else{
          notas_tablero_metricas.push({'id': tablero[c].id, 'content': tablero[c].content, 'usuario_id': tablero[c].usuario_id, 'position': tablero[c].position, 'dragPosition': tablero[c].dragPosition});
        }
    }
    // Emite el mensaje a todos lo miembros de las sala menos a la persona que envia el mensaje
    //socket.to(nombreSala).emit('evento_tablero', res);
    io.in(nombreSala).emit('evento_tablero_metricas', {'tablero': JSON.stringify(notas_tablero_metricas)});
  })

  socket.on('evento_tablero_save_metricas', (res) => {
    if(Object.keys(notas_tablero_all_metricas).length === 0){
      //notas_tablero_all_metricas = res;
    }
    notas_tablero_all_metricas = [];
    notas_tablero_metricas = [];
    // Emite el mensaje a todos lo miembros de las sala menos a la persona que envia el mensaje
    //socket.to(nombreSala).emit('evento_tablero', res);
    console.log('nombreSala',nombreSala);
    io.in(nombreSala).emit('evento_continue');
  })

  socket.on('evento_tablero_update_metricas', (res) => {
    
      let index = notas_tablero_metricas.findIndex((n) => n.id == res.id);

        if (index != -1) {
          notas_tablero_metricas[index].content = res.content;
        }else{
          notas_tablero_metricas.push({'id': res.id, 'content': res.content, 'usuario_id': res.usuario_id});
        }
    io.in(nombreSala).emit('evento_tablero_metricas', {'tablero': JSON.stringify(notas_tablero_metricas)});
  })

  socket.on('evento_tablero_delete_metricas', (res) => {
    
    let index = notas_tablero_metricas.findIndex((n) => n.id == res.id);

      if (index != -1) {
        notas_tablero_metricas.splice(index, 1);
      }
    io.in(nombreSala).emit('evento_tablero_metricas', {'tablero': JSON.stringify(notas_tablero_metricas)});
  })

  /* Eventos Problema*/
  socket.on('evento_tablero_problema', (res) => {
    let data = res.tablero;
    let tablero = JSON.parse(data);
    
    for(let c in tablero){
      let index3 = notas_tablero_problema.findIndex((n) => n.id == tablero[c].id);

        if (index3 != -1) {
          notas_tablero_problema[index3].content = tablero[c].content;
          notas_tablero_problema[index3].position = tablero[c].position;
          notas_tablero_problema[index3].dragPosition = tablero[c].dragPosition;
        }else{
          notas_tablero_problema.push({'id': tablero[c].id, 'content': tablero[c].content, 'usuario_id': tablero[c].usuario_id, 'position': tablero[c].position, 'dragPosition': tablero[c].dragPosition});
        }
    }
    // Emite el mensaje a todos lo miembros de las sala menos a la persona que envia el mensaje
    //socket.to(nombreSala).emit('evento_tablero', res);
    io.in(nombreSala).emit('evento_tablero_problema', {'tablero': JSON.stringify(notas_tablero_problema)});
  })

  socket.on('evento_tablero_save_problema', (res) => {
    if(Object.keys(notas_tablero_all_problema).length === 0){
      //notas_tablero_all_problema = res;
    }
    notas_tablero_all_problema = [];
    notas_tablero_problema = [];
    // Emite el mensaje a todos lo miembros de las sala menos a la persona que envia el mensaje
    //socket.to(nombreSala).emit('evento_tablero', res);
    console.log('nombreSala',nombreSala);
    io.in(nombreSala).emit('evento_continue');
  })

  socket.on('evento_tablero_update_problema', (res) => {
    
      let index = notas_tablero_problema.findIndex((n) => n.id == res.id);

        if (index != -1) {
          notas_tablero_problema[index].content = res.content;
        }else{
          notas_tablero_problema.push({'id': res.id, 'content': res.content, 'usuario_id': res.usuario_id});
        }
    io.in(nombreSala).emit('evento_tablero_problema', {'tablero': JSON.stringify(notas_tablero_problema)});
  })

  socket.on('evento_tablero_delete_problema', (res) => {
    
    let index = notas_tablero_problema.findIndex((n) => n.id == res.id);

      if (index != -1) {
        notas_tablero_problema.splice(index, 1);
      }
    io.in(nombreSala).emit('evento_tablero_problema', {'tablero': JSON.stringify(notas_tablero_problema)});
  })

  
  /* Eventos Clientes*/
  socket.on('evento_tablero_clientes', (res) => {
    let data = res.tablero;
    let tablero = JSON.parse(data);
    
    for(let c in tablero){
      let index3 = notas_tablero_clientes.findIndex((n) => n.id == tablero[c].id);

        if (index3 != -1) {
          notas_tablero_clientes[index3].content = tablero[c].content;
          notas_tablero_clientes[index3].position = tablero[c].position;
          notas_tablero_clientes[index3].dragPosition = tablero[c].dragPosition;
        }else{
          notas_tablero_clientes.push({'id': tablero[c].id, 'content': tablero[c].content, 'usuario_id': tablero[c].usuario_id, 'position': tablero[c].position, 'dragPosition': tablero[c].dragPosition});
        }
    }
    // Emite el mensaje a todos lo miembros de las sala menos a la persona que envia el mensaje
    //socket.to(nombreSala).emit('evento_tablero', res);
    io.in(nombreSala).emit('evento_tablero_clientes', {'tablero': JSON.stringify(notas_tablero_clientes)});
  })

  socket.on('evento_tablero_save_clientes', (res) => {
    if(Object.keys(notas_tablero_all_clientes).length === 0){
      //notas_tablero_all_clientes = res;
    }
    notas_tablero_all_clientes = [];
    notas_tablero_clientes = [];
    // Emite el mensaje a todos lo miembros de las sala menos a la persona que envia el mensaje
    //socket.to(nombreSala).emit('evento_tablero', res);
    console.log('nombreSala',nombreSala);
    io.in(nombreSala).emit('evento_continue');
  })

  socket.on('evento_tablero_update_clientes', (res) => {
    
      let index = notas_tablero_clientes.findIndex((n) => n.id == res.id);

        if (index != -1) {
          notas_tablero_clientes[index].content = res.content;
        }else{
          notas_tablero_clientes.push({'id': res.id, 'content': res.content, 'usuario_id': res.usuario_id});
        }
    io.in(nombreSala).emit('evento_tablero_clientes', {'tablero': JSON.stringify(notas_tablero_clientes)});
  })

  socket.on('evento_tablero_delete_clientes', (res) => {
    
    let index = notas_tablero_clientes.findIndex((n) => n.id == res.id);

      if (index != -1) {
        notas_tablero_clientes.splice(index, 1);
      }
    io.in(nombreSala).emit('evento_tablero_clientes', {'tablero': JSON.stringify(notas_tablero_clientes)});
  })
  
  /* Eventos Solucion*/
  socket.on('evento_tablero_solucion', (res) => {
    let data = res.tablero;
    let tablero = JSON.parse(data);
    
    for(let c in tablero){
      let index3 = notas_tablero_solucion.findIndex((n) => n.id == tablero[c].id);

        if (index3 != -1) {
          notas_tablero_solucion[index3].content = tablero[c].content;
          notas_tablero_solucion[index3].position = tablero[c].position;
          notas_tablero_solucion[index3].dragPosition = tablero[c].dragPosition;
        }else{
          notas_tablero_solucion.push({'id': tablero[c].id, 'content': tablero[c].content, 'usuario_id': tablero[c].usuario_id, 'position': tablero[c].position, 'dragPosition': tablero[c].dragPosition});
        }
    }
    // Emite el mensaje a todos lo miembros de las sala menos a la persona que envia el mensaje
    //socket.to(nombreSala).emit('evento_tablero', res);
    io.in(nombreSala).emit('evento_tablero_solucion', {'tablero': JSON.stringify(notas_tablero_solucion)});
  })

  socket.on('evento_tablero_save_solucion', (res) => {
    if(Object.keys(notas_tablero_all_solucion).length === 0){
      //notas_tablero_all_solucion = res;
    }
    notas_tablero_all_solucion = [];
    notas_tablero_solucion = [];
    // Emite el mensaje a todos lo miembros de las sala menos a la persona que envia el mensaje
    //socket.to(nombreSala).emit('evento_tablero', res);
    console.log('nombreSala',nombreSala);
    io.in(nombreSala).emit('evento_continue');
  })

  socket.on('evento_tablero_update_solucion', (res) => {
    
      let index = notas_tablero_solucion.findIndex((n) => n.id == res.id);

        if (index != -1) {
          notas_tablero_solucion[index].content = res.content;
        }else{
          notas_tablero_solucion.push({'id': res.id, 'content': res.content, 'usuario_id': res.usuario_id});
        }
    io.in(nombreSala).emit('evento_tablero_solucion', {'tablero': JSON.stringify(notas_tablero_solucion)});
  })

  socket.on('evento_tablero_delete_solucion', (res) => {
    
    let index = notas_tablero_solucion.findIndex((n) => n.id == res.id);

      if (index != -1) {
        notas_tablero_solucion.splice(index, 1);
      }
    io.in(nombreSala).emit('evento_tablero_solucion', {'tablero': JSON.stringify(notas_tablero_solucion)});
  })

  
  /* Eventos MetricasClave*/
  socket.on('evento_tablero_metricas_clave', (res) => {
    let data = res.tablero;
    let tablero = JSON.parse(data);
    
    for(let c in tablero){
      let index3 = notas_tablero_metricas_clave.findIndex((n) => n.id == tablero[c].id);

        if (index3 != -1) {
          notas_tablero_metricas_clave[index3].content = tablero[c].content;
          notas_tablero_metricas_clave[index3].position = tablero[c].position;
          notas_tablero_metricas_clave[index3].dragPosition = tablero[c].dragPosition;
        }else{
          notas_tablero_metricas_clave.push({'id': tablero[c].id, 'content': tablero[c].content, 'usuario_id': tablero[c].usuario_id, 'position': tablero[c].position, 'dragPosition': tablero[c].dragPosition});
        }
    }
    // Emite el mensaje a todos lo miembros de las sala menos a la persona que envia el mensaje
    //socket.to(nombreSala).emit('evento_tablero', res);
    io.in(nombreSala).emit('evento_tablero_metricas_clave', {'tablero': JSON.stringify(notas_tablero_metricas_clave)});
  })

  socket.on('evento_tablero_save_metricas_clave', (res) => {
    if(Object.keys(notas_tablero_all_metricas_clave).length === 0){
      //notas_tablero_all_metricas_clave = res;
    }
    notas_tablero_all_metricas_clave = [];
    notas_tablero_metricas_clave = [];
    // Emite el mensaje a todos lo miembros de las sala menos a la persona que envia el mensaje
    //socket.to(nombreSala).emit('evento_tablero', res);
    console.log('nombreSala',nombreSala);
    io.in(nombreSala).emit('evento_continue');
  })

  socket.on('evento_tablero_update_metricas_clave', (res) => {
    
      let index = notas_tablero_metricas_clave.findIndex((n) => n.id == res.id);

        if (index != -1) {
          notas_tablero_metricas_clave[index].content = res.content;
        }else{
          notas_tablero_metricas_clave.push({'id': res.id, 'content': res.content, 'usuario_id': res.usuario_id});
        }
    io.in(nombreSala).emit('evento_tablero_metricas_clave', {'tablero': JSON.stringify(notas_tablero_metricas_clave)});
  })

  socket.on('evento_tablero_delete_metricas_clave', (res) => {
    
    let index = notas_tablero_metricas_clave.findIndex((n) => n.id == res.id);

      if (index != -1) {
        notas_tablero_metricas_clave.splice(index, 1);
      }
    io.in(nombreSala).emit('evento_tablero_metricas_clave', {'tablero': JSON.stringify(notas_tablero_metricas_clave)});
  })

  
  /* Eventos Propuesta*/
  socket.on('evento_tablero_propuesta', (res) => {
    let data = res.tablero;
    let tablero = JSON.parse(data);
    
    for(let c in tablero){
      let index3 = notas_tablero_propuesta.findIndex((n) => n.id == tablero[c].id);

        if (index3 != -1) {
          notas_tablero_propuesta[index3].content = tablero[c].content;
          notas_tablero_propuesta[index3].position = tablero[c].position;
          notas_tablero_propuesta[index3].dragPosition = tablero[c].dragPosition;
        }else{
          notas_tablero_propuesta.push({'id': tablero[c].id, 'content': tablero[c].content, 'usuario_id': tablero[c].usuario_id, 'position': tablero[c].position, 'dragPosition': tablero[c].dragPosition});
        }
    }
    // Emite el mensaje a todos lo miembros de las sala menos a la persona que envia el mensaje
    //socket.to(nombreSala).emit('evento_tablero', res);
    io.in(nombreSala).emit('evento_tablero_propuesta', {'tablero': JSON.stringify(notas_tablero_propuesta)});
  })

  socket.on('evento_tablero_save_propuesta', (res) => {
    if(Object.keys(notas_tablero_all_propuesta).length === 0){
      //notas_tablero_all_propuesta = res;
    }
    notas_tablero_all_propuesta = [];
    notas_tablero_propuesta = [];
    // Emite el mensaje a todos lo miembros de las sala menos a la persona que envia el mensaje
    //socket.to(nombreSala).emit('evento_tablero', res);
    console.log('nombreSala',nombreSala);
    io.in(nombreSala).emit('evento_continue');
  })

  socket.on('evento_tablero_update_propuesta', (res) => {
    
      let index = notas_tablero_propuesta.findIndex((n) => n.id == res.id);

        if (index != -1) {
          notas_tablero_propuesta[index].content = res.content;
        }else{
          notas_tablero_propuesta.push({'id': res.id, 'content': res.content, 'usuario_id': res.usuario_id});
        }
    io.in(nombreSala).emit('evento_tablero_propuesta', {'tablero': JSON.stringify(notas_tablero_propuesta)});
  })

  socket.on('evento_tablero_delete_propuesta', (res) => {
    
    let index = notas_tablero_propuesta.findIndex((n) => n.id == res.id);

      if (index != -1) {
        notas_tablero_propuesta.splice(index, 1);
      }
    io.in(nombreSala).emit('evento_tablero_propuesta', {'tablero': JSON.stringify(notas_tablero_propuesta)});
  })

  
  /* Eventos Ventajas*/
  socket.on('evento_tablero_ventajas', (res) => {
    let data = res.tablero;
    let tablero = JSON.parse(data);
    
    for(let c in tablero){
      let index3 = notas_tablero_ventajas.findIndex((n) => n.id == tablero[c].id);

        if (index3 != -1) {
          notas_tablero_ventajas[index3].content = tablero[c].content;
          notas_tablero_ventajas[index3].position = tablero[c].position;
          notas_tablero_ventajas[index3].dragPosition = tablero[c].dragPosition;
        }else{
          notas_tablero_ventajas.push({'id': tablero[c].id, 'content': tablero[c].content, 'usuario_id': tablero[c].usuario_id, 'position': tablero[c].position, 'dragPosition': tablero[c].dragPosition});
        }
    }
    // Emite el mensaje a todos lo miembros de las sala menos a la persona que envia el mensaje
    //socket.to(nombreSala).emit('evento_tablero', res);
    io.in(nombreSala).emit('evento_tablero_ventajas', {'tablero': JSON.stringify(notas_tablero_ventajas)});
  })

  socket.on('evento_tablero_save_ventajas', (res) => {
    if(Object.keys(notas_tablero_all_ventajas).length === 0){
      //notas_tablero_all_ventajas = res;
    }
    notas_tablero_all_ventajas = [];
    notas_tablero_ventajas = [];
    // Emite el mensaje a todos lo miembros de las sala menos a la persona que envia el mensaje
    //socket.to(nombreSala).emit('evento_tablero', res);
    console.log('nombreSala',nombreSala);
    io.in(nombreSala).emit('evento_continue');
  })

  socket.on('evento_tablero_update_ventajas', (res) => {
    
      let index = notas_tablero_ventajas.findIndex((n) => n.id == res.id);

        if (index != -1) {
          notas_tablero_ventajas[index].content = res.content;
        }else{
          notas_tablero_ventajas.push({'id': res.id, 'content': res.content, 'usuario_id': res.usuario_id});
        }
    io.in(nombreSala).emit('evento_tablero_ventajas', {'tablero': JSON.stringify(notas_tablero_ventajas)});
  })

  socket.on('evento_tablero_delete_ventajas', (res) => {
    
    let index = notas_tablero_ventajas.findIndex((n) => n.id == res.id);

      if (index != -1) {
        notas_tablero_ventajas.splice(index, 1);
      }
    io.in(nombreSala).emit('evento_tablero_ventajas', {'tablero': JSON.stringify(notas_tablero_ventajas)});
  })

  
  /* Eventos Canales*/
  socket.on('evento_tablero_canales', (res) => {
    let data = res.tablero;
    let tablero = JSON.parse(data);
    
    for(let c in tablero){
      let index3 = notas_tablero_canales.findIndex((n) => n.id == tablero[c].id);

        if (index3 != -1) {
          notas_tablero_canales[index3].content = tablero[c].content;
          notas_tablero_canales[index3].position = tablero[c].position;
          notas_tablero_canales[index3].dragPosition = tablero[c].dragPosition;
        }else{
          notas_tablero_canales.push({'id': tablero[c].id, 'content': tablero[c].content, 'usuario_id': tablero[c].usuario_id, 'position': tablero[c].position, 'dragPosition': tablero[c].dragPosition});
        }
    }
    // Emite el mensaje a todos lo miembros de las sala menos a la persona que envia el mensaje
    //socket.to(nombreSala).emit('evento_tablero', res);
    io.in(nombreSala).emit('evento_tablero_canales', {'tablero': JSON.stringify(notas_tablero_canales)});
  })

  socket.on('evento_tablero_save_canales', (res) => {
    if(Object.keys(notas_tablero_all_canales).length === 0){
      //notas_tablero_all_canales = res;
    }
    notas_tablero_all_canales = [];
    notas_tablero_canales = [];
    // Emite el mensaje a todos lo miembros de las sala menos a la persona que envia el mensaje
    //socket.to(nombreSala).emit('evento_tablero', res);
    console.log('nombreSala',nombreSala);
    io.in(nombreSala).emit('evento_continue');
  })

  socket.on('evento_tablero_update_canales', (res) => {
    
      let index = notas_tablero_canales.findIndex((n) => n.id == res.id);

        if (index != -1) {
          notas_tablero_canales[index].content = res.content;
        }else{
          notas_tablero_canales.push({'id': res.id, 'content': res.content, 'usuario_id': res.usuario_id});
        }
    io.in(nombreSala).emit('evento_tablero_canales', {'tablero': JSON.stringify(notas_tablero_canales)});
  })

  socket.on('evento_tablero_delete_canales', (res) => {
    
    let index = notas_tablero_canales.findIndex((n) => n.id == res.id);

      if (index != -1) {
        notas_tablero_canales.splice(index, 1);
      }
    io.in(nombreSala).emit('evento_tablero_canales', {'tablero': JSON.stringify(notas_tablero_canales)});
  })

  
  /* Eventos Estructura*/
  socket.on('evento_tablero_estructura', (res) => {
    let data = res.tablero;
    let tablero = JSON.parse(data);
    
    for(let c in tablero){
      let index3 = notas_tablero_estructura.findIndex((n) => n.id == tablero[c].id);

        if (index3 != -1) {
          notas_tablero_estructura[index3].content = tablero[c].content;
          notas_tablero_estructura[index3].position = tablero[c].position;
          notas_tablero_estructura[index3].dragPosition = tablero[c].dragPosition;
        }else{
          notas_tablero_estructura.push({'id': tablero[c].id, 'content': tablero[c].content, 'usuario_id': tablero[c].usuario_id, 'position': tablero[c].position, 'dragPosition': tablero[c].dragPosition});
        }
    }
    // Emite el mensaje a todos lo miembros de las sala menos a la persona que envia el mensaje
    //socket.to(nombreSala).emit('evento_tablero', res);
    io.in(nombreSala).emit('evento_tablero_estructura', {'tablero': JSON.stringify(notas_tablero_estructura)});
  })

  socket.on('evento_tablero_save_estructura', (res) => {
    if(Object.keys(notas_tablero_all_estructura).length === 0){
      //notas_tablero_all_estructura = res;
    }
    notas_tablero_all_estructura = [];
    notas_tablero_estructura = [];
    // Emite el mensaje a todos lo miembros de las sala menos a la persona que envia el mensaje
    //socket.to(nombreSala).emit('evento_tablero', res);
    console.log('nombreSala',nombreSala);
    io.in(nombreSala).emit('evento_continue');
  })

  socket.on('evento_tablero_update_estructura', (res) => {
    
      let index = notas_tablero_estructura.findIndex((n) => n.id == res.id);

        if (index != -1) {
          notas_tablero_estructura[index].content = res.content;
        }else{
          notas_tablero_estructura.push({'id': res.id, 'content': res.content, 'usuario_id': res.usuario_id});
        }
    io.in(nombreSala).emit('evento_tablero_estructura', {'tablero': JSON.stringify(notas_tablero_estructura)});
  })

  socket.on('evento_tablero_delete_estructura', (res) => {
    
    let index = notas_tablero_estructura.findIndex((n) => n.id == res.id);

      if (index != -1) {
        notas_tablero_estructura.splice(index, 1);
      }
    io.in(nombreSala).emit('evento_tablero_estructura', {'tablero': JSON.stringify(notas_tablero_estructura)});
  })

  
  /* Eventos Flujo*/
  socket.on('evento_tablero_flujo', (res) => {
    let data = res.tablero;
    let tablero = JSON.parse(data);
    
    for(let c in tablero){
      let index3 = notas_tablero_flujo.findIndex((n) => n.id == tablero[c].id);

        if (index3 != -1) {
          notas_tablero_flujo[index3].content = tablero[c].content;
          notas_tablero_flujo[index3].position = tablero[c].position;
          notas_tablero_flujo[index3].dragPosition = tablero[c].dragPosition;
        }else{
          notas_tablero_flujo.push({'id': tablero[c].id, 'content': tablero[c].content, 'usuario_id': tablero[c].usuario_id, 'position': tablero[c].position, 'dragPosition': tablero[c].dragPosition});
        }
    }
    // Emite el mensaje a todos lo miembros de las sala menos a la persona que envia el mensaje
    //socket.to(nombreSala).emit('evento_tablero', res);
    io.in(nombreSala).emit('evento_tablero_flujo', {'tablero': JSON.stringify(notas_tablero_flujo)});
  })

  socket.on('evento_tablero_save_flujo', (res) => {
    if(Object.keys(notas_tablero_all_flujo).length === 0){
      //notas_tablero_all_flujo = res;
    }
    notas_tablero_all_flujo = [];
    notas_tablero_flujo = [];
    // Emite el mensaje a todos lo miembros de las sala menos a la persona que envia el mensaje
    //socket.to(nombreSala).emit('evento_tablero', res);
    console.log('nombreSala',nombreSala);
    io.in(nombreSala).emit('evento_continue');
  })

  socket.on('evento_tablero_update_flujo', (res) => {
    
      let index = notas_tablero_flujo.findIndex((n) => n.id == res.id);

        if (index != -1) {
          notas_tablero_flujo[index].content = res.content;
        }else{
          notas_tablero_flujo.push({'id': res.id, 'content': res.content, 'usuario_id': res.usuario_id});
        }
    io.in(nombreSala).emit('evento_tablero_flujo', {'tablero': JSON.stringify(notas_tablero_flujo)});
  })

  socket.on('evento_tablero_delete_flujo', (res) => {
    
    let index = notas_tablero_flujo.findIndex((n) => n.id == res.id);

      if (index != -1) {
        notas_tablero_flujo.splice(index, 1);
      }
    io.in(nombreSala).emit('evento_tablero_flujo', {'tablero': JSON.stringify(notas_tablero_flujo)});
  })

  socket.on('evento_tablero_save_bosquejar', (res) => {
    console.log('nombreSala',nombreSala);
    io.in(nombreSala).emit('evento_continue');
  })

  socket.on('disconnect', function () {

    console.log(`Usuario Desconectado: ${handshake}`);

        let index = usuarios_mbipi.findIndex((c) => c.id_socket == handshake);

        if (index != -1) {
          //usuarios_mbipi.splice(index, 1);
          usuarios_mbipi[index].active = false;
        }     
    socket.leave(nombreSala);
    let usuarios_filter = usuarios_mbipi.filter(
      (op) => (
        op.sala == nombreSala)
      );
    console.log('usuarios_disconect', usuarios_filter);
    socket.to(nombreSala).emit('evento_usuarios_activos', {'usuarios_active': JSON.stringify(usuarios_filter)});

  });
});

//Cloudinary routes
app.use('/api/cloudinary', require('./app/routes/cloudinary.routes'));
app.use('/api/cloud_user', require('./app/routes/cloud_user.routes'))

// Serve static files
app.use('/', express.static(__dirname + '/dist/demo1'));
/*
app.use('/', express.static(path.join(__dirname,'static/home/')));
*/
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/usuario.routes')(app);
require('./app/routes/rol.routes')(app);
require('./app/routes/referencias.routes')(app);
require('./app/routes/proyectos.routes')(app);
require('./app/routes/invitaciones.routes')(app);
// require('./app/routes/cloudinary.routes')(app);

app.all('/api/*', (req, res) => {
  res.status(404).json({code:404, msg: 'Ruta API no reconocida.'});
});

// Send all requests to index.html
/*app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/demo1/index.html'));
});*/
/*Heroku y Firebase*/
app.use('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/demo1/'));
});
/*
app.use('/*', express.static(path.join(__dirname,'static/home/')));*/

app.all('*', (req, res) => {
  res.status(404).json({msg: 'Recurso no encontrado.'});
  //res.render('landing/index');
});

// set port, listen for requests
const PORT = process.env.PORT || 4000;

// default Heroku port
server.listen(PORT);
/*server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});*/

const db = require("./app/models");
// const path = require("path/posix");
const Role = db.role;
const User = db.user;
const Usuario = db.usuario;
const Referencias = db.referencias;
const ProyectosTipos = db.proyectos_tipos;
const Metodologias = db.metodologias;

db.sequelize.sync().then(() => {
  console.log("Seeder db.");
  initial();
});
/*db.sequelize.sync({ force: true }).then(() => {
  console.log("Drop and re-sync db.");
  initial();
});
*/
function initial() {

  User.findOne({
    where: {
      correo_login: "admin@demo.com"
    }
  }).then(user_valid => {
      if (!user_valid) {

		  Role.create({
		    id: 1,
		    nombre: "Administrador",
		    createdAt: "2022-06-02 00:00:00",
		    updatedAt: "2022-06-02 00:00:00"
		  });

		  Role.create({
		    id: 2,
		    nombre: "Usuario",
		    createdAt: "2022-06-02 00:00:00",
		    updatedAt: "2022-06-02 00:00:00"
		  });

		  Role.create({
		    id: 3,
		    nombre: "Invitado",
		    createdAt: "2022-06-02 00:00:00",
		    updatedAt: "2022-06-02 00:00:00"
		  });

		  User.create({
		  	id: 1,
		  	correo_login: "admin@demo.com",
		    pass_hash: bcrypt.hashSync("demo", 8),
		    pass_recovery_hash: "",
		    pass_recovery_time: null,
		    tipo_rol: "Administrador",
        verify: true
		  }).then(user => {
					user.setRoles([1]);
		  });

		  Usuario.create({
		  	id: 1,
		  	nombre: "Admin",
		    rut: "12345678-5",
		    fono: "+573213354666",
		    correo: "admin@demo.com",
		    //direccion: "Santiago de Chile",
		    login_id: 1,
        completada: true
		  });

		}
    });

    Referencias.findOne({
      where: {
        id: 1
      }
    }).then(valid => {
        if (!valid) {

        Referencias.create({
          id: 1,
          nombre: "RRSS"
        });

      }
      });

      Metodologias.findOne({
        where: {
          id: 1
        }
      }).then(valid => {
          if (!valid) {

          Metodologias.create({
            id: 1,
            nombre: "Design"
          });

        }
        });

        ProyectosTipos.findOne({
          where: {
            id: 1
          }
        }).then(valid => {
            if (!valid) {

            ProyectosTipos.create({
              id: 1,
              nombre: "Uber Clon"
            });


            ProyectosTipos.create({
              id: 2,
              nombre: "E-Commerce"
            });


            ProyectosTipos.create({
              id: 3,
              nombre: "E-Learning"
            });

          }
          });
    }

    //configuración envío de email
async function sendMail(user, callback) {

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: mailConfig.HOST, /*"smtp.gmail.com",*/
    port: mailConfig.PORT,//465,
    secure: mailConfig.SECURE,//true, // true for 465, false for other ports
    auth: {
      user: mailConfig.USER,
      pass: mailConfig.PASS
    }
  });

  let mailOptions = {
    from: mailConfig.FROM,//'no-reply2@tresidea.cl',// sender address
    to: user.correo_login, // list of receivers user.email
    subject: "Registro Mbipi", // Subject line
    html:
    `<div class="border" style="width: 600px; height: 300px; border-top-color: rgb(0,188,212); border-color: black;">
    <div class="border" style="width: 600px; height: 10px; background-color: rgb(0,188,212);border-color: rgb(0,188,212);">
    </div>
    <div class="border" style="width: 600px; height: 70px; background-color: #F6F6F6; border-color: #F6F6F6; font-family: 'Raleway', sans-serif;" >
        <h1 style="text-align: center; padding-top: 12px;">Mbipi<span style="font-weight: bold; color: #23909F;">.</span></h1>
    </div>
    <div class="container">
      <h3 style="text-align: center; padding-top: 20px;">¡Gracias `+user.nombre+` por registrarte en nuestro portal Mbipi!</h3>
    </div>
    <div class="container">
      <h4 style="text-align: center; padding-top: 20px;">Por favor ingresa en el siguiente link para verificar tu cuenta.</h4>
      <a style="text-align: center; padding-top: 20px;" href="`+serverConfig.HOST+`/auth/verify-login?pass_token=`+user.pass_token_verify+`">Verificar</a>
    </div>
  </div>
    `
  };

  // send mail with defined transport object
  let info = await transporter.sendMail(mailOptions);

  callback(info);

}

//configuración envío de email
async function sendMailResume(user, callback) {
  let usuario = user.data;
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: mailConfig.HOST,//"smtp.gmail.com",*/
    port: mailConfig.PORT,//465,
    secure: mailConfig.SECURE,//true, // true for 465, false for other ports
    auth: {
      user: mailConfig.USER,
      pass: mailConfig.PASS
    }
  });

  // Decrypt
  var bytescardnumber  = CryptoJS.AES.decrypt(usuario.cardNumber, 'mbipi123');
  var cardNumberdecrypt = bytescardnumber.toString(CryptoJS.enc.Utf8);
  var cardNumber = '**** **** **** ' + cardNumberdecrypt.substr(-4);

  let contenido = `<div class="border" style="width: 600px; height: 900px; border-top-color: rgb(0,188,212); border-color: black;">
  <div class="border" style="width: 600px; height: 10px; background-color: rgb(0,188,212);border-color: rgb(0,188,212);">
  </div>
  <div class="border" style="width: 600px; height: 70px; background-color: #F6F6F6; border-color: #F6F6F6; font-family: 'Raleway', sans-serif;" >
      <h1 style="text-align: center; padding-top: 12px;">Mbipi<span style="font-weight: bold; color: #23909F;">.</span></h1>
  </div>
  <div class="container">
    <h3 style="text-align: center; padding-top: 20px;">¡Gracias por completar el registro en nuestro portal Mbipi!</h3>
  </div>
  <div class="container">
  <p><h4 style="text-align: center; padding-top: 10px;">Tipo Cuenta: `+usuario.tipo_cuenta+`</h4>
  </p>
  <p>
    <h4 style="text-align: center; padding-top: 5px;">Tipo Plan: `+usuario.tipo_plan+`</h4>
  </p>
  <p><h4 style="text-align: center; padding-top: 5px;">Nombre Tarjeta: `+usuario.nameOnCard+`</h4></p>
  <p><h4 style="text-align: center; padding-top: 5px;">Número Tarjeta: `+cardNumber+`</h4></p>
  <p><h4 style="text-align: center; padding-top: 5px;">Nombre Empresa: `+usuario.nombre_empresa+`</h4></p>
  </div>
</div>
  `;

  let mailOptions = {
    from: mailConfig.FROM,//'no-reply2@tresidea.cl',//'jhoan.zerpa@tresidea.cl', // sender address
    to: user.correo_login, // list of receivers user.email
    subject: "Bienvenido a Mbipi", // Subject line
    html: contenido
  };

  // send mail with defined transport object
  let info = await transporter.sendMail(mailOptions);

  callback(info);

}

    //configuración envío de email invitaciones
    async function sendMailInvitacions(user, callback) {

      // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
        host: mailConfig.HOST,
        port: mailConfig.PORT,//465,
        secure: mailConfig.SECURE,//true, // true for 465, false for other ports
        auth: {
          user: mailConfig.USER,
          pass: mailConfig.PASS
        }
      });

      let emails = '';
      let lista_emails = [];
      if(user.emails.length > 0){
        for (let i = 0; i < user.emails.length; i++) {
          lista_emails.push(user.emails[i].correo);
        }
        emails = lista_emails.join(',');
      }

      let mailOptions = {
        from: mailConfig.FROM,//'no-reply2@tresidea.cl',//'jhoan.zerpa@tresidea.cl', // sender address
        to: emails, // list of receivers user.email
        subject: "Invitación Mbipi", // Subject line
        html:
        `<div class="border" style="width: 600px; height: 300px; border-top-color: rgb(0,188,212); border-color: black;">
        <div class="border" style="width: 600px; height: 10px; background-color: rgb(0,188,212);border-color: rgb(0,188,212);">
        </div>
        <div class="border" style="width: 600px; height: 70px; background-color: #F6F6F6; border-color: #F6F6F6; font-family: 'Raleway', sans-serif;" >
            <h1 style="text-align: center; padding-top: 12px;">Mbipi<span style="font-weight: bold; color: #23909F;">.</span></h1>
        </div>
        <div class="container">
          <h3 style="text-align: center; padding-top: 20px;">¡Ha recibido una invitación!</h3>
        </div>
        <div class="container">
          <h4 style="text-align: center; padding-top: 20px;">El Usuario `+user.nombre_usuario+` lo ha invitado a unirse al proyecto `+user.nombre+`. Por favor ingresa en el siguiente link para ingresar al sistema y aceptar la invitación.</h4>
          <a style="text-align: center; padding-top: 20px;" href="`+serverConfig.HOST+`/invitations?code=`+user.code+`">Ingresar</a>
        </div>
      </div>
        `
      };

      // send mail with defined transport object
      let info = await transporter.sendMail(mailOptions);

      callback(info);

    }

    async function sendMailConfirmPass(user, callback) {

      // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
        host: mailConfig.HOST,
        port: mailConfig.PORT,//465,
        secure: mailConfig.SECURE,//true, // true for 465, false for other ports
        auth: {
          user: mailConfig.USER,
          pass: mailConfig.PASS
        }
      });

      // let emails = '';
      // let lista_emails = [];
      // if(user.emails.length > 0){
      //   for (let i = 0; i < user.emails.length; i++) {
      //     lista_emails.push(user.emails[i].nombre);
      //   }
      //   emails = lista_emails.join(',');
      // }

      let mailOptions = {
        from: mailConfig.FROM,//'no-reply2@tresidea.cl',//'jhoan.zerpa@tresidea.cl', // sender address
        to: user.correo_login, // list of receivers user.email
        subject: "Recuperar Password Mbipi", // Subject line
        html:
        `<div class="border" style="width: 600px; height: 300px; border-top-color: rgb(0,188,212); border-color: black;">
          <div class="border" style="width: 600px; height: 10px; background-color: rgb(0,188,212);border-color: rgb(0,188,212);">
          </div>
          <div class="border" style="width: 600px; height: 70px; background-color: #F6F6F6; border-color: #F6F6F6; font-family: 'Raleway', sans-serif;" >
            <h1 style="text-align: center; padding-top: 12px;">Mbipi<span style="font-weight: bold; color: #23909F;">.</span></h1>
          </div>
          <div class="container">
            <h3 style="text-align: center; padding-top: 20px;">Recuperar contraseña Mbipi</h3>
          </div>
          <div class="container">
            <h4 style="text-align: center; padding-top: 5px;">Ingresa al siguiente link e ingresa el código de verificación</h4><span></span>
            <a style="text-align: center; padding-top: 5px;" href="`+serverConfig.HOST+`/auth/verify-code/`+user.id+`/`+user.pass_recovery_token+`">LINK</a>
            <h2 style="text-align: center;padding-top: 5px;">Código: `+user.pass_recovery+` <h2>
          </div>
        </div>
      `
      };

      // send mail with defined transport object
      let info = await transporter.sendMail(mailOptions);

      callback(info);

    }
