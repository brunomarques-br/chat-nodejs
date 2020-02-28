const express = require('express');
const path = require('path');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', (req, res) => {
    res.render('index.html');
});

//array de armazenamento de mensagens
let messages = [];

io.on('connection', socket => {
    console.log('Socket conectado:' + socket.id );
    
    socket.emit('previousMessage', messages);

    socket.on('sendMessage', data => {
        messages.push(data);
        //enviando msg para todos os sockets conectados na aplicação
        socket.broadcast.emit('receivedMessage', data);
    })
});

server.listen(3000);