import doTest from './do-test'
import creepyface from '../creepyface'

describe('Using DOM api', () => {
  doTest(img => {
    img.setAttribute('src', 'http://localhost/serious')
    img.setAttribute('data-throttle', '100')
    img.setAttribute('data-src-hover', 'http://localhost/hover')
    img.setAttribute('data-src-look-0', 'http://localhost/north')
    img.setAttribute('data-src-look-45', 'http://localhost/northEast')
    img.setAttribute('data-src-look-90', 'http://localhost/east')
    img.setAttribute('data-src-look-135', 'http://localhost/southEast')
    img.setAttribute('data-src-look-180', 'http://localhost/south')
    img.setAttribute('data-src-look-225', 'http://localhost/southWest')
    img.setAttribute('data-src-look-270', 'http://localhost/west')
    img.setAttribute('data-src-look-315', 'http://localhost/northWest')

    return creepyface(img)
  })
})
