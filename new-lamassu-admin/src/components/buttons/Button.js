import { makeStyles } from '@material-ui/core/styles'
import classnames from 'classnames'
import React, { memo } from 'react'

import styles from './Button.styles'

const useStyles = makeStyles(styles)

const ActionButton = memo(
  ({ size = 'lg', children, className, buttonClassName, ...props }) => {
    const classes = useStyles({ size })
    return (
      <div className={classnames(className, classes.wrapper)}>
        <button
          className={classnames(buttonClassName, classes.button)}
          {...props}>
          {children}
        </button>
      </div>
    )
  }
)

export default ActionButton
