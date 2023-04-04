<script lang="ts">
	import { onMount } from 'svelte';
	let video: HTMLVideoElement | undefined;
	let canvas: HTMLCanvasElement;
	let taking = false;
	onMount(async () => {
		const stream = await navigator.mediaDevices.getUserMedia({ video: true });
		video = document.querySelector('video') ?? undefined;
		if (video) video.srcObject = stream;
	});

	function takePhoto() {
		if (taking) return;

		taking = true;
		const context = canvas.getContext('2d');
		if (context) {
			context.fillStyle = '#AAA';
			context.fillRect(0, 0, 640, 480);
		}
		setTimeout(() => {
			const context = canvas.getContext('2d');
			if (context && video) {
				context.drawImage(video, 0, 0, 640, 480);
				taking = false;
				const data = canvas.toDataURL('image/png');
				canvas.toBlob((blob) => {
					console.log(blob);
					const formData = new FormData();
					if (blob) {
						formData.append('file', blob, '어쩌구저쩌구.png');
						console.log(formData.get('file'));
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
