import React, { Component } from 'react';
import { Button } from 'reactstrap';
import { HotKeys } from "react-hotkeys";
import { connect } from "react-redux";
import EditorToolbar from './EditorToolbarComponent'
import ObjectItem from '../Elements/ObjectComponent'
import LocationItem from '../Elements/LocationComponent'
import ModalWindow from '../../ModalWindow/ModalWindowComponent';
import { toast } from 'react-toastify';
import {
    updateObject,
    updateLocation,
    selectNewElement,
    getFloorDetails,
    initFloorDetails,
    updateFloorDetails,
    removeFloorDetails,
    removeLocation,
    removeObject,
    resetFloorState,
    addObjectToMap,
    lockFloor
 } from '../../../../actions/FloorActions';
import {
    saveToHistory,
    afterSetFromHistory,
    saveToBuffer,
    clearBuffer
 } from '../../../../actions/MapEditorBufferActions';

import { getLocationTypes } from '../../../../actions/LocationTypesActions';
import { getObjectTypes } from '../../../../actions/ObjectTypesActions';
import LocalizedStrings from 'react-localization';
import * as settings from '../../../../constants/AppSettings';

let strings = new LocalizedStrings({
    en:{
        helper_save: "Save",
        helper_remove: "Remove",
        helper_cancel_selection: "Cancel selection",
        helper_set_locations_for_objects: "Set locations for objects",
        helper_set_names: "Set names",
        helper_set_grid: "Place by grid",
        helper_fix_angles: "Straight angles",
        blocked: "Blocked by ",
        header: "Delete element",
        description: "The element will be deleted permanently.",
        yes: "Yes",
        no: "No",
        changessaved: "Changes Saved!"
    },
    ru: {
        helper_save: "Сохранить",
        helper_remove: "Удалить",
        helper_cancel_selection: "Отменить выделение",
        helper_set_locations_for_objects: "Связать объекты с помещениями",
        helper_set_names: "Задать имена объектов",
        helper_set_grid: "Выровнять по сетке",
        helper_fix_angles: "Выпрямить углы",
        blocked: "Заблокировано пользователем ",
        header: "Удалить элемент",
        description: "Элемент будет удален навсегда.",
        yes: "Да",
        no: "Нет",
        changessaved: "Изменения сохранены!"
    },
    de: {
        helper_save: "Sparen",
        helper_remove: "Entfernen",
        helper_cancel_selection: "Auswahl abbrechen",
        helper_set_locations_for_objects: "Standorte für Objekte festlegen",
        helper_set_names: "Namen setzen",
        helper_set_grid: "Set on Grid",
        helper_fix_angles: "Gerade Winkel",
        blocked: "Blockiert von ",
        header: "Element mit Namen löschen",
        description: "Das Element wird dauerhaft gelöscht.",
        yes: "Ja",
        no: "Nein",
        changessaved: "Änderungen gespeichert!"
    }
});


class MapEditor extends Component {

    notify = () => {
        toast.success(strings.chagessaved, {
          position: toast.POSITION.TOP_RIGHT
        });
    }

    constructor(props) {
        super(props);

        this.state = {
            bgurl: '',
            bgscale: settings.BG_SLIDER_DEFAULT,
            bgoriginalsize: 0,
            active_layer: null,

            objScale: settings.OBJ_DEFAULT_SCALE,

            dragging_id: null,
            dragging_type: null,

            moving_dot_id: null,
            moving_dot_location_id: null,

            current_floor_id: this.props.match.params.id,

            start_moving_location_x: 0,
            start_moving_location_y: 0,

            gridScale: settings.GRID_DEFAULT_STEP,

            lockingTime: new Date(),

            triggerModal: false
        };

        this.onChangeBackground = this.onChangeBackground.bind(this);
        this.onChangeLayer = this.onChangeLayer.bind(this);
        this.onChangeObjSize = this.onChangeObjSize.bind(this);
        this.onChangeGridScale = this.onChangeGridScale.bind(this);
        this.onRemoveElementClick = this.onRemoveElementClick.bind(this);
        this.straighteningAngles = this.straighteningAngles.bind(this);
        this.setObjectsAlignment = this.setObjectsAlignment.bind(this);
        this.onSaveState = this.onSaveState.bind(this);
        this.onCancelAction = this.onCancelAction.bind(this);
        this.moveByArrow = this.moveByArrow.bind(this);

        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
    }

