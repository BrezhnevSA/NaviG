import React, { Component } from 'react';
import { toast }            from 'react-toastify';
import { connect }          from "react-redux";
import { Link }             from 'react-router-dom';
import { 
    Container, 
    Button 
}                           from 'reactstrap';
import BootstrapTable       from 'react-bootstrap-table-next';
import 
    filterFactory, 
    { textFilter }          from 'react-bootstrap-table2-filter';
import paginationFactory    from 'react-bootstrap-table2-paginator';

import { 
    getGroupRights, 
    addGroupRights,
    removeGroupRights 
}                         from '../../../actions/GroupRightsActions';
import { 
    getGroups, 
    addGroup,
    updateGroup 
}                         from '../../../actions/GroupsActions';
import { 
    getRights, 
}                         from '../../../actions/RightsActions';

import LocalizedStrings from 'react-localization';

import * as rightsForComponents from '../../../constants/RightsForComponents';
import { sortCaretStyle, headerStyles } from '../../../constants/Styles';
import "./GroupRightsForPagesComponent.css";

let strings = new LocalizedStrings({
    en:{
        accessgroups:  "Access groups",
        addgroup:      "Add group",
        showing:       "Showing",
        from:          "from",
        to:            "to",
        of:            "of",
        results:       "Results",
        all:           "All",
        pagecomponent: "Page/Component",
        right_id:      "Right ID",
        rights:        "Required rights",
        urls:          "URLs",
    },
    ru: {
        accessgroups: "Группы доступа",
        addgroup:      "Добавить группу",
        showing:       "Отображено",
        from:          "с",
        to:            "по",
        of:            "из",
        results:       "всего",
        all:           "Все",
        pagecomponent: "Страница/Компонента",
        right_id:      "ID права",
        rights:        "Необходимые права",
        urls:          "URLs",
    },
    de: {
        accessgroups:  "Zugriff auf Gruppen",
        add:           "Gruppe hinzufügen",
        showing:       "Zeigen",
        from:          "von",
        to:            "zu",
        of:            "von",
        results:       "Ergebnisse",
        all:           "Alles",
        pagecomponent: "Seite/Komponente",
        right_id:      "Richtige ID",
        rights:        "Erforderliche Rechte",
        urls:          "URLs",
    }
});

const mapStateToProps = state => {
    return {
        groupRights: state.groupRights,
        groups:      state.groups,
        rights:      state.rights,
        user:        state.user
    };
};

function mapDispatchToProps(dispatch) {
    return {
        removeGroupRights: (groupRights) => dispatch(removeGroupRights(groupRights)),
        addGroupRights:    (groupRights) => dispatch(addGroupRights(groupRights)),
        getGroupRights:    () => dispatch(getGroupRights()),
        addGroup:          (group) => dispatch(addGroup(group)),
        updateGroup:       (group) => dispatch(updateGroup(group)),
        getGroups:         () => dispatch(getGroups()),
        getRights:         () => dispatch(getRights()),
    };
}

class GroupRightsForPages extends Component {

    constructor(props) {
        super(props)

        this.state = {
            rights:              this.props.rights,
            groups:              this.props.groups,
            groupRights:         this.props.groupRights,
            rightsForComponents: JSON.parse(JSON.stringify(rightsForComponents.list))
        }

        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
    }

    componentDidMount() {
        this.props.getRights();
        this.props.getGroups();
        this.props.getGroupRights();
    }

