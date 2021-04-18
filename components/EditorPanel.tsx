import React from 'react'
import { alternativeSvg, defaultSvg } from '../data'
import Editor from './Editor'

type EditorPanelProps = {
  previous: string
  current: string
  setPrevious: (payload: string) => void
  setCurrent: (payload: string) => void
}

const EditorPanel: React.FunctionComponent<EditorPanelProps> = (props) => {
  const { previous, current, setPrevious, setCurrent } = props

  return (
    <section className="flex flex-col px-5 py-4 w-1/3">
      <Editor
        name="a"
        value={previous}
        setValue={setPrevious}
        demo={defaultSvg}
      />
      <Editor
        name="b"
        value={current}
        setValue={setCurrent}
        demo={alternativeSvg}
      />
      <footer className="flex items-center justify-center pt-2 text-gray-600 text-sm font-bold">
        {/*<Link href="/help"><a>help</a></Link>*/}
        <a
          className="mr-1.5 focus:underline focus:outline-none"
          href="https://twitter.com/stipsan"
          target="_blank"
          rel="noopener noreferrer"
        >
          twitter
        </a>
        •
        <a
          className="ml-1.5 focus:underline focus:outline-none"
          href="https://github.com/stipsan/svgdiff"
          target="_blank"
          rel="noopener noreferrer"
        >
          github
        </a>
        {/*<a href="@TODO" target="_blank" rel="noopener noreferrer">blogpost</a>*/}
      </footer>
    </section>
  )
}

export default EditorPanel