    componentWillReceiveProps(nextProps) {
        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
    }

    componentDidMount() {
        if (!!this.state.current_floor_id) {
            this.props.getFloorDetails(this.state.current_floor_id);
        }
        else {
            this.props.initFloorDetails();
        }

        this.props.lockFloor(this.state.current_floor_id);

        this.props.getObjectTypes();

        this.props.getLocationTypes();
    }

    componentDidUpdate(prevProps) {
        if (this.props.floor !== prevProps.floor) {

            const now = new Date();

            if (((now - this.state.lockingTime) / (60 * 1000)) >= 1) {
                this.props.lockFloor(this.props.floor['floor']['id']);
                this.setState({lockingTime: new Date()});
            }

            let clear_floor_after = this.props.floor;
            delete clear_floor_after.history;
            let clear_floor_before = prevProps.floor;
            delete clear_floor_before.history;

            if ((JSON.stringify(clear_floor_after) !== JSON.stringify(clear_floor_before)) && !!this.props.floor['floor']['id']) {
                this.onSaveState();
            }
            
            let objScale = this.state.objScale;
            let bgscale = this.state.bgscale;
            let bgurl = this.state.bgurl;
            let bgoriginalsize = this.state.bgoriginalsize;
            if (!!this.props.floor.floor.parameters) {
                const params = JSON.parse(this.props.floor.floor.parameters);
                if (!!params['objScale']) {
                    objScale = params['objScale'];
                }
                if (!!params['bgscale']) {
                    bgscale = params['bgscale'];
                }
                if (!!params['bgurl']) {
                    bgurl = params['bgurl'];
                }
                if (!!params['bgoriginalsize']) {
                    bgoriginalsize = params['bgoriginalsize'];
                }
            }

            this.setState({
                objScale: objScale,
                bgscale: bgscale,
                bgurl: bgurl,
                bgoriginalsize: bgoriginalsize,
                triggerModal: false
            });
        }
    }

    onChangeBackground(background) {

        this.setState({
            bgurl : background['url'],
            bgoriginalsize : background['bgoriginalsize'],
            bgscale : background['bgscale'],
            file: background['file'],
            deleteBackground: background['deleteBackground']
        });
    }

    onChangeObjSize(data) {
        this.setState({
            objScale : data['objScale']
        });
    }

    onChangeGridScale(data) {
        this.setState({
            gridScale : data['gridScale']
        });
    }

    onChangeLayer(layer) {
        this.setState({
            active_layer: layer['layer']
        });

        this.clearSelection();
    }

    undragElement(e) {
        this.setState({
            dragging_id: null,
            dragging_type: null,
            start_moving_location_x: 0,
            start_moving_location_y: 0
        });
    }
    
