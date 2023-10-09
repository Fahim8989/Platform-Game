/*

The Game Project 7 - Bring it all together

*/
// ---------------------
//       Variables
// ---------------------
var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;

var clouds;
var mountains;
var trees_x;
var collectables;
var canyons;
var dust;

var game_score;
var flagpole;
var lives;

var jumpSound;
var deathSound;
var themeSound;
var flagSound;
var collectSound;
var overSound;
var hitSound;

var platforms;
var enemies;
var dust;
var spikes;

function preload()
{
    soundFormats('mp3', 'wav');

    jumpSound = loadSound('assets/jump.wav');
    jumpSound.setVolume(0.1);

    deathSound = loadSound('assets/death.mp3');
    deathSound.setVolume(0.01);
    
    flagSound = loadSound('assets/flag.mp3');
    flagSound.setVolume(0.1); 
    
    collectSound = loadSound('assets/collect.wav');
    collectSound.setVolume(0.1);
    
    themeSound = loadSound('assets/themesong.mp3');
    themeSound.setVolume(0.01);  
    
    overSound = loadSound('assets/over.mp3');
    overSound.setVolume(0.1); 
    
    hitSound = loadSound('assets/hit.mp3');
    hitSound.setVolume(0.1);
}

function setup()
{
	createCanvas(1024, 576);
	floorPos_y = height * 3/4;
    
    themeSound.loop();
    themeSound.setVolume(0.1);
    
    lives = 4;
    startGame();
}

function draw()
{
	background(222, 183, 255); // fill the sky blue
    noStroke();
    //top
    fill(168,106,221);
    rect(0,0,1024,156);
    //mid
    fill(199,133,236);
    rect(0,156,1024,156);
    //below
    fill(222,183,255);
    rect(0,floorPos_y + 55,1024,156);

    noStroke();
	fill(222,183,220); //draw some green ground
    rect(-10, 432 + 30,1124,104,10);
    
    //snow
    fill(250,250,255);
    rect(-10,432 + 30,1124,10,2);

    //scrolling
    push();
    translate(scrollPos,0);
    
    //clouds
    drawClouds();
    
    //mountain
    drawMountains();
    
    //tree
    drawTrees();
    
    //dust
    drawDust();
    
    //canyon
    for(var a = 0; a < canyons.length; a++)
        {
            {
            drawCanyon(canyons[a]);
            checkCanyon(canyons[a]);
            }
        }
    
    //collectable
    for(var r = 0; r < collectables.length; r++)
        {
        if(!collectables[r].isFound)
            {
                drawCollectable(collectables[r]);
                checkCollectable(collectables[r]);
                
            }        
        }
    
    //flagpole
    if(flagpole.isReached == false)
        {
            checkFlagpole();
        }
            renderFlagpole(); 
    
    if (lives > 0)
        {
            fill(255,255,255);
            textSize(30);
            textFont("futura");
            text("'W' = Jump", 495,303);
            
            fill(255,255,255);
            textSize(30);
            textFont("futura");
            text("'A' = Left, 'D' = Right", 430,269);
            
            fill(255);
            textSize(20);
            text("Turn around, you're heading the wrong way!", -1000,399);
            
            text("Up here for a bonus card! --->", 3600,299);
            
            textSize(30)
            text("Nothing to see over here... Turn around and head to the flagpole to complete the level!", 4700,300);
        }
        
    //platforms
    for(var i = 0; i < platforms.length; i++)
    {
        platforms[i].draw();
    }
    
    //enemy
    for(var i = 0; i < enemies.length; i++)
    {
        enemies[i].update();
        enemies[i].draw();
        if(enemies[i].isContact(gameChar_world_x, gameChar_y))
        {
            startGame();
            break;
        }
    }
    
    //spikes
    for(var i = 0; i < spikes.length; i++)
    {
        spikes[i].update();
        spikes[i].draw();
        if(spikes[i].isContact(gameChar_world_x, gameChar_y))
        {
            startGame();
            break;
        }
    }
    
    pop();
    

	// Draw game character.
	
	drawGameChar();
    
    //Score
    noStroke();
    fill(222, 203, 255);
    textSize(20);
    textFont("futura");
    text("CARDS: " + game_score, 20, 40);
    
    //Lives
//    text("Lives: " + lives, 20,60);
//    
    if(gameChar_y >= 800 && lives > 0)
        {
            startGame();
            themeSound.stop();
            themeSound.play();
        }
    
    for(i = 0; i < lives; i++)
    {
        noStroke();
        noFill();
        stroke(222, 183, 255);
        rect(900,10,110,40,30);
        fill(222, 183, 255);
        ellipse(920+30*i,24,10.8,10.8);
        ellipse(930+30*i,24,10.8,10.8);
        triangle(935+30*i, 25, 925+30*i, 40, 915+30*i, 25);
    }

    if(lives == 0)
    {
        themeSound.stop();
        noStroke();
        fill(255);
        textFont("futura");
        textSize(20);
        text("Game Over: Press Space to try again...",width/2 - 100, height/2);
        return;
    }
    
    else if(flagpole.isReached)
    {
        noStroke();
        fill(255);
        textFont("futura");
        textSize(20);
        text("Press Space to play again", width/2 - 60, height/2 + 20);
        text("Nice work! You have collected: " + game_score + "/8", width/2 -100, height/2 - 10);
        flagSound.play();
        return;

    }
    
	// Logic to make the game character rise and fall.
        if(isLeft)
    {
		if(gameChar_x > width * 0.2)
		{
			gameChar_x -= 2;
		}
		else
		{
			scrollPos += 2;
		}
	}
        if(isRight)
	{
		if(gameChar_x < width * 0.8)
		{
			gameChar_x += 2;
		}
		else
		{
			scrollPos -= 2; // negative for moving against the background
		}

	}


    
	// Logic to make the game character move or the background scroll.
	if(isLeft)
	{
		if(gameChar_x > width * 0.2)
		{
			gameChar_x -= 3;
		}
		else
		{
			scrollPos += 1;
		}
	}

	if(isRight)
	{
		if(gameChar_x < width * 0.8)
		{
			gameChar_x  += 2;
		}
		else
		{
			scrollPos -= 1; // negative for moving against the background
		}
	}
    
    //platform
    if(gameChar_y < floorPos_y)
    {
        var isContact = false;
            
        for(var i = 0; i < platforms.length; i++)
        {
            if(
                platforms[i].checkContact(gameChar_world_x,gameChar_y) == true
                )
                {
                        isContact = true;
                        break;
                }
        }
            
        if(isContact == false)
            {
                gameChar_y += 3;
                isFalling = true; 
            }
        else
        {
            isFalling = false;            
        }

    }
        else
        {
            isFalling = false;
        }

        if(isPlummeting)
        {
            gameChar_x += 5;
        }
        
        if(gameChar_y > height)
        {
            startGame()
        }


	// Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;
}


