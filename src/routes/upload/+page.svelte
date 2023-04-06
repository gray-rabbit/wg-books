<script lang="ts">
	import PocketBase from 'pocketbase';

	async function uploadTest() {
		const pb = new PocketBase('http://127.0.0.1:8090');
		const data = { name: '박성준', grade: 5, class: 5 };
		const record = await pb.collection('photo').create(data);
	}
</script>

<div>ㅇㅇㅇ</div>
<button class="btn btn-primary" on:click={uploadTest}>업로드</button>
