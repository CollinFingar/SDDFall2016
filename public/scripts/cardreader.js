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
        
        console.log(result);


        ctx.drawImage(video, 0, 0);
        // "image/webp" works in Chrome.
        // Other browsers will fall back to image/png.
        document.getElementById('readerimage').src = canvas.toDataURL('image/webp');

        var gh = canvas.toDataURL('png');

        // Saving Picture
        // var a  = document.createElement('a');
        // a.href = gh;
        //
        // a.download = 'image.png';
        //
        // a.click()
      }
    }

    canvas.width = 500;
    canvas.height = 500;

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
