declare module '*.vue' {
  import { defineComponent } from 'vue'
  const Component: ReturnType<typeof defineComponent>
  export default Component
}

declare module '*.svg' {
  import { VNode } from 'vue'
  type Svg = VNode
  const content: Svg
  export default content
}
