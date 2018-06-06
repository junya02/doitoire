var tempData = []
var tempRes = 0
module.controller('CreateController', function ($scope, $timeout) {
	$scope.disabled = true
	var flgccSE = false
	$scope.toggleSE = function () {
		if (flgccSE) {
			$scope.disabled = true
			flgccSE = false
		} else {
			$scope.disabled = false
			flgccSE = true
		}
	}

	//写真投稿
	$scope.selectImage = function (num) {
		if (num == 0) {
			navigator.camera.getPicture(success, error, {
				quality: 50,
				destinationType: Camera.DestinationType.DATA_URI,
				sourceType: navigator.camera.PictureSourceType.CAMERA  //値は参考URLを参照
			})
		} else {
			navigator.camera.getPicture(success, error, {
				quality: 50,
				destinationType: Camera.DestinationType.DATA_URI,
				sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY   //値は参考URLを参照
			})
		}
	}
	var success = function (imageData) {
		// 写真データがあれば挿入
		if (typeof (imageData) != 'undefined' && imageData != '') {

			var url = 'http://xxxxx/yyyyy/';
			var params = {};
			params.user_id = 'zzzzz';
			uploadImage('image', url, imageData, params);
		}
	}

	//写真取得失敗
	var error = function () {

	}

	//アップロード成功時
	var win = function (r) {
		console.log("Code = " + r.responseCode);
		console.log("Response = " + r.response);
		console.log("Sent = " + r.bytesSent);
	}

	//アップロード失敗時
	var fail = function (error) {
		alert("An error has occurred: Code = " + error.code);
		console.log("upload error source " + error.source);
		console.log("upload error target " + error.target);
	}

	//サーバーへのアップロード処理
	/**
	* fileKey 変数名
	* url 送信先サーバーのurl
	* fileUrl ローカルの画像url
	* params 送信する値
	*/
	function uploadImage(fileKey, url, fileUrl, params) {
		var options = new FileUploadOptions();
		options.fileKey = fileKey;
		options.fileName = fileUrl.substr(fileUrl.lastIndexOf('/') + 1);
		options.mimeType = "text/plain";
		options.params = params;

		var ft = new FileTransfer();
		ft.upload(fileUrl, encodeURI(url), win, fail, options);
	}
});

document.addEventListener('init', function (event) {
	var page = event.target;

	if (page.id == 'create.html') {
		tempRes = page.data.response
	}
});

//以下データ転送処理
function sendData() {
	tempData = []
	var element = document.getElementById("createRadioTarget")
	var waValue = convertData(element.wa.value)
	var youValue = convertData(element.you.value)
	var washletValue = convertData(element.washlet.value)
	console.log(waValue + " " + youValue + " " + washletValue + " " + tempRes.lat())

	// tempData = [{
	// 	latlng: tempRes,
	// 	title: document.getElementById("cToiletName").value,
	// 	pic: 'img/test.jpg',
	// 	wa: waValue,
	// 	you: youValue,
	// 	washlet: washletValue
	// }]

	db.collection("temp").add({
		latlng: { lat: tempRes.lat(), lng: tempRes.lng() },
		title: document.getElementById("cToiletName").value,
		pic: 'img/test.jpg',
		wa: waValue,
		you: youValue,
		washlet: washletValue
	})

}

//書き出し //reviews表に データの追加
function unkotest() {
	db.collection("temp").add({
		data
		//ここからデータの内容
		// 	"comment": "test",
		// 	"facility": {
		// 		"japanese_style": "5",
		// 		"multipurpose": 4,
		// 		"ostomate": 2,
		// 		"ticket_gate": false,
		// 		"western_style": 4,
		// 		"washlet": 2
		// 	},
		// 	"name": "testuser11",
		// 	"regular_holiday": "月火水木金土",
		// 	"toilet_id": "test114514"
	});
}

function convertData(num) {
	if (num == "-1") {
		return null
	} else if (num == "1") {
		return true
	} else {
		return false
	}
}