    componentDidUpdate(prevProps) {
        if (this.props.groupRights !== prevProps.groupRights) {
            this.setState({
                groupRights: this.props.groupRights
            });
        }
        if (this.props.groups !== prevProps.groups) {
            this.setState({
                groups: this.props.groups
            });
        }
        if (this.props.rights !== prevProps.rights) {
            this.setState({
                rights: this.props.rights
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

    handleGroupRightsChange(e, rights, group_id, checked, rrights) {
        let { groupRights } = this.state;
        if (checked) {
            this.props.removeGroupRights(rights.map(r => {
                return groupRights.items.find(gr => gr.group_id === group_id && gr.right_id == r).id;
            }));
        } else {
            this.props.addGroupRights(rights.map(r => { return { right_id: r, group_id: group_id }; } ));
        }
    }

    render() {
        let { groupRights, groups, rights, rightsForComponents } = this.state;
        const capitalize = (str, lower = false) =>
            (lower ? str.toLowerCase() : str).replace(/(?:^|\s|["'([{])+\S/g, match => match.toUpperCase());
        if (!groupRights.isFetching && !groups.isFetching && rights && groupRights.items.length > 0 
           && groups.items.length > 0 && rights.length > 0 ) {            
            let rights_mapped = rights.map(right => {
                return { 
                    right_id: right.id,
                    right_name: right.name,
                    right_machine_name: right.machine_name,
                    groups: groups.items.map(group => {
                        let gr = groupRights.items.find(gr => gr.group_id === group.id && gr.right_id === right.id);
                        return gr !== undefined
                            ? {
                                id:       group.id,
                                id_saved: group.id,
                                name:     group.name,
                            }
                            : {
                                id:       0,
                                id_saved: group.id,
                                name:     group.name,
                            };
                    }) 
                };
            });
            
            let data = rightsForComponents.map(e => {
                e.rights = e.rights.map(e_r => {
                    let right = rights_mapped.find(r => r.right_machine_name === e_r);
                    if (right !== undefined) {
                        return right;
                    } else {
                        return null
                    }
                }).filter(n => n);
                return e;
            });
            
            const columns = [ 
                {
                    dataField: 'name',
                    text: "2",
                    sort: false,
                    hidden: true,
                    sortCaret: sortCaretStyle,
                    headerStyle: headerStyles
                }, { 
                    dataField: 'description',
                    text: strings.pagecomponent,
                    sort: true,
                    filter: textFilter(),
                    sortCaret: sortCaretStyle,
                    headerStyle: headerStyles
                }, {
                    dataField: 'urls',
                    text: strings.urls,
                    filter: textFilter(),
                    sortCaret: sortCaretStyle,
                    headerStyle: headerStyles,
                    formatter: (cell, row, rowIndex, extraData) => {
                        return row.urls.length > 1 
                            ? <ul>{row.urls.map(e => {
                                    return e.split(":").length > 1
                                        ? <li>{e}</li>
                                        : <li><Link to={`${e}`}>{e}</Link></li>;
                                 })
                              }</ul>
                            : row.urls[0].split(":").length > 1
                                ? <>{row.urls}</>
                                : <a href={`${row.urls}`}>{row.urls}</a>;
                    }
                }, {
                    dataField: 'rights',
                    text: strings.rights,
                    sortCaret: sortCaretStyle,
                    headerStyle: headerStyles,
                    formatter: (cell, row, rowIndex, extraData) => {
                        return <ul>{row.rights.map(e => {
                                        return <li>{capitalize(e.right_machine_name.replace(/_/g, " "))}</li>;
                                   })
                                }</ul>;
                    }
                }
            ];
            rights_mapped[0].groups.map((group, index) => {
                columns.push({
                    dataField: `-${group.id_saved}`,
                    sort: false,
                    sortCaret: sortCaretStyle,
                    headerStyle: headerStyles,
                    headerFormatter: (column, colIndex) => {
                        return (
                          <h3><strong><Link to={`/groups/${group.id_saved}`}>{group.name}</Link></strong></h3>
                        );
                    },
                    formatter: (cell, row, rowIndex, extraData) => {
                        const right = extraData.data.find(item => item.name === row.name);
                        let checked = 0;
                        row.rights.map(r => {
                            let group_found = r.groups.find(r_g => r_g.id === extraData.group_id) !== undefined;
                            if (group_found) checked++;
                        });
                        return <input type="checkbox"
                            name={`rightActive${right.right_id}`}
                            id={`rightActive${right.right_id}`}
                            checked={ checked === row.rights.length }
                            value={ checked === row.rights.length }
                            className="cells_rights"
                            onChange={(e) => { 
                                this.handleGroupRightsChange(e, row.rights.map(r => { return r.right_id; }), extraData.group_id, checked === row.rights.length , row.rights); 
                            }} 
                        />;
                    },
                    formatExtraData: {
                        data: data,
                        group_id: group.id_saved
                    }
                })
            });
            const customTotal = (from, to, size) => (
                <span className="react-bootstrap-table-pagination-total">
                { strings.showing } { strings.from } { strings.to } { to } { strings.of } { size } { strings.results }
                </span>
            );

            const options = {
                showTotal: true,
                paginationTotalRenderer: customTotal,
                withFirstAndLast: true,
                sizePerPageList: [{
                    text: '50', value: 50
                }, {
                    text: '100', value: 100
                }, {
                    text: '200', value: 200
                }, {
                    text: strings.all, value: groupRights.items.length
                }]
            };

            return (
                <>
                    <div className="container-fluid  overflow-auto with-actions">
                        <div className="container page-title-wrapper" >
                            <h1 id="page-title"> { strings.accessgroups }</h1>
                        </div>
                        <div className="container neomorph-card mt-2">
                            <div className="default-table-style-container table_custom table_custom_with_tabs">
                                <BootstrapTable
                                    keyField='group_id'
                                    data={ data }
                                    columns={ columns }
                                    filter={ filterFactory() }
                                    pagination={ paginationFactory(options) }
                                    rowStyle={ (row, rowIndex) => {
                                        return { backgroundColor: rowIndex % 2 == 0 ? "#ededed" : "white" };
                                    } }
                                />
                            </div>
                        </div>
                    </div>
                    <div id="bottom-actions-block">
                        <Link to="/groups/new">
                            <Button color="primary">
                                { strings.addgroup }
                            </Button>
                        </Link>
                    </div>
                </>
            );
        } else {
            return(<></>);
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(GroupRightsForPages);