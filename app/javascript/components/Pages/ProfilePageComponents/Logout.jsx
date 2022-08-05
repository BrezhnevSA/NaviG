import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from "react-redux";
import { logout, getUserByToken } from '../../../actions/LoginActions';
import { getPageOfBookings } from '../../../actions/BookingsActions';

class Logout extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.getPageOfBookings(0, 0, [], "", "");
        this.props.logout();
        this.props.getUserByToken();
    }

    render() {

        return (
            <>
                { !this.props.user.loggedIn? (
                        <Redirect to="/login" />
                    ) : (
                        <></>
                    )
                }                
            </>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        logout: id => dispatch(logout(id)),
        getUserByToken: () => dispatch(getUserByToken()),
        getPageOfBookings: (page, per_page, filters, sortField, sortOrder) => dispatch(getPageOfBookings(page, per_page, filters, sortField, sortOrder)), 
    };
}

const mapStateToProps = state => {
    return {
        user: state.user
    };
};

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(Logout);