import * as types  from '../constants/ActionTypes';
import * as config from '../config/config';

import axios from 'axios'; 

export const getRelocationReport = (dateStart, dateEnd)  => {                                   
    return (dispatch) => {
        dispatch({ type: types.REQUEST_GET_RELOCATION_REPORT });
      return axios.get(`${config.baseUrl}/reports/generate_relocation_report?date_start=${dateStart}&date_end=${dateEnd}&as_file=false`, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
        .then(response => {
            dispatch({ type: types.RECEIVE_GET_RELOCATION_REPORT_SUCCESS, report: response.data }); 
        })
        .catch(error => {
            dispatch({ type: types.RECEIVE_GET_RELOCATION_REPORT_ERROR, message: error.response.message });
            throw(error); 
        });
    };
};

export const downloadRelocationReport  = (dateStart, dateEnd) => {
    return axios.get(`${config.baseUrl}/reports/generate_relocation_report?date_start=${dateStart}&date_end=${dateEnd}&as_file=true`, { headers: { Authorization: localStorage.getItem('auth_token') }, responseType: 'blob' },)                               
        .then(response => {
            if (!window.navigator.msSaveOrOpenBlob) {
                // BLOB NAVIGATOR
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'report_relocations.xls');
                document.body.appendChild(link);
                link.click();
            } else {
                // BLOB FOR EXPLORER 11
                const url = window.navigator.msSaveOrOpenBlob(new Blob([response.data]), `report_relocations.xls`);
            }
        }).catch(error => { throw(error); });
}

export const getMeterageReport = (id)  => {                                   
    return (dispatch) => {
        dispatch({ type: types.REQUEST_GET_METERAGE_REPORT });
      return axios.get(`${config.baseUrl}/reports/generate_meterage?city=${id}&as_file=false`, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
        .then(response => {
            dispatch({ type: types.RECEIVE_GET_METERAGE_REPORT_SUCCESS, report: response.data }); 
        })
        .catch(error => {
            dispatch({ type: types.RECEIVE_GET_METERAGE_REPORT_ERROR, message: error.response.message });
            throw(error); 
        });
    };
};

export const downloadMeterageReport  = (id) => {
    return axios.get(`${config.baseUrl}/reports/generate_meterage?city=${id}&as_file=true`, { headers: { Authorization: localStorage.getItem('auth_token') }, responseType: 'blob' },)                               
        .then(response => {
            if (!window.navigator.msSaveOrOpenBlob) {
                // BLOB NAVIGATOR
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'report_meterage.xls');
                document.body.appendChild(link);
                link.click();
            } else {
                // BLOB FOR EXPLORER 11
                const url = window.navigator.msSaveOrOpenBlob(new Blob([response.data]), `report_meterage.xls`);
            }
        }).catch(error => { throw(error); });
}

export const getCostcenterPlacesReport = ()  => {                                   
    return (dispatch) => {
        dispatch({ type: types.REQUEST_GET_COSTCENTER_PLACES_REPORT });
      return axios.get(`${config.baseUrl}/reports/generate_costcenter_places?as_file=false`, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
        .then(response => {
            dispatch({ type: types.RECEIVE_GET_COSTCENTER_PLACES_REPORT_SUCCESS, report: response.data }); 
        })
        .catch(error => {
            dispatch({ type: types.RECEIVE_GET_COSTCENTER_PLACES_REPORT_ERROR, message: error.response.message });
            throw(error); 
        });
    };
};

export const downloadCostcenterPlacesReport  = () => {
    return axios.get(`${config.baseUrl}/reports/generate_costcenter_places?as_file=true`, { headers: { Authorization: localStorage.getItem('auth_token') }, responseType: 'blob' },)                               
        .then(response => {
            if (!window.navigator.msSaveOrOpenBlob) {
                // BLOB NAVIGATOR
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'report_costcenter_places.xls');
                document.body.appendChild(link);
                link.click();
            } else {
                // BLOB FOR EXPLORER 11
                const url = window.navigator.msSaveOrOpenBlob(new Blob([response.data]), `report_costcenter_places.xls`);
            }
        }).catch(error => { throw(error); });
}

export const getReservationsReport = ()  => {                                   
    return (dispatch) => {
        dispatch({ type: types.REQUEST_GET_RESERVATIONS_REPORT });
      return axios.get(`${config.baseUrl}/reports/generate_reservations?as_file=false`, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
        .then(response => {
            dispatch({ type: types.RECEIVE_GET_RESERVATIONS_REPORT_SUCCESS, report: response.data }); 
        })
        .catch(error => {
            dispatch({ type: types.RECEIVE_GET_RESERVATIONS_REPORT_ERROR, message: error.response.message });
            throw(error); 
        });
    };
};

export const downloadReservationsReport  = () => {
    return axios.get(`${config.baseUrl}/reports/generate_reservations?as_file=true`, { headers: { Authorization: localStorage.getItem('auth_token') }, responseType: 'blob' },)                               
        .then(response => {
            if (!window.navigator.msSaveOrOpenBlob) {
                // BLOB NAVIGATOR
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'report_reservations.xls');
                document.body.appendChild(link);
                link.click();
            } else {
                // BLOB FOR EXPLORER 11
                const url = window.navigator.msSaveOrOpenBlob(new Blob([response.data]), `report_reservations.xls`);
            }
        }).catch(error => { throw(error); });
}

export const getNonSeatedEmployeesReport = ()  => {                                   
    return (dispatch) => {
        dispatch({ type: types.REQUEST_GET_NON_SEATED_EMPLOYYES_REPORT });
      return axios.get(`${config.baseUrl}/reports/generate_non_seated_employees?as_file=false`, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
        .then(response => {
            dispatch({ type: types.RECEIVE_GET_NON_SEATED_EMPLOYYES_REPORT_SUCCESS, report: response.data }); 
        })
        .catch(error => {
            dispatch({ type: types.RECEIVE_GET_NON_SEATED_EMPLOYYES_REPORT_ERROR, message: error.response.message });
            throw(error); 
        });
    };
};

export const downloadNonSeatedEmployeesReport  = () => {
    return axios.get(`${config.baseUrl}/reports/generate_non_seated_employees?as_file=true`, { headers: { Authorization: localStorage.getItem('auth_token') }, responseType: 'blob' },)                               
        .then(response => {
            if (!window.navigator.msSaveOrOpenBlob) {
                    // BLOB NAVIGATOR
                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', 'report_non_seated_employees.xls');
                    document.body.appendChild(link);
                    link.click();
            } else {
                // BLOB FOR EXPLORER 11
                const url = window.navigator.msSaveOrOpenBlob(new Blob([response.data]), `report_non_seated_employees.xls`);
            }
        }).catch(error => { 
            throw(error); 
        });
}

export const sendReport = (message, anonymous=false) => {                                   
    return (dispatch) => {
      return axios.post(`${config.baseUrl}/reports/send_report?anonymous=${anonymous}`, { message: message }, { headers: { Authorization: localStorage.getItem('auth_token') } })                               
        .then(response => {
          dispatch({ type: types.SEND_REPORT })  
        })
        .catch(error => { throw(error); });
    };
};