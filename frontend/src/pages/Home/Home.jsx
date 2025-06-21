import React, { useEffect, useState } from "react";
import NoteCard from "../../components/Cards/NoteCard";
import { FiPlus } from "react-icons/fi";
import Modal from "react-modal";
import AddEditNotes from "./AddEditNotes";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import axios from "axios";
import { toast } from "react-toastify";
import EmptyCard from "../../components/EmptyCard/EmptyCard";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Home = () => {
  const { currentUser, loading, errorDispatch } = useSelector(
    (state) => state.user
  );

  const [userInfo, setUserInfo] = useState(null);
  const [allNotes, setAllNotes] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  useEffect(() => {
    if (currentUser === null || !currentUser) {
      navigate("/login");
    } else {
      setUserInfo(currentUser?.rest);
      getAllNotes();
    }
  }, []);

  // get all notes
  const getAllNotes = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${API_BASE_URL}/note/all`, {
        withCredentials: true,
      });

      if (res.data.success === false) {
        console.log(res.data);
        return;
      }

      setAllNotes(res.data.notes);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load notes");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (noteDetails) => {
    setOpenAddEditModal({ isShown: true, data: noteDetails, type: "edit" });
  };

  // Delete Note
  const deleteNote = async (data) => {
    const noteId = data._id;

    try {
      const res = await axios.delete(`${API_BASE_URL}/note/delete/` + noteId, {
        withCredentials: true,
      });

      if (res.data.success === false) {
        toast.error(res.data.message);
        return;
      }

      toast.success(res.data.message);
      getAllNotes();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const onSearchNote = async (query) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/note/search`, {
        params: { query },
        withCredentials: true,
      });

      if (res.data.success === false) {
        console.log(res.data.message);
        toast.error(res.data.message);
        return;
      }

      setIsSearch(true);
      setAllNotes(res.data.notes);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleClearSearch = () => {
    setIsSearch(false);
    getAllNotes();
  };

  const updateIsPinned = async (noteData) => {
    const noteId = noteData._id;

    try {
      const res = await axios.put(
        `${API_BASE_URL}/note/update-note-pinned/` + noteId,
        { isPinned: !noteData.isPinned },
        { withCredentials: true }
      );

      if (res.data.success === false) {
        toast.error(res.data.message);
        console.log(res.data.message);
        return;
      }

      toast.success(res.data.message);
      getAllNotes();
    } catch (error) {
      console.log(error.message);
    }
  };

  // Separate pinned and unpinned notes
  const pinnedNotes = allNotes.filter((note) => note.isPinned);
  const unpinnedNotes = allNotes.filter((note) => !note.isPinned);

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar
        userInfo={userInfo}
        onSearchNote={onSearchNote}
        handleClearSearch={handleClearSearch}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="loading-dots">
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        ) : allNotes.length > 0 ? (
          <div className="space-y-8">
            {/* Pinned Notes Section */}
            {pinnedNotes.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <span className="w-1 h-6 bg-primary-500 rounded-full mr-3"></span>
                  Pinned Notes
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {pinnedNotes.map((note) => (
                    <NoteCard
                      key={note._id}
                      title={note.title}
                      date={note.createdAt}
                      content={note.content}
                      tags={note.tags}
                      isPinned={note.isPinned}
                      onEdit={() => handleEdit(note)}
                      onDelete={() => deleteNote(note)}
                      onPinNote={() => updateIsPinned(note)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* All Notes Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <span className="w-1 h-6 bg-gray-400 dark:bg-primary-700 rounded-full mr-3"></span>
                {isSearch ? "Search Results" : "All Notes"}
                {!isSearch && (
                  <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                    ({allNotes.length})
                  </span>
                )}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {unpinnedNotes.map((note) => (
                  <NoteCard
                    key={note._id}
                    title={note.title}
                    date={note.createdAt}
                    content={note.content}
                    tags={note.tags}
                    isPinned={note.isPinned}
                    onEdit={() => handleEdit(note)}
                    onDelete={() => deleteNote(note)}
                    onPinNote={() => updateIsPinned(note)}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <EmptyCard
            message={
              isSearch
                ? "No notes match your search. Try a different keyword."
                : "You have no notes yet. Start by creating your first note!"
            }
            isSearch={isSearch}
          />
        )}
      </div>

      {/* Floating Add Button */}
      <button
        className="fixed bottom-8 right-8 z-40 bg-primary-600 hover:bg-primary-700 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200"
        onClick={() =>
          setOpenAddEditModal({ isShown: true, type: "add", data: null })
        }
        title="Add Note"
      >
        <FiPlus className="w-8 h-8" />
      </button>

      {/* Add/Edit Note Modal */}
      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() =>
          setOpenAddEditModal({ isShown: false, type: "add", data: null })
        }
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 dark:bg-black/60"
        overlayClassName="fixed inset-0 z-40"
        ariaHideApp={false}
      >
        <div className="flex items-center justify-center w-full h-full pt-20 sm:pt-24">
          <AddEditNotes
            onClose={() =>
              setOpenAddEditModal({ isShown: false, type: "add", data: null })
            }
            noteData={openAddEditModal.data}
            type={openAddEditModal.type}
            getAllNotes={getAllNotes}
          />
        </div>
      </Modal>
    </div>
  );
};

export default Home;
