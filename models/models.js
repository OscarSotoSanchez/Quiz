var path = require('path');

// Postgres DATABASE_URL = postgress://user:passwd@host:port/database
// SQLite DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name = (url[6] || null);
var user = (url[2] || null);
var pwd = (url[3] || null);
var protocol = (url[1] || null);
var dialect = (url[1] || null);
var port = (url[5] || null);
var host = (url[4] || null);
var storage = process.env.DATABASE_STORAGE;

// Cargar Modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite
var sequelize = new Sequelize(DB_name, user, pwd, {
	dialect: protocol,
	protocol: protocol,
	port: port,
	host: host,
	storage: storage, // solo SQLite (.env)
	omitNull: true    // solo Postgress
});

// Importar la definición de la tabla Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname, 'quiz.js'));

// Importar la definición de la tabla Comments en Comment.js
var Comment = sequelize.import(path.join(__dirname, 'comment.js'));

Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

// Exportar la definición de tabla Quiz
exports.Quiz = Quiz;
exports.Comment = Comment;

// sequelize.sync() crea e inicializa tabla de preguntas en DB
sequelize.sync().then(function() {
	// then(..) ejecuta el manejador una vez creada la tabla
	Quiz.count().then(function (count) {
		if (count == 0) { // la tabla se inicializa sólo si está vacía
			Quiz.create({
				pregunta: 'Capital de Italia',
				respuesta: 'Roma',
				tema: 'Humanidades'
			});
			Quiz.create({
				pregunta: 'Capital de Portugal',
				respuesta: 'Lisboa',
				tema: 'Humanidades'
			}).success(function() {
				console.log('Base de datos inicializada.');
			});
		};
	});
});
