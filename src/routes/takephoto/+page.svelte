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
	let audio: HTMLAudioElement;
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
		const context = canvas.getContext('2d');
		let image = new Image();
		image.src = 'hdframe.png';
		audio = new Audio('sound.mp3');
		audio.addEventListener('ended', () => {
			if (video) {
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
					taking = false;
				});
			}
		});

		function step() {
			if (context == undefined || video === undefined) {
				return;
			}
			context.drawImage(video, 0, 0, 1280, 720);
			context.drawImage(image, 0, 0, 1280, 730);
			context.font = '48px cookie';
			context.fillStyle = 'green';
			context.fillText('책을 소개합니다!', 70, 690);
			context.fillStyle = 'black';
			context.fillText(name, 1100, 690);
			context.font = '30px cookie';

			context.fillText(`${grade}학년 ${classNum}반`, 950, 690);

			requestAnimationFrame(step);
		}
		requestAnimationFrame(step);
	});
	async function takePhoto() {
		if (taking) return;

		taking = true;
		audio.play();
	}
</script>

<div class="flex h-screen items-center flex-col">
	<!-- svelte-ignore a11y-media-has-caption -->
	<video autoplay class="hidden" />
	<canvas id="canvas" width="1280" height="720" class:hidden={!taking} bind:this={canvas} />
	{#if !taking}
		<img src="detail.jpg" alt="설명" class="border border-black border-4" />
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
			<button class="btn btn-secondary btn-lg btn-wide text-2xl" on:click={takePhoto}
				>사진 찍기</button
			>
		{/if}
	{/if}
</div>

<style>
	@font-face {
		font-family: 'cookie';
		src: url('fonts/CookieRun-Bold.ttf');
	}
	button {
		font-family: 'cookie';
	}
</style>
