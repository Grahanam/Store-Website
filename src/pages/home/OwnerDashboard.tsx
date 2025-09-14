import { useEffect, useState } from "react";
import Navbar from "../../containers/Navbar";
import { useUser } from "../../hooks/useUser";
import axios from "axios";
import { FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import UpdateUserForm from "../../containers/forms/UpdateUserForm";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

interface RatingFilters {
  sortBy: string;
  sortOrder: string;
}

interface Rating {
  id: string;
  rating: number;
  created_at: string;
  owner_id: string;
  user_name: string;
  user_email: string;
  user_id: string;
}

function OwnerDashboard() {
  let user = useUser();
  let [store, setStore] = useState({ name: "", email: "", address: "", id: "", average_rating: null });
  const [isStoreLoading, setIsStoreLoading] = useState(false)
  const [isRatingsLoading, setIsRatingsLoading] = useState(false)
  const [message, setMessage] = useState('');
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [ratingFilters, setRatingFilters] = useState<RatingFilters>({
    sortBy: 'created_at',
    sortOrder: 'ASC'
  });

  const showMessage = (message: string) => {
    setMessage(message);
    setTimeout(() => {
      setMessage("");
    }, 2000);
  }

  const handleSingleStores = async () => {
    setIsStoreLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/store/getSingleStore`, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });

      let store = response.data.data
    
      setStore((prev) => ({ ...prev, ["name"]: store.name, ["email"]: store.email, ["address"]: store.address, ["id"]: store.id, ["average_rating"]: store.average_rating }));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setMessage(error.response?.data?.message || "An error occurred");
      } else {
        const genericError = error as Error;
        showMessage(genericError.message || "An unexpected error occurred");
      }
    } finally {
      setIsStoreLoading(false);
    }
  }

  const handleGetRatings = async (filters: RatingFilters) => {
    setIsRatingsLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('sortBy', filters.sortBy);
      params.append('sortOrder', filters.sortOrder);

      const response = await axios.get(`${API_BASE_URL}/api/store/getStoreUserRatings?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });

      setRatings(response.data.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setMessage(error.response?.data?.message || "An error occurred");
      } else {
        const genericError = error as Error;
        showMessage(genericError.message || "An unexpected error occurred");
      }
    } finally {
      setIsRatingsLoading(false);
    }
  }

  const applyRatingFilters = () => {
    handleGetRatings(ratingFilters);
  };

  const resetRatingFilters = () => {
    setRatingFilters({
      sortBy: 'created_at',
      sortOrder: 'ASC'
    });
    handleGetRatings({
      sortBy: 'created_at',
      sortOrder: 'ASC'
    });
  };

  useEffect(() => {
    handleSingleStores();
    handleGetRatings(ratingFilters);
  }, [])

  return (
    <div className="md:h-full p-3">
      <div className="h-full p-1 md:p-4">
        <Navbar heading="Shop Owner Dashboard" />
        <div className="md:flex w-full md:justify-center md:items-center">
          <div className="md:min-w-2xl lg:min-w-2xl md:px-4">
            <div className="border-1 rounded-2xl border-gray-200 p-4 flex flex-col items-start justify-center my-12 shadow-xl">

              <p className="text-[22px] font-[700] md:text-[32px] text-[#232323] ">Welcome, {user.name}</p>

              <p className="text-[18px] md:text-[22px] font-[400] text-[#969696] py-2 ">Email: {user.email}</p>
              <UpdateUserForm/>
            </div>
            <div className="border-1 rounded-2xl border-gray-200 p-4 flex flex-col items-start justify-center my-5 shadow-xl">
              <h4>Shop Details</h4>
              <p className="text-[22px] font-[700] md:text-[32px] text-[#232323] "> {store.name}</p>
              <p className="text-[18px] md:text-[22px] font-[400] text-[#969696] py-1 ">Email: {store.email}</p>
              <p className="text-[18px] md:text-[22px] font-[400] text-[#969696] py-1 ">Address: {store.address}</p>
            </div>

            {/* Stores List*/}
            <div className="my-4">
              <div className="text-[20px] md:text-[25px] font-[400] text-left mb-3">User Ratings</div>

              {/* Store Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <FormControl fullWidth size="small">
                    <InputLabel id="demo-select-small-label">Sort By</InputLabel>
                    <Select
                      labelId="demo-select-small-label"
                      id="demo-select-small"
                      value={ratingFilters.sortBy}
                      label="Sort By"
                      onChange={(e) => setRatingFilters(prev => ({ ...prev, ["sortBy"]: e.target.value }))}
                    >
                      <MenuItem value={"rating"}>Rating</MenuItem>
                      <MenuItem value={"created_at"}>Created At</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div>
                  <FormControl fullWidth size="small">
                    <InputLabel id="demo-select-small-label">Sort Order</InputLabel>
                    <Select
                      labelId="demo-select-small-label"
                      id="demo-select-small"
                      value={ratingFilters.sortOrder}
                      label="Sort Order"
                      onChange={(e) => setRatingFilters(prev => ({ ...prev, ["sortOrder"]: e.target.value }))}
                    >
                      <MenuItem value={"ASC"}>Ascending</MenuItem>
                      <MenuItem value={"DESC"}>Descending</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className="flex items-end space-x-2">
                  <button
                    onClick={applyRatingFilters}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Apply Filters
                  </button>
                  <button
                    onClick={resetRatingFilters}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>

            <div>
              {isStoreLoading ? <div>Loading...</div> :
                <>
                  {ratings.length === 0 ? (
                    <p className="text-gray-500">No Ratings Found.</p>
                  ) : (
                    ratings.map((rating, index) => (
                      <div
                        key={index}
                        className="border rounded-2xl border-gray-200 p-4 shadow-lg mb-4 min-w-3xs"
                      >
                        <div className="flex items-start justify-between">
                          <h3 className="text-[16px] md:text-[20px] font-[400]">
                            {rating.user_name}
                          </h3>
                          <h4>{rating.user_email}</h4>
                          <h5 className="font-semibold">Rating Given: {rating.rating}/5</h5>
                        </div>

                        <div className="mt-2 flex justify-between">
                          <p className="text-sm text-gray-500"> Created: {new Date(rating.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))
                  )}
                </>
              }
            </div>


          </div>
        </div>
      </div>
    </div>
  )
}


export default OwnerDashboard