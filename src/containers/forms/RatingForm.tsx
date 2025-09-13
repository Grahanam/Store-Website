import { Box, FormControl,InputLabel, MenuItem, Modal, Select, Typography } from "@mui/material";
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

type RatingFormProps = {
    handleGetStores: () => void;
    store_id: string;
    owner_id:string;
    create:boolean;
    rating:number
}

const RatingForm: React.FC<RatingFormProps> = ({ store_id,owner_id,create,rating, handleGetStores }) => {
    const user = useUser();
    const [newRating, setNewRating] = useState(rating??5);
    const [isGiveRating, setIsGiveRating] = useState(false);

    const [message, setMessage] = useState('')
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true)
        setMessage('');
    };

    const handleClose = () => {
        setOpen(false);
        setMessage('');
    }
    const showMessage = (message: string) => {
        setMessage(message);
        setTimeout(() => {
            setMessage("");
        }, 2000);
    }

    const handleGiveRating = async () => {
        setIsGiveRating(true);
        try {
            const response = await axios.post(`${API_BASE_URL}/api/rating/create`,
                {
                    rating: newRating,
                    storeId: store_id,
                    ownerId: owner_id
                },
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    },
                }
            );
            if (response.status === 201) {
                setNewRating(5);
                handleClose();
                handleGetStores();
                showMessage("New Rating Created!");
            }

        } catch (error) {
            if (axios.isAxiosError(error)) {
                showMessage(error.response?.data?.message || "An error occurred");
            } else {
                const genericError = error as Error;
                showMessage(genericError.message || "An unexpected error occurred");
            }
        } finally {
            setIsGiveRating(false);
        }
    }

    const handleUpdateRating = async () => {
        setIsGiveRating(true);
        try {
            const response = await axios.put(`${API_BASE_URL}/api/rating/update`,
                {
                    rating: newRating,
                    storeId: store_id,
                    ownerId: owner_id
                },
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    },
                }
            );
            if (response.status === 201) {
                setNewRating(5);
                handleClose();
                handleGetStores();
                showMessage("Rating Updated!");
            }

        } catch (error) {
            if (axios.isAxiosError(error)) {
                showMessage(error.response?.data?.message || "An error occurred");
            } else {
                const genericError = error as Error;
                showMessage(genericError.message || "An unexpected error occurred");
            }
        } finally {
            setIsGiveRating(false);
        }
    }


    return <>
        <div className="mt-2">
            <p className="mb-4">Rate the store now</p>
            <button
                className="w-full rounded-md bg-[#367AFF] py-2 px-4 border border-transparent text-center text-[16px] md:text-[18px] text-white font-[600] transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                type="button"
                onClick={handleOpen}
            >{create?"Give Rating":"Update Rating"}</button>
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
                        Give Rating
                    </Typography>
                    <div className="pt-1 pb-3">
                        <FormControl fullWidth size="small">
                            <InputLabel id="demo-select-small-label">Rate</InputLabel>
                            <Select
                                labelId="demo-select-small-label"
                                id="demo-select-small"
                                value={newRating}
                                label="Rating"
                                onChange={(e) => setNewRating(e.target.value)}
                            >
                                <MenuItem value={1}>1: Bad</MenuItem>
                                <MenuItem value={2}>2: Satisfactory</MenuItem>
                                <MenuItem value={3}>3: Ok</MenuItem>
                                <MenuItem value={4}>4: Good</MenuItem>
                                <MenuItem value={5}>5: Best</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <div className="pt-1 pb-3">
                        {create?<>
                         <button
                            className="w-full rounded-md bg-[#367AFF] py-2 px-4 border border-transparent text-center text-[16px] md:text-[18px] text-white font-[600] transition-all shadow-md hover:shadow-lg  focus:shadow-none active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                            onClick={() => handleGiveRating()}
                            disabled={!newRating}>
                            Give Rating
                            {/* {isCreatingUser ? "Creating..." : "Create"} */}
                        </button>
                        </>:<>
                         <button
                            className="w-full rounded-md bg-[#367AFF] py-2 px-4 border border-transparent text-center text-[16px] md:text-[18px] text-white font-[600] transition-all shadow-md hover:shadow-lg  focus:shadow-none active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                            onClick={() => handleUpdateRating()}
                            disabled={!newRating}>
                            Update Rating
                            {/* {isCreatingUser ? "Creating..." : "Create"} */}
                        </button>
                        </>}
                       
                    </div>
                </Box>
            </Modal>
        </div>
    </>
}

export default RatingForm;