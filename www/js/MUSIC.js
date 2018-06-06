var flg = true

// function playSound(){
//      var audio = document.getElementById('sound-file');
//      if(flg){
//           audio.pause();
//           flg = false;
//           audio.currentTime = 0;
//      }else{
//           audio.play();
//           flg = true;
//      }
// }

var media = null;
var mediaTimer = null;
var srcFile = "media/otoware.mp3";

document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
	console.log("ready");
	media = new Media(getPath() + srcFile, onSuccess, onError);
}

function getPath() {
	var str = location.pathname;
	var i = str.lastIndexOf('/');
	return str.substring(0, i + 1);
}
function playSound() {
	// play the media file one time.
	if (flg == true) {
		flg = false;
		media.play();
	} else {
		media.stop();
		flg = true;
	}
}
function setAudioPosition(position) {
	document.getElementById('audio_position').innerHTML = position;
}

function onSuccess() {
	console.log("Successfully initialize a media file.");
}

function onError(error) {
	console.log("Failed to initialize a media file. [ Error code: " + error.code + ", Error message: " + error.message + "]");
}

function volumeChange(){
    //range属性のvalue取得
    var value = document.getElementById( "volume" ).value;
    media.setVolume(value*0.01);
} 
