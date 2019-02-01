// Shared design elements
import { css } from 'linaria'

export const button = css`
  background-clip: padding-box;
  background-color: hsla(0, 0%, 100%, 0.2);
  border-radius: 4px;
  border: 2px solid transparent;
  color: #fff;
  padding: 0.5em 0.75em;
  text-align: center;
  white-space: nowrap;
  user-select: none;
  appearance: none;

  &:hover {
    background-color: hsla(0, 0%, 100%, 0.25);
  }

  &:active {
    background-color: hsla(0, 0%, 100%, 0.3);
  }

  &:focus {
    outline: none;
  }

  &:focus:not(:active) {
    box-shadow: #ffffff42 0 0 0 2px;
  }
`
