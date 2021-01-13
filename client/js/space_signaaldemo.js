

import * as THREE from '/node_modules/three/build/three.module.js';


import { OrbitControls } from '/node_modules/three/examples/jsm/controls/OrbitControls.js';


import Stats 		 from '/node_modules/three/examples/jsm/libs/stats.module.js';

import { ColladaLoader } from '/node_modules/three/examples/jsm/loaders/ColladaLoader.js';

import { RectAreaLightUniformsLib } from '/node_modules/three/examples/jsm/lights/RectAreaLightUniformsLib.js';

import { EffectComposer } from '/node_modules/three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from '/node_modules/three/examples/jsm/postprocessing/RenderPass.js';
// import { UnrealBloomPass } from './node_modules/three/examples/jsm/postprocessing/UnrealBloomPass.js';


// import { UnrealBloomPass } from '/lib/unreal_bloompass_selective.js';

import { TWEEN } from "/node_modules/three/examples/jsm/libs/tween.module.min.js";

// MAIN
var koll;

// standard global variables
var container, scene, camera, renderer, controls, stats;

var clock = new THREE.Clock();
// custom global variables

var MovingCube;
var collidableMeshList = [];

var arrowList = [];
var directionList = [];

var box = new THREE.Box3();
var line = new THREE.Line();

var wall;

var soundShapes = [];
var soundOrbits = [];
var speakers = [];

var tempLine = new THREE.Line();

var worldPosition;

var lastTime = 0;

var elf;

function createSoundshape(id){

	var wallGeometry = new THREE.BoxBufferGeometry( 200, 200, 200 );
	var wallMaterial = new THREE.MeshBasicMaterial( {color: 0x8888ff,wireframe:true,transparent: true, opacity: 0.25} );



	soundShapes[id] = new THREE.Mesh(wallGeometry, wallMaterial);
	soundShapes[id].position.set(100+id*100, 50, -100+id*100);
	soundShapes[id].shapeType = "sound";
	soundShapes[id].name = id;
	soundShapes[id].lastPosition = [0,0,0]//{"x":0,"y":0,"z":0};
	soundShapes[id].positionChanged = 0;



	soundShapes[id].material.color =  new THREE.Color("rgb("+conf.players[id].r+", "+conf.players[id].g+", "+conf.players[id].b+")");
		soundShapes[id].material.opacity = 0;
		soundShapes[id].material.transparent= true;

	soundShapes[id].geometry.computeBoundingBox();
	scene.add(soundShapes[id]);

	// Create orbit

	soundOrbits[id] = {};

	changeOrbit(id,"ellipse");

	// soundOrbits[id].morphedCurve = soundOrbits[id].originalCurve;
	// soundOrbits[id].scale = {"x":1,"y":1,"z":1};
	// soundOrbits[id].position = {"x":0,"y":0,"z":0};

	// create line from original curve
	// var points = soundOrbits[id].originalCurve.getPoints( 50 );
	// var geometry = new THREE.BufferGeometry().setFromPoints( points );
	// var material = new THREE.LineBasicMaterial( { color : 0xff0000 } );
	// soundOrbits[id].visibleLine = new THREE.Line( geometry, material );

	scene.add(soundOrbits[id].line);


}

function changeOrbit(id, type){


	if(type=="ellipse"){

		var curve = new THREE.EllipseCurve(
			0,  0,            // ax, aY
			1000, 1000,           // xRadius, yRadius
			0,  2 * Math.PI,  // aStartAngle, aEndAngle
			false,            // aClockwise
			0                 // aRotation
		);

	}


	// create line from original curve
	var points = curve.getPoints( 50 );
	var geometry = new THREE.BufferGeometry().setFromPoints( points );
	var material = new THREE.LineBasicMaterial( { color : 0xff0000 } );
	material.color = soundShapes[id].material.color;
	material.opacity = 0;
	material.transparent= true;
	var line = new THREE.Line( geometry, material );

	soundOrbits[id].line = line;
	soundOrbits[id].points = points;
	soundOrbits[id].changed = true;

	soundOrbits[id].lastPosAt = 0;
	soundOrbits[id].speed = 0;


	calculateNewOrbitCurve(id);

	// for (var i = 0; i < points.length; i = i+3) {
	// 	soundOrbits[id].points.push(new THREE.Vector3( points[i],points[i+1], points[i+2] ));
	// }



}

