import useComponentSize from '@rehooks/component-size'
import htmlParser from 'prettier/parser-html'
import prettier from 'prettier/standalone'
import React, { useRef } from 'react'
import { button } from '../lib/design'
import Upload from './Upload'
import dynamic from 'next/dynamic'

// Uglyness just to work around react-ace not working in SSR, and not being able to use React.lazy for the same reason
const AceEditor = dynamic<import('react-ace/lib/ace').IAceEditorProps>(
  // @ts-ignore
  async () => {
    const AceEditor = await import('react-ace')
    await import('ace-builds/src-noconflict/mode-xml')
    await import('ace-builds/src-noconflict/theme-solarized_dark')
    return AceEditor
  },
  { ssr: false }
)

type EditorProps = {
  name: string
  value: string
  setValue: (value: string) => void
  demo: string
  commands?: any
}

const Editor: React.FunctionComponent<EditorProps> = (props) => {
  const { value, setValue, demo } = props
  const ref = useRef(null)
  const { width, height } = useComponentSize(ref)

  return (
    <div className="flex flex-col h-1/2 rounded-lg overflow-hidden mt-5 first:mt-0">
      <div className="flex items-center justify-start p-1 bg-[#01313f] text-white">
        <Upload id={`${props.name}-upload`} onUpload={setValue} />

        {value.trim() ? (
          <button
            key="prettify"
            className={button}
            onClick={() =>
              setValue(
                prettier.format(value, {
                  parser: 'html',
                  plugins: [htmlParser],
                })
              )
            }
          >
            Prettify
          </button>
        ) : (
          <button
            key="demo"
            className={button}
            onClick={() =>
              setValue(
                prettier.format(demo, { parser: 'html', plugins: [htmlParser] })
              )
            }
          >
            Demo
          </button>
        )}
      </div>
      <div className="flex-1" ref={ref}>
        <AceEditor
          mode="xml"
          theme="solarized_dark"
          name={`${props.name}-editor`}
          onChange={(value) => setValue(value)}
          fontSize={14}
          showPrintMargin={false}
          value={value}
          width={`${width}px`}
          height={`${height}px`}
          onLoad={(editor) => {
            // Remove annoying keyboard bindings
            ;['indent', 'outdent', 'gotoline', 'showSettingsMenu'].forEach(
              // @ts-ignore
              (cmd) => editor.commands.removeCommand(cmd)
            )
          }}
          style={{}}
        />
      </div>
    </div>
  )
}

export default Editor
