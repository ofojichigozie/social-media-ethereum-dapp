import React, { Component } from 'react';
import './App.css';

class AddImage extends Component {
    
    constructor(props){
        super(props);
    }

    render() {
        return(
            <div id="content" className="shadow p-3 mb-5 bg-white rounded mt-1">
                <h5 className="mb-3">Share image</h5>
                <form
                    onSubmit={event => {
                        event.preventDefault()
                        const description = this.imageDescription.value
                        this.props.uploadImage(description)
                    }} 
                >
                    <div className="form-group">
                        <input
                            type='file'
                            accept=".jpg, .jpeg, .png, .bmp, .gif"
                            onChange={this.props.captureFile}
                        />
                    </div>
                    <div className="form-group">
                        <input
                            id="imageDescription"
                            type="text"
                            ref={input => { this.imageDescription = input }}
                            className="form-control"
                            placeholder="Image description..."
                            required />
                    </div>
                    <div className="form-group d-flex justify-content-end">
                        <button
                            type="submit"
                            className="btn btn-secondary btn-lg"
                        >
                            Upload
                        </button>
                    </div>
                </form>
            </div>
        );
    }
}

export default AddImage;
