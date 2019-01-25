import { styled } from 'linaria/react'
import React, { useEffect, useRef, useState } from 'react'

const Wrapper = styled.section`
  display: flex;
  flex: 1;
  flex-direction: column;

  canvas {
    margin-left: auto;
    margin-right: auto;
  }
`

const Preview = styled.div`
  svg {
    min-width: 128px;
  }
`

const Toolbar = styled.nav`
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
  padding: 4px 8px;
`

const TwoUpWrapper = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr;
  flex: 1;
`
type TwoUpProps = {
  previous: string
  current: string
}
const TwoUp: React.FunctionComponent<TwoUpProps> = props => {
  const { previous, current } = props

  return (
    <TwoUpWrapper>
      <img
        src={previous}
        title="original"
        onLoad={event =>
          console.log(
            'previous',
            event.target,
            event.currentTarget.naturalWidth,
            event.currentTarget.naturalHeight
          )
        }
      />
      <img
        src={current}
        title="modified"
        onLoad={event =>
          console.log(
            'current',
            event.target,
            event.currentTarget.naturalWidth,
            event.currentTarget.naturalHeight
          )
        }
      />
    </TwoUpWrapper>
  )
}

type DiffPanelProps = {
  previous: string
  current: string
}

const useSvgParser = (
  svgText: string,
  fallbackSize: CanvasSize
): [string, string] => {
  const [value, setValue] = useState('')
  const [error, setError] = useState('')
  // @TODO rewrite this to useMemo, unless the btoa and SSR becomes an issue?
  useEffect(() => {
    // @TODO useMemo or useCallback optimization candidate
    // Browsers fail to render an SVG to canvas if width and height isn't defined
    // We have to get it from the SVG DOM
    const parser = new DOMParser()
    const doc = parser.parseFromString(svgText, 'image/svg+xml')
    const svgDoc = (doc.documentElement as unknown) as SVGSVGElement

    // Poor mans validation
    if (!svgDoc.viewBox) {
      setError(svgDoc.innerHTML || 'Failed to parse SVG')
      return
    }

    if (!svgDoc.width.baseVal.value) {
      if (svgDoc.viewBox.baseVal.width) {
        svgDoc.setAttribute('width', svgDoc.viewBox.baseVal.width.toString())
        svgDoc.setAttribute('height', svgDoc.viewBox.baseVal.height.toString())
      } else {
        svgDoc.setAttribute('width', fallbackSize.width.toString())
        svgDoc.setAttribute('height', fallbackSize.height.toString())
      }
    }
    var svghtml = new XMLSerializer().serializeToString(svgDoc)

    // Unset errors if there is any
    if (error) {
      setError('')
    }

    setValue(`data:image/svg+xml,${encodeURI(svghtml).replace(/#/g, '%23')}`)
  }, [svgText])

  return [value, error]
}

// make an image instance
// assign it to the ref, like a dom ref!
// on load check if the ref matches before applying the update
// if no match then ignore
// return cleanup function that removes the ref

// start image loading, i

type CanvasSize = {
  height: number
  width: number
}

const draw = (
  can: HTMLCanvasElement,
  img: HTMLImageElement,
  size: CanvasSize,
  color: string
) => {
  // @TODO Drawing can sometimes be delayed so the ref is wrong
  if (!can) {
    return
  }

  const ctx = can.getContext('2d', { alpha: false })
  const { height, width } = size
  const { naturalHeight, naturalWidth } = img
  const landscape = naturalHeight < naturalWidth
  const portrait = naturalHeight > naturalWidth

  // Canvas render target bounds
  const renderBounds = { x: 0, y: 0, width, height }
  if (landscape) {
    const aspectRatio = naturalWidth / naturalHeight
    const renderHeight = height / aspectRatio
    renderBounds.height = renderHeight
    renderBounds.y = (height - renderHeight) / 2
  }
  if (portrait) {
    const aspectRatio = naturalHeight / naturalWidth
    const renderWidth = width / aspectRatio
    renderBounds.width = renderWidth
    renderBounds.x = (width - renderWidth) / 2
  }

  // Handle retina displays
  const dpr = window.devicePixelRatio || 1

  // Update display size, not needed for OffscreenCanvas
  can.style.height = `${height}px`
  can.style.width = `${width}px`

  // Set memory size used for drawing, scaled to account for extra pixel density
  can.height = height * dpr
  can.width = width * dpr

  // Normalize coordinate system to use css pixels.
  ctx.scale(dpr, dpr)

  // Set the background canvas to chosen color
  ctx.fillStyle = color
  ctx.fillRect(0, 0, width, height)

  //ctx.drawImage(img, 0, 0)
  console.log(
    `ctx.drawImage(image, sx: 0, sy: 0, sWidth: ${naturalWidth}, sHeight: ${naturalHeight}, dx: ${
      renderBounds.x
    }, dy: ${renderBounds.y}, dWidth: ${renderBounds.width}, dHeight: ${
      renderBounds.height
    })`
  )

  ctx.drawImage(
    img,
    0,
    0,
    naturalWidth,
    naturalHeight,
    renderBounds.x,
    renderBounds.y,
    renderBounds.width,
    renderBounds.height
  )
}

