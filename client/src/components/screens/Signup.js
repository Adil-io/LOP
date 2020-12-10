import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import M from 'materialize-css'

const Signup = () => {

    const history = useHistory()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    //const [image, setImage] = useState('')
    const [picUrl, setPicUrl] = useState(undefined)

    useEffect(()=> {
        if(picUrl) {
            PostData()
        }
    }, [picUrl])

    const PostData = () => {
        // if(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i !== email) {
        //     M.toast({html: 'Invalid Email', classes: '#c62828 red darken-3'})
        //     return
        // }

        fetch('/signup', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                email,
                password,
                picUrl
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            if(data.error) {
                M.toast({html: data.error, classes: '#c62828 red darken-3'})
            }
            else {
                M.toast({html: data.message, classes: '#43a047 green darken-1'})
                history.push('/signin')
            }
        })
        .catch(err => console.log(err))
    }

    const uploadPic = (picFile) => {
        const data = new FormData()
        data.append('file', picFile)
        data.append('upload_preset', 'insta-clone')
        data.append('cloud_name', 'anheart')

        fetch('https://api.cloudinary.com/v1_1/anheart/image/upload', {
            method: 'post',
            body: data
        })
        .then(res => res.json())
        .then(data => {
            setPicUrl(data.url)
            console.log(data.url, picUrl)
        })
        .catch(err => console.log(err))
    }

    return (
        <div className="myCard">
            <div className="card auth-card input-field">
                <h2>Inforden</h2>
                <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <div className="file-field input-field">
                    <div className="btn waves-effect waves-light #64b5f6 blue darken-1">
                        <span>Upload Image</span>
                        <input type="file" onChange={(e) => uploadPic(e.target.files[0])} />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
                </div>
                <button className="btn waves-effect waves-light #64b5f6 blue darken-1" 
                    onClick = {() => PostData()}
                >
                    SignUp
                </button>
                <h5>
                    <Link to="/signin">Already have an account ?</Link>
                </h5>
            </div>
        </div>
    )
}

export default Signup