function loadModel(file){


		// loading manager
		var loadingManager = new THREE.LoadingManager( function () {
			scene.add( elf );
		} );

		// collada
		var loader = new ColladaLoader( loadingManager );
		loader.load( file, function ( collada ) {
			elf = collada.scene;
			elf.scale.x = 2.5;
			elf.scale.y = 2.5;
			elf.scale.z = 2.5;
		} );


}


function createSpeaker(id){

	var cubeGeometry = new THREE.BoxBufferGeometry( 10, 120, 60 );
	var wireMaterial = new THREE.MeshBasicMaterial( { color: 0x424141 } );
	speakers[id] = new THREE.Mesh( cubeGeometry, wireMaterial );
	speakers[id].position.set(conf.speakers[id][1]*10,100,conf.speakers[id][2]*10);
	speakers[id].shapeType = "speaker";
	speakers[id].name = id;
	speakers[id].brightness = [];
	speakers[id].material.color  = new THREE.Color("rgb(0, 0, 0)");
	scene.add( speakers[id] );	
	
}

/////////////////////////////////////////////////////////////////////////////////



var vilkurPos = 
[
[25.7,32.329,522,200],
[28.711,73.92,1007,200],
[43.138,52.532,643,200],
[44.499,15.313,437,200],
[52.965,50.387,866-250,250],
[74.366,69.215,515-200,240],
[88.106,32.434,783-200,240],
[116.3,52.532,799,200],
[136.398,32.434,1137,200],
[140.256,77.772,493,200],
[153.075,56.377,980,200],
[190.434,47.097,801,200],
[204.753,84.104,1500,200],
[214.794,23.999,901,200],
[225.924,61.65,1203,200],
[252.031,41.552,1081,200],
[261.463,79.596,769,200],
[266.132,45.389,1453,200],
[275.973,82.238,1483,200],
[295.692,23.974,1203,200]
];

for (var i = 0; i < vilkurPos.length; i++) {

	var x = vilkurPos[i][0]*3.5073657725;
	var y = vilkurPos[i][1]*3.5073657725;

	vilkurPos[i][0] = y - 339.5-10;
	vilkurPos[i][1] = x - 555-10;
	vilkurPos[i][2] = vilkurPos[i][2]/10-100;

}
           




