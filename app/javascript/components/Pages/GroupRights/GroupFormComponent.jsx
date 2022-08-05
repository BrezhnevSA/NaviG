import React, { Component } from 'react';
import { connect }          from "react-redux";
import { 
    Col,
    Row, 
    Button, 
    Form,
    FormGroup, 
    Label, 
    Input
}                           from 'reactstrap';
import { Link }             from 'react-router-dom';
import { toast }            from 'react-toastify';
import { Redirect }         from 'react-router-dom';
import { Token }            from 'react-bootstrap-typeahead';

import { 
    updateGroup, 
    addGroup, 
    removeGroup, 
    getGroups 
}                         from '../../../actions/GroupsActions';
import {removeRoles }     from '../../../actions/RolesActions';
import { 
    searchEmployeesForGroup, 
    searchEmployees 
}                         from '../../../actions/SearchActions';
import { getGroupRights } from '../../../actions/GroupRightsActions';
import { getRights }      from '../../../actions/RightsActions';

import AsyncSearcher from '../../Elements/AsyncSearcher';
import ModalWindow    from '../ModalWindow/ModalWindowComponent';

import * as rolable_types from '../../../constants/RolableTypes';

import 'react-bootstrap-typeahead/css/Typeahead.css';

import LocalizedStrings from 'react-localization';

let strings = new LocalizedStrings({
    en:{
        editgroup: "Edit Group",
        addgroup: "Add Group",
        name: "Name",
        save:"Save",
        create:"Create",
        order:"Order",
        orderplaceholder:"Enter number",
        employees:"Employees",
        backtolist:"Back to list",
        delete:"Delete",
        header: "Delete group with name",
        description: "The object will be deleted permanently.",
        yes: "Yes",
        no: "No",
        changessaved: "Changes saved!",
    },
    ru: {
        editgroup:"Редактировать Группу",
        addgroup:"Добавить Группу",
        name:"Имя",
        save:"Сохранить",
        create:"Создать",
        order:"Порядок",
        orderplaceholder:"Введите число",
        employees:"Сотрудники",
        backtolist:"Назад к списку",
        delete:"Удалить",
        header: "Удалить группу с названием",
        description: "Объект будет удален навсегда.",
        yes: "Да",
        no: "Нет",
        changessaved: "Изменения сохранены!",
    },
    de: {
        editgroup:"Gebäude bearbeiten",
        addgroup:"Gebäude hinzufügen",
        name:"Name",
        save:"Speichern",
        create:"Erstellen",
        order:"Bestellung",
        orderplaceholder:"Nummer eingeben",
        employees:"Ist aktiv",
        backtolist:"Zurück zur Liste",
        delete:"Löschen",
        header: "Gruppe mit Namen löschen",
        description: "Das Fußboden wird dauerhaft gelöscht.",
        yes: "Ja",
        no: "Nein",
        changessaved: "Änderungen gespeichert!",
    }
});

function mapDispatchToProps(dispatch) {
    return {
        getGroups:               () => dispatch(getGroups()),
        updateGroup:             (group, ids, rolable_type) => dispatch(updateGroup(group, ids, rolable_type)),
        addGroup:                (group, ids, rolable_type) => dispatch(addGroup(group, ids, rolable_type)),
        removeGroup:             (group_id) => dispatch(removeGroup(group_id)),
        removeRoles:             (role_ids,group_id, rolable_type) => dispatch(removeRoles(role_ids, group_id, rolable_type)),
        searchEmployees:         (query, page) => dispatch(searchEmployees(query, page)),
        searchEmployeesForGroup: (group_id) => dispatch(searchEmployeesForGroup(group_id)),
        getRights:               () => dispatch(getRights()),
        getGroupRights:          () => dispatch(getGroupRights()),
    };
}

const mapStateToProps = state => {
    
    return {
        groups:      state.groups,
        rights:      state.rights,
        grouprights: state.grouprights,
        roles:       state.roles,
        search:      state.search,
    };
};

class GroupForm extends Component {

    notify = () => {
        toast.success(strings.chagessaved, {
          position: toast.POSITION.TOP_RIGHT
        });
    }

    constructor(props) {
        super(props);

        strings.setLanguage(localStorage.getItem('lang').toLowerCase());

        let current_group = {
            id:   null,
            name: ''
        }

        this.state = {
            group:                 current_group,
            redirect:              false,
            isLoading:             false,
            options:               [],
            query:                 '',
            selected:              [],
            loadEmployeesToSelect: true,
            triggerModal: false
        }
        
        this.handleGroupNameChange = this.handleGroupNameChange.bind(this);
        this.save                     = this.save.bind(this);
        this.remove                   = this.remove.bind(this);
        this.handleSelection          = this.handleSelection.bind(this);
        this.searchEmployees_         = this.searchEmployees_.bind(this);
    }

    componentDidMount() {
        this.props.getGroups();
        if (this.props.match.params.id) {
            this.props.searchEmployeesForGroup(parseInt(this.props.match.params.id));
        }
        this.setState({ loadEmployeesToSelect: true });
    }

