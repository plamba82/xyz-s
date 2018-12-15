var videoElement = document.getElementById("webcamfeed");
var canvas = document.getElementById("snap");
var webSocket   = null;

function getUserMedia(){
    if(navigator.getUserMedia){
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia
        || navigator.mozGetUserMedia || navigator.msGetUserMedia;
        
    } else {
        navigator.getUserMedia = navigator.mediaDevices.getUserMedia;
    }
    if(navigator.getUserMedia){
        navigator.getUserMedia({video: { width: 350, height: 350}, audio: false}, function(stream){

            videoElement.src = window.URL.createObjectURL(stream);
            
        }, function(error){
            //Catch errors and print to the console
            console.log("There was an error in GetUserMedia!!!");
            console.log(error);
        });

        interval = setInterval(publish, 5000);
    }
}
function publish(){
    var context = canvas.getContext('2d');
    context.drawImage(videoElement, 0, 0, 350, 350, 0, 0, 350, 350);
    /*canvas.toBlob(function(blob) {
        console.log("Blob object !!!"+blob);
    });*/
    var jpgImg = canvas.toDataURL("image/jpeg");
        jpgImg = jpgImg.replace('data:image/jpeg;base64,', '');

        //return _base64ToArrayBuffer(jpgImg);
        var bytearray = _base64ToArrayBuffer(jpgImg);
        webSocket.send(bytearray);
        console.log("byte array !!!"+bytearray);
}


function _base64ToArrayBuffer(base64) {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes;
}

function openWSConnection() {

    var webSocketURL = null;
    webSocketURL = "ws://localhost:9000/bridge";
    console.log("openWSConnection::Connecting to: " + webSocketURL);
    try {
        webSocket = new WebSocket(webSocketURL);
        webSocket.onopen = function(openEvent) {
            console.log("WebSocket OPEN: " + JSON.stringify(openEvent, null, 4));
        };
        webSocket.onclose = function (closeEvent) {
            console.log("WebSocket CLOSE: " + JSON.stringify(closeEvent, null, 4));
        };
        webSocket.onerror = function (errorEvent) {
            console.log("WebSocket ERROR: " + JSON.stringify(errorEvent, null, 4));
        };
        webSocket.onmessage = function (messageEvent) {
            var wsMsg = messageEvent.data;
            console.log("WebSocket MESSAGE: " + wsMsg);
            if (wsMsg.indexOf("error") > 0) {
                console.log("incomingMsgOutput:: " + wsMsg.error);
            } else {
                console.log("incomingMsgOutput:: " + wsMsg);
            }
        };
    } catch (exception) {
        console.error(exception);
    }
}
openWSConnection();
getUserMedia();


