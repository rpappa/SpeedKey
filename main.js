//Holds json about current game (key)
var game;

$(document).ready(function() {
  //Hide stuff that should show only when the game has started
    $('#game').hide();
    $('#timer').hide();
    $('#name').hide();
    $('#highscores').hide();
    $('.infloat').hide();
    $('#floating').hide();

    $('.bigtext').textfill({ maxFontPixels: 90 });

    //Emulate keypresses when boxes are clicked
    $('#a').click(function() {
      // console.log('a click');
      handleKeyPress(65);
    });
    $('#b').click(function() {
      // console.log('b click');
      handleKeyPress(66);
    });

    //When the leaf box is clicked. Redo for each key
    $('#leafs').click(function() {
      //Switch bg color. Change bg color for each key
      $('body').animate({'background-color':'#91EA5E'}, {duration:450,queue: false});
      loadJSON('leafs', function(json) {
        game=JSON.parse(json);
        visualizeGame(true);
      });
    });

    $('#animals').click(function() {
      //Switch bg color. Change bg color for each key
      $('body').animate({'background-color':'#5414D5'}, {duration:450,queue: false});
      $('body').animate({'color':'#C0D3C5'}, {duration:450,queue: false});
      $('body').animate({'outline-color':'#C0D3C5'}, {duration:450,queue: false});
      $('body').animate({'border-color':'#C0D3C5'}, {duration:450,queue: false});
      loadJSON('animals', function(json) {
        game=JSON.parse(json);
        visualizeGame(true);
      });
    });
});

//Hides chooser, shows game box
function visualizeGame(start) {
  $('#options').hide();
  $('#picture').hide();
  displayS=0;
  displayM=0;
  $('#s').text(Math.round(displayS*10)/10);
  $('#m').text(displayM);
  $('#chooser').fadeOut({duration:450,queue: false});
  //After thats done bring up the game box
  setTimeout(function() {
    $('#game').fadeIn({duration:250,queue: false});
    $('#game').animate({width:'75%'},{duration:350,queue: false});
    setTimeout(function() {
      $('#game').animate({height:'60%'}, 350);
      setTimeout(function() {
      if(start) {
        $('#timer').show();
        startGame();
      }
    }, 350);
    }, 400);
  }, 500);
}

var s=0;
var displayS=0;
var displayM=0;


var timerF = function() {
  s+=.1;
  displayS+=.1;
  if(displayS>=60) {
    displayS-=60;
    displayM+=1;
  }
  $('#s').text(Math.round(displayS*10)/10);
  $('#m').text(displayM);
}

var timer = null;

function timerManager(flag) {
   if(flag) {
     timer =  setInterval(timerF, 100);
   } else {
     clearInterval(timer);
   }
}

var playing = false;

function startGame() {
  playing = true;
  s=0;
  displayS=0;
  displayM=0;
  // console.log(game);
  countDown();
  setTimeout(function () {
    $('#countdown').fadeIn(20);
    $('#countdown').html("start");
    $('#countdown').fadeOut(900);
    setTimeout(function() {
      $('#time').hide();
      $('#options').show();
      $('#picture').show();
      $('.corner').textfill({maxFontPixels:80});
      items=game.items;
      timerManager(true);
      loadItem();
    },1000);
  }, 7000 /*7000*/);
}

var count = 5;

function countDown() {
  count=5;
  // console.log(count);
  $('#countdown').show();
  $('#countdown').fadeIn(0);
  $('#countdown').html(game.name);
  $('#time').show();
  $('#time').textfill({maxFontPixels:800});
  cdManager(true);
}

var countDownF = function() {
  $('#countdown').fadeIn(20);
  $('#countdown').html(count);
  $('#countdown').fadeOut(900);
  count--;
  if(count==-1) {
    cdManager(false);
  }
}

var cd = null;