    dragElement(e) {

        const type = e.target.getAttribute('entity-type');
        let editorArea = document.querySelector('#editorAreaWrapper');
        let viewportOffset = editorArea.getBoundingClientRect();

        if (type === 'object') {
            const id = e.target.getAttribute('itemID');
            
            this.setState({
                dragging_id: id,
                dragging_type: type,
                active_location_id: null,
            });
            
        }
        if ((type === 'location') || (type === 'root-area')) {

            if (this.state.moving_dot_id !== null) {

                const key = this.props.locations.findIndex(o => o.id == this.state.moving_dot_location_id);
                let location = this.props.locations[key];

                const position_x = e.clientX - viewportOffset.left + editorArea.scrollLeft;
                const position_y = e.clientY - viewportOffset.top + editorArea.scrollTop;

                if (!Array.isArray(location.dots) && !!location.dots) {
                    let dots_array = location.dots;
                    // nil sometimes get here, have no idea why
                    dots_array = dots_array.replaceAll('nil,','');
                    dots_array = dots_array.replaceAll(', nil','');
                    dots_array = dots_array.replaceAll('nil','');
                    dots_array = dots_array.split("=>").join(":")
                    
                    location.dots = JSON.parse(dots_array);
                }

                location.dots[this.state.moving_dot_id] = {x: position_x, y: position_y};
                this.props.updateLocation(location);

                this.setState({
                    moving_dot_id: null,
                    moving_dot_location_id: null,
                });

                let dots = document.getElementsByClassName("moving");
                
                for (let value of dots) {
                    value.classList.remove('moving');
                }

            }
            else {

                const id = e.target.getAttribute('itemID');

                this.setState({
                    dragging_id: id,
                    dragging_type: type,
                    start_moving_location_x: e.clientX,
                    start_moving_location_y: e.clientY
                });
            }
            
        }
        if (type === 'location-dot') {

            const dot_id = e.target.getAttribute('dot-id');
            const location_id = e.target.getAttribute('itemID');

            if (this.state.moving_dot_id !== null) {
                const key = this.props.locations.findIndex(o => o.id == this.state.moving_dot_location_id);
                let location = this.props.locations[key];

                if (!Array.isArray(location.dots) && !!location.dots) {
                    let dots_array = location.dots;
                    // nil sometimes get here, have no idea why
                    dots_array = dots_array.replaceAll('nil,','');
                    dots_array = dots_array.replaceAll(', nil','');
                    dots_array = dots_array.replaceAll('nil','');
                    dots_array = dots_array.split("=>").join(":")
                    
                    location.dots = JSON.parse(dots_array);
                }

                location.dots[this.state.moving_dot_id] = JSON.parse(JSON.stringify(location.dots[dot_id]));

                this.props.updateLocation(location);

                this.setState({
                    moving_dot_id: null,
                    moving_dot_location_id: null,
                });
                
                let dots = document.getElementsByClassName("moving");
                
                for (let value of dots) {
                    value.classList.remove('moving');
                }

            }
            else {
                this.setState({
                    moving_dot_id: dot_id,
                    moving_dot_location_id: location_id,
                });

                e.target.classList.add('moving');

            }
        }
    }

    areaDoubleClick(e) {
        const type = e.target.getAttribute('entity-type');
        
        if (((type === 'location') || (type === 'root-area')) && (this.props.floor.selected_type == 'location')) {
            
            let editorArea = document.querySelector('#editorAreaWrapper');
            let viewportOffset = editorArea.getBoundingClientRect();
            const location_id = this.props.floor.selected_item['id'];

            const key = this.props.locations.findIndex(o => o.id == location_id);
            let location = this.props.locations[key];

            const position_x = e.clientX - viewportOffset.left + editorArea.scrollLeft;
            const position_y = e.clientY - viewportOffset.top + editorArea.scrollTop;

            if (!Array.isArray(location.dots) && !!location.dots) {
                let dots_array = location.dots;
                // nil sometimes get here, have no idea why
                dots_array = dots_array.replaceAll('nil,','');
                dots_array = dots_array.replaceAll(', nil','');
                dots_array = dots_array.replaceAll('nil','');
                dots_array = dots_array.split("=>").join(":")
                
                location.dots = JSON.parse(dots_array);
            }
            
            location.dots.push({x: position_x, y: position_y});

            this.props.updateLocation(location);

        }

        if (type === 'location-dot') {

            let editorArea = document.querySelector('#editorAreaWrapper');
            let viewportOffset = editorArea.getBoundingClientRect();
            const location_id = e.target.getAttribute('itemID');

            const key = this.props.locations.findIndex(o => o.id == location_id);
            let location = this.props.locations[key];

            const dot_index = e.target.getAttribute('dot-id');
            
            delete location.dots[dot_index];
            this.props.updateLocation(location);

        }
    }

    getMinMaxDots(dots) {

        let dots_array = dots;

        if (!Array.isArray(dots_array) && !!dots_array) {

            // nil sometimes get here, have no idea why
            dots_array = dots_array.replaceAll('nil,','');
            dots_array = dots_array.replaceAll(', nil','');
            dots_array = dots_array.replaceAll('nil','');
            dots_array = dots_array.split("=>").join(":")
            
            dots_array = JSON.parse(dots_array);
        }

        const firstItem = dots_array.filter(d => typeof d != 'undefined').shift();
        
        if (!!firstItem) {
            const min_x = dots_array.reduce((min, p) => p.x < min ? p.x : min, firstItem['x']);
            const max_x = dots_array.reduce((max, p) => p.x > max ? p.x : max, firstItem['x']);

            const min_y = dots_array.reduce((min, p) => p.y < min ? p.y : min, firstItem['y']);
            const max_y = dots_array.reduce((max, p) => p.y > max ? p.y : max, firstItem['y']);

            return {min_x: min_x, max_x: max_x, min_y: min_y, max_y: max_y};
        }

        return {min_x: 0, max_x: 0, min_y: 0, max_y: 0};
    }

