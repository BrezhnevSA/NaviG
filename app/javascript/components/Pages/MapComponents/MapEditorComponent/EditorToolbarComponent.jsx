import React, { Component } from "react";
import { connect } from "react-redux";
import {
    FormGroup,
    Label,
    Input,
    Form,
    Button,
    ButtonGroup
} from 'reactstrap';

import {
    addObjectToMap,
    addLocationToMap,
    updateObject,
    updateLocation,
    updateFloorName,
    updateFloorBuilding,
    selectNewElement
} from '../../../../actions/FloorActions';
import {
    getBuildings 
}                         from '../../../../actions/BuildingsActions';
import { searchLocation } from '../../../../actions/SearchActions';
import { getLocationTypes } from '../../../../actions/LocationTypesActions';
import NumericInput from 'react-numeric-input';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import * as settings from '../../../../constants/AppSettings';
import LocalizedStrings from 'react-localization';
import AttributesForm from '../../../Elements/Attributes/AttributesForm';
import * as meta from '../../../../constants/MetaTypes';

let strings = new LocalizedStrings({
    en:{
        comment: "Comment",
        save: "Save",
        location: "Location",
        outer: "Outer walls",
        desks: "Desks",
        objects: "Objects",
        rooms: "Rooms",
        preview: "Preview",
        adddesks: "Add Desk",
        addroom: "Add room",
        addouterwall: "Add Outer Wall",
        addobject: "Add object",
        itemname: "Item Name",
        rotate: "Rotate",
        itemwidth: "Item Width",
        itemheight: "Item Height",
        objecttype: "Object Type",
        notselected: "Not selected",
        lefttop: "Left top",
        centertop: "Center top",
        righttop: "Right top",
        leftmiddle: "Left middle",
        centermiddle: "Center middle",
        rightmiddle: "Right midle",
        leftbottom: "Left bottom",
        centerbottom: "Center bottom",
        rightbottom: "Right bottom",
        locationtype: "Location type",
        floorname: "Floor name",
        building: "Building",
        objectsize: "Object Size",
        objectssize: "All Objects Size",
        gridstep: "Grid Step",
        backgroundscale: "Background Scale",
        selectfile: "Select file",
        filenotselected: "File not selected",
        deletebackground: "Delete background",
        imagesonly: "Images only: png/jpeg",
        nameposition: "Name Position",
        objectHeight: "Object height",
        objectWidth: "Object width"
    },
    ru: {
        comment: "Комментарий",
        save: "Сохранить",
        location: "Помещение",
        outer: "Внешние стены",
        desks: "Столы",
        objects: "Объекты",
        rooms: "Помещения",
        preview: "Предпросмотр",
        adddesks: "Добавить Стол",
        addroom: "Добавить помещение",
        addouterwall: "Добавить внешнюю стену",
        addobject: "Добавить объект",
        itemname: "Название предмета",
        rotate: "Поворот",
        itemwidth: "Ширина предмета",
        itemheight: "Высота предмета",
        objecttype: "Тип объекта",
        notselected: "Не выбран",
        lefttop: "Слева сверху",
        centertop: "По центру сверху",
        righttop: "Справа сверху",
        leftmiddle: "Слева по центру",
        centermiddle: "По центру по центру",
        rightmiddle: "Справа по центру",
        leftbottom: "Слева снизу",
        centerbottom: "По центру снизу",
        rightbottom: "Справа внизу",
        locationtype: "Тип помещения",
        floorname: "Название этажа",
        building: "Корпус",
        objectsize: "Размер объекта",
        objectssize: "Размер всех объектов",
        gridstep: "Шаг сетки",
        backgroundscale: "Масштаб фона",
        selectfile: "Выбрать файл",
        filenotselected: "Файл не выбран",
        deletebackground: "Удалить фон",
        imagesonly: "Только изображения: png/jpeg",
        nameposition: "Положение названия",
        objectHeight: "Высота объекта",
        objectWidth: "Ширина объекта"
    },
    de: {
        comment: "Kommentar",
        save: "Speichern",
        location: "Ort",
        outer: "Außenwände",
        desks: "Schreibtische",
        objects: "Objekte",
        rooms: "Räumlichkeiten",
        preview: "Vorschau",
        adddesks: "Tabelle hinzufügen",
        addroom: "Raum hinzufügen",
        addouterwall: "Außenwand hinzufügen",
        addobject: "Objekt hinzufügen",
        itemname: "Artikelname",
        rotate: "Drehen",
        itemwidth: "Artikelbreite",
        itemheight: "Artikelhöhe",
        objecttype: "Objekttyp",
        notselected: "Nicht ausgewählt",
        lefttop: "Links oben",
        centertop: "Mitte oben",
        righttop: "Rechts oben",
        leftmiddle: "Links Mitte",
        centermiddle: "Mitte Mitte",
        rightmiddle: "Rechts Mitte",
        leftbottom: "Links unten",
        centerbottom: "Mitteltaste",
        rightbottom: "Rechts unten",
        locationtype: "Standorttyp",
        floorname: "Bodenname",
        building: "Gehäuse",
        objectsize: "Objektgröße",
        objectssize: "Größe aller Objekte",
        gridstep: "Gitterschritt",
        backgroundscale: "Hintergrundskala",
        selectfile: "Datei aussuchen",
        filenotselected: "Datei nicht ausgewählt",
        deletebackground: "Hintergrund löschen",
        imagesonly: "Nur Bilder: png/jpeg",
        nameposition: "Name Position",
        objectHeight: "Objekthöhe",
        objectWidth: "Objektbreite"
    }
});

