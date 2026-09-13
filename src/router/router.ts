import notFoundHtml from '../pages/404.html?raw'
import type { RouterList } from './routerList'

const routerFindElement = (
	htmlElement: HTMLElement,
	routerList: RouterList[],
) => {
	const pathname = window.location.pathname
	const route = routerList.find(r => r.path === pathname)

	htmlElement.innerHTML = route ? route.template : notFoundHtml
}

export const router = (htmlElement: HTMLElement, routerList: RouterList[]) => {
	document.addEventListener('click', event => {
		const target = event.target as HTMLElement
		const link = target.closest('a')
		if (!link) return

		const href = link.getAttribute('href')
		if (href && href.startsWith('/') && !link.hasAttribute('target')) {
			event.preventDefault()
			window.history.pushState(null, '', href)
			routerFindElement(htmlElement, routerList)
		}
	})

	window.addEventListener('popstate', () => {
		routerFindElement(htmlElement, routerList)
	})

	routerFindElement(htmlElement, routerList)
}
