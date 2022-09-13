const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const cors = require('cors');
var bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const path = require("path");
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
let etapa_active = '';

io.on('connection', function (socket) {

  const handshake = socket.id;
  let nombreCurso = 'Mbipi';
  console.log(`Nuevo dispositivo: ${handshake} conectado a la ${nombreCurso}`);
  socket.join(nombreCurso)

  socket.on('evento', (res) => {
    console.log('evento', res);
    notas_tablero_all = res;
    // Emite el mensaje a todos lo miembros de las sala menos a la persona que envia el mensaje
    socket.to(nombreCurso).emit('evento', res);
  })

  socket.on('evento_get_etapa', (res) => {
    console.log('evento_get_etapa', etapa_active);
    // Emite el mensaje a todos lo miembros de las sala menos a la persona que envia el mensaje
    io.in(nombreCurso).emit('evento_etapa_active', etapa_active);
  })

  socket.on('evento_set_etapa', (res) => {
    console.log('evento_set_etapa', res);
    etapa_active = res;
  })

  socket.on('evento_get', (res) => {
    console.log('evento_get', res);
    // Emite el mensaje a todos lo miembros de las sala menos a la persona que envia el mensaje
    io.in(nombreCurso).emit('evento', notas_tablero_all);
  })

  socket.on('evento_get_clasi', (res) => {
    console.log('evento_get_clasi', res);
    // Emite el mensaje a todos lo miembros de las sala menos a la persona que envia el mensaje
    io.in(nombreCurso).emit('evento_tablero_voto', notas_tablero_all_clasi);
  })

  socket.on('evento_tablero_voto', (res) => {
    console.log('evento_tablero_voto', res);
    // Emite el mensaje a todos lo miembros de las sala menos a la persona que envia el mensaje
    notas_tablero_all_clasi = res;
    socket.to(nombreCurso).emit('evento_tablero_voto', res);
  })

  socket.on('evento2', (res) => {
    console.log('evento2', res);
    // Emite el mensaje a todos lo miembros de las sala menos a la persona que envia el mensaje
    socket.to(nombreCurso).emit('evento2', res);
  })

  socket.on('evento_usuarios_activos', (res) => {
    console.log('usuario', res);
    //let index = usuarios_mbipi.findIndex((c) => c.id_socket == handshake);
    let index = usuarios_mbipi.findIndex((c) => c.id == res.id);

    if (index == -1) {
      //usuarios_mbipi.splice(index, 1);
      usuarios_mbipi.push({'id': res.id, 'id_socket': handshake, 'nombre': res.nombre, 'active': true});
    }else{
      usuarios_mbipi[index].active = res.active;
    }
    //socket.to(nombreCurso).emit('evento_usuarios_activos', {'usuarios_active': JSON.stringify(usuarios_mbipi)});
    io.in(nombreCurso).emit('evento_usuarios_activos', {'usuarios_active': JSON.stringify(usuarios_mbipi)});
  })

  socket.on('evento_usuarios_inactivos', (res) => {
    let index = usuarios_mbipi.findIndex((c) => c.id == res.id);

    if (index != -1) {/*
      usuarios_mbipi.splice(index, 1);*/
      usuarios_mbipi[index].active = false;
    }

    console.log('usuarios', usuarios_mbipi);
    socket.to(nombreCurso).emit('evento_usuarios_activos', {'usuarios_active': JSON.stringify(usuarios_mbipi)});
  })

  socket.on('evento_usuarios', (res) => {
    console.log('evento_usuarios', res);
    // Emite el mensaje a todos lo miembros de las sala menos a la persona que envia el mensaje
    socket.to(nombreCurso).emit('evento_usuarios', res);
  })

  socket.on('evento_tablero', (res) => {
    let data = res.tablero;
    let tablero = JSON.parse(data);

    for(let c in tablero){
      let index3 = notas_tablero.findIndex((n) => n.id == tablero[c].id);

        if (index3 != -1) {
          //notas_tablero[index3].content = tablero[c].content;
        }else{
          notas_tablero.push({'id': tablero[c].id, 'content': tablero[c].content});
        }
    }
    // Emite el mensaje a todos lo miembros de las sala menos a la persona que envia el mensaje
    //socket.to(nombreCurso).emit('evento_tablero', res);
    io.in(nombreCurso).emit('evento_tablero', {'tablero': JSON.stringify(notas_tablero)});
  })

  socket.on('evento_tablero_save', (res) => {
    if(Object.keys(notas_tablero_all).length === 0){
      notas_tablero_all = res;
    }
    // Emite el mensaje a todos lo miembros de las sala menos a la persona que envia el mensaje
    //socket.to(nombreCurso).emit('evento_tablero', res);
    io.in(nombreCurso).emit('evento_continue');
  })

  socket.on('evento_tablero_save_clasi', (res) => {
    if(Object.keys(notas_tablero_all_clasi).length === 0){
      notas_tablero_all_clasi = res;
    }
    // Emite el mensaje a todos lo miembros de las sala menos a la persona que envia el mensaje
    //socket.to(nombreCurso).emit('evento_tablero', res);
    io.in(nombreCurso).emit('evento_continue_voto');
  })

  socket.on('evento_tablero_update', (res) => {
      let index = notas_tablero.findIndex((n) => n.id == res.id);

        if (index != -1) {
          notas_tablero[index].content = res.content;
        }else{
          notas_tablero.push({'id': res.id, 'content': res.content});
        }
    io.in(nombreCurso).emit('evento_tablero', {'tablero': JSON.stringify(notas_tablero)});
  })

  socket.on('evento_tablero_delete', (res) => {
    let index = notas_tablero.findIndex((n) => n.id == res.id);

      if (index != -1) {
        notas_tablero.splice(index, 1);
      }
    io.in(nombreCurso).emit('evento_tablero', {'tablero': JSON.stringify(notas_tablero)});
  })

  socket.on('disconnect', function () {

    console.log(`Usuario Desconectado: ${handshake}`);

    let index = usuarios_mbipi.findIndex((c) => c.id_socket == handshake);

    if (index != -1) {
      usuarios_mbipi.splice(index, 1);
    }

    console.log('usuarios', usuarios_mbipi);
    socket.to(nombreCurso).emit('evento_usuarios_activos', {'usuarios_active': JSON.stringify(usuarios_mbipi)});

  });
});

