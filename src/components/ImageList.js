import React, { Component } from 'react';
import Identicon from 'identicon.js';
import './App.css';

class ImageList extends Component {
    
    constructor(props){
        super(props);
    }

    render() {
        return(
            <div className="row mt-4">
                { this.props.images.map((image, key) => {
                    return(
                        <div className="col-md-6" key={ key }>
                            <div className="card mb-4" >
                                <div className="card-header">
                                    <img
                                        className='mr-2'
                                        width='30'
                                        height='30'
                                        src={`data:image/png;base64,${new Identicon(image.author, 30).toString()}`}
                                    />
                                    <small className="text-muted">{image.author}</small>
                                </div>
                                <ul id="imageList" className="list-group list-group-flush">
                                    <li className="list-group-item">
                                        <p className="text-center"><img className="img-fluid img-item" src={`https://ipfs.infura.io/ipfs/${image.hash}`} /></p>
                                        <p>{image.description}</p>
                                    </li>
                                    <li className="list-group-item py-2">
                                        <small className="float-left mt-1 text-muted">
                                            TIPS: {window.web3.utils.fromWei(image.tipAmount.toString(), 'Ether')} ETH
                                        </small>
                                        <button
                                            className="btn btn-link btn-sm float-right pt-0"
                                            onClick={event => {
                                                const { id } = image;
                                                const tipAmount = window.web3.utils.toWei('0.05', 'Ether')
                                                this.props.tipImageAuthor(id, tipAmount)
                                            }}
                                        >
                                            TIP 0.05 ETH
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    )
                })}
            </div>
        );
    }
}

export default ImageList;
