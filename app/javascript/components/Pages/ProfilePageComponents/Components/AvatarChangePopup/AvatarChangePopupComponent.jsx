import React, { useEffect, useRef, useState } from 'react';
import LocalizedStrings from 'react-localization';
import { getProfile, updateProfile } from '../../../../../actions/ProfileActions';
import { toast } from 'react-toastify';
import {connect} from 'react-redux';
import {FormGroup, Col, Label} from 'reactstrap';
import AvatarEditor from 'react-avatar-editor';
import "./AvatarChangePopup.css";
import Modal from 'react-modal';

let strings = new LocalizedStrings({
    en: {
        filenotselected: "File not selected",
        selectfile: "Select file",
        save: "Save",
        photoLoadHeader: "Load photo",
        photoLoadDescriptionFileFormat: "You can upload photo in JPG, GIF or PNG format. Maximum file size is 2 MB.",
        cancel: "Choose another photo",
        changesSuccesfulySaved: "Photo successfully saved!"
    },
    ru: {
        filenotselected: "Файл не выбран",
        selectfile: "Выбрать файл",
        save: "Сохранить",
        photoLoadHeader: "Загрузка фотографии",
        photoLoadDescriptionFileFormat: "Вы можете загрузить изображение в формате JPG, GIF или PNG. Максимальный размер 2 МБ.",
        cancel: "Выбрать другое фото",
        changesSuccesfulySaved: "Фото профиля успешно изменено!"
    },
    de: {
        filenotselected: "Datei nicht ausgewählt",
        selectfile: "Datei aussuchen",
        save: "Speichern",
        photoLoadHeader: "Foto laden",
        photoLoadDescriptionFileFormat: "Sie können Fotos im JPG-, GIF- oder PNG-Format hochladen. Die maximale Dateigröße beträgt 2 MB",
        cancel: "Wählen Sie ein anderes Foto",
        changesSuccesfulySaved: "Foto erfolgreich gespeichert!"
    }

});

const AvatarChangePopup = ({isOpen, customStyle, handleClose, profile, updateProfile, updateHOC, triggerUpdateInProgressState}) => {

    const MAX_FILENAME_LENGTH = 17;

    let lang = localStorage.getItem('lang').toLowerCase();

    useEffect(() => {
        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
    }, [lang]);

    const [file, setFile] = useState(!profile.isFetching ? profile.item.photo : null);
    const [filename, setFilename] = useState("");
    const [scale, setScale] = useState(1);

    const fileInputRef = useRef(null);
    const editorRef = useRef(null);

    const notify = () => {
        toast.success(strings.changesSuccesfulySaved, {
            position: toast.POSITION.TOP_RIGHT
        });
    };

    const imagestore = (img) => {
        setFile(img.src)
    };

    const handleImageChange = (e) => {
        e.preventDefault();
        let reader = new FileReader();
        let file = e.target.files[0];
        let img = new Image();
        img.src = window.URL.createObjectURL(file);
        img.onload = () => imagestore(img);
        reader.readAsDataURL(file);
        
        setFilename(file.name);
    };

    const handleScale = (e) => {
        setScale(parseFloat(e.target.value));
    };

    const onClickSave = () => {
        let canvasScaled;

        if (editorRef) {
            // This returns a HTMLCanvasElement, it can be made into a data URL or a blob,
            // drawn on another canvas, or added to the DOM.
            if (filename) {
                const canvas = editorRef.current.getImage().toDataURL();
                // If you want the image resized to the canvas size (also a HTMLCanvasElement)
                canvasScaled = editorRef.current.getImageScaledToCanvas().toDataURL();
                
            }          
        }
        
        triggerUpdateInProgressState(true);
        setFilename("");
        setFile(null);
        fileInputRef.current.value = null;
        setScale(1);
        updateProfile(profile.item, canvasScaled).then(response => {
            notify();
            updateHOC();
            handleClose();
        })
           
    };

    const onClickClose = () => {
        setFilename("");
        setFile(null);
        fileInputRef.current.value = null;
        setScale(1);
        handleClose();
    };

    const triggerInputFile = () => fileInputRef.current.click();

    const style = {
        content : {
            top                   : '40%',
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

    if (customStyle) {
        style = customStyle;
    }

    return (
        <Modal
            isOpen={isOpen}
            style={style}
            ariaHideApp={false}
        >
            <div className="avatar-change-popup-modal-container" style={{width: !file ? "350px" : "640px"}}>
                <div className="avatar-change-popup-header-container">
                    <a href="#" className="avatar-change-popup-modal-close-help-modal" onClick={onClickClose}></a>
                </div>
                <div className="avatar-change-popup-modal-content-container">
                    <div className="avatar-change-popup-modal-content-description">
                        {strings.photoLoadHeader}
                    </div>
                    <div style={{marginLeft: !file ? "30px" : "50px", paddingBottom: "25px"}}>
                        {strings.photoLoadDescriptionFileFormat}
                    </div>
                    <div className="avatar-change-popup-modal-content-upload-button">
                        {!file && <button className="avatar-change-popup-modal-choose-file-button" 
                                        onClick={triggerInputFile}> {strings.selectfile} 
                                </button>}                            
                            <input className="form-control" 
                                type="file"
                                ref={fileInputRef} 
                                onChange={(e) => handleImageChange(e)} 
                                style={{ display: 'none' }}/>
                                <div className="avatar-change-popup-modal-content-filename-label">
                                    {!!file && <Label style={{ textAlign: "left" }}>
                                        { 
                                            filename 
                                                ? filename.length <= MAX_FILENAME_LENGTH
                                                    ? filename
                                                    : filename.substring(0, 16) + "..."
                                                : strings.filenotselected 
                                        }
                                    </Label>}
                                </div>
                    </div>
                    <div className="avatar-change-popup-modal-content-edit">
                        {file &&
                            <div>
                                <FormGroup row>
                                    <AvatarEditor
                                        ref={editorRef}
                                        scale={parseFloat(scale)}
                                        image={file}
                                        width={200}
                                        height={300}
                                        border={25}
                                        color={[155, 155, 155, 0.6]} // RGBA
                                        rotate={0}
                                    />
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="scale" sm={0}>Zoom</Label>
                                    <Col sm={5} className="range-col" style={{paddingLeft: "10px"}}> 
                                        <input
                                            id="scale"
                                            className="range-input avatar-change-popup-modal-range-input"
                                            name="scale"
                                            type="range"
                                            onChange={(e) => {handleScale(e);}}
                                            min='1'
                                            max="2"
                                            step="0.01"
                                            defaultValue="1"
                                        />
                                </Col> 
                                </FormGroup>
                            </div>
                        }
                    </div>
                    {file && <div className="avatar-change-popup-modal-button-footer">
                        <span className="avatar-change-popup-modal-button-footer-cancel">
                            <button className="avatar-change-popup-modal-cancel-button" 
                                onClick={triggerInputFile}> {strings.cancel}
                            </button>
                        </span>
                        <span className="avatar-change-popup-modal-button-footer-save">
                            <button className="avatar-change-popup-modal-save-button" onClick={onClickSave}>
                                { strings.save }
                            </button>
                        </span>
                    </div>}
                </div>
            </div>
        </Modal>
    );

};

function mapDispatchToProps(dispatch) {
    return {
        updateProfile: (profile, image) => dispatch(updateProfile(profile, image))
    }
};

export default connect(null, mapDispatchToProps, null, {pure: false})(AvatarChangePopup);