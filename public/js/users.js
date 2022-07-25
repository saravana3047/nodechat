const users = []
const addUser = ({id,username,room}) =>{
    username  = username.trim().toLowerCase()
    room  = room.trim().toLowerCase()
    console.log('username',username)
    console.log('room',room)
    if(!username || !room){
        return {
            error : 'Username and room is required'
        }
    }

    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    }) 

    if(existingUser){
        return {
            error : 'User is already Exit'
        }
    }

    const user = {id , username, room}
    users.push(user)
    return user;

}


const removeUser = (id) =>{
    // const index = users.findIndex((user) => {
    //     return user.id == id
    // })

    const index = users.findIndex((user) => user.id === id)
    if(index !== -1){
        return users.splice(index,1)[0]
    }
}

const getUser = (id) =>{
    return  users.find((user) => user.id === id )
}

const getUsersInRoom = (room) =>{
    room = room.trim().toLowerCase()
    return  users.find((user) => user.room === room )
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}