// ---------------------
// Key control functions
// ---------------------

// Function for pressing keys

function keyPressed()
{
	// if statements to control the animation of the character when
	// keys are pressed.

	//open up the console to see how these work
	console.log("keyPressed: " + key);
	console.log("keyPressed: " + keyCode);
    
    if(key == 'A' || keyCode == '65')
    {
        isLeft = true;
    }
    
    if(key == 'D' || keyCode == '68')
    {
        isRight = true;
    }
    
    if(key == 'W' || keyCode == '87' || keyCode == '32')
    {
     if(!isFalling)
         {
             gameChar_y -= 100
             jumpSound.play()
         }
    //restart
    }
    if(lives == 0 && keyCode == 32)
        {
            themeSound.play();
            overSound.play();
            startGame();
            lives = 3;
        }
    if(flagpole.isReached && keyCode == 32)
        {
            startGame();
            lives = 3;
        }

}

// Function for release keys

function keyReleased()
{
	// if statements to control the animation of the character when
	// keys are released.

	console.log("keyReleased: " + key);
	console.log("keyReleased: " + keyCode);
    
    if(key == 'A' || keyCode == '65')
    {
        isLeft = false;
    }

    if(key == 'D' || keyCode == '68')
    {
        isRight = false;
    }

}


// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.

