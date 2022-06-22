const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const cors = require('cors');
var bcrypt = require("bcryptjs");
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

const server = require('http').Server(app);
const io = require('socket.io')(server, options);

app.get('/', function (req, res) {
  res.send('Hello World!');
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

  socket.on('disconnect', function () {
    console.log('user disconnected');
  });
});

app.use('/', express.static(path.join(__dirname,'static/home/')));
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/usuario.routes')(app);
require('./app/routes/rol.routes')(app);

app.all('/api/*', (req, res) => {
  res.status(404).json({code:404, msg: 'Ruta API no reconocida.'});
});

app.use('/*', express.static(path.join(__dirname,'static/home/')));

app.all('*', (req, res) => {
  res.status(404).json({msg: 'Recurso no encontrado.'});
  //res.render('landing/index');
});

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
		    createdAt: "2021-11-02 00:00:00",
		    updatedAt: "2021-11-02 00:00:00"
		  });

		  Role.create({
		    id: 2,
		    nombre: "Usuario",
		    createdAt: "2021-11-02 00:00:00",
		    updatedAt: "2021-11-02 00:00:00"
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
    }