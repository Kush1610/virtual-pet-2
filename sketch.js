var gameState = 0; 
var fedTime,lastFed,foodRem;
var dog,sadDog,happyDog, database;
var form, player, game,playerCount; 
var foodS,foodStock;
var addFood;
var greeting
var foodObj;
var value
//create feed and lastFed variable here

function preload(){
sadDog=loadImage("dog7.png");
happyDog=loadImage("dog8.png");
milkimg = loadImage("Milk.png");
bgimg = loadImage("bg3.jpg");
bg2img = loadAnimation("bg/I-0.png","bg/I-1.png","bg/I-2.png","bg/I-3.png","bg/I-4.png","bg/I-5.png","bg/I-6.png","bg/I-7.png","bg/I-8.png");
flowerimg = loadAnimation("flower/Z-0.png","flower/Z-1.png","flower/Z-2.png","flower/Z-3.png");
flower2img = loadAnimation("flower2/T-0.png","flower2/T-1.png","flower2/T-2.png","flower2/T-3.png"); 
butterflyimg = loadAnimation("butterfly/0-0.png","butterfly/0-2.png","butterfly/0-4.png","butterfly/0-5.png","butterfly/0-9.png","butterfly/0-12.png","butterfly/0-13.png","butterfly/0-15.png","butterfly/0-16.png","butterfly/0-17.png"); 
startimg=loadImage("startb.png");
}

function setup() {
  database=firebase.database();
  createCanvas(1000,600);

  foodObj = new Food();

  
  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  dog=createSprite(800,500,150,150);
  dog.addImage(sadDog);
  dog.scale=1.5;
  dog.visible=false

  //create feed the dog button here

  milkbottle = createSprite(150,320)
  milkbottle.addImage(milkimg)
  milkbottle.visible = 0
  milkbottle.scale = 0.1

  greeting = createElement('h1'); 
  greeting.x=350
  greeting.y=75

  flower = createSprite(150,350,20,20)
  flower.addAnimation("flower",flowerimg)
  flower.scale = 0.4
  flower.visible=false
  flower2 = createSprite(900,320,20,20)
  flower2.addAnimation("flower",flower2img)
  flower2.scale = 0.4
  flower2.visible=false
  butterfly = createSprite(0,350,20,20)
  butterfly.addAnimation("flower",butterflyimg)
  butterfly.scale = 0.1
  butterfly.visible=false
bg = createSprite(500,300,20,20)
bg.addAnimation("flower",bg2img)
bg.scale = 3

start = createSprite(500,550,20,20)
start.addImage(startimg)
start.scale = 0.5
//start.visible=false
}

function draw() {

if (gameState===0)
{
  background("lightgreen");
  fill("black");
  textSize(30);
  textFont("Algerian");
  text("Feed your dog🐶", 410,30);


  flower.visible=false
  flower2.visible=false
  butterfly.visible=false
  if(mousePressedOver(start))
  
  {
    gameState=1
  }

  drawSprites()
  
}
  if (gameState===1)
  {
  background(bgimg);
  drawSprites();
  flower.visible=true
  flower2.visible=true
  butterfly.visible=true
  dog.visible=true
  start.visible=false
  bg.visible=false

  butterfly.velocityX=1.5
  butterfly.velocityY=-0.5
  foodObj.display();
  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data)
  {
    lastFed=data.val();
  })

  addFood=createButton("Add Food");
  addFood.position(1200,145);
  addFood.mousePressed(addFoods);


  feedFood=createButton("Feed Food🥛");
  feedFood.position(1050,145);
  feedFood.mousePressed(feedDog);
 
  fill(57,32,12);
  textSize(25);
  if(lastFed>=12){
  text("Your dog was last fed at:"+lastFed%12 + " PM", 10,50);
  }else if(lastFed==0){
  text("Your dog was last fed at:"+"12 AM",10,50);
  }else{
  text("Your dog was last fed at:"+lastFed + " AM", 10,50);
  }


   fill(4,23,117)
   textSize(20)
   text(value,400,dog.y-80)
  }
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}

function feedDog()
{
  foodObj.getFoodStock();
  if(foodObj.foodStock<=0)
  {
    foodObj.foodStock=0;
    milkbottle.visible=0;
    dog.addImage(sadDog);
  }
  else{
    dog.addImage(happyDog);
    if(foodObj.foodStock===1)
    {
        milkbottle.visible=0;
        dog.addImage(sadDog);
    }
    else
    milkbottle.visible = 0
    foodObj.updateFoodStock(foodObj.foodStock-1);
    database.ref('/').update({
    Food:foodObj.foodStock,
    FeedTime:hour()
    });
  }
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}
