const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const cors = require('cors');
var bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const path = require("path");

app.use(cors({ origin: true, credentials: true, methods: 'GET,POST,PUT,DELETE,OPTIONS' }));
const options = {
  cors: {
    origin: true,
    methods: 'GET,POST,PUT,DELETE,OPTIONS'
  },
  allowEIO3: true
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

app.post("/api/invitacions", (req, res) => {
  console.log("request came");
  let user = req.body;
  sendMailInvitacions(user, info => {
    console.log(`The mail has beed send and the id is ${info.messageId}`);
    res.send(info);
  });

});

const server = require('http').Server(app);
const io = require('socket.io')(server, options);

/*
app.get('/', function (req, res) {
  res.send('Hello World!');
});*/

// Send all requests to index.html
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/demo1/index.html'));
});

io.on('connection', function (socket) {

  const handshake = socket.id;
  let nombreCurso = 'Mbipi';
  console.log(`Nuevo dispositivo: ${handshake} conectado a la ${nombreCurso}`);
  socket.join(nombreCurso)
  
  socket.on('evento', (res) => {
    console.log('evento', res);
    // Emite el mensaje a todos lo miembros de las sala menos a la persona que envia el mensaje   
    socket.to(nombreCurso).emit('evento', res);
  })

  socket.on('evento2', (res) => {
    console.log('evento2', res);
    // Emite el mensaje a todos lo miembros de las sala menos a la persona que envia el mensaje   
    socket.to(nombreCurso).emit('evento2', res);
  })

  socket.on('disconnect', function () {
    console.log('user disconnected');
  });
});
/*
app.use('/', express.static(path.join(__dirname,'static/home/')));*/
// Serve static files
app.use(express.static(__dirname + '/dist/demo1'));

require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/usuario.routes')(app);
require('./app/routes/rol.routes')(app);
require('./app/routes/referencias.routes')(app);
require('./app/routes/proyectos.routes')(app);
require('./app/routes/invitaciones.routes')(app);

app.all('/api/*', (req, res) => {
  res.status(404).json({code:404, msg: 'Ruta API no reconocida.'});
});

/*
app.use('/*', express.static(path.join(__dirname,'static/home/')));*/

app.all('*', (req, res) => {
  res.status(404).json({msg: 'Recurso no encontrado.'});
  //res.render('landing/index');
});

// default Heroku port
app.listen(process.env.PORT || 5000);

// set port, listen for requests
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

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
		    tipo_rol: "Administrador"
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
		    login_id: 1
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
    host: "innovago.tresidea.cl",//"smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'innovago@innovago.tresidea.cl',//'jhoan.zerpa@tresidea.cl',
      pass: 'Innovago123'
    }
  });

  let mailOptions = {
    from: 'innovago@innovago.tresidea.cl', //'jhoan.zerpa@tresidea.cl', // sender address
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
      <a style="text-align: center; padding-top: 20px;" href="http://localhost:57567/auth/verify-login?pass_token=`+user.pass_token_verify+`">Verificar</a>
    </div>
  </div>
    `
  };

  // send mail with defined transport object
  let info = await transporter.sendMail(mailOptions);

  callback(info);

}

    //configuración envío de email invitaciones
    async function sendMailInvitacions(user, callback) {

      // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
        host: "innovago.tresidea.cl",//"smtp.gmail.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: 'innovago@innovago.tresidea.cl',//'jhoan.zerpa@tresidea.cl',
          pass: 'Innovago123'
        }
      });

      let emails = '';
      let lista_emails = [];
      if(user.emails.length > 0){
        for (let i = 0; i < user.emails.length; i++) {
          lista_emails.push(user.emails[i].nombre);
        }
        emails = lista_emails.join(',');
      }
    
      let mailOptions = {
        from: 'innovago@innovago.tresidea.cl',//'jhoan.zerpa@tresidea.cl', // sender address
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
          <h4 style="text-align: center; padding-top: 20px;">El Usuario `+user.nombre_usuario+` lo ha invitado ha unirse al proyecto `+user.nombre+`. Por favor ingresa en el siguiente link para ingresar al sistema y aceptar la invitación.</h4>
          <a style="text-align: center; padding-top: 20px;" href="http://localhost:52065/invitations?code=`+user.code+`">Ingresar</a>
        </div>
      </div>
        `
      };
    
      // send mail with defined transport object
      let info = await transporter.sendMail(mailOptions);
    
      callback(info);
    
    }