function drawGameChar()
{
	// draw game character
    
    if(isLeft && isFalling)
	{
		// add your jumping-left code
    //legs
    noStroke();
    fill(189, 126, 194);
    rect(gameChar_x + 8,            //left leg
         gameChar_y + 25,5,10,5);
    rect(gameChar_x + 20,           //right leg
         gameChar_y + 27,5,10,5);
    ellipse(gameChar_x + 24,
            gameChar_y + 36,
            5,3);
    ellipse(gameChar_x + 9,
            gameChar_y + 34,
            5,3);
   
    //left arm
    fill(189, 126, 194)
    rect(gameChar_x + 20,
         gameChar_y + 10,7,15,5);
    
    //body
    fill(255);
    rect(gameChar_x + 2,
         gameChar_y,25,30,10);
    
    //arms
    fill(189, 126, 194);

    quad(gameChar_x + 18,
         gameChar_y + 9,
         gameChar_x + 23,
         gameChar_y + 9,
         gameChar_x + 18,
         gameChar_y + 20,
         gameChar_x + 14,
         gameChar_y + 19,20);
         
    ellipse(gameChar_x + 20,
            gameChar_y + 9,6,7);
    
    //eyes
    fill(189, 126, 194);
    ellipse(gameChar_x + 1,
         gameChar_y + 10,
         5,8);
    ellipse(gameChar_x + 8,
         gameChar_y + 10,
         5,8);
    line(gameChar_x + 20,
         gameChar_y + 15,
         gameChar_x + 28,
         gameChar_y + 5);
    
    
    //stalk
    fill(1,200,1);
    noStroke()
    quad(gameChar_x + 16,
         gameChar_y + 3,
         gameChar_x + 13,
         gameChar_y + 3,
         gameChar_x + 18,
         gameChar_y - 5,
         gameChar_x + 21,
         gameChar_y - 5);
    ellipse(gameChar_x + 20,
            gameChar_y - 5,
            5,2);


	}
	else if(isRight && isFalling)
	{
		// add your jumping-right code
        //legs
    noStroke()
    fill(189, 126, 194);
    rect(gameChar_x + 8,            //left leg
         gameChar_y + 28,5,10,5);
    rect(gameChar_x + 20,           //right leg
         gameChar_y + 26,5,10,5);
    ellipse(gameChar_x + 24,
            gameChar_y + 35,
            5,3);
    ellipse(gameChar_x + 10,
            gameChar_y + 37,
            5,3);
   
    //left arm
    noStroke();
    fill(189, 126, 194)
    rect(gameChar_x + 20,
         gameChar_y + 10,7,15,5);
    
    //body
    noStroke()
    fill(255);
    rect(gameChar_x + 2,
         gameChar_y,25,30,10);
    
    //right arm
    fill(189, 126, 194);

    quad(gameChar_x + 5,
         gameChar_y + 9,
         gameChar_x + 9,
         gameChar_y + 9,
         gameChar_x + 12,
         gameChar_y + 18,
         gameChar_x + 8,
         gameChar_y + 19,20);
         
    ellipse(gameChar_x + 7,
            gameChar_y + 9,5,7);
    
    //eyes
    fill(189, 126, 194);
    ellipse(gameChar_x + 20,
         gameChar_y + 10,
         5,8);
    ellipse(gameChar_x + 27,
         gameChar_y + 10,
         5,8);
    line(gameChar_x + 20,
         gameChar_y + 15,
         gameChar_x + 28,
         gameChar_y + 5);
    
    //stalk
    fill(1,200,1);
    noStroke()
    quad(gameChar_x + 17,
         gameChar_y + 3,
         gameChar_x + 14,
         gameChar_y + 3,
         gameChar_x + 9,
         gameChar_y - 5,
         gameChar_x + 12,
         gameChar_y - 5);
    ellipse(gameChar_x + 10,
            gameChar_y - 4.5,
            4,3);

	}
	else if(isLeft)
	{
		// add your walking left code
      //legs
    noStroke();
    fill(189, 126, 194);
    rect(gameChar_x + 6,            //left leg
         gameChar_y + 28,5,10,5);
    rect(gameChar_x + 19,           //right leg
         gameChar_y + 28,5,10,5);
   
    //left arm
    fill(189, 126, 194)
    rect(gameChar_x + 20,
         gameChar_y + 10,7,15,5);
    ellipse(gameChar_x + 27,
            gameChar_y + 20,
            6,5);
    
    //body
    fill(255);
    rect(gameChar_x + 2,
         gameChar_y,25,30,10);
    
    //right arm
    fill(189, 126, 194);

    quad(gameChar_x + 18,
         gameChar_y + 13,
         gameChar_x + 22,
         gameChar_y + 15,
         gameChar_x + 19,
         gameChar_y + 23,
         gameChar_x + 14,
         gameChar_y + 23,20);
    ellipse(gameChar_x + 15.5,
            gameChar_y + 22,7,5);
    
    //eyes
    fill(189, 126, 194);
    ellipse(gameChar_x + 2,
            gameChar_y + 12,5,10);
    ellipse(gameChar_x + 9,
            gameChar_y + 12,5,10);
    
    //stalk
    fill(1,200,1);
    noStroke()
    quad(gameChar_x + 16,
         gameChar_y + 3,
         gameChar_x + 13,
         gameChar_y + 3,
         gameChar_x + 18,
         gameChar_y - 5,
         gameChar_x + 21,
         gameChar_y - 5);
    ellipse(gameChar_x + 20,
            gameChar_y - 5,
            5,2);
    


	}
	else if(isRight)
	{
		// add your walking right code
        //legs
    noStroke()
    fill(189, 126, 194);
    rect(gameChar_x + 6,            //left leg
         gameChar_y + 28,5,10,5);
    rect(gameChar_x + 19,           //right leg
         gameChar_y + 28,5,10,5);
   
    //left arm
    fill(189, 126, 194)
    rect(gameChar_x + 20,
         gameChar_y + 10,7,15,5);
    ellipse(gameChar_x + 27,
            gameChar_y + 20,
            6,5);
    
    //body
    fill(255);
    rect(gameChar_x + 2,
         gameChar_y,25,30,10);
    
    //arms
    fill(189, 126, 194);

    quad(gameChar_x + 5,
         gameChar_y + 15,
         gameChar_x + 10,
         gameChar_y + 15,
         gameChar_x + 13,
         gameChar_y + 23,
         gameChar_x + 8,
         gameChar_y + 23,20);
    ellipse(gameChar_x + 11.5,
            gameChar_y + 22,7,5);
    
    //eyes
    fill(189, 126, 194);
    ellipse(gameChar_x + 19,
            gameChar_y + 12,5,10);
    ellipse(gameChar_x + 26,
            gameChar_y + 12,5,10);
    
    //stalk
    fill(1,200,1);
    noStroke()
    quad(gameChar_x + 17,
         gameChar_y + 3,
         gameChar_x + 14,
         gameChar_y + 3,
         gameChar_x + 9,
         gameChar_y - 5,
         gameChar_x + 12,
         gameChar_y - 5);
    ellipse(gameChar_x + 10,
            gameChar_y - 4.5,
            4,3);


	}
	else if(isFalling || isPlummeting)
	{
		// add your jumping facing forwards code
    
         //legs
    noStroke();
    fill(189, 126, 194);
    rect(gameChar_x + 8,
         gameChar_y + 28,5,10,5);
    rect(gameChar_x + 16,
         gameChar_y + 28,5,10,5);
    
    //arms
    rect(gameChar_x - 8,
         gameChar_y - 10,7,20,5);
    rect(gameChar_x + 31,
         gameChar_y - 10,7,20,5);
   
    //body
    fill(255);
    rect(gameChar_x,
         gameChar_y,30,30,10);
    
    //eyes
    fill(189, 126, 194);
    ellipse(gameChar_x + 7,
            gameChar_y + 9,8,5);
    ellipse(gameChar_x + 22,
            gameChar_y + 9,8,5);
    
        //stalk
    stroke(1,200,1);
    strokeWeight(3);
    line(gameChar_x + 15,
         gameChar_y + 2,
         gameChar_x + 15,
         gameChar_y - 8);

	}
	else
	{
		// add your standing front facing code
         //legs
        noStroke();
        fill(189, 126, 194);
        rect(gameChar_x + 6,
             gameChar_y + 28,5,10,5);
        rect(gameChar_x + 19,
             gameChar_y + 28,5,10,5);

        //arms
        fill(189, 126, 194);
        rect(gameChar_x - 6,
             gameChar_y + 10,7,15,5);
        rect(gameChar_x + 29,
             gameChar_y + 10,7,15,5);

        //body
        fill(255);
        rect(gameChar_x,
             gameChar_y,30,30,10);

        //eyes
        fill(189, 126, 194);
        ellipse(gameChar_x + 7,
                gameChar_y + 12,5,10);
        ellipse(gameChar_x + 22,
                gameChar_y + 12,5,10);

        //stalk
        stroke(255,100,100);
        strokeWeight(3);
        line(gameChar_x + 15,
             gameChar_y + 2,
             gameChar_x + 15,
             gameChar_y - 8);

    }
	}

// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.

function drawClouds()
{
        for(var c = 0; c < clouds.length; c++)
        {
            clouds[c].x_pos = clouds[c].x_pos-1*clouds[c].speed; //move cloud

            if(clouds[c].x_pos < gameChar_world_x - 1650 || clouds[c].x_pos > gameChar_world_x + 1700 )
        {
            clouds[c].x_pos = gameChar_world_x + 1700;
        }

            fill(250,250,250);
            ellipse(clouds[c].x_pos + 80,
                    clouds[c].y_pos,
                    45);
            ellipse(clouds[c].x_pos + 115,
                    clouds[c].y_pos - 10,
                    70);
            ellipse(clouds[c].x_pos + 150,
                    clouds[c].y_pos,
                    45);
            ellipse(clouds[c].x_pos + 55,
                    clouds[c].y_pos + 5,
                    30);
            ellipse(clouds[c].x_pos + 175,
                    clouds[c].y_pos + 5,
                    30);
            ellipse(clouds[c].x_pos + 37,
                    clouds[c].y_pos + 10,
                    20);

            ellipse(clouds[c].x_pos + 580,
                    clouds[c].y_pos,
                    45);
            ellipse(clouds[c].x_pos + 615,
                    clouds[c].y_pos - 10,
                    70);
            ellipse(clouds[c].x_pos + 650,
                    clouds[c].y_pos,
                    45);
            ellipse(clouds[c].x_pos + 555,
                    clouds[c].y_pos + 5,
                    30);
            ellipse(clouds[c].x_pos + 675,
                    clouds[c].y_pos + 5,
                    30);
            ellipse(clouds[c].x_pos + 690,
                    clouds[c].y_pos + 10,
                    20);
            ellipse(clouds[c].x_pos + 538,
                    clouds[c].y_pos + 10,
                    20);

            ellipse(clouds[c].x_pos + 280,
                    clouds[c].y_pos + 50,
                    45);
            ellipse(clouds[c].x_pos + 315,
                    clouds[c].y_pos + 40,
                    70);
            ellipse(clouds[c].x_pos + 350,
                    clouds[c].y_pos + 50,
                    45);
            ellipse(clouds[c].x_pos + 255,
                    clouds[c].y_pos + 55,
                    30);
            ellipse(clouds[c].x_pos + 375,
                    clouds[c].y_pos + 55,
                    30);
        }
}

