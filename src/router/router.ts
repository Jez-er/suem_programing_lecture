import notFoundHtml from '../pages/404.html?raw'
import type { RouterList } from './routerList'
import { initEngine } from '../engine'

const normalizePath = (path: string) => {
	if (path.length > 1 && path.endsWith('/')) {
		return path.slice(0, -1)
	}
	return path
}

const renderHeader = (currentPathname: string) => {
	const cleanPath = normalizePath(currentPathname)
	const isLecturesActive =
		cleanPath === '/lectures' ||
		cleanPath.startsWith('/lectures/') ||
		cleanPath.startsWith('/lecture/')

	return `
		<header class="site-header">
			<div class="nav-wrap">
				<a href="/" class="site-brand">
					<span class="brand-badge">ОК 11</span>
					<span class="brand-title">Основи Python</span>
				</a>
				<nav class="site-nav">
					<a href="/" class="${cleanPath === '/' ? 'active' : ''}">Головна</a>
					<a href="/lectures" class="${isLecturesActive ? 'active' : ''}">Список лекцій</a>
				</nav>
			</div>
		</header>
	`
}

const routerFindElement = (
	htmlElement: HTMLElement,
	routerList: RouterList[],
) => {
	const pathname = normalizePath(window.location.pathname)
	const route = routerList.find(r => normalizePath(r.path) === pathname)

	const pageContent = route ? route.template : notFoundHtml
	const headerHtml = renderHeader(pathname)

	htmlElement.innerHTML = `${headerHtml}${pageContent}`

	// Scroll to hash target or top of page
	if (window.location.hash) {
		const targetEl = document.querySelector(window.location.hash)
		if (targetEl) {
			targetEl.scrollIntoView({ behavior: 'smooth' })
		} else {
			window.scrollTo(0, 0)
		}
	} else {
		window.scrollTo(0, 0)
	}

	// Initialize interactive widgets for the active page
	initEngine()
}

export const router = (htmlElement: HTMLElement, routerList: RouterList[]) => {
	document.addEventListener('click', event => {
		const target = event.target as HTMLElement
		const link = target.closest('a')
		if (!link) return

		const href = link.getAttribute('href')
		if (
			href &&
			href.startsWith('/') &&
			!link.hasAttribute('target') &&
			!link.hasAttribute('download')
		) {
			// Do not intercept static file downloads or paths with file extensions
			const isStaticFile = /\.(docx|doc|pdf|zip|rar|png|jpg|jpeg|svg|txt|py)$/i.test(href)
			const cleanHrefPath = normalizePath(href.split('#')[0].split('?')[0])
			const matchesRoute = routerList.some(r => normalizePath(r.path) === cleanHrefPath)

			if (!isStaticFile && matchesRoute) {
				event.preventDefault()
				window.history.pushState(null, '', href)
				routerFindElement(htmlElement, routerList)
			}
		}
	})

	window.addEventListener('popstate', () => {
		routerFindElement(htmlElement, routerList)
	})

	routerFindElement(htmlElement, routerList)
}
