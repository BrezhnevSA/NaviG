import React, { Component } from 'react';

import LocalizedStrings from 'react-localization';
import { connect } from "react-redux";
import { Button } from 'reactstrap';
import { getAttributes, updateAttributes } from '../../../actions/AttributesActions';
import Lightbox from 'react-image-lightbox';
import ImageProvider from '../ImageProvider/ImageProvider';
import { Link } from 'react-router-dom';
import { getFloors }      from '../../../actions/FloorsActions';
import * as rights from '../../../constants/Rights';
import * as rbac   from '../../../rbac/rbac';
import { toast }  from 'react-toastify';

import * as settings from '../../../constants/AppSettings';

let strings = new LocalizedStrings({
    en:{
        metaattrs:        "Attributes",
        checkboxenabled:  "Yes",
        checkboxdisabled: "No",
        openpanorama:     "View"
    },
    ru: {
        metaattrs:        "Атрибуты",
        checkboxenabled:  "Да",
        checkboxdisabled: "Нет",
        openpanorama:     "Открыть"
    },
    de: {
        metaattrs:        "Attributes",
        checkboxenabled:  "Ja",
        checkboxdisabled: "Nein",
        openpanorama:     "Anzeigen"
    }
});


class AttributesView extends Component {

    constructor(props) {
        super(props)

        this.state = {
            photoLightboxIndex: 0,
            isLightboxOpen: false,
            type:       props.type,
            maintype:   props.maintype,
            id:         props.id,
            attributes: [],
            hovered: false,
        }

        strings.setLanguage(localStorage.getItem('lang').toLowerCase());

        this.handleAttrChange = this.handleAttrChange.bind(this);
        this.save             = this.save.bind(this);
    }

    componentDidMount() {
        this.props.getAttributes(this.state.maintype, this.state.id, this.props.multi);
        this.props.getFloors();
    }

    componentWillReceiveProps(nextProps) {
        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
    }

    componentDidUpdate(prevProps) {

        if (this.props.attributes !== prevProps.attributes) {
            let attributes = [];
            this.props.attributes.forEach(element => {
                if ((element['entityid'] == this.state.id) && (element['entitytype'] == this.state.type)) {
                    attributes.push(element)
                }
            });
            
            this.setState({
                attributes: attributes
            });
        }
        
        if (this.props.id !== prevProps.id) {
            this.setState({
                id:       this.props.id,
                maintype: this.props.maintype
            }, () => {
                this.props.getAttributes(this.state.maintype, this.state.id, this.props.multi);
            });
        }
    }

    notify = () => {
        toast.success("Changes Saved!", {
          position: toast.POSITION.TOP_RIGHT
        });
    }

    handleAttrChange(e) {
        const map_id = e.target.getAttribute('metaId');
        const index  = this.state.attributes.findIndex(el => el.id == map_id);

        if (index === -1) {
            // handle error
            console.log('Error: Meta value gone!')
        }
        else {
            this.setState({
                attributes: [
                    ...this.state.attributes.slice(0, index),
                    Object.assign({}, this.state.attributes[index], { metavalue: e.target.value }),
                    ...this.state.attributes.slice(index + 1)
                ]
            });
        }
    }

    save(data = null) {
        const { attributes, id, maintype } = this.state;
        if (!data) {
            this.props.updateAttributes(maintype, id, attributes);
        } else {
            let attributes_new = attributes.map(el => {
                if (el.id === data.id) {
                    // el.metavalue = `${el.id}.png`
                    el.metavalue = data.image
                }
                return el;
            })
            this.props.updateAttributes(maintype, id, attributes_new);
        }
    }

    showFloorDetails(id) {
        if (!!this.props.floors) {
            const selected_floor = this.props.floors.find(item => item.id == id);
            if (!!selected_floor) {
                return selected_floor['name']  + '(' + selected_floor['building_name'] + ')';
            }
            return '';
            
        }
        return null;
    }

    onMouseEnter = e => {
        this.setState({ hovered: true });
    };

    onMouseLeave = e => {
        this.setState({ hovered: false });
    };

