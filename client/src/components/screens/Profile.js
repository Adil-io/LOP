import React, {useState, useEffect, useContext} from 'react'
import {UserContext} from '../../App'
import M from 'materialize-css'

const Profile = () => {
    const [myPosts, setMyPosts] = useState([])
    const {state, dispatch} = useContext(UserContext)
    const [pic, setPic] = useState('')

    useEffect(() => {
        fetch('/my-posts', {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('jwt')}`
            }
        })
        .then(res => res.json())
        .then(result => setMyPosts(result.myPost))
    }, [])

    useEffect(() => { 
        if(pic) {
            console.log('Updating Pic')
            const data = new FormData()
            data.append('file', pic)
            data.append('upload_preset', 'insta-clone')
            data.append('cloud_name', 'anheart')
    
            fetch('https://api.cloudinary.com/v1_1/anheart/image/upload', {
                method: 'post',
                body: data
            })
            .then(res => res.json())
            .then(data => {
                console.log(data.url)
                fetch('/updatePic', {
                    method: 'put',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                    },
                    body: JSON.stringify({
                        picUrl: data.url
                    })
                })
                .then(res => res.json())
                .then(result => {
                    console.log(result)
                    localStorage.setItem('user', JSON.stringify({...state, picUrl: result.picUrl}))
                    dispatch({type: 'UPDATEPIC', payload: result.picUrl})
                })
                .catch(err => M.toast({html: err, classes: '#c62828 red darken-3'}))
            })
        }

    }, [pic])

    const uploadPic = (picFile) => {
        setPic(picFile)
    }

    return (
        <div style={{maxWidth: "550px", margin: "0px auto"}}>
            <div style={{
                margin: "18px 0px",
                borderBottom: "1px solid grey"
            }}>
                <div style={{
                    display: "flex",
                    justifyContent: "space-around",
                }}>
                    <div>
                        <img style={{width: "160px", height: "160px", borderRadius: "80px"}} 
                        src={state ? state.picUrl : ''} alt="Not available" />
                    </div>
                    <div>
                        <h4>{state ? state.name : 'Loading..'}</h4>
                        <h5>{state ? state.email : 'Loading..'}</h5>
                        <div style={{display: "flex", justifyContent: "space-between", width: "108%"}}>
                            <h6>{state ? myPosts.length : "0"} posts</h6>
                            <h6>{state ? state.followers.length : "0"} followers</h6>
                            <h6>{state ? state.following.length : "0"} following</h6>
                        </div>
                    </div>
                </div>
                <div className="file-field input-field"
                    style={{
                        margin: "20px 0px 20px 52px"
                    }} 
                >
                    <div className="btn waves-effect waves-light #64b5f6 blue darken-1">
                        <span>Upload Image</span>
                        <input type="file" onChange={(e) => uploadPic(e.target.files[0])} />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
                </div>
            </div>
            {
                myPosts.length !== 0 ?
                <div className="gallery">
                {
                    myPosts.map(post => {
                        return (
                            <img key={post._id} className="item" src={post.photo} alt={post.title} />
                        )
                    })
                }
                </div>             
                : 
                <h5 style={{margin: '50px', textAlign: 'center'}}>You should post something!</h5>
            }          
        </div>
    )
}

export default Profile