const TwoUpDiff = styled.div`
  display: ${props => (props.active ? 'flex' : 'none')};
  height: 100%;
  justify-content: space-around;
  align-items: center;
  flex: 1;

  canvas {
    box-shadow: hsla(0, 0%, 0%, 0.1) 0 0 0 1px;
    max-width: 100%;
  }
`

const DifferenceDiff = styled.div`
  display: ${props => (props.active ? 'flex' : 'none')};
  height: 100%;
  justify-content: center;
  align-items: center;
  flex: 1;

  canvas {
    box-shadow: hsla(0, 0%, 0%, 0.1) 0 0 0 1px;
    max-width: 100%;
  }
`

const useDraw = (
  datauri: string,
  size: CanvasSize,
  color: string
): [{ current: HTMLCanvasElement }, HTMLImageElement] => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const currentTask = useRef(null)
  const nextTask = useRef(null)

  useEffect(() => {
    if (!datauri) {
      return
    }

    if (!canvasRef.current) {
      throw new TypeError('No canvas ref found!')
    }

    const taskId = Symbol('taskId')

    const task = () => {
      const next = () => {
        if (nextTask.current) {
          currentTask.current = nextTask.current()
          nextTask.current = null
        } else {
          currentTask.current = null
        }
      }

      const img = new Image()
      img.onload = function() {
        if (taskId !== currentTask.current) {
          return
        }
        //ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, x, y, 32, 32);

        draw(canvasRef.current, img, size, color)
        console.log('success!!', img)

        next()
      }
      img.onerror = function(error) {
        if (taskId !== currentTask.current) {
          return
        }

        console.error('failed to load', datauri, error)

        next()
      }
      img.src = datauri

      return taskId
    }

    // If a task is in progress, queue it, replacing anything that might be queued already
    if (!currentTask.current) {
      currentTask.current = task()
    } else {
      nextTask.current = task
    }
  }, [datauri, size, color])

  return [canvasRef, imageRef.current]
}

