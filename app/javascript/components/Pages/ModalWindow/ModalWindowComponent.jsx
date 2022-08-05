import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';

import './ModalWindow.css';


class ModalWindow extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            modalIsOpen: false
        };    
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.modalIsOpen) {
            this.openHelperModal();
        } else {
            this.closeHelperModal();
        }
    }

    openHelperModal() {
        this.setState({modalIsOpen: true});
    }

    closeHelperModal() {
        this.setState({modalIsOpen: false});
    }

    render() {
        const { header, body, className, top, left } = this.props;

        const customStyles = {
            content : {
                top                   : `${top ? top : '50%'}`,
                left                  : `${left ? left : '50%'}`,
                right                 : 'auto',
                bottom                : 'auto',
                marginRight           : '-50%',
                transform             : 'translate(-50%, -50%)',
                minWidth              : "10%",
                minHeight             : "15vh",
                background            : "transparent",
                border                : "none"
            }
        };

        return (
            <>
                <Modal
                    isOpen={this.state.modalIsOpen}
                    style={customStyles}
                    ariaHideApp={false}
                >
                    <div className={`modal-content ${!!className ? className.split(' ').map(c => c + ' ') : ''}`}>
                        {header}
                        {body}
                    </div>
                </Modal>
            </>
        );
    }
}

export default ModalWindow;