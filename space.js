
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

 var speakersInSpace = [
  [0,12,20],
  [1,125,53],
  [2,196,12],
  [6,89,88],
  [7,30,105],
  [5,187,105]
  ];

init();
animate();

function createSoundshape(id){

	var wallGeometry = new THREE.BoxBufferGeometry( 200, 200, 200 );
	var wallMaterial = new THREE.MeshBasicMaterial( {color: 0x8888ff} );

	var shape = new THREE.Mesh(wallGeometry, wallMaterial);
	shape.position.set(100+id*100, 50, -100+id*100);
	shape.shapeType = "sound";
	shape.name = id;
	shape.geometry.computeBoundingBox();
	scene.add(shape);

}


	console.log(speakersInSpace);

function createSpeaker(id){

	var cubeGeometry = new THREE.BoxBufferGeometry( 10, 120, 60 );
	var wireMaterial = new THREE.MeshBasicMaterial( { color: 0x424141, wireframe:true } );
	var speaker = new THREE.Mesh( cubeGeometry, wireMaterial );
	speaker.position.set(speakersInSpace[id][1]*10,100,speakersInSpace[id][2]*10);
	speaker.shapeType = "speaker";
	speaker.name = id;
	scene.add( speaker );	
	

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

// FUNCTIONS 		
function init() 
{
	// SCENE
	scene = new THREE.Scene();
	// CAMERA
	var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
	console.log(SCREEN_WIDTH);
	var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
	camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
	scene.add(camera);
	camera.position.set(0,150,400);
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
	var floorMaterial = new THREE.MeshBasicMaterial( {color:0x666666, side:THREE.DoubleSide} );
	var floorGeometry = new THREE.PlaneGeometry(2100, 1400, 1, 1);
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

	var cubeGeometry = new THREE.CubeGeometry(50,50,50,1,1,1);
	var wireMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe:true } );
	MovingCube = new THREE.Mesh( cubeGeometry, wireMaterial );
	MovingCube.position.set(0, 25.1, 0);
	scene.add( MovingCube );
	
	
	createSoundshape(0);
	createSoundshape(1);

	for (var i = 0; i < speakersInSpace.length; i++) {
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

function update()
{

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

	var originPoint = MovingCube.position.clone();

	var text = "";

	 scene.traverse(function(shape) {

	    if (shape.shapeType === "sound") {
	    	
		    //	box.copy( shape.geometry.boundingBox ).applyMatrix4( shape.matrixWorld );
		    //	text += "shape" + shape.name + " : " + box.distanceToPoint(originPoint) + " / ";

	    }
	  });

	 // console.log(text);

	appendText(text);

	

	controls.update();
	stats.update();
}

function render() 
{
	renderer.render( scene, camera );
}