    parse_nubmer(str) {
        let numb = str.match(/\d/g);
        numb = numb.join("");
        return numb;
    }

    dragMouseMove(e) {
        
        if (this.state.dragging_type === 'object') {
            const id = this.state.dragging_id;
            if (id == null) return ;
            let editorArea = document.querySelector('#editorAreaWrapper');
            let viewportOffset = editorArea.getBoundingClientRect();
            const key = this.props.object_items.findIndex(o => o.id == id);
            let object = this.props.object_items[key];

            const position_x = e.clientX - viewportOffset.left - (object['width']/2) + editorArea.scrollLeft;
            const position_y = e.clientY - viewportOffset.top - (object['height']/2) + editorArea.scrollTop;
            
            object['left'] = position_x;
            object['top'] = position_y;

            this.props.updateObject(object);
        }

        if (this.state.dragging_type === 'location') {
            const id = this.state.dragging_id;
            if (id == null) return ;
            let editorArea = document.querySelector('#editorAreaWrapper');

            const moving_x = e.clientX - this.state.start_moving_location_x;
            const moving_y = e.clientY - this.state.start_moving_location_y;

            const key = this.props.locations.findIndex(o => o.id == id);
            let location = this.props.locations[key];

            this.setState({
                start_moving_location_x: e.clientX,
                start_moving_location_y: e.clientY
            });

            if (!Array.isArray(location['dots']) && !!location['dots']) {
                location['dots'] = location['dots'].replaceAll('nil,','');
                location['dots'] = location['dots'].replaceAll(', nil','');
                location['dots'] = location['dots'].replaceAll('nil','');
                location['dots'] = location['dots'].split("=>").join(":")
                location['dots'] = JSON.parse(location['dots']);
            }

            location['dots'].forEach(function(data, index) {
                this[index]['x'] += moving_x;
                this[index]['y'] += moving_y;
            }, location['dots']);

            this.props.updateLocation(location);
        }
    }

    onSaveFloorClick() {
        const data = {
            floor: this.props.floor.floor,
            object_items: this.props.object_items,
            locations: this.props.locations,
            new_parameters: { 
                objScale: this.state.objScale,
                bgscale : this.state.bgscale,
                bgoriginalsize: this.state.bgoriginalsize
            },
            delete_bg: this.state.deleteBackground == undefined ? false : this.state.deleteBackground
        }
        if (!!this.toolbar) {
            this.toolbar.saveAttributes();
        }
        this.props.updateFloorDetails(data, this.state.file);

    }

    clearSelection() {
        if (!!this.props.floor.selected_item) {
            this.props.selectNewElement({data: { type: null, data: { id: -1 } } });
        }
    }

    onRemoveElementClick() {

        if (this.props.floor.selected_type === 'object') {
            this.props.removeObject({ id: this.props.floor.selected_item['id'] });
        }

        if (this.props.floor.selected_type === 'location') {
            this.props.removeLocation({ id: this.props.floor.selected_item['id'] });
        }
        
    }

    straighteningAngles() {
        let selected_location = this.props.floor.selected_item;

        selected_location['dots'].forEach(function (dot, i) {

            if (!!selected_location['dots'][i + 1]) {
                const current_dot = dot;
                const next_dot = selected_location['dots'][i + 1];
            }
            
        });

    }

    nextChar(c) {
        let u = c.toUpperCase();
        if (this.same(u,'Z')) {
            let txt = '';
            let i = u.length;
            while (i--) {
                txt += 'A';
            }
            return (txt+'A');
        } else {
            let p = "";
            let q = "";
            if (u.length > 1) {
                p = u.substring(0, u.length - 1);
                q = String.fromCharCode(p.slice(-1).charCodeAt(0));
            }
            let l = u.slice(-1).charCodeAt(0);
            let z = this.nextLetter(l);
            if (z === 'A') {
                return p.slice(0,-1) + this.nextLetter(q.slice(-1).charCodeAt(0)) + z;
            } else {
                return p + z;
            }
        }
    }
    
    nextLetter(l) {
        if (l < 90) {
            return String.fromCharCode(l + 1);
        }
        else {
            return 'A';
        }
    }
    
