import React from 'react';

import classes from './styles.module.css'

const loader = (props) => (
    props.show ? <div className={classes.loader}>Loading...</div> : null
)

export default loader;