// SIGNAAL


	var vilurid = [];
	// var vilkurPos = [];


	var numberOfStripes = 16;

	function createVilkur(id){


		vilurid.push({"stripes":[],"lights":[]});

		var numberOfSides = numberOfStripes;
		  var size = 7;
		  var Ycenter =  (Math.random() * 900) -450; 
		  var Xcenter =  (Math.random() * 260) -290;

		  if(Ycenter>0){
				  var z = (Math.random() * 100) +100 - 100;
			  } else {
				  var z = (Math.random() * 200) +100 - 200;
		  }

		  //console.log(Xcenter+":"+Ycenter+":"+z);

		 // vilkurPos.push([Xcenter,Ycenter,z])

		 Ycenter = vilkurPos[id][1];
		 Xcenter = vilkurPos[id][0];
		 z = vilkurPos[id][2];


		  var red =  Math.floor((Math.random() * numberOfSides)); 

		for (var i = 0; i < numberOfSides;i++) {
			var x = Xcenter + size * Math.cos(i * 2 * Math.PI / numberOfSides);
			var y = Ycenter + size * Math.sin(i * 2 * Math.PI / numberOfSides);
			

			var geometry = new THREE.CubeGeometry(2.4,vilkurPos[id][3],1,1,1,1);

			if(red!=i){
				var material = new THREE.MeshBasicMaterial( { color: 0xcccccc,emissive: 0x111111 } );
			} else {
				var material = new THREE.MeshBasicMaterial( { color: 0xff0000,emissive: 0xFFFFFF } );
			}

			var cube = new THREE.Mesh( geometry, material );
			cube.position.set( y, z, x );
			cube.rotation.y = THREE.Math.degToRad(360/numberOfStripes*i);
			scene.add( cube );
			vilurid[id].stripes.push(cube);

		


		} // for

					// LIGHT
			if(id){


			var spotLight = new THREE.SpotLight( 0xffffff ,0.1,1);
			spotLight.position.set( y, z, x );

			spotLight.castShadow = true;

			// spotLight.shadow.mapSize.width = 1024;
			// spotLight.shadow.mapSize.height = 1024;

			// spotLight.shadow.camera.near = 500;
			// spotLight.shadow.camera.far = 4000;
			// spotLight.shadow.camera.fov = 30;


			spotLight.target = soundShapes[0];

			scene.add( spotLight );
			vilurid[id].lights.push(spotLight);

			
			}



	}

	function distance(x1,y1,x2,y2){

		var a = x1 - x2;
		var b = y1 - y2;

		var c = Math.sqrt( a*a + b*b );
		return c;

	}

	function nextI(i){
		i =i + 1;
		if(i==numberOfStripes){
			i = 0;
		}
		return i;
	}

	function prevI(i){
		i =i - 1;
		if(i==-1){
			i = numberOfStripes-1;
		}
		return i;
	}

	function changeStripes(id,closest_i, r,g,b){

		var left_i = nextI(closest_i);
		var right_i = prevI(closest_i);

		var left2_i = nextI(left_i);
		var right2_i = prevI(right_i);


		vilurid[id].stripes[left2_i].material.color  = new THREE.Color('rgb('+60*r+'%, '+60*g+'%, '+60*b+'%)');
		vilurid[id].stripes[left_i].material.color  = new THREE.Color('rgb('+80*r+'%, '+80*g+'%, '+80*b+'%)');
		vilurid[id].stripes[closest_i].material.color  = new THREE.Color('rgb('+100*r+'%, '+100*g+'%, '+100*b+'%)');
		vilurid[id].stripes[right_i].material.color  = new THREE.Color('rgb('+80*r+'%, '+80*g+'%, '+80*b+'%)');
		vilurid[id].stripes[right2_i].material.color  = new THREE.Color('rgb('+60*r+'%, '+60*g+'%, '+60*b+'%)');


	}

	function changeVilkursOrbit(pos_x, pos_y, color){

		for (var id = 0; id < vilurid.length; id++) {

			if(vilurid[id].tweenStop==false){
				continue;
			}


			var distances = [];
			for (var i = 0; i < vilurid[id].stripes.length; i++) {
				var d = distance(pos_x,pos_y, vilurid[id].stripes[i].position.x,vilurid[id].stripes[i].position.z );
				distances.push(d);		
			}

			//console.log(distances);

			var closest_i = -1;
			var closest_dist = 99999999;

			for (var i = 0; i < distances.length; i++) {
				if(distances[i] < closest_dist){
					closest_dist = distances[i];
					closest_i = i;
				}

			}

			// console.log(closest_i);
			var brightness = 125;

			for (var i = 0; i < vilurid[id].stripes.length; i++) {
				vilurid[id].stripes[i].material.color  = new THREE.Color('rgb('+0+'%, 0%, 0%)');
			}

			var opposite_i = closest_i-(numberOfStripes/2);
			if(opposite_i < 0){
				opposite_i = numberOfStripes + opposite_i;
			}
	
			 changeStripes(id,closest_i,1,1,1);
			 changeStripes(id,opposite_i,1,0,0);
	

			
		}


	} // changeVilkurs

	function vilkurInit(){


		for (var i = 0; i < 20; i++) {
					createVilkur(i);


		setTimeout(function(i){
						console.log("stop")

			vilurid[i].tweenStop = true
			vilurid[i].lights[0].color.setHex( 0xff0000 );
						vilurid[i].lights[0].intensity = 0.2;

			 spaceChangeSoundShape(0,"orbit_speed",1);

		}, Math.random()*25000+550000,i);


				}

				console.log(vilkurPos);


	}



/////////////////////////////////////////////////////////////////////////////////

function resizeCanvasToDisplaySize() {

  const parentdiv = document.getElementById("three_canvas").getBoundingClientRect();
  const canvas = renderer.domElement;
  const width = parentdiv.width;
  const height = parentdiv.height;

  
  if (canvas.width !== width ||canvas.height !== height) {
  	document.querySelector("canvas").style.width = width+"px";
  	document.querySelector("canvas").style.height = height+"px";
    // you must pass false here or three.js sadly fights the browser
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    // set render target sizes here
  }

}

var ellipse, curve;

var fadeColor = [1,1,1];
var viluridOrbit = false;

