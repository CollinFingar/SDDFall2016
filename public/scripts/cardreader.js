function cardReaderOnLoad() {

    var errorCallback = function(e) {
        console.log('Reeeejected!', e);
    };

    var video = document.querySelector('video');
    var canvas = document.querySelector('canvas');
    var localMediaStream = null;
    var ctx = canvas.getContext('2d');

    function snapshot() {
      if (localMediaStream) {

        ctx.drawImage(video, 0, 0);
        // "image/webp" works in Chrome.
        // Other browsers will fall back to image/png.
        //document.getElementById('readerimage').src = canvas.toDataURL('png');

        var gh = canvas.toDataURL('image/jpeg');

        var xhttp = new XMLHttpRequest();
        // xhttp.open("POST", "https://api.ocr.space/parse/image")
        // xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        // xhttp.onreadystatechange = function(){
        //     //document.getElementById('readerimage').src = xhttp.responseText;
        //     console.log(xhttp.responseText);
        // };
        // xhttp.send({'apikey':'ab24b36c7788957', 'file':gh, 'language': 'eng'});
        xhttp.open("POST", "http://localhost:3000/api/cardscan", true);
        xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

        xhttp.onreadystatechange = function(){
            document.getElementById('readerimage').src = xhttp.responseText;
        };
        xhttp.send(JSON.stringify({'data': gh}) );
        // Saving Picture
        // var a  = document.createElement('a');
        // a.href = gh;
        //
        // a.download = 'image.png';
        //
        // a.click()
      }
    }

    canvas.width = 640;
    canvas.height = 480;

    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

    if(navigator.getUserMedia) {
        navigator.getUserMedia({audio: false, video: true},
            function(stream) {
                localMediaStream = stream;
                video.src = window.URL.createObjectURL(localMediaStream);

                video.addEventListener('click', snapshot, false);

            }, errorCallback);
    }
    else {
        console.log('getUserMedia is NOT supported');
    }
}