// How much is a color channel allowed to differ and still be considered visually equal
// This is mostly here to debug
const ERROR_MARGIN = 0
const diff = (a, b) => (a > b ? a - b : b - a)
const similar = (a, b) => (a === b ? true : diff(a, b) <= ERROR_MARGIN)
const getImageData = (can: HTMLCanvasElement, size: CanvasSize) => {
  const ctx = can.getContext('2d', { alpha: false })
  // Handle retina displays
  const dpr = window.devicePixelRatio || 1

  return ctx.getImageData(0, 0, size.width * 2, size.height * 2)
}
const useDiff = (
  previousCanvas: HTMLCanvasElement,
  currentCanvas: HTMLCanvasElement,
  size: CanvasSize
): [{ current: HTMLCanvasElement }, number] => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [percentage, setPercentage] = useState(0)

  useEffect(() => {
    if (previousCanvas && currentCanvas && canvasRef.current) {
      const can = canvasRef.current
      const ctx = can.getContext('2d', { alpha: false })

      // Handle retina displays
      const dpr = window.devicePixelRatio || 1

      // Update display size, not needed for OffscreenCanvas
      can.style.height = `${size.height}px`
      can.style.width = `${size.width}px`

      // Set memory size used for drawing, scaled to account for extra pixel density
      can.height = size.height * dpr
      can.width = size.width * dpr

      // Normalize coordinate system to use css pixels.
      ctx.scale(dpr, dpr)

      const previousImageData = getImageData(previousCanvas, size)
      const currentImageData = getImageData(currentCanvas, size)
      const compareData = getImageData(can, size)

      let fullyEqual = true
      let correctPixels = 0
      // Compare and draw a diff map (yes, the loop + fillRect is not optimized at all)
      // Iterate through every pixel

      for (let i = 0; i < currentImageData.data.length; i += 4) {
        // Check if every pixel is equal
        let isEqual =
          previousImageData.data[i + 0] == currentImageData.data[i + 0] && // R value
          previousImageData.data[i + 1] == currentImageData.data[i + 1] && // G value
          previousImageData.data[i + 2] == currentImageData.data[i + 2] // B value

        // If not identical, check if we're within the margin of error
        if (!isEqual) {
          // Compare pixels
          let differentPixels =
            diff(previousImageData.data[i + 0], currentImageData.data[i + 0]) + // R value
            diff(previousImageData.data[i + 1], currentImageData.data[i + 1]) + // G value
            diff(previousImageData.data[i + 2], currentImageData.data[i + 2]) // B value

          isEqual = differentPixels <= ERROR_MARGIN
        }

        if (!isEqual) {
          fullyEqual = false
        } else {
          correctPixels++
        }

        // Render compare data as green or red pixels
        if (isEqual) {
          compareData.data[i + 0] = 0
          compareData.data[i + 1] = 0
          compareData.data[i + 2] = 0
        } else {
          compareData.data[i + 0] = similar(
            previousImageData.data[i + 0],
            currentImageData.data[i + 0]
          )
            ? 0
            : 255
          compareData.data[i + 1] = similar(
            previousImageData.data[i + 1],
            currentImageData.data[i + 1]
          )
            ? 0
            : 255
          compareData.data[i + 2] = similar(
            previousImageData.data[i + 2],
            currentImageData.data[i + 2]
          )
            ? 0
            : 255
        }

        //    compareData.data[i + 1] = isEqual ? 255 : 0;
        compareData.data[i + 3] = 255
      }

      if (!fullyEqual) {
        ctx.putImageData(compareData, 0, 0)

        setPercentage((correctPixels / (compareData.data.length / 4)) * 100)
      } else {
        setPercentage(100)
      }
    }
  }, [previousCanvas, currentCanvas, size])

  return [canvasRef, percentage]
}

const DiffPanel: React.FunctionComponent<DiffPanelProps> = props => {
  const { previous, current } = props

  const [mode, setMode] = useState<'two-up' | 'difference'>('two-up')
  const [size, setSize] = useState(128)
  const [color, setColor] = useState('#ffffff')
  // @TODO must useMemo for this
  const dimensions = { height: size, width: size }

  const [previousUri, previousParseError] = useSvgParser(previous, dimensions)
  const [currentUri, currentParseError] = useSvgParser(current, dimensions)

  //const test = useTest(previous)

  // Simplify to copy the style width, and width properties from the canvas ref itself to the other?
  // Reverse engineering natural{Height,Width} values by dividing current canvas size with device pixel ratio density
  const [previousCanvasRef] = useDraw(previousUri, dimensions, color)
  const [currentCanvasRef] = useDraw(currentUri, dimensions, color)

  const [diffCanvasRef, percentage] = useDiff(
    previousCanvasRef.current,
    currentCanvasRef.current,
    dimensions
  )

  return (
    <Wrapper>
      <Toolbar>
        mode: {mode}
        <button onClick={() => setMode('difference')}>difference</button>
        <button onClick={() => setMode('two-up')}>two-up</button>
        <label>
          canvas size:
          <input
            type="number"
            min="0"
            step="1"
            max="1024"
            value={size}
            onChange={event => setSize(parseInt(event.target.value, 10))}
          />
        </label>
        <label>
          canvas background:
          <input
            type="color"
            value={color}
            onChange={event => setColor(event.target.value)}
          />
        </label>
        <div title={percentage}>Match: {percentage.toFixed(2)}%</div>
      </Toolbar>
      <TwoUpDiff active={mode === 'two-up'}>
        <canvas ref={previousCanvasRef} />
        <canvas ref={currentCanvasRef} />
      </TwoUpDiff>
      <DifferenceDiff active={mode === 'difference'}>
        <canvas ref={diffCanvasRef} />
      </DifferenceDiff>

      {process.env.NODE_ENV !== 'production' && false && (
        <TwoUp previous={previousUri} current={currentUri} />
      )}
      <div>
        {/* @TODO Looks like the editor is able to parse and check if there are errors? */}
        <div dangerouslySetInnerHTML={{ __html: previousParseError }} />
        <div dangerouslySetInnerHTML={{ __html: currentParseError }} />
      </div>
    </Wrapper>
  )
}

export default DiffPanel
