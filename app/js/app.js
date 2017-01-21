// Location Datas

var locations = [{
        title: 'Mark Keppel High School',
        location: {
            lat: 34.070465,
            lng: -118.115601
        },
        type: ["School"],
        id: 'ChIJtwkJXk3FwoARLa3bhWCYeic'
    },{
        title: 'Half & Half Tea House',
        location: {
            lat: 34.063846,
            lng: -118.134599
        },
        type: ["Drink"],
        id: 'ChIJo-q-Tl3FwoARFvIg1LL0xc0'
    }, {
        title: 'Boba Ave 8090',
        location: {
            lat: 34.078642,
            lng: -118.101897
        },
        type: ["Drink"],
        id: 'ChIJ42uSTbfawoARo8LycmjL7DE'
    }, {
        title: 'Tea Station',
        location: {
            lat: 34.09214,
            lng: -118.132422
        },
        type: ["Drink"],
        id: 'ChIJzdhPCSHFwoAR2SK71bT3CnU'
    }, {
        title: 'Tea Brick',
        location: {
            lat: 34.0627834,
            lng: -118.129498
        },
        type: ["Drink"],
        id: 'ChIJFZxagVvFwoAR07lvkYmDlSU'
    }, {
        title: 'Factory Tea Bar',
        location: {
            lat: 34.097658,
            lng: -118.109007
        },
        type: ["Drink"],
        id: 'ChIJ5zgvXtTawoARdjtqffb8osE'
    }, {
        title: 'Le Arbre Tea House',
        location: {
            lat: 34.080447,
            lng: -118.083796
        },
        type: ["Drink"],
        id: 'ChIJhTc3LpfawoARgSSEUaFwlEc'
    }, {
        title: 'Honeyboba',
        location: {
            lat: 34.0495,
            lng: -118.082349
        },
        type: ["Drink"],
        id: 'ChIJM8dremnQwoARtzJ8GQTLG_Q'
    }];

// Model 

var Location = function(data) {
	var self = this;
	self.title = data.title;
	self.location = data.location;
	self.type = data.type;
	self.id = data.id;
	self.show = ko.observable(true);
};

// View Model

var ViewModel = function() {
	var self = this;
	self.locs = ko.observableArray(locations);
	self.query = ko.observable('');
	self.filteredLocations = ko.observableArray();

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
			id: locId
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
function populateInfoWindow(marker, infowindow) {
	// Check to make sure the infowindow is not already opened on this and status is ok.
	var service = new google.maps.places.PlacesService(map);
        service.getDetails({
          placeId: marker.id
        }, function(place, status) {
        	console.log(place);
        	console.log(status);

          if (infowindow.marker != marker, status == google.maps.StreetViewStatus.OK) {
            // Set the marker property on this infowindow so it isn't created again. 
            infowindow.marker = marker;
            // infowindow.setContent('<div>' + marker.title + '</div>');
            var innerHTML = '<div>';
            if (marker.title) {
              innerHTML += '<strong>' + marker.title + '</strong>'; 
            }
            if (place.formatted_address) {
              innerHTML += '<br>' + place.formatted_address;
            }
            if (place.formatted_phone_number) {
              innerHTML += '<br>' + place.formatted_phone_number;
            }
            if (place.rating) {
              innerHTML += '<br>' +'Rating: '+ place.rating;
            }
            if (place.opening_hours) {
              innerHTML += '<br><br><strong>Hours:</strong><br>' + place.opening_hours.weekday_text[0] + '<br>' + place.opening_hours.weekday_text[1] + '<br>' + place.opening_hours.weekday_text[2] + '<br>' + place.opening_hours.weekday_text[3] + '<br>' + place.opening_hours.weekday_text[4] + '<br>' + place.opening_hours.weekday_text[5] + '<br>' + place.opening_hours.weekday_text[6];
            }
            if (place.photos) {
              innerHTML += '<br><br><img src="' + place.photos[0].getUrl(
              {maxHeight: 100, maxWidth: 200}) + '">';
            }
            innerHTML += '</div>';
            infowindow.setContent(innerHTML);
            infowindow.open(map, marker);
            // Make sure the marker property is cleared if the infowindow is closed.
            infowindow.addListener('closeclick', function() {
              infowindow.marker = null;
            });
          }
        });
}

var viewModel = new ViewModel();
ko.applyBindings(viewModel);

