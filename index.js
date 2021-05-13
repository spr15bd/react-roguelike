function Map(props) {
	//console.log("Props in map: "+props);
  	const grid = [];
	if (props != undefined) {
		for (var j=0; j<props.height; j++) {
			for (var i=0; i<props.width; i++) {
				if (props.grid[i][j].type != null & props.grid[i][j].visibility != null) {
					let squareId=props.grid[i][j].type;
					let visibility=props.grid[i][j].visibility;
					grid.push(
						<div id={squareId} className={visibility}>
						</div>
					);
				}
			}
		}
	}
  	return(
    		<div>
      			<div id="map">
        			{grid}
      			</div>
    		</div>
  	);
}

class Status extends React.Component {
  	constructor(props) {
    		super(props);
    		this.handleButtonClick=this.handleButtonClick.bind(this);
	}
  	handleButtonClick() {
    		this.props.darknessOnOff();
  	}
  	render() {
    		return(
      			<div id="status">
       				<div className="player-property">Health: {this.props.playerHealth}
        			</div>  
        			<div className="player-property">Weapon: {this.props.weapon}
        			</div>   
        			<div className="player-property">Attack: {this.props.attack}
        			</div>   
        			<div className="player-property">Level: {this.props.level}
        			</div> 
        			<div className="player-property">Next Level: {this.props.nextLevel} XP
        			</div>
        			<div className="player-property">Dungeon: {this.props.dungeon}
        			</div>
        			<div id="darkness"><button type="button" id="darkness-control"  onClick={() => this.handleButtonClick()}/*{(e) =>this.props.darknessOnOff(e)}*/>Toggle Darkness</button>
        			</div>
      			</div>
    		);
  	}
}
function Modal(props) {
  	/* Display message */
  	if (!props.messageVisible) {
    		return null;
  	} else {
    		return(
      			<div id="message">{props.message}
      			</div>
    		);
  	}
}
class Data extends React.Component {
  	constructor(props) {
    		super(props);
    		this.state={
      			playerHealth:this.playerHealth,
      			bossHealth:this.bossHealth,
      			messageVisible:false,
      			message:"",
      			keyBoardLocked:false,
      			isDark:true,
      			grid:[[]]
    		};
    		this.displayMessage=this.displayMessage.bind(this);
    		this.toggleDarkness=this.toggleDarkness.bind(this);
    		this.updateDarkness=this.updateDarkness.bind(this);
    		this.playerHealth=this.props.playerHealth;
    		this.bossHealth=100;
    		this.weapon="gloves";
    		this.attack=3;
    		this.dungeon=0;
    		this.level=0;
    		this.xp=0;
    		this.levelUpXP=[60,180,300,420];
    		this.xpForNextLevel=60;
    		/* 	Create an empty grid, width and height specified in <Main/> component
    			The grid is cleared whenever a new dungeon is loaded
    			The grid is passed to the <Map/> component
		*/
		console.log("Map height: "+this.props.mapHeight);
    		this.grid=new Array(this.props.mapWidth);
    		for (var x=0;x<this.props.mapWidth;x++) {
      			this.grid[x]=new Array(this.props.mapHeight);
    		}
    		//this.state.grid=this.grid;
		this.isDark = true;
    		this.loadDungeon();
    		window.scrollTo(0,0);
  	}
  	componentWillMount() {
    		document.onkeydown = this.key.bind(this);
		//document.addEventListener("keydown", this.key);
    		window.focus();
    		this.displayMessage=this.displayMessage.bind(this);
    		this.toggleDarkness=this.toggleDarkness.bind(this);
    		this.updateDarkness=this.updateDarkness.bind(this);
		this.updateDarkness();
   	}
  	render() {
    		return(
      			<div>
        			<Status playerHealth={this.playerHealth} weapon={this.weapon} attack={this.attack} dungeon={this.dungeon} level={this.level} xp={this.xp} nextLevel={this.xpForNextLevel} darknessOnOff={this.toggleDarkness}/>
        			<Modal messageVisible={this.state.messageVisible} message={this.state.message}/>
        			<Map width={this.props.mapWidth} height={this.props.mapHeight} grid={this.grid}/>
      			</div>
    		);
  	}
  	loadDungeon() {
    		for (var x=0;x<this.props.mapWidth;x++) {
      			for (var y=0;y<this.props.mapHeight;y++) {
        			this.grid[x][y]={
          				type: "wall",
          				visibility: "invisible"
        			};
      			}
    		}
    		let roomWidth=Math.floor((Math.random() *12) + 10);
    		let roomHeight=Math.floor((Math.random() *12) + 10);
    		let xPos=35+Math.round((Math.random() * roomWidth));
    		let yPos=15+Math.round((Math.random() * roomHeight));
    		//rooms is an array to store the data (position and size) of each room
    		let rooms=[];
    		rooms.push([xPos,yPos,roomWidth,roomHeight]);
    		// Draw first room
    		this.createRoom(xPos, yPos, roomWidth, roomHeight);
    		let storedWidth=roomWidth;
    		let storedHeight=roomHeight;
    		let randomRoom=0;
    		let nextRoom = ["up","down","left","right"];
    		//Draw the rest of the rooms
    		while (rooms.length<21) {
      			randomRoom=Math.round(Math.random()*(rooms.length-1));
      			xPos=rooms[randomRoom][0];
      			yPos=rooms[randomRoom][1];
      			storedWidth=rooms[randomRoom][2];
      			storedHeight=rooms[randomRoom][3];
      			for (var x=0; x<1; x++) {
        			let index=Math.floor(Math.random()*4);
        			let offset=Math.floor(Math.random()*5-2);
        			if (nextRoom[index]=="up") {
          				//Draw next room above current one
          				roomWidth=Math.round((Math.random() *12) + 10);
          				roomHeight=Math.round((Math.random() *12) + 10);
          				if (this.createRoom(xPos+offset,yPos-roomHeight-1,roomWidth,roomHeight)==true) {
            					rooms.push([xPos+offset,yPos-roomHeight-1,roomWidth,roomHeight]);;
            					this.createDoor(xPos+offset+Math.round((storedWidth+roomWidth)/4), yPos-1);
          				} 
        			} else if (nextRoom[index]=="down") {
					roomWidth=Math.round((Math.random() *12) + 10);
          				roomHeight=Math.round((Math.random() *12) + 10);
          				//Draw next room below current one
					if (this.createRoom(xPos+offset,yPos+storedHeight+1,roomWidth,roomHeight)==true) {
            					rooms.push([xPos+offset,yPos+storedHeight+1,roomWidth,roomHeight]);
            					this.createDoor(xPos+offset+Math.round((storedWidth+roomWidth)/4), yPos+storedHeight);
          				} 
        			} else if (nextRoom[index]=="left") {
          				//Draw next room left of current one
          				roomWidth=Math.round((Math.random() *12) + 10);
          				roomHeight=Math.round((Math.random() *12) + 10);
          				if (this.createRoom(xPos-roomWidth-1,yPos+offset,roomWidth,roomHeight)==true) {
            					rooms.push([xPos-roomWidth-1, yPos+offset,roomWidth,roomHeight]);
            					this.createDoor(xPos-1, yPos+offset+Math.round((storedHeight+roomHeight)/4));
          				}
         			} else {
          				//Draw next room right of current one
          				roomWidth=Math.round((Math.random() *12) + 10);
          				roomHeight=Math.round((Math.random() *12) + 10);
          				if (this.createRoom(xPos+storedWidth+1,yPos+offset,roomWidth,roomHeight)==true) {
            					rooms.push([xPos+storedWidth+1, yPos+offset,roomWidth,roomHeight]);
            					this.createDoor(xPos+storedWidth, yPos+offset+Math.round((storedHeight+roomHeight)/4));
          				} 
        			}
      			}
    		}
    		// Introduce the player to the map
    		let playerSpawned=false;
    		while (!playerSpawned) {
      			this.playerPos={
        			x:Math.round(Math.random()*this.props.mapWidth/2),
        			y:Math.round(20+Math.random()*10)//(this.props.mapHeight-1))
      			};
      			if (this.grid[this.playerPos.x][this.playerPos.y].type=="floor") {
        			this.grid[this.playerPos.x][this.playerPos.y].type="player";
        			//this.updateDarkness();
        			playerSpawned=true;
      			}
    		}
    		// Introduce some health containers (powerups)
    		let healthContainers=this.props.healthContainers;
    		let currentContainers=0;
    		while (currentContainers<healthContainers) {
      			this.healthPos={
        			x:Math.round(Math.random()*(this.props.mapWidth-1)),
        			y:Math.round(Math.random()*(this.props.mapHeight-1))
      			};
      			if (this.grid[this.healthPos.x][this.healthPos.y].type=="floor") {
        			this.grid[this.healthPos.x][this.healthPos.y].type="health-container";
        			currentContainers++;
      			}                       
    		}
    		// Introduce a weapon
    		let weaponSpawned=false;
    		while (!weaponSpawned) {
      			this.weaponPos={
        			x:Math.round(Math.random()*(this.props.mapWidth-1)),
        			y:Math.round(Math.random()*(this.props.mapHeight-1))
      			};
      			if (this.grid[this.weaponPos.x][this.weaponPos.y].type=="floor") {
        			weaponSpawned=true;
        			this.grid[this.weaponPos.x][this.weaponPos.y].type="weapon";
      			}
    		}
    		// Monsters
    		let monsters=this.props.monsters;
    		let currentMonsters=0;
    		while (currentMonsters<monsters) {
      			this.monsterPos={
        			x:Math.round(Math.random()*(this.props.mapWidth-1)),
        			y:Math.round(Math.random()*(this.props.mapHeight-1))
      			};
      			if (this.grid[this.monsterPos.x][this.monsterPos.y].type=="floor") {
        			this.grid[this.monsterPos.x][this.monsterPos.y].type="monster";
        			this.grid[this.monsterPos.x][this.monsterPos.y].health=40;
        			currentMonsters++;
      			}                       
    		}
    		// Boss
    		let bossSpawned=false;
    		while (this.dungeon==4&&!bossSpawned) {
      			this.bossPos={
        			x:Math.round(Math.random()*(this.props.mapWidth-1)),
        			y:Math.round(Math.random()*(this.props.mapHeight-1))
      			};
      			if (this.grid[this.bossPos.x][this.bossPos.y].type=="floor"&&this.grid[this.bossPos.x+1][this.bossPos.y].type=="floor"&&this.grid[this.bossPos.x][this.bossPos.y+1].type=="floor"&&this.grid[this.bossPos.x+1][this.bossPos.y+1].type=="floor") {
        			this.grid[this.bossPos.x][this.bossPos.y].type="boss";
        			this.grid[this.bossPos.x+1][this.bossPos.y].type="boss";
        			this.grid[this.bossPos.x][this.bossPos.y+1].type="boss";
        			this.grid[this.bossPos.x+1][this.bossPos.y+1].type="boss";
        			bossSpawned=true;
      			}
    		}
    		// Add a teleport (to the next level)
     		if (this.dungeon<4) {
      			let teleportSpawned=false;
      			while (!teleportSpawned) {
        			this.teleportPos={
          				x:Math.round(Math.random()*(this.props.mapWidth-1)),
          				y:Math.round(Math.random()*(this.props.mapHeight-1))
        			};
        			if (this.grid[this.teleportPos.x][this.teleportPos.y].type=="floor") {
          				this.grid[this.teleportPos.x][this.teleportPos.y].type="teleport";
          				teleportSpawned=true;
       				}
      			}
    		}
  	}
  	createRoom(xPos, yPos, width,height) {
    		if (xPos<10||xPos>this.props.mapWidth-width-10||yPos<4||yPos>this.props.mapHeight-height) {
      			return false;
    		}
    		// check the area this room will go is empty
    		for (var j=0; j<height; j++) {
      			for (var i=0; i<width; i++) {
        			if (this.grid[i+xPos][j+yPos].type=="floor") {
          				return false;
        			}
      			}
    		}
    		for (var j=0; j<height; j++) {
      			for (var i=0; i<width; i++) {
        			this.grid[i+xPos][j+yPos].type="floor";
      			}
    		}
    		return true;
  	}
  	createDoor(xPos, yPos) {
    		this.grid[xPos][yPos].type="floor";
  	}
  	key(event) {
    		if (!this.state.keyBoardLocked) { 
			switch(event.keyCode) {
        			case 37 :
          				this.movePlayer(-1, 0);
          				break;
        			case 39 :
          				this.movePlayer(1, 0);
          				break;
        			case 38 : 
          				event.preventDefault();
          				this.movePlayer(0, -1);
          				break;
        			case 40 :
          				event.preventDefault();
          				this.movePlayer(0,1);
          				break;
      			}
			this.updateDarkness();	// big pauses here
			this.setState({grid:this.grid});
    		}
    	}
  	movePlayer(x, y) {
		
    		let nextPlayerPositionType=this.grid[this.playerPos.x+x][this.playerPos.y+y].type;
    		if (nextPlayerPositionType=="floor"||nextPlayerPositionType=="health-container"||nextPlayerPositionType=="teleport"||nextPlayerPositionType=="weapon") {
      			this.grid[this.playerPos.x][this.playerPos.y].type="floor";
     			this.playerPos.x+=x;
      			this.playerPos.y+=y;
      			this.grid[this.playerPos.x][this.playerPos.y].type="player";
      			window.scrollBy(0, y*10);
      			if (nextPlayerPositionType=="health-container") {
        			this.playerHealth=parseInt(this.playerHealth)+20;
      			} else if (nextPlayerPositionType=="teleport") {
        			// reset grid, teleport to next level
        			for (var x=0;x<this.props.mapWidth;x++) {
          				for (var y=0;y<this.props.mapHeight;y++) {
            					this.grid[x][y].type="wall";
          				}
        			}
        			this.loadDungeon(++this.dungeon);
        			window.scrollTo(0,0);
      			} else if (nextPlayerPositionType=="weapon") {
        			switch (this.dungeon) {
          				case 0: { this.weapon="stick";  this.attack=5; break; }
          				case 1: { this.weapon="axe";  this.attack=8; break; }
          				case 2: { this.weapon="sword";  this.attack=11; break; }
          				case 3: { this.weapon="fireball";  this.attack=15; break; }
          				case 4: { this.weapon="thunderbolt";  this.attack=20; break; }
        			}       
      			}
    		} else if (nextPlayerPositionType=="monster") {
      			this.grid[this.playerPos.x+x][this.playerPos.y+y].health-=this.attack*Math.round(Math.random()*7);
      			this.playerHealth-=Math.round(Math.random()*20);
      			//if a monster has been slain, increase player's xp
      			if (this.grid[this.playerPos.x+x][this.playerPos.y+y].health <=0 ) {
        			this.xp+=10;
        			// level up if xp is high enough
        			for (var i=0; i<this.levelUpXP.length; i++) {
          				if (this.xp>=this.levelUpXP[i]) {
            					this.level=i+1;
            				} 
        			}
        			for (var i=this.levelUpXP.length-1; i>=0; i--) {
          				if (this.xp<this.levelUpXP[i]) {
            					this.xpForNextLevel=this.levelUpXP[i]-this.xp;
          				}
        			}
        			this.grid[this.playerPos.x][this.playerPos.y].type="floor";
        			this.playerPos.x+=x;
        			this.playerPos.y+=y;
        			this.grid[this.playerPos.x][this.playerPos.y].type="player";
        			this.setState({grid:this.grid});
      			}
    		} else if (nextPlayerPositionType=="boss") {
      			this.bossHealth-=this.attack*Math.round(Math.random()*7);
      			this.playerHealth-=Math.round(Math.random()*20);
      			if (this.bossHealth<=0) {
      				this.displayMessage("You win - Well done!");
    			}
    		}
    		
    		// if the player's health is 0, game over
    		if (this.playerHealth<=0) {
      			this.displayMessage("Game Over - Unlucky");
      			window.scrollTo(0,0);
    		}
   	}
  	updateDarkness() {
    		if (this.isDark) {
    			for (var x=0; x<this.props.mapWidth; x++) {
      				for (var y=0; y<this.props.mapHeight; y++) {
        				if (x>=this.playerPos.x-this.props.flashlightRadius && x<this.playerPos.x+this.props.flashlightRadius+1 && y>=this.playerPos.y-this.props.flashlightRadius && y<this.playerPos.y+this.props.flashlightRadius+1) {
          					if (x>=0 && x<this.props.mapWidth && y>=0 && y<this.props.mapHeight) {
            						this.grid[x][y].visibility="visible";
          					}
        				} else {
          					this.grid[x][y].visibility="invisible";
        				}
        				if ((x<=this.playerPos.x-(this.props.flashlightRadius-3)||x>=this.playerPos.x+(this.props.flashlightRadius-3))&&(y<=this.playerPos.y-(this.props.flashlightRadius-1)||y>=this.playerPos.y+this.props.flashlightRadius-1)||(y<=this.playerPos.y-(this.props.flashlightRadius-3)||y>=this.playerPos.y+(this.props.flashlightRadius-3))&&(x<=this.playerPos.x-(this.props.flashlightRadius-1)||x>=this.playerPos.x+(this.props.flashlightRadius-1))) {
          					if (x>=0 && x<this.props.mapWidth && y>=0 && y<this.props.mapHeight) {
            						this.grid[x][y].visibility="invisible";
          					}
        				}
       				}
				
    			}
    		} else {
      			for (var x=0; x<this.props.mapWidth; x++) {
      				for (var y=0; y<this.props.mapHeight; y++) {
        				this.grid[x][y].visibility="visible";
      				}
				
    			}
    		}
		//this.setState({grid:this.grid});
  	}
  	toggleDarkness() {
    		this.isDark = !this.isDark;
		this.updateDarkness();
		this.setState({grid:this.grid});
  	}
  	// display win or lose message, reload game
  	displayMessage(message) {
    		this.setState({keyBoardLocked:true});
    		this.setState({messageVisible:true});
    		this.setState({message:message});
    		setTimeout(function () {
      			this.setState({messageVisible:false});
      			this.weapon="gloves";
      			this.attack=3;
      			this.dungeon=0;
      			this.level=0;
      			this.xp=0;
      			this.levelUpXP=[60,180,300,420];
      			this.xpForNextLevel=60;
      			this.playerHealth=this.props.playerHealth;
      			this.setState({
        			keyBoardLocked:false
      			}, () => {
        			this.loadDungeon()
			});
       		}.bind(this), 2000);
    	}
}
class Main extends React.Component {
  	constructor(props) {
    		super(props);
    	}
  	render() {
    		return(
      			<div id="container-fluid">
        			<div id="title">React Roguelike
        			</div>
        			<div id="caption">Kill the boss in dungeon 4. &nbsp; &nbsp;   Use ↑ ↓ ← → keys to move.   &nbsp; &nbsp; Green = Health,  &nbsp;  Red = Enemy.
        			</div>
        			<div>
          				<Data mapWidth="128" mapHeight="120" healthContainers="10" playerHealth="100" monsters="25" flashlightRadius={13}/>
        			</div>
      			</div>
    		);
    	}
}

ReactDOM.render (
  	<Main />, 
  	document.getElementById('root')
)
