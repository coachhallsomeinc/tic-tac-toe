let g = null;
// create an app

// models
// gameModel - Model Class, TicTacToeModel class
// player1 - Player class
// player2 - Player class

// view
// render
// boardBuilder
// UIBuilder, header, footer, socialMedia

// controller
// gameController - GameController class (managing the game interaction)
// UICOntroller -

// init
// create the App and initialize it

// render board

// tile click
// tile, render

// reset/restart

// winCondition

class Game {
  constructor() {
    this.players = [];
    this.tiles = [];
    this.possibleWins = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    this.turn = 0;
    this.uib = new UIBuilder(); // 1, //0 falsey true/false  boolean - 1 == true, 0 == false
    this.clicks = 0;
    this.status = true;
    this.toast = null;
  }

  init() {
    this.players = [new Player("Player 1", "X", 1), new Player("Player 2", "O", 2)];
    this.tiles = [];
    for (var i = 0; i < 9; i++) {
      let t = new Tile(i);
      //console.log(t);
      this.tiles.push(t);
    }
    this.render();
  }

  setPlayerName(id, name) {
    this.players[id].name = name;
  }

  addMove(e) {
    if (this.status) {
      var id = e.target.id.split("-");

      var tileId = id[1];

      if (this.tiles[tileId].move == null) {
        let cp = this.players[this.turn];
        let ct = this.tiles[tileId];
        let m = new Move(cp, ct, cp.symbol, cp.symbolValue);
        this.tiles[tileId].setValue(m);
        this.turn = Number(!this.turn);

        this.clicks++;
        this.render();
      }

      this.evaluateWinCondition();
    }
  }
  evaluateWinCondition() {
    // look at all of the moves in the moves member
    // X = 1
    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    // O = 2
    // null = 0
    // bucket where I have valid clicks - valid click: not null, same as previous
    let winClicks = [];
    let cp = this.players[this.turn];
    var msg = cp.name + "'s turn complete";

    for (var i = 0; i < this.possibleWins.length; i++) { // 8 in the list
      var last = null; // the value of the previous index value [0, 1, 2] 
      winClicks = [];
      for (var j = 0; j < this.possibleWins[i].length; j++) {
        var ct = this.tiles[this.possibleWins[i][j]];
        
        if (ct.move != null) {
          last = ct.move.value;
        }
        
        if(last != null){
          if(last == ct.move.value){
            winClicks.push(last);
            last = null;
          }
        }

        if (winClicks.length == 3) {
          var sum = winClicks.reduce(reducer);
          if(sum % 3 == 0){
            var winner = this.players[sum / 3 - 1]; // is sum 6 or 24
            msg = winner.name + " is the winner";
            this.status = false;
          }
        } else {
          if (this.clicks == 9) {
            msg = "No winner";
          }
        }
      }
      
    }

    var toast_body = document.getElementById("toast_body");
    toast_body.textContent = msg;
    this.toast.show();
  }
  render() {
    // build board using moves array
    let app = document.getElementById("app");
    app.innerHTML = "";

    this.renderGUI(app);

    this.renderBoard(app);
  }
  renderBoard(parent) {
    let board = this.uib.generateHTMLElement(
      "div",
      "container",
      "board",
      parent
    );
    // append rows and colums
    let row = null;
    for (var i = 0; i < this.tiles.length; i++) {
      if (i % 3 == 0 || i == 0) {
        row = this.uib.generateHTMLElement("div", "row", "", board);
      }

      let col = this.uib.generateHTMLElement("div", "col-4 tile", "", row);

      this.tiles[i].buildTile(col, this.addMove.bind(this)); // binds to the Game object

      let tile = this.tiles[i].getTileObj();

      col.appendChild(tile);

      row.appendChild(col);

      if (i % 3) {
        board.appendChild(row);
      }
    }
    parent.appendChild(board);
  }
  renderGUI(app) {
    // display
    // add header
    // add reset button
    let reset_btn = document.getElementById("reset_btn");
    reset_btn.addEventListener("click", this.resetGame.bind(this));
    // add toast
    let toastEl = document.getElementById("toaster");
    this.toast = new bootstrap.Toast(toastEl, null);
  }
  showResolve() {}
  resetGame() {
    this.init();
    this.status = true;
  }
}

class Player {
  constructor(name, symbol, v) {
    this.name = name;
    this.symbol = symbol;
    this.symbolValue = v;
  }

  setName(n) {
    this.name = n;
  }
}

class Move {
  constructor(player, tile, l, v) {
    this.player = player;
    this.tile = tile;
    this.label = l;
    this.value = v;
  }
}

class Tile {
  constructor(id) {
    this.id = id;
    this.move = null;
    this.tileObj = null;
  }
  buildTile(parent, handler) {
    let uib = new UIBuilder();
    let tileObj = uib.generateHTMLElement(
      "div",
      "btn btn-lg btn-primary",
      `tile-${this.id}`,
      parent,
      "click",
      handler
    );
    if (this.move != null) {
      tileObj.textContent = this.move.label;
    }
    this.tileObj = tileObj;
  }
  getTileObj() {
    return this.tileObj;
  }
  setValue(v) {
    this.move = v;
  }
}

class UIBuilder {
  constructor() {}
  generateHTMLElement(
    type,
    classes,
    id = false,
    parent = false,
    eventType = false,
    handler = false
  ) {
    let element = document.createElement(type);
    element.classList = classes.split(",");
    if (id) {
      element.id = id;
    }
    if (handler) {
      element.addEventListener(eventType, handler);
    }

    if (parent) {
      parent.appendChild(element);
    }

    return element;
  }
}

// load this when the body onload completes
function init() {
  g = new Game();
  g.init();
}

//document.addEventListener('load', init);
