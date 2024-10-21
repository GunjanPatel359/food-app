const { io }=require('socket.io-client')

const URL = 'http://localhost:4000';

const socket=io(URL,{
    // autoConnect:false
})

module.exports=socket