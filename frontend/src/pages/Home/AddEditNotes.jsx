import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import TagInput from "../../components/Input/TagInput ";
import axios from "axios";
import { toast } from "react-toastify";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AddEditNotes = ({ onClose, noteData, type, getAllNotes }) => {
  const [title, setTitle] = useState(noteData?.title || "");
  const [content, setContent] = useState(noteData?.content || "");
  const [tags, setTags] = useState(noteData?.tags || []);
  const [error, setError] = useState(null);

  //   Edit Note
  const editNote = async () => {
    const noteId = noteData._id;
    console.log(noteId);

    try {
      const res = await axios.post(
        `${API_BASE_URL}/note/edit/` + noteId,
        { title, content, tags },
        { withCredentials: true }
      );

      console.log(res.data);

      if (res.data.success === false) {
        console.log(res.data.message);
        setError(res.data.message);
        toast.error(res.data.message);
        return;
      }

      toast.success(res.data.message);
      getAllNotes();
      onClose();
    } catch (error) {
      toast.error(error.message);
      console.log(error.message);
      setError(error.message);
    }
  };

  //   Add Note
  const addNewNote = async () => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/note/add`,
        { title, content, tags },
        { withCredentials: true }
      );

      if (res.data.success === false) {
        console.log(res.data.message);
        setError(res.data.message);
        toast.error(res.data.message);

        return;
      }

      toast.success(res.data.message);
      getAllNotes();
      onClose();
    } catch (error) {
      toast.error(error.message);
      console.log(error.message);
      setError(error.message);
    }
  };

  const handleAddNote = () => {
    if (!title) {
      toast.error("Please enter the title");
      return;
    }

    if (!content) {
      toast.error("Please enter the content");
      return;
    }

    setError("");

    if (type === "edit") {
      editNote();
    } else {
      addNewNote();
    }
  };

  return (
    <div className="relative w-full max-w-md sm:max-w-lg md:max-w-lg lg:max-w-lg max-h-[600px] md:max-h-[540px] mx-auto overflow-y-visible bg-white dark:bg-dark800 rounded-2xl shadow-2xl p-2 sm:p-3 md:p-4 flex flex-col gap-2 sm:gap-3 md:gap-4 animate-fade-in border border-primary-100 dark:border-primary-900/40 min-w-0 mt-1 sm:mt-2 md:mt-2">
      <div className="flex items-center justify-between gap-2 pt-2 sm:pt-0 mb-1">
        <label className="input-label text-primary-600 dark:text-primary-400 uppercase tracking-wide m-0 text-base sm:text-lg md:text-xl font-bold">
          Title
        </label>
        <button
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-dark700 transition-colors duration-200 z-50"
          onClick={onClose}
          aria-label="Close"
        >
          <MdClose className="text-lg sm:text-xl text-gray-400 dark:text-gray-500" />
        </button>
      </div>
      <div className="flex flex-col gap-1">
        <input
          type="text"
          className="text-sm sm:text-base md:text-lg font-semibold input-box bg-transparent dark:bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-primary-300 py-1.5 sm:py-2"
          placeholder="Wake up at 6 a.m."
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="input-label text-primary-600 dark:text-primary-400 uppercase tracking-wide text-base sm:text-lg md:text-xl font-bold">
          Content
        </label>
        <textarea
          className="text-xs sm:text-sm md:text-base input-box bg-primary-50 dark:bg-dark700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-primary-300 h-[80px] sm:h-[90px] md:h-[100px] resize-none py-1.5 sm:py-2 overflow-y-auto"
          placeholder="Content..."
          value={content}
          onChange={({ target }) => setContent(target.value)}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="input-label text-primary-600 dark:text-primary-400 uppercase tracking-wide text-base sm:text-lg md:text-xl font-bold">
          Tags
        </label>
        <TagInput tags={tags} setTags={setTags} />
      </div>
      <button
        className="btn-primary font-semibold text-xs sm:text-sm md:text-base mt-1 py-1.5 sm:py-2 rounded-xl shadow-md hover:shadow-xl transition-all duration-200"
        onClick={handleAddNote}
      >
        {type === "edit" ? "Update Note" : "Add Note"}
      </button>
    </div>
  );
};

export default AddEditNotes;
