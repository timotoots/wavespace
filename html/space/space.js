

import * as THREE from '../../node_modules/three/build/three.module.js';


import { OrbitControls } from '../../node_modules/three/examples/jsm/controls/OrbitControls.js';


import Stats 		 from '../../node_modules/three/examples/jsm/libs/stats.module.js';

import { ColladaLoader } from '../../node_modules/three/examples/jsm/loaders/ColladaLoader.js';

import { RectAreaLightUniformsLib } from '../../node_modules/three/examples/jsm/lights/RectAreaLightUniformsLib.js';

import { EffectComposer } from '../../node_modules/three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from '../../node_modules/three/examples/jsm/postprocessing/RenderPass.js';


import { TWEEN } from "../../node_modules/three/examples/jsm/libs/tween.module.min.js";


// MAIN
var koll;

// standard global variables
var container, scene, camera, renderer, controls, stats;
// var keyboard = new THREEx.KeyboardState();
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

init();
animate();

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

// FUNCTIONS 		
function init() 
{
	// SCENE
	scene = new THREE.Scene();
	// CAMERA
	var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
	console.log(SCREEN_WIDTH);
	var VIEW_ANGLE = 75, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
	camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
	scene.add(camera);
	camera.position.set(0,1500,100);
	camera.rotation.set(-0.673455,-0.537573,-0.387867) 
	camera.updateProjectionMatrix();



	// RENDERER
	renderer = new THREE.WebGLRenderer( {antialias:true} );
	renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
	renderer.setPixelRatio( window.devicePixelRatio );
	container = document.getElementById( 'three_canvas' );
	container.appendChild( renderer.domElement );
	// EVENTS
	// THREEx.WindowResize(renderer, camera);
	// THREEx.FullScreen.bindKey({ charCode : 'm'.charCodeAt(0) });





	// CONTROLS
	controls = new OrbitControls( camera, renderer.domElement );
	controls.enablePan = false;

	// STATS
	stats = new Stats();
	stats.dom.style.position = 'absolute';
	stats.dom.style.zIndex = 100;
	stats.dom.style.top = null;
	stats.dom.style.bottom = '0px';

	container.appendChild( stats.dom );
	// LIGHT
	var light = new THREE.PointLight(0xffffff);
	light.position.set(0,250,0);
	scene.add(light);

	// FLOOR
	//2100 1400
	var floorMaterial = new THREE.MeshBasicMaterial( {color:0x666666, side:THREE.DoubleSide} );
	var floorGeometry = new THREE.PlaneGeometry(conf.dimensions.x,conf.dimensions.y, 1, 1);
	var floor = new THREE.Mesh(floorGeometry, floorMaterial);
	floor.position.y = -0.5;
	floor.position.z = 700;
	floor.position.x = 1050;
	floor.rotation.x = Math.PI / 2;
	scene.add(floor);


	controls.target = new THREE.Vector3(floor.position.x ,0,floor.position.z) ;


	// SKYBOX/FOG
	var skyBoxGeometry = new THREE.CubeGeometry( 10000, 10000, 10000 );
	var skyBoxMaterial = new THREE.MeshBasicMaterial( { color: 0x9999ff, side: THREE.BackSide } );
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

	var cubeGeometry = new THREE.CubeGeometry(50,50,50,1,1,1);
	var wireMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe:true } );
	MovingCube = new THREE.Mesh( cubeGeometry, wireMaterial );
	MovingCube.position.set(0, 25.1, 0);
	scene.add( MovingCube );
	
	for (var i = 0; i < conf.maxPlayers; i++) {
		createSoundshape(i);
	}
	
	for (var i = 0; i < conf.speakers.length; i++) {
		createSpeaker(i);
	}
	

	

	
}

function clearText()
{   document.getElementById('message').innerHTML = '..........';   }

function appendText(txt)
{   document.getElementById('message').innerHTML = txt;   }

