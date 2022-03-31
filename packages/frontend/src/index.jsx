/* @refresh reload */
import { render } from 'solid-js/web'

import './index.css'
import App from './App'

const root = /** @type {MountableElement} */ (document.getElementById('root'))

render(() => <App />, root)
