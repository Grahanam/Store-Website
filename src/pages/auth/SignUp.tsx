import { TextField } from "@mui/material"
import { useState } from "react"
import axios from "axios"
import { FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput } from "@mui/material"

import bgImg from '../../assets/backgroundImg.jpg'
import Logoicon from "../../components/icons/Logoicon";
import { Link, useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

function SignUp() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState("");
    const [address, setAddress] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false)

    const navigate = useNavigate();

    const showMessage = (message: string) => {
        setMessage(message);
        setTimeout(() => {
            setMessage("");
        }, 2000);
    }

    const handleSignUp = async () => {
        setIsLoading(true);
        setMessage("");
        try {
            const response = await axios.post(`${API_BASE_URL}/api/auth/signup`, {
                name,
                email,
                address,
                password
            });
            showMessage(response.data.message);
            // Store token and user data
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            navigate('/');

        } catch (error) {
            if (axios.isAxiosError(error)) {
                showMessage(error.response?.data?.message || "An error occurred");
            } else {
                const genericError = error as Error;
                showMessage(genericError.message || "An unexpected error occurred");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    return (
        <div className="md:flex md:h-full p-3">
            <div className="md:w-[40%] h-full md:p-4">
                <div className="logo md:h-[5%] flex justify-center place-items-center md:justify-start">
                    <Logoicon />
                    <div className="text-[24px] font-[600]">
                        HD
                    </div>
                </div>
                <div className="md:flex w-full md:h-[95%] md:justify-center md:items-center ">
                    <div className="w-full px-4">
                        <div>
                            <div className="pt-4">
                                <div className="text-[32px] font-[700] md:text-[40px] text-[#232323]">Sign Up</div>
                            </div>
                            <div className="text-[16px] md:text-[18px] font-[400] text-[#969696] py-4">Sign up to enjoy the feature of HD</div>
                        </div>
                        <div>
                            <form className="py-1">
                                <div className="pt-1 pb-3">
                                    <TextField
                                        id="name"
                                        label="Your Name"
                                        variant="outlined"
                                        className="w-full"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        disabled={isLoading}
                                    />
                                </div>
                                <div className="pt-1 pb-3">
                                    <TextField
                                        id="email"
                                        label="Email"
                                        variant="outlined"
                                        className="w-full"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={isLoading}
                                    />
                                </div>
                                <div className="pt-1 pb-3">
                                    <TextField
                                        id="address"
                                        label="Address"
                                        variant="outlined"
                                        className="w-full"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        disabled={isLoading}
                                    />
                                </div>
                                <div className="pt-1 pb-3">
                                    <FormControl className="w-full" variant="outlined">
                                        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                                        <OutlinedInput
                                            id="outlined-adornment-password"
                                            type={showPassword ? 'text' : 'password'}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label={showPassword ? 'hide the password' : 'display the password'}
                                                        onClick={handleClickShowPassword}
                                                        onMouseDown={handleMouseDownPassword}
                                                        edge="end"
                                                    >
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                            label="Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            disabled={isLoading}
                                        />
                                    </FormControl>
                                </div>
                                <div className="pt-1 pb-3">

                                    <button
                                        className="w-full rounded-md bg-[#367AFF] py-2 px-4 border border-transparent text-center text-[16px] md:text-[18px] text-white font-[600] transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                        type="button"
                                        disabled={isLoading || !password}
                                        onClick={handleSignUp}
                                    >
                                        {isLoading ? "Verifying..." : "Sign Up"}
                                    </button>

                                </div>
                                <div className="h-5">
                                    {message && (
                                        <div className={`pt-1 pb-3 text-center ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                                            {message}
                                        </div>
                                    )}
                                </div>
                            </form>
                            <div>
                                <span className="text-[14px] md:text-[18px] font-[400]">Already have a account? </span>
                                <span className="text-[14px] md:text-[18px]  font-[400] text-[#367AFF]"><Link to="/login">Sign In</Link></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="hidden md:flex md:w-[60%] md:h-full"  >
                <div className="w-full h-full bg-cover bg-center rounded-xl" style={{ backgroundImage: `url(${bgImg})` }}>
                </div>
            </div>
        </div>
    )
}


export default SignUp