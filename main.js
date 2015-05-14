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

var correct;
var seq;
var items;
var current;
var on=0;
var child;

$(document).keydown(function(event){
  $('#key').text(event.which);
    handleKeyPress(event.which);
});

function flashGreen(box) {
  $('#'+box).css("background-color","rgba(0,255,0,1)");
  $('#'+box).animate({'background-color':'rgba(255,255,255,0.3)'}, {duration:300,queue: false});
}

function flashRed(box) {
  $('#'+box).css("background-color","rgba(255,0,0,1)");
  $('#'+box).animate({'background-color':'rgba(255,255,255,0.3)'}, {duration:300,queue: false});
}
function handleKeyPress(l) {
  if(l==65 || l==49 || l==81 || l==37) {
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
  } else if (l==66 || l==69 || l==39 || l==50) {
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

// Thanks: http://stackoverflow.com/questions/1527803/generating-random-numbers-in-javascript-in-a-specific-range
function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

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

function end() {
  alert('you won');
}
