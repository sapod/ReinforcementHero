import React, { Component } from "react";
import './header.sass';


class Header extends Component {
    render() {
        return (
            <div>
                <div className="header">
                    <img alt="" className="afeka" src={require("../../../img/afeka.png")}/>
                    <img alt="" className="logo" src={require("../../../img/logo.png")}/>
                </div>
            </div>
        )
    }
}

export default Header;