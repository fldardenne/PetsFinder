var options = {
    types: ['(cities)'],
    componentRestrictions: {country: 'ca'}
 };
 var input = document.getElementById('location');
 autocomplete = new google.maps.places.Autocomplete(input, options);