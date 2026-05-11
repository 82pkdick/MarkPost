<script module>
	import type { LoadedPostData } from "$lib/types";

	let menuState = $state('N');

	export type MenuStateType = 'N'|'C'|'T';

	export const getMenuState = () => {
		return menuState;
	};

	export const setMenuState = (choice: MenuStateType) => {
		menuState = choice;
	};

	const defaultThemeName = 'default';
	let currentTheme = $state('');

	export const getCurrentTheme = () => {
		return currentTheme;
	};

  export const changeThemeMode = (color: string = defaultThemeName) => {
    document.documentElement.dataset['theme'] = color;
    currentTheme = color;
    localStorage.setItem('theme-color', color);
  };

	const ftsizeEntry = { small: '16px', normal: '18px', large: '20px'};
	type FtsizeType = keyof typeof ftsizeEntry;

	const defaultFontSize = 'normal';
	let currentFontSize = $state('');

	export const getCurrentFontSize = () => {
		return currentFontSize;
	};

  export const changeBaseFontSize = (size: FtsizeType = defaultFontSize) => {
		const fontsize = ftsizeEntry[size];
		currentFontSize = size;
		let fsizedef = `:root {--default-ft-size: ${fontsize};}`;
		const styledef = document.getElementById('base-font-size-def') as HTMLElement;
    styledef.innerHTML = fsizedef;
		localStorage.setItem('base-fontsize', size);
	};

	let showPreview = $state(false);

	export const getPreviewState = () => {
		return showPreview;
	};

	export const setPreviewState = (show: boolean) => {
		showPreview = show;
	};

	let currentPostId = $state('');

	export const getCurrentPostId = () => {
		return currentPostId;
	};

	export const setCurrentPostId = (pid: string) => {
		currentPostId = pid;
	};

	let currentPostData: LoadedPostData | null = $state(null);

	export const getCurrentPostData = () => {
		return currentPostData;
	};

	export const setCurrentPostData = async (pid: string) => {
		setCurrentPostId(pid);
    const response = await fetch(`/api/post/${pid}`);
    const data = await response.json();
    currentPostData = data;
  };
</script>

<script lang="ts">
	import faviconS from '$lib/assets/img/favicon/favicon-32x32.png';
	import faviconM from '$lib/assets/img/favicon/favicon-72x72.png';
	import faviconL from '$lib/assets/img/favicon/favicon-152x152.png';
	import { default as config } from '$lib/app-config';
	import { page } from '$app/state';
	import SiteHeader from '$lib/components/SiteHeader.svelte';
	import SiteSidebar from '$lib/components/SiteSidebar.svelte';
	import SidemenuCategories from '$lib/components/SidemenuCategories.svelte';
	import SidemenuTags from '$lib/components/SidemenuTags.svelte';

	import { onMount } from 'svelte';
	import { pid } from 'process';

	onMount(() => {
		// Read Style
		const color = localStorage.getItem('theme-color') || defaultThemeName;
		changeThemeMode(color);
		const ftsize = localStorage.getItem('base-fontsize') as FtsizeType || defaultFontSize;
		changeBaseFontSize(ftsize)
	});

	let pathname = $derived(page.url.pathname);

	$effect(() => {
		// console.log('A01 pathname: ', $state.snapshot(pathname));
		// console.log('A02 pagenumber: ', $state.snapshot(page.params.num));
	});

	let { children } = $props();

	const getPageTitle = () => {
		let pagename = '';
		switch (true) {
			case /\/$/.test(pathname):
				pagename = 'Home';
				break;
			case /\/(page)\/\d+$/.test(pathname):
				pagename = `Page ${page.params.num}`;
				break;
			default:
				pagename = '';
		}
		return `${config.Site.title} : ${pagename}`;
	};

	let pageTitle = getPageTitle();

	let deformSidebar = $state(false);

	const tglMenuBar = () => {
		deformSidebar = !deformSidebar;
		menuState = 'N';
	};


</script>

<svelte:head>
	<title>{pageTitle}</title>
	<link rel="icon" type="image/png" href={faviconS} />
	<link rel="icon" type="image/png" href={faviconM} />
	<link rel="icon" type="image/png" href={faviconL} />

	<link rel="stylesheet" href="/css/lib/destyle.css" />
	<link rel="stylesheet" href="/css/lib/normalize.css" />
	<link rel="stylesheet" href="/css/lib/syntax.css" />
	<link rel="stylesheet" href="/css/base-styles.css" />

	<style id="base-font-size-def"></style>
</svelte:head>

<div
	id="mainCtn" class="main-ctn grid-ctn base-bg {deformSidebar ? 'deform-side ' : ' '}
		{(menuState === 'C' || menuState === 'T') ? 'show-sidemenu with-menu' : ''}"
>
	<header id="siteHeader" class="site-header base-bg bdr-btm btm-shadow">
		<SiteHeader btnAction={tglMenuBar} />
	</header>

	<aside id="siteSidebar" class="site-sidebar base-bg bdr-right r-shadow">
		<SiteSidebar menuHandle={setMenuState}
		/>
	</aside>

	<section
		id="sidemenuCategories"
		class="side-menu type-categories base-bg-front bdr-right
		{(menuState === 'C') ? 'active' : ''}"
	>
		<SidemenuCategories />
	</section>

	<section
		id="sidemenuTags"
		class="side-menu type-tags base-bg-front bdr-right
		{(menuState === 'T') ? 'active' : ''}"
	>
		<SidemenuTags />
	</section>

	<main id="mainContent" 
		class="main-content base-bg {showPreview ? 'with-postpanel' : ''}"
	>
	{@render children()}
	</main>
</div>

<style lang="scss">
	@use '$lib/styles/main-styles.scss';

	.site-sidebar {
		position: relative;
		padding: 18px 8px 100px 10px;
	}
</style>
