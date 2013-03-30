var global = (function () {
	var content = "";
	
	return {
		submitForm: function () {
			content = document.getElementById("urlText").value;
			this.isSearchUrl(content);
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
				alert('Is Search Url');
			} else {
				alert('Not Search Url');
			}
		}
	};
})();
