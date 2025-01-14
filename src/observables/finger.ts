import observable, { Observer } from './util/observable'
import { add, Vector } from '../util/algebra'

const observers: Observer<Vector>[] = []

document.addEventListener(
  'touchmove',
  (event: TouchEvent) =>
    observers.forEach(observer => {
      let point = [0, 0]
      for (let i = 0; i < event.touches.length; i++) {
        const touch = event.touches[i]
        point = add(point, [touch.clientX, touch.clientY])
      }
      observer.next(point)
    }),
  true
)

export default observable<Vector>(observer => {
  observers.push(observer)
  return () => {
    observers.splice(observers.indexOf(observer), 1)
  }
})
