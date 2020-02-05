import React, {Component} from 'react';
import './App.scss';

import axios from 'axios'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

import Header from './components/Header'
import Footer from './components/Footer'
import Content from './components/List'
import AddForm from './components/AddForm'
import Detail from './components/Detail'

class App extends Component {
  
  constructor(props) {
    super(props)
    this.state = {
      albumData:[{title:"",artist:""}]
    }
    this.loadData()
    this.addAlbum = this.addAlbum.bind(this)
    this.renderDetail = this.renderDetail.bind(this)
    this.removeAlbum = this.removeAlbum.bind(this)
    this.updateAlbum = this.updateAlbum.bind(this)
  }


  // Load the Json file
  async loadData () {
    let data = await axios.get('/data/song.json');
    data = data.data
    
    for (let i = 0; i < data.length; i++) {
      data[i]['key'] = this.hash(data[i].title)
    }
    
    this.setState({albumData:data})
  }


  //Adds the values from the form to the app state
  addAlbum (formInfo) {
    let albums = this.state.albumData

    albums.push({
      title:formInfo.album, artist:formInfo.band
    })

    this.setState({albumData:albums})
  }


  // Update the an album in the state
  updateAlbum (event) {
    event.preventDefault()

    const form = event.target
    const newLst = this.state.albumData.map((current) => {

      const key = parseInt(form.key.value)

      if (key !== current.key) {return current}

      return {
        title:form.title.value, 
        artist:form.artist.value,
        key:key
      }
    })

    this.setState({albumData:newLst});
  }


  // Remove an album in the app state
  removeAlbum (event) {
    event.preventDefault()

    const albumID = parseInt(event.target.value)

    const newLst = this.state.albumData.filter(current => current.key !== albumID)

    this.setState({albumData:newLst});
  }


  // Used to create the album ID/key based on the title
  hash (title) {
    let sum = 0;
    for (var i = 0; i < title.length; i++) {
      sum += title.charCodeAt(i);
    }
    sum *= 9901
    return sum % 65536
  }


  // Used to render either the detail page
  renderDetail (props) {
    const albumID = parseInt(props.match.params.id);    
    const currentAlbum = this.state.albumData && this.state.albumData.find(album => album.key === albumID);

    if (currentAlbum) {
      return <Detail album={currentAlbum} onDelete={this.removeAlbum} update={this.updateAlbum}/>

    } else {
      return <Redirect to="/" />
    }
  }


  render() {
    let actionFunctions = {
      addValue:this.addAlbum
    }
    return (
      <div className="App">
        <Router>
          <Header/>
          <Switch>
            <Route path="/add">
              <AddForm addValue={this.addAlbum}/>
            </Route>
            <Route path="/detail/:id" render={this.renderDetail}>
            </Route>
            <Route path="/">
              <Content data={this.state.albumData} functions={actionFunctions}/>
            </Route>
          </Switch>
          <Footer/>
        </Router>
      </div>
    );
  }
}

export default App;
