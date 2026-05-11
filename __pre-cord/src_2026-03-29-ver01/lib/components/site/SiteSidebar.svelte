<script lang="ts">
	import { resolve } from '$app/paths';
	import HomeIcon from '$lib/icons/home-icon.svelte';
	import CategoryIcon from '$lib/icons/categories-icon.svelte';
	import TagIcon from '$lib/icons/tag-icon.svelte';
	import SearchIcon from '$lib/icons/search-icon.svelte';
	import SettingsIcon from '$lib/icons/settings-icon.svelte';
	import { type MenuStateType, getMenuState, setMenuState, setPostPanelState } from '$lib/index.svelte';
	import { delTrSlash } from '$lib/utils/locationUtils';

	const baseUrl = delTrSlash(resolve('/'));

	const handleMenu = (choice: MenuStateType) => {
		const menuState = getMenuState();
		if (menuState !== choice) {
			setMenuState(choice);
		} else {
			setMenuState('N');
		}
	};

	const resetPanel = () => {
		setMenuState('N');
		setPostPanelState(false);
	};
</script>

<nav>
	<!-- Home -->
	<div class="menu-item navi-homelink">
		<h3 class="menu-title menu-title-homelink">
			<a href={baseUrl}/ class="ft-subtitle" onclick={resetPanel}>
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

	<!-- open menu -- search -->
	<div class="menu-item navi-search">
		<h3 class="menu-title menu-title-search">
			<a href={`${baseUrl}/search`} class="ft-subtitle" onclick={resetPanel}>
				<SearchIcon />
			</a>
		</h3>
	</div>

	<!-- open menu -- settings -->
	<div class="menu-item navi-settings">
		<h3 class="menu-title menu-title-settings">
			<a href={`${baseUrl}/settings`} class="ft-subtitle" onclick={resetPanel}>
				<SettingsIcon />
			</a>
		</h3>
	</div>
</nav>

<style lang="scss">
	.menu-item {
		background-color: transparent;
		.menu-title {
			margin: 10px 0;
		}
	}
</style>