// Function to draw mountains objects.

function drawMountains()
{
    for(var m = 0; m < mountains.length; m++)
    {
        noStroke()
        fill(200,200,200);
        triangle(mountains[m].x_pos + 240,
                 mountains[m].y_pos + 332,
                 mountains[m].x_pos + 325,
                 mountains[m].y_pos + 230,
                 mountains[m].x_pos + 400,
                 mountains[m].y_pos + 332);

        triangle(mountains[m].x_pos + 450,
                 mountains[m].y_pos + 332,
                 mountains[m].x_pos + 500,
                 mountains[m].y_pos + 240,
                 mountains[m].x_pos + 580,
                 mountains[m].y_pos + 332);

        fill(210,210,210);
        triangle(mountains[m].x_pos + 310,
                 mountains[m].y_pos + 332,
                 mountains[m].x_pos + 420,
                 mountains[m].y_pos + 160,
                 mountains[m].x_pos + 500,
                 mountains[m].y_pos + 332);

        fill(255,255,255);
        //peak 1
        triangle(mountains[m].x_pos + 308,
                 mountains[m].y_pos + 250,
                 mountains[m].x_pos + 325,
                 mountains[m].y_pos + 230,
                 mountains[m].x_pos + 340,
                 mountains[m].y_pos + 250);

        //peak 2
        triangle(mountains[m].x_pos + 395,
                 mountains[m].y_pos + 200,
                 mountains[m].x_pos + 420,
                 mountains[m].y_pos + 160,
                 mountains[m].x_pos + 438,
                 mountains[m].y_pos + 200);

        triangle(mountains[m].x_pos + 395,
                 mountains[m].y_pos + 200,
                 mountains[m].x_pos + 400,
                 mountains[m].y_pos + 210,
                 mountains[m].x_pos + 410,
                 mountains[m].y_pos + 200);

        triangle(mountains[m].x_pos + 410,
                 mountains[m].y_pos + 200,
                 mountains[m].x_pos + 415,
                 mountains[m].y_pos + 210,
                 mountains[m].x_pos + 425,
                 mountains[m].y_pos + 200);

        triangle(mountains[m].x_pos + 425,
                 mountains[m].y_pos + 200,
                 mountains[m].x_pos + 430,
                 mountains[m].y_pos + 210,
                 mountains[m].x_pos + 438,
                 mountains[m].y_pos + 200);

        //peak 3
        triangle(mountains[m].x_pos + 517,
                 mountains[m].y_pos + 260,
                 mountains[m].x_pos + 500,
                 mountains[m].y_pos + 240,
                 mountains[m].x_pos + 489,
                 mountains[m].y_pos + 260);
     }
}

// Function to draw trees objects.

