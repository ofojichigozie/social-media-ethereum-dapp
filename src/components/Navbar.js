import React, { Component } from 'react';
import Identicon from 'identicon.js';

class Navbar extends Component {
    
    constructor(props){
        super(props);
    }

    render() {
        return(
            <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
                <a
                    className="navbar-brand col-sm-3 col-md-2 mr-0"
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    { this.props.account
                        ? <img
                            className='mx-2 rounded-circle'
                            width='30'
                            height='30'
                            src={`data:image/png;base64,${new Identicon(this.props.account, 30).toString()}`}
                        />
                        : <span></span>
                    }
                    Ethergram
                </a>
                <ul className="navbar-nav px-3">
                    <li className="nav-item active">
                    <a className="nav-link" href="#"><span className="text-white">{ this.props.account }</span> | <span className="text-warning">{ this.props.balance } ETH</span></a>
                    </li>
                </ul>
            </nav>
        );
    }
}

export default Navbar;