const PER_PAGE = 10;

class EditorToolbar extends Component {

    _cache = {};
    cachedQuery = { options: [], page: 1 };

    constructor(props) {
        super(props);

        const { childRef } = this.props;
        childRef(this);

        this.state = {
            angles: settings.OBJECT_ROTATION_ANGLES,
            bgscale: settings.BG_SLIDER_DEFAULT,
            objScale: settings.OBJ_DEFAULT_SCALE,
            curObjScale: settings.OBJ_DEFAULT_SCALE,
            curObjHeight: settings.OBJ_HEGIHT,
            curObjWidth: settings.OBJ_WIDTH,
            bgimg: 0,
            isLayerEnabled: [false, false, false, false, true],
            object: {},
            isLoading: false,
            options: [],
            query: '',
            selected: null,
            gridstep: settings.GRID_DEFAULT_STEP,
            current_type_details: {rotatable: false, resizable: false },            
            filename: "",
        };

        strings.setLanguage(localStorage.getItem('lang').toLowerCase());

        this.imagestore = this.imagestore.bind(this);
        this.deleteBackground = this.deleteBackground.bind(this);
        this.onObjSliderChange = this.onObjSliderChange.bind(this);
        this.handlegridStepChange = this.handlegridStepChange.bind(this);
        this.onCurrentObjSliderChange = this.onCurrentObjSliderChange.bind(this);
        this.onCurrentObjHeightChange = this.onCurrentObjHeightChange.bind(this);
        this.onCurrentObjWidthChange = this.onCurrentObjWidthChange.bind(this);
        this.onSliderChange = this.onSliderChange.bind(this);
        this._handleSelection = this._handleSelection.bind(this);
        this.handleFloorNameChange = this.handleFloorNameChange.bind(this);
        this.handleFloorBuildingChange = this.handleFloorBuildingChange.bind(this);
        this.handleObjectNameChange = this.handleObjectNameChange.bind(this);
        this.handleObjectSubTypeChange = this.handleObjectSubTypeChange.bind(this);
        this.handleLocationNameChange = this.handleLocationNameChange.bind(this);
        this.handleNamePositionChange = this.handleNamePositionChange.bind(this);
        this.handleLocationSubTypeChange = this.handleLocationSubTypeChange.bind(this);
        this.handleRotationInputChange = this.handleRotationInputChange.bind(this);
        this.handleChangeW = this.handleChangeW.bind(this);
        this.handleChangeH = this.handleChangeH.bind(this);
        
        
    }

    componentWillUnmount() {
        const { childRef } = this.props;
        childRef(undefined);
    }

    componentDidMount() {
        if (!!this.props.buildings)  {
            this.props.getBuildings();
        }
    }

