import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Box, FormControl, IconButton, InputAdornment, InputLabel, Modal, OutlinedInput,Typography } from "@mui/material";
import { useState } from "react";
import { useUser } from "../../hooks/useUser";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: '16px',
    boxShadow: 24,
    p: 4,
};

interface IUser {
    password: string;
}

type CreateUserFormProps = {
}

const UpdateUserForm: React.FC<CreateUserFormProps> = ({}) => {
    const user = useUser();

    const [message, setMessage] = useState('')
    const [open, setOpen] = useState(false);
    const [isUpdatingUser, setIsUpdatingUser] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false)
    const [User, setUser] = useState<IUser>({
        password: "",
    });

    const handleOpen = () => {
        setOpen(true)
        setMessage('');
    }

    const handleClose = () => {
        setOpen(false);
        setMessage('');
    }

    const handleClickShowPassword = () => setShowPassword((show) => !show)
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    }

    const handleUpdateUser = async () => {
        setIsUpdatingUser(true);
        try {
            const response = await axios.put(`${API_BASE_URL}/api/user/update`,
                {        
                    password: User.password,
                },
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    },
                }
            );
            if (response.status === 201) {
                setUser((prev) => ({
                    ...prev,
                    ["password"]: "",
                }))
                handleClose();
                showMessage("User Password Updated!");
            }

        } catch (error) {
            if (axios.isAxiosError(error)) {
                showMessage(error.response?.data?.message || "An error occurred");
            } else {
                const genericError = error as Error;
                showMessage(genericError.message || "An unexpected error occurred");
            }
        } finally {
            setIsUpdatingUser(false);
        }
    };

    const showMessage = (message: string) => {
        setMessage(message);
        setTimeout(() => {
            setMessage("");
        }, 2000);
    }
    return <>
        <div className="mt-2">
            <button
                className="w-full rounded-md bg-[#367AFF] py-2 px-4 border border-transparent text-center text-[16px] md:text-[18px] text-white font-[600] transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                type="button"
                onClick={handleOpen}
            >Change Password</button>
            <div className="h-5 mt-4">
                {message && (
                    <div className={`pt-1 pb-3 text-center ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                        {message}
                    </div>
                )}
            </div>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2" className="text-center text-[24px] font-bold mb-4">
                        Enter New Password
                    </Typography>
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
                                value={User.password}
                                onChange={(e) => setUser((prev) => ({ ...prev, ["password"]: e.target.value }))}
                                disabled={isLoading}
                            />
                        </FormControl>
                    </div>

                    <div className="pt-1 pb-3">
                        <button
                            className="w-full rounded-md bg-[#367AFF] py-2 px-4 border border-transparent text-center text-[16px] md:text-[18px] text-white font-[600] transition-all shadow-md hover:shadow-lg  focus:shadow-none active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                            onClick={handleUpdateUser}
                            disabled={!User.password}
                        >
                            {isUpdatingUser ? "Updating..." : "Update"}
                        </button>
                    </div>
                </Box>
            </Modal>
        </div>
    </>
}

export default UpdateUserForm;