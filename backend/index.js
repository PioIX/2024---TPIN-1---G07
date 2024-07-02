var express = require('express'); //Tipo de servidor: Express
var bodyParser = require('body-parser'); //Convierte los JSON
const cors = require('cors'); 


var app = express(); //Inicializo express
var port = process.env.PORT || 3000; //Ejecuto el servidor en el puerto 3000

// Convierte una petición recibida (POST-GET...) a objeto JSON
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cors());

app.get('/', function(req, res){
    res.status(200).send({
        message: 'GET Home route working fine!'
    });
});

/**
 * req = request. en este objeto voy a tener todo lo que reciba del cliente
 * res = response. Voy a responderle al cliente
 */
app.get('/saludo', function(req,res){
    console.log(req.query) //Los pedidos get reciben los datos del req.query
    res.send(`Hola ${req.query.nombre}, que tal?`)
})

app.post('/nombreDelPedido', function(req,res) {
    console.log(req.body) //Los pedidos post reciben los datos del req.body
    res.send("ok")
})

//Pongo el servidor a escuchar
app.listen(port, function(){
    console.log(`Server running in http://localhost:${port}`);
    console.log('Defined routes:');
    console.log('   [GET] http://localhost:3000/');
    console.log('   [GET] http://localhost:3000/saludo');
    console.log('   [POST] http://localhost:3000/nombreDelPedido');
});

const MySql = require('./modulos/mysql.js')

app.get('/obtenerPalabras', async function(req,res){
    console.log(req.query) 
    const respuesta = await MySql.realizarQuery('SELECT * FROM Palabras;')
    console.log({respuesta})
    res.send(respuesta)
})

app.get('/obtenerPartidas', async function(req,res){
    console.log(req.query) 
    const respuesta = await MySql.realizarQuery('SELECT * FROM Partidas;')
    console.log({respuesta})
    res.send(respuesta)
})

app.get('/obtenerUsuarios', async function(req,res){
    console.log(req.query) 
    const respuesta = await MySql.realizarQuery('SELECT * FROM Usuarios;')
    console.log({respuesta})
    res.send(respuesta)
})

app.get('/palabras', async function(req,res){
    console.log(req.query)
    let respuesta = ""
    if (req.query.nombre) {
         respuesta = await MySql.realizarQuery(`SELECT * FROM Palabras WHERE 
        nombre = "${req.query.nombre}";`)
    }
    else{
         respuesta = await MySql.realizarQuery(`SELECT * FROM Palabras;`)
    }
    res.send(respuesta) 
   
})

app.get('/partidas', async function(req,res){
    console.log(req.query)
    let respuesta = ""
    if (req.query.id_usuario) {
         respuesta = await MySql.realizarQuery(`SELECT * FROM Partidas WHERE 
        id_usuario = "${req.query.id_usuario}";`)
    }
    else{
         respuesta = await MySql.realizarQuery(`SELECT * FROM Partidas;`)
    }
    res.send(respuesta) 
   
})

app.post('/usuarios', async function(req,res){
    console.log(req.body)
    let respuesta = ""
    if (req.body.nombre_usuario) {
         respuesta = await MySql.realizarQuery(`SELECT * FROM Usuarios WHERE 
        nombre_usuario = "${req.body.nombre_usuario}" and contraseña = "${req.body.contraseña}";`)
    }
    else{
         respuesta = await MySql.realizarQuery(`SELECT * FROM Usarios;`)
    }
    res.send(respuesta) 
   
})

app.post('/insertarPalabra', async function(req,res) {
    console.log(req.body)
    var palabraNueva = await MySql.realizarQuery(`SELECT * FROM Palabras WHERE nombre = '${req.body.nombre}'`);
    if (palabraNueva.length==0) {
        await MySql.realizarQuery(`INSERT INTO Palabras (0, nombre, categoria)
        VALUES ('${req.body.nombre}', '${req.body.categoria}')`);
        res.send("ok")
    } else {
      res.send("Ya existe") ; 
    }
})

app.post('/insertarUsuario', async function(req,res) {
    console.log(req.body)
    var usuarioNuevo = await MySql.realizarQuery(`SELECT * FROM Usuarios WHERE nombre_usuario = '${req.body.nombre_usuario}'`);
    if (usuarioNuevo.length==0) {
        await MySql.realizarQuery(`INSERT INTO Usuarios (nombre_usuario, contraseña, puntaje_usuario, partidas_ganadas, partidas_perdidas) 
        VALUES ('${req.body.nombre_usuario}', '${req.body.contraseña}', 0, 0, 0)`);
        res.send("ok")
    } else {
        res.send("Ya existe");
    }
})

app.put('/modificarPalabra', async function(req,res){
    console.log(req.body)
    await MySql.realizarQuery(`UPDATE Palabras SET nombre = '${req.body.nombre}' WHERE id_palabra= ${req.body.id_palabra}`);
    res.send("ok")
})

app.put('/modificarPartida', async function(req,res){
    console.log(req.body)
    await MySql.realizarQuery(`UPDATE Partidas SET puntaje_partida = '${req.body.puntaje_partida}' WHERE id_partida= ${req.body.id_partida}`);
    res.send("ok")
})

app.put('/modificarUsuario', async function(req,res){
    console.log(req.body)
    await MySql.realizarQuery(`UPDATE Marcas SET contraseña = '${req.body.contraseña}' WHERE id_usuario= ${req.body.id_usuario}`);
    res.send("ok")
})

app.delete('/eliminarPalabra', async function(req,res){
    console.log(req.body)
    await MySql.realizarQuery(`DELETE FROM Palabras WHERE nombre = ${req.body.nombre}`);
    res.send("ok")
})

app.delete('/eliminarPartida', async function(req,res){
    console.log(req.body)
    await MySql.realizarQuery(`DELETE FROM Partidas WHERE id_partida = ${req.body.id_partida}`);
    res.send("ok")
})

app.delete('/eliminarUsuario', async function(req,res){
    console.log(req.body)
    await MySql.realizarQuery(`DELETE FROM Usuarios WHERE id_usuario = ${req.body.id_usuario}`);
    res.send("ok")
})