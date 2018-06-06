module.controller('ShrinkController', function ($scope) {
	$scope.disabled = true
	var flgsc = false

	$scope.toggleShrink = function () {
		if (flgsc) {
			$scope.checked = false
			$scope.disabled = true

			flgsc = false
		} else {
			$scope.disabled = false
			flgsc = true
		}
	}
})
/*
data.push({
	lat: 34.703615,
	lng: 135.509339,
	title: "梅田の家",
	pic: 'img/test.jpg'
});
data.push({
	lat: 34.6756075,
	lng: 135.5573662,
	title: "矢原の家",
	pic: 'img/test3.png'
});
*/
//実際はdataを引数で
// function shrink1() {
// 	var check = []; //フィルタリングワード
// 	var shrinkElement = document.shrinkForm.shrink
// 	var switchS = document.getElementsByName("cancelS")
// 	if (switchS.checked) {
// 		dispMarkers(data)

// 	} else {


// 		for (var i = 0; i < shrinkElement.length; i = (i + 1)) {
// 			if (shrinkElement[i].checked) {
// 				check.push(shrinkElement[i].value)
// 			}
// 		}

// 		var filteredData = [];　//　フィルタリングしたオブジェクトが格納される配列

// 		_.each(data, function (fData, i) {    // each は配列のすべてをループする
// 			var jadge;
// 			if (check.length > 0) {
// 				jadge = _.every(check, function (checkChild) { // every は配列のすべてが条件を許可したらtrue
// 					return _.find(fData.tag, function (tag) { // findは 配列が一つでも条件を満たせば、true、そこで処理をやめる
// 						return tag === checkChild;
// 					});
// 				});
// 			} else {
// 				jadge = false;
// 			}
// 			if (jadge) {
// 				filteredData.push(fData); // jadgeがtrueのものだけを配列に格納していく
// 			}
// 		});

// 		console.log(filteredData); // [Object, Object] (オブジェクトが入っている)
// 		dispMarkers(filteredData)
// 	}

// }

function shrink() {
	var check = []	//フィルタリングワード
	var shrinkElement = document.shrinkForm.shrink
	var switchS = document.shrinkForm.cancelS

	for (var i = 0; i < shrinkElement.length; i = (i + 1)) {
		if (shrinkElement[i].checked) {
			check.push(shrinkElement[i].value)
		}
	}

	if (!switchS.checked && check.length > 0) {

		var filteredData = [];　//　フィルタリングしたオブジェクトが格納される配列

		_.each(data, function (fData, i) {    // each は配列のすべてをループする
			var jadge;
			if (check.length > 0) {
				jadge = _.every(check, function (checkChild) { // every は配列のすべてが条件を許可したらtrue
					return shrink2_youso(fData, checkChild)
				});
			} else {
				jadge = false;
			}
			if (jadge) {
				filteredData.push(fData); // jadgeがtrueのものだけを配列に格納していく
			}
		});

		console.log(filteredData); // [Object, Object] (オブジェクトが入っている)
		dispMarkers(filteredData)
	} else {
		dispMarkers(data)
	}


}

function shrink2_youso(fData, c) {
	if (c == 'you') {
		return fData.you
	}
	if (c == 'wa') {
		return fData.wa
	}
	if (c == 'washlet') {
		return fData.washlet
	}
}