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
    addGroupRight,
    removeGroupRight 
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
import { sortCaretStyle, headerStyles } from '../../../constants/Styles';
import "./GroupRightsComponent.css";

let strings = new LocalizedStrings({
    en:{
        accessgroups: "Access groups",
        addgroup:     "Add group",
        showing:      "Showing",
        from:         "from",
        to:           "to",
        of:           "of",
        results:      "Results",
        all:          "All",
        right_name:   "Right name",
        right_id:     "Right ID"
    },
    ru: {
        accessgroups: "Группы доступа",
        addgroup:     "Добавить группу",
        showing:      "Отображено",
        from:         "с",
        to:           "по",
        of:           "из",
        results:      "всего",
        all:          "Все",
        right_name:   "Право",
        right_id:     "ID права"
    },
    de: {
        accessgroups: "Zugriff auf Gruppen",
        add:          "Gruppe hinzufügen",
        showing:      "Zeigen",
        from:         "von",
        to:           "zu",
        of:           "von",
        results:      "Ergebnisse",
        all:          "Alles",
        right_name:   "richtiger name",
        right_id:     "Richtige ID"
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
        removeGroupRight: (groupRight) => dispatch(removeGroupRight(groupRight)),
        addGroupRight:    (groupRight) => dispatch(addGroupRight(groupRight)),
        getGroupRights:   () => dispatch(getGroupRights()),
        addGroup:         (group) => dispatch(addGroup(group)),
        updateGroup:      (group) => dispatch(updateGroup(group)),
        getGroups:        () => dispatch(getGroups()),
        getRights:        () => dispatch(getRights()),
    };
}

class GroupRights extends Component {

    constructor(props) {
        super(props)

        this.state = {
            groupRights: this.props.groupRights,
            groups:      this.props.groups,
            rights:      this.rights,
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

    handleGroupRightsChange(e, rname, right_id, group_id, checked) {
        let { groupRights } = this.props;
        if (checked) {
            this.props.removeGroupRight(
                groupRights.items.find(gr => gr.group_id === group_id && gr.right_id == right_id).id
            );
        } else {
            this.props.addGroupRight({
                right_id: right_id,
                group_id: group_id
            });
        }
    }

    render() {
        let { groupRights, groups, rights } = this.state;
        
        if (!groupRights.isFetching && !groups.isFetching && rights && groupRights.items.length > 0 
           && groups.items.length > 0 && rights.length > 0 ) {
            let data = rights.map(right => {
                return { 
                    right_id: right.id,
                    right_name: right.name,

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
            const columns = [
                {
                    dataField: 'right_id',
                    text: strings.right_id,
                    sort: false,
                    hidden: true,
                    sortCaret: sortCaretStyle,
                    headerStyle: headerStyles
                }, 
                { 
                    dataField: 'right_name',
                    text: strings.right_name,
                    sort: false,
                    filter: textFilter(),
                    sortCaret: sortCaretStyle,
                    headerStyle: headerStyles
                } 
            ];
            data[0].groups.map((group, index) => {
                columns.push({
                    dataField: `groups[${index}].id`,
                    sort: false,
                    sortCaret: sortCaretStyle,
                    headerStyle: headerStyles,
                    headerFormatter: (column, colIndex) => {
                        return (
                          <h3><strong><Link to={`/groups/${group.id_saved}`}>{group.name}</Link></strong></h3>
                        );
                    },
                    formatter: (cell, row, rowIndex, extraData) => {
                        const right = extraData.data.find(item => item.right_id === row.right_id);
                        const checked = parseInt(cell) !== 0;
                        return <input type="checkbox"
                            name={`rightActive${right.right_id}`}
                            id={`rightActive${right.right_id}`}
                            checked={ checked }
                            value={ checked }
                            className="cells_rights"
                            onChange={(e) => { 
                                this.handleGroupRightsChange(e, right.right_name, right.right_id, extraData.group_id, checked); 
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
                { strings.showing } { strings.from } { from } { strings.to } { to } { strings.of } { size } { strings.results }
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
                    text: strings.all, value: this.state.groupRights.items.length
                }]
            };

            return (
                <>
                    <div className="container-fluid  overflow-auto with-actions">
                        <div className="container page-title-wrapper" >
                            <h1 id="page-title">{ strings.accessgroups }</h1>
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

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(GroupRights);