function cdManager(flag) {
   if(flag) {
     cd =  setInterval(countDownF, 1000);
   } else {
     clearInterval(cd);
   }
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
    if(seq && playing) {handleKeyPress(event.which)};
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

//Flash picture box green when you completed an item
function flashPicGreen() {
  $('#picture').css("background-color","rgba(0,255,0,1)");
  $('#picture').animate({'background-color':'rgba(255,255,255,0)'}, {duration:1000,queue: false});
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
        $('#nametext').text(current.name);
        $('#name').show();
        $('#name').fadeOut(1000);
        loadItem();
        flashPicGreen();
      } else {
        child = child.a.next;
        loadChild();
      }
    } else {
      child = game.start;
      loadChild();
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
        $('#nametext').text(current.name);
        $('#name').show();
        $('#name').fadeOut(1783*2 /*god bless america*/);
        flashPicGreen();
        loadItem();
      } else {
        child = child.b.next;
        loadChild();
      }
    } else {
      child = game.start;
      loadChild();
      flashRed("b");
      on=0;
    }
    $('#on').text(on);
  }
}

//Smilar to loadItem but loads from child variable
function loadChild() {
  $('#desctext').text(child.text);
  $('#desc').textfill({maxFontPixels:108});

  //Set choice text
  $('#atext').text(child.a.text);
  $('#btext').text(child.b.text);
  $('.fill').textfill({maxFontPixels:50, innerTag:'p'});
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
    return;
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
  playing=false;
  timerManager(false);
  addScore(Math.round(s*10)/10);
  alert(Math.round(s*10)/10 + ' seconds');
  visualizeHighscores();
}

function visualizeHighscores() {
  // console.log('showing hscores')
  $('.infloat').hide();
  $('#highscores').fadeIn(340);
  setTimeout(function() {
    $('#floating').fadeIn(100);
    $('#floating').animate({width:'21%'},{duration:350});
    $('#floating').animate({height:'42%'},{duration:350});
    $('.infloat').fadeIn(100);
    $('#urtime').text('Your time: ' + Math.round(s*10)/10 + ' seconds');
    var scores = getscores();
    scores.sort(function(a,b){return a - b});
    // console.log(scores);
    $('#top').empty();
    for(i=0;i<=4;i++) {
      if(scores[i]) {
        $('#top').append('<li>'+scores[i]+' seconds</li>');
      }
    }
    $('#home').click(function() {
      showHome();
    });
    $('#restart').click(function() {
      // console.log('restart clicked');
      restart();
    });

    // $('#top').append('<li>'+scores[1]+' seconds</li>');
    // $('#top').append('<li>'+scores[2]+' seconds</li>');
  },340);
}

$('#home').click(function() {
  showHome();
});

function restart() {
  // console.log('RESTARTING');
  $('#floating').fadeOut(340);
  $('#highscores').fadeOut(340);
  loadJSON(game.name, function(json) {
    game=JSON.parse(json);
    visualizeGame(true);
  });
  // startGame();
}

function showHome() {
  $('#floating').fadeOut(340);
  $('#highscores').fadeOut(340);
  $('#timer').hide();
  $('#options').fadeOut(500);
  $('#picture').fadeOut(500);
  $('#game').animate({height:'5%'}, 350);
  setTimeout(function () {
    $('#game').animate({width:'1%'}, {duration: 350, queue:false});
    $('#game').fadeOut({duration: 400, queue:false});
    $('body').animate({'background-color':'#4CC355'}, {duration:450,queue: false});
    $('body').animate({'color':'#1A1A1A'}, {duration:450,queue: false});
    $('body').animate({'outline-color':'#1A1A1A'}, {duration:450,queue: false});
    $('body').animate({'border-color':'#1A1A1A'}, {duration:450,queue: false});
    setTimeout(function() {
      $('#chooser').fadeIn({duration:450,queue: false});
    },400);
    setTimeout(function() {
      $('#time').show();
      $('#timer').hide();
      $('#options').fadeIn(1);
      $('#picture').fadeIn(1);
    },850);
  }, 350);
}

function addScore(score) {
  var scores;
  if(!localStorage.getItem("scores"+game.name)) {
    scores = [];
    scores.push(score);
    localStorage["scores"+game.name] = JSON.stringify(scores);
  } else {
    scores = JSON.parse(localStorage["scores"+game.name]);
    scores.push(score);
    localStorage["scores"+game.name] = JSON.stringify(scores);
  }
}

function getscores() {
  return JSON.parse(localStorage.getItem("scores"+game.name));
}
