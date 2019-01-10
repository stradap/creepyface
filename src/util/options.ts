import mousePoints from '../observables/mouse'
import fingerPoints from '../observables/finger'
import combined from '../observables/combined'
import { Observable } from '../observables/util/observable'
import { Angle, Vector } from './algebra'
import { CreepyImage } from './types'
import noop from './noop'

export type Millis = number
export type Time = Millis
export type ImageURL = string
export type Look = {
  src: ImageURL
  angle: Angle
}
export type CreepyData = {
  point?: Vector
  angle?: Angle
  src: string
  options: Options
}
export type Debug = (data: CreepyData) => void
export type EventListener = () => void
export type Options = {
  fieldOfVision: Angle
  src: ImageURL
  hover?: ImageURL
  looks: Array<Look>
  points: Observable<Vector>
  timeToDefault: Time
  resetOnCancel: boolean
  throttle: Time
  onDebug: Debug
  onAttach: EventListener
  onDetach: EventListener
}
export type UserOptions = {
  fieldOfVision?: Angle
  src?: ImageURL
  hover?: ImageURL
  looks?: Array<Look>
  points?: Observable<Vector>
  timeToDefault?: Time
  resetOnCancel?: boolean
  throttle?: Time
  onDebug?: Debug
  onAttach?: EventListener
  onDetach?: EventListener
}

const getLooks = (img: HTMLElement): Array<Look> | undefined => {
  const regex = /data-src-look-(\d+)/i
  const looks: Array<Look> = []
  for (let i = 0; i < img.attributes.length; i++) {
    const attr = img.attributes[i]
    const match = regex.exec(attr.name)
    if (match) {
      looks.push({ angle: parseFloat(match[1]), src: attr.value })
    }
  }
  return looks.length ? looks : undefined
}

const getFloat = (s: string | null): number | undefined => {
  const float = s ? parseFloat(s) : NaN
  return isNaN(float) ? undefined : float
}

const fromImage = (img: CreepyImage): UserOptions => ({
  src: img.getAttribute('src') || undefined,
  hover: img.getAttribute('data-src-hover') || undefined,
  looks: getLooks(img),
  timeToDefault: getFloat(img.getAttribute('data-timetodefault')),
  throttle: getFloat(img.getAttribute('data-throttle')),
  fieldOfVision: getFloat(img.getAttribute('data-fieldofvision')),
  resetOnCancel: img.getAttribute('data-resetoncancel') === 'true'
})

export default function getOptions(
  img: CreepyImage,
  options: UserOptions = {}
): Options {
  const userOptions = { ...fromImage(img), ...options }

  if (!userOptions.src) throw new Error('A default URL must be specified')

  return {
    fieldOfVision: userOptions.fieldOfVision || 150,
    src: userOptions.src,
    hover: userOptions.hover || '',
    points: userOptions.points || combined([mousePoints, fingerPoints]),
    looks: userOptions.looks || [],
    timeToDefault: userOptions.timeToDefault || 1000,
    resetOnCancel: !(userOptions.resetOnCancel === false),
    throttle: userOptions.throttle || 100,
    onDebug: userOptions.onDebug || noop,
    onAttach: userOptions.onAttach || noop,
    onDetach: userOptions.onDetach || noop
  }
}