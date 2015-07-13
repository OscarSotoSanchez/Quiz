exports.question = function(req, res) {
	res.render('quizes/question', {pregunta: 'Capital de Italia'})
};

exports.answer = function(req, res) {
	var respuesta = req.query.respuesta;
	if (respuesta.toLowerCase() == 'roma') {
		res.render('quizes/answer', {respuesta: 'Correcto'})
	}
	else {
		res.render('quizes/answer', {respuesta: 'Incorrecto'})
	}
};
