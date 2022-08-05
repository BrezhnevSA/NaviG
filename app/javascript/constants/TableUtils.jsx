import React from 'react';
import Loading from '../components/Pages/Loading/LoadingComponent';

export const processTableData = (data, noDataMessage) => {
    if(!data.items || data.isFetching) {
        return {
            tableData: [],
            noDataIndicator: <Loading/>
        }
    } else {
        return {
            tableData: data.items,
            noDataIndicator: noDataMessage
        }
    }
}