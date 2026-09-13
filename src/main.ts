import { router } from './router/router'
import { routerList } from './router/routerList'
import './style.css'

const appElement = document.querySelector<HTMLDivElement>('#app')!

router(appElement, routerList)
