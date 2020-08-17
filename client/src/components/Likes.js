import React, { Component } from 'react';
import axios from 'axios';
import Like from './Like';
import {NavLink} from 'react-router-dom';
import '../assets/style/likes.css';

class Likes extends Component {
    constructor(props) {
        super(props)
        this.state = {
            likes: []

        }
        
    }
    componentDidMount() {
        const id = this.props.match.params.id
        const url = `/api/photos/${id}/likes`;
        axios.get(url)
        .then(res => 
            this.setState({
                likes: res.data
            })
    
        )
    
    }
    
    render() {
        const {likes} = this.state;
        const formattedLikes = likes.map((like) => (
        <Like key={like._id}
              userId={like._id}
              name={like.name}
              avatar={like.avatar}/>
        ))
        return (
            <div className="likes-container">
                <div className="likes-wrapper">
                <div className="likes-header">
                <NavLink to ={`/photos/${this.props.match.params.id}`}>
                <i className="fas fa-times fa-2x grow"></i>
                </NavLink>
                </div>
                <h2>Likes</h2>
                {formattedLikes}
                </div>
            </div>
        )
    }
}

export default Likes