// FUNCTIONS 		
function init() 
{
	// SCENE
	scene = new THREE.Scene();
	// CAMERA
	var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;

	SCREEN_WIDTH = 1920;
	SCREEN_HEIGHT = 1080;

	console.log(SCREEN_WIDTH);
	var VIEW_ANGLE = 65, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
	camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
	scene.add(camera);
	camera.position.set(200,-370,900);
	camera.updateProjectionMatrix();



	// RENDERER
	renderer = new THREE.WebGLRenderer( {antialias:true} );
	renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
	renderer.setPixelRatio( window.devicePixelRatio );
	container = document.getElementById( 'three_canvas' );
	container.appendChild( renderer.domElement );
	// EVENTS
	//THREEx.WindowResize(renderer, camera);
	// THREEx.FullScreen.bindKey({ charCode : 'm'.charCodeAt(0) });





	// CONTROLS
	controls = new OrbitControls( camera, renderer.domElement );
	controls.enablePan = true;
	// controls.target = new THREE.Vector3(0, 100, 0);

	// STATS
	stats = new Stats();
	stats.dom.style.position = 'absolute';
	stats.dom.style.zIndex = 100;
	stats.dom.style.top = null;
	stats.dom.style.bottom = '0px';

	container.appendChild( stats.dom );
	

	// LIGHT
	// var light = new THREE.PointLight(0xffffff);
	// light.position.set(-200,250,250);
	// scene.add(light);


	var light = new THREE.AmbientLight( 0x666666 ); // soft white light
		scene.add( light );

	// FLOOR
	//2100 1400
	var floorMaterial = new THREE.MeshBasicMaterial( {color:0x666666, side:THREE.DoubleSide} );
	var floorGeometry = new THREE.PlaneGeometry(conf.dimensions.x,conf.dimensions.y, 1, 1);
	var floor = new THREE.Mesh(floorGeometry, floorMaterial);
	floor.position.y = -0.5;
	floor.position.z = 700;
	floor.position.x = 1050;
	floor.rotation.x = Math.PI / 2;
	
	//scene.add(floor);


	controls.target = new THREE.Vector3(floor.position.x ,0,floor.position.z) ;
	controls.target = new THREE.Vector3(0 ,0,0) ;


	// SKYBOX/FOG
	var skyBoxGeometry = new THREE.CubeGeometry( 10000, 10000, 10000 );
	var skyBoxMaterial = new THREE.MeshBasicMaterial( { color: 0x666666, side: THREE.BackSide } );
	var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
	scene.add(skyBox);
	
	////////////
	// CUSTOM //
	////////////
	
	// https://threejs.org/examples/#webgl_geometry_extrude_splines
	/*
	 curve = new THREE.EllipseCurve(
		0,  0,            // ax, aY
		1000, 1000,           // xRadius, yRadius
		0,  2 * Math.PI,  // aStartAngle, aEndAngle
		false,            // aClockwise
		0                 // aRotation
	);

	var points = curve.getPoints( 50 );
	var geometry = new THREE.BufferGeometry().setFromPoints( points );

	var material = new THREE.LineBasicMaterial( { color : 0xff0000 } );

	// Create the final object to add to the scene
	ellipse = new THREE.Line( geometry, material );
	ellipse.rotation.set(degrees_to_radians(90), 0, 0);

	scene.add(ellipse);

*/

	////////////
	// CUSTOM //
	////////////	

	var cubeGeometry = new THREE.CubeGeometry(679,679,679,1,1,1);
	var wireMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe:true } );
	MovingCube = new THREE.Mesh( cubeGeometry, wireMaterial );
	MovingCube.position.set(0, 0, 0);
	//scene.add( MovingCube );
	
	for (var i = 0; i < conf.maxPlayers; i++) {
		createSoundshape(i);
	}
	
	for (var i = 0; i < conf.speakers.length; i++) {
		createSpeaker(i);
	}
	

	vilkurInit();


	loadModel('/data/models/parnu.dae');


           for (var id = 0; id < vilurid.length; id++) {

           	vilurid[id].brightness = {"percent":0};
           	vilurid[id].fadeColor = [1,1,1];
           	vilurid[id].tweenStop = false;

           	vilurid[id].tween =  new TWEEN.Tween(vilurid[id].brightness) // Create a new tween that modifies 'coords'.
		        .to({ "percent": 100 }, getRandomInt(15000)) // Move to (300, 200) in 1 second.
		        .easing(TWEEN.Easing.Exponential.Out) // Use an easing function to make the animation smooth.
		        .repeat(Infinity)
		        .yoyo(true)

		        .onUpdate(() => { // Called after tween.js updates 'coords'.
		            // Move 'box' to the position described by 'coords' with a CSS translation.
		           // console.log(`translate(${coords.x}px, ${coords.y}px)`)
		      

 				

		           for (var id = 0; id < vilurid.length; id++) {

		          
		           		var brightness = Math.round(vilurid[id].brightness.percent);

						if(brightness < 1){
							//vilurid[id].fadeColor = fadeColor;
		           		} 

		           		if(brightness>99 && vilurid[id].fadeColor[1]==0){
		           			//vilurid[id].tweenStop = true;

		           		}

		           		if(vilurid[id].tweenStop==false){

				           	for (var i = 0; i < vilurid[id].stripes.length; i++) {

			           	      vilurid[id].stripes[i].material.color  = new THREE.Color('rgb('+brightness*vilurid[id].fadeColor[0]+'%, '+brightness*vilurid[id].fadeColor[1]+'%, '+brightness*vilurid[id].fadeColor[2]+'%)');
				           	}
			           	}

		           }



		        })
		        .start();


           }



	
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max))+6000;
}

