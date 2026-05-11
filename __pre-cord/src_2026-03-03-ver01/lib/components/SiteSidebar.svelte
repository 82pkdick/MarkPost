<script lang="ts">
	import HomeIcon from '$lib/icons/home-icon.svelte';
	import CategoryIcon from '$lib/icons/categories-icon.svelte';
	import TagIcon from '$lib/icons/tag-icon.svelte';
	import SettingsIcon from '$lib/icons/settings-icon.svelte';
	import type { MenuStateType } from "../../routes/+layout.svelte";
	import { getMenuState, setPreviewState } from "../../routes/+layout.svelte";

	let {	menuHandle }: {	menuHandle: Function; } = $props();

	const handleMenu = (choice: MenuStateType) => {
		const menuState = getMenuState();
		if (menuState !== choice) {
			menuHandle(choice);
		} else {
			menuHandle('N');
		}
	};

	const resetPanel = () => {
		menuHandle('N');
		setPreviewState(false);
	};
</script>

<nav>
	<!-- Home -->
	<div class="menu-item navi-homelink">
		<h3 class="menu-title menu-title-homelink">
			<a href="/" class="ft-subtitle" onclick={resetPanel}>
				<HomeIcon />
			</a>
		</h3>
	</div>

	<!-- open menu -- category, section -->
	<div class="menu-item navi-category">
		<h3 id="menuTitleCategory" class="menu-title menu-title-category">
			<button type="button" class="menu-btn" onclick={() => handleMenu('C')}>
				<CategoryIcon />
			</button>
		</h3>
	</div>

	<!-- open menu -- tags -->
	<div class="menu-item navi-tags">
		<h3 id="menuTitleTags" class="menu-title menu-title-tags">
			<button type="button" class="menu-btn" onclick={() => handleMenu('T')}>
				<TagIcon />
			</button>
		</h3>
	</div>

	<!-- open menu -- settings -->
	<div class="menu-item navi-settings">
		<h3 class="menu-title menu-title-settings">
			<a href="/settings" class="ft-subtitle" onclick={resetPanel}>
				<SettingsIcon />
			</a>
		</h3>
	</div>
</nav>

<style lang="scss">
	.menu-item {
		background-color: transparent;
	}
</style>
