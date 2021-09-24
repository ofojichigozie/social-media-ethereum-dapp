import React, { Component } from 'react';
import Web3 from 'web3';
import SocialMedia from '../abis/SocialMedia.json';
import Navbar from './Navbar';
import AddImage from './AddImage';
import ImageList from './ImageList';
import './App.css';

//Declare IPFS
import { create } from 'ipfs-http-client';
const ipfsClient = create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      account: '',
      balance: '',
      socialMedia: {},
      imageCount: 0,
      images: [],
      buffer: '',
      loading: true
    }

    this.uploadImage = this.uploadImage.bind(this);
    this.captureFile = this.captureFile.bind(this);
    this.tipImageAuthor = this.tipImageAuthor.bind(this);
  }

  async loadWeb(){
    if (window.ethereum) {
      window.web3 = await new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = await new Web3(window.web3.currentProvider);
    }else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  }

  async loadBlockchainData(){
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    this.setState({account: accounts[0]});
    let balance = await web3.eth.getBalance(accounts[0]);
    balance = await web3.utils.fromWei(balance, 'Ether');
    balance = +(Math.round(balance + "e+4")  + "e-4")
    this.setState({ balance });

    // Load the smart contract
    const networkId = await web3.eth.net.getId();
    const networkObj = SocialMedia.networks[networkId];
    if(networkObj){
      const socialMedia = await web3.eth.Contract(SocialMedia.abi, networkObj.address);
      this.setState({ socialMedia });
      const imageCount = await socialMedia.methods.imageCount().call();
      this.setState({ imageCount });

      // Load images
      for(let i = 1; i <= imageCount; i++){
        const image = await socialMedia.methods.images(i).call();
        this.setState({ 
          images: [...this.state.images, image]
        });
      }

      // Sort images
      this.setState({
        images: this.state.images.sort((a,b) => b.tipAmount - a.tipAmount)
      });

      this.setState({loading: false});
    }else{
      window.alert('Contract not detected on the selected network');
    }
  }

  captureFile(event) {
    event.preventDefault();
    const file = event.target.files[0];
    const fileReader = new window.FileReader();
    fileReader.readAsArrayBuffer(file);

    fileReader.onloadend = () => {
      this.setState({ buffer: Buffer(fileReader.result) });
    }
  }

  async uploadImage(imageDescription){
    this.setState({ loading: true });

    // Upload file to IPFS
    const ipfsFile = await ipfsClient.add(this.state.buffer);
    const hash = ipfsFile.path;

    this.state.socialMedia.methods.uploadImage(hash, imageDescription)
    .send({ from: this.state.account })
    .on('confirmation', (confirmationNumber, receipt) => {
      this.setState({ loading: false });
      console.log({ confirmationNumber, receipt });
    })
    .on('receipt', receipt => {
      this.setState({ loading: false });
      console.log({ receipt });
    })
    .on('error', (error, receipt) => {
      this.setState({ loading: false });
      console.log({ error, receipt });
    });
  }

  tipImageAuthor(imageId, price){
    this.setState({ loading: true });
    this.state.socialMedia.methods.tipImageAuthor(imageId)
    .send({ from: this.state.account, value: price })
    .on('confirmation', (confirmationNumber, receipt) => {
      this.setState({ loading: false });
      console.log({ confirmationNumber, receipt });
    })
    .on('receipt', receipt => {
      this.setState({ loading: false });
      console.log({ receipt });
    })
    .on('error', (error, receipt) => {
      this.setState({ loading: false });
      console.log({ error, receipt });
    });
  }

  async componentWillMount(){
    await this.loadWeb();
    await this.loadBlockchainData();

    // Detect account change and update state
    const self = this;
    window.ethereum.on('accountsChanged', function (accounts) {
      self.setState({ account: accounts[0] });
    })
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} balance={this.state.balance}/>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex">
              { 
                this.state.loading 
                ? 
                  <div id="loader" className="main text-center mt-5">
                    <a>Loading...</a>
                  </div>
                :
                  <div className="main mt-5">
                      <AddImage uploadImage={this.uploadImage} captureFile={this.captureFile}/>
                      <ImageList images={this.state.images} tipImageAuthor={this.tipImageAuthor}/>
                  </div>
              }
              
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
