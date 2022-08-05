import React, { useState } from "react";
import "./DropdownStyles.css";

const Dropdown = ({options, name, selectedValue, handleChange, placeHolder, ...props}) => {

    const [dropdownArrowDown, setDropdownArrowDown] = useState(true);

    const renderSelectedOption = (options, name) => {
        if (options) {
            return (
                options.map((item, i) => {
                    return <option key={name + '_DropdownItem_' + i} value={item.value}>
                        {item.text}
                    </option>
                })
            );
        }
        
    };

    const handleOnClick = () => {
        setDropdownArrowDown(!dropdownArrowDown);
    }

    return (
        <div className="dropdown-select-container">
            <select name={name}
                    id={name}
                    value={selectedValue}
                    className="dropdown-form-select"
                    onChange={e => handleChange(name, e.target.value)}
                    onClick={handleOnClick}
                    {...props}>

                <option key='placeHolder_DropdownItem' value="" disabled selected hidden>
                    {placeHolder}
                </option>
                
                {renderSelectedOption(options, name)}

            </select>

            <span className="dropdown-icon-box">
                <i aria-hidden="true" className={`dropdown-icon  ${dropdownArrowDown 
                                                                        ? 'dropdown-icon-arrow-down' 
                                                                        : 'dropdown-icon-arrow-up'} `}></i>
            </span>
        </div>
    );

}

export default Dropdown;