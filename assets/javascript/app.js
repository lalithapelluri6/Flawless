// -------------------------------------------------------
// Firebase Configuration & initialization
//--------------------------------------------------------

var config = {
  apiKey: "AIzaSyAetjyRx2t2a0mBfY0XwsSpH-2RclTWfeI",
  authDomain: "flawless-7a98a.firebaseapp.com",
  databaseURL: "https://flawless-7a98a.firebaseio.com",
  projectId: "flawless-7a98a",
  storageBucket: "flawless-7a98a.appspot.com",
  messagingSenderId: "1096240112468"
};

firebase.initializeApp(config);

// ------------------------------------------------------
// Global Variables
//----------------------------------------------------------

var database = firebase.database();


// ------------------------------------------------------
// Functions
//--------------------------------------------------------

// function to display the input form
function invokeInputForm() {
  // clear the div of previous info
  $("#input-form").empty();
  $("#result-form").empty();

  // Create the Form within a container
  var containerDiv = $("<div>").addClass("container float-left");
  var inputForm = $("<form>");

  // Input field for Search location by Zipcode or City
  var locationFormDiv = $("<div>").addClass("form-group");
  locationFormDiv.append("<label for='location'>Search by location - Enter a city or zipcode</label>");
  locationFormDiv.append("<input type='text' id='location' class='form-control'>");

  // Input field for Restaurants, cafe, pub, bars...
  var foodFormDiv = $("<div>").addClass("form-group");
  foodFormDiv.append("<label for='foodAndDrinks'>What kind of food are you interested in?</label>");
  foodFormDiv.append("<input type='text' id='foodAndDrinks' placeholder='Eg Asian, American, French, Italian, Indian...' class='form-control'>");

  // Input field to get list of movies or TV show according to the keyword entered 
  var moviesFormDiv = $("<div>").addClass("form-group");
  moviesFormDiv.append("<label for='moviesUpdate'>Search for Movies or TV shows - Enter a keyword</label>");
  moviesFormDiv.append("<input type='text' id='moviesUpdate' placeholder='Eg Space, Rocky, Nature, Love...' class='form-control'>");

  // Input field to get list of movies or TV show according to the keyword entered  
  var newsFormDiv = $("<div>").addClass("form-group");
  newsFormDiv.append("<label for='newsUpdate'> Search for news updates - Enter a keyword</label>");
  newsFormDiv.append("<input type='text' id='newsUpdate' placeholder='Eg Industry, Travel, Movie , Sports, Science' class='form-control'>");

  // append those input fields to the input form
  inputForm.append(locationFormDiv, foodFormDiv, moviesFormDiv, newsFormDiv);

  // create the buttons to submit or to clear the textbox fields
  var submitButton = $("<button>").addClass("btn btn-success m-3 float-right").attr("id", "btn-submit").attr("type", "submit").text("Submit");
  var clearButton = $("<button>").addClass("btn btn-warning m-3 float-right").attr("id", "btn-clear").text("Clear");

  // append the input form and the button to the container div created above
  containerDiv.append(inputForm, submitButton, clearButton);
  // append the input fields and button to the HTML element with ID = input-form
  $("#input-form").append(containerDiv);

}

// function to save the user input into the firebase
function saveToFirebase() {

  // store the value entered in the form into variables
  var location = $("#location").val().trim();
  var foodAndDrinks = $("#foodAndDrinks").val().trim();
  var moviesUpdate = $("#moviesUpdate").val().trim();
  var newsUpdate = $("#newsUpdate").val().trim();

  // create a temporary object 
  var newSearchStored = {
    location: location,
    foodAndDrinks: foodAndDrinks,
    moviesUpdate: moviesUpdate,
    newsUpdate: newsUpdate
  };

  // push this temporary object into firebase for storage
  database.ref().push(newSearchStored);
}

