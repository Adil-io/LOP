import React, {useState, useEffect, useContext} from 'react'
import {UserContext} from '../../App'
import {useParams} from 'react-router-dom'

const Profile = () => {
    const [userProfile, setUserProfile] = useState(null)
    const {state, dispatch} = useContext(UserContext)
    const {userId} = useParams()

    const [showFollow, setShowFollow] = useState(state ? !state.following.includes(userId) : true)

    useEffect(() => {
        fetch(`/user/${userId}`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('jwt')}`
            }
        })
        .then(res => res.json())
        .then(result => {
            console.log(result)
            setUserProfile(result)
        })
    },[])

    const followUser = () => {
        fetch('/follow', {
            method: 'put',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('jwt')}`
            },
            body: JSON.stringify({
                followId: userId
            })
        })
        .then(res => res.json())
        .then(result => {
            console.log(result)
            dispatch({
                type: 'UPDATE',
                payload: {
                    following: result.following,
                    followers: result.followers
                }
            })
            localStorage.setItem('user', JSON.stringify(result))

            setUserProfile((prevState) => {
                return {
                    ...prevState,
                    user: {
                        ...prevState.user,
                        followers: [...prevState.user.followers, result._id]
                    }
                }
            })

            setShowFollow(false)
        })
        .catch(err => console.log(err))
    }

    const unfollowUser = () => {
        fetch('/unfollow', {
            method: 'put',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('jwt')}`
            },
            body: JSON.stringify({
                unfollowId: userId
            })
        })
        .then(res => res.json())
        .then(result => {
            console.log(result)
            dispatch({
                type: 'UPDATE',
                payload: {
                    following: result.following,
                    followers: result.followers
                }
            })
            localStorage.setItem('user', JSON.stringify(result))

            setUserProfile((prevState) => {
                const newFollower = prevState.user.followers.filter(user => user !== result._id)
                console.log(newFollower)
                return {
                    ...prevState,
                    user: {
                        ...prevState.user,
                        followers: newFollower
                    }
                }
            })

            setShowFollow(true)
        })
        .catch(err => console.log(err))
    }

    return (
        <>
            {
                userProfile ?
                <div style={{maxWidth: "550px", margin: "0px auto"}}>
                    <div style={{
                        display: "flex",
                        justifyContent: "space-around",
                        margin: "18px 0px",
                        borderBottom: "1px solid grey"
                    }}>
                        <div>
                            <img style={{width: "160px", height: "160px", borderRadius: "80px"}} 
                            src={userProfile.user.picUrl} alt="Not available" />
                        </div>
                        <div>
                            <h4>{userProfile.user.name}</h4>
                            <h4>{userProfile.user.email}</h4>
                            <div style={{display: "flex", justifyContent: "space-between", width: "108%"}}>
                                <h6>{userProfile.posts.length} posts</h6>
                                <h6>{userProfile.user.followers.length} followers</h6>
                                <h6>{userProfile.user.following.length} follwoing</h6>
                            </div>
                            {
                                showFollow ? 
                                <button className="btn waves-effect waves-light #64b5f6 blue darken-1" 
                                    style={{margin: '10px'}}
                                    onClick={() => followUser()}
                                >
                                    Follow
                                </button> :
                                <button className="btn waves-effect waves-light #64b5f6 blue darken-1" 
                                    style={{margin: '10px'}}
                                    onClick={() => unfollowUser()}
                                >
                                    Unfollow
                                </button>
                            }
                        </div>
                    </div>
                    
                    <div className="gallery">
                        {
                            userProfile.posts.map(post => {
                                return (
                                    <img key={post._id} className="item" src={post.photo} alt={post.title} />
                                )
                            })
                        }
                    </div>
                </div>
                :
                <h2>Loading...</h2>
            }
        </>
    )
}

export default Profile
