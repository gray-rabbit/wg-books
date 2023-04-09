<script lang="ts">
	import { onMount } from 'svelte';

	let canvas: HTMLCanvasElement;
	let video: HTMLVideoElement;
	onMount(async () => {
		const stream = await navigator.mediaDevices.getUserMedia({
			video: {
				width: 1280,
				height: 720,
				facingMode: 'user'
			}
		});

		if (video) video.srcObject = stream;
		const context = canvas.getContext('2d');
		let image = new Image();
		image.src = 'hdframe.png';
		function step() {
			if (context == undefined) {
				return;
			}
			context.drawImage(video, 0, 0, 1280, 720);
			context.drawImage(image, 0, 0, 1280, 730);
			context.fillStyle = 'rbga(0,0,0,1)';
			context.font = '48px cookie';
			context.fillText('박성준', 1100, 690);
			context.fillText('5학년 3반', 50, 690);
			requestAnimationFrame(step);
		}
		requestAnimationFrame(step);
	});
</script>

<video bind:this={video} autoplay playsinline width="1280" height="720" class="hidden" />
<canvas bind:this={canvas} width="1280" height="720" style="" />

<style>
	@font-face {
		font-family: 'cookie';
		src: url('fonts/CookieRun-Bold.ttf');
	}
	button {
		font-family: 'cookie';
	}
</style>
