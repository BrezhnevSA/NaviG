import React, { Component } from 'react';
import LocalizedStrings from 'react-localization';
import { connect } from "react-redux";
import { Input, Button, Label } from 'reactstrap';
import { getAttributes, updateAttributes } from '../../../actions/AttributesActions';
import { getPageOfContracts } from '../../../actions/ContractActions';
import Lightbox from 'react-image-lightbox';
import { getFloors } from '../../../actions/FloorsActions';
import { toast }  from 'react-toastify';
import * as settings from '../../../constants/AppSettings';
import AsyncSearcher from '../AsyncSearcher';
import { 
    searchEmployees, 
    searchEmployeeById
 } from '../../../actions/SearchActions';

import './AttributesStyles.css';

let strings = new LocalizedStrings({
    en:{
        metaattrs:       "Attributes",
        inventory:       "Inventory numbers",
        floors:          "Floors",
        selectfile:      "Select file",
        filenotselected: "File not selected",
        openpanorama:    "View"
    },
    ru: {
        metaattrs:       "Атрибуты",
        inventory:       "Инвентарные номера",
        floors:          "Этажи",
        selectfile:      "Выбрать файл",
        filenotselected: "Файл не выбран",
        openpanorama:    "Открыть"
    },
    de: {
        metaattrs:       "Attributes",
        inventory:       "Inventarnummern",
        floors:          "Fußböden",
        selectfile:      "Datei aussuchen",
        filenotselected: "Datei nicht ausgewählt",
        openpanorama:    "Anzeigen"
    }
});

class AttributesForm extends Component {

    constructor(props) {
        super(props)

        this.state = {
            type: props.type,
            maintype: props.maintype,
            id: props.id,
            attributes: [],
            isLightboxOpen: false,            
            filename: "",
            focusID: null,
            prevID: null,
            bufferedValue: null,
            selectedEmployee: []
        }

        strings.setLanguage(localStorage.getItem('lang').toLowerCase());

        this.handleAttrChange = this.handleAttrChange.bind(this);
        this.searchEmployees_ = this.searchEmployees_.bind(this);
        this.handleSelectionEmployee = this.handleSelectionEmployee.bind(this);

    }

    componentDidMount() {
        // get attributes for entity type and id
        if (Number.isInteger(this.state.id)) {
            this.props.getAttributes(this.state.maintype, this.state.id, this.props.multi);
        }
        this.props.onRef(this);
        this.props.getFloors();
        this.props.getPageOfContracts(0, 0, [], '', '');
    }

