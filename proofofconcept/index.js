var global = (function () {
	var content = "";
	var possibleSearchUrls = {};
	var searchParam;
	var responseDiv;
	
	return {
		submitForm: function () {
			content = document.getElementById("urlText").value;
			responseDiv = document.getElementById('response');

			if (this.isValidUrl(content) && this.isSearchUrl()) {
				var searchUrl = content.substr(0, content.indexOf("?")) + "?" + searchParam + "=";

				if (possibleSearchUrls.searchUrl) {
					possibleSearchUrls.searchUrl += 1;

					if (possibleSearchUrls.searchUrl == 3) {
						if (confirm("New Search Engine found at '" + searchUrl + "' Add?"))
							responseDiv.innerHTML += '<input type="radio" name="engine" value="' + searchUrl + '">' + searchUrl + '<br />';
					}
				} else {
					possibleSearchUrls.searchUrl = 1;
				}

			} else {
			}
		},

		isSearchUrl: function () {
			var validParams = ["q", "query", "search"];

			if (validParams.some(
						function (name) {
							var param = decodeURI(
								(RegExp(name + '=' + '(.+?)(&|$)').exec(content)||[,null])[1]
								);
							
							if (param != "null") searchParam = name;	
							return (param == "null") ? false : param;
						}
						)
			   )
			{
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