    same (str, char) {
        let i = str.length;
        while (i--) {
            if (str[i] !== char){
                return false;
            }
        }
        return true;
    }

    setObjectsNames() {
        const floor_id = this.props.floor.floor['id'];
        const building_id = this.props.floor.floor['building_id'];
        const office_id = this.props.buildings.find(b => b.id === parseInt(building_id))['office_id'];
        const city_id = this.props.offices.find(o => o.id === parseInt(office_id))['city_id'];
        
        const citiy_L = this.props.cities.find(c => c.id === parseInt(city_id))['short_name'];
        const office_L = this.props.offices.find(o => o.id === parseInt(office_id))['short_name'];
        let building_L = this.props.buildings.find(b => b.id === parseInt(building_id));
        let floor_L = this.props.floors.find(f => f.id === parseInt(floor_id));
        building_L = !!!building_L['short_name'] ? building_L['name'].charAt(0) : building_L['short_name'];
        floor_L = !!!floor_L['short_name'] ? floor_L['name'].charAt(0) : floor_L['short_name'];

        let desks = this.props.object_items
            .filter(item => item['object_type_id'] === settings.DESK_OBJECT_TYPE_ID).sort((a, b) => {
                if (Math.abs(a['top'] - b['top']) < 5) {
                    return a['left'] - b['left'];
                }
                else {
                    return a['top'] - b['top'];
                }
            });
        let not_desks = this.props.object_items
            .filter(item => item['object_type_id'] !== settings.DESK_OBJECT_TYPE_ID).sort((a, b) => {
                if (Math.abs(a['top'] - b['top']) < 5) {
                    return a['left'] - b['left'];
                }
                else {
                    return a['top'] - b['top'];
                }
            });

        let letter = 'Z'

        desks.map(item => {
            let data = item;
            letter = this.nextChar(letter);
            if (data['name'].length < 6) {
                desks.map(d => {
                    let letter_occupied = desks.find(d => d['name'].length >= 7 && d['name'].substring(0,5) == (citiy_L + office_L + building_L + floor_L) && d['name'].substring(5,7) == letter) !== undefined;                
                    if (letter_occupied) {
                        letter = this.nextChar(letter)
                    }
                })
                data['name'] = citiy_L + office_L + building_L + floor_L + letter;
            }
            this.props.updateObject(data);
        })

        let i = 0;

        not_desks.map(item => {
            let data = item;
            data['name'] = citiy_L + office_L + building_L + floor_L + ("0" + i).slice(-2)
            this.props.updateObject(data);
            i++;
        })
    }

    connectObjectsWithLocations() {
        
        let object_items = this.props.object_items;
        let locations = this.props.locations;

        locations.forEach((location, i) => {
            if (location['location_type_id'] !== settings.OUTER_WALLS_TYPE_ID && !!location['name'] && location['name'] != "") {

                const borders = this.getMinMaxDots(location['dots']);

                const objects_here = object_items.filter(item => (
                        (item.top > borders['min_y']) && (item.top < borders['max_y'])
                            && (item.left > borders['min_x']) && (item.left < borders['max_x'])
                    )
                )

                objects_here.map(item => {
                    let data = item;
                    data['location_id'] = location['id'];
                    this.props.updateObject(data);
                })

            }

        });

    }

    setObjectsAlignment() {
        
        let desks = this.props.object_items.map((item) => {
            let buf = item;
            buf['left'] = Math.round(buf['left'] / this.state.gridScale) * this.state.gridScale;
            buf['top'] = Math.round(buf['top'] / this.state.gridScale) * this.state.gridScale;

            this.props.updateObject(buf);
        });

    }

    onSaveState() {
        let state_to_save = this.props.floor;
        delete state_to_save.history;
        
        this.props.saveToHistory(JSON.stringify(state_to_save));
    }

    onCancelAction() {

        if (!!this.props.buffer.history[0]) {
            const prev_floor_state = this.props.buffer.history[0];
            this.props.resetFloorState(JSON.parse(JSON.parse(prev_floor_state)));
            this.props.afterSetFromHistory();
        }
        
    }

