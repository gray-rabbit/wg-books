<script lang="ts">
	import {
		Scene,
		Engine,
		FreeCamera,
		Vector3,
		MeshBuilder,
		HemisphericLight,
		Color3,
		StandardMaterial,
		Texture,
		FollowCamera,
		Mesh,
		PointLight,
		SpotLight,
		DirectionalLight
	} from 'babylonjs';
	import { onMount } from 'svelte';

	let canvas: HTMLCanvasElement;
	let scene: Scene;
	let camera: FollowCamera;
	let target: Mesh | undefined;
	let temp: Mesh;
	let spheres: Mesh[] = [];
	onMount(async () => {
		canvas.style.width = window.innerWidth + 'px';
		canvas.style.height = window.innerHeight + 'px';
		const engine = new Engine(canvas, true);
		scene = new Scene(engine);

		camera = new FollowCamera('camera1', new Vector3(0, 5, -10), scene);

		// camera.setTarget(Vector3.Zero());
		camera.radius = 30;

		// The goal height of camera above local origin (centre) of target
		camera.heightOffset = 10;

		// The goal rotation of camera around local origin (centre) of target in x y plane
		camera.rotationOffset = 180;

		//Acceleration of camera in moving from current to goal position
		camera.cameraAcceleration = 0.005;

		//The speed at which acceleration is halted
		camera.maxCameraSpeed = 10;
		const plane = MeshBuilder.CreatePlane('plane', { width: 16, height: 9 }, scene);

		const light = new DirectionalLight('light', new Vector3(-10, -10, 10), scene);
		temp = MeshBuilder.CreateBox('box1', { height: 1, width: 1, depth: 1 }, scene);
		temp.visibility = 0;
		const sphere = MeshBuilder.CreateSphere('sphere1', { diameter: 2, segments: 32 }, scene);
		sphere.position.y = 1;
		const sphere2 = MeshBuilder.CreateSphere('sphere', { diameter: 2, segments: 32 }, scene);
		sphere2.position.y = 10;
		spheres.push(sphere);
		spheres.push(sphere2);
		const mat = new StandardMaterial('mat', scene);
		plane.material = new StandardMaterial('mat', scene);
		mat.diffuseTexture = new Texture('img.png', scene);
		plane.material = mat;
		camera.lockedTarget = temp;

		engine.runRenderLoop(() => {
			if (target) {
				temp.position.x += (target.position.x - temp.position.x) * 0.01;
				temp.position.y += (target.position.y - temp.position.y) * 0.01;
			}
			scene.render();
		});

		window.addEventListener('resize', () => {
			engine.resize();
		});
	});
	function clickHandler() {
		target = spheres[1];
	}
</script>

<canvas bind:this={canvas} />

<button on:click={clickHandler}>Click me</button>
