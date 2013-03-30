var global = (function () {
	var content = "";
	
	return {
		submitForm: function () {
			content = document.getElementById("urlText").value;

			if (this.isValidUrl(content) && this.isSearchUrl(content)) {
				alert("Valid Search Url.");
			} else {
				alert("Not a valid Search Url.");
			}
		},

		isSearchUrl: function () {
			var validParams = ["q", "query", "search"];

			if (validParams.some(
						function (name) {
							var param = decodeURI(
								(RegExp(name + '=' + '(.+?)(&|$)').exec(content)||[,null])[1]
								);
					
							return (param == "null") ? false: param;
						}
						)) {
				return true;
			} else {
				return false;
			}
		},

		isValidUrl: function (url) {
			var urlRe = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
			return urlRe.test(url);
		}
		
	};
})();
