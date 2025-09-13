import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Box, FormControl, IconButton, InputAdornment, InputLabel, MenuItem, Modal, OutlinedInput, Select, TextField, Typography, type SelectChangeEvent } from "@mui/material";
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
    name: string;
    email: string;
    password: string;
    role: string;
    address: string;
}

interface IStore {
    name: string;
    email: string;
    address: string;
}

type CreateUserFormProps={
    handleGetUsers:()=>void;
}

const CreateUserForm:React.FC<CreateUserFormProps>=({handleGetUsers})=> {
    const user = useUser();

    const [message, setMessage] = useState('')
    const [open, setOpen] = useState(false);
    const [isCreatingUser, setIsCreatingUser] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false)
    const [createOwner, setCreateOwner] = useState(false)
    const [newUser, setNewUser] = useState<IUser>({
        name: "",
        email: "",
        address: "",
        password: "",
        role: ""
    });

    const [store, setStore] = useState<IStore>({
        name: "",
        email: "",
        address: "",
    })

    const handleOpen = () => {
        setOpen(true)
        setMessage('');
    };

    const handleClose = () => {
        setOpen(false);
        setMessage('');
    }
    const handleRoleChange = (event: SelectChangeEvent) => {
        if (event.target.value == "owner") {
            setCreateOwner(true);
        } else {
            setCreateOwner(false);
        }
        setNewUser((prev) => ({ ...prev, ["role"]: event.target.value as string }));
    };

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleCreateUser = async () => {
        setIsCreatingUser(true);
        try {
            const response = await axios.post(`${API_BASE_URL}/api/user/create`,
                {
                    name: newUser.name,
                    email: newUser.email,
                    address: newUser.address,
                    password: newUser.password,
                    role: newUser.role,
                    storeName:store.name,
                    storeEmail:store.email,
                    storeAddress:store.address,
                },
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    },
                }
            );
            if (response.status === 201) {
                setNewUser((prev) => ({
                    ...prev,
                    ["name"]: "",
                    ["email"]: "",
                    ["password"]: "",
                    ["address"]: "",
                    ["role"]: "user",
                }))
                setStore((prev) => ({
                    ...prev,
                    ["name"]: "",
                    ["email"]: "",
                    ["address"]: "",
                }))
                handleClose();
                handleGetUsers();
                showMessage("New User Created!");
            }

        } catch (error) {
            if (axios.isAxiosError(error)) {
                showMessage(error.response?.data?.message || "An error occurred");
            } else {
                const genericError = error as Error;
                showMessage(genericError.message || "An unexpected error occurred");
            }
        } finally {
            setIsCreatingUser(false);
        }
    };

    const showMessage = (message: string) => {
        setMessage(message);
        setTimeout(() => {
            setMessage("");
        }, 2000);
    }
    return <>
        <div className="mt-10">
            <button
                className="w-full rounded-md bg-[#367AFF] py-2 px-4 border border-transparent text-center text-[16px] md:text-[18px] text-white font-[600] transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                type="button"
                onClick={handleOpen}
            >Create New User </button>
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
                        New User
                    </Typography>
                    <div className="pt-1 pb-3">
                        <TextField
                            id="name"
                            label="Your Name"
                            variant="outlined"
                            className="w-full"
                            value={newUser.name}
                            onChange={(e) => setNewUser((prev) => ({ ...prev, ["name"]: e.target.value }))}
                            disabled={isLoading}
                        />
                    </div>
                    <div className="pt-1 pb-3">
                        <TextField
                            id="email"
                            label="Email"
                            variant="outlined"
                            className="w-full"
                            value={newUser.email}
                            onChange={(e) => setNewUser((prev) => ({ ...prev, ["email"]: e.target.value }))}
                            disabled={isLoading}
                        />
                    </div>
                    <div className="pt-1 pb-3">
                        <TextField
                            id="address"
                            label="Address"
                            variant="outlined"
                            className="w-full"
                            value={newUser.address}
                            onChange={(e) => setNewUser((prev) => ({ ...prev, ["address"]: e.target.value }))}
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
                                value={newUser.password}
                                onChange={(e) => setNewUser((prev) => ({ ...prev, ["password"]: e.target.value }))}
                                disabled={isLoading}
                            />
                        </FormControl>
                    </div>
                    <div className="pt-1 pb-3">
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Role</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={newUser.role}
                                label="Role"
                                onChange={handleRoleChange}
                            >
                                <MenuItem value={"admin"}>Admin</MenuItem>
                                <MenuItem value={"owner"}>Store Owner</MenuItem>
                                <MenuItem value={"user"}>User</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    {createOwner ? <>
                        <div className="pt-1 pb-3">
                            <TextField
                                id="storeName"
                                label="Store Name"
                                variant="outlined"
                                className="w-full"
                                value={store.name}
                                onChange={(e) => setStore((prev) => ({ ...prev, ["name"]: e.target.value }))}
                                disabled={isLoading}
                            />
                        </div>
                        <div className="pt-1 pb-3">
                            <TextField
                                id="storeAddress"
                                label="Store Address"
                                variant="outlined"
                                className="w-full"
                                value={store.address}
                                onChange={(e) => setStore((prev) => ({ ...prev, ["address"]: e.target.value }))}
                                disabled={isLoading}
                            />
                        </div>
                        <div className="pt-1 pb-3">
                            <TextField
                                id="storeEmail"
                                label="Store Email"
                                variant="outlined"
                                className="w-full"
                                value={store.email}
                                onChange={(e) => setStore((prev) => ({ ...prev, ["email"]: e.target.value }))}
                                disabled={isLoading}
                            />
                        </div>
                    </> : <>

                    </>}

                    <div className="pt-1 pb-3">
                        <button
                            className="w-full rounded-md bg-[#367AFF] py-2 px-4 border border-transparent text-center text-[16px] md:text-[18px] text-white font-[600] transition-all shadow-md hover:shadow-lg  focus:shadow-none active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                            onClick={handleCreateUser}
                            disabled={!createOwner ? isCreatingUser || !newUser.name || !newUser.role || !newUser.email || !newUser.address || !newUser.password
                                :
                                isCreatingUser || !newUser.name || !newUser.role || !newUser.email || !newUser.address || !newUser.password || !store.name || !store.email || !store.address}
                        >
                            {isCreatingUser ? "Creating..." : "Create"}
                        </button>
                    </div>
                </Box>
            </Modal>
        </div>
    </>
}

export default CreateUserForm;