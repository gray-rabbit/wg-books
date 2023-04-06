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
	import PocketBase from 'pocketbase';

	const pb = new PocketBase('http://127.0.0.1:8090');

	let canvas: HTMLCanvasElement;
	let scene: Scene;
	let camera: FollowCamera;
	let target: Mesh | undefined;
	let temp: Mesh;
	let spheres: Mesh[] = [];
	let planes: Mesh[] = [];
	let intervalId = -1;
	onMount(async () => {
		canvas.style.width = window.innerWidth + 'px';
		canvas.style.height = window.innerHeight + 'px';
		const engine = new Engine(canvas, true);
		scene = new Scene(engine);

		camera = new FollowCamera('camera1', new Vector3(0, 3, -1), scene);

		// camera.setTarget(Vector3.Zero());
		camera.radius = 30;

		// The goal height of camera above local origin (centre) of target
		// camera.heightOffset = 10;

		// The goal rotation of camera around local origin (centre) of target in x y plane
		camera.rotationOffset = 180;
		camera.fov = 0.4;
		//Acceleration of camera in moving from current to goal position
		camera.cameraAcceleration = 0.005;
		// camera.attachControl(canvas, true);
		//The speed at which acceleration is halted
		camera.maxCameraSpeed = 10;
		const light = new DirectionalLight('light', new Vector3(-10, -10, 10), scene);
		temp = MeshBuilder.CreateBox('box1', { height: 1, width: 1, depth: 1 }, scene);
		temp.visibility = 0;

		// const plane = MeshBuilder.CreatePlane('plane', { width: 16, height: 9 }, scene);
		// plane.position.x -= 16;
		// const mat = new StandardMaterial('mat', scene);
		// plane.material = new StandardMaterial('mat', scene);
		// mat.diffuseTexture = new Texture('img.png', scene);
		// plane.material = mat;
		camera.lockedTarget = temp;

		engine.runRenderLoop(() => {
			if (target) {
				temp.position.x += (target.position.x - temp.position.x) * 0.01;
				temp.position.y += (target.position.y - temp.position.y) * 0.01;
				temp.position.z += (target.position.z + 1 - temp.position.z) * 0.01;
			}
			scene.render();
		});

		window.addEventListener('resize', () => {
			canvas.style.width = window.innerWidth + 'px';
			canvas.style.height = window.innerHeight + 'px';
			engine.resize();
		});

		await pb.collection('photo').subscribe('*', function (e) {
			console.log(e.record);

			createPlane(e.record.id + '/' + e.record.field);
		});

		await pb
			.collection('photo')
			.getFullList()
			.then((res) => {
				for (let i of res) {
					console.log(i.id + '/' + i.field);
					createPlane(i.id + '/' + i.field);
				}
			});
	});
	function setIntervalPhoto() {
		intervalId = setInterval(() => {
			const len = planes.length;
			if (len === 0) return;
			const idx = Math.floor(Math.random() * len);
			target = planes[idx];
		}, 10000);
	}
	function clearIntervalPhoto() {
		clearInterval(intervalId);
	}
	function createPlane(url: string) {
		if (intervalId !== -1) clearIntervalPhoto();
		//이건 plane을 만든다.
		const idx = planes.length;
		const plane = MeshBuilder.CreatePlane('plane', { width: 16, height: 9 }, scene);
		const x = idx % 20;
		const y = Math.floor(idx / 20);
		plane.position.x = x * 17;
		plane.position.y = y * 10;
		console.log(x, y);
		const mat = new StandardMaterial('mat', scene);
		plane.material = new StandardMaterial('mat', scene);
		mat.diffuseTexture = new Texture(`http://127.0.0.1:8090/api/files/photo/${url}`, scene);
		plane.material = mat;
		planes.push(plane);
		target = plane;
		setIntervalPhoto();
	}

	function clickHandler() {
		target = spheres[1];
	}
</script>

<canvas bind:this={canvas} />

<button on:click={clickHandler}>Click me</button>
