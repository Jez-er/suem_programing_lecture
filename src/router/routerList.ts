import homeHtml from '../pages/home.html?raw'
import testHtml from '../pages/test.html?raw'

export interface RouterList {
	path: string
	template: string
}

export const routerList: RouterList[] = [
	{ path: '/', template: homeHtml },
	{ path: '/test', template: testHtml },
]
