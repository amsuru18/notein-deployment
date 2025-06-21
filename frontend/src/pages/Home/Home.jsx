import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import NoteCard from "../../components/Cards/NoteCard";
import { MdAdd } from "react-icons/md";
import AddEditNotes from "./AddEditNotes";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import EmptyCard from "../../components/EmptyCard/EmptyCard";
import { ToastContainer, toast } from "react-toastify";

const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [allNotes, setAllNotes] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const [isSearch, setIsSearch] = useState(false);

  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleEdit = (noteDetails) => {
    setOpenAddEditModal({ isShown: true, data: noteDetails, type: "edit" });
  };

  const getallNotes = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/note/all`, {
        withCredentials: true,
      });
      setLoading(false);

      if (res.data && res.data.notes) {
        setAllNotes(res.data.notes);
      }
    } catch (error) {
      setLoading(false);
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
      console.log("An unexpected error occurred. Please try again");
    }
  };

  const deleteNote = async (noteId) => {
    try {
      setLoading(true);
      const res = await axios.delete(`${API_BASE_URL}/note/delete/` + noteId, {
        withCredentials: true,
      });
      setLoading(false);

      if (res.data && !res.data.error) {
        toast.success(res.data.message);
        getallNotes();
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const onSearchNote = async (query) => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/note/search`, {
        params: { query },
        withCredentials: true,
      });
      setLoading(false);
      if (res.data && res.data.notes) {
        setIsSearch(true);
        setAllNotes(res.data.notes);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const handleClearSearch = () => {
    setIsSearch(false);
    getallNotes();
  };

  const updateIsPinned = async (noteId) => {
    try {
      const res = await axios.put(
        `${API_BASE_URL}/note/update-note-pinned/` + noteId,
        {},
        {
          withCredentials: true,
        }
      );

      if (res.data && res.data.note) {
        toast.success(res.data.message);
        getallNotes();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
    getallNotes();
  }, [currentUser]);

  return (
    <>
      <Navbar
        onSearchNote={onSearchNote}
        handleClearSearch={handleClearSearch}
      />
      <div className="container mx-auto">
        {allNotes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
            {allNotes.map((item, index) => (
              <NoteCard
                key={item._id}
                title={item.title}
                date={item.createdAt}
                content={item.content}
                tags={item.tags}
                isPinned={item.isPinned}
                onEdit={() => handleEdit(item)}
                onDelete={() => deleteNote(item._id)}
                onPinNote={() => updateIsPinned(item._id)}
              />
            ))}
          </div>
        ) : (
          <EmptyCard isSearch={isSearch} />
        )}
      </div>

      <button
        className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10"
        onClick={() => {
          setOpenAddEditModal({ isShown: true, type: "add", data: null });
        }}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
          },
        }}
        contentLabel=""
        className="w-[90%] sm:w-[60%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 "
      >
        <AddEditNotes
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={() => {
            setOpenAddEditModal({ isShown: false, type: "add", data: null });
          }}
          getallNotes={getallNotes}
        />
      </Modal>
      <ToastContainer />
    </>
  );
};

export default Home;