function drawTrees()
{
        for(var i = 0; i < trees_x.length; i++)
        {
        noStroke()
        fill(95,35,0);
        rect(trees_x[i] - 10,
             floorPos_y - 10,20,40);

        stroke(255,155,180);
        strokeWeight(4);
        fill(255,155,180);
        stroke(255,155,180);
        triangle(trees_x[i] - 40,
                 floorPos_y,
                 trees_x[i],
                 floorPos_y - 30,
                 trees_x[i] + 40,
                 floorPos_y);

        triangle(trees_x[i] - 30,
                 floorPos_y - 20,
                 trees_x[i],
                 floorPos_y - 40,
                 trees_x[i] + 30,
                 floorPos_y - 20);

        triangle(trees_x[i] - 20,
                 floorPos_y - 35,
                 trees_x[i],
                 floorPos_y - 60,
                 trees_x[i] + 20,
                 floorPos_y - 35);

        triangle(trees_x[i] - 10,
                 floorPos_y - 55,
                 trees_x[i],
                 floorPos_y - 80,
                 trees_x[i] + 10,
                 floorPos_y - 55);

        stroke(255,255,255);
        strokeWeight(4);
        line(trees_x[i] - 10,
             floorPos_y - 55,
             trees_x[i] - 1,
             floorPos_y - 80);
        line(trees_x[i],
             floorPos_y - 82,
             trees_x[i] + 10,
             floorPos_y - 55);

        ellipse(trees_x[i],
                floorPos_y - 60,1,1);
        ellipse(trees_x[i] - 10,
                floorPos_y - 45,1,1);
        ellipse(trees_x[i] + 10,
                floorPos_y - 45,1,1);
        ellipse(trees_x[i] - 16,
                floorPos_y - 25,1,1);

        fill(255,255,255);
        triangle(trees_x[i] - 4,
                 floorPos_y - 72,
                 trees_x[i],
                 floorPos_y - 88,
                 trees_x[i] + 4,
                 floorPos_y - 71);
        }
}


// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.

function drawCanyon(t_canyon)
{
        noStroke()
    fill(253, 232, 255)
    rect(t_canyon.x_pos + 14,
         floorPos_y + 30,
         t_canyon.width,578);
    rect(mountains.x_pos - 100,
         floorPos_y + 100,
         t_canyon.width + 11924,64);
}

// Function to check character is over a canyon.

function checkCanyon(t_canyon)
{
    if(gameChar_world_x > t_canyon.x_pos + 10 && gameChar_world_x < t_canyon.x_pos + 95 && gameChar_y >= floorPos_y) 
        {             
            isPlummeting = true;
            gameChar_y += 10; 
            isLeft = false;
            isRight = false;
            deathSound.play();
        }  
    
    else     
        {         
            isPlummeting = false;
        }
}

// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

// Function to draw collectable objects.

function drawCollectable(t_collectable)
{
    noStroke();
    fill(255,188,0);
    quad(t_collectable.x_pos - 5,
         t_collectable.y_pos - 15,
         t_collectable.x_pos + 15,
         t_collectable.y_pos - 5,
         t_collectable.x_pos + 5,
         t_collectable.y_pos + 20,
         t_collectable.x_pos - 15,
         t_collectable.y_pos + 10);
    
    fill(255);
    quad(t_collectable.x_pos - 3,
         t_collectable.y_pos - 12,
         t_collectable.x_pos + 12,
         t_collectable.y_pos - 4,
         t_collectable.x_pos + 3,
         t_collectable.y_pos + 17,
         t_collectable.x_pos - 12,
         t_collectable.y_pos + 9);
    
    fill(255,188,0);
//    strokeWeight(1);
//    stroke(255,0,0);
    ellipse(t_collectable.x_pos,
            t_collectable.y_pos + 2,12,12);
}

// Function to check character has collected an item.

function checkCollectable(t_collectable)
{
    var d = dist(gameChar_world_x,
                 gameChar_y,
                 t_collectable.x_pos,
                 t_collectable.y_pos);
    
    if(d < 20)
    {
        t_collectable.isFound = true;  
        game_score += 1;
        collectSound.play();
    }
}
    
// ----------------------------------
// Flagpole render and check functions
// ----------------------------------

function renderFlagpole()
{
    if(flagpole.isReached == false)
    {
        noStroke();
        fill(255);
        rect(flagpole.x_pos,
             floorPos_y - 30,
             10,
             60);
        fill(199,133,236);
        triangle(flagpole.x_pos + 10,
                 450,
                 flagpole.x_pos + 10,
                 420,
                 flagpole.x_pos + 50,
                 440);
        fill(255,255,255,100);
        ellipse(flagpole.x_pos + 20,
                435,
                10,10);
    }
    else
    {
        noStroke();
        fill(255)
        rect(flagpole.x_pos,floorPos_y - 30,10,60)
        fill(199,133,236)
        triangle(flagpole.x_pos + 10,
                 430,
                 flagpole.x_pos + 10,
                 400,flagpole.x_pos + 50,
                 420)
        fill(255,255,255,100);
        ellipse(flagpole.x_pos + 20,
                415,
                10,10);
    }
}