function animate() 
{
    requestAnimationFrame( animate );
	render();		
	update();
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


	

/*
		// consol	e.log(soundOrbits[i].line);
		// ifiewo();
	// apply scale, position

	 // line.position.x = soundOrbits[i].position.x;
	 // line.position.y = soundOrbits[i].position.y;
	 // line.position.z = soundOrbits[i].position.z;

	 // line.scale.x = soundOrbits[i].scale.x;
	 // line.scale.y = soundOrbits[i].scale.y;
	 // line.scale.z = soundOrbits[i].scale.z;

	// create morphedCurve from points
	// line.applyMatrix3( line.matrixWorld );
	
	//line.copy( soundOrbits[i].line ).applyMatrix4( shape.matrixWorld );

	// soundOrbits[i].visibleLine = line.clone();
	//soundOrbits[i].visibleLine.geometry.dispose();
	//soundOrbits[i].visibleLine.geometry = line.geometry.clone();

	//soundOrbits[i].visibleLine.position

	// draw line


	var points = soundOrbits[id].curve.getPoints( 50 );
	var geometry = new THREE.BufferGeometry().setFromPoints( points );
	var material = new THREE.LineBasicMaterial( { color : 0xff0000 } );
	material.color = soundShapes[id].material.color;

	soundOrbits[id].line = new THREE.Line( geometry, material );
	soundOrbits[id].line.rotation.set(degrees_to_radians(90), 0, 0);

	scene.add(soundOrbits[id].line);



		var pos = soundOrbits[i].curve.getPointAt(t);
		soundShapes[i].position.x = pos.x;
		soundShapes[i].position.y = 0;
		soundShapes[i].position.z = pos.y;
*/

		/*
		// Draw curve to line
		var points = soundOrbits[id].curve.getPoints( 50 );
		var geometry = new THREE.BufferGeometry().setFromPoints( points );
		var material = new THREE.LineBasicMaterial( { color : 0xff0000 } );
		material.color = soundShapes[id].material.color;

		soundOrbits[id].line = new THREE.Line( geometry, material );
		soundOrbits[id].line.rotation.set(degrees_to_radians(90), 0, 0);
		*/

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
			
			soundOrbits[id].lastPosAt = t

			var pos = soundOrbits[id].alteredCurve.getPointAt(t);
			soundShapes[id].position.x = pos.x;
			soundShapes[id].position.z = pos.z;
			soundShapes[id].position.y = pos.y;

		}



		


	
	// MovingCube.position.x = pos.x;
	// MovingCube.position.y = 0;
	// MovingCube.position.z = pos.y;

	// soundShapes[1].position.x = pos.x;
	// soundShapes[1].position.y = 0;
	// soundShapes[1].position.z = pos.y;


	resizeCanvasToDisplaySize();

	var moveDistance = 200 * delta; // 200 pixels per second
	var rotateAngle = Math.PI / 2 * delta;   // pi/2 radians (90 degrees) per second
	
	// if ( keyboard.pressed("A") )
	// 	MovingCube.rotation.y += rotateAngle;
	// if ( keyboard.pressed("D") )
	// 	MovingCube.rotation.y -= rotateAngle;
			
	// if ( keyboard.pressed("left") )
	// 	MovingCube.position.x -= moveDistance;
	// if ( keyboard.pressed("right") )
	// 	MovingCube.position.x += moveDistance;
	// if ( keyboard.pressed("up") )
	// 	MovingCube.position.z -= moveDistance;
	// if ( keyboard.pressed("down") )
	// 	MovingCube.position.z += moveDistance;




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

function render() 
{
	renderer.render( scene, camera );
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

function parseMqtt(topic, message){


  topic = topic.split("/");

  

  if(topic[2]>0 && topic[2]<5 &&  topic[3]){


  	console.log(topic[2]+""+topic[3] + message);
  		spaceChangeSoundShape(topic[2],topic[3],message);


  }

  console.log(topic);

  }

function spaceChangeSoundShape(i,param,value){

	if(param=="POS_X"){
    	// soundShapes[i].position.x = mapValues(value,0,1,0,conf.dimensions.x);
    	soundOrbits[i].line.position.x =  mapValues(value,0,255,0,conf.dimensions.x);
    	soundOrbits[i].changed = true;

	} else if(param=="POS_Y"){
    	// soundShapes[i].position.z = mapValues(value,0,1,0,conf.dimensions.y);
    	soundOrbits[i].line.position.z =  mapValues(value,0,255,0,conf.dimensions.y);
    	soundOrbits[i].changed = true;

	} else if(param=="POS_Z"){
    	// soundShapes[i].position.y = mapValues(value,0,1,0,conf.dimensions.z);
    	soundOrbits[i].line.position.y =  mapValues(value,0,255,0,conf.dimensions.z);
    	soundOrbits[i].changed = true;

	} else if(param=="SHAPE_WIDTH"){
    	soundShapes[i].scale.x = mapValues(value,0,255,0.0001,5, false,4);

	} else if(param=="SHAPE_LENGTH"){
    	soundShapes[i].scale.z = mapValues(value,0,255,0.0001,5, false,4);

	} else if(param=="SHAPE_HEIGHT"){
    	soundShapes[i].scale.y = mapValues(value,0,255,0.0001,5, false,4);

	} else if(param=="SHAPE_BLUR"){
    	console.log("no shape blur yet!");

	} else if(param=="ORBIT_WIDTH"){
		soundOrbits[i].line.scale.x = mapValues(value,0,255,0.0001,5, false,4);
		soundOrbits[i].changed = true;
    	// soundOrbits[i].line.scale.x = mapValues(value,0,1,0,5);

	} else if(param=="ORBIT_LENGTH"){
		soundOrbits[i].line.scale.y = mapValues(value,0,255,0.0001,5, false,4);
		soundOrbits[i].changed = true;

	} else if(param=="ORBIT_ROTATE"){
		soundOrbits[i].line.rotation.x = mapValues(value,0,255,0,degrees_to_radians(360),false,5);
		soundOrbits[i].changed = true;
	} else if(param=="ORBIT_SPEED"){
		// soundOrbits[i].looptime = mapValues(value,0,1,-20 * 1000,20 * 1000);
		soundOrbits[i].speed = mapValues(value,0,255,-20,20);


	}




}

window.spaceChangeSoundShape = spaceChangeSoundShape;
window.parseMqtt = parseMqtt;


function soundSendSpeakers(i,gains){




  // if(typeof players[i] != "undefined"){


  //   players[i].multislider.setAllSliders(gains);

  //   gains.unshift(i+1);

  //   socket.emit('message',);

  // }


}
setInterval(function(){

	

	for (var i = 0; i < soundShapes.length; i++) {

		if(soundShapes[i].positionChanged==1){

			soundShapes[i].positionChanged = 0;

			// soundSendSpeakers(i,soundShapes[i].gains);

			sendMqtt("/speaker_gains/"+i,  soundShapes[i].gains.join(" "));


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

