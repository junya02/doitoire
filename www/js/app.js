var module = angular.module('my-app', ['onsen']);
module.controller('AppController', function ($scope) {
	this.load = function (page) {
		splitter.content.load(page)
			.then(function () {
				splitter.left.close();
				if (page == 'home.html') {
					initialize();
				}
			});
	};
});

//DOMを読み込み終わった時点で発火
// document.addEventListener("DOMContentLoaded",function(){
// })

//htmlが読み込み終わった後発火
window.addEventListener("load", function () {
	initialize()
})

//Cordovaプラグインを読み込み終わった時点で発火
// document.addEventListener("deviceready",function(){
// })

//onsenUIを読み込み終わった時点で発火
// ons.ready(function () {
// 	console.log('unchi ready');
// });

var inputNumber = 2;
function Changestar() {
	target = document.getElementById("star-rating-front");
	target.style.width = inputNumber + "em";
}
