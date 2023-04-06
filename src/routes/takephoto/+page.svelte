<script lang="ts">
	import { onMount } from 'svelte';
	import PocketBase from 'pocketbase';

	let video: HTMLVideoElement | undefined;
	let canvas: HTMLCanvasElement;
	let taking = false;
	const pb = new PocketBase('http://127.0.0.1:8090');

	onMount(async () => {
		const stream = await navigator.mediaDevices.getUserMedia({ video: true });
		video = document.querySelector('video') ?? undefined;
		if (video) video.srcObject = stream;
	});

	async function takePhoto() {
		if (taking) return;

		taking = true;
		const context = canvas.getContext('2d');
		if (context) {
			context.fillStyle = '#AAA';
			context.fillRect(0, 0, 640, 480);
		}
		setTimeout(async () => {
			const context = canvas.getContext('2d');
			if (context && video) {
				context.drawImage(video, 0, 0, 640, 480);
				taking = false;
				const data = canvas.toDataURL('image/png');
				canvas.toBlob(async (blob) => {
					console.log(blob);
					const formData = new FormData();
					if (blob) {
						formData.append('name', '박성준');
						formData.append('grade', '5');
						formData.append('classNum', '5');
						formData.append('field', blob);
						const result = await pb.collection('photo').create(formData);
						console.log(result);
						// console.log(formData.get('file'));
					}
					return blob;
				});
			}
		}, 1000);
	}
</script>

<video autoplay />
<button class="btn btn-primary" on:click={takePhoto}>Take photo</button>
<canvas id="canvas" width="640" height="480" bind:this={canvas} />
