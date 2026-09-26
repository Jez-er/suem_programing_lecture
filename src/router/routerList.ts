import homeHtml from '../pages/home.html?raw'
import lecturesIndexHtml from '../pages/lectures/index.html?raw'
import lection1Html from '../pages/lectures/Lection_1.html?raw'
import lection2Html from '../pages/lectures/Lection_2.html?raw'

export interface RouterList {
	path: string
	template: string
}

export const routerList: RouterList[] = [
	{ path: '/', template: homeHtml },
	{ path: '/lectures', template: lecturesIndexHtml },
	{ path: '/lectures/1', template: lection1Html },
	{ path: '/lectures/2', template: lection2Html },
	{ path: '/lecture/1', template: lection1Html },
	{ path: '/lecture/2', template: lection2Html },
]
