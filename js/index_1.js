var ws = new WebSocket('ws://localhost:3000');
ws.onopen = function() {
    console.log('open');
    ws.send('hello');
};