    componentDidUpdate(prevProps) {
        if (this.props.groups != prevProps.groups) {
            const current_group_key = this.props.groups.items.findIndex(c => c.id === parseInt(this.props.match.params.id));
            
            if (current_group_key > -1) {
                let current_group = this.props.groups.items[current_group_key];
                
                this.setState({
                    group: current_group,
                    triggerModal: false
                });
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        const { loadEmployeesToSelect } = this.state;
        const { search }                = nextProps;

        strings.setLanguage(localStorage.getItem('lang').toLowerCase());

        if (!search.employees_for_group.isFetching && loadEmployeesToSelect) {
            this.setState({
                loadEmployeesToSelect: false,
                selected:              search.employees_for_group.items,
                triggerModal: false
            })
        }
    }

    handleGroupNameChange(e) {
        this.setState({
            group: {
                ...this.state.group,
                name: e.target.value
            }
        });
    }

    searchEmployees_(query, page) {
        this.props.searchEmployees(query, page);
    }

    handleSelection(item) {
        this.setState({
            selected: item
        });
    }

    save() {
        const { group, selected } = this.state;
        const ids = selected.map(i => { return i.id; })
        if (this.state.group.id === null) {
            this.props.addGroup(group, ids, rolable_types.EMPLOYEE);
            this.setState({
                redirect: true
            });
        }
        else {
            this.props.updateGroup(group, ids, rolable_types.EMPLOYEE);
        }
        this.props.getRights();
        this.props.getGroups();
        this.props.getGroupRights();
        this.notify();
        this.props.history.push("/grouprights");
    }

    remove() {
        const { group, selected } = this.state;
        const ids = selected.map(i => { return i.id; });
        this.notify();
        this.props.removeRoles(ids, group.id, rolable_types.EMPLOYEE);
        this.props.removeGroup(group.id);
        this.props.getRights();
        this.props.getGroups();
        this.props.getGroupRights();
        this.props.history.push("/grouprights");
    }

    render() {
        const { group, triggerModal, selected } = this.state;
        const { search } = this.props;
        let submit_text = strings.save;
        if (group.id === null) {
            submit_text = strings.create;
        }
        return (
            <>
                <div className="container-fluid  overflow-auto with-actions">
                    <div className="container page-title-wrapper" >
                        {group.id !== null? (
                            <h1 id="page-title">{ strings.editgroup }</h1>
                        ) : (
                            <h1 id="page-title">{ strings.addgroup }</h1>
                        )}
                        
                    </div>
                    <div className="container neomorph-card mt-2 edit-page">
                        <div className="row neomorph-card-inside" >
                        <Form className="entity-management-form">
                            <FormGroup row>
                                <Label for="fieldName" sm={4}>{ strings.name }</Label>
                                <Col sm={8}>
                                    <Input type="text"
                                        name="name"
                                        id="fieldName"
                                        value={group.name}
                                        onChange={this.handleGroupNameChange} />
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="fieldOrder" sm={4}>{ strings.employees }</Label>
                                <Col sm={8}>
                                    <AsyncSearcher
                                        {...this.state}
                                        objects={search.employees}
                                        searchObjects={this.searchEmployees_}
                                        handleSelection={this.handleSelection}
                                        selected={selected}
                                        optionsRender={option => (
                                            <div key={option.id} tabindex="0" className="rbt-token rbt-token-removeable">
                                                {option.name} {option.surname} ({option.login})
                                            </div>
                                        )}
                                        labelKey={option => `${option.name} ${option.surname} (${option.login})`}
                                        textTranslation={{
                                            searching:        strings.searchingBookings,
                                            noresults:        strings.noresults,
                                            placeholder_name: strings.placeholder_name
                                        }}
                                        multiple={true}                                                
                                    />
                                </Col>
                            </FormGroup>
                        </Form>
                        </div>
                    </div>
                </div>
                <div id="bottom-actions-block">
                    <Link to="/grouprights">
                        { strings.backtolist }
                    </Link>
                    
                    <Button color="success" onClick={this.save}>
                        {submit_text}
                    </Button>
                    {group.id !== null? (
                        <>
                            <Button color="danger"onClick={() => { this.setState({triggerModal: true})}}>
                                { strings.delete }
                            </Button>
                            <ModalWindow 
                                modalIsOpen={triggerModal}
                                header={
                                    <div className="modal-header-1">
                                        <div className="close-modal" >
                                            <img className="close-link" src="/img/pics/cross_black.svg" onClick={() => this.setState({ triggerModal: false})}></img>
                                        </div>
                                        <h2>{strings.header} {group.name.length > 20 ? `${group.name.substring(0, 19)}...` : group.name }?</h2>
                                    </div>
                                }
                                body={
                                    <div className="modal-body-1">
                                        <p>{strings.description}</p>
                                        <div className="modal-buttons">
                                            <Button 
                                                className="button-magenta button_usual btn_small"
                                                onClick={() => { this.remove(); this.setState({ triggerModal: false})}}
                                            >{strings.yes}</Button>
                                            <Button 
                                                className="button_usual button_decline btn_small btn_right"
                                                onClick={() => { this.setState({ triggerModal: false})}}
                                            >{strings.no}</Button>
                                        </div>
                                    </div>
                                }
                            />
                        </>
                    ) : (
                        <></>
                    )}
                    
                </div>
            </>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(GroupForm);