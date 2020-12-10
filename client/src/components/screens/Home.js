import React, {useState, useEffect, useContext} from 'react'
import { UserContext } from '../../App'
import {Link} from 'react-router-dom'

const Home = () => {
    const [posts, setPosts] = useState([])
    const {state, dispatch} = useContext(UserContext)

    useEffect(() => {
        fetch('/all-posts', {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('jwt')}`
            }
        })
        .then(res => res.json())
        .then(result => {
            console.log(result)
            setPosts(result.posts)
        })
    }, [])

    const likePost = (id) => {
        fetch('/like', {
            method: 'put',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('jwt')}`
            },
            body: JSON.stringify({
                postId: id
            })
        })
        .then(res => res.json())
        .then(result => {
            //console.log(result)
            const postsArray = posts.map(post => {
                if(post._id === result._id)
                    return result
                else
                    return post
            })
            setPosts(postsArray)
        })
    }

    const unlikePost = (id) => {
        fetch('/unlike', {
            method: 'put',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('jwt')}`
            },
            body: JSON.stringify({
                postId: id
            })
        })
        .then(res => res.json())
        .then(result => {
            //console.log(result)
            const postsArray = posts.map(post => {
                if(post._id === result._id)
                    return result
                else
                    return post
            })
            setPosts(postsArray)
        })
    }

    const makeComment = (text, postId) => {
        fetch('/comment', {
            method: 'put',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('jwt')}`
            },
            body: JSON.stringify({
                postId,
                text
            })
        })
        .then(res => res.json())
        .then(result => {
            //console.log(result)
            const postsArray = posts.map(post => {
                if(post._id === result._id)
                    return result
                else
                    return post
            })
            setPosts(postsArray)
        })
    }

    const deletePost = (postId) => {
        fetch(`/deletePost/${postId}`, {
            method: 'delete',
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('jwt')}`
            }
        })
        .then(res => res.json())
        .then(result => {
            const postArray = posts.filter(post => {
                return post._id !== result._id
            })
            setPosts(postArray)
        })
    }

    const deleteComment = (postId, commentId) => {
        fetch(`/deleteComment/${postId}/${commentId}`, {
            method: 'delete',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('jwt')}`
            }
        })
        .then(res => res.json())
        .then(result => {
            const postArray = posts.map(post => {
                if(post._id === result._id) {
                    return result
                }
                else {
                    return post
                }
            })
            setPosts(postArray)
        })
    }

    return (

        <div className="home">
            {
                posts.map(post => {
                    return (
                        <div className="card home-card" key={post._id}>
                            <h5>
                                <img className="postUserPic" src={post.postedBy.picUrl} />
                                <Link to={post.postedBy._id !== state._id ? 
                                    "/profile/"+post.postedBy._id : "/profile" }>
                                    {post.postedBy.name}
                                </Link>
                                {
                                    post.postedBy._id === state._id
                                    &&
                                    <i className="material-icons"
                                        onClick={()=>deletePost(post._id)}
                                        style={{marginLeft: 'auto', float: 'right'}}
                                    >delete</i>
                                }
                            </h5>
                            <div className="card-image">
                                <img src={post.photo} alt="Not Available" />
                            </div>
                            <div className="card-content">
                                {
                                    post.likes.includes(state._id) 
                                    ?
                                    <i className="material-icons"
                                        onClick={()=>unlikePost(post._id)}
                                        style={{color: 'red'}}
                                    >favorite</i>
                                    :
                                    <i className="material-icons"
                                        onClick={()=>likePost(post._id)}
                                        style={{color: 'red'}}
                                    >favorite_outline</i>
                                    
                                }
                                <h6>{post.likes.length} likes</h6>
                                <h6>{post.title}</h6>
                                <p>{post.body}</p>
                                {
                                    post.comments.map(comment => {
                                        return(
                                        <h6 className="comment" key={comment._id}>
                                            <span style={{fontWeight: "500"}}>{comment.commentedBy.name}</span> {comment.text}
                                            {
                                                comment.commentedBy._id === state._id
                                                &&
                                                <i className="material-icons delComment"                                    
                                                    style={{float: 'right'}}
                                                    onClick={()=>deleteComment(post._id, comment._id)}
                                                >backspace</i>
                                            }
                                        </h6>
                                        )
                                    })
                                }
                                <form onSubmit={(e) => {
                                    e.preventDefault()
                                    makeComment(e.target[0].value, post._id)
                                    e.target[0].value = ''
                                }}>
                                    <input type="text" placeholder="add a comment" />
                                </form>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default Home
