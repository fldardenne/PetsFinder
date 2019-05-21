![alt text](https://i.imgur.com/bdIR4ik.jpg)

# To run the server

## Install mongodb

```sudo apt install mongodb```

## Install dependency

```npm install```

## Put your API Keys

PetsFinder use Algolia places for place autocomplete and place to geocode conversion.
PetsFinder also use Mapbox for the frontend maps.

In the following files, change ALGOLIA_APP_ID_KEY, ALGOLIA_API_KEY and MAPBOX_API_KEY

[create.ejs Algolia API](https://github.com/fdardenne/PetsFinder/blob/master/views/post/create.ejs)

[edit.ejs Algolia API](https://github.com/fdardenne/PetsFinder/blob/master/views/post/edit.ejs)

[maps.js Mapbox and Algolia API](https://github.com/fdardenne/PetsFinder/blob/master/public/js/maps.js)


## Start the server

```npm start```

## Port

```port 3000```
