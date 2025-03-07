import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Trash2 } from "lucide-react";
import { db } from "../../config/firebase.js";

import { getDocs, collection, addDoc, deleteDoc, updateDoc, doc, Timestamp } from "firebase/firestore";
import {Dialog, DialogBackdrop, DialogPanel, DialogTitle} from "@headlessui/react";
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'


const QuestionsTable = () => {
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
    const [newQuestionText, setNewQuestionText] = useState("");
    const [newQuestionType, setNewQuestionType] = useState("");
    const [newQuestionMaxSelections, setNewQuestionMaxSelections] = useState("");
    const [newQuestionOptions, setNewQuestionOptions] = useState([]);
    const [newOption, setNewOption] = useState(""); // Temporary input field value

    // States for updating the Quizzes
    const quizzesCollectionRef = collection(db, "questions");

    // Constant
    const collectionName = "questions";

    const questionTypes = [
        { type: "text", label: "Text Question" },
        { type: "numerical", label: "Numerical Question" },
        { type: "multipleChoice", label: "Mutliple Choice Question" },
        { type: "boolean", label: "Yes or no question" },
        { type: "ranking", label: "Ranking Question" },
    ]

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

    // For Editing Questions

    const handleAddOption = (state, setState) => {
        if (state?.newOption?.trim()) {
            setState({
                ...state,
                options: [...(Array.isArray(state.options) ? state.options : []), state.newOption.trim()],
                newOption: "", // Clear input after adding
            });
        }
    };


    const handleRemoveOptionEdit = (index) => {
        const updatedOptions = editItem.options.filter((_, i) => i !== index);
        setEditItem({ ...editItem, options: updatedOptions });
    };

    const optionsArray = Array.isArray(editItem?.options) ? editItem.options : [];

    useEffect(() => {
        getList()
        setFilteredList([...dataList]);

    }, []);

    // Search function

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = dataList.filter(
            (question) => question.text.toLowerCase().includes(term)
        );
        setFilteredList(filtered);


    };

    // Create Item
    // const [newQuestionOptions, setNewQuestionOptions] = useState([]); // Stores the list of options


    const addOption = () => {
        if (newOption.trim() !== "") {
            setNewQuestionOptions([...newQuestionOptions, newOption.trim()]); // Add option to array
            setNewOption(""); // Clear input field
        }
    };

    const removeOption = (index) => {
        setNewQuestionOptions(newQuestionOptions.filter((_, i) => i !== index));
    };


    const createItem = async () => {
        try {
            setShowCreateModal(false);
            const docRef = await addDoc(quizzesCollectionRef, {
                text: newQuestionText,
                type: newQuestionType,
                maxSelections: newQuestionMaxSelections,
                options: newQuestionOptions,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now(),
            });

            // Create new quiz object with firestoreID
            const newQuestion = {
                id: docRef.id,
                text: newQuestionText,
                type: newQuestionType,
                maxSelections: newQuestionMaxSelections,
                options: newQuestionOptions,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now(),
            };

            // Update the local state
            setDataList((prevQuestions) => [...prevQuestions, newQuestion]);
            setFilteredList((prevFilteredList) => [...prevFilteredList, newQuestion]);

            console.log("Question created");
        } catch (error) {
            console.error("Error creating question: ", error);
        }
    };


    // Update Item

    const updateItem = async () => {
        try {
            setShowEditModal(false)
            const questionDoc = doc(db, collectionName, editItem.id)
            await updateDoc(questionDoc,
                {
                    text: editItem.text,
                    type: editItem.type,
                    maxSelections: editItem.maxSelections,
                    options: editItem.options,
                    updatedAt: Timestamp.now(),
                });
            // Update local state so the table refreshes immediately
            setDataList((prevQuestions) =>
                prevQuestions.map((question) =>
                    question.id === editItem.id ? { ...question, text: editItem.text, type: editItem.type, maxSelections: editItem.maxSelections, options: editItem.options, updatedAt: Timestamp.now() } : question
                )
            );

            setFilteredList((prevQuestions) =>
                prevQuestions.map((question) =>
                    question.id === editItem.id ? { ...question, text: editItem.text, type: editItem.type, maxSelections: editItem.maxSelections, options: editItem.options, updatedAt: Timestamp.now() } : question
                )
            );

        }   catch (error) {
            console.error("Error updating quiz:", error);
        }


    }

    // Delete a Quiz

    const deleteItem = async (id) => {
        try {
            const questionDoc = doc(db, collectionName, id);
            await deleteDoc(questionDoc);

            // Remove the quiz from local state to update the table
            setDataList((prevQuestions) => prevQuestions.filter((question) => question.id !== id));
            setFilteredList((prevQuestions) => prevQuestions.filter((question) => question.id !== id));

            console.log("Quiz deleted:", id);
        } catch (error) {
            console.error("Error deleting quiz:", error);
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
                <h2 className='text-xl font-semibold text-gray-100'>Questions</h2>
                <div className='relative flex items-center'>
                    {/* Clickable Plus Icon */}
                    <button
                        onClick={() => {
                            setShowCreateModal(true);
                            setNewQuestionOptions([]);
                            setNewQuestionType("");
                            setNewQuestionText("");
                            setNewQuestionMaxSelections("");
                            setNewOption("");
                        }}
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
                            Text
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                            Max Selections
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                            Type
                        </th>

                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                            Updated At
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                            Created At
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
                                            {item.text.charAt(0)}
                                        </div>
                                    </div>
                                    <div className='ml-4'>
                                        <div className='text-sm font-medium text-gray-100'>{item.text}</div>
                                    </div>
                                </div>
                            </td>

                            <td className='px-6 py-4 whitespace-nowrap'>
                                <div className='text-sm text-gray-300'>{item.maxSelections}</div>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap'>
                                <div className='text-sm text-gray-300'>{item.type}</div>
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
                                                <h1 className="text-md text-white text-left">Text:</h1>
                                                <input
                                                    type="text"
                                                    onChange={(e) => setNewQuestionText(e.target.value)}
                                                    className="bg-gray-700 text-white placeholder-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full max-w-md"
                                                />

                                                {/* Question Type */}
                                                <h1 className="text-md text-white text-left">Type:</h1>
                                                <select
                                                    value={newQuestionType}
                                                    onChange={(e) => setNewQuestionType(e.target.value)}
                                                    className="bg-gray-700 text-white placeholder-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full max-w-md"
                                                >
                                                    {questionTypes.map((type) => (
                                                        <option key={type.type} value={type.type}>
                                                            {type.label}
                                                        </option>
                                                    ))}
                                                </select>

                                                {/* Show "Max Selections" only for Multiple Choice */}
                                                {newQuestionType === "multipleChoice" && (
                                                    <>
                                                        <h1 className="text-md text-white text-left">Max Selections:</h1>
                                                        <input
                                                            type="text"
                                                            value={newQuestionMaxSelections || ""}
                                                            onChange={(e) => setNewQuestionMaxSelections(e.target.value)}
                                                            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full max-w-md"
                                                        />
                                                    </>
                                                )}

                                                {/* Show "Options" for Multiple Choice and Ranking */}
                                                {(newQuestionType === "multipleChoice" || newQuestionType === "ranking") && (
                                                    <>
                                                        <h1 className="text-md text-white text-left">Options:</h1>
                                                        <div className="space-y-2">
                                                            {Array.isArray(newQuestionOptions) && newQuestionOptions.length > 0 ? (
                                                                newQuestionOptions.map((option, index) => (
                                                                    <div key={index} className="flex items-center space-x-2">
                                                                        <input
                                                                            type="text"
                                                                            value={option}
                                                                            readOnly
                                                                            className="bg-gray-700 text-white rounded-lg px-3 py-2 w-full max-w-md"
                                                                        />
                                                                        <button
                                                                            onClick={() => {
                                                                                const updatedOptions = newQuestionOptions.filter((_, i) => i !== index);
                                                                                setNewQuestionOptions(updatedOptions);
                                                                            }}
                                                                            className="bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600"
                                                                        >
                                                                            ✕
                                                                        </button>
                                                                    </div>
                                                                ))
                                                            ) : null}
                                                            {/* This Is causing ERORROR */}

                                                            {/* Input for new option */}
                                                            <div className="flex items-center space-x-2">
                                                                <input
                                                                    type="text"
                                                                    value={newOption}
                                                                    onChange={(e) => setNewOption(e.target.value)}
                                                                    className="bg-gray-700 text-white placeholder-gray-400 rounded-lg px-3 py-2 w-full max-w-md"
                                                                    placeholder="Enter option"
                                                                />
                                                                <button
                                                                    onClick={addOption}
                                                                    className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600"
                                                                >
                                                                    <Plus size={24} />
                                                                </button>
                                                            </div>

                                                            {/* Display added options */}
                                                            {/*{newQuestionOptions.map((option, index) => (*/}
                                                            {/*    <div key={index} className="flex items-center space-x-2">*/}
                                                            {/*        <span className="text-white">{option}</span>*/}
                                                            {/*        /!*<button*!/*/}
                                                            {/*        /!*    onClick={() => removeOption(index)}*!/*/}
                                                            {/*        /!*    className="text-red-500"*!/*/}
                                                            {/*        /!*>*!/*/}
                                                            {/*        /!*    <Trash2 size={20} />*!/*/}
                                                            {/*        /!*</button>*!/*/}
                                                            {/*    </div>*/}
                                                            {/*))}*/}

                                                        </div>
                                                    </>
                                                )}

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
                                                Edit
                                            </DialogTitle>
                                            <div className="mt-2 grid grid-cols-[auto,1fr] gap-3 items-center">
                                                <h1 className="text-md text-white text-left">Text:</h1>
                                                <input
                                                    type="text"
                                                    value={editItem?.text || ""}
                                                    onChange={(e) => setEditItem({ ...editItem, text: e.target.value })}
                                                    className="bg-gray-700 text-white placeholder-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full max-w-md"
                                                />
                                                <h1 className="text-md text-white text-left">Type:</h1>
                                                <select
                                                    value={editItem?.type || ""}
                                                    onChange={(e) => setEditItem({ ...editItem, type: e.target.value })}
                                                    className="bg-gray-700 text-white placeholder-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full max-w-md"
                                                >
                                                    {questionTypes.map((qType) => (
                                                        <option key={qType.type} value={qType.type}>
                                                            {qType.label}
                                                        </option>
                                                    ))}
                                                </select>

                                                {/* Show "Max Selections" only for Multiple Choice */}
                                                {editItem?.type === "multipleChoice" && (
                                                    <>
                                                        <h1 className="text-md text-white text-left">Max Selections:</h1>
                                                        <input
                                                            type="text"
                                                            value={editItem?.maxSelections || ""}
                                                            onChange={(e) => setEditItem({ ...editItem, maxSelections: e.target.value })}
                                                            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full max-w-md"
                                                        />
                                                    </>
                                                )}

                                                {/* Show "Options" for Multiple Choice and Ranking */}
                                                {(editItem?.type === "multipleChoice" || editItem?.type === "ranking") && (
                                                    <>
                                                        <h1 className="text-md text-white text-left">Options:</h1>
                                                        <div className="space-y-2">
                                                            {optionsArray.map((option, index) => (
                                                                <div key={index} className="flex items-center space-x-2">
                                                                    <input
                                                                        type="text"
                                                                        value={option}
                                                                        readOnly
                                                                        className="bg-gray-700 text-white rounded-lg px-3 py-2 w-full max-w-md"
                                                                    />
                                                                    <button
                                                                        onClick={() => handleRemoveOptionEdit(index)}
                                                                        className="bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600"
                                                                    >
                                                                        ✕
                                                                    </button>
                                                                </div>
                                                            ))}

                                                            {/* Input for new option */}
                                                            <div className="flex items-center space-x-2">
                                                                <input
                                                                    type="text"
                                                                    value={editItem?.newOption || ""}
                                                                    onChange={(e) => setEditItem({ ...editItem, newOption: e.target.value })}
                                                                    className="bg-gray-700 text-white rounded-lg px-3 py-2 w-full max-w-md"
                                                                    placeholder="Enter option"
                                                                />
                                                                <button
                                                                    onClick={() => handleAddOption(editItem, setEditItem)}
                                                                    className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600"
                                                                >
                                                                    <Plus />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
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
export default QuestionsTable;
