import { styled } from 'linaria/react'
import React from 'react'
import Editor from './Editor'

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  padding: 20px 25px;
  width: 33%;
`

const Footer = styled.footer`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 10px;

  a {
    color: #34495e;
    font-size: 16px;
    font-weight: bold;
    text-decoration: none;

    &:not(:first-of-type) {
      margin-left: 6px;

      &::before {
        content: '•';
        margin-right: 6px;
      }
    }
  }
`

type EditorPanelProps = {
  previous: string
  current: string
  setPrevious: (payload: string) => void
  setCurrent: (payload: string) => void
}

const EditorPanel: React.FunctionComponent<EditorPanelProps> = props => {
  const { previous, current, setPrevious, setCurrent } = props

  return (
    <Wrapper>
      <Editor name="a" value={previous} setValue={setPrevious} />
      <Editor name="b" value={current} setValue={setCurrent} />
      <Footer>
        {/*<Link href="/help"><a>help</a></Link>*/}
        <a
          href="https://twitter.com/stipsan"
          target="_blank"
          rel="noopener noreferrer"
        >
          twitter
        </a>
        <a
          href="https://github.com/stipsan/svgdiff"
          target="_blank"
          rel="noopener noreferrer"
        >
          github
        </a>
        {/*<a href="@TODO" target="_blank" rel="noopener noreferrer">blogpost</a>*/}
      </Footer>
    </Wrapper>
  )
}

export default EditorPanel
