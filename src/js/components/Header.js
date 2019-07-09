import React, { Component } from "react";

class Header extends Component {
    render() {
        return (
            <div>
                <div className="header">
                    <img className="afeka" src={require("../../img/afeka.png")}/>
                    <img className="logo" src={require("../../img/logo.png")}/>
                </div>
            </div>
        )
    }
}

export default Header;