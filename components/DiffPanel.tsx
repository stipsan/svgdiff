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

const useBase64 = (svgText: string) => {
  const [value, setValue] = useState('')
  // @TODO rewrite this to useMemo, unless the btoa and SSR becomes an issue?
  useEffect(() => {
    setValue(`data:image/svg+xml;base64,${btoa(svgText)}`)
  }, [svgText])

  return value
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
  size: CanvasSize = { height: img.naturalHeight, width: img.naturalWidth }
) => {
  const ctx = can.getContext('2d', { alpha: false })
  const { height, width } = size
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

  // Set the background canvas to white
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, width, height)

  ctx.drawImage(img, 0, 0)
}

const useDraw = (
  datauri: string,
  size?: CanvasSize
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

        draw(canvasRef.current, img, size)
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
    }
  }, [datauri, size])

  return [canvasRef, imageRef.current]
}

const DiffPanel: React.FunctionComponent<DiffPanelProps> = props => {
  const { previous, current } = props

  const previousUri = useBase64(previous)
  const currentUri = useBase64(current)

  const [mode, setMode] = useState<'two-up' | 'difference'>('two-up')

  //const test = useTest(previous)

  // Simplify to copy the style width, and width properties from the canvas ref itself to the other?
  // Reverse engineering natural{Height,Width} values by dividing current canvas size with device pixel ratio density
  const [previousCanvasRef, previousImageInstance] = useDraw(previousUri)
  const [currentCanvasRef] = useDraw(
    currentUri,
    previousCanvasRef.current
      ? {
          height: previousCanvasRef.current.height / window.devicePixelRatio,
          width: previousCanvasRef.current.width / window.devicePixelRatio
        }
      : undefined
  )

  return (
    <Wrapper>
      <div>
        {mode}
        set mode <button onClick={() => setMode('difference')} />
        set mode <button onClick={() => setMode('two-up')} />
      </div>
      <div>
        <canvas ref={previousCanvasRef} />
        <canvas ref={currentCanvasRef} />
      </div>
      {mode === 'two-up' && (
        <TwoUp previous={previousUri} current={currentUri} />
      )}
    </Wrapper>
  )
}

export default DiffPanel
