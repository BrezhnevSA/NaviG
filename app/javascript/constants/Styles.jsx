import React, { Component } from 'react';

export const headerStyles = { backgroundColor: "#d8d8d8", fontWeight: "normal", fontSize: "18px"};
export const pageListRenderer = ({
    pages,
    onPageChange
  }) => {
    // just exclude <, <<, >>, >
    // const pageWithoutIndication = pages.filter(p => typeof p.page !== 'string');
    return (
      <div>
        {
          pages.map(p => (
            p.active 
                ? <button className="btn pagination_button_active" onClick={ () => onPageChange(p.page) }>{ p.page }</button>
                : <button className="btn pagination_button" onClick={ () => onPageChange(p.page) }>{ p.page }</button>
          ))
        }
      </div>
    );
  };

export const sortCaretStyle = (order, column) => {
  if (!order) {
      return (
          <span>
              <div className="styles-component-header-sort-caret-container">
                  <div className="styles-component-header-sort-caret">&#9650;</div>
                  <div className="styles-component-header-sort-caret">&#9660;</div>
              </div>
          </span>);
  } else if (order === 'asc') {
      return (
          <span> 
              <div className="styles-component-header-sort-caret-container">
                  <div className="styles-component-header-sort-caret">&#9650;</div>
                  <div className="styles-component-header-sort-caret-active">&#9660;</div>
              </div>
          </span>);
  } else if  (order === 'desc') {
      return (
          <span> 
              <div className="styles-component-header-sort-caret-container">
                  <div className="styles-component-header-sort-caret-active">&#9650;</div>
                  <div className="styles-component-header-sort-caret">&#9660;</div>
              </div>
          </span>
      );
  }
  return null;
}

export const ducks = 
<div id="ducks">
  <i></i>
  <i></i>
  <i></i>
  <i></i>
  <i></i>
  <i></i>
  <i></i>
  <i></i>
  <i></i>
  <i></i>
  <i></i>
  <i></i>
  <i></i>
  <i></i>
  <i></i>
  <i></i>
  <i></i>
  <i></i>
  <i></i>
  <i></i>
  <i></i> 
  <i></i> 
  <i></i> 
  <i></i> 
</div>;