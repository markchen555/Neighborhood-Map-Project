// Location Datas

var locations = [{
        title: 'Mark Keppel High School',
        location: {
            lat: 34.070465,
            lng: -118.115601
        },
        type: ["School"],
        id: 'ChIJtwkJXk3FwoARLa3bhWCYeic',
        bizId: 'mark-keppel-high-school-alhambra'
    },{
        title: 'Half & Half Tea House',
        location: {
            lat: 34.063846,
            lng: -118.134599
        },
        type: ["Drink"],
        id: 'ChIJo-q-Tl3FwoARFvIg1LL0xc0',
        bizId: 'half-and-half-tea-express-monterey-park-monterey-park'
    }, {
        title: 'Boba Ave 8090',
        location: {
            lat: 34.078642,
            lng: -118.101897
        },
        type: ["Drink"],
        id: 'ChIJ42uSTbfawoARo8LycmjL7DE',
        bizId: 'boba-ave-8090-san-gabriel-2'
    }, {
        title: 'Tea Station',
        location: {
            lat: 34.09214,
            lng: -118.132422
        },
        type: ["Drink"],
        id: 'ChIJzdhPCSHFwoAR2SK71bT3CnU',
        bizId: 'tea-station-alhambra'
    }, {
        title: 'Tea Brick',
        location: {
            lat: 34.0627834,
            lng: -118.129498
        },
        type: ["Drink"],
        id: 'ChIJFZxagVvFwoAR07lvkYmDlSU',
        bizId: 'tea-brick-monterey-park'
    }, {
        title: 'Factory Tea Bar',
        location: {
            lat: 34.097658,
            lng: -118.109007
        },
        type: ["Drink"],
        id: 'ChIJ5zgvXtTawoARdjtqffb8osE',
        bizId: 'factory-tea-bar-san-gabriel'
    }, {
        title: 'Le Arbre Tea House',
        location: {
            lat: 34.080447,
            lng: -118.083796
        },
        type: ["Drink"],
        id: 'ChIJhTc3LpfawoARgSSEUaFwlEc',
        bizId: 'le-arbre-tea-house-rosemead-2'
    }, {
        title: 'Honeyboba',
        location: {
            lat: 34.0495,
            lng: -118.082349
        },
        type: ["Drink"],
        id: 'ChIJM8dremnQwoARtzJ8GQTLG_Q',
        bizId: 'honeyboba-los-angeles'
    }];

// Model 

var Location = function(data) {
	var self = this;
	self.title = data.title;
	self.location = data.location;
	self.type = data.type;
	self.id = data.id;
	self.bizId = data.bizId;
	self.show = ko.observable(true);
};

// View Model

var ViewModel = function() {
	var self = this;
	self.locs = ko.observableArray(locations);
	self.query = ko.observable('');
	self.filteredLocations = ko.observableArray();
	self.mapErrorMessage = ko.observable(false);
	self.apiErrorMessage = ko.observable(false);

	for (var i = 0 ; i < locations.length; i++) {
		var loc = new Location(locations[i]);
		self.filteredLocations.push(loc);
	}

	self.filterFunctions = ko.computed(function() {
		var value = self.query();
		for (var i = 0; i < self.filteredLocations().length; i++) {
			if (self.filteredLocations()[i].title.toLowerCase().indexOf(value) >= 0) {
				self.filteredLocations()[i].show(true);
				if (self.filteredLocations()[i].marker) {
					self.filteredLocations()[i].marker.setVisible(true);
				}
			} else {
				self.filteredLocations()[i].show(false);
				if (self.filteredLocations()[i].marker) {
					self.filteredLocations()[i].marker.setVisible(false);
				}
			}
		}
	});

	self.showInfo = function(locations) {
		google.maps.event.trigger(locations.marker, 'click');
	};
};

var map;

var markers = [];
      
