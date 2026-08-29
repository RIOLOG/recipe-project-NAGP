<script lang="ts">
	import { page } from '$app/state';
	let { children } = $props();
</script>

<div class="app-shell">
	<header class="app-header">
		<a href="/" class="brand">🍲 Recipe Finder</a>
		<nav class="main-nav">
			<a href="/favorites" class="nav-btn" class:active={page.url.pathname === '/favorites'}>
				Favorites
			</a>
			<a href="/planner" class="nav-btn" class:active={page.url.pathname === '/planner'}>
				Meal Planner
			</a>
			<a href="/recipes/new" class="nav-btn nav-btn--primary" class:active={page.url.pathname === '/recipes/new'}>
				+ Add Recipe
			</a>
		</nav>
	</header>

	<main class="app-main">
		{@render children()}
	</main>
</div>

<style>
	:global(body) {
		margin: 0;
		font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
		background: #fafafa;
		color: #222;
	}

	:global(*) {
		box-sizing: border-box;
	}

	.app-shell {
		max-width: 1100px;
		margin: 0 auto;
		padding: 0 20px 60px;
	}

	.app-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 12px;
		padding: 18px 0;
		border-bottom: 1px solid #eee;
		margin-bottom: 24px;
	}

	.brand {
		font-size: 1.3rem;
		font-weight: 800;
		color: #222;
		text-decoration: none;
	}

	.main-nav {
		display: flex;
		gap: 8px;
	}

	.nav-btn {
		padding: 8px 16px;
		border-radius: 999px;
		border: 1px solid #ddd;
		background: white;
		color: #333;
		text-decoration: none;
		font-size: 0.88rem;
		font-weight: 500;
		transition: background 0.15s ease, border-color 0.15s ease;
	}

	.nav-btn:hover {
		background: #f5f5f5;
	}

	.nav-btn.active {
		background: #eef1ff;
		border-color: #4a6fff;
		color: #4a6fff;
		font-weight: 600;
	}

	.nav-btn--primary {
		background: #4a6fff;
		border-color: #4a6fff;
		color: white;
	}

	.nav-btn--primary:hover {
		background: #3a5eec;
	}

	.nav-btn--primary.active {
		background: #3a5eec;
		color: white;
	}
	:global(.back-link) {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 7px 14px;
		border-radius: 999px;
		border: 1px solid #ddd;
		background: white;
		color: #333;
		text-decoration: none;
		font-size: 0.85rem;
		margin-bottom: 16px;
		transition: background 0.15s ease;
	}

	:global(.back-link:hover) {
		background: #f5f5f5;
	}

</style>