    componentDidUpdate(prevProps) {
        if(this.props.search.employeeById !== prevProps.search.employeeById) {
            this.setState({ selectedEmployee: [this.props.search.employeeById] })
        }
        if (this.props.attributes !== prevProps.attributes) {
            let attributes = [];
            this.props.attributes.forEach(element => {
                if ((element['entityid'] == this.state.id) && (element['entitytype'] == this.state.type)) {
                    // handle checkbox default value
                    if ((element['metatype'] === 'checkbox') && (!!!element['metavalue'])) {
                        element['metavalue'] = 'off';
                    }
                    if (element['metatype'] === 'text' && element['metafieldid'] == settings.EMPLOYEE_SD_ID && 
                        !!element['metavalue']) {
                        this.props.searchEmployeeById(parseInt(element['metavalue']));
                    }
                    attributes.push(element)
                }
            });

            this.setState({
                attributes: attributes,
                isLightboxOpen: false,            
                filename: "",
                selectedEmployee: []
            })
        }
        if(this.state.focusID && this.state.prevID) {
            this[`${this.state.prevID}_ref`].value = this.state.bufferedValue;
            this[`${this.state.focusID}_ref`].focus();
            this.setState({ 
                focusID: null, 
                prevID: null,
                attributes: this.props.attributes.map(a => {
                    if (a.id == this.state.prevID) { a.metavalue = this.state.bufferedValue; }
                    return a;
                }) 
            })
        } else if (!!!this.state.focusID && this.state.prevID) {
            this[`${this.state.prevID}_ref`].value = this.state.bufferedValue;
            this.setState({ 
                focusID: null, 
                prevID: null,
                attributes: this.props.attributes.map(a => {
                    if (a.id == this.state.prevID) { a.metavalue = this.state.bufferedValue; }
                    return a;
                }) 
            })
        }

        if (this.props.id !== prevProps.id) {
            this.setState({
                id:       this.props.id,
                maintype: this.props.maintype,
                attributes: [],
                isLightboxOpen: false,            
                filename: "",
                focusID: null,
                prevID: null,
                bufferedValue: null,
                selectedEmployee: null
            }, () => {
                this.props.getAttributes(this.state.maintype, this.state.id, this.props.multi);
                this.props.onRef(this);
                this.props.getFloors();
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
    }

    notify = () => {
        toast.success("Changes Saved!", {
          position: toast.POSITION.TOP_RIGHT
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

    // set attr value
    handleAttrChange(e) {
        const map_id = e.target.getAttribute('metaId');
        const index = this.state.attributes.findIndex(el => el.id == map_id);

        if (index === -1) {
            // handle error
            console.log('Error: Meta value gone!')
        }
        else { // set value for different meta types
            let value = null;
            
            if (this.state.attributes[index]['metatype'] === 'text' || 
                this.state.attributes[index]['metatype'] === 'reference' ||
                this.state.attributes[index]['metatype'] === 'square') {
                value = e.target.value
                this.prepareState(index, value)
            }

            if (this.state.attributes[index]['metatype'] === 'checkbox') {
                value = e.target.value

                if (this.state.attributes[index]['metavalue'] === 'on') {
                    value = 'off';
                }
                else {
                    value = 'on';
                }
                this.prepareState(index, value)
            }

            if (this.state.attributes[index]['metatype'] === 'panorama' || this.state.attributes[index]['metatype'] === 'image') {
                this.setState({ 
                    filename: e.target.files[0].name
                });
                this.getBase64(e.target.files[0], (result) => {
                    this.prepareState(index, result);                    
                });
            }

            if (this.state.attributes[index]['metatype'] === 'floor_reference') {
                value = e.target.value
                this.prepareState(index, value)
            }
        }
    }

    prepareState(index, value) {
        this.setState({
            attributes: [
                ...this.state.attributes.slice(0, index),
                Object.assign({}, this.state.attributes[index], { metavalue: value }),
                ...this.state.attributes.slice(index + 1)
            ]
        });
    }

    saveAttributes() {
        if (Number.isInteger(this.state.id)) {
            this.props.updateAttributes(this.state.maintype, this.state.id, this.state.attributes);
        }
    }

    searchEmployees_(query, page) {
        this.props.searchEmployees(query, page);
    }

    handleSelectionEmployee(item, object_id) {
        const index = this.state.attributes.findIndex(el => el.id == object_id);
        if (index === -1) {
            // handle error
            console.log('Error: Meta value gone!')
        }
        else { // set value for different meta types
            if (this.state.attributes[index]['metatype'] === 'text' && item[0] !== undefined) {
                this.prepareState(index, item[0].id)
                this.setState({ selectedEmployee: item})
            }

            if (this.state.attributes[index]['metatype'] === 'floor_reference') {
                this.prepareState(index, item[0].id)
            }
        }
    }

    render() {
        const { attributes, isLightboxOpen, selectedEmployee } = this.state;
        const { wideview, floors, hideDSReady, inventoryForm, inventorySidebar, floor, contracts, search } = this.props;
        return (
            <div className="attributes attributes-form">
                { (attributes.length > 0) && !!this.props.id ?
                    <>
                        { !!!this.props.hideTitle ?
                            <h3 id="page-title">{ floor.inventory_mode ? strings.inventory : strings.metaattrs }</h3>
                        : <></> }
                        { attributes.map((data, index) => {                       
                            return settings.DS_READY_ID == data.metafieldid && hideDSReady || 
                                   (floor.inventory_mode && data.metafieldid != settings.DESKNUM_ID && data.metafieldid != settings.TYMBNUM_ID &&
                                    data.metafieldid != settings.DOCSTATION_ID && data.metafieldid != settings.MONITOR1_ID &&
                                    data.metafieldid != settings.MONITOR2_ID
                                   )
                            ? <></>
                            : <div key={ index } className="field field_edit">
                                <label className={`attr-label ${inventoryForm || inventorySidebar ? 'attr-inventory' : ''}`}>
                                    { data.metaname }
                                </label>
                                <div 
                                    className={`
                                        attr-value ${wideview ? 'wideview' : ''} 
                                        ${inventoryForm ? 'inventory-state' : ''}
                                        ${inventorySidebar ? 'inventory-sidebar-state' : ''}
                                    `}
                                >

                                    {/* loop on fields types */}

                                    { (data.metatype == 'text' || data.metatype == 'reference' || data.metatype == 'square') && 
                                       data.metafieldid !== settings.CONTRACT_ID && data.metafieldid !== settings.EMPLOYEE_SD_ID &&
                                       data.metafieldid !== settings.COMPANY_ID ?
                                        <>
                                            <input type="text"
                                                className={`
                                                    ${inventoryForm ? 'form-control inventory-input' : ''}
                                                    ${data.metafieldid == settings.DOCSTATION_ID && inventorySidebar ? 'docstation-input' : ''}
                                                    ${data.metafieldid == settings.TYMBNUM_ID && inventorySidebar ? 'tymbnum-input' : ''}
                                                    ${data.metafieldid == settings.DESKNUM_ID && inventorySidebar ? 'desknum-input' : ''}
                                                    ${data.metafieldid == settings.MONITOR1_ID && inventorySidebar ? 'monitor1-input' : ''}
                                                    ${data.metafieldid == settings.MONITOR2_ID && inventorySidebar ? 'monitor2-input' : ''}
                                                `}
                                                name={ data.metaname }
                                                id={ data.metaname }
                                                ref={(el) => { this[`${data.id}_ref`] = el; }}
                                                value={ data.metavalue }
                                                metaid={ data.id }
                                                onPaste={ (e) => {                
                                                    e.preventDefault()                          
                                                    if ((index + 1) < attributes.length) {
                                                        this.setState({
                                                            focusID: attributes[index + 1].id,
                                                            prevID: data.id,
                                                            bufferedValue: e.clipboardData.getData('Text')
                                                        })
                                                    } else if ((index + 1) == attributes.length) {
                                                        this.setState({
                                                            focusID: null,
                                                            prevID: data.id,
                                                            bufferedValue: e.clipboardData.getData('Text')
                                                        })
                                                    }
                                                }}
                                                onChange={ (e) => { this.handleAttrChange(e) } } />
                                        </> : <></>
                                    }

                                    { data.metafieldid == settings.EMPLOYEE_SD_ID ?
                                        <AsyncSearcher
                                            {...this.state}
                                            id={ data.metaname }
                                            metaid={ data.id }
                                            name={ data.metaname }
                                            ref={(el) => { this[`${data.id}_ref`] = el; }}
                                            object_id={ data.id }
                                            objects={search.employees}
                                            searchObjects={this.searchEmployees_}
                                            handleSelection={this.handleSelectionEmployee}
                                            selected={selectedEmployee}
                                            optionsRender={option => (
                                                <div key={option.id} tabindex="0" className="rbt-token rbt-token-removeable">
                                                    {option.name} {option.surname} ({option.login})
                                                </div>
                                            )}
                                            labelKey={option => `${option.name} ${option.surname} (${option.login})`}
                                            textTranslation={{
                                                searching:        strings.searchingEmployyes,
                                                noresults:        strings.noresults,
                                                placeholder_name: strings.placeholder_name_e
                                            }}     
                                            multiple={false}                                           
                                        />  
                                        : <></>
                                    }

                                    { data.metafieldid == settings.CONTRACT_ID ?
                                        <Input
                                            type="select"
                                            name={ data.metaname }
                                            id={ data.metaname }
                                            metaid={ data.id }
                                            value={ data.metavalue }
                                            onChange={ (e) => { this.handleAttrChange(e) } } >
                                                <option key={0} value="none"> --- </option>
                                                { !!contracts && !!contracts.items ?
                                                    contracts.items.map((data, index) => {
                                                        return <option key={index + 1} value={data.id}>
                                                            { data.name }
                                                        </option>
                                                    })
                                                : <></> }
                                        </Input>
                                        : <></>
                                    }

                                    { data.metafieldid == settings.COMPANY_ID ?
                                        <Input
                                            type="select"
                                            name={ data.metaname }
                                            id={ data.metaname }
                                            metaid={ data.id }
                                            value={ data.metavalue }
                                            onChange={ (e) => { this.handleAttrChange(e) } } >
                                                <option key={0} value=""> --- </option>
                                                { settings.COMPANIES.length > 0 ?
                                                    settings.COMPANIES.map((data, index) => {
                                                        return <option key={index + 1} value={data}>
                                                            { data }
                                                        </option>
                                                    })
                                                : <></> }
                                        </Input>
                                        : <></>
                                    }

                                    { (data.metatype == 'checkbox') ?
                                        <>
                                            <Input type="checkbox"
                                                name={ data.metaname }
                                                id={ data.metaname }
                                                checked={ (data.metavalue === 'on') ? true : false }
                                                metaid={ data.id }
                                                onChange={ (e) => { this.handleAttrChange(e) } } />
                                        </> : <></>
                                    }

                                    { (data.metatype == 'panorama') ?
                                        <>
                                            <a className="openPanorama">
                                                <Button
                                                    onClick={() => this.setState({ isLightboxOpen: true })}
                                                    style={{ marginBottom: '15px' }}
                                                >
                                                    <span>{ strings.openpanorama }</span>
                                                </Button>
                                            </a>
                                            {isLightboxOpen && (
                                                <Lightbox
                                                    mainSrc={!!!data.metavalue ? "/img/no_photo.jpg" : data.metavalue}
                                                    onCloseRequest={() => this.setState({ isLightboxOpen: false })}
                                                />
                                            )}
                                            <Button style={{marginLeft: "5px"}} onClick={this.triggerInputFile} id={ data.metaname } metaid={ data.id } name={ data.metaname }>{strings.selectfile}</Button>                            
                                            <input className="form-control" 
                                                type="file"
                                                ref={fileInput => this.fileInput = fileInput} 
                                                onChange={(e) => { this.handleAttrChange(e) }} 
                                                metaid={ data.id }
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
                                        </> : <></>
                                    }

                                    { (data.metatype == 'floor_reference') ?
                                        <>
                                            <Input
                                                type="select"
                                                name={ data.metaname }
                                                id={ data.metaname }
                                                metaid={ data.id }
                                                value={ data.metavalue }
                                                onChange={ (e) => { this.handleAttrChange(e) } } >
                                                    <option key={0} value="none"> --- </option>
                                                    { !!floors ?
                                                        floors.map((data, index) => {
                                                            return <option key={index + 1} value={data.id}>
                                                                { data.name } ({ data.building_name })
                                                            </option>
                                                        })
                                                    : <></> }
                                            </Input>
                                        </> : <></>
                                    }

                                </div>
                              </div>
                        }) }

                    </>
                : <></> }
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        attributes: state.attributes,
        floors:     state.floors,
        floor:      state.floor,
        contracts:  state.contracts,
        search:     state.search
    };
};

function mapDispatchToProps(dispatch) {
    return {
        getAttributes: (type, id, multi) => dispatch(getAttributes(type, id, multi)),
        updateAttributes: (type, id, data) => dispatch(updateAttributes(type, id, data)),
        getFloors: () => dispatch(getFloors()),
        getPageOfContracts: (page, ppp, filters, sortField, sortOrder) => dispatch(getPageOfContracts(page, ppp, filters, sortField, sortOrder)),
        searchEmployees: (query, page) => dispatch(searchEmployees(query, page)),
        searchEmployeeById: (id) => dispatch(searchEmployeeById(id))
    };
}

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(AttributesForm);