    moveByArrow(step) {
        if (this.props.floor.selected_type === 'object') {
            const id = this.props.floor.selected_item['id'];

            const key = this.props.object_items.findIndex(o => o.id == id);
            let object = this.props.object_items[key];

            if (step['axe'] == 'x') {
                object['left'] += step['dir'] * this.state.gridScale;
            }
            else {
                object['top'] += step['dir'] * this.state.gridScale;
            }

            this.props.updateObject(object);
        }

        if (this.props.floor.selected_type === 'location') {
            let location = JSON.parse(JSON.stringify(this.props.floor.locations.find(o => o.id === parseInt(this.props.floor.selected_item['id']))));

            if (step['axe'] == 'x') {
                location['dots'].forEach((data, index) => {
                    location['dots'][index]['x'] += step['dir'] * this.state.gridScale;
                }, location['dots']);
            }
            else {
                location['dots'].forEach((data, index) => {
                    location['dots'][index]['y'] += step['dir'] * this.state.gridScale;
                }, location['dots']);
            }

            this.props.updateLocation(location);
        }
    }

    copySelectedObject() {
        this.props.saveToBuffer(this.props.floor.selected_item);
    }

    pasteCopiedObjet() {
        const new_object = this.props.buffer.buffer;
        this.props.addObjectToMap({object_type_id: new_object.object_type_id});
        this.props.clearBuffer();
    }