setTimeout(function(){
	fadeColor = [1,0,0];

	for (var id = 0; id < vilurid[id].length; id++) {

		setTimeout(function(id){
			vilurid[id].tweenStop = true
			console.log("stop "+id)
		},Math.random()*1000,id);
		
		console.log(Math.random())

		//vilurid[id].tween.stop();
	}


},5000);



function clearText(){
   document.getElementById('message').innerHTML = '..........';   
}

function appendText(txt){
   document.getElementById('message').innerHTML = txt;   
}

function animate(time){

    requestAnimationFrame(animate);
	renderer.render(scene, camera);
	update();
	TWEEN.update(time);
}


function calculateSoundDistances(sound_id){

	// if(sound_id==0){

	// console.log(soundShapes[sound_id].position);
	// console.log(soundShapes[sound_id].lastPosition);

	// }

	var curPos = [ soundShapes[sound_id].position.x,soundShapes[sound_id].position.y,soundShapes[sound_id].position.z];

	if(soundShapes[sound_id].lastPosition[0] != curPos[0] || soundShapes[sound_id].lastPosition[1] != curPos[1] || soundShapes[sound_id].lastPosition[2] != curPos[2]){

		var boundingBox = new THREE.Box3();
		boundingBox.copy( soundShapes[sound_id].geometry.boundingBox ).applyMatrix4( soundShapes[sound_id].matrixWorld );

		var speakerDistances = [];
		var lightDistances = [];
		var gains = [];

		for (var i = 0; i < speakers.length; i++) {
			var originPoint = speakers[i].position.clone();
			var dist = boundingBox.distanceToPoint(originPoint);
			speakerDistances.push(dist);

			// Calculate gains
			var gain = mapValues(dist,0, 500, 1, 0);
			if(gain < 0){
				gain = 0;
			}
			gains.push(gain);

			// Calculate 3D speaker brighness
			var brightness = mapValues(gain,0, 1, 0, 255, true);
			speakers[i].material.color  = new THREE.Color('rgb('+brightness+'%, '+brightness+'%, '+brightness+'%)');

		}


		// TODO: calculate light distances
		soundShapes[sound_id].gains = gains;
		soundShapes[sound_id].speakerDistances = speakerDistances;
		soundShapes[sound_id].lastPosition = curPos;
		soundShapes[sound_id].positionChanged = 1;



	} 

}



function update(){

	var delta = clock.getDelta(); // seconds.


	// Animate sound orbits
	for (var id = 0; id < soundOrbits.length; id++) {
		if(soundOrbits[id].changed){
			calculateNewOrbitCurve(id)
		}

		var t = soundOrbits[id].lastPosAt + 0.01 * soundOrbits[id].speed * delta;
		if(t < 0){
			t = 1; // - Math.abs(t);
		} else if(t > 1){
			t = 0;
		}
		
		soundOrbits[id].lastPosAt = t;

		var pos = soundOrbits[id].alteredCurve.getPointAt(t);
		soundShapes[id].position.x = pos.x;
		soundShapes[id].position.z = pos.z;
		soundShapes[id].position.y = pos.y;

					changeVilkursOrbit(pos.x, pos.z, id);




	} // for

	// resizeCanvasToDisplaySize();

	for (var i = 0; i < soundShapes.length; i++) {
		calculateSoundDistances(i);
	}

	/*
	var originPoint = MovingCube.position.clone();

	var text = "";

	 scene.traverse(function(shape) {

	    if (shape.shapeType === "sound") {
	    	
		    box.copy( shape.geometry.boundingBox ).applyMatrix4( shape.matrixWorld );
		    text += "shape" + shape.name + " : " + box.distanceToPoint(originPoint) + " / ";

		    var power = box.distanceToPoint(originPoint);
		    if(shape.name=="0"){
			    changeLed(shape.name,power/7);
		    }


	    }
	  });

	 // console.log(text);

	appendText(text);

	*/

	controls.update();
	stats.update();
}


