import React, { Component } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import PhotoItem from '../components/PhotoItem';
import '../assets/style/user.css';


class User extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userGallery: [],
            isUserPage: true
        }
    }

    fetchUserData() {
        let foundUser = this.props.users.find((user) => {
            return user._id === this.props.match.params.id
        })
    }
    componentDidMount() {
        const userId = this.props.match.params.id
        // let id = this.props.match.params.id
        axios.get(`/api/user/${userId}`)
        .then(res => {
            console.log(res.data)
            this.setState({
                userGallery: res.data
            })
        })
        this.fetchUserData()
        
    }

    componentWillUnmount() {
        this.setState({
            isUserPage: true
        })
    }

    closePopup = () => {
        this.props.closePopup()
    }

    render() {
        
        let { userGallery } = this.state;
        const id = this.props.match.params.id;
        
       let userPhotos = userGallery.map((photo) => (
            <PhotoItem key={photo._id}
            id={photo._id}
            name={photo.name}
            image={photo.image}
            description={photo.description}
            author={photo.author.name}
            authorId={photo.author.id}
            likes={photo.likes}
            comments={photo.comments}
            isUserPage={this.state.isUserPage} />
))

        
        let author = {
            name: '',
            avatar: '',
            bio: ''
        }
        
        let foundUser = this.props.users.find((user) => {
            return user._id === this.props.match.params.id
        })

        userGallery.find((photo) => {
            // return photo.id === id;
            author.name = photo.author.name;
            author.avatar = photo.author.avatar;
            author.bio = photo.author.bio;
        })
        console.log('user gallery', userGallery)
        return (
            <div>
            {
            this.props.user !== null && this.props.user._id === this.props.match.params.id ?
            <div className="user-details__wrapper">
            <h1>{this.props.user.name} Dashboard</h1>
            <p>{this.props.user.email}</p> 
            <div className="user-image-container">
                {
                    this.props.user.avatar === undefined || this.props.user.avatar === ''
                    ?             
                    <img src='https://i2.wp.com/www.winhelponline.com/blog/wp-content/uploads/2017/12/user.png?fit=256%2C256&quality=100&ssl=1' alt={this.props.user.name}/>
                    :                    
                    <img src={this.props.user.avatar} alt={this.props.user.name}/>

                }
            </div>
            <p>{this.props.user.bio}</p>

            <NavLink to={`/edituser/${id}`} className="edit-user__link">
            <button className="profile-update__btn grow">Update Profile</button>
            </NavLink>
            
            </div>

            :

            <div className="user-details__wrapper">
                {/* if the user doesn't have images the name will not appear */}
                <h1>{foundUser.name}</h1> 
                <div className="user-image-container">
                    {
                        foundUser.avatar === undefined || foundUser.avatar === '' ?
                        <img src='https://i2.wp.com/www.winhelponline.com/blog/wp-content/uploads/2017/12/user.png?fit=256%2C256&quality=100&ssl=1' alt={author.name}/>
                        :
                        <img src={foundUser.avatar} alt={foundUser.name}/>

                    }
                </div>
                <p>{foundUser.bio}</p>
            </div>

        }
        {
                   this.props.isPopupOpen ?
                   <div className="photo-added__popup__container">
                   <div className="photo-added__popup">
                   <div className="photo-added__popup__header">
                   <i className="fas fa-times-circle fa-2x grow" onClick={this.closePopup}></i>
                   </div>
                   <div className="photo-added__popup__body">
                       <h3>User Profile Updated!</h3>
                    </div>
                   </div>
                   </div>
                   :
                   null
               }
            <div className="photo-gallery__container">
            <h1>User Gallery</h1>
                {userGallery.length < 1 ? 
                <h1>This user has not posted any pictures</h1>
            :  
            <h4>{userGallery.length} photos</h4> 
            }
               
                <div className="photo-gallery__wrapper">
                {userPhotos} 
                </div>
            </div>

        </div>
        )
    }
}

export default User;

