$(document).ready(function() {
  var objectsArray = ["Lion", "Dog", "Wolf", "Falcon", "Tiger", "Leopard", "Panther", "Hyena", "Puma", "Owl", "Bear", "Jaguar", "Cheetah"];

  $('#openingModal').modal('show');     //Display Opening Modal

  /* RestFul API call */
  function callGiphyApi(selection){
    var queryURL = "https://api.giphy.com/v1/gifs/search?api_key=3wTHPk7iVBtBAua6aw1xhrFN4t9liA5d&q=" + selection + "&limit=10&offset=0&rating=G&lang=en";

    // Creates AJAX call for the specific button being clicked
    $.ajax({
        url: queryURL,
        dataType: 'json',     //JQuery will parse it for you, JSON.stringify() will make it a string so you won't be able to access it like an object in that case
        method: "GET"         //This API will send you JSON only, in other cases so you don't get XML you would have to specify JSON as the dataType
      }).then(function(response) {
        $.each(response.data, function(index, obj){     //JQuery each() for object arrays
          $(".main-container").append('<div class="tile hvr-grow-shadow">'
                                     +'<div class="tile-header">'
                                     +'<p>Rating: ' + obj.rating + '</p>'
                                     +'</div>'
                                     +'<div class="tile-img">'
                                     +'<img src="'+ obj.images.fixed_height_still.url + '" alt="' + obj.slug + '">'
                                     +'</div>'
                                     +'<div class="tile-gif">'
                                     +'<img src="'+ obj.images.original.url + '" alt="' + obj.slug + '">'
                                     +'</div>'
                                     +'</div>');
        });

        /* Add sound effect for tiles onHover*/
        $(".main-container .tile").mouseenter(function() {
          tilePickSoundObject.stop();
          tilePickSoundObject.play();
        });

        /* Hide the Image and display the GIF*/
        $('.main-container .tile .tile-img').click(function(){
          tileSelectSoundObject.stop();
          tileSelectSoundObject.play();
          $(this).css("display","none");
          $(this).next().css("display","block");    //Next sibling is the GIF
        });

        /* Hide the GIF and display the Image */
        $('.main-container .tile .tile-gif').click(function(){
          tileSelectSoundObject.stop();
          tileSelectSoundObject.play();
          $(this).css("display","none");
          $(this).prev().css("display","block");    //Previous sibling is the Img
        });
      })
  }
  /*******************/

  /* Add Event Handlers to all buttons*/
  function addBtnEventHandlers(){
    $(".buttons button").mouseenter(function() {
      btnPickSoundObject.stop();
      btnPickSoundObject.play();
    });

    $('.buttons button').click(function(){
      btnSelectSoundObject.stop();
      btnSelectSoundObject.play();
      $(".main-container").html("");
      callGiphyApi($(this).val());
    });
  }
  /*******************/

  /* Toggle Submit button enabled / disabled */
  function toggleSubmitBtn(fieldEmpty){
    var submitBtn = $('.submit-btn');

    if(fieldEmpty) {      //If string is empty, disable submit button, remove CSS animation
      submitBtn.addClass("disabled");
      submitBtn.removeClass("active");
      submitBtn.removeClass("hvr-pop");
    }else{                //If not empty, set button as active(enable it) and add CSS animation
      submitBtn.removeClass("disabled");
      submitBtn.addClass("active");
      submitBtn.addClass("hvr-pop");
    }
  }
  /********************/

  /* Different Sound Effects for buttons, tiles & submit button */
  var btnPickSoundObject = soundManager.createSound({
      url: "./assets/choice.mp3",
      autoLoad: true,
      autoPlay: true
  });

  btnPickSoundObject.setVolume(50);
  btnPickSoundObject.stop();

  var btnSelectSoundObject = soundManager.createSound({
      url: "./assets/selected.wav",
      autoLoad: true,
      autoPlay: true
  });

  btnSelectSoundObject.setVolume(50);
  btnSelectSoundObject.stop();

  var btnSubmitSoundObject = soundManager.createSound({
      url: "./assets/submit.mp3",
      autoLoad: true,
      autoPlay: true
  });

  btnSubmitSoundObject.stop();

  var tilePickSoundObject = soundManager.createSound({
      url: "./assets/tile_hover.mp3",
      autoLoad: true,
      autoPlay: true
  });

  tilePickSoundObject.setVolume(100);
  tilePickSoundObject.stop();

  var tileSelectSoundObject = soundManager.createSound({
      url: "./assets/tile.mp3",
      autoLoad: true,
      autoPlay: true
  });

  tileSelectSoundObject.setVolume(100);
  tileSelectSoundObject.stop();
  /****************/

  // Populate Buttons DIV from objectsArray
  objectsArray.forEach(function(item, index){
    $('.buttons').append('<button type="button" class="btn btn-primary hvr-push" value="' + item + '">' + item + '</button>');
  });

  addBtnEventHandlers();    //Add Event Handlers for all buttons in DIV only

  //For Input text box in form, 'onblur' Event Handler
  $('.addObject').on('blur', function(e){
    var fieldEmpty = !$(this).val() ? true: false;
    toggleSubmitBtn(fieldEmpty);        //Toggle form Submit button enabled / disabled
  });

  //Submit button onClick Event Handler
  $('.submit-btn').click(function(){
    if($(this).hasClass("active")){         //If Submit button is enabled
      var item = $('.addObject').val();     //Value of form's input field

      btnSubmitSoundObject.stop();
      btnSubmitSoundObject.play();

      event.preventDefault();     //Necessary because a <form> is being used, the default behaviour of a <form> is to reset the page, this stops propagation

      //Add New button entered by user
      $('.buttons').append('<button type="button" class="btn btn-primary hvr-push" value="' + item + '">' + item + '</button>');
      $('.addObject').val("");    //Clear form's value textbox content

      addBtnEventHandlers();      //Add Event Handler for new button
    }else{                        //If Submit button is disabled
      event.preventDefault();     //Stop propagation to avoid the form reloading the whole page again
    }

    //Disable Submit button again
    $(this).addClass("disabled");
    $(this).removeClass("active");
    $(this).removeClass("hvr-pop");
  });
})
