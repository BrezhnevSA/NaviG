import React, {useEffect} from 'react';
import LocalizedStrings from 'react-localization';
import Modal from 'react-modal';
import "./ModalConfirmAction.css";

let strings = new LocalizedStrings({
    en: {
        yesButtonText: "Yes",
        noButtonText: "Cancel"
    },
    ru: {
        yesButtonText: "Да",
        noButtonText: "Отмена"
    },
    de: {
        yesButtonText: "Ja",
        noButtonText: "Stornieren"
    }
})

const ModalConfirmAction = ({isOpen, headerText, descriptionText, onClickClose, 
                              yesButtonClick, noButtonClick, }) => {
    
    let lang = localStorage.getItem('lang').toLowerCase();

    useEffect(() => {
        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
    }, [lang]);

    const style = {
        content : {
            top                   : '30%',
            left                  : '50%',
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
        <Modal
            isOpen={isOpen}
            style={style}
            ariaHideApp={false}
        >
            <div className="modal-confirm-container">
                <div className="modal-confirm-header-container">
                    <a href="#" className="modal-confirm-close-help-modal" onClick={onClickClose}></a>
                </div>
                <div className="modal-confirm-content-container">
                        <div className="modal-confirm-content-description">
                            {headerText}
                        </div>
                        <div style={{marginLeft: "10px", paddingBottom: "5px"}}>
                            {descriptionText}
                        </div>
                        <div className="modal-confirm-button-footer">
                            <span className="modal-confirm-button-footer-cancel">
                                <button className="modal-confirm-save-button" onClick={yesButtonClick}> 
                                    {strings.yesButtonText}
                                </button>
                            </span>
                            <span className="">
                                <button className="modal-confirm-cancel-button" onClick={noButtonClick}>
                                    {strings.noButtonText}
                                </button>
                            </span>
                        </div>
                </div>
            </div>
        </Modal>
    );
}

export default ModalConfirmAction;