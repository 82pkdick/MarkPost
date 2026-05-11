<script lang="ts">
	import { resolve } from '$app/paths';
  import { page } from '$app/state';
	import { default as config } from '$lib/app-config';
	import MenuButtonIcon from '$lib/icons/menu-button-icon.svelte';
	import AddNewIcon from '$lib/icons/add-new-icon.svelte';
	import PanelUpIcon from '$lib/icons/panel-up-icon.svelte';
	import { tglInputPanelState } from '../../../routes/+page.svelte';

	let { btnAction }: { btnAction: Function } = $props();

	let AddArticlePanelState = $state(false);

	let pagePathName = $derived(page.url.pathname);

	const baseUrl = resolve('/');

	let isTopPage = $state(false);

	$effect(() => {
		if (pagePathName === baseUrl) {
			isTopPage = true;
		} else {
			isTopPage = false;
		}
	});

	const handleMenuBtn = () => {
		btnAction();
	};

	const handleShowAddArticlePanel = () => {
		AddArticlePanelState = !AddArticlePanelState;
		tglInputPanelState();
	}
</script>

<div class="wrap-site-header">
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

	<div class="hdr-r-mod {isTopPage ? "toppage" : ""}">
		{#if isTopPage}
		<div id="addNewArticleButton" class="hdr-navi add-new-article-btn">
			<button type="button" 
				class="navi-ctn add-new-article {AddArticlePanelState ? "open" : ""}" 
				onclick={handleShowAddArticlePanel}>
				<span class="wrap-add-new-icon">
					<AddNewIcon />
				</span>
				<span class="wrap-panel-up-icon">
					<PanelUpIcon />
				</span>
			</button>
		</div>			
		{/if}
	</div>
</div>

<style lang="scss">
	@use "$lib/styles/scss-variables" as v;

	.wrap-site-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: #{v.$site_header_h}px;

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

		.hdr-r-mod {
			position: relative;
			top: 0;
			right: 1.8vw;
			margin-left: 0;
			margin: auto 0 auto 10px;
			width: 50px;
			height: 95%;
			display: flex;
			flex-wrap: nowrap;
			justify-content: flex-end;
			align-items: center;

			.add-new-article-btn {
				position: relative;
				top: -3px;
				right: 0;
				button.add-new-article {
					margin: 0;
					padding: 0 4px;
					border: none;
					background-color: transparent;

					.wrap-add-new-icon {
						display: block;
					}
					.wrap-panel-up-icon {
						display: none;
					}

					&.open {
						.wrap-add-new-icon {
							display: none;
						}
						.wrap-panel-up-icon {
							display: block;
						}
					}
				}
			}
		}
	}

</style>