function initMap() {

	var styles = [
	{
                featureType: 'water',
                stylers: [
                {color: '#19a0d8'}
                ]
            },{
                featureType: 'administrative',
                elementType: 'labels.text.stroke',
                stylers: [
                {color: '#ffffff'},
                {weight: 6}
                ]
            },{
                featureType: 'administrative',
                elementType: 'labels.text.fill',
                stylers: [
                {color: '#e85113'}
                ]
            },{
                featureType: 'road.highway',
                elementType: 'geometry.stroke',
                stylers: [
                {color: '#efe9e4'},
                {lightness: -40}
                ]
            },{
                featureType: 'transit.station',
                stylers: [
                {weight: 9},
                {hue: '#e85113'}
                ]
            },{
                featureType: 'road.highway',
                elementType: 'labels.icon',
                stylers: [
                {visibility: 'off'}
                ]
            },{
                featureType: 'road.highway',
                elementType: 'geometry.fill',
                stylers: [
                {color: '#efe9e4'},
                {lightness: -25}
                ]
            }, 
            // {"stylers": [{ "saturation": -100 }]}
	];

	var myLatLng = {lat: 34.0702802, lng: -118.1246111};

	map = new google.maps.Map(document.getElementById('map'), {
		center: myLatLng,
		zoom: 13,
		styles: styles,
		mapTypeControl: false
	});

	// Save InfoWindow data.
	var largeInfowindow = new google.maps.InfoWindow();
	
	
	for (var i = 0; i < viewModel.filteredLocations().length; i++) {
		var locId = viewModel.filteredLocations()[i].id;
		var bizId = viewModel.filteredLocations()[i].bizId;
		var position = viewModel.filteredLocations()[i].location;
		var title = viewModel.filteredLocations()[i].title;
		var type = viewModel.filteredLocations()[i].type;

		// Style the marker a bit. This will be our listing marker icon.
    	var defaultIcon = makeMarkerIcon('Before', type);

   		// Create a "highlighted location" marker color for when the user mouse over the marker.
    	var highlightedIcon = makeMarkerIcon('After', type);

		// Create a marker per location, and put into marker array.
		var marker = new google.maps.Marker({
			map: map,
			type: type,
			position: position,
			title: title,
			animation: google.maps.Animation.DROP,
			icon: defaultIcon,
			highlightedIcon: highlightedIcon,
			defaultIcon: defaultIcon,
			id: locId,
			bizId: bizId
		});

		// Push the marker to our marker array.
		viewModel.filteredLocations()[i].marker = marker;
		markers.push(marker);

		// Create an onlick event to open an infowindow at each marker.
        marker.addListener('click', function() {
        	console.log(this);
        	var self = this;
        	self.setAnimation(google.maps.Animation.BOUNCE);
        	setTimeout(function() {
        		self.setAnimation(null);
        	}, 1400);
        	populateInfoWindow(this, largeInfowindow);
        });
		// Two event listener - One for mouse over, one for mouse out. to change the color back and forth. 
        marker.addListener('mouseover', function() {
        	this.setIcon(this.highlightedIcon);
        });
        marker.addListener('mouseout', function() {
        	this.setIcon(this.defaultIcon);
        });
	}
}

// This function takes in a Color, and then create a new marker icon of that color. The icon will be 64px wide by 64px high and have origin of 0, 0 and be anchored at 32, 64. 
function makeMarkerIcon(beforeAfter, type) {

    var markerImage = new google.maps.MarkerImage('img/' + type + '_' + beforeAfter + '.svg',
        new google.maps.Size(64, 64),
        new google.maps.Point(0, 0),
        new google.maps.Point(32, 64),
        new google.maps.Size(64, 64));
        return markerImage;
}

