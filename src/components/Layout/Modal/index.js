import React from 'react';

import classes from './styles.module.css';
import Backdrop from '../Backdrop';
import Loader from '../Loader';

const modal = (props) => (
    <>
        <Backdrop show={props.show} clicked={!props.Loading ? props.closeModal : null} />
        <div
            className={classes.Modal}
            style={{
                transform: props.show ? 'translateY(0)' : 'translateY(-100vh)',
                opacity: props.show ? '1' : '0',
                background: props.Loading ? 'rgba(0, 0, 0, 0)' : '',
                border: props.Loading ? 'none' : '',
                boxShadow: props.Loading ? 'none' : '',
                transition: props.Loading ? 'none' : ''
            }}>
            {!props.Loading ? <button className={classes.CloseButton} onClick={props.closeModal}>&times;</button> : null}        
            {props.Loading ? <Loader show /> : <p>{props.Message}</p>}
        </div>
    </>
);

export default modal;
