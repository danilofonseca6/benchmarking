import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Plus } from "lucide-react";
import { db } from "../../config/firebase.js";

import { getDocs, collection, addDoc, deleteDoc, updateDoc, doc, Timestamp } from "firebase/firestore";
import {Dialog, DialogBackdrop, DialogPanel, DialogTitle} from "@headlessui/react";
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'


const QuizzesTable = () => {
    // Initial setting variables etc
    const [searchTerm, setSearchTerm] = useState("");
    const [dataList, setDataList ] = useState([]);
    const [filteredList, setFilteredList] = useState([]);

    // Setting states for edit modal behaviour
    const [showEditModal, setShowEditModal] = useState(false);
    const [editItem, setEditItem] = useState(null);

    // Setting states for create modal behaviour
    const [showCreateModal, setShowCreateModal] = useState(false);

    // Quiz specific states
    const [newQuizTitle, setNewQuizTitle] = useState("");
    const [newQuizDescription, setNewQuizDescription] = useState("");

    // States for updating the Quizzes
    const quizzesCollectionRef = collection(db, "quizzes");

    // Constants
    const collectionName = "quizzes";
    //
    const [questionDataList, setQuestionDataList] = useState([]);
    const [questionFilteredList, setQuestionFilteredList] = useState([]);
    // Get the Quizzes List

    const getList = async () => {
        try {
            const data = await getDocs(quizzesCollectionRef);
            const filteredData = data.docs.map((doc) =>
                ({
                    ...doc.data(),
                    id: doc.id,
                }));
            setDataList(filteredData);
            setFilteredList(filteredData);

        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getList()
        setFilteredList([...dataList]);

    }, []);

    // Search function

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = dataList.filter(
            (quiz) => quiz.title.toLowerCase().includes(term)
        );
        setFilteredList(filtered);


    };

    // Create Item

    const createItem = async () => {
        try {
            setShowCreateModal(false);
            const docRef = await addDoc(quizzesCollectionRef, {
                title: newQuizTitle,
                description: newQuizDescription,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now(),
            });
            // Create new quiz object with firestoreID
            const newQuiz = {
                id: docRef.id,
                title: newQuizTitle,
                description: newQuizDescription,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now(),
            };

            // Update the local state without fetching from Firestore again
            setDataList((prevQuizzes) => [...prevQuizzes, newQuiz]);
            setFilteredList((prevFilteredList) => [...prevFilteredList, newQuiz]);

            console.log("Quiz created");
        } catch (error) {
            console.error("Error creating quiz: ", error);
        }
    }

    // Update Item

    const updateItem = async () => {
        try {
            setShowEditModal(false)
            const quizDoc = doc(db, collectionName, editItem.id)
            await updateDoc(quizDoc,
                {
                    title: editItem.title,
                    description: editItem.description
                });
            console.log("updateQuizz")
            // Update local state so the table refreshes immediately
            setDataList((prevQuizzes) =>
                prevQuizzes.map((quiz) =>
                    quiz.id === editItem.id ? { ...quiz, title: editItem.title, description: editItem.description } : quiz
                )
            );

            setFilteredList((prevQuizzes) =>
                prevQuizzes.map((quiz) =>
                    quiz.id === editItem.id ? { ...quiz, title: editItem.title, description: editItem.description } : quiz
                )
            );

        }   catch (error) {
            console.error("Error updating quiz:", error);
        }


    }

    // Delete a Quiz

    const deleteItem = async (id) => {
        try {
            const quizDoc = doc(db, collectionName, id);
            await deleteDoc(quizDoc);

            // Remove the quiz from local state to update the table
            setDataList((prevQuizzes) => prevQuizzes.filter((quiz) => quiz.id !== id));
            setFilteredList((prevQuizzes) => prevQuizzes.filter((quiz) => quiz.id !== id));

            console.log("Quiz deleted:", id);
        } catch (error) {
            console.error("Error deleting quiz:", error);
        }
    }

    const getQuestions = async () => {
        try {
            const data = await getDocs(collection(db, "questions"));
            const filteredQuestionData = data.docs.map((doc) =>
                ({
                    ...doc.data(),
                    id: doc.id,
                }));
            setQuestionDataList(filteredQuestionData);
            setQuestionFilteredList(filteredQuestionData);
            console.log(data);
        } catch (error) {
            console.error("Error getting questions:", error);
        }
    }
    const handleCloseEditModal = () => {
        setShowEditModal(false);
    }

    const handleCloseCreateModal = () => {
        setShowCreateModal(false);
    }

    return (
        <motion.div
            className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <div className='flex justify-between items-center mb-6 '>
                <h2 className='text-xl font-semibold text-gray-100'>Quizzes</h2>
                <div className='relative flex items-center'>
                    {/* Clickable Plus Icon */}
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <Plus size={18} />
                    </button>

                    {/* Search Bar with Search Icon */}
                    <div className='relative ml-2'>
                        <input
                            type='text'
                            placeholder='Search quizzes...'
                            className='bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                        <Search className='absolute left-3 top-2.5 text-gray-400' size={18} />
                    </div>
                </div>
            </div>

            <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-700'>
                    <thead>
                    <tr>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                            Title
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                            Description
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                            updatedAt
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                            CreatedAt
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                            Actions
                        </th>
                    </tr>
                    </thead>

                    <tbody className='divide-y divide-gray-700'>
                    {filteredList.map((item) => (
                        <motion.tr
                            key={item.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <td className='px-6 py-4 whitespace-nowrap'>
                                <div className='flex items-center'>
                                    <div className='flex-shrink-0 h-10 w-10'>
                                        <div className='h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center text-white font-semibold'>
                                            {item.title.charAt(0)}
                                        </div>
                                    </div>
                                    <div className='ml-4'>
                                        <div className='text-sm font-medium text-gray-100'>{item.title}</div>
                                    </div>
                                </div>
                            </td>

                            <td className='px-6 py-4 whitespace-nowrap'>
                                <div className='text-sm text-gray-300'>{item.description}</div>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap'>
									<span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-800 text-blue-100'>
										{item.updatedAt && new Date(item.updatedAt.seconds * 1000).toLocaleString()}
									</span>
                            </td>

                            <td className='px-6 py-4 whitespace-nowrap'>
									<span
                                        className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-500 text-white'
                                    >
										{item.createdAt && new Date(item.updatedAt.seconds * 1000).toLocaleString()}
									</span>
                            </td>

                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
                                <button
                                    className='text-indigo-400 hover:text-indigo-300 mr-2'
                                    onClick={() => {
                                        setEditItem(item);
                                        setShowEditModal(true);
                                    }}
                                >
                                    Edit
                                </button>
                                <button
                                    className='text-red-400 hover:text-red-300'
                                    onClick={() => deleteItem(item.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </motion.tr>
                    ))}
                    </tbody>

                </table>
                <button onClick={getQuestions}>
                    This is a button
                </button>
                {/* Create modal */}
                <Dialog open={showCreateModal} onClose={handleCloseCreateModal} className='relative z-10' >
                    <DialogBackdrop
                        transition
                        className="fixed inset-0 bg-gray-800/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
                    />

                    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <DialogPanel
                                transition
                                className="relative transform overflow-hidden rounded-lg bg-gray-800 text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
                            >
                                <div className="bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                            <DialogTitle as="h3" className="text-base font-semibold text-white">
                                                Create
                                            </DialogTitle>
                                            <div className="mt-2 grid grid-cols-[auto,1fr] gap-3 items-center">
                                                <h1 className="text-md text-white text-left">Title:</h1>
                                                <input
                                                    type="text"
                                                    onChange={(e) => setNewQuizTitle(e.target.value)}
                                                    className="bg-gray-700 text-white placeholder-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full max-w-md"
                                                />

                                                <h1 className="text-md text-white text-left">Description:</h1>
                                                <input
                                                    type="text"
                                                    onChange={(e) => setNewQuizDescription(e.target.value)}
                                                    className="bg-gray-700 text-white placeholder-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full max-w-md"
                                                />
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-800 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                    <button
                                        type="button"
                                        data-autofocus
                                        onClick={() => setShowCreateModal(false)}
                                        className="mt-3 inline-flex w-full justify-center rounded-md bg-gray-500 px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => createItem()}
                                        className="inline-flex w-full justify-center rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-blue-300-500 sm:ml-3 sm:w-auto"
                                    >
                                        Create
                                    </button>

                                </div>
                            </DialogPanel>
                        </div>
                    </div>
                </Dialog>
                {/* Edit modal */}
                <Dialog open={showEditModal} onClose={handleCloseEditModal} className='relative z-10' >
                    <DialogBackdrop
                        transition
                        className="fixed inset-0 bg-gray-800/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
                    />

                    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <DialogPanel
                                transition
                                className="relative transform overflow-hidden rounded-lg bg-gray-800 text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
                            >
                                <div className="bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        {/*<div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">*/}
                                        {/*    <ExclamationTriangleIcon aria-hidden="true" className="size-6 text-red-600" />*/}
                                        {/*</div>*/}
                                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                            <DialogTitle as="h3" className="text-base font-semibold text-white">
                                                Edit {editItem?.title || ''}
                                            </DialogTitle>
                                            <div className="mt-2 grid grid-cols-[auto,1fr] gap-3 items-center">
                                                <h1 className="text-md text-white text-left">Title:</h1>
                                                <input
                                                    type="text"
                                                    value={editItem?.title || ""}
                                                    onChange={(e) => setEditItem({ ...editItem, title: e.target.value })}
                                                    className="bg-gray-700 text-white placeholder-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full max-w-md"
                                                />

                                                <h1 className="text-md text-white text-left">Description:</h1>
                                                <input
                                                    type="text"
                                                    value={editItem?.description || ""}
                                                    onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}

                                                    className="bg-gray-700 text-white placeholder-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full max-w-md"
                                                />
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-800 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                    <button
                                        type="button"
                                        data-autofocus
                                        onClick={() => setShowEditModal(false)}
                                        className="mt-3 inline-flex w-full justify-center rounded-md bg-gray-500 px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => updateItem()}
                                        className="inline-flex w-full justify-center rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-blue-300-500 sm:ml-3 sm:w-auto"
                                    >
                                        Update
                                    </button>

                                </div>
                            </DialogPanel>
                        </div>
                    </div>
                </Dialog>
            </div>
        </motion.div>
    );
};
export default QuizzesTable;
