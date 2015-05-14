var game;

$(document).ready(function() {
    $('#game').hide();
    $('.bigtext').textfill({ maxFontPixels: 90 });

    //When the leaf box is clicked. Redo for each key
    $('#leafs').click(function() {
      //Switch bg color. Change bg color for each key
      $('body').animate({'background-color':'#91EA5E'}, {duration:450,queue: false});
      loadJSON('leafs', function(json) {
        game=JSON.parse(json);
        visualizeGame(true);
      });
    });
});

//Hides chooser, shows game box
function visualizeGame(start) {
  $('#options').hide();
  $('#picture').hide();
  $('#chooser').fadeOut({duration:450,queue: false});
  //After thats done bring up the game box
  setTimeout(function() {
    $('#game').fadeIn({duration:250,queue: false});
    $('#game').animate({width:'75%'},{duration:350,queue: false});
    setTimeout(function() {
      $('#game').animate({height:'60%'}, 350);
      setTimeout(function() {
      if(start) {
        startGame();
      }
    }, 350);
    }, 400);
  }, 500);
}

function startGame() {
  console.log(game);
  countDown();
  setTimeout(function () {
    $('#countdown').fadeIn(20);
    $('#countdown').html("start");
    $('#countdown').fadeOut(900);
    setTimeout(function() {
      $('#timer').hide();
      $('#options').show();
      $('#picture').show();
      $('.corner').textfill({maxFontPixels:80});
      items=game.items;
      loadItem();
    },1000);
  }, 1000 /*7000*/);
}

function countDown() {
  var count = 5;
  $('#countdown').html(game.name);
  $('#timer').textfill({maxFontPixels:800});
  var refresh = setInterval(function() {
    $('#countdown').fadeIn(20);
    $('#countdown').html(count);
    $('#countdown').fadeOut(900);
    count--;
    if(count==-1) {
      clearInterval(refresh);
    }
  }, 1000);
}


//Sequence of correct keypresses (ex. aba)
var seq;

//All 'items' from JSON
var items;

//Current item you're on
var current;

//Index in sequence (seq) you are on
var on=0;

//Holds the child element of start that you are on
var child;

//Send keypress to handleKeyPress. Could've put code here but that's no fun
$(document).keydown(function(event){
  $('#key').text(event.which);
    handleKeyPress(event.which);
});

//Simple methods to flash a choice box green (correct) or red (incorrect)
function flashGreen(box) {
  $('#'+box).css("background-color","rgba(0,255,0,1)");
  $('#'+box).animate({'background-color':'rgba(255,255,255,0.3)'}, {duration:300,queue: false});
}

function flashRed(box) {
  $('#'+box).css("background-color","rgba(255,0,0,1)");
  $('#'+box).animate({'background-color':'rgba(255,255,255,0.3)'}, {duration:300,queue: false});
}

//Handles keypress, checking if you got right or wrong.
function handleKeyPress(l) {
  //65=a 49=1 81=q 37=left
  if(l==65 || l==49 || l==81 || l==37) {
    //check if the correct answer is a
    if(seq.charAt(on)=="a") {
      // alert("good");
      flashGreen("a");
      on++;
      if(on >= seq.length) {
        loadItem();
      }
    } else {
      flashRed("a");
      on=0;
    }
    $('#on').text(on);
    //66=b 69=e 39=right 50=2 68=d
  } else if (l==66 || l==69 || l==39 || l==50 || l==68) {
    if(seq.charAt(on)=="b") {
      // alert("good");
      flashGreen("b");
      on++;
      if(on >= seq.length) {
        loadItem();
      }
    } else {
      flashRed("b");
      on=0;
    }
    $('#on').text(on);
  }
}

//Smilar to loadItem but loads from child variable
function loadChild() {

}

// Thanks: http://stackoverflow.com/questions/1527803/generating-random-numbers-in-javascript-in-a-specific-range
function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Load a random item
function loadItem() {
  //If there are no items, its over
  if(items.length == 0) {
    end();
  }

  //select random item
  var index =randInt(0, items.length-1)
  current=items[index];
  items.splice(index, 1);
  seq=current.seq;
  on=0;
  child=game.start;

  //Set description text
  $('#desctext').text(game.start.text);
  $('#desc').textfill({maxFontPixels:108});

  //Set choice text
  $('#atext').text(game.start.a.text);
  $('#btext').text(game.start.b.text);
  $('.fill').textfill({maxFontPixels:50, innerTag:'p'});
  // $('.fill').textfill({maxFontPixels:50, innerTag:'p'});

  //load image
  $('#display').attr('src', game.folder + '/' + current.img)

  $('#seq').text(seq);
  $('#on').text(on);
}

//Run when you've gone through all items
function end() {
  alert('you won');
}
