<script lang="ts">
	import { page } from '$app/state';
	let { children } = $props();
</script>

<div class="app-shell">
	<header class="app-header">
		<a href="/" class="brand">🍲 PlateShelf</a>
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
		<div class="app-content">
			{@render children()}
		</div>
	</main>

	<footer class="app-footer">
		<div class="footer-inner">
			<span class="footer-brand">🍲 PlateShelf</span>
			<span class="footer-divider">·</span>
			<span class="footer-credit">
				Crafted by <strong>Ankit Singh</strong>
			</span>
			<span class="footer-divider">·</span>
			<a href="https://github.com/RIOLOG/recipe-project-NAGP" target="_blank" rel="noopener noreferrer" class="footer-link">
				<svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true">
					<path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38
						0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01
						1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95
						0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18
						1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12
						.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48
						0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
				</svg>
				Source Code
			</a>
		</div>
	</footer>
</div>

<style>
	:global(:root) {
		--ruk-accent-color: #FF6B4A;
		--ruk-card-bg: #ffffff;
		--ruk-border-color: #F0E6DE;
		--ruk-text-color: #2D2A26;
		--ruk-muted-color: #8A8580;
		--ruk-chip-bg: #FFF3EE;
		--ruk-fav-color-active: #FF6B4A;
	}

	:global(html, body) {
		margin: 0;
		height: 100%;
		font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
		background: #FFF9F5;
		color: #2D2A26;
	}

	:global(*) {
		box-sizing: border-box;
	}

	.app-shell {
		display: flex;
		flex-direction: column;
		height: 100vh;
	}

	.app-header {
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 12px;
		padding: 14px clamp(16px, 4vw, 48px);
		border-bottom: 1px solid #F0E6DE;
		background: white;
		z-index: 10;
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
		border: 1px solid #F0E6DE;
		background: white;
		color: #2D2A26;
		text-decoration: none;
		font-size: 0.88rem;
		font-weight: 500;
		transition: background 0.15s ease, border-color 0.15s ease;
	}

	.nav-btn:hover {
		background: #f5f5f5;
	}

	.nav-btn.active {
		background: #FFF0EB;
		border-color: #FF6B4A;
		color: #FF6B4A;
		font-weight: 600;
	}

	.nav-btn--primary {
		background: #FF6B4A;
		border-color: #FF6B4A;
		color: white;
	}

	.nav-btn--primary:hover {
		background: #E85A3B;
	}

	.nav-btn--primary.active {
		background: #E85A3B;
		color: white;
	}

	:global(.back-link) {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 7px 14px;
		border-radius: 999px;
		border: 1px solid #F0E6DE;
		background: white;
		color: #2D2A26;
		text-decoration: none;
		font-size: 0.85rem;
		margin-bottom: 16px;
		transition: background 0.15s ease;
	}

	:global(.back-link:hover) {
		background: #FFF9F5;
	}

	.app-main {
		flex: 1;
		overflow-y: auto;
	}

	.app-content {
		max-width: 1400px;
		margin: 0 auto;
		padding: 24px clamp(16px, 4vw, 48px) 40px;
	}

	.app-footer {
		flex-shrink: 0;
		padding: 14px 20px;
		border-top: 1px solid #F0E6DE;
		background: white;
	}

	.footer-inner {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-wrap: wrap;
		gap: 10px;
		font-size: 0.85rem;
		color: #8A8580;
	}

	.footer-brand {
		font-weight: 700;
		color: #2D2A26;
	}

	.footer-credit strong {
		color: #FF6B4A;
	}

	.footer-divider {
		color: #E5DAD0;
	}

	.footer-link {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		color: #2D2A26;
		text-decoration: none;
		font-weight: 600;
		padding: 4px 10px;
		border-radius: 999px;
		border: 1px solid #F0E6DE;
		transition: background 0.15s ease, border-color 0.15s ease;
	}

	.footer-link:hover {
		background: #FFF9F5;
		border-color: #FF6B4A;
	}

	.app-footer a {
		color: #FF6B4A;
		text-decoration: none;
		font-weight: 600;
	}

	.app-footer a:hover {
		text-decoration: underline;
	}
</style>