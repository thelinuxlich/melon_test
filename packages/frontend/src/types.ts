import solid from 'solid-js'
import web from 'solid-js/web'

export {}

declare global {
  type JSXElement = solid.JSXElement
  type MountableElement = web.MountableElement
}
