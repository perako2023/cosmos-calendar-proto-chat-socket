import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import cors from 'cors'

const app = express()
app.use(cors())
const httpServer = http.createServer(app, function (req, res) {
	res.end('test')
})

const io = new Server(httpServer, {
	cors: {
		origin: 'http://localhost:3000'
	}
})

io.on('connection', (socket) => {
	const roomId = socket.handshake.query.roomId
	socket.join(roomId)

	console.clear()
	console.log(
		`➕ User connected: ${socket.id}` +
			`\troomId: ${roomId}` +
			`\tTotal users: ${io.engine.clientsCount}`
	)

	socket.on('disconnect', () => {
		socket.leave(roomId)
		console.log(`➖ User disconnected: ${socket.id}\n Total users: ${io.engine.clientsCount}`)
	})

	socket.on('send_message', (data) => {
		console.log('send_message: ', JSON.stringify(data, null, 4))

		io.to(roomId).emit('receive_message', data)
	})
})

httpServer.listen(4000, () => {
	console.log('Server is running on port 4000')
})
