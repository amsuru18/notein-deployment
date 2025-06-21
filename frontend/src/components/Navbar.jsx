import React, { useState } from "react";
import ProfileInfo from "./Cards/ProfileInfo";
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar/SearchBar";
import { useSelector, useDispatch } from "react-redux";
import {
  signOutUserStart,
  signOutUserFailure,
  signOutUserSuccess,
} from "../redux/user/userSlice";
import axios from "axios";

const Navbar = ({ onSearchNote, handleClearSearch }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleSignout = async () => {
    dispatch(signOutUserStart());
    try {
      const res = await axios.get(`${API_BASE_URL}/auth/signout`, {
        withCredentials: true,
      });
      if (res.data.success === false) {
        dispatch(signOutUserFailure(res.data.message));
        return;
      }
      dispatch(signOutUserSuccess());
      navigate("/login");
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  const handleSearch = () => {
    if (searchQuery) {
      onSearchNote(searchQuery);
    }
  };

  const onClearSearch = () => {
    setSearchQuery("");
    handleClearSearch();
  };

  return (
    <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow">
      <h2 className="text-xl font-medium text-black py-2">NoteIn</h2>
      {currentUser && (
        <>
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            handleSearch={handleSearch}
            onClearSearch={onClearSearch}
          />

          <ProfileInfo onLogout={handleSignout} />
        </>
      )}
    </div>
  );
};

export default Navbar;
