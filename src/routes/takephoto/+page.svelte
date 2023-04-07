<script lang="ts">
	import { onMount } from 'svelte';
	import PocketBase from 'pocketbase';
	import stData from './info.json';
	let video: HTMLVideoElement | undefined;
	let canvas: HTMLCanvasElement;
	let taking = false;
	let visible = false;
	const pb = new PocketBase('http://127.0.0.1:8090');
	let classNum = 0;
	let grade = 0;
	let name = '';
	onMount(async () => {
		const stream = await navigator.mediaDevices.getUserMedia({
			video: {
				width: 1280,
				height: 720,
				facingMode: 'user'
			}
		});
		video = document.querySelector('video') ?? undefined;
		if (video) video.srcObject = stream;
	});

	async function takePhoto() {
		if (taking) return;
		visible = true;
		const stream = await navigator.mediaDevices.getUserMedia({
			video: {
				width: 1280,
				height: 720,
				facingMode: 'user'
			}
		});
		video = document.querySelector('video') ?? undefined;
		if (video) video.srcObject = stream;

		taking = true;
		const context = canvas.getContext('2d');
		if (context) {
			context.fillStyle = '#AAA';
			context.fillRect(0, 0, 640, 480);
		}
		setTimeout(async () => {
			const context = canvas.getContext('2d');
			if (context && video) {
				context.drawImage(video, 0, 0, 1280, 720);
				taking = false;
				const data = canvas.toDataURL('image/png');
				canvas.toBlob(async (blob) => {
					console.log(blob);
					const formData = new FormData();
					if (blob) {
						formData.append('name', name);
						formData.append('grade', grade.toString());
						formData.append('classNum', classNum.toString());
						formData.append('field', blob);
						const result = await pb.collection('photo').create(formData);
						console.log(result);
						// console.log(formData.get('file'));
					}
					visible = false;
					name = '';
					grade = 0;
					classNum = 0;
					return blob;
				});
			}
		}, 3000);
	}
</script>

<div class="flex h-screen justify-center items-center flex-col">
	<!-- svelte-ignore a11y-media-has-caption -->
	{#if visible}
		<video autoplay />
	{:else}
		<div class="flex">
			<div class="m-2 rounded-2xl border p-5 border-black">
				<p class="text-3xl text-center font-[cookie]">학년</p>
				<div class="btn-group gap-2">
					{#each [1, 2, 3, 4, 5, 6] as i}
						<button
							class:btn-accent={i === grade}
							class="btn btn-primary btn-lg"
							on:click={() => ((grade = i), (classNum = 0))}>{i}</button
						>
					{/each}
				</div>
			</div>
			<div class="m-2 rounded-2xl border p-5 border-black">
				<p class="text-3xl text-center font-[cookie]">반</p>
				<div class="btn-group gap-2 text-center">
					{#each [1, 2, 3, 4, 5] as i}
						<button
							class:btn-accent={i === classNum}
							class="btn btn-primary btn-lg"
							on:click={() => (classNum = i)}>{i}</button
						>
					{/each}
				</div>
			</div>
		</div>
		<div class="flex">
			{#each stData.filter((i) => i.grade === grade && i.classNum === classNum) as st}
				<button class="btn btn-primary m-2" on:click={() => (name = st.name)}>{st.name}</button>
			{/each}
		</div>
		{#if name !== ''}
			<button class="btn btn-primary btn-lg" on:click={takePhoto}>사진 찍기</button>
		{/if}
	{/if}
</div>
<canvas id="canvas" width="1280" height="720" bind:this={canvas} class="invisible" />

<style>
	@font-face {
		font-family: 'cookie';
		src: url('fonts/CookieRun-Bold.ttf');
	}
	button {
		font-family: 'cookie';
	}
</style>
