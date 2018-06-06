
//infowindowの中身 DOM形式にしてaddDomListenerを使えるようにする
var boxTexts = []
var data = []
var markers = []
var infobox
var map
var obj, tempBoxText, h4, tempText, table, tr, td, img, input;

var distanceMatrixService = new google.maps.DistanceMatrixService();

var directionsService = new google.maps.DirectionsService;
var directionsRenderer = new google.maps.DirectionsRenderer;

//テスト用 実際はSQL文でピン情報を取ってくる

//shrink1
// data.push({
// 	latlng: { lat: 34.703615, lng: 135.509339 },
// 	title: "梅田の家",
// 	pic: 'img/test.jpg',
// 	tag: ['洋式', '和式']
// });
// data.push({
// 	latlng: { lat: 34.6756075, lng: 135.5573662 },
// 	title: "矢原の家",
// 	pic: 'img/test3.png',
// 	tag: ['洋式', 'ウォシュレット']
// });

//shrink2
data.push({
	latlng: { lat: 34.703615, lng: 135.509339 },
	title: "梅田の家",
	pic: 'img/test.jpg',
	you: true,
	wa: true,
	washlet: false
});
data.push({
	latlng: { lat: 34.6756075, lng: 135.5573662 },
	title: "矢原の家",
	pic: 'img/test3.png',
	you: true,
	wa: false,
	washlet: true
});

// マップ表示初期処理
function initialize() {
	var mapOptions = {
		center: new google.maps.LatLng(34.703615, 135.509339),    //地図上で表示させる緯度経度
		zoom: 14,											//地図の倍率
		minZoom: 10,									//ズームアウト制限
		mapTypeId: google.maps.MapTypeId.ROADMAP,                  //地図の種類
		mapTypeControl: false,						//航空写真とかのアレ削除
		zoomControl: false,								//ズームコントローラ削除
		fullscreenControl: false,							//フルスクリーンコントローラ削除
		streetViewControl: true							//ストリートビューコントローラの表示
	};

	map = new google.maps.Map(document.getElementById("map_canvas"),
		mapOptions);
	var simpleMapStyle;
	// POI を非表示にするマップタイプを定義
	simpleMapStyle = new google.maps.StyledMapType([
		{
			featureType: "poi",
			elementType: "labels",
			stylers: [
				{ visibility: "off" }
			]
		}
	], { name: "Simple Map" });
	// マップタイプを追加して設定
	map.mapTypes.set("simple_map", simpleMapStyle);
	map.setMapTypeId("simple_map");

	dispMarkers(data);

	google.maps.event.addListener(map, "click", function () {
		//mapをタップした時　infowindowを閉じる処理
		infobox.close();
	});
	google.maps.event.addListener(map, "bounds_changed", function (arguments) {
		//ビューポート変更時
		//ここにポートレート+αの範囲指定のSQL文書いてピンの数を減らす
		// console.log('unchi')
	})

}

//+押してマーカー追加する方
function addM() {
	var response = map.getCenter();
	navi.pushPage('create.html', {
		data: {
			response: response
		}
	})
	// new google.maps.Marker({ map: map, position: response, });
	// try { response = typeof response == "object" ? JSON.stringify(response) : response; } catch (e) { }
	// responseTextarea = response;
	// console.log(response)
}

//マーカー表示 dataはマーカー情報
function dispMarkers(data) {

	deleteMarkers()

	//初期化処理
	infobox = new InfoBox({
		content: ""
	});

	var len = data.length

	//マーカー作成処理
	for (var i = 0; i < len; i = (i + 1)) {
		(function (i) {
			marker = create_marker({
				map: map,
				position: data[i].latlng,
				title: data[i].title
			})

			markers.push(marker)
			boxTexts.push(createBoxText(data[i].title, data[i].pic, '★★★'))

			markers[i].addListener("click", function () {
				infobox.close();
				infobox = new InfoBox({
					content: boxTexts[i],
					// content: infoboxContent, // 生成したDOMを割り当てる
					pixelOffset: new google.maps.Size(-127, -50), // オフセット値
					alignBottom: true, // 位置の基準
					position: data[i].latlng, // 位置の座標
					boxClass: "gmap-info-window", // 生成したDOMをラップするdivのclass名
					closeBoxMargin: "0px 0px 0px 0px", // 閉じるボタンの位置調整
					closeBoxURL: 'https://placehold.jp/1x1.png'
					// closeBoxURL: 'https://82mou.github.io/infobox/img/close.png'
				});
				infobox.open(map, markers[i]);
				map.panTo(data[i].latlng);
				matrix(data[i].latlng);
			}, false);
			google.maps.event.addDomListener(boxTexts[i], 'click', function () {
				navi.pushPage('detail.html');
			}, false)
		}(i))
	}
}

function create_marker(options) {
	var m = new google.maps.Marker(options);
	return m;
}

function deleteMarkers(idx = null) {
	if (idx == null) {
		//生成済マーカーとルートを削除する
		for (var i = 0; i < markers.length; i++) {
			markers[i].setMap(null);
			directionsRenderer.setMap(null)
		}
		markers = [];
		boxTexts = [];
	} else {
		//生成済マーカーからID指定されたマーカーを削除
		for (var i = 0; i < markers.length; i++) {
			if (idx.indexOf(i) >= 0) {
				markers[i].setMap(null);
			}
		}
	}
}

