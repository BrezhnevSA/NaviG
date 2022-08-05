import React, { Component } from 'react';

import './LoadingComponent.css';

class Loading extends Component {

    render() {
        return (
            <div className="loading-container">
                <div className="loading-wrapper">
                    <div className="lds-facebook">
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Loading;