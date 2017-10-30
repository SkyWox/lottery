var express = require('express')
var router = express.Router()
var path = require('path')
//db includes
const todosController = require('../controllers').todos
const todoItemsController = require('../controllers').todoItems

router.use('/lottolist', require('./lottolist.js'))
router.use('/getnumbers', require('./getnumbers.js'))
router.use('/specs', require('./specs.js'))

//db calls
router.get('/db', (req, res) =>
	res.status(200).send({
		message: 'Welcome to the db API'
	})
)
router.post('/db/todos', todosController.create)
router.get('/db/todos', todosController.list)
router.get('/db/todos/:todoId', todosController.retrieve)
router.put('/db/todos/:todoId', todosController.update)
router.delete('/db/todos/:todoId', todosController.destroy)

router.post('/db/todos/:todoId/items', todoItemsController.create)
router.put('/db/todos/:todoId/items/:todoItemId', todoItemsController.update)
router.delete(
	'/db/todos/:todoId/items/:todoItemId',
	todoItemsController.destroy
)

// For any other request method on todo items, we're going to return "Method Not Allowed"
router.all('/db/todos/:todoId/items', (req, res) =>
	res.status(405).send({
		message: 'Method Not Allowed'
	})
)

// Catchall
router.get('*', (req, res) => {
	res.sendFile(path.resolve('../../client/build/index.html'))
})

module.exports = router
