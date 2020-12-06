import React, {useState, useEffect, useContext} from 'react'
import {UserContext} from '../../App'

const Profile = () => {
    const [myPosts, setMyPosts] = useState([])
    const {state, dispatch} = useContext(UserContext)

    useEffect(() => {
        fetch('/my-posts', {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('jwt')}`
            }
        })
        .then(res => res.json())
        .then(result => setMyPosts(result.myPost))
    })

    return (
        <div style={{maxWidth: "550px", margin: "0px auto"}}>
            <div style={{
                display: "flex",
                justifyContent: "space-around",
                margin: "18px 0px",
                borderBottom: "1px solid grey"
            }}>
                <div>
                    <img style={{width: "160px", height: "160px", borderRadius: "80px"}} 
                    src="https://images.unsplash.com/photo-1595152772835-219674b2a8a6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60" alt="Not available" />
                </div>
                <div>
                    <h4>{state ? state.name : 'Loading..'}</h4>
                    <div style={{display: "flex", justifyContent: "space-between", width: "108%"}}>
                        <h6>40 posts</h6>
                        <h6>40 followers</h6>
                        <h6>40 follwoing</h6>
                    </div>
                </div>
            </div>
            
            <div className="gallery">
                {
                    myPosts.map(post => {
                        return (
                            <img key={post._id} className="item" src={post.photo} alt={post.title} />
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Profile
