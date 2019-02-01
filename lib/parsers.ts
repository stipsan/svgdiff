// Supports reporting errors, but requires the xmlns attribute to be set on <svg> to work
export const domParser = (svgText: string) => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(svgText, 'image/svg+xml')
  return (doc.documentElement as unknown) as SVGSVGElement
}

export const documentFragment = (svgText: string) => {
  const range = document.createRange()

  // required in Safari
  range.selectNode(document.body)

  const fragment = range.createContextualFragment(svgText)
  return fragment.firstChild as SVGSVGElement
}
