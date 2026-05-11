<script lang="ts">
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import { page } from '$app/state';

	import faviconS from '$lib/assets/img/favicon/favicon-32x32.png';
	import faviconM from '$lib/assets/img/favicon/favicon-72x72.png';
	import faviconL from '$lib/assets/img/favicon/favicon-152x152.png';
	import { default as config } from '$lib/app-config';
	//--- main global style scss
	import '$lib/app.scss';

	import SiteHeader from '$lib/components/site/SiteHeader.svelte';
	import SiteSidebar from '$lib/components/site/SiteSidebar.svelte';
	import SidemenuCategories from '$lib/components/SidemenuCategories.svelte';
	import SidemenuTags from '$lib/components/SidemenuTags.svelte';
	import { 
		type FtsizeType, 
		getMenuState, 
		changeThemeMode, 
		defaultThemeName, 
		defaultFontSize, 
		changeBaseFontSize,
		getPostPanelState,
		getPreviewPanelState,
	} from "$lib/index.svelte";

	const base = resolve('/');

	onMount(() => {
		// Read Style
		const color = localStorage.getItem('theme-color') || defaultThemeName;
		changeThemeMode(color);
		const ftsize = localStorage.getItem('base-fontsize') as FtsizeType || defaultFontSize;
		changeBaseFontSize(ftsize);
	});

	let menuState = $derived(getMenuState());
	let showPostPanel = $derived(getPostPanelState());
	let showPreview = $derived(getPreviewPanelState());

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

	<link rel="stylesheet" href={`${base}css/lib/destyle.css`} />
	<link rel="stylesheet" href={`${base}css/lib/normalize.css`} />
	<link rel="stylesheet" href={`${base}css/lib/syntax.css`} />

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
		<SiteSidebar />
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
		class="main-content base-bg {showPostPanel ? 'with-postpanel' : ''}	{showPreview ? 'show-preview' : ''}"
	>
	{@render children()}
	</main>
</div>


