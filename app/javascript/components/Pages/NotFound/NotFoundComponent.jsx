import React, { Component } from 'react';
import styled from 'styled-components'

class NotFound extends Component {

    constructor(props) {
        super(props);

    }

    render() {

        const NotFoundWrapper = styled.div`
            margin: auto;
            font-size: 100px;
            margin-top: 5%;
            color: #5aa0a0;
            text-align: center;
            font-weight: bold;
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;`
        
        return (
            <>
                <NotFoundWrapper>404</NotFoundWrapper>
            </>
        );
        
    }
}

export default NotFound;