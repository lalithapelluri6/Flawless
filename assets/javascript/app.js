
//   Namita
//
//
//
//
//
//   Sophie
//
//
//
//

// Kanwar
//
//


function invokeInputForm() {

    // Create the Form 
    var containerDiv = $("<div>").addClass("container");
    var inputForm = $("<form>");
    // Input field for Search location by Zipcode or City
    var locationFormDiv = $("<div>").addClass("form-group");
    locationFormDiv.append("<label for='location'> Search by location: </label>" );
    locationFormDiv.append("<input type='text' id='location' class='form-control'>");
   
    // Input field for Restaurants and other places to meet
    var foodFormDiv = $("<div>").addClass("form-group");
    foodFormDiv.append("<label for='foodAndDrinks'> What Cuisine : </label>" );
    foodFormDiv.append("<input type='text' id='foodAndDrinks' placeholder='Eg Asian, American, French, Italian, Indian' class='form-control'>");

    // Input field for field of interest
    var moviesFormDiv = $("<div>").addClass("form-group");
    moviesFormDiv.append("<label for='moviesUpdate'> Entertainment updates : </label>" );
    moviesFormDiv.append("<input type='text' id='moviesUpdate' placeholder='Eg Name of Movie or TV Shows' class='form-control'>");

      // Input field for field of interest
      var newsFormDiv = $("<div>").addClass("form-group");
      newsFormDiv.append("<label for='newsUpdate'> News updates : </label>" );
      newsFormDiv.append("<input type='text' id='newsUpdate' placeholder='Eg Industry, Travel, Movie , Sports, Science' class='form-control'>");
  

    inputForm.append(locationFormDiv,foodFormDiv,interestFormDiv);
   
    var submitButton = $("<button>").addClass("btn btn-success m-3 float-right").attr("id", "btn-submit").text("Submit");
    var clearButton =  $("<button>").addClass("btn btn-warning m-3 float-right").attr("id", "btn-clear").text("Clear");
    
    $("#input-form").append(inputForm, submitButton, clearButton);
    $(containerDiv).append("#input-form");

}

invokeInputForm();

//$(document).on("click",".icon", invokeInputForm);