// function to call the YELP Fusion API
function yelpFusionAPI(place, foodDrinks) {

  // clear the div before showing new results
  $("#food").empty();

  // Some APIs will give us a cross-origin (CORS) error. This small function is a fix for that error. You can also check out the chrome extenstion (https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi?hl=en).
  jQuery.ajaxPrefilter(function (options) {
    if (options.crossDomain && jQuery.support.cors) {
      options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
    }
  });

  // Generating the API query url for the YELP Fusion API, by passing the location to it
  //  and refining the search with foodDrinks if the user entered the kind of cuisine wanted
  var queryURL = "https://api.yelp.com/v3/businesses/search?term=" + foodDrinks + "&limit=20&sort_by=rating&location=" + place

  // YELP API we need to pass Authorization (i. e. api key) as part of the header for the request to be authorized 
  // This api key is generated for the industry specifically catering to Food & Drinks from the Yelp Fushion  
  $.ajax({
    url: queryURL,
    method: "GET",
    dataType: "json",
    headers: {
      Authorization: "Bearer 6pKp-wZ6h5uoiUqasnagzsVJuleZkEyFSWPJhzSyyiSj8Ha__4PCt_15sDAEufe1_7x0-aCz_tfxz96hkRdPxL6GtP5QyOzJ9A1yOlRiVSORiFstD9P1MT0J6m6EXHYx",
    }
  }).then(function (response) {
    console.log("queryURL: " + queryURL);
    console.log(response);
    // for every one of the results received
    for (var i = 0; i < response.businesses.length; i++) {
      // create a new div to store the results
      var newDiv = $("<div>");
      // console.log("State: " + response.businesses[i].location.state); 
      // console.log("Category :" + response.businesses[i].categories[0].title); 
      // console.log("Name : "  + response.businesses[i].name); 

      // append the name of the place
      newDiv.append("<h3 class='title'>" + response.businesses[i].name + "</h3>");
      // append the type of food
      newDiv.append("<p>Category: " + response.businesses[i].categories[0].title + "</p>");
      // append the price category and number of reviews
      newDiv.append("<p>Price: " + response.businesses[i].price + " Reviews: " + response.businesses[i].review_count + "</p>");
      // append the rating
      newDiv.append("<p>Rating: " + response.businesses[i].rating + displayStarIconRating(response.businesses[i].rating) + " </p>");

      // append the link to the yelp restautant page
      newDiv.append("<a href=" + response.businesses[i].url + " target='_blank'> Yelp Business Link </a>")
      // add a line to separate the different results
      newDiv.append("<hr>");

      // display all of the results for every restaurant to the foods & drinks div.
      $("#food").append(newDiv);
    }
  });
}

//Fancy Display of Ratings for the YELP Reviews 
function displayStarIconRating(rating) {

  console.log(parseInt(rating));
  //Blank No Star's 
  var span = "<span class='fa fa-star'></span> <span class='fa fa-star'></span> <span class='fa fa-star'></span> <span class='fa fa-star'></span> <span class='fa fa-star' ></span>";

  //In case of Five Stars 
  if (parseInt(rating) === 5) {
    span = " <span class='fa fa-star checked'></span> <span class='fa fa-star checked'></span> <span class='fa fa-star checked'></span> <span class='fa fa-star checked'></span> <span class='fa fa-star checked' ></span> ";
  }
  //In case of 4.5 rating 
  else if (parseFloat(rating) === 4.5) {
    span = " <span class='fa fa-star checked'></span> <span class='fa fa-star checked'></span> <span class='fa fa-star checked'></span> <span class='fa fa-star checked'></span> <span class='fa fa-star-half-empty checked' ></span> ";
  }
  //In case of 4 rating 
  else if (parseInt(rating) === 4) {
    span = " <span class='fa fa-star checked'></span> <span class='fa fa-star checked'></span> <span class='fa fa-star checked'></span> <span class='fa fa-star checked'></span> <span class='fa fa-star' ></span> ";
  }
  else if (parseFloat(rating) === 3.5) {
    span = " <span class='fa fa-star checked'></span> <span class='fa fa-star checked'></span> <span class='fa fa-star checked'></span> <span class='fa fa-star-star-empty checked'></span> <span class='fa fa-star' ></span> ";
  }
  //In case of 3 rating 
  else if (parseInt(rating) === 3) {
    span = " <span class='fa fa-star checked'></span> <span class='fa fa-star checked'></span> <span class='fa fa-star checked'></span> <span class='fa fa-star'></span> <span class='fa fa-star' ></span> ";
  }
  else if (parseFloat(rating) === 2.5) {
    span = " <span class='fa fa-star checked'></span> <span class='fa fa-star checked'></span> <span class='fa fa-star-half-empty checked'></span> <span class='fa fa-star'></span> <span class='fa fa-star' ></span> ";
  }
  else if (parseInt(rating) === 2) {
    span = " <span class='fa fa-star checked'></span> <span class='fa fa-star checked'></span> <span class='fa fa-star'></span> <span class='fa fa-star'></span> <span class='fa fa-star' ></span> ";
  }
  else {
    span = " <span class='fa fa-star checked'></span> <span class='fa fa-star'></span> <span class='fa fa-star'></span> <span class='fa fa-star'></span> <span class='fa fa-star' ></span> ";
  }
  //It returns the updated span based on the review ratings 
  return span;

}