    componentDidUpdate(prevProps) {
        
        if ((this.props.floor !== prevProps.floor) && !this.isOuterWallsCreated()) {
            this.onChangeLayer(0);
        }
        if (this.props.floor !== prevProps.floor) {

            let current_type_details = {rotatable: false, resizable: false };
            const current_type = this.props.object_types.filter(el => el.id == this.props.floor.selected_subtype);

            if (current_type.length > 0) {
                current_type_details = current_type[0];
            }

            let selected_location = null;
            let curObjScale = settings.OBJ_DEFAULT_SCALE;
            let curObjHeight = settings.OBJ_HEGIHT;
            let curObjWidth = settings.OBJ_WIDTH;

            if (!!this.props.floor.selected_item) {

                if (!!this.props.floor.selected_item['scale']) {
                    curObjScale = this.props.floor.selected_item['scale'];
                }

                if (!!this.props.floor.selected_item['height']) {
                    curObjHeight = this.props.floor.selected_item['height'];
                }

                if (!!this.props.floor.selected_item['width']) {
                    curObjWidth = this.props.floor.selected_item['width'];
                }

                if (!!this.props.floor.selected_item['location_id']) {
                    const current_location = this.props.floor['locations'].filter(el => el.id == this.props.floor.selected_item['location_id']);

                    if (current_location.length > 0) {
                        const location_type_name = this.props.location_types.filter(el => el.id == current_location['location_type_id']);

                        selected_location = [{name: current_location[0]['name'], item_subtype: ''}];
                    }
                }
            }

            let objScale = this.state.objScale;
            if (!!this.props.floor.floor.parameters) {
                const params = JSON.parse(this.props.floor.floor.parameters);
                if (!!params['objScale']) {
                    objScale = params['objScale'];
                }
            }

            this.setState({
                building_id: this.props.floor.floor['building_id'],
                selected_subtype: this.props.floor.selected_subtype,
                selected_type: this.props.floor.selected_type,
                current_type_details: current_type_details,
                locations_options: [],
                selected: selected_location,
                curObjScale: curObjScale,
                curObjHeight: curObjHeight,
                curObjWidth: curObjWidth,
                options: [],
                query: '',
                objScale: objScale
            });
            
        }
        if (this.props.search.locations !== prevProps.search.locations) {
            this.setState({
                isLoading: false,
                options: this.props.search.locations
            }, () => {
                this.updateLocations();
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
    }

    saveAttributes() {
        if (!!this.attributes) {
            this.attributes.saveAttributes();
        }
    }
    
    onObjSliderChange = objScale => {

        this.setState({
            objScale: objScale
        });
        this.props.onChangeObjSize(
            {'objScale': this.state.objScale}
        );
    }

    onCurrentObjSliderChange = curObjScale => {
        
        this.setState({
            curObjScale: curObjScale
        });

        let object = this.props.floor.selected_item;
        object['scale'] = curObjScale;
        this.props.updateObject(object);
    }

    onCurrentObjWidthChange(e) {
        let objWidth = e.target.value > 1 ? e.target.value : 50
        this.setState({
            curObjWidth: objWidth
        });

        let object = this.props.floor.selected_item;
        object['width'] = objWidth;
        this.props.updateObject(object);
    }

    onCurrentObjHeightChange(e) { 
        let objHeight = e.target.value > 1 ? e.target.value : 50       
        this.setState({
            curObjHeight: objHeight
        });

        let object = this.props.floor.selected_item;
        object['height'] = objHeight;
        this.props.updateObject(object);
    }

    onSliderChange = bgscale => {
        this.setState({
            bgscale: bgscale
        });
        this.props.onChangeBackground(
            {'bgoriginalsize': this.state.bgimg.width, 'bgscale': bgscale, 'url': this.state.bgimg.src, 'file': this.state.file, 'deleteBackground': false}
        );
    }

    imagestore = img => {
        this.setState({
            bgimg: img
        });
        this.props.onChangeBackground(
            {'bgoriginalsize': img.width, 'bgscale': this.state.bgscale, 'url': img.src, 'file': this.state.file, 'deleteBackground': false}
        );
    }

    deleteBackground() {
        this.setState({ bgimg: null, filename: "", deleteBackground: true });
        this.props.onChangeBackground(
            {'bgoriginalsize': 0, 'bgscale': 100, 'url': null, 'file': null, 'deleteBackground': true}
        );
    }

    handleFloorBuildingChange(e) {
        this.props.updateFloorBuilding({ building_id: e.target.value });
    }

    handleFloorNameChange(e) {
        this.props.updateFloorName({ name: e.target.value });
    }

    handlegridStepChange(e) {
        this.setState({
            gridstep: e.target.value
        });

        this.props.onChangeGridScale(
            {'gridScale': e.target.value}
        );
    }

    handleObjectNameChange(e) {
        let object = this.props.floor.selected_item;
        object['name'] = e.target.value;
        this.props.updateObject(object);
    }

    handleObjectSubTypeChange(e) {
        let object = this.props.floor.selected_item;
        object['object_type_id'] = e.target.value;

        this.setState({
            selected_subtype: e.target.value
        });

        this.props.updateObject(object);
        this.props.selectNewElement({data: { data: object, type:'location'}});
    }

    handleNamePositionChange(e) {
        let location = this.props.floor.selected_item;
        location['name_position'] = e.target.value;
        this.props.updateLocation(location);
    }

    handleLocationNameChange(e) {
        let location = this.props.floor.selected_item;
        location['name'] = e.target.value;
        this.props.updateLocation(location);
    }

    handleRotationInputChange(e) {
        let object = this.props.floor.selected_item;
        object['angle'] = e.target.value;
        this.props.updateObject(object);
    }

    handleLocationSubTypeChange(e) {
        let location = this.props.floor.selected_item;
        location['location_type_id'] = e.target.value;

        this.setState({
            selected_subtype: e.target.value
        });
        
        this.props.updateLocation(location);
        this.props.selectNewElement({data: { data: location, type:'location'}});
    }

    addElementToMap(type) {
        if (type === 'Wall') {
            this.props.addLocationToMap({location_type_id: settings.OUTER_WALLS_TYPE_ID});
        }
        if (type === 'Room') {
            this.props.addLocationToMap({location_type_id: settings.DEFAULT_ROOM_TYPE_ID});
        }
        if (type === 'Desk') {
            this.props.addObjectToMap({object_type_id: settings.DESK_OBJECT_TYPE_ID});
        }
        if (type === 'Object') {
            this.props.addObjectToMap({object_type_id: settings.DEFAULT_NONDESK_OBJECT_TYPE_ID});
        }
    }

    handleImageChange(e) {
        e.preventDefault();
        let reader = new FileReader();
        let file = e.target.files[0];
        let img = new Image();
        img.src = window.URL.createObjectURL(file);
        img.onload = () => this.imagestore(img);
        reader.readAsDataURL(file);
        this.getBase64(e.target.files[0], (result) => {
            this.setState({ 
                filename: file.name,
                file: result
            });                 
        });
    }

    getBase64(file, cb) {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            cb(reader.result)
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
    }

    triggerInputFile = () => this.fileInput.click()

    rotateDeskForward() {
        const len = this.state.angles.length;
        let new_angle;
        let angle_key = this.state.angles.indexOf(this.props.floor.selected_item['angle']);

        if (angle_key === (len - 1)) {
            new_angle = 0;
        }
        else {
            if (angle_key === -1) new_angle = 0;
            else new_angle = this.state.angles[angle_key + 1];
        }
        let object = this.props.floor.selected_item;
        object['angle'] = new_angle;
        this.props.updateObject(object);
    }

    rotateDeskBackward() {
        const len = this.state.angles.length;
        let new_angle;
        let angle_key = this.state.angles.indexOf(this.props.floor.selected_item['angle']);
        if (angle_key === 0) {
            new_angle = this.state.angles[len - 1];
        }
        else {
            if (angle_key === -1) new_angle = 0;
            else new_angle = this.state.angles[angle_key - 1];
        }
        let object = this.props.floor.selected_item;
        object['angle'] = new_angle;
        this.props.updateObject(object);
    }

    onChangeLayer = (layer) => {
        let map = [
            'outer',
            'desk',
            'object',
            'rooms',
            'preview'
        ];
        let layers = [false, false, false, false, false];
        layers[layer] = true;
        this.setState({
            isLayerEnabled: layers
        });

        this.props.onChangeLayer({'layer': map[layer]});
    }

    handleChangeW(e) {
        let object = this.props.floor.selected_item;
        object['width'] = e;
        this.props.updateObject(object);
    }

    handleChangeH(e) {
        let object = this.props.floor.selected_item;
        object['height'] = e;
        this.props.updateObject(object);
    }

    isOuterWallsCreated() {
        return !!this.props.floor['locations'].filter(v => v['location_type_id'] === settings.OUTER_WALLS_TYPE_ID)[0];
    }

    updateLocations() {
        
        const { query } = this.state;
        const options = this.cachedQuery.options.concat(this.props.search.locations);
        const page = this.cachedQuery.page;
        // this._cache[query] = { ...this.cachedQuery, options, page };

        this.setState({
            isLoading: false,
            options: options,
        });
    }

    _handleSelection(item) {

        if (!!item[0]) {
            let object = this.props.floor.selected_item;
            object['location_id'] = item[0]['id'];
            
            this.props.updateObject(object);
        }

        this.setState({
            selected: item
        });
    }

    _handleInputChange = query => {
        this.setState({ query });
    };
    
    _handlePagination = (e, shownResults) => {
        const { query } = this.state;
        // this.cachedQuery = this._cache[query];
    
        // Don't make another request if:
        // - the cached results exceed the shown results
        // - we've already fetched all possible results
        if (
            this.cachedQuery.options.length > shownResults ||
            this.cachedQuery.options.length === this.cachedQuery.total_count
        ) {
          return;
        }
    
        this.setState({ isLoading: true });
    
        const page = this.cachedQuery.page + 1;

        this.props.searchLocation(query, page)
    };
    
    _handleSearch = query => {
        // if (this._cache[query]) {
        //   this.setState({ options: this._cache[query].options });
        //   return;
        // }
    
        this.setState({ isLoading: true });

        this.props.searchLocation(query, 1)
    };

    render() {
        return (
            <>
                {!!this.props.floor.floor ? (
                    <div id="editorTools">
                        <Form>
                            
                            <FormGroup className="" id="layerSwitch">
                                <ButtonGroup>
                                    <Button color="primary"
                                        onClick={() => this.onChangeLayer(0)}
                                        disabled={this.state.isLayerEnabled[0]}>{strings.outer}</Button>
                                    <Button color="primary"
                                        onClick={() => this.onChangeLayer(1)}
                                        disabled={this.state.isLayerEnabled[1] || !this.isOuterWallsCreated()}>{strings.desks}</Button>
                                    <Button color="primary"
                                        onClick={() => this.onChangeLayer(2)}
                                        disabled={this.state.isLayerEnabled[2] || !this.isOuterWallsCreated()}>{strings.objects}</Button>
                                    <Button color="primary"
                                        onClick={() => this.onChangeLayer(3)}
                                        disabled={this.state.isLayerEnabled[3] || !this.isOuterWallsCreated()}>{strings.rooms}</Button>
                                    <Button color="primary"
                                        onClick={() => this.onChangeLayer(4)}
                                        disabled={this.state.isLayerEnabled[4] || !this.isOuterWallsCreated()}>{strings.preview}</Button>
                                </ButtonGroup>
                            </FormGroup>

                            <FormGroup className="" id="addElement">
                                { this.state.isLayerEnabled[1] ? 
                                    <div id="addDesk" className="builder-panel">
                                        <Button color="success" onClick={() => this.addElementToMap('Desk')}> 
                                            <i className="fa fa-fw fa-user-plus" style={{ fontSize: '14px' }} /> {strings.adddesks}
                                        </Button>
                                    </div>
                                : null }

                                { this.state.isLayerEnabled[3] ? 
                                    <div id="addRoom" className="builder-panel">
                                        <Button color="success" onClick={() => this.addElementToMap('Room')}>
                                            <i className="fa fa-fw fa-cubes" style={{ fontSize: '14px' }} /> {strings.addroom}
                                        </Button>
                                    </div>
                                : null }
                                
                                { (this.state.isLayerEnabled[0]) ? 
                                    <div id="addOuterWall" className="builder-panel">
                                        <Button color="success" onClick={() => this.addElementToMap('Wall')}>
                                            <i className="fa fa-fw fa-building-o" style={{ fontSize: '14px' }} /> {strings.addouterwall}
                                        </Button>
                                    </div>
                                : null }

                                { this.state.isLayerEnabled[2] ? 
                                    <div id="addObject" className="builder-panel">
                                        <Button color="success" onClick={() => this.addElementToMap('Object')}>
                                            <i className="fa fa-fw fa-print" style={{ fontSize: '14px' }} /> {strings.addobject}
                                        </Button>
                                    </div>
                                : null }
                            </FormGroup>

                            { !!this.props.floor.selected_item ? (
                            <>
                                <div className="group-wrapper">
                                    <FormGroup>
                                        { (this.props.floor.selected_type === 'object') ?
                                            <>
                                                <Label for="itemName">{strings.itemname}</Label>
                                                <Input
                                                    value={this.props.floor.selected_item['name']}
                                                    onChange={this.handleObjectNameChange}
                                                    type="text" name="itemName" id="itemName" placeholder="Item Name" />
                                                
                                                {!!this.props.floor.selected_item['id'] ? 
                                                    <AttributesForm
                                                        key={this.props.floor.selected_item['id'] + '_object'}
                                                        onRef={ref => (this.attributes = ref)}
                                                        langChange={this.langChange}
                                                        lang={this.props.lang}
                                                        type="ObjectItem"
                                                        maintype="object"
                                                        id={ this.props.floor.selected_item['id'] }
                                                        hideTitle={true}
                                                        />
                                                : <></> } 
                                            </>
                                            : 
                                            <>
                                            { (this.props.floor.selected_type === 'location') ?
                                                <>
                                                    { this.props.floor.selected_item['location_type_id'] !== settings.OUTER_WALLS_TYPE_ID ?
                                                        <Label for="itemName">{strings.itemname}</Label>
                                                        : <></> }
                                                    
                                                    { this.props.floor.selected_item['location_type_id'] !== settings.OUTER_WALLS_TYPE_ID ?
                                                        <Input
                                                            value={this.props.floor.selected_item['name']}
                                                            onChange={this.handleLocationNameChange}
                                                            type="text" name="LocationName" id="LocationName"
                                                            placeholder="Location Name" />
                                                        : <></> }
                                                    
                                                    { this.props.floor.selected_item['location_type_id'] !== settings.OUTER_WALLS_TYPE_ID ?
                                                        <div className="location-name-position">
                                                            <Label for="itemName">{strings.nameposition}</Label>
                                                            <Input
                                                                type="select"
                                                                name="name_position"
                                                                id="name_position"
                                                                className={`name_position`}
                                                                value={!!this.props.floor.selected_item['name_position'] ? this.props.floor.selected_item['name_position'] : '' }
                                                                onChange={this.handleNamePositionChange} >
                                                                
                                                                <option value='' key="none">{ strings.notselected }</option>
                                                                <option value="lefttop" key="lefttop">{ strings.lefttop }</option>
                                                                <option value="centertop" key="centertop">{ strings.centertop }</option>
                                                                <option value="righttop" key="righttop">{ strings.righttop }</option>
                                                                <option value="leftmiddle" key="leftmiddle">{ strings.leftmiddle }</option>
                                                                <option value="centermiddle" key="centermiddle">{ strings.centermiddle }</option>
                                                                <option value="rightmiddle" key="rightmiddle">{ strings.rightmiddle }</option>
                                                                <option value="leftbottom" key="leftbottom">{ strings.leftbottom }</option>
                                                                <option value="centerbottom" key="centerbottom">{ strings.centerbottom }</option>
                                                                <option value="rightbottom" key="rightbottom">{ strings.rightbottom }</option>
                
                                                            </Input>
                                                        </div>
                                                        : <></> }

                                                    {!!this.props.floor.selected_item['id'] ? 
                                                        <AttributesForm
                                                            key={this.props.floor.selected_item['id'] + '_' + meta.META_TYPE_LOCATION}
                                                            onRef={ref => (this.attributes = ref)}
                                                            langChange={this.langChange}
                                                            lang={this.props.lang}
                                                            type={meta.META_TYPE_LOCATION}
                                                            maintype={meta.META_MAINTYPE_LOCATION}
                                                            id={ this.props.floor.selected_item['id'] }
                                                            hideTitle={true}
                                                            />
                                                    : <></> }
                                                </>
                                                : <></> }
                                            </>
                                        }
                                    </FormGroup>
                                    
                                    { (this.props.floor.selected_type === 'object') &&
                                        (this.state.current_type_details['rotatable']) ? ( <>
                                        <FormGroup>
                                            <Label>{strings.rotate}</Label>
                                            <div className="rotate-button-wrapper">
                                                <Button color="primary" onClick={() => this.rotateDeskBackward()}>
                                                    <i className="fa fa-undo" style={{ fontSize: '14px' }} /> 
                                                </Button>

                                                <Button color="primary" onClick={() => this.rotateDeskForward()}>
                                                    <i className="fa fa-repeat" style={{ fontSize: '14px' }} /> 
                                                </Button>
                                            </div>
                                            <div className="rotate-input-wrapper">
                                            <Input
                                                key={'rotation_' + this.props.floor.selected_item['id']}
                                                value={this.props.floor.selected_item['angle']}
                                                onChange={this.handleRotationInputChange}
                                                type="text" name="rotationInput" id="rotationInput"
                                                placeholder="" />
                                            </div>
                                        </FormGroup>
                                        </> )
                                        :
                                        <></>
                                    }

                                    { (this.props.floor.selected_type === 'object') &&
                                        (this.state.current_type_details['resizable'])
                                        ? ( <>
                                        <FormGroup>
                                            <Label for="itemName">{strings.itemwidth}</Label>
                                            <NumericInput mobile min={5} max={300} step={5}
                                                value={this.props.floor.selected_item['width']}
                                                onChange={(e) => this.handleChangeW(e)} />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="itemName">{strings.itemheight}</Label>
                                            <NumericInput mobile min={5} max={300} step={5}
                                                value={this.props.floor.selected_item['height']}
                                                onChange={(e) => this.handleChangeH(e)} />
                                        </FormGroup>
                                        </> )
                                        :
                                        <></>
                                    }

                                    { (this.props.floor.selected_type === 'object') &&
                                        (this.props.floor.selected_subtype !== settings.DESK_OBJECT_TYPE_ID)
                                        ? ( <>
                                            <FormGroup>
                                                <Label for="itemSubtype">{strings.objecttype}</Label>

                                                <Input type="select"
                                                    name="itemSubtype"
                                                    id="itemSubtype"
                                                    value={this.state.selected_subtype}
                                                    onChange={this.handleObjectSubTypeChange} >
                                                        <option value="" key="none">- {strings.notselected} -</option>
                                                    {this.props.object_types.filter(
                                                        v => v['id'] !== settings.DESK_OBJECT_TYPE_ID
                                                        ).map((v) => <option value={v['id']} key={v['id']}>{v['name']}</option>)}
                                                </Input>
                                            </FormGroup>
                                        </> ) : <></>
                                    }

                                    { (this.props.floor.selected_type === 'object') &&
                                        (true)
                                        ? ( <>
                                        <FormGroup>
                                            <Label for="itemName">{strings.location}</Label>
                                            <div className="location-ref-wrapper">
                                                <AsyncTypeahead
                                                    {...this.state}
                                                    ref='typeahead'
                                                    selected={this.state.selected}
                                                    maxResults={PER_PAGE - 1}
                                                    minLength={2}
                                                    labelKey={option => `${option.name} ${option.item_subtype}`}
                                                    id="objectLocation"
                                                    options={this.state.options}
                                                    placeholder={ strings.location }
                                                    onInputChange={ this._handleInputChange }
                                                    onPaginate={ this._handlePagination }
                                                    onSearch={ this._handleSearch }
                                                    onChange={(selected) => this._handleSelection(selected)}
                                                    renderMenuItemChildren={option => (
                                                            <div key={option.id}>
                                                                <span>{option.name} {option.item_subtype}</span>
                                                            </div>
                                                        )}
                                                    useCache={false}
                                                />
                                            </div>
                                        </FormGroup>
                                        <FormGroup className="obj-slider">
                                            <Label className="curObjScale" for="curObjScale">{strings.objectsize}:</Label>
                                            <Slider
                                                className="d-inline-block"
                                                max={settings.OBJ_MAX_SCALE}
                                                min={settings.OBJ_MIN_SCALE}
                                                defaultValue={settings.OBJ_DEFAULT_SCALE}
                                                value={this.state.curObjScale}
                                                onChange={this.onCurrentObjSliderChange} />

                                            <p className="d-inline-block">
                                                {this.state.curObjScale}%
                                            </p>

                                        </FormGroup>
                                        <FormGroup>
                                            <Label className="curObjHeight" for="curObjHeight">{strings.objectHeight}:</Label>
                                            <Input type="number"
                                                name="itemSubtype"
                                                id="itemSubtype"
                                                min="1"
                                                step="1"
                                                value={this.state.curObjHeight}
                                                onChange={(e) => { this.onCurrentObjHeightChange(e); }}>
                                            </Input>
                                        </FormGroup>
                                        <FormGroup>
                                            <Label className="curObjWidth" for="curObjWidth">{strings.objectWidth}:</Label>
                                            <Input type="number"
                                                name="itemSubtype"
                                                id="itemSubtype"
                                                min="1"
                                                step="1"
                                                value={this.state.curObjWidth}
                                                onChange={(e) => { this.onCurrentObjWidthChange(e); }}>
                                            </Input>
                                        </FormGroup>
                                        </> )
                                        :
                                        <></>
                                    }

                                    { (this.props.floor.selected_type === 'location')
                                        ? ( <>
                                        { (this.props.floor.selected_item['location_type_id'] !== settings.OUTER_WALLS_TYPE_ID)
                                        ?
                                            <FormGroup>
                                                <Label for="itemSubtype">{strings.locationtype}</Label>
                                                <Input type="select"
                                                    name="itemSubtype"
                                                    id="itemSubtype"
                                                    value={this.state.selected_subtype}
                                                    onChange={this.handleLocationSubTypeChange} >
                                                        <option value="" key="none">- {strings.notselected} -</option>
                                                    {this.props.location_types.filter(v => v['id'] !== settings.OUTER_WALLS_TYPE_ID && v['active']).map((v) => <option value={v['id']} key={v['id']}>{v['name']}</option>)}
                                                </Input>
                                            </FormGroup>
                                        : <></> }

                                        </> ) : <></>
                                    }
                                </div>
                            </> ) : <></>
                            }
                            
                            <div className="group-wrapper">
                                <FormGroup id="floorConfigs">
                                    <FormGroup>
                                        <Label for="floorName">{strings.floorname}</Label>
                                        <Input type="text"
                                            name="floor"
                                            id="floorName"
                                            placeholder="Floor Name"
                                            value={this.props.floor.floor['name']}
                                            onChange={this.handleFloorNameChange} />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="buildingSelection">{strings.building}</Label>
                                        <Input type="select"
                                            name="buildingSelection"
                                            id="buildingSelection"
                                            value={this.state.building_id}
                                            onChange={this.handleFloorBuildingChange} >
                                                <option value="" key="none">- {strings.notselected} -</option>
                                            {this.props.buildings.map((v) => <option value={v['id']} key={v['id']}>{v['name']}</option>)}
                                        </Input>
                                    </FormGroup>
                                    <FormGroup className="objs-slider">
                                        <Label className="objScale" for="objScale">{strings.objectssize}:</Label>
                                        <Slider
                                            className="d-inline-block"
                                            max={settings.OBJ_MAX_SCALE}
                                            min={settings.OBJ_MIN_SCALE}
                                            defaultValue={settings.OBJ_DEFAULT_SCALE}
                                            value={this.state.objScale}
                                            onChange={this.onObjSliderChange} />

                                        <p className="d-inline-block">
                                            {this.state.objScale}%
                                        </p>
                                    </FormGroup>
                                    <FormGroup className="grid-step">
                                        <Label className="gridStep" for="gridStep">{strings.gridstep}:</Label>
                                        <Input type="text"
                                            name="grid"
                                            id="gridStep"
                                            placeholder="Grid Step"
                                            value={this.state.gridstep}
                                            onChange={this.handlegridStepChange} />
                                    </FormGroup>
                                </FormGroup>
                            </div>

                            <div className="group-wrapper">
                                <FormGroup className="bg-slider">
                                    <Label className="bgScale" for="bgScale">{strings.backgroundscale}:</Label>
                                    <Slider
                                        className="d-inline-block"
                                        max={500}
                                        min={0}
                                        defaultValue={settings.BG_SLIDER_DEFAULT}
                                        value={this.state.bgscale}
                                        onChange={this.onSliderChange} />

                                    <p className="d-inline-block">
                                        {this.state.bgscale}%
                                    </p>

                                    <div className="builder-panel d-inline-block">
                                        <Button 
                                            onClick={() => { this.deleteBackground(); }}                                             
                                        >{strings.deletebackground}</Button>   
                                    </div>

                                    <div id="addBg" className="builder-panel">
                                        <p>{strings.imagesonly}</p>
                                        <Button onClick={this.triggerInputFile}>{strings.selectfile}</Button>                            
                                        <input className="form-control" 
                                            type="file"
                                            accept="image/png, image/jpeg"
                                            ref={fileInput => this.fileInput = fileInput} 
                                            onChange={(e)=>this.handleImageChange(e)} 
                                            style={{ display: 'none' }}/>
                                        <Label style={{ marginLeft: '5px' }}>
                                            { 
                                                this.state.filename 
                                                    ? this.state.filename.length <= 10 
                                                        ? this.state.filename
                                                        : this.state.filename.substring(0, 9) + "..."
                                                    : strings.filenotselected 
                                            }
                                        </Label>
                                    </div>
                                </FormGroup>
                            </div>
                        </Form>
                    </div>
                ) : (
                    <></>
                )}
            </>
        );
    }

}

function mapDispatchToProps(dispatch) {
    return {
        addObjectToMap: object => dispatch(addObjectToMap(object)),
        addLocationToMap: object => dispatch(addLocationToMap(object)),
        getBuildings: () => dispatch(getBuildings()),
        updateObject: object => dispatch(updateObject(object)),
        updateLocation: object => dispatch(updateLocation(object)),
        updateFloorName: name => dispatch(updateFloorName(name)),
        updateFloorBuilding: bid => dispatch(updateFloorBuilding(bid)),
        selectNewElement: data => dispatch(selectNewElement(data)),
        searchLocation:  (query, page) => dispatch(searchLocation(query, page)),
        getLocationTypes: () => dispatch(getLocationTypes())
    };
}

const mapStateToProps = state => {
    
    return {
        object_types: state.object_types,
        location_types: state.location_types,
        floor: state.floor,
        buildings: state.buildings,
        search: state.search,
    };
};

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(EditorToolbar);