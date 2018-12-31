// @flow
import preload from './preload'
import getOptions from './options'
import creepy from '../observables/creepy'
import type { UserOptions } from './options'
import type { Cancel, CreepyImage } from './types'

export default (img: CreepyImage, userOptions?: UserOptions): Cancel => {
  const options = getOptions(img, userOptions)
  const setSrc = src => { img.src = src }
  const preloaded = preload(img, options)
  const subscribed = preloaded.then(() => {
    options.onAttach()
    return creepy(img, options).subscribe(data => {
      setSrc(data.src)
      options.onDebug(data)
    })
  })

  return () => subscribed.then(subscription => {
    preloaded.then(unload => unload())
    subscription.unsubscribe()
    if (options.resetOnCancel) setSrc(options.src)
    options.onDetach()
  })
}