//Cloudinary routes
app.use('/api/cloudinary', require('./app/routes/cloudinary.routes'));
app.use('/cloud_user', require('./app/routes/cloud_user.routes'))

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
/*Heroku*/
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
const PORT = process.env.PORT || 5000;

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
    host: /*"innovago.tresidea.cl",*/"smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: /*'innovago@innovago.tresidea.cl',*/'jhoan.zerpa@tresidea.cl',
      pass: /*'Innovago123'*/'20588459jz'
    }
  });

  let mailOptions = {
    from: /*'innovago@innovago.tresidea.cl', */'jhoan.zerpa@tresidea.cl', // sender address
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
      <a style="text-align: center; padding-top: 20px;" href="https://mbipi.herokuapp.com/auth/verify-login?pass_token=`+user.pass_token_verify+`">Verificar</a>
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
    host: /*"innovago.tresidea.cl",*/"smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: /*'innovago@innovago.tresidea.cl',*/'jhoan.zerpa@tresidea.cl',
      pass: /*'Innovago123'*/'20588459jz'
    }
  });

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
  <p><h4 style="text-align: center; padding-top: 5px;">Número Tarjeta: `+usuario.cardNumber+`</h4></p>
  <p><h4 style="text-align: center; padding-top: 5px;">Nombre Empresa: `+usuario.nombre_empresa+`</h4></p>
  </div>
</div>
  `;

  let mailOptions = {
    from: /*'innovago@innovago.tresidea.cl', */'jhoan.zerpa@tresidea.cl', // sender address
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
        host: /*"innovago.tresidea.cl",*/"smtp.gmail.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: /*'innovago@innovago.tresidea.cl',*/'jhoan.zerpa@tresidea.cl',
          pass: /*'Innovago123'*/'20588459jz'
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
        from: /*'innovago@innovago.tresidea.cl',*/'jhoan.zerpa@tresidea.cl', // sender address
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
          <a style="text-align: center; padding-top: 20px;" href="https://mbipi.herokuapp.com/invitations?code=`+user.code+`">Ingresar</a>
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
        host: /*"innovago.tresidea.cl",*/"smtp.gmail.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: /*'innovago@innovago.tresidea.cl',*/'jhoan.zerpa@tresidea.cl',
          pass: /*'Innovago123'*/'20588459jz'
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
        from: /*'innovago@innovago.tresidea.cl',*/'jhoan.zerpa@tresidea.cl', // sender address
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
            <a style="text-align: center; padding-top: 5px;" href="https://mbipi.herokuapp.com/auth/verify-code/`+user.id+`/`+user.pass_recovery_token+`">LINK</a>
            <h2 style="text-align: center;padding-top: 5px;">Código: `+user.pass_recovery+` <h2>
          </div>
        </div>
      `
      };

      // send mail with defined transport object
      let info = await transporter.sendMail(mailOptions);

      callback(info);

    }
