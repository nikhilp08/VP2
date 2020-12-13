//Create variables here

var dog;
var happyDog;
var database;
var foodS;
var foodStock;
var dogIMG;
var happyDogIMG;
var lastFed,fedTime;
var feed, addFood, foodObject;

function preload()
{
  //load images here
  dogIMG = loadImage("dogImg.png")
	happyDogIMG = loadImage("dogImg1.png")
}

function setup() {
  createCanvas(1000, 400);

  database = firebase.database();
  
  dog = createSprite(800,200,150,150);
  dog.addImage(dogIMG);
  dog.scale = 0.5;

  foodStock = database.ref('Food');
  foodStock.on("value",readStock);
  foodObject = new Food(); 

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed = data.val();
  });

  feed = createButton("Feed the Dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  
}


function draw() {  

  background("blue");

  
  drawSprites();
  //add styles here

  fill("white");
  textSize(21);

  if(lastFed>=12){
    text("Last Feed: "+ lastFed%12+"PM",345,95);
  }
  else if(lastFed===0){
    text("Last Feed: 12AM",345,95);
  }
  else{
    text("Last Fed: " +lastFed + "AM",345,95);
  }

  text("Food Remaining: "+foodS,345,130);
  text("Press the Buttons to Feed the Dog",270,35);

  foodObject.display();
}

function readStock(data){
  foodS = data.val();
  foodObject.updateFoodStock(foodS);
}

function feedDog(){
  dog.addImage(happyDogIMG);
  foodObject.updateFoodStock(foodObject.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObject.getFoodStock(),
    FeedTime:hour()
  })
}

function addFoods(){
  foodS++
  database.ref('/').update({
    Food:foodS
  })
}


