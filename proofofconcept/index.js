var global = (function () {
	var content = "";
	var possibleSearchUrls = {};
	var searchParam;
	var responseDiv;
	var engineDiv;

	return {
		submitForm: function () {
			content = document.getElementById('urlText').value;
			responseDiv = document.getElementById('response');
			engineDiv = document.getElementById('engines');

			if (this.isValidUrl(content) && this.isSearchUrl()) {
				var searchUrl = content.substr(0, content.indexOf("?")) + "?" + searchParam + "=";

				if (possibleSearchUrls[searchUrl]) {
					possibleSearchUrls[searchUrl] += 1;

					if (possibleSearchUrls[searchUrl] == 3) {
						if (confirm("New Search Engine found at '" + searchUrl + "' Add?")) {
							engineDiv.innerHTML += '<input type="radio" name="engine" value="' + searchUrl + '">' + searchUrl + '<br />';
							responseDiv.innerHTML = 'Added Search URL.';
						}
					} else {
						responseDiv.innerHTML = '';
					}

				} else {
					responseDiv.innerHTML = '';
					possibleSearchUrls[searchUrl] = 1;
				}

			} else if (!this.isValidUrl(content)) {
				responseDiv.innerHTML = 'Invalid URL.';
			} else {
				responseDiv.innerHTML = 'Added URL.';
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

var search = (function () {
	var engineDiv;
	var responseDiv;
	var query;

	return {
		search: function () {
			query = document.getElementById('searchText').value;
			responseDiv = document.getElementById('response');
			engineDiv = document.getElementById('engines');

			if (engineDiv.innerHTML) {
				var activeEngine = this.activeRadioButton();
				window.open(activeEngine + query, '_blank').focus();
			}
		},

		activeRadioButton: function() {
			var engines = document.getElementsByName('engine');

			for (var count = 0; count < engines.length; count++) {
				if (engines[count].checked) {
					return engines[count].value;
				}
			}
		}
	};
})();