function checkFlagpole()
{
    if(dist(gameChar_world_x, gameChar_y, flagpole.x_pos, floorPos_y) < 50)
    {
        flagpole.isReached = true;
    }
    else
    {
        flagpole.isReached = false;
    }
}

// Function to display dust ball

function drawDust()
{
            for(var c = 0; c < dust.length; c++)
        {
            dust[c].x_pos = dust[c].x_pos-1*dust[c].speed; //move cloud

            if(dust[c].x_pos < gameChar_world_x - 2950 || dust[c].x_pos > gameChar_world_x + 100 )
        {
            dust[c].x_pos = gameChar_world_x + 700;
        }
            noStroke();
            fill(255,255,255,100);
            ellipse(dust[c].x_pos + 1800,
                    dust[c].y_pos + 210,
                    25);
        }
}

// Function contains arrays and scrolling

function startGame()
{
	gameChar_x = width/2;
	gameChar_y = floorPos_y;

	// Variable to control the background scrolling.
	scrollPos = 0;

	// Variable to store the real position of the gameChar in the game
	// world. Needed for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;

	// Initialise arrays of scenery objects.
    trees_x = [-1010,-300,-50,250,300,350,900,1400,600,2500,2200,2650,1800,3000,2900,3800,3500]
    
    clouds = [
               {x_pos: -800, y_pos: 80, speed: 0.5},
               {x_pos: -300, y_pos: 200, speed: 1},
               {x_pos: 250, y_pos: 80, speed: 0.5},
               {x_pos: 1000, y_pos: 100, speed: 1},
               {x_pos: 1500, y_pos: 100, speed: 1},
               {x_pos: 2200, y_pos: 150, speed: 1},
               {x_pos: -1200, y_pos: 150, speed: 1},
               {x_pos: -1800, y_pos: 150, speed: 1}
                
             ]
    mountains = [
               {x_pos: -500, y_pos: 130},
               {x_pos: 400, y_pos: 130},
               {x_pos: 1300, y_pos: 130},
               {x_pos: 2200, y_pos: 130},
               {x_pos: 2600, y_pos: 130},
               {x_pos: 2800, y_pos: 130}
                ]
    
    canyons = [
                {x_pos:-1300, width: 100},
                {x_pos:-1400, width: 100},
                {x_pos:-1500, width: 100},
                {x_pos:-1600, width: 100},
                {x_pos:-20, width: 100},
                {x_pos:700, width: 100},
                {x_pos:1500, width: 100},
                {x_pos:2200, width: 100},
                {x_pos:2300, width: 100},
                {x_pos:2450, width: 100},
                {x_pos:2710, width: 100},
                {x_pos:3200, width: 100},
                {x_pos:5700, width: 100},
                {x_pos:5800, width: 100},
                {x_pos:5900, width: 100},
                {x_pos:12450, width: 100}

              ]
    collectables = [
                {x_pos: 35, y_pos: 230, size: 50},
                {x_pos: 755, y_pos: 350, size: 50},
                {x_pos: 1955, y_pos: 450, size: 50},
                {x_pos: 1175, y_pos: 300, size: 50},
                {x_pos: 2925, y_pos: 450, size: 50},
                {x_pos: 135, y_pos: 450, size: 50},
                {x_pos: 2435, y_pos: 450, size: 50},
                {x_pos: 4435, y_pos: 450, size: 50}
                   ]
    dust = [
               {x_pos: -200, y_pos: 240, speed: 5},
               {x_pos: -200, y_pos: 240, speed: 1}
           ]
    
    game_score = 0;
    
    flagpole = {
            x_pos: 4000, 
            isReached: false,
            height:100
    }
    lives -= 1;
    
    platforms = [];
    
    //platform -1
    platforms.push(createPlatform(200,floorPos_y - 40,100));
    
    //platform -2
    platforms.push(createPlatform(100,floorPos_y - 100,100));
    
    //platform -3
    platforms.push(createPlatform(-50,floorPos_y - 40,100));
    
    // platform 1
    platforms.push(createPlatform(1150,floorPos_y - 30,50));
    
    platforms.push(createPlatform(1850,floorPos_y - 100,150));

    //platform 2
    platforms.push(createPlatform(2250,floorPos_y - 30,150));
   
    //platform 3
    platforms.push(createPlatform(3650,floorPos_y - 40,100));
    
    //platform 4
    platforms.push(createPlatform(3800,floorPos_y - 110,450));
    
    enemies = [];
    
    enemies.push( new Enemy(850,floorPos_y + 30,400));
    enemies.push( new Enemy(1100,floorPos_y + 30,350));
    enemies.push( new Enemy(-150,floorPos_y + 30,100));
    enemies.push( new Enemy(2260,floorPos_y - 30,125));
    enemies.push( new Enemy(2600,floorPos_y + 30,100));
    
    spikes = [];
    
    //spike strip 1
    spikes.push( new Spikes(105,floorPos_y + 30,200));
    spikes.push( new Spikes(120,floorPos_y + 30,200));
    spikes.push( new Spikes(135,floorPos_y + 30,200));
    spikes.push( new Spikes(150,floorPos_y + 30,200));
    spikes.push( new Spikes(165,floorPos_y + 30,200));
    spikes.push( new Spikes(180,floorPos_y + 30,200));
    
    //spike strip 2
    spikes.push( new Spikes(1850,floorPos_y + 30,200));
    spikes.push( new Spikes(1865,floorPos_y + 30,200));
    spikes.push( new Spikes(1880,floorPos_y + 30,200));
    spikes.push( new Spikes(1895,floorPos_y + 30,200));
    spikes.push( new Spikes(1910,floorPos_y + 30,200));
    spikes.push( new Spikes(1925,floorPos_y + 30,200));
    spikes.push( new Spikes(1940,floorPos_y + 30,200));
    spikes.push( new Spikes(1955,floorPos_y + 30,200));
    spikes.push( new Spikes(1970,floorPos_y + 30,200));
    spikes.push( new Spikes(1985,floorPos_y + 30,200));

}

