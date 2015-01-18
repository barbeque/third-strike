var canvas = document.querySelector("#renderCanvas");
var engine = new BABYLON.Engine(canvas, true);

function initScene() {
  var scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color3(0.7, 0.7, 0.7);

  var buggyBody = BABYLON.Mesh.CreateBox('body', 1, scene);

  var wheelPositions = [
    new BABYLON.Vector3(1, -1, 1), // rear left
    new BABYLON.Vector3(1, -1, -1), // rear right
    new BABYLON.Vector3(-1, -1, -1), // front right
    new BABYLON.Vector3(-1, -1, 1), // front left?
  ];

  buggyBody.position = new BABYLON.Vector3(0, 5, 0);

  var wheelMaterial = new BABYLON.StandardMaterial('black', scene);
  wheelMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);

  for(var i = 0; i < wheelPositions.length; ++i) {
    var wheel = BABYLON.Mesh.CreateCylinder('wheel' + i, 0.5, 1, 1, 12, 1, scene, false);
    wheel.parent = buggyBody;
    wheel.position = wheelPositions[i];
    wheel.rotation.z = Math.PI / 2;
    wheel.material = wheelMaterial;
  }

  var camera = new BABYLON.FollowCamera("ChaseCam", new BABYLON.Vector3(0, 14, -45), scene);
  camera.target = buggyBody;
  camera.attachControl(canvas);

  var ground = BABYLON.Mesh.CreateGround('dirtGround', 100, 100, 0, scene); // TODO: increase subdivs for terrain or use CreateGroundFromHeightMap

  var dirtMaterial = new BABYLON.StandardMaterial('dirt', scene);
  dirtMaterial.diffuseColor = new BABYLON.Color3(0.86, 0.718, 0.52);

  ground.material = dirtMaterial;

  var light = new BABYLON.PointLight('light', new BABYLON.Vector3(0, 5, -5), scene);

  var directionalLight = new BABYLON.DirectionalLight('dirlight', new BABYLON.Vector3(-1, -2, -1), scene);
  directionalLight.position = new BABYLON.Vector3(20, 10, 20);

  var shadowGenerator = new BABYLON.ShadowGenerator(1024, directionalLight);
  shadowGenerator.getShadowMap().renderList.push(buggyBody);
  ground.receiveShadows = true;

  return scene;
}

var scene = initScene();

engine.runRenderLoop(function() {
  scene.render();
});