function calculateNewOrbitCurve(id){


		// Get original curve points
		var points = soundOrbits[id].line.geometry.getAttribute("position").array;
		var curvePoints = [];
		for (var i = 0; i < points.length; i = i+3) {
			curvePoints.push(new THREE.Vector3( points[i],points[i+1], points[i+2] ));
		}

		// Apply scale, positition, rotation
		for (var i = 0; i < curvePoints.length; i++) {
			curvePoints[i].applyMatrix4(soundOrbits[id].line.matrix);
		}

		// Create altered curve and calculate shape position
		soundOrbits[id].alteredCurve = new THREE.CatmullRomCurve3(curvePoints);
		// var curve = new THREE.CatmullRomCurve3(curvePoints);

		soundOrbits[id].changed = false;


}

function spaceChangeSoundShape(i,param,value){

	if(param=="position_x"){
    	// soundShapes[i].position.x = mapValues(value,0,1,0,conf.dimensions.x);
    	soundOrbits[i].line.position.x =  mapValues(value,0,1,-1000,conf.dimensions.x);
    	soundOrbits[i].changed = true;

	} else if(param=="position_y"){
    	// soundShapes[i].position.z = mapValues(value,0,1,0,conf.dimensions.y);
    	soundOrbits[i].line.position.z =  mapValues(value,0,1,-1000,conf.dimensions.y);
    	soundOrbits[i].changed = true;

	} else if(param=="position_z"){
    	// soundShapes[i].position.y = mapValues(value,0,1,0,conf.dimensions.z);
    	soundOrbits[i].line.position.y =  mapValues(value,0,1,0,conf.dimensions.z);
    	soundOrbits[i].changed = true;

	} else if(param=="scale_x"){
    	soundShapes[i].scale.x = mapValues(value,0,1,0.0001,5, false,4);

	} else if(param=="scale_y"){
    	soundShapes[i].scale.z = mapValues(value,0,1,0.0001,5, false,4);

	} else if(param=="scale_z"){
    	soundShapes[i].scale.y = mapValues(value,0,1,0.0001,5, false,4);

	} else if(param=="orbit_x"){
		soundOrbits[i].line.scale.x = mapValues(value,0,1,0.0001,5, false,4);
		soundOrbits[i].changed = true;
    	// soundOrbits[i].line.scale.x = mapValues(value,0,1,0,5);

	} else if(param=="orbit_y"){
		soundOrbits[i].line.scale.y = mapValues(value,0,1,0.0001,5, false,4);
		soundOrbits[i].changed = true;

	} else if(param=="orbit_z"){
		soundOrbits[i].line.rotation.x = mapValues(value,0,1,0,degrees_to_radians(360),false,5);
		soundOrbits[i].changed = true;
	} else if(param=="orbit_speed"){
		// soundOrbits[i].looptime = mapValues(value,0,1,-20 * 1000,20 * 1000);
		soundOrbits[i].speed = mapValues(value,0,1,-90,90);


	}




}

window.spaceChangeSoundShape = spaceChangeSoundShape;

setInterval(function(){


	for (var i = 0; i < soundShapes.length; i++) {

		if(soundShapes[i].positionChanged==1){

			soundShapes[i].positionChanged = 0;

			soundSendSpeakers(i,soundShapes[i].gains);

			// console.log("Speaker distances for sound " + i);
			// console.log(soundShapes[i].speakerDistances);
			/*
			var text = "";
			text += "Speaker distances for sound " + i +": ";
			text += soundShapes[i].speakerDistances;
			text += " / ";
			text += soundShapes[i].lastPosition[1]; 
			text += " / ";
			text += soundShapes[i].lastPosition[0]; 
			appendText(text);
			*/

		} // if positionChanged
			

		}



},300);


init();
animate();







