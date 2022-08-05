import React, { Component } from 'react';

import {
    Label
}                   from 'reactstrap';
import AvatarEditor from 'react-avatar-editor';
import { toast }  from 'react-toastify';

import LocalizedStrings from 'react-localization';

let strings = new LocalizedStrings({
    en:{     
        uploadImage: "Choose image",
        save: "Save",
        costcenters: "Costcenters",
        yes: "Yes",
        no: "No"
    },
    ru: {      
        uploadImage: "Выбрать фото",
        save: "Сохранить",
        costcenters: "МВЗ",    
        yes: "Да",
        no: "Нет"
    },
    de: {    
        uploadImage: "Foto auswählen",
        save: "Speichern",
        costcenters: "Kostenstellen",
        yes: "Ja",
        no: "Nein"
    }
});

class ImageProvider extends Component {

    notify = () => {
        toast.success("Changes Saved!", {
          position: toast.POSITION.TOP_RIGHT
        });
    }

    constructor(props) {
        super(props);

        this.state= {
            filename: "",
            file:     null,
            scale:    1,
        }

        this.imagestore = this.imagestore.bind(this);

        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
    }

    componentDidMount() {
        this.fileInput = "";
    }

    componentWillReceiveProps(nextProps) {
        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
    }

    triggerInputFile = () => this.fileInput.click()

    _handleImageChange(e) {
        e.preventDefault();
        let reader = new FileReader();
        let file = e.target.files[0];
        let img = new Image();
        img.src = window.URL.createObjectURL(file);
        img.onload = () => this.imagestore(img);
        reader.readAsDataURL(file);
        this.setState({ 
            filename: file.name
        });
    }

    imagestore = img => {
        this.setState({
            file: img.src
        });
    }

    onClickSave = () => {
        let canvasScaled;
        if (this.editor) {
            // This returns a HTMLCanvasElement, it can be made into a data URL or a blob,
            // drawn on another canvas, or added to the DOM.
            const canvas = this.editor.getImage().toDataURL();
            // If you want the image resized to the canvas size (also a HTMLCanvasElement)
            canvasScaled = this.editor.getImageScaledToCanvas().toDataURL();
            this.setState({ canvas: canvasScaled });            
        }
        this.setState({
            file:     null,
            filename: ""
        });
        this.fileInput = "";
        this.props.updatePicture({ id: this.props.id, image: canvasScaled });
    }

    handleScale(e) {
        const scale = parseFloat(e.target.value)
        this.setState({ scale })
    }

    setEditorRef = (editor) => this.editor = editor

    render() {
        let { 
            img_url, 
            have_rights 
        }            = this.props;
        let { file } = this.state;
        return (
            <>
                <div className="center">
                    <img 
                        className="userpic  mx-auto d-block img-profile" 
                        src={`${img_url}?${Math.random().toString()}`} 
                        alt="..." 
                    />
                </div>
                { have_rights ? 
                    (
                        <></>
                    ) : (<></>)
                } 
                { have_rights && file ? (
                    <div className="center">
                        <AvatarEditor
                            ref={this.setEditorRef}
                            scale={parseFloat(this.state.scale)}
                            image={file}
                            width={200}
                            height={250}
                            border={5}
                            color={[155, 155, 155, 0.6]} // RGBA
                            rotate={0}
                        />
                        <Label for="scale">Zoom:</Label>
                        <input
                            id="scale"
                            name="scale"
                            type="range"
                            onChange={(e) => {this.handleScale(e);}}
                            min={this.state.allowZoomOut ? '0.1' : '1'}
                            max="2"
                            step="0.01"
                            defaultValue="1"
                        />
                    </div>
                ) : (<></>)
                } 
            </>
        );
    }

}

export default ImageProvider;