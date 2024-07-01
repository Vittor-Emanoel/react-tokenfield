import classes from './../styles.module.css'
import React, { CSSProperties, useImperativeHandle, useRef } from 'react'
import { InputRef } from '../TokenField/TokenField'
import { TokenProps, TokenState } from '../TokensReducer/TokensReducer'

export interface TokenAdditionalProps {
  index: number
  text: string
  selected: boolean
  hideRemoveButton: boolean
  renderToken?: (state: TokenState) => React.ReactNode
}

export const Token = React.forwardRef<
  InputRef,
  TokenAdditionalProps & TokenProps
>(
  (
    {
      index,
      deleteToken,
      text,
      editToken,
      focus,
      getTokenStyle,
      isValid,
      deleteSelected,
      selected,
      hideRemoveButton,
      renderToken
    },
    ref
  ): React.ReactElement => {
    const tokenRef = useRef<HTMLSpanElement>(null)

    useImperativeHandle(ref, () => ({
      focus: () => {
        if (tokenRef.current !== window.document.activeElement) {
          tokenRef.current!.focus()
        }
      },
      value: () => text,
      clear: () => {},
      position: () => ({
        top: tokenRef.current?.getBoundingClientRect().top || 0,
        left: tokenRef.current?.getBoundingClientRect().left || 0
      })
    }))

    function getCSS(): CSSProperties {
      return getTokenStyle({
        text,
        selected,
        invalid: !isValid(text),
        index
      }) as CSSProperties
    }

    function KeyDown(event: React.KeyboardEvent) {
      if (
        index > 0 &&
        (event.key === 'ArrowLeft' || (event.shiftKey && event.key === 'Tab'))
      ) {
        focus(index, 'back')
        event.preventDefault()
      } else if (
        event.key === 'ArrowRight' ||
        (!event.shiftKey && event.key === 'Tab')
      ) {
        focus(index, 'next')
        event.preventDefault()
      } else if (
        !event.metaKey &&
        (event.key.length === 1 || event.key === 'Enter')
      ) {
        editToken(index)
        event.preventDefault()
      } else if (event.key === ' ') {
        event.preventDefault()
      } else if (event.key === 'Backspace' || event.key === 'Delete') {
        deleteSelected()
        event.preventDefault()
      }
    }

    function selectItem(e: React.MouseEvent) {
      focus(index, 'self')
      e.preventDefault()
    }

    function deleteItem(e: React.MouseEvent) {
      if (e.ctrlKey || e.shiftKey) {
        return
      }
      deleteToken([index])
    }

    function editItem(e: React.MouseEvent) {
      if (e.ctrlKey || e.shiftKey) {
        return
      }
      editToken(index)
    }

    return (
      <span
        tabIndex={-1}
        onKeyDown={(e) => KeyDown(e)}
        ref={tokenRef}
        onDoubleClick={(e) => editItem(e)}
        onMouseDown={(e) => selectItem(e)}
        className={`${classes.tag} ${!isValid(text) ? classes.invalid : ''} ${
          selected ? classes.selected : ''
        }`}
        style={getCSS()}
      >
        {renderToken ? (
          renderToken({
            text: text,
            index,
            invalid: !isValid(text),
            selected
          })
        ) : (
          <span className={classes.value}>{text}</span>
        )}
        {hideRemoveButton ? (
          <span onClick={(e) => deleteItem(e)} className={classes.remove} />
        ) : null}
      </span>
    )
  }
)
