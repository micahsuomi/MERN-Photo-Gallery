import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { getUser } from "../../redux/actions/userActions";
import useUser from "../../hooks/useUser";
import PhotoItem from "../../components/PhotoItem";

import "./style.scss";

const CurrentUser = ({
  id,
  avatar,
  name,
  email,
  medium,
  bio,
  photos,
  isEditPopupOpen,
  closePopup,
  isUserPage,
  userProfile,
}) => {
  const closePopupOnClick = () => {
    closePopup();
  };

  console.log(
    id,
    avatar,
    name,
    email,
    medium,
    bio,
    photos,
    isEditPopupOpen,
    closePopup,
    isUserPage,
    userProfile,)

  return (
      <>
        <div className="user-details">
          <h1>
            {name} Dashboard
          </h1>
          <p>{email}</p>
          <div className="user-details__image-container">
            {avatar === undefined || avatar === "" ? 
              <img
                src="https://i2.wp.com/www.winhelponline.com/blog/wp-content/uploads/2017/12/user.png?fit=256%2C256&quality=100&ssl=1"
                alt={name}
              />
            : 
              <img src={avatar} alt={name} />
            }
          </div>
          <p>
          {medium !== undefined && medium.length > 0 ? (
            <p>
              {" "}
              Medium used:
              {medium.map((m) => (
                <span>{m} </span>
              ))}
            </p>
          ) : (
            <p>No medium listed</p>
          )}
        </p>
          <p>{bio}</p>
          <div>
            <NavLink to={`/edituser/${id}`} className="user-details__edit">
              <button className="user-details__update-btn grow">
                Update Profile
              </button>
            </NavLink>
          </div>
        </div>

        {isEditPopupOpen && (
          <div className="photo-added__popup__container">
            <div className="photo-added__popup">
              <div className="photo-added__popup__header">
                <i
                  className="fas fa-times-circle fa-2x grow"
                  onClick={closePopupOnClick}
                ></i>
              </div>
              <div className="photo-added__popup__body">
                <h3>User Profile Updated!</h3>
              </div>
            </div>
          </div>
        )}
        <div className="photo-gallery__container">
          <h1>User Gallery</h1>
         {photos !== undefined && photos.length < 1 ? (
            <h1>This user has not posted any pictures</h1>
          ) : (
           <h4>{photos.length} photos</h4>
          )}
          <div className="photo-gallery__wrapper">
            {photos.map((photo) => (
              <PhotoItem
                key={photo._id}
                id={photo._id}
                title={photo.title}
                image={photo.image}
                description={photo.description}
                author={photo.author.name}
                authorId={photo.author.id}
                authorImg={photo.author.avatar}
                likes={photo.likes}
                comments={photo.comments}
                isUserPage={isUserPage}
              />
            ))}
        </div> 
      </div>
    
      </>
     
  );
};

export default CurrentUser;