//directionでルートと時間表示 distanceMatrixで近い順ソート
//ここからdirection API と distanceMatrix てすと originは中崎町
//タップした地点の座標をdestinationに入れルート表示
//Panelを使えば交差点を右などの情報を引っ張れる

function matrix(destination) {

	var origins = [new google.maps.LatLng(34.7069399, 135.5031885)];
	var origin = new google.maps.LatLng(34.7069399, 135.5031885);
	// var destinations = [new google.maps.LatLng(34.6756075, 135.5573662)];
	// var destination = new google.maps.LatLng(34.6756075, 135.5573662);

	directionsService.route({
		origin: origin,
		destination: destination,
		travelMode: google.maps.TravelMode.WALKING
	}, function (response, status) {
		console.log(response);
		if (status == google.maps.DistanceMatrixStatus.OK) {
			// //ルートの所要時間
			// var time = response.route.legs[0].duration.text
			// //ルートの距離
			// var dist = response.route.legs[0].distance.text
			// //start_addressのテキストを変更
			// response.route.legs[0].start_address = '出発地点:'+ start
			// response.route.legs[0].end_address = '目的地点:'+ end + '出発地点からの距離:' + dist + '出発地点からの所要時間:' + time
			directionsRenderer.setMap(map);
			directionsRenderer.setDirections(response);
		}
	});

	directionsRenderer.setOptions({
		suppressMarkers: true,
		// 	suppressPolylines:true,
		// 	suppressInfoWindows:false,
		draggable: true,
		// 	preserveViewport:false
		markerOptions: {
			icon: 'img/test.jpg'
		}
	});

	//そのうち分ける distanceMatrix 距離を出す　現在地から最も近い場所を出せる
	// distanceMatrixService.getDistanceMatrix({
	// 	origins: origins,
	// 	destinations: destinations,
	// 	travelMode: google.maps.TravelMode.WALKING
	// }, function (response, status) {
	// 	if (status == google.maps.DistanceMatrixStatus.OK) {
	// 		var origins = response.originAddresses;
	// 		var destinations = response.destinationAddresses;

	// 		for (var i = 0; i < origins.length; i++) {
	// 			var results = response.rows[i].elements;

	// 			for (var j = 0; j < results.length; j++) {
	// 				var from = origins[i];
	// 				var to = destinations[j];
	// 				// ルート辿った場合の時間(秒)
	// 				var duration = results[j].duration.value;
	// 				// ルートの距離(メートル)
	// 				var distance = results[j].distance.value;
	// 				console.log("from:" + from + "to" + to + "duration" + duration + "distance" + distance);
	// 			}
	// 		}
	// 	}
	// });
	// var umedaPlace = "34.703615,135.509339"
	// var goalPlace = "34.69607,135.51258"
	// var apiKey = "AIzaSyDdS1HNAhjv-G7Q543N4Pbypv_1EDn0BTM"
	// var dMatrix = "https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins="+
	// umedaPlace + "&destinations=" + goalPlace + "&mode=walking&key=" + apiKey
	// var jsonResult = JSON.parse(dMatrix)
	// console.log(jsonResult)
}


function createBoxText(title, pic, rate) {
	tempBoxText = document.createElement("div");
	h4 = document.createElement("h4")
	tempText = document.createTextNode(title)
	h4.appendChild(tempText)
	tempBoxText.appendChild(h4)
	table = document.createElement("table")
	tr = document.createElement("tr")
	td = document.createElement("td")
	td.rowSpan = '4'
	img = document.createElement("img")
	img.src = pic
	img.className = 'img'
	img.setAttribute('height', '100px');
	img.setAttribute('width', '100px');
	td.appendChild(img)
	tr.appendChild(td)
	td = document.createElement("td")
	tempText = document.createTextNode('評価:' + rate)
	td.appendChild(tempText)
	tr.appendChild(td)
	table.appendChild(tr)
	tr = document.createElement('tr')
	td = document.createElement('td')
	tempText = document.createTextNode('清潔度:' + rate)
	td.appendChild(tempText)
	tr.appendChild(td)
	table.appendChild(tr)
	tr = document.createElement('tr')
	td = document.createElement('td')
	tempText = document.createTextNode('営業時間:' + '年中無休')
	td.appendChild(tempText)
	tr.appendChild(td)
	table.appendChild(tr)
	tr = document.createElement('tr')
	td = document.createElement('td')
	input = document.createElement('input')
	input.type = 'button'
	input.value = '詳細'
	input.onclick = 'pushDetail()'
	td.appendChild(input)
	tr.appendChild(td)
	table.appendChild(tr)
	tempBoxText.appendChild(table)
	return tempBoxText

	// boxText.innerHTML =
	// 	"<h4 class='firstHeading'>扇町公園のトイレ</h4>" +
	// 	"<table><tr>" +
	// 	"<td rowspan='4'><img src='img/test.jpg' class='img'></img></td>" +
	// 	"<td>評価:★★★</td></tr>" +
	// 	"<tr><td>清潔度:★★★</td></tr>" +
	// 	"<tr><td>営業時間:年中無休</td></tr>" +
	// 	"<tr><td><input type='button' value='詳細' ng-Click='navi.pushPage('detail.html')'></td></tr>" +
	// 	"</table>"
}

function pushDetail() {
	navi.pushPage('detail.html')
}
//ここまで