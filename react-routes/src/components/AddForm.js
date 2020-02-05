import React, { Component } from 'react';
import {Redirect} from "react-router-dom";

class AddValue extends Component {
  

  constructor (props) {
    super(props)
    this.state = {
      album:"",
      band:""
    }
    this.submitForm = this.submitForm.bind(this);
    this.formChange = this.formChange.bind(this);
  }

  // Send the saved data to the parent
  submitForm (event) {
    event.preventDefault();
    this.props.addValue(this.state);
    
    this.setState({
      album:"",
      band:""
    })

    return <Redirect to="/"/>
  }

  // Save the changes to the form
  formChange (event) {
    let value = event.target.value;
    let name = event.target.name;

    this.setState({
      [name]:value
    })
  }

  // Display the two buttons for the input form
  render () {
    return(
      <form onSubmit={this.submitForm}>
        <label>Album Name</label>
        <input name="album" type="TextField" onChange={this.formChange} value={this.state.album} required={true} />
        <label>Band Name</label>
        <input name="band" type="TextField" onChange={this.formChange} value={this.state.band} required={true} />
        <button>Submit</button>
      </form>
    )
  }
}

export default AddValue