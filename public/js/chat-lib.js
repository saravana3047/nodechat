const socket = io()

const $messageForm = document.querySelector('#message-from')
const $messageInut = $messageForm.querySelector('input')
const $messageButton = $messageForm.querySelector('button')
const $messages = document.querySelector('#messages')

const $messagesTemplage = document.querySelector('#message-template').innerHTML
const sidebarTemplate   =   document.querySelector('#side-bar').innerHTML
//options

const {username,room} =     Qs.parse(location.search,{ignoreQueryPrefix:true}) 

const autoscroll = () => {
    const $newMessage = $messages.lastElementChild
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    const visibleHeight  = $messages.offsetHeight
    const continerHeight = $messages.scrollHeight
    const scrollOffset = $messages.scrollTop + visibleHeight

    if(continerHeight - newMessageHeight <= scrollOffset){
         $messages.scollTop = $messages.scrollHeight
    }
}
socket.on('message',(message) => {
    console.log(message)

    const html = Mustache.render($messagesTemplage,{
        username :message.username,
        message : message.text,
        createdAt :  moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})
socket.on('roomData',({room,users})=>{
    const html = Mustache.render(sidebarTemplate,{
        room,
        users
    })
    document.querySelector('#sidebar-user').innerHTML = html
})

document.querySelector('#message-from').addEventListener('submit',(e) =>{
    e.preventDefault()

    $messageButton.setAttribute('disabled','disabled')
    const message = e.target.elements.message.value// document.querySelector('input').value
    socket.emit('sendMessage',message, () =>{

        $messageButton.removeAttribute('disabled')
        $messageInut.value=''
        $messageInut.focus()

        console.log('The Message was delivered')
    })
})
// socket.on('countUpdated', (count) =>{
//     console.log('Count is updated' , count)
// })
// document.querySelector('#increment').addEventListener('click', () => {
//     console.log('clicked')
//     socket.emit('increment')
// })
socket.emit('join',{username,room})