// Function to check platforms work

function createPlatform(x,y,length)
{
    var p = {
        x: x,
        y: y,
        length: length,
        draw: function()
        {
            fill(99,64,135)
            rect(this.x,this.y,this.length,15,200)
            fill(255)
            rect(this.x,this.y,this.length,5,200)

        },
        
        checkContact: function(gc_x,gc_y)
        {
            //checks contact of character on platform
            if(gc_x > this.x && gc_x < this.x + this.length)
                {
                    var d = this.y - gameChar_y;
                    if(d >= 0 && d < 38)
                    {
                        return true;
                    }
                }
            
            return false;
            
        }
        
    }

    return p;
}

// Function to check enemies work

function Enemy(x,y,range)
{
    this.x = x;
    this.y = y;
    this.range = range;
    this.current_x = x;
    this.incr = 1;
    
    this.draw = function()
    {
        fill(250,250,250);
        rect(this.current_x - 25,
                this.y - 50,
                50,50,20);
        fill(222, 183, 255);
        
        //eyes
        ellipse(this.current_x - 10,
                this.y - 35,
                10);
        ellipse(this.current_x + 10,
                this.y - 35,
                10);
        
        //teeth
        fill(255,0,0,50)
        triangle(this.current_x - 13,
                 this.y - 23,
                 this.current_x - 7,
                 this.y - 7,
                 this.current_x + 1,
                 this.y -23)
        triangle(this.current_x + 1,
                 this.y - 23,
                 this.current_x + 7,
                 this.y - 7,
                 this.current_x + 15,
                 this.y -23)
        
    }
    
    this.update = function()
    {
        this.current_x += this.incr
        
        if(this.current_x < this.x)
        {
            this.incr = 1;
        }
        else if(this.current_x > this.x + this.range)
        {
            this.incr = -1;
        }
    }
    
    this.isContact = function(gc_x,gc_y)
    {
        var d = dist(gc_x, gc_y, this.current_x, this.y);
        
        if(d < 40)
        {
            hitSound.play();
            return true;
        }
        
        return false;
        
    }
}

// Function to check spike strips work

function Spikes(x,y,range)
{
    this.x = x;
    this.y = y;
    this.range = range;
    this.current_x = x;
    this.incr = 1;
    
    this.draw = function()
    {   
        fill(168,106,221)
        rect(this.current_x + 1,
             this.y - 24,
             14,
             5)
        
        triangle(this.current_x + 1,
                 this.y - 23,
                 this.current_x + 7,
                 this.y - 7,
                 this.current_x + 15,
                 this.y -23)
    }
    
    this.update = function()
    {
        this.y += this.incr
        
        if(this.y < 370)
        {
            this.incr = 2.5;
        }
        else if(this.y > 470)
        {
            this.incr = -1.5;
        }
    }
    
    this.isContact = function(gc_x,gc_y)
    {
        var d = dist(gc_x, gc_y, this.current_x, this.y);
        
        if(d < 10)
        {
            hitSound.play();
            return true;
        }
        
        return false;
        
    }
}