// function to call the News API depending on the keyword entered by the user 
function newsAPI(newsText) {

  // clear the div before showing new results
  $("#news").empty();

  // Some APIs will give us a cross-origin (CORS) error. This small function is a fix for that error. You can also check out the chrome extenstion (https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi?hl=en).
  jQuery.ajaxPrefilter(function (options) {
    if (options.crossDomain && jQuery.support.cors) {
      options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
    }
  });

  // Generating the API query url the NEWS API by passing the keyword entered by the user - only english articles returned, sorted by popularity
  var queryURL = "https://newsapi.org/v2/everything?q=" + newsText.split(' ').join('%20') + "&language=en&sortBy=relevancy&apiKey=80f6aa8df95a4c7ba514557d4f8f57fe";

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {
    console.log("queryURL: " + queryURL);
    console.log(response);
    // for every one of the results received
    for (var i = 0; i < response.articles.length; i++) {
      // create a new div to store the results
      var newDiv = $("<div>");
      // console.log(response.articles[i].name); 

      // append the title of the article
      newDiv.append("<h3 class='title'>" + response.articles[i].title + "</h3>");
      // append the name of the author(s) of the article
      newDiv.append("<p class='author'>Author(s): " + response.articles[i].author + "</p>");
      // append an overview of the article
      newDiv.append("<p class='desc'>Overview: " + response.articles[i].content + "</p>");
      // append the source of the article
      newDiv.append("<p class='desc'>Source: " + response.articles[i].source.name + "</p>");
      // append a link to the article
      newDiv.append("<a href=" + response.articles[i].url + " target='_blank' > Article Link </a>");
      // add a line to separate the different results
      newDiv.append("<hr>");

      // display all of the results for every article to the news div.
      $("#news").append(newDiv);
    }
  });
}

