var transit = (function () {
    return {
        initMap : function (selector, stopsList, routePoints) {
            var mapDet = {
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            $(selector + "> #init").remove();

            $(selector).append("<div id=\"timezone\"></div>")
                       .append("<div id=\"transitMap\"></div>")
                       .append("<div id=\"toggleLog\">Start Logging</div>");

            $(selector + "> #transitMap").css({
                'position': 'absolute',
                'width': '100%',
                'height': '100%',
            });

            $(selector + "> #timezone").css({
                'position': 'absolute',
                'bottom': '3%',
                'right': '0.8%',
                'z-index': '99',
                'font-weight': 'bold',
            });

            $(selector + "> #toggleLog").css({
                'position': 'absolute',
                'bottom': '4%',
                'left': '1%',
                'z-index': '99',
                'color': '#800000',
                '-webkit-box-shadow': '0px 0px 8px rgba(0, 0, 0, 0.3)',
                '-moz-box-shadow': '0px 0px 8px rgba(0, 0, 0, 0.3)',
                'box-shadow': '0px 0px 8px rgba(0, 0, 0, 0.3)',
                'background-color': 'hsl(0, 0%, 90%)',
                'border-radius': '10px',
                'padding': '10px',
                'font-weight': 'bold',
                'cursor': 'pointer',
            });

            $(selector + "> #toggleLog").click(function () {
                transit.initTicker(selector);
                var tickerDiv = selector + "> #tickerDiv";
                $(tickerDiv).css('display', 'inline');
                $(tickerDiv).fadeOut(5000);
            });

            transit.initStatus(selector);
            var map = new google.maps.Map(document.getElementById('transitMap'), mapDet);
            transit.initSearch(selector, stopsList, routePoints, map);

            return map;
        },

        initTicker : function (selector) {
            $(selector).append('<div id="tickerDiv"><span style="color:#800000"><strong>Transit Log</span>' +
                               '<br /><br /></strong><div id="ticker"></div><br /><div id="tickerCtrl">' +
                               '<span id="clear"><strong>Reset</strong></span> | ' +
                               '<span id="stop"><strong>Stop logging</span></div></div>');
            var tickerDiv = selector + "> #tickerDiv";
            var ticker = tickerDiv + "> #ticker";
            var tickerCtrl = tickerDiv + "> #tickerCtrl";
            var clear = tickerCtrl + "> #clear";
            var stop = tickerCtrl + "> #stop";
            $(selector + "> #toggleLog").css('display', 'none');

            $(tickerDiv).css({
                'position': 'absolute',
                'bottom': '1%',
                'left': '1%',
                'width': '40%',
                'z-index': '99',
                'background-color': 'hsl(0, 0%, 90%)',
                'height': '38%',
                '-webkit-box-shadow': '0px 0px 8px rgba(0, 0, 0, 0.3)',
                '-moz-box-shadow': '0px 0px 8px rgba(0, 0, 0, 0.3)',
                'box-shadow': '0px 0px 8px rgba(0, 0, 0, 0.3)',
                'border-radius': '10px',
                'padding': '10px',
                'text-align': 'center',
                'overflow-y': 'auto',
                'overflow-x': 'auto',
                'display': 'none'
            });

            $(ticker).css({
                'height': '75%',
                'overflow-y': 'auto',
                'overflow-x': 'auto',
                'text-align': 'left',
                'line-height': '150%'
            });

            $(tickerCtrl).css({
                'cursor': 'pointer',
                'color': '#800000'
            });

            $(clear).click(function () {
                $(ticker).html('');
            });

            $(stop).click(function () {
                $(tickerDiv).remove();
                $(selector + "> #toggleLog").css('display', 'inline');
            });

            $(tickerDiv).hover(function () {
                $(tickerDiv).stop(true, true);
                $(tickerDiv).css('display', 'inline');
            }, function () {
                $(tickerDiv).fadeOut(5000);
            });
        },

        initStatus : function (selector) {
            $(selector).append('<div id="status"></div>');

            $(selector + '> #status').css({
                'position': 'absolute',
                'bottom': '3%',
                'right': '0.8%',
                'z-index': '99',
                'background-color': 'hsl(0, 0%, 90%)',
                '-webkit-box-shadow': '0px 0px 8px rgba(0, 0, 0, 0.3)',
                '-moz-box-shadow': '0px 0px 8px rgba(0, 0, 0, 0.3)',
                'box-shadow': '0px 0px 8px rgba(0, 0, 0, 0.3)',
                'border-radius': '5px',
                'padding': '10px',
                'display': 'none'
            });
        },

        initSearch : function (selector, stopsList, routePoints, map) {
            $('head').append('<link rel="stylesheet" ' +
                             'href="http://code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.css" />');

            $.getScript("http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min.js", function () {
                $(selector).append("<input type=\"text\" id=\"search\" " +
                                    "placeholder=\"Search for a stop and select it from the dropdown.\">");

                $(selector + "> #search").css({
                    'position': 'absolute',
                    'width': '50%',
                    'height': '13px',
                    'top': '1%',
                    'left': '25%',
                    'z-index': '99',
                    'border-radius': '5px',
                    'padding': '5px',
                });

                $(selector + "> #search").autocomplete({
                    source: stopsList,
                    select: function (event, ui) {
                        var coordsOfItem = routePoints[ui.item.value];
                        var zeroIn = new google.maps.LatLng(coordsOfItem.x, coordsOfItem.y);
                        map.setZoom(15);
                        map.setCenter(zeroIn);
                    }
                });

                $(selector + "> #search").focus(function () {
                    $(this).val('');
                });

                $('.ui-autocomplete').css({
                    'max-height': '50%',
                    'overflow-y': 'auto',
                    'overflow-x': 'hidden',
                    'padding-right': '20px'
                });
            });
        },

        initMarker : function (coords, selector, map, color) {
            var markerPos = new google.maps.LatLng(coords.x, coords.y);

            var markerIcon = {
                path: google.maps.SymbolPath.CIRCLE,
                fillColor: color,
                fillOpacity: 0.8,
                scale: 7
            };

            var marker = {
                position: markerPos,
                icon: markerIcon
            };

            marker = new google.maps.Marker(marker);

            return marker;
        },

        onMarkerMouseover : function (selector, map, marker, mouseoverText) {
            google.maps.event.clearListeners(marker, 'mouseover');
            google.maps.event.clearListeners(marker, 'mouseout');

            if (!transit.isMobileDevice()) {
                google.maps.event.addListener(marker, 'mouseover', function () {
                    $(selector + '> #status').stop(true, true);
                    $(selector + '> #status').css('display', 'inline');
                    $(selector + '> #status').html(mouseoverText);
                });

                google.maps.event.addListener(marker, 'mouseout', function () {
                    $(selector + '> #status').css('display', 'none');
                });
            } else {
                mouseoverText = '<div style="font-size:20px;">' + mouseoverText + '</div>';
            }

            if (typeof marker.infoWindow != "undefined") {
                marker.infoWindow.setContent(mouseoverText);
            } else {
                marker.infoWindow = new google.maps.InfoWindow({
                    content: mouseoverText
                });

                google.maps.event.addListener(marker, 'click', function () {
                    marker.infoWindow.open(map, marker);
                });

                google.maps.event.addListener(map, 'click', function () {
                    marker.infoWindow.close();
                });
            }
        },

        overlayKml : function (kmlUrl, map) {
            var kmlOptions = {
                map: map
            };
            var kmlLayer = new google.maps.KmlLayer(kmlUrl, kmlOptions);
        },

        kmlPromise : function (kmlUrl) {
            return $.ajax({
                url: kmlUrl,
                dataType: 'xml',
                async: true
            });
        },

        jsonPromise : function (jsonUrl) {
            return $.ajax({
                url: jsonUrl,
                dataType: 'json',
                async: true
            });
        },

        routeParser : function (data) {
            var lines = {};
            var points = {};
            var stopNames = new Array();
            var xmlNode = $('Document', data);

            xmlNode.find('Placemark > LineString > coordinates').each(function () {
                var simPts = transit.trim($(this).text()).split(' ');
                var grpPts = new Array();
                var routeName = $(this).closest('Placemark').find('name').text().toLowerCase();
                for (eachPt in simPts) {
                    var xy = transit.strip(simPts[eachPt]).split(',');
                    grpPts.push({ x: parseFloat(xy[1], 10), y: parseFloat(xy[0], 10) });
                }
                lines[transit.trim(routeName)] = grpPts;
            });

            xmlNode.find('Point').each(function () {
                var parentTag = $(this).closest('Placemark');

                var xy = transit.strip(parentTag.find('Point').text()).split(',');
                var stopName = transit.trim(parentTag.find('name').text()).toLowerCase();
                stopNames.push(stopName);

                points[stopName] = {
                    x: parseFloat(xy[1], 10),
                    y: parseFloat(xy[0], 10)
                };
            });

            return {
                "lines": lines,
                "points": points,
                "stopnames": stopNames
            };
        },

        vehicleParser : function (data) {
            var vehicleObj = {};

            vehicleObj.timezone = data.timezone;
            vehicleObj.vehicles = data.vehicles;
            vehicleObj.stopinterval = data.defaultstopinterval;

            return vehicleObj;
        },

        scheduler : function (vehicleObj, routes, timezone, stopinterval) {
            var vehicleArrivals = {};
            var vehicleDepartures = {};
            var vehicleTravelTimes = new Array();
            var vehicleTravelTimesAsStrings = new Array();
            var stopsObj = vehicleObj.stops;
            var noOfStops = vehicleObj.stops.length;
            var firstStop = stopsObj[0];
            var firstStopName = firstStop.name;

            if (typeof firstStop.departure == 'undefined')
                throw new Error(vehicleObj.name + " is missing its initial departure time at " + firstStopName);

            var startTime = transit.parseTime(firstStop.departure.time, firstStop.departure.day);
            var vehicleStopCoords = {};
            var points = routes.points;
            var opLine = routes.lines[vehicleObj.route.toLowerCase()];

            if (typeof opLine == "undefined")
                throw new Error(vehicleObj.name + "'s route " + vehicleObj.route + " doesn't exist.");

            vehicleTravelTimesAsStrings.push(firstStop.departure.time);
            vehicleDepartures[startTime - startTime] = firstStopName;
            vehicleTravelTimes.push(startTime - startTime);

            try {
                vehicleStopCoords[firstStopName] = transit.resolvePointToLine(opLine,
                                                                              points[firstStopName.toLowerCase()]);
            } catch (err) {
                throw new Error("The stop " + firstStopName + " in vehicle " +
                                vehicleObj.name + "'s schedule wasn't found in its route.");
            }

            for (var eachStop = 1; eachStop < noOfStops - 1; eachStop++) {
                var temp = stopsObj[eachStop];
                var prevStop = stopsObj[eachStop - 1];
                var tempName = temp.name;

                if (typeof temp.arrival == 'undefined') {
                    var currDepartureTime = transit.parseTime(temp.departure.time, temp.departure.day) -
                                            startTime;
                    var currArrivalTime = currDepartureTime - transit.parseTime(stopinterval, 1);
                    temp.arrival = {};
                    temp.arrival.time = transit.secondsToHours(currArrivalTime + startTime).replace('+', '');
                    temp.arrival.day = Math.ceil((currArrivalTime + startTime) / 86400);
                } else {
                    var currArrivalTime = transit.parseTime(temp.arrival.time, temp.arrival.day) -
                                          startTime;
                }

                if (typeof temp.departure == 'undefined') {
                    var currArrivalTime = transit.parseTime(temp.arrival.time, temp.arrival.day) - startTime;
                    var currDepartureTime = currArrivalTime + transit.parseTime(stopinterval, 1);
                    temp.departure = {};
                    temp.departure.time = transit.secondsToHours(currDepartureTime + startTime).replace('+', '');
                    temp.departure.day = Math.ceil((currDepartureTime + startTime) / 86400);
                } else {
                    var currDepartureTime = transit.parseTime(temp.departure.time, temp.departure.day) -
                                            startTime;
                }

                vehicleTravelTimesAsStrings.push(temp.arrival.time, temp.departure.time);
                vehicleArrivals[currArrivalTime] = tempName;
                vehicleDepartures[currDepartureTime] = tempName;
                vehicleTravelTimes.push(currArrivalTime, currDepartureTime);

                try {
                    vehicleStopCoords[tempName] = transit.resolvePointToLine(opLine,
                                                                             points[tempName.toLowerCase()]);
                } catch (err) {
                    throw new Error("The stop " + tempName + " in vehicle " +
                                    vehicleObj.name + "'s schedule wasn't found in its route.");
                }
            }

            var lastStop = stopsObj[noOfStops - 1];
            var lastStopName = lastStop.name;

            if (typeof lastStop.arrival == 'undefined')
                throw new Error(vehicleObj.name + " is missing its final arrival time at " + lastStopName);

            var endTime = transit.parseTime(lastStop.arrival.time, lastStop.arrival.day) - startTime;
            vehicleArrivals[endTime] = lastStopName;
            vehicleTravelTimesAsStrings.push(lastStop.arrival.time);
            vehicleTravelTimes.push(endTime);

            if (!transit.isSorted(vehicleTravelTimes))
                throw new Error(vehicleObj.name + " seems to be going backwards in time.");

            try {
                vehicleStopCoords[lastStopName] = transit.resolvePointToLine(opLine,
                                                                             points[lastStopName.toLowerCase()]);
            } catch (err) {
                throw new Error("The stop " + lastStopName + " in vehicle " +
                                vehicleObj.name + "'s schedule wasn't found in its route.");
            }

            // Thanks to https://gist.github.com/bobspace/2712980 for the color list.
            var colors = ["AliceBlue","AntiqueWhite","Aqua","Aquamarine","Azure","Beige","Bisque","Black",
                          "BlanchedAlmond","Blue","BlueViolet","Brown","BurlyWood","CadetBlue","Chartreuse",
                          "Chocolate","Coral","CornflowerBlue","Cornsilk","Crimson","Cyan","DarkBlue","DarkCyan",
                          "DarkGoldenRod","DarkGray","DarkGrey","DarkGreen","DarkKhaki","DarkMagenta",
                          "DarkOliveGreen","Darkorange","DarkOrchid","DarkRed","DarkSalmon","DarkSeaGreen",
                          "DarkSlateBlue","DarkSlateGray","DarkSlateGrey","DarkTurquoise","DarkViolet","DeepPink",
                          "DeepSkyBlue","DimGray","DimGrey","DodgerBlue","FireBrick","FloralWhite","ForestGreen",
                          "Fuchsia","Gainsboro","GhostWhite","Gold","GoldenRod","Gray","Grey","Green","GreenYellow",
                          "HoneyDew","HotPink","IndianRed","Indigo","Ivory","Khaki","Lavender","LavenderBlush",
                          "LawnGreen","LemonChiffon","LightBlue","LightCoral","LightCyan","LightGoldenRodYellow",
                          "LightGray","LightGrey","LightGreen","LightPink","LightSalmon","LightSeaGreen",
                          "LightSkyBlue","LightSlateGray","LightSlateGrey","LightSteelBlue","LightYellow","Lime",
                          "LimeGreen","Linen","Magenta","Maroon","MediumAquaMarine","MediumBlue","MediumOrchid",
                          "MediumPurple","MediumSeaGreen","MediumSlateBlue","MediumSpringGreen","MediumTurquoise",
                          "MediumVioletRed","MidnightBlue","MintCream","MistyRose","Moccasin","NavajoWhite","Navy",
                          "OldLace","Olive","OliveDrab","Orange","OrangeRed","Orchid","PaleGoldenRod","PaleGreen",
                          "PaleTurquoise","PaleVioletRed","PapayaWhip","PeachPuff","Peru","Pink","Plum","PowderBlue",
                          "Purple","Red","RosyBrown","RoyalBlue","SaddleBrown","Salmon","SandyBrown","SeaGreen",
                          "SeaShell","Sienna","Silver","SkyBlue","SlateBlue","SlateGray","SlateGrey","Snow",
                          "SpringGreen","SteelBlue","Tan","Teal","Thistle","Tomato","Turquoise","Violet","Wheat",
                          "White","WhiteSmoke","Yellow","YellowGreen"];

            vehicleObj.color = colors[Math.floor(Math.random() * colors.length)];

            return {
                "name": vehicleObj.name,
                "info": vehicleObj.info,
                "color": vehicleObj.color,
                "starts": startTime,
                "baseinfo": transit.createBaseInfo(vehicleObj.name, vehicleObj.info,
                                                   firstStopName, firstStop.departure.time,
                                                   lastStopName, lastStop.arrival.time),
                "route": opLine,
                "stops": vehicleStopCoords,
                "days": lastStop.arrival.day - firstStop.departure.day,
                "arrivals": vehicleArrivals,
                "departures": vehicleDepartures,
                "traveltimes": vehicleTravelTimes,
                "traveltimesasstrings": vehicleTravelTimesAsStrings
            };
        },

        strip : function (string) {
            return string.replace(/\s+/g, '').replace(/\n/g, '');
        },

        trim : function (string) {
            return string.replace(/^\s+|\s+$/g, '');
        },

        isSorted : function (list) {
            for (var i = 0; i < list.length - 1; i++) {
                if (list[i] > list[i+1]) return false;
            }

            return true;
        },

        resolvePointToLine : function (line, point) {
            if (point.x == line[0].x && point.y == line[0].y)
                return point;
            var closestDist = transit.linearDist(line[0], point).toFixed(20);
            var currPt = line[0];
            for (var count = 1; count < line.length; count++) {
                if (point.x == line[count].x && point.y == line[count].y)
                    return point;

                var currDist = transit.linearDist(line[count], point).toFixed(20);

                if (closestDist > currDist) {
                    currPt = line[count];
                    closestDist = currDist;
                }
            }

            return currPt;
        },

        // Reimplemented from http://www.movable-type.co.uk/scripts/latlong.html
        haversine : function (sourceCoords, targetCoords) {
            var R = 6371; // km

            /** Converts numeric degrees to radians */
            if (typeof(Number.prototype.toRad) === "undefined") {
              Number.prototype.toRad = function() {
                return this * Math.PI / 180;
              }
            }

            var dLat = (targetCoords.x - sourceCoords.x).toRad();
            var dLon = (targetCoords.y - sourceCoords.y).toRad();
            var lat1 = sourceCoords.x.toRad();
            var lat2 = targetCoords.x.toRad();

            var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            var d = R * c;
            return d;
        },

        linearDist : function (sourceCoords, targetCoords) {
            return Math.sqrt(Math.pow((targetCoords.x - sourceCoords.x), 2) +
                             Math.pow((targetCoords.y - sourceCoords.y), 2));
        },

        percentDist : function (sourceCoords, targetCoords, percentage) {
            var newCoords = {};
            var ratio = percentage / 100;
            newCoords.x = (1 - ratio) * sourceCoords.x + ratio * targetCoords.x;
            newCoords.y = (1 - ratio) * sourceCoords.y + ratio * targetCoords.y;
            return newCoords;
        },

        percentInRange : function (lower, upper, target) {
            return ((target - lower) / (upper - lower)) * 100;
        },

        pointsBetweenStops : function (route, start, end) {
            var startingAt = transit.indexOfCoordsObjInList(route, start);
            var endingAt = transit.indexOfCoordsObjInList(route, end);

            if (startingAt > endingAt)
                return route.slice(endingAt, startingAt + 1).reverse();
            else
                return route.slice(startingAt, endingAt + 1);
        },

        indexOfCoordsObjInList : function (list, coords) {
            for (var i = 0; i < list.length; i++) {
                if (coords.x == list[i].x && coords.y == list[i].y)
                    return i;
            }

            return -1;
        },

        hashOfPercentDists : function (points) {
            var start = points[0];
            var routeLength = points.length;
            var end = points[routeLength - 1];
            var distanceHash = {
                0 : points[0]
            };
            var distances = [0];
            var totalDist = 0;
            var percentages = new Array();

            for (var x = 0; x < routeLength - 1; x++) {
                totalDist += transit.linearDist(points[x], points[x + 1]);
                distances.push(totalDist);
            }

            for (var x = 0; x < distances.length; x++) {
                var percentage = transit.percentInRange(0, totalDist, distances[x]);
                percentages.push(percentage);
                distanceHash[percentage] = points[x];
            }

            return {
                "percentages": percentages,
                "hash": distanceHash
            };
        },

        // Variant of binary search that returns enclosing elements of searchElement in array.
        enclosure : function (searchElement) {
            var minIndex = 0;
            var maxIndex = this.length - 1;
            var currentIndex;
            var currentElement;

            while (minIndex <= maxIndex) {
                currentIndex = (minIndex + maxIndex) / 2 | 0;
                currentElement = this[currentIndex];

                if (currentElement < searchElement) {
                    minIndex = currentIndex + 1;
                }
                else if (currentElement > searchElement) {
                    maxIndex = currentIndex - 1;
                }
                else {
                    return currentIndex;
                }
            }

            if (searchElement > this[currentIndex]) {
                if (typeof this[currentIndex + 1] != 'undefined')
                    return [currentIndex, currentIndex + 1];
                else
                    return -1;
            } else {
                if (typeof this[currentIndex - 1] !=  'undefined')
                    return [currentIndex - 1, currentIndex];
                else
                    return -1;
            }
        },

        parseTimeZone : function (timezone) {
            var timeOffset = new Date().getTimezoneOffset();

            var tzS = timezone.split(':');
            tzS = tzS.map(function (x) { return parseInt(x, 10); });

            if (tzS.length < 3)
                tzS[2] = 0;

            if (tzS[0] < 0) {
                tzS[1] *= -1;
                tzS[2] *= -1;
            }

            return tzS[0] * 3600 + tzS[1] * 60 + tzS[2] + timeOffset * 60;
        },

        dayInTimezone : function (timezone) {
            var difference = Math.ceil((transit.parseTime(transit.currTime(), 1) +
                                        transit.parseTimeZone(timezone)) / 86400) - 1;
            var currDay = new Date().getDay();
            var offset = currDay + difference;

            var dayIndex = (offset < 0) ? 6 + (offset % 7) : offset % 7;

            return dayIndex;
        },

        parseTime : function (timeString, day) {
            var hmsRe = /^(?:2[0-3]|[01]?[0-9]):[0-5]?[0-9](:[0-5]?[0-9])?$/;

            if (!hmsRe.test(timeString))
                throw new Error(timeString + " is not a valid timestring.");

            var hms = timeString.split(':');
            hms = hms.map(function (x) { return parseInt(x, 10); });

            if (hms.length < 3)
                hms[2] = 0;

            return hms[0] * 3600 + hms[1] * 60 + hms[2] + (day - 1) * 86400;
        },

        currTime : function () {
            var t = new Date();
            return t.getHours().toString() + ":" +
                   t.getMinutes().toString() + ":" +
                   t.getSeconds().toString();
        },

        secondsToHours : function (timeInSeconds) {
            var absTime = Math.abs(timeInSeconds);
            var hours = parseInt(absTime / 3600 ) % 24;
            var minutes = parseInt(absTime / 60 ) % 60;
            var seconds = absTime % 60;

            var result = (hours < 10 ? "0" + hours : hours) + ":" +
                         (minutes < 10 ? "0" + minutes : minutes) + ":" +
                         (seconds  < 10 ? "0" + seconds : seconds);

            if (timeInSeconds >= 0)
                return "+" + result;
            else
                return "-" + result;
        },

        estimateCurrentPosition : function (vehicleObj, timezone) {
            var arrivals = vehicleObj.arrivals;
            var departures = vehicleObj.departures;
            var travelTimes = vehicleObj.traveltimes;
            var travelTimesAsStrings = vehicleObj.traveltimesasstrings;
            var noOfDays = vehicleObj.days;
            var starts = vehicleObj.starts;
            var route = vehicleObj.route;
            var stops = vehicleObj.stops;
            var positions = new Array();

            var timeOffset = new Date().getTimezoneOffset() * 60;
            var time = transit.currTime();

            for (var i = 1; i <= noOfDays + 1; i++) {
                var range = transit.enclosure.call(travelTimes, transit.parseTime(time, i) +
                                                   (transit.parseTimeZone(timezone) % 86400) - starts);

                var currPos = {
                    "stationaryAt": "",
                    "departureTime": 0,
                    "leaving": "",
                    "approaching": "",
                    "leftTime": 0,
                    "approachTime": 0,
                    "started": false,
                    "completed": false,
                    "justReached": false,
                    "justLeft": false,
                    "currentCoords": null
                };

                if (range[0] % 2 == 0 && range.length == 2) {
                    var leftTime = travelTimes[range[0]];
                    var approachTime = travelTimes[range[1]];
                    currPos.leftTime = travelTimesAsStrings[range[0]];
                    currPos.approachTime = travelTimesAsStrings[range[1]];
                    var leavingStop = departures[leftTime];
                    var approachingStop = arrivals[approachTime];
                    currPos.leaving = leavingStop;
                    currPos.approaching = approachingStop;
                    var leavingStopCoords = stops[leavingStop];
                    var approachingStopCoords = stops[approachingStop];
                    var timePercent = transit.percentInRange(travelTimes[range[0]], travelTimes[range[1]],
                                                             transit.parseTime(time, i) +
                                                             (transit.parseTimeZone(timezone) % 86400) - starts);
                    var pointsFromLtoA = transit.pointsBetweenStops(route, leavingStopCoords,
                                                                    approachingStopCoords);
                    var ps = transit.hashOfPercentDists(pointsFromLtoA);
                    var distHash = ps.hash;

                    var distList = ps.percentages;
                    var timeRange = transit.enclosure.call(distList, timePercent);
                    var bef = distList[timeRange[0]];
                    var af = distList[timeRange[1]];
                    var percent = transit.percentInRange(bef, af, timePercent);
                    currPos.currentCoords = transit.percentDist(distHash[bef], distHash[af], percent);
                } else {
                    if (range[0] % 2 != 0 && range.length == 2) {
                        currPos.stationaryAt = departures[travelTimes[range[1]]];
                        currPos.departureTime = travelTimesAsStrings[range[1]];
                        currPos.currentCoords = stops[currPos.stationaryAt];
                    } else if (range > 0 && range < travelTimes.length - 1) {
                        if (range % 2 != 0) {
                            currPos.justReached = true;
                            currPos.stationaryAt = departures[travelTimes[range + 1]];
                            currPos.departureTime = travelTimesAsStrings[range + 1];
                            currPos.currentCoords = stops[currPos.stationaryAt];
                        } else {
                            currPos.justLeft = true;
                            currPos.stationaryAt = departures[travelTimes[range]];
                            currPos.approachingStop = arrivals[travelTimes[range + 1]];
                            currPos.departureTime = travelTimesAsStrings[range];
                            currPos.approachTime = travelTimesAsStrings[range + 1];
                            currPos.currentCoords = stops[currPos.stationaryAt];
                        }
                    } else if (range == travelTimes.length - 1) {
                        currPos.completed = true;
                        currPos.stationaryAt = arrivals[travelTimes[range]];
                        currPos.currentCoords = stops[currPos.stationaryAt];
                    } else if (range == 0) {
                        currPos.started = true;
                        currPos.stationaryAt = departures[travelTimes[range]];
                        currPos.approachingStop = arrivals[travelTimes[range + 1]];
                        currPos.approachTime = travelTimesAsStrings[range + 1];
                        currPos.currentCoords = stops[currPos.stationaryAt];
                    }
                }

                positions.push(currPos);
            }

            return positions;
        },

        createBaseInfo : function (name, info, startpoint, starttime, endpoint, endtime) {
            return "<strong>Vehicle: </strong>" + name + "<br />" +
                   ((typeof info != "undefined") ? "<strong>Info: </strong>" + info + "<br />" : "") +
                   "<strong>Start: </strong>" + startpoint + " (" + starttime +
                   ")<br />" + "<strong>End: </strong>" + endpoint + " (" +
                   endtime + ")<br />";
        },

        createPositionInfo : function (base, position) {
            if (position.stationaryAt) {
                return base + "<strong>At: </strong>" + position.stationaryAt +
                       "<br />" + "<strong>Departure: </strong>" + position.departureTime;
            } else {
                return base +
                       "<strong>Left: </strong>" + position.leaving + " (" + position.leftTime +
                       ")" + "<br />" + "<strong>Approaching: </strong>" + position.approaching +
                       " (" + position.approachTime + ")";
            }
        },

        writeLog : function (selector, currPosition, vehicle) {
            var tickerDiv = selector + "> #tickerDiv";
            var ticker = tickerDiv + "> #ticker";

            if (!($(tickerDiv).length > 0) || !(currPosition.justReached ||
                currPosition.justLeft || currPosition.started || currPosition.completed)) return;

            $(tickerDiv).show();
            $(tickerDiv).stop(true, true);

            if (currPosition.justReached) {
                $(ticker).append("<em>" + transit.currTime() + "</em> | " +
                                 "<strong>" + vehicle.name + "</strong> just reached <strong>" +
                                 currPosition.stationaryAt + "</strong>. " +
                                 "Departs at: <strong>" + currPosition.departureTime + "</strong>.<br />");
            } else if (currPosition.justLeft || currPosition.started) {
                var sOrL = currPosition.started ? 'just started from' : 'just left';
                $(ticker).append("<em>" + transit.currTime() + "</em> | " +
                                 "<strong>" + vehicle.name + "</strong> " + sOrL + " <strong>" +
                                 currPosition.stationaryAt + "</strong>. " +
                                 "Next Stop: <strong>" + currPosition.approachingStop +
                                 "</strong> at <strong>" + currPosition.approachTime + "</strong>.<br />");
            } else if (currPosition.completed) {
                $(ticker).append("<em>" + transit.currTime() + "</em> | " +
                                 "<strong>" + vehicle.name +
                                 "</strong> just reached its destination at <strong>" +
                                 currPosition.stationaryAt + "</strong>.<br />");
            }

            $(tickerDiv).css('display','inline');
            $(ticker).scrollTop($(ticker)[0].scrollHeight);
            $(tickerDiv).fadeOut(5000);
        },

        writeStatus : function (selector, message) {
            $(selector + '> #status').css('display', 'inline');
            $(selector + '> #status').html(message);
        },

        isMobileDevice : function () {
            var userAgent = navigator.userAgent || navigator.vendor || window.opera;
            if(/(android|ipad|playbook|silk|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(userAgent)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(userAgent.substr(0,4)))
                return true;
            else
                return false;
        },

        setInMotion : function (selector, refreshInterval, vehicles, noOfVehicles, stopinterval, timezone, map) {
            var transition = setInterval(
                    function() {
                        for (var count = 0; count < noOfVehicles; count++) {
                            var vehicle = vehicles[count];

                            if (typeof vehicle.markers == "undefined") {
                                vehicle.markers = new Array();
                            }

                            var currPositions = transit.estimateCurrentPosition(vehicle, timezone);

                            for (var i = 0; i < currPositions.length; i++) {
                                var currPosition = currPositions[i];

                                if (!currPosition.currentCoords) {
                                    if (typeof vehicle.markers[i] != "undefined") {
                                        vehicle.markers[i].setMap(null);
                                        delete vehicle.markers[i];
                                    }
                                    continue;
                                }

                                transit.writeLog(selector, currPosition, vehicle);
                                if (currPosition.completed) {
                                    vehicle.markers[i].setMap(null);
                                    delete vehicle.markers[i];
                                }

                                var mouseOverInfo = transit.createPositionInfo(vehicle.baseinfo, currPosition);

                                if (typeof vehicle.markers[i] == "undefined") {
                                    var currMarker = transit.initMarker(currPosition.currentCoords, selector,
                                                                        map, vehicle.color);
                                    currMarker.setMap(map);
                                    vehicle.markers[i] = currMarker;
                                } else {
                                    var currMarkerPos = new google.maps.LatLng(currPosition.currentCoords.x,
                                                                               currPosition.currentCoords.y);
                                    vehicle.markers[i].setPosition(currMarkerPos);
                                }

                                transit.onMarkerMouseover(selector, map, vehicle.markers[i], mouseOverInfo);
                            }
                        }
                    }, refreshInterval);
        },

        callMain : function (selector, refreshInterval, routeObj, vehicleObj, remoteKmlFile, vehicles) {
            var timezone = vehicleObj.timezone;
            var stopinterval = vehicleObj.stopinterval;
            var map = transit.initMap(selector, routeObj.stopnames, routeObj.points);
            transit.overlayKml(remoteKmlFile, map);

            $('#timezone').append("UTC" + timezone + "/Local" +
                                  transit.secondsToHours(transit.parseTimeZone(timezone) % 86400));

            if (typeof vehicles == "undefined") {
                var vehicles = vehicleObj.vehicles;
                var noOfVehicles = vehicles.length;

                for (var count = 0; count < noOfVehicles; count++) {
                    try {
                        vehicles[count] = transit.scheduler(vehicles[count], routeObj,
                                                            timezone, stopinterval);
                    } catch (err) {
                        transit.writeStatus(selector, err);
                        throw new Error(err);
                    }
                }
            } else {
                var noOfVehicles = vehicles.length;
            }

            transit.setInMotion(selector, refreshInterval, vehicles, noOfVehicles,
                                stopinterval, timezone, map);
        },

        initialize : function (selector, localKmlFile, remoteKmlFile, jsonFile, refreshInterval) {
            refreshInterval = (typeof refreshInterval == "undefined" ||
                               refreshInterval < 1) ? 1000 : refreshInterval * 1000;
            $(selector).css({
                'position': 'relative',
                'font-family': '"Lucida Grande", "Lucida Sans Unicode",' +
                               'Verdana, Arial, Helvetica, sans-serif',
                'font-size': '12px',
                'text-shadow': 'hsla(0,0%,40%,0.5) 0 -1px 0, hsla(0,0%,100%,.6) 0 2px 1px',
                'background-color': 'hsl(0, 0%, 90%)'
            });

            $(selector).append("<div id='init' style='position:absolute;width:100%;" +
                               "text-align:center;font-size:20px;top:48%;'>" +
                               "<strong>Initialis(z)ing...</strong></div>");
            google.maps.event.addDomListener(window, 'load',
                    function () {
                        var kml = transit.kmlPromise(localKmlFile);
                        var json = transit.jsonPromise(jsonFile);

                        kml.success(function (kmlData) {
                            json.success(function (jsonData) {
                                var routeObj = transit.routeParser(kmlData);
                                var vehicleObj = transit.vehicleParser(jsonData);
                                transit.callMain(selector, refreshInterval, routeObj, vehicleObj, remoteKmlFile);
                            }).fail(function () {
                                $(selector).css('position', 'relative');
                                $(selector).html('');
                                transit.initStatus(selector);
                                transit.writeStatus(selector, 'Oh Shoot, there was an error loading the JSON file.');
                            });
                        }).fail(function () {
                            $(selector).css('position', 'relative');
                            $(selector).html('');
                            transit.initStatus(selector);
                            transit.writeStatus(selector, 'Oh Shoot, there was an error loading the KML file.');
                        });
                    });
        }
    };
})();
