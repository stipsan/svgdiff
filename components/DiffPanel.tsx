import { styled } from 'linaria/react'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import * as parsers from '../lib/parsers'

const Wrapper = styled.section`
  display: flex;
  flex: 1;
  flex-direction: column;

  canvas {
    margin-left: auto;
    margin-right: auto;
  }
`

const Toolbar = styled.nav`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  margin-right: 25px;
  padding: 4px 8px;
`

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
    if (!svgText.trim()) {
      return
    }

    const svgDoc = parsers.documentFragment(svgText)

    // Poor mans validation
    if (!svgDoc.viewBox) {
      setError(svgDoc.innerHTML || 'Failed to parse SVG')
      return
    }

    // Browsers fail to render an SVG to canvas if width and height isn't defined
    // We have to get it from the SVG DOM
    let baseWidth
    try {
      // Asking for the width baseVal getter can throw an exception if the value is relative
      baseWidth = svgDoc.width.baseVal.value
    } catch (err) {
      // Ignore
    }
    if (!baseWidth) {
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

type TwoUpDiffProps = { active: boolean }
const TwoUpDiff = styled.div<TwoUpDiffProps>`
  display: ${props => (props.active ? 'flex' : 'none')};
  height: 100%;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
  flex: 1;
  overflow: auto;

  canvas {
    box-shadow: hsla(0, 0%, 0%, 0.1) 0 0 0 1px;
    max-width: 100%;
  }
`

type DifferenceDiffProps = { active: boolean }
const DifferenceDiff = styled.div<DifferenceDiffProps>`
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
): [{ current: HTMLCanvasElement }, boolean] => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const currentTask = useRef(null)
  const nextTask = useRef(null)
  const [ready, setReady] = useState(false)

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

      setReady(false)

      const img = new Image()
      img.onload = function() {
        if (taskId !== currentTask.current) {
          return
        }

        draw(canvasRef.current, img, size, color)

        setReady(true)
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

  return [canvasRef, ready]
}

// How much is a color channel allowed to differ and still be considered visually equal
// This is mostly here to debug
const diff = (a, b) => (a > b ? a - b : b - a)
const getImageData = (can: HTMLCanvasElement, size: CanvasSize) => {
  const ctx = can.getContext('2d', { alpha: false })
  // Handle retina displays
  const dpr = window.devicePixelRatio || 1

  return ctx.getImageData(0, 0, size.width * dpr, size.height * dpr)
}
const useDiff = (
  previousCanvas: HTMLCanvasElement,
  currentCanvas: HTMLCanvasElement,
  size: CanvasSize,
  color: string,
  threshold: number
): [{ current: HTMLCanvasElement }, number] => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [percentage, setPercentage] = useState(-1)

  const similar = useCallback(
    (a, b) => (a === b ? true : diff(a, b) <= threshold),
    [threshold]
  )

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

          isEqual = differentPixels <= threshold
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
    } else {
      setPercentage(-1)
    }
  }, [previousCanvas, currentCanvas, size, color, threshold])

  return [canvasRef, percentage]
}

const TotalDifference = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  h3 {
    color: #4a4a4a;
    display: block;
    font-size: 11px;
    letter-spacing: 1px;
    margin-bottom: 5px;
    text-transform: uppercase;
  }
  h2 {
    color: #363636;
    font-size: 2rem;
    font-weight: 600;
    line-height: 1.125;
    margin-top: 5px;
    margin-bottom: 20px;
    font-feature-settings: 'tnum';
  }
`

const DiffPanel: React.FunctionComponent<DiffPanelProps> = props => {
  const { previous, current } = props

  const [mode, setMode] = useState<'two-up' | 'difference'>('two-up')
  const [size, setSize] = useState(512)
  const [threshold, setThreshold] = useState(0)
  const [color, setColor] = useState('#ffffff')
  const dimensions = useMemo(() => ({ height: size, width: size }), [size])

  const [previousUri, previousParseError] = useSvgParser(previous, dimensions)
  const [currentUri, currentParseError] = useSvgParser(current, dimensions)

  // Simplify to copy the style width, and width properties from the canvas ref itself to the other?
  // Reverse engineering natural{Height,Width} values by dividing current canvas size with device pixel ratio density
  const [previousCanvasRef, previousReady] = useDraw(
    previousUri,
    dimensions,
    color
  )
  const [currentCanvasRef, currentReady] = useDraw(
    currentUri,
    dimensions,
    color
  )

  const [diffCanvasRef, percentage] = useDiff(
    previousReady && previousCanvasRef.current,
    currentReady && currentCanvasRef.current,
    dimensions,
    color,
    threshold
  )

  return (
    <Wrapper>
      <Toolbar>
        <div>
          mode:&nbsp;&nbsp;
          <label>
            <input
              name="mode"
              type="radio"
              checked={mode === 'two-up'}
              onChange={() => setMode('two-up')}
            />
            &nbsp;&nbsp;two-up &nbsp;&nbsp;&nbsp;
          </label>
          <label>
            <input
              name="mode"
              type="radio"
              checked={mode === 'difference'}
              onChange={() => setMode('difference')}
            />
            &nbsp;&nbsp;difference &nbsp;&nbsp;&nbsp;
          </label>
        </div>

        <label>
          canvas size:&nbsp;&nbsp;
          <input
            type="number"
            min="0"
            step="32"
            max="1024"
            value={size}
            onChange={event =>
              setSize(
                Math.max(
                  1,
                  Math.min(parseInt(event.target.value || '1', 10), 1024)
                )
              )
            }
          />
        </label>

        <label>
          canvas background:&nbsp;&nbsp;
          <input
            type="color"
            value={color}
            onChange={event => setColor(event.target.value)}
          />
        </label>
        <label title="A value of 0 means that colors must be exactly the same to be equal. While a value of 2 means #FFFFFF and #FEFEFE are equal.">
          diff threshold:&nbsp;&nbsp;
          <input
            type="number"
            min="0"
            step="1"
            max="254"
            value={threshold}
            onChange={event =>
              setThreshold(
                Math.max(
                  0,
                  Math.min(parseInt(event.target.value || '0', 10), 254)
                )
              )
            }
          />
        </label>
      </Toolbar>
      <TwoUpDiff active={mode === 'two-up'}>
        <canvas key="previous" ref={previousCanvasRef} />
        <canvas key="current" ref={currentCanvasRef} />
      </TwoUpDiff>
      <DifferenceDiff active={mode === 'difference'}>
        <canvas ref={diffCanvasRef} />
      </DifferenceDiff>

      <TotalDifference>
        <h3>Similarity</h3>
        <h2
          title={
            percentage >= 0 ? `Exact similarity: ${percentage}%` : undefined
          }
        >
          {percentage >= 0 ? `${percentage.toFixed(2)}%` : 'N/A'}
        </h2>
      </TotalDifference>
      <div>
        {/* @TODO Looks like the editor is able to parse and check if there are errors? */}
        <div dangerouslySetInnerHTML={{ __html: previousParseError }} />
        <div dangerouslySetInnerHTML={{ __html: currentParseError }} />
      </div>
    </Wrapper>
  )
}

export default DiffPanel