// function to call the Movie and TV shows API depending on the keyword entered by the user
function movieTvShowsAPI(movieOrTVShow) {

  // clear the div before showing new results
  $("#movies").empty();

  // Some APIs will give us a cross-origin (CORS) error. This small function is a fix for that error. You can also check out the chrome extenstion (https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi?hl=en).
  jQuery.ajaxPrefilter(function (options) {
    if (options.crossDomain && jQuery.support.cors) {
      options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
    }
  });

  // Generating the API query url for the Movie DB API by passing the keyword entered by the user - movie/tv show in American english only and family friendly! By default page returns 20 records 
  var queryURL = "https://api.themoviedb.org/3/search/multi?api_key=498b69881c75c1037a70315572cae878&language=en-US&query=" + movieOrTVShow + "&page=1&include_adult=false";

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {
    console.log("queryURL: " + queryURL);
    console.log(response);
    // for every one of the results received //response.results.length
    for (var i = 0; i < 10; i++) {
      // create a new div to store the results
      var newDiv = $("<div>");

      // condition depending on the type of media because the title is stored differently depending on the media
      // if the media is "tv"
      if (response.results[i].media_type === "tv") {
        // append the title of the result using "name"
        newDiv.append("<h3 class='title'> Title: " + response.results[i].name + "</h3>");
      }
      // if the media is "movie"
      else {
        // append the title of the result using "title"
        newDiv.append("<h3 class='title'> Title: " + response.results[i].title + "</h3>");
      }
      // append the media type: "tv" or "movie"
      newDiv.append("<p class='author'>Media Type: " + response.results[i].media_type + "</p>");
      // append the popularity
      newDiv.append("<p class='desc'>Popularity: " + response.results[i].popularity + "</p>");
      // append the poster of the movie/tv show
      newDiv.append("<img alt='Poster Image' src='http://image.tmdb.org/t/p/w185/" + response.results[i].poster_path + "' class='img-fluid img-thumbnail'>");
      // append the overview of the movie/tv show
      newDiv.append("<br/> <p class='desc'>Overview: " + response.results[i].overview + " <!-more--> </p>");
      // add a line to separate the different results
      newDiv.append("<hr>");

      // display all of the results for every movie/tv show to the movies-tvshow div.
      $("#movies").append(newDiv);
    }
  });
}


// ------------------------------------------------------
// Main process
//--------------------------------------------------------

// get the HTML ready
$(document).ready(function () {

  // display the input form when an icon has been cliked
  $(".btn-to-get-form").on("click", invokeInputForm);

  //Show the Input form section Hide show the results form 
  $("#main-page").show();
  $("#results").hide();

  // when the "clear" button has been clicked..
  $(document).on("click", "#btn-clear", function () {

    // clear the textbox areas
    $("#location").val("");
    $("#foodAndDrinks").val("");
    $("#moviesUpdate").val("");
    $("#newsUpdate").val("")
    // clear the div before showing new results
    $("#news").empty();
    $("#food").empty();
    $("#movies").empty();
  })

  // when the "submit" button has been clicked...
  $(document).on("click", "#btn-submit", function (event) {
    // prevent the page to refresh
    event.preventDefault();

    // save the user input to firebase 
    saveToFirebase();

    // do the AJAX calls
    // store the user input into variables
    var place = $("#location").val().trim();
    var foodDrinks = $("#foodAndDrinks").val().trim();
    var movieOrTVShow = $("#moviesUpdate").val().trim();
    var newsText = $("#newsUpdate").val().trim();
    // Nested Conditions to display API data based on what kind of info the user has entered
    // if the user has entered a place
    if (place) {
      // call the YELP Fusion API and show the food and drinks recommandations
      // if there is data for foodDrinks, it will be used
      yelpFusionAPI(place, foodDrinks);
      // if the user has also entered a keyword for movie/tv show
      if (movieOrTVShow) {
        // call the MOVIE DB API and show the list of movies/tv show related to the keyword
        movieTvShowsAPI(movieOrTVShow);
        // if the user has also entered a keyword for news update
        if (newsText) {
          // call the NEWS API and show the list of english articles related to the keyword
          newsAPI(newsText);
        }
      }
    }
    // if the user hasn't entered a location but has entered a keyword for movie/tv show
    else if (movieOrTVShow) {
      // call the MOVIE DB API and show the list of movies/tv show related to the keyword
      movieTvShowsAPI(movieOrTVShow);
      // if the user has also entered a keyword for news update
      if (newsText) {
        // call the NEWS API and show the list of english articles related to the keyword
        newsAPI(newsText);
      }
    }
    // if the user has only entered a keyword for news update
    else if (newsText) {
      // call the NEWS API and show the list of english articles related to the keyword 
      newsAPI(newsText);
    }


    //Hide the Input form section Inside show the results form 
    $("#main-page").hide();
    $("#results").show();


  });


});