    render() {
        const changesHandling = this.handleAttrChange;
        const save            = this.save;
        const { lang, user, no_title, floor, id, parking, profile, employee_parking_id }  = this.props;
        let user_rights       = [];
        const { photoLightboxIndex, isLightboxOpen } = this.state;
        const path = window.location.pathname.split('/');
        

        if (user && user.user && user.user.rights) {
            user_rights = user.user.rights;
        }

        let attributes_filtered = this.state.attributes.sort((a, b) => {
            if (a.metatype !== 'image' && a.metatype !== 'panorama' && a.metatype !== 'floor_reference') {
                return -1;
            } else {
                return 1;
            }
          }).filter(e => !floor.inventory_mode && e.metafieldid != settings.DESKNUM_ID && e.metafieldid != settings.TYMBNUM_ID && 
            e.metafieldid != settings.DOCSTATION_ID && e.metafieldid != settings.MONITOR1_ID && e.metafieldid != settings.MONITOR2_ID && 
            e.metafieldid !== settings.DS_READY_ID && e.metafieldid !== settings.PARKING_PLACE_ID  && e.metafieldid !== settings.NOTACTIVE_DESK_ID 
          )

        return (
            <div className="attributes attributes-form">
                { (attributes_filtered.length > 0) && !!id ?
                    <>
                        { no_title ? <></> : <h3 id="page-title">{ strings.metaattrs }</h3>}
                        { attributes_filtered.map((data, index) => {
                            return data.metafieldid != settings.EMPLOYEE_SD_ID && !parking ?                            
                             <div key={ index } className="field">
                                    { data.metatype != 'panorama' ?
                                        <label className="attr-label">
                                            <>{ data.metaname }</> 
                                        </label>
                                        : <></>
                                    }
                                    <div className={`attr-value ${data.metatype == 'panorama' ? 'panorama' : ''}`}>

                                        {/* loop on fields types */}

                                        { (data.metatype == 'text' || data.metatype == 'reference' || data.metatype == 'square') ?
                                            <>{` (${ !!data.metavalue ? data.metavalue : "-" }) ${(index + 1) !== this.state.attributes.length ? ", " : ""}`}</> 
                                          : <></>
                                        }

                                        { (data.metatype == 'checkbox') ?
                                            <>{` (${ data.metavalue === 'on' ? strings.checkboxenabled : strings.checkboxdisabled }) ${(index + 1) !== this.state.attributes.length ? ", " : ""}`}</> 
                                          : <></>
                                        }   

                                        { (data.metatype == 'image') ?
                                            <ImageProvider
                                                id={data.id}
                                                updatePicture={save}
                                                img_url={data.metavalue}
                                                lang={lang}
                                                have_rights={rbac.isSatisfied([rights.UPDATE_META_VALUE, rights.CREATE_META_VALUE], user_rights)}
                                            /> : <></>
                                        }

                                        { (data.metatype == 'panorama') ?
                                        <>
                                            <a className="openPanorama">
                                                {/* <i className="fa fa-street-view" style={{ fontSize: '1.75em' }} /> */}
                                                <img                                                     
                                                    onClick={() => this.setState({ isLightboxOpen: true })}
                                                    src={!!!data.metavalue ? "/img/no_photo.jpg" : `${data.metavalue}?${Math.random().toString()}`}
                                                    style={{maxWidth: '250px', maxHeight: '250px', marginLeft: 'auto', marginTop: '10px'}}
                                                ></img>
                                            </a>
                                        
                                                {isLightboxOpen && (
                                                <Lightbox
                                                    mainSrc={!!!data.metavalue ? "/img/no_photo.jpg" : `${data.metavalue}?${Math.random().toString()}`}
                                                    onCloseRequest={() => this.setState({ isLightboxOpen: false })}
                                                />
                                                )}
                                            </>
                                            : <></>
                                        }

                                        { (data.metatype == 'floor_reference') ?
                                            <>
                                                { !!data.metavalue ?
                                                    <Link to={"/floors/" + data.metavalue}>
                                                        { this.showFloorDetails(data.metavalue) }
                                                    </Link>
                                                : <>-</> }
                                            </>
                                        : <></>}                                     

                                    </div>
                                </div>
                            : data.metafieldid == settings.EMPLOYEE_SD_ID && parking && employee_parking_id && !profile.isFetching && profile.item
                                ? <div>
                                    <label className="attr-label parking_label" >
                                        <a href={`webexteams://im?email=${profile.item.email}`}><img src="/img/pics/webex.svg" className="webex"/></a> 
                                        <a onClick={() => { this.copyToClipboard(profile.item.email);  this.notify(`${strings.employee_mail} ${profile.item.email} ${strings.copied2}`); }} >
                                            <img className="mail_icon in_parking" src="/img/pics/mail_icon.svg"/>
                                        </a>
                                        <Link onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave} className={`profile-link ${this.state.hovered ? 'hovered_link' : ''} parking_link`} to={`/profile/${profile.item.id}`}>{profile.item.surname} {profile.item.name}</Link>
                                    </label>
                                  </div>
                                : <></>
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
        user:       state.user,
        floors:     state.floors,
        floor:      state.floor,
        profile:    state.profile
    };
};

function mapDispatchToProps(dispatch) {
    return {
        getAttributes:    (type, id, multi) => dispatch(getAttributes(type, id, multi)),
        updateAttributes: (maintype, id, attributes) => dispatch(updateAttributes(maintype, id, attributes)),
        getFloors:        () => dispatch(getFloors()),
    };
}

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(AttributesView);