    render() {
        const { triggerModal } = this.state;
        let objScale = this.state.objScale;

        const keyMap = {
            DELETE_ELEMENT: ["del", "backspace"],
            CANCEL_ACTION: ["ctrl+z", "ctrl+я"],
            MOVE_TOP: "up",
            MOVE_BOTTOM: "down",
            MOVE_LEFT: "left",
            MOVE_RIGHT: "right",
            COPY_OBJECT: ["ctrl+c", "ctrl+с"],
            PASTE_OBJECT: ["ctrl+v", "ctrl+м"]
        };

        const handlers = {
            DELETE_ELEMENT: () => this.onRemoveElementClick(),
            CANCEL_ACTION: () => this.onCancelAction(),
            MOVE_TOP: () => this.moveByArrow({axe: 'y', dir: -1}),
            MOVE_BOTTOM: () => this.moveByArrow({axe: 'y', dir: 1}),
            MOVE_LEFT: () => this.moveByArrow({axe: 'x', dir: -1}),
            MOVE_RIGHT: () => this.moveByArrow({axe: 'x', dir: 1}),
            COPY_OBJECT: () => this.copySelectedObject(),
            PASTE_OBJECT: () => this.pasteCopiedObjet()
        };

        let floor_locked = false;
        let blocking_user = '';
        if (!!this.props.floor.locked) {
            if (!!this.props.floor.locked['status']) {
                if (this.props.floor.locked['status'] === 'BLOCKED_BY_OTHER') {
                    blocking_user = this.props.floor.locked['block']['e_name'] + ' ' + this.props.floor.locked['block']['e_surname'];
                    floor_locked = true;
                }
            }
        }

        return (
            <>
                <div id="editorWrapper">
                    <HotKeys keyMap={keyMap}><HotKeys handlers={handlers} >

                    { floor_locked ?
                        <div id="editorBlocked">
                            <div className="blocked-bg"></div>
                            <div className="blocked-warning">
                                { strings.blocked }
                                <p className="blocker-name">
                                    { blocking_user }
                                </p>
                            </div>
                        </div>
                    : <></> }

                    <div id="actionsArea" className="container-fluid">
                        
                        <div className="row">
                            <div id="sideActions" className="col-12">
        
                                <Button color="success" onClick={() => this.onSaveFloorClick()} title={strings.helper_save} >
                                    <i className="fa fa-fw fa-floppy-o" style={{ fontSize: '14px' }} />
                                </Button>

                                <Button color="danger" onClick={() => this.setState({ triggerModal: true})} title={strings.helper_remove} >
                                    <i className="fa fa-fw fa-trash-o" style={{ fontSize: '14px' }} />
                                </Button>

                                <Button color="primary" onClick={() => this.clearSelection()} title={strings.helper_cancel_selection} >
                                    <i className="fa fa-fw fa-object-group" style={{ fontSize: '14px' }} />
                                </Button>

                                <Button color="primary" onClick={() => this.connectObjectsWithLocations()} title={strings.helper_set_locations_for_objects} >
                                    <i className="fa fa-fw fa-pied-piper-alt" style={{ fontSize: '14px' }} />
                                </Button>

                                <Button color="primary" onClick={() => this.setObjectsNames()} title={strings.helper_set_names} >
                                    <i className="fa fa-fw fa-text-height" style={{ fontSize: '14px' }} />
                                </Button>

                                <Button color="primary" onClick={() => this.setObjectsAlignment()} title={strings.helper_set_grid} >
                                    <i className="fa fa-fw fa-th-large" style={{ fontSize: '14px' }} />
                                </Button>

                                { this.props.floor.selected_type === 'location' ? 
                                    <Button color="primary" onClick={() => this.straighteningAngles()} title={strings.helper_fix_angles} >
                                        <i className="fa fa-fw fa-square-o" style={{ fontSize: '14px' }} />
                                    </Button>
                                : <></> }

                                <ModalWindow 
                                    modalIsOpen={triggerModal}
                                    header={
                                        <div className="modal-header-1">
                                            <div className="close-modal" >
                                                <img className="close-link" src="/img/pics/cross_black.svg" onClick={() => this.setState({ triggerModal: false})}></img>
                                            </div>
                                            <h2>{strings.header}?</h2>
                                        </div>
                                    }
                                    body={
                                        <div className="modal-body-1">
                                            <p>{strings.description}</p>
                                            <div className="modal-buttons">
                                                <Button 
                                                    className="button-magenta button_usual btn_small"
                                                    onClick={() => { this.onRemoveElementClick(); this.setState({ triggerModal: false})}}
                                                >{strings.yes}</Button>
                                                <Button 
                                                    className="button_usual button_decline btn_small btn_right"
                                                    onClick={() => { this.setState({ triggerModal: false})}}
                                                >{strings.no}</Button>
                                            </div>
                                        </div>
                                    }
                                />
                            </div>
                            <div id="tabsActions" className="col-12">
                                <EditorToolbar {...this.props} lang={this.props.lang}
                                    childRef={ref => (this.toolbar = ref)}
                                    onChangeBackground={this.onChangeBackground}
                                    onChangeLayer={this.onChangeLayer}
                                    onChangeObjSize={this.onChangeObjSize}
                                    onChangeGridScale={this.onChangeGridScale}
                                />
                            </div>
                            
                        </div>
                        
                    </div>
                    
                    <div id="editorAreaWrapper">

                        <div id="editorArea"
                            onMouseUp={(e) => this.undragElement(e)}
                            onMouseDown={(e) => this.dragElement(e)}
                            onMouseMove={(e) => this.dragMouseMove(e)}
                            onDoubleClick={(e) => this.areaDoubleClick(e)}
                            >
                            <div id="editorBG">
                                <img alt="" src={this.state.bgurl} width={(this.state.bgoriginalsize * this.state.bgscale) / 100} />
                            </div>

                            <div id="grid-layer" className="layer"></div>
                            
                            <div id="walls-layer" 
                                className={(this.state.active_layer === 'outer' ? 'enabled-layer' : 'disabled-layer') + " layer"}>
                                {!!this.props.locations? (
                                    <>
                                        <svg
                                            entity-type="root-area"
                                            width={settings.EDITOR_SVG_SIZE_X}
                                            height={settings.EDITOR_SVG_SIZE_Y}
                                            >
                                            {this.props.locations.map((data, index) => {
                                                if (data['location_type_id'] === settings.OUTER_WALLS_TYPE_ID) {
                                                    return <LocationItem
                                                            editor={ true }
                                                            zoom={ 100 }
                                                            key={ index }
                                                            data={ data } />
                                                }
                                            })}
                                        </svg>
                                    </>
                                ) : (
                                    <></>
                                )}
                                
                            </div>
                            
                            <div id="rooms-layer"
                                className={(this.state.active_layer === 'rooms' ? 'enabled-layer' : 'disabled-layer') + " layer"}>
                                {!!this.props.locations? (
                                    <>
                                        <svg
                                            entity-type="root-area"
                                            width={settings.EDITOR_SVG_SIZE_X}
                                            height={settings.EDITOR_SVG_SIZE_Y}
                                            >
                                            {this.props.locations.map((data, index) => {
                                                    if (data['location_type_id'] !== settings.OUTER_WALLS_TYPE_ID) {
                                                        return <LocationItem
                                                                editor={ true }
                                                                key={ index }
                                                                data={ data } />
                                                    }
                                                })}
                                        </svg>
                                    </>
                                ) : (
                                    <></>
                                )}
                            </div>

                            <div id="desks-layer"
                                className={(this.state.active_layer === 'desk' ? 'enabled-layer' : 'disabled-layer') + " layer"}>
                                {!!this.props.object_items? (
                                    <>
                                        {this.props.object_items.map((data, index) => {
                                            
                                            if (data.object_type_id === settings.DESK_OBJECT_TYPE_ID) {
                                                
                                                return <ObjectItem
                                                        editor={ true }
                                                        key={ index }
                                                        objScale={ objScale }
                                                        data={ data } />
                                            }
                                        })}
                                    </>
                                ) : (
                                    <></>
                                )}
                                    
                            </div>

                            <div id="objects-layer"
                                className={(this.state.active_layer === 'object' ? 'enabled-layer' : 'disabled-layer') + " layer"}>
                                {!!this.props.object_items? (
                                    <>
                                        {this.props.object_items.map((data, index) => {
                                            
                                            if (data.object_type_id !== settings.DESK_OBJECT_TYPE_ID) {
                                                
                                                return <ObjectItem
                                                        editor={ true }
                                                        key={ index }
                                                        objScale={ objScale }
                                                        data={ data } />
                                            }
                                        })}
                                    </>
                                ) : (
                                    <></>
                                )}
                            </div>

                            <div id="preview-layer" className="layer">

                            </div>

                            <div id="location-names-layer"
                                className="location-names layer">
                                { !!this.props.floor.locations && this.props.floor.locations.length > 0 ? 
                                    <>
                                        {this.props.floor.locations.map((data, index) => {

                                            const corners = this.getMinMaxDots(data['dots']);
                                            let show = false;
                                            if (this.props.floor.show_location_names) {
                                                show = true;
                                            }

                                            return <>{ !!data['name'] ?
                                                <div className="location-name"
                                                    key={`${data['id']}`}
                                                    style={{
                                                        zIndex: 15,
                                                        display: show ? 'block' : 'none',
                                                        position: 'absolute',
                                                        left: (corners['max_x'] + corners['min_x'])/2 - data['name'].length * 3 - 10,
                                                        top: (corners['max_y'] + corners['min_y'])/2 - 20
                                                        }}>
                                                        { data['name'] }
                                                </div>
                                            : <></> }</>
                                        })}
                                    </>
                                : null }
                                
                            </div>
                        </div>
                    </div>
                    </HotKeys></HotKeys>
                </div>
            </>
        );
    }
}

