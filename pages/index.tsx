import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

///*
import DiffPanel from '../components/DiffPanel'
import EditorPanel from '../components/EditorPanel'
// */
/*
const DiffPanel = dynamic(() => import('../components/DiffPanel'), {
  ssr: false,
})
const EditorPanel = dynamic(() => import('../components/EditorPanel'), {
  ssr: false,
})
// */

export default function IndexPage() {
  const [previous, setPrevious] = useState('')
  const [current, setCurrent] = useState('')

  return (
    // @TODO show a warning instead of forcing the min width
    <div className="flex h-screen min-w-[990px]">
      <EditorPanel
        previous={previous}
        current={current}
        setPrevious={setPrevious}
        setCurrent={setCurrent}
      />
      <DiffPanel previous={previous} current={current} />
    </div>
  )
}
