export const objectAssign = (target: any, source: any): void => {
  Object.entries(source).forEach(([key, value]) => {
    let ref = target
    const props = key.split('.')
    const last = props.pop() ?? ''

    props.forEach(prop => {
      if (ref[prop] === undefined) ref[prop] = {}
      ref = ref[prop]
    })
    ref[last] = value
  })
}

export const get = (t: any, path: string): any =>
  path.split('.').reduce((r, k) => r?.[k], t)
