import Navbar from "../../containers/Navbar";
import { useUser } from "../../hooks/useUser";
import { useEffect, useState } from "react";
import axios from "axios";
import CreateUserForm from "../../containers/forms/CreateUserForm";
import { FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

interface User {
  id: string;
  name: string;
  email: string;
  address: string;
  role: string;
  store_rating?: number;
  created_at: string;
}

interface Store {
  id: string;
  name: string;
  email: string;
  address: string;
  average_rating: number;
  created_at: string;
  owner_name: string;
  owner_email: string;
  owner_address: string;
}

interface Rating {
  id: string;
}

interface UserFilters {
  name: string;
  email: string;
  address: string;
  role: string;
  sortBy: string;
  sortOrder: string;
}

interface StoreFilters {
  name: string;
  email: string;
  address: string;
  sortBy: string;
  sortOrder: string;
}

function AdminDashboard() {
  const user = useUser();
  const [isUsersLoading, setIsUsersLoading] = useState(false);
  const [isRatingsLoading, setIsRatingsLoading] = useState(false);
  const [isStoreLoading, setIsStoresLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);

 
  const [userFilters, setUserFilters] = useState<UserFilters>({
    name: '',
    email: '',
    address: '',
    role: '',
    sortBy: 'name',
    sortOrder: 'ASC'
  });

  const [storeFilters, setStoreFilters] = useState<StoreFilters>({
    name: '',
    email: '',
    address: '',
    sortBy: 'name',
    sortOrder: 'ASC'
  });

  const showMessage = (message: string) => {
    setMessage(message);
    setTimeout(() => {
      setMessage("");
    }, 2000);
  }

  const handleGetUsers = async (filters: UserFilters) => {
    setIsUsersLoading(true);
    try {
      const params = new URLSearchParams();

      if (filters.name) params.append('name', filters.name);
      if (filters.email) params.append('email', filters.email);
      if (filters.address) params.append('address', filters.address);
      if (filters.role) params.append('role', filters.role);
      params.append('sortBy', filters.sortBy);
      params.append('sortOrder', filters.sortOrder);

      const response = await axios.get(`${API_BASE_URL}/api/user/getUsers?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });

      setUsers(response.data.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setMessage(error.response?.data?.message || "An error occurred");
      } else {
        const genericError = error as Error;
        showMessage(genericError.message || "An unexpected error occurred");
      }
    } finally {
      setIsUsersLoading(false);
    }
  }

  const handleGetStores = async (filters: StoreFilters) => {
    setIsStoresLoading(true);
    try {
      const params = new URLSearchParams();

      if (filters.name) params.append('name', filters.name);
      if (filters.email) params.append('email', filters.email);
      if (filters.address) params.append('address', filters.address);
      params.append('sortBy', filters.sortBy);
      params.append('sortOrder', filters.sortOrder);

      const response = await axios.get(`${API_BASE_URL}/api/store/getStores?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });

      setStores(response.data.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setMessage(error.response?.data?.message || "An error occurred");
      } else {
        const genericError = error as Error;
        showMessage(genericError.message || "An unexpected error occurred");
      }
    } finally {
      setIsStoresLoading(false);
    }
  }

  const handleGetRatings = async () => {
    setIsRatingsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/rating/getRatings`, {
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

  const applyUserFilters = () => {
    handleGetUsers(userFilters);
  };

  const applyStoreFilters = () => {
    handleGetStores(storeFilters);
  };

  const resetUserFilters = () => {
    setUserFilters({
      name: '',
      email: '',
      address: '',
      role: '',
      sortBy: 'name',
      sortOrder: 'ASC'
    });
    handleGetUsers({
      name: '',
      email: '',
      address: '',
      role: '',
      sortBy: 'name',
      sortOrder: 'ASC'
    });
  };

  const resetStoreFilters = () => {
    setStoreFilters({
      name: '',
      email: '',
      address: '',
      sortBy: 'name',
      sortOrder: 'ASC'
    });
    handleGetStores({
      name: '',
      email: '',
      address: '',
      sortBy: 'name',
      sortOrder: 'ASC'
    });
  };

  useEffect(() => {
    handleGetUsers(userFilters);
    handleGetStores(storeFilters);
    handleGetRatings();
  }, []);

  return (
    <div className="md:h-full p-3">
      <div className="h-full p-1 md:p-4">
        <Navbar heading="Admin Dashboard" />
        <div className="md:flex w-full md:justify-center md:items-center">
          <div className="md:min-w-2xl lg:min-w-2xl md:px-4">
            <div className="border-1 rounded-2xl border-gray-200 p-4 flex flex-col items-start justify-center my-12 shadow-xl">
              <p className="text-[22px] font-[700] md:text-[32px] text-[#232323] ">Welcome, {user.name}</p>
              <p className="text-[18px] md:text-[22px] font-[400] text-[#969696] py-4 ">Email: {user.email}</p>
            </div>

            <div className="flex">
              <div className="border-1 rounded-2xl border-gray-200 p-4 flex flex-col items-center justify-center m-1 shadow-xl">
                <p className="text-[22px] font-[700] md:text-[32px] text-[#232323] ">Total Users</p>
                <p className="text-[18px] md:text-[22px] font-[400] text-[#969696] py-4">{users.length}</p>
              </div>
              <div className="border-1 rounded-2xl border-gray-200 p-4 flex flex-col items-center justify-center m-1 shadow-xl">
                <p className="text-[22px] font-[700] md:text-[32px] text-[#232323] ">Total Stores</p>
                <p className="text-[18px] md:text-[22px] font-[400] text-[#969696] py-4">{stores.length}</p>
              </div>
              <div className="border-1 rounded-2xl border-gray-200 p-4 flex flex-col items-center justify-center m-1 shadow-xl">
                <p className="text-[22px] font-[700] md:text-[32px] text-[#232323] ">Total Ratings</p>
                <p className="text-[18px] md:text-[22px] font-[400] text-[#969696] py-4">{ratings.length}</p>
              </div>
            </div>

            <CreateUserForm handleGetUsers={() => handleGetUsers(userFilters)} />

            {/* Users List */}
            <div className="my-4">
              <div className="text-[20px] md:text-[25px] font-[400] text-left mb-3">Users</div>

              {/* User Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <TextField
                    id="name"
                    label="Filter By Name"
                    variant="outlined"
                    value={userFilters.name}
                    onChange={(e) => setUserFilters(prev => ({ ...prev, ["name"]: e.target.value }))}
                    className="w-full"
                    size="small"
                  />
                </div>
                <div>
                  <TextField
                    id="email"
                    label="Filter By Email"
                    variant="outlined"
                    value={userFilters.email}
                    onChange={(e) => setUserFilters(prev => ({ ...prev, ["email"]: e.target.value }))}
                    className="w-full"
                    size="small"
                  />
                </div>
                <div>
                  <TextField
                    id="address"
                    label="Filter By Address"
                    variant="outlined"
                    value={userFilters.address}
                    onChange={(e) => setUserFilters(prev => ({ ...prev, ["address"]: e.target.value }))}
                    className="w-full"
                    size="small"
                  />
                </div>
                <div>
                  <FormControl fullWidth size="small">
                    <InputLabel id="demo-select-small-label">Role</InputLabel>
                    <Select
                      labelId="demo-select-small-label"
                      id="demo-select-small"
                      value={userFilters.role}
                      label="Role"
                      onChange={(e) => setUserFilters(prev => ({ ...prev, ["role"]: e.target.value }))}
                    >
                      <MenuItem value={""}>All Roles</MenuItem>
                      <MenuItem value={"admin"}>Admin</MenuItem>
                      <MenuItem value={"owner"}>Store Owner</MenuItem>
                      <MenuItem value={"user"}>User</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div>
                  <FormControl fullWidth size="small">
                    <InputLabel id="demo-select-small-label">Sort By</InputLabel>
                    <Select
                      labelId="demo-select-small-label"
                      id="demo-select-small"
                      value={userFilters.sortBy}
                      label="Sort By"
                      onChange={(e) => setUserFilters(prev => ({ ...prev, ["sortBy"]: e.target.value }))}
                    >
                      <MenuItem value={"name"}>Name</MenuItem>
                      <MenuItem value={"email"}>Email</MenuItem>
                      <MenuItem value={"address"}>Address</MenuItem>
                      <MenuItem value={"role"}>Role</MenuItem>
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
                      value={userFilters.sortOrder}
                      label="Sort Order"
                      onChange={(e) => setUserFilters(prev => ({ ...prev, ["sortOrder"]: e.target.value }))}
                    >
                      <MenuItem value={"ASC"}>Ascending</MenuItem>
                      <MenuItem value={"DESC"}>Descending</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className="flex items-end space-x-2">
                  <button
                    onClick={applyUserFilters}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Apply Filters
                  </button>
                  <button
                    onClick={resetUserFilters}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                  >
                    Reset
                  </button>
                </div>
              </div>

              <div>
                {isUsersLoading ? <div>Loading...</div> :
                  <>
                    {users.length === 0 ? (
                      <p className="text-gray-500">No Users found.</p>
                    ) : (
                      users.map((user, index) => (
                        <div
                          key={index}
                          className="border rounded-2xl border-gray-200 p-4 shadow-lg mb-4"
                        >
                          <div className="flex items-start justify-between">
                            <h3 className="text-[16px] md:text-[20px] font-[400]">
                              {user.name}
                            </h3>
                            <h4>{user.email}</h4>
                            <h5 className="capitalize">Role: {user.role}</h5>
                          </div>

                          <div className="mt-2 flex justify-between">
                            <p className="text-sm text-gray-600">Address: {user.address}</p>
                            <p className="text-sm text-gray-500">Joined: {new Date(user.created_at).toLocaleDateString()}</p>
                          </div>

                          {user.role === 'owner' && user.store_rating !== undefined && (
                            <div className="flex items-start justify-start mt-2">
                              <h6 className="text-sm font-semibold">Store Rating: {user.store_rating}/5</h6>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </>
                }
              </div>
            </div>

            {/* Stores List*/}
            <div className="my-4">
              <div className="text-[20px] md:text-[25px] font-[400] text-left mb-3">Stores</div>

              {/* Store Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                <div>
                   <TextField
                    id="name"
                    label="Filter By Name"
                    variant="outlined"
                    value={storeFilters.name}
                    onChange={(e) => setStoreFilters(prev => ({ ...prev, ["name"]: e.target.value }))}
                    className="w-full"
                    size="small"
                  />
                </div>
                <div>
                   <TextField
                    id="email"
                    label="Filter By Email"
                    variant="outlined"
                    value={storeFilters.email}
                    onChange={(e) => setStoreFilters(prev => ({ ...prev, ["email"]: e.target.value }))}
                    className="w-full"
                    size="small"
                  />
                </div>
                <div>
                  <TextField
                    id="address"
                    label="Filter By Address"
                    variant="outlined"
                    value={storeFilters.address}
                    onChange={(e) => setStoreFilters(prev => ({ ...prev, ["address"]: e.target.value }))}
                    className="w-full"
                    size="small"
                  />
                </div>
                <div>
                 <FormControl fullWidth size="small">
                    <InputLabel id="demo-select-small-label">Sort By</InputLabel>
                    <Select
                      labelId="demo-select-small-label"
                      id="demo-select-small"
                      value={storeFilters.sortBy}
                      label="Sort By"
                      onChange={(e) => setStoreFilters(prev => ({ ...prev, ["sortBy"]: e.target.value }))}
                    >
                      <MenuItem value={"name"}>Name</MenuItem>
                      <MenuItem value={"email"}>Email</MenuItem>
                      <MenuItem value={"address"}>Address</MenuItem>
                      <MenuItem value={"role"}>Role</MenuItem>
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
                      value={storeFilters.sortOrder}
                      label="Sort Order"
                      onChange={(e) => setStoreFilters(prev => ({ ...prev, ["sortOrder"]: e.target.value }))}
                    >
                      <MenuItem value={"ASC"}>Ascending</MenuItem>
                      <MenuItem value={"DESC"}>Descending</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className="flex items-end space-x-2">
                  <button
                    onClick={applyStoreFilters}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Apply Filters
                  </button>
                  <button
                    onClick={resetStoreFilters}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                  >
                    Reset
                  </button>
                </div>
              </div>

              <div>
                {isStoreLoading ? <div>Loading...</div> :
                  <>
                    {stores.length === 0 ? (
                      <p className="text-gray-500">No Stores found.</p>
                    ) : (
                      stores.map((store, index) => (
                        <div
                          key={index}
                          className="border rounded-2xl border-gray-200 p-4 shadow-lg mb-4"
                        >
                          <div className="flex items-start justify-between">
                            <h3 className="text-[16px] md:text-[20px] font-[400]">
                              {store.name}
                            </h3>
                            <h4>{store.email}</h4>
                            <h5 className="font-semibold">Rating: {store.average_rating}/5</h5>
                          </div>

                          <div className="mt-2 flex justify-between">
                            <p className="text-sm text-gray-600">Address: {store.address}</p>
                            <p className="text-sm text-gray-500"> Created: {new Date(store.created_at).toLocaleDateString()}</p>
                          </div>

                          <div className="mt-2 pt-2 border-t border-gray-100 flex justify-start">
                            <p className="text-sm font-medium">Owner: {store.owner_name}</p>
                            <p className="text-sm text-gray-600">, Email: {store.owner_email}</p>
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
    </div>
  )
}

export default AdminDashboard;