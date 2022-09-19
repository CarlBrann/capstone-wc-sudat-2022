import React ,{useState} from 'react'
import {auth} from '../database/firebase'
import {useNavigate, Link} from 'react-router-dom'
import {createUserWithEmailAndPassword, sendEmailVerification} from 'firebase/auth'
import {useAuthValue} from '../database/AuthContext'
import '../App.css';
import {db} from '../database/firebase'
import {collection, addDoc} from 'firebase/firestore'
// design
import {
    TextField,
    InputAdornment,
    IconButton,
    OutlinedInput,
    FormControl,
    InputLabel,
    Button,
    Box,
    FormHelperText,
    selectClasses,
} from '@mui/material';

function Register() {

    /*** 
     Declare state hooks 
     ***/
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const {setTimeActive} = useAuthValue()

    /*** 
     @function validatePassword() returns true if *password* and *confirm* match and do not match the empty string
     ***/    
    const validatePassword = () => {
        let isValid = true
        if (password !== '' && confirmPassword !== ''){
        if (password !== confirmPassword) {
            isValid = false
            setError('Passwords does not match')
        }
        }
        return isValid
    }

    /*** 
     @function register() ensures that the provided password is valid, then creates a user account with the
     provided credentials.
     It also renders all the necessary GUI components to the screen. 
     ***/
    const register = e => {
        e.preventDefault()
        setError('')
        if(validatePassword()) {
        // Create a new user with email and password using firebase
            createUserWithEmailAndPassword(auth, email, password)
            .then(() => {
                setTimeActive(true)
                navigate('/LandingPage')
            }).catch((err) => alert(err.message))
            
        //Add user to collection as well
        {addUserToCollection(e)}
        
        }
        setEmail('')
        setPassword('')
        setConfirmPassword('')
    }
    const addUserToCollection = async (e) => {
        e.preventDefault()
        try {
          await addDoc(collection(db, 'Users'), {
            email: email,
            isAdmin: false
          })
          console.log("Submitting")
        } catch (err) {
          alert(err)
        }
      }

    return (
        <header>
            <Box margin= "8px"  sx= {{  padding:"20px", bgcolor: 'darkblue', color: "white", border:"1px solid #82d4e4be", borderRadius: "20px"}}>
                <div className='loginHeader'>
                    <label> 
                        Western Cape Substance Use Disorder Assessment Tool
                    </label>         
                </div>
            </Box>
            <div className='container mt-5 mb-5 col-10 col-sm-8 col-md-6 col-lg-5'>
                <br></br>
                <br></br>
                <div className='text-center mb-5 alert alert-secondary'>
                    <label htmlFor="" className="h2"> 
                        Signup
                    </label>
                </div>
                {/* inputs below */}
                <Box bgcolor = "White" sx = {{padding:10,border: "1px solid grey", borderRadius: "10px" }}>
                    <div >
                        {error && 
                            <div className='auth__error'>
                                {error}
                            </div>
                        }
                        <form onSubmit={register} name='registration_form'>
                            <div className="form-group">
                                <TextField 
                                    size="small" 
                                    variant="outlined"
                                    className="form-control"
                                    placeholder="Enter your email"
                                    label="Email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                />
                            </div>
                            <br></br>  
                            <div className="form-group">  
                                <TextField 
                                    size="small" 
                                    variant="outlined"
                                    className="form-control"
                                    placeholder="Enter your password"
                                    label="Password"
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />
                            </div>
                            <br></br>  
                            <div className="form-group">
                                <TextField 
                                    size="small" 
                                    variant="outlined"
                                    className="form-control"
                                    placeholder="Retype password"
                                    label="Confirm Password"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                />
                            </div>
                            <br></br> 
                            <div className="text-center mt-4">
                                <Button variant="contained"
                                        sx={{bgcolor :"darkblue" , color : "white", border: "2px solid #82d4e4be"}} 
                                        type='submit'>Register</Button>
                            </div>
                        </form>
                        <div className="text-center mt-4">
                            <span >
                                Already have an account?  
                                <Link to='/'>login</Link>
                            </span>
                        </div>
                    </div>
                </Box>
            </div>
        </header>
    )
}

export default Register