// This is the function populates the infowindow when the marker is clicked. We'll only allow one infowindow which will open at the marker that is clicked, and populate based on that marker position.
// Yelp API 2.0: 
//Consumer Key: hXgPJ8oeGx5cLCp54G-7RQ
//Consumer Secret: m3n1T9WThmp53i7I4M-jW6pqDvA
//Token: zTWQp_ENU6OZwUm4GaDGNi70wTPGtUpj 
//Token Secret: QWBZJjSM14BwaW-CHmHQjcNHBNk
function populateInfoWindow(marker, infowindow) {
	// Check to make sure the infowindow is not already opened on this and status is ok.
	var service = new google.maps.places.PlacesService(map);
        service.getDetails({
          placeId: marker.id
        }, function(place, status) {
        	console.log(place);
        	console.log(status);
        	console.log(marker.bizId);

          if (infowindow.marker != marker, status == google.maps.StreetViewStatus.OK) {
            // Set the marker property on this infowindow so it isn't created again. 
            infowindow.marker = marker;
            // infowindow.setContent('<div>' + marker.title + '</div>');
            var innerHTML = '<div class="infowindow">';


            // Yelp API oauth implementation
            function nonce_generate() {
  				return (Math.floor(Math.random() * 1e12).toString());
			}

			var yelp_url = 'https://api.yelp.com/v2/' + 'business/' + marker.bizId;

			var parameters = {
      			oauth_consumer_key: "hXgPJ8oeGx5cLCp54G-7RQ",
      			oauth_token: "zTWQp_ENU6OZwUm4GaDGNi70wTPGtUpj",
      			// oauth_consumer_secret: "m3n1T9WThmp53i7I4M-jW6pqDvA",
      			// oauth_token_secret: "QWBZJjSM14BwaW-CHmHQjcNHBNk",
      			oauth_nonce: nonce_generate(),
      			oauth_timestamp: Math.floor(Date.now()/1000),
      			oauth_signature_method: 'HMAC-SHA1',
      			oauth_version : '1.0',
      			callback: 'cb'              // This is crucial to include for jsonp implementation in AJAX or else the oauth-signature will be wrong.
    		};

    		var encodedSignature = oauthSignature.generate('GET',yelp_url, parameters, "m3n1T9WThmp53i7I4M-jW6pqDvA", "QWBZJjSM14BwaW-CHmHQjcNHBNk");
    			parameters.oauth_signature = encodedSignature;

    		var settings = {
    			url: yelp_url,
    			data: parameters,
    			cache: true,  // This is crucial to include for jsonp implementation in AJAX or else the oauth-signature will be wrong.
    			dataType: 'jsonp',
    			success: function(result) {
    				console.log(result);
    				console.log(result.rating_img_url)
    				if (result.rating_img_url) {
    					infowindow.marker = marker;
    					infowindow.setContent ('<div class="yelp"><img src="' + result.rating_img_url + '"></div>' + innerHTML);
    					infowindow.open(map, marker);
    					// Make sure the marker property is cleared if the infowindow is closed.
    					infowindow.addListener('closeclick', function() {
              				infowindow.marker = null;
            			});
    				}
    			},
    			error: function () {
    				console.log("Yelp API can not work properly!");
    				viewModel.apiErrorMessage(true);
    			}
    		};
    		// Yelp ajax request
    		$.ajax(settings);

            innerHTML += '<strong>' + marker.title + '</strong>'; 

            innerHTML += '<br>' + place.formatted_address;

            if (place.formatted_phone_number) {
              innerHTML += '<br>' + place.formatted_phone_number;
            }
            if (place.photos) {
              innerHTML += '<br><br><img src="' + place.photos[0].getUrl(
              {maxHeight: 100, maxWidth: 200}) + '">';
            }
            innerHTML += '</div>';
            // infowindow.setContent(innerHTML);
            // infowindow.open(map, marker);
            // Make sure the marker property is cleared if the infowindow is closed.
            // infowindow.addListener('closeclick', function() {
            //   infowindow.marker = null;
            // });
          }
        });
}

var viewModel = new ViewModel();
ko.applyBindings(viewModel);

function googleError() {
    viewModel.mapErrorMessage(true);
}
