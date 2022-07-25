const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const {generateMessage} = require('./public/js/messages')
const {addUser,removeUser,getUser,getUsersInRoom} = require('./public/js/users')
const app = express()
const server = http.createServer(app)
const io = socketio(server)
const port = process.argv.PORT || 3000
const publicPath = path.join(__dirname,'./public')

app.use(express.static(publicPath)) 

io.on('connection' , (socket) =>{
    console.log('New WebSocket Connection')
   

    socket.on('join',({username,room},callback)=> {
        const user = addUser({id:socket.id,username:username,room:room})
       console.log(user)
        socket.join(user.room)
        socket.emit('message',generateMessage('Welcome',user.username))
        socket.broadcast.to(user.room).emit('message',generateMessage('A '+ user.username+' has joined',user.username))
        io.to(user.room).emit('roomData',{
            room:user.room,
            users : getUsersInRoom(user.room)
        })
    })
    socket.on('sendMessage',(message, callback)=>{
        const user = getUser(socket.id)
        io.to(user.room).emit('message',generateMessage(message,user.username))
        callback('Delivered')
    })

    socket.on('disconnect',() => {
        const user = removeUser(socket.id)
        if(user){
            io.to(user.room).emit('message', generateMessage('A '+user.username+' has left',user.username))
            io.to(user.room).emit('roomData',{
                room:user.room,
                users : getUsersInRoom(user.room)
            })
        }
        
    })
    socket.on('roomData',({room,users}) => {
        console.log(room)
        console.log(users)
    })
    // socket.emit('countUpdated',count)

    // socket.on('increment', () => {
    //     count ++
    //     io.emit('countUpdated',count)
    // })
})
server.listen(port,() => {
    console.log("Server is up in port " + port)
})
