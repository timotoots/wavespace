
// MAIN
var koll;

// standard global variables
var container, scene, camera, renderer, controls, stats;
var keyboard = new THREEx.KeyboardState();
var clock = new THREE.Clock();
// custom global variables

var MovingCube;
var collidableMeshList = [];

var arrowList = [];
var directionList = [];

var box = new THREE.Box3();
var wall;

var soundShapes = [];
var speakers = [];

init();
animate();

function createSoundshape(id){

	var wallGeometry = new THREE.BoxBufferGeometry( 200, 200, 200 );
	var wallMaterial = new THREE.MeshBasicMaterial( {color: 0x8888ff} );



	soundShapes[id] = new THREE.Mesh(wallGeometry, wallMaterial);
	soundShapes[id].position.set(100+id*100, 50, -100+id*100);
	soundShapes[id].shapeType = "sound";
	soundShapes[id].name = id;
	soundShapes[id].lastPosition = [0,0,0]//{"x":0,"y":0,"z":0};
	soundShapes[id].positionChanged = 0;



	soundShapes[id].material.color =  new THREE.Color("rgb("+conf.players[id].r+", "+conf.players[id].g+", "+conf.players[id].b+")");
		

	soundShapes[id].geometry.computeBoundingBox();
	scene.add(soundShapes[id]);

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

  const parentdiv = document.getElementById("3dcanvas").getBoundingClientRect();
  const canvas = renderer.domElement;
  const width = parentdiv.width;
  const height = parentdiv.height;

  
  if (canvas.width !== width ||canvas.height !== height) {
  	document.querySelector("canvas").style.width = width+"px";
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
	container = document.getElementById( '3dcanvas' );
	container.appendChild( renderer.domElement );
	// EVENTS
	THREEx.WindowResize(renderer, camera);
	THREEx.FullScreen.bindKey({ charCode : 'm'.charCodeAt(0) });





	// CONTROLS
	controls = new THREE.OrbitControls( camera, renderer.domElement );
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


	var time = Date.now();
	var looptime = 20 * 1000;
	var t = ( time % looptime ) / looptime;

	var pos = curve.getPointAt( t );
	MovingCube.position.x = pos.x;
	MovingCube.position.y = 0;
	MovingCube.position.z = pos.y;

	soundShapes[1].position.x = pos.x;
	soundShapes[1].position.y = 0;
	soundShapes[1].position.z = pos.y;


	resizeCanvasToDisplaySize();

	var delta = clock.getDelta(); // seconds.
	var moveDistance = 200 * delta; // 200 pixels per second
	var rotateAngle = Math.PI / 2 * delta;   // pi/2 radians (90 degrees) per second
	
	if ( keyboard.pressed("A") )
		MovingCube.rotation.y += rotateAngle;
	if ( keyboard.pressed("D") )
		MovingCube.rotation.y -= rotateAngle;
			
	if ( keyboard.pressed("left") )
		MovingCube.position.x -= moveDistance;
	if ( keyboard.pressed("right") )
		MovingCube.position.x += moveDistance;
	if ( keyboard.pressed("up") )
		MovingCube.position.z -= moveDistance;
	if ( keyboard.pressed("down") )
		MovingCube.position.z += moveDistance;




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

setInterval(function(){

	

	for (var i = 0; i < soundShapes.length; i++) {

		if(soundShapes[i].positionChanged==1){

			soundShapes[i].positionChanged = 0;

			soundSendSpeakers(i,soundShapes[i].gains);

			// console.log("Speaker distances for sound " + i);
			// console.log(soundShapes[i].speakerDistances);
			var text = "";
			text += "Speaker distances for sound " + i +": ";
			text += soundShapes[i].speakerDistances;
			text += " / ";
			text += soundShapes[i].lastPosition[1]; 
			text += " / ";
			text += soundShapes[i].lastPosition[0]; 
			appendText(text);

		} // if positionChanged
			

		}



},300);

