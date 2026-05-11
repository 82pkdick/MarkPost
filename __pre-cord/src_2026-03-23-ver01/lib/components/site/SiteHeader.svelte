<script lang="ts">
	import { default as config } from '$lib/app-config';
	import MenuButtonIcon from '$lib/icons/menu-button-icon.svelte';

	let { btnAction }: { btnAction: Function } = $props();

	const handleMenuBtn = () => {
		btnAction();
	};
</script>

<div class="hdr-l-mod">
	<div id="menuButton" class="hdr-navi menu-button">
		<button type="button" class="navi-ctn tgl-menu" onclick={handleMenuBtn}>
			<MenuButtonIcon />
		</button>
	</div>
	<!-- Site Title -->
	<a href="/markpost" class="site-title-link">
		<h3 class="site-title">
			<!-- Site Logo -->
			<i class="site-logo">
				<img src="/markpost/images/site-logo.svg" class="site-logo" alt="Icon" />
			</i>
			<span class="site-title-text">
				{config.Site.title}
			</span>
		</h3>
	</a>
</div>

<style lang="scss">
	.hdr-l-mod {
		position: relative;
		top: 0;
		left: 10px;
		margin-left: 0;
		margin: auto 0;
		width: calc(100% - 15px);
		min-width: 120px;
		max-width: 60%;
		height: 95%;
		display: flex;
		flex-wrap: nowrap;
		justify-content: flex-start;
		align-items: center;

		.menu-button {
			display: inline-flex;
			justify-content: center;
			align-items: center;
			width: 38px;
			height: 100%;
			position: relative;
			top: 2px;
			left: 0;
			margin: auto;
			.navi-ctn.tgl-menu {
				position: relative;
				width: 100%;
				height: 100%;
				margin: 0;
				padding: 2px;
				background-color: transparent;
			}
		}

		.site-logo {
			width: 26px;
			height: 26px;
		}

		.site-title-link {
			width: 100%;
			height: 90%;
			margin-left: 16px;
			padding-top: 6px;

			.site-title {
				display: flex;
				flex-wrap: nowrap;
				justify-content: flex-start;
				align-items: center;
				margin: 0;
				padding: 0;
				background-color: initial;

				.site-title-text {
					display: inline-block;
					margin-left: 7px;
					color: var(--site-title-color);
					font-weight: 600;
					font-size: 1.15rem;
				}
			}
		}
	}
</style>