const mapStateToProps = state => {
    
    return {
        object_items:   state.floor.object_items,
        locations:      state.floor.locations,
        floor:          state.floor,
        uesr:           state.user,
        location_types: state.location_types,
        object_types:   state.object_types,
        offices:        state.offices,
        cities:         state.cities,
        buildings:      state.buildings,
        floors:         state.floors,
        buffer:         state.buffer
    };
};

function mapDispatchToProps(dispatch) {
    return {
        getOffices:         () => dispatch(getOffices()),
        getLocationTypes:   () => dispatch(getLocationTypes()),
        getObjectTypes:     () => dispatch(getObjectTypes()),
        initFloorDetails:   () => dispatch(initFloorDetails()),
        updateObject:       object => dispatch(updateObject(object)),
        updateLocation:     object => dispatch(updateLocation(object)),
        selectNewElement:   object => dispatch(selectNewElement(object)),
        getFloorDetails:    id => dispatch(getFloorDetails(id)),
        addObjectToMap:     object => dispatch(addObjectToMap(object)),
        updateFloorDetails: (data, file) => dispatch(updateFloorDetails(data, file)),
        removeFloorDetails: id => dispatch(removeFloorDetails(id)),
        removeLocation:     location_id => dispatch(removeLocation(location_id)),
        removeObject:       object_id => dispatch(removeObject(object_id)),
        resetFloorState:    (data) => dispatch(resetFloorState(data)),
        saveToHistory:      (data) => dispatch(saveToHistory(data)),
        afterSetFromHistory:() => dispatch(afterSetFromHistory()),
        saveToBuffer:       (data) => dispatch(saveToBuffer(data)),
        clearBuffer:        () => dispatch(clearBuffer()),
        lockFloor:          (id) => dispatch(lockFloor(id))
    };
}

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(MapEditor);
