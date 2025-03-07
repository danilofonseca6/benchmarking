import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { ChevronDown } from "lucide-react";

const QuestionSelectDropdown = ({ selectedQuestions, setSelectedQuestions }) => {
    const [questions, setQuestions] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    // Fetch questions from Firestore on component mount
    useEffect(() => {
        const fetchQuestions = async () => {
            const questionsSnapshot = await getDocs(collection(db, "questions"));
            setQuestions(questionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        };
        fetchQuestions();
    }, []);

    // Toggle question selection
    const handleSelectQuestion = (questionId) => {
        setSelectedQuestions(prev =>
            prev.includes(questionId) ? prev.filter(id => id !== questionId) : [...prev, questionId]
        );
    };

    return (
        <div className="relative w-full max-w-md">
            {/* Dropdown Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center bg-blue-700 text-white px-4 py-2 rounded-lg focus:outline-none hover:bg-blue-800"
            >
                Select Questions
                <ChevronDown className="w-4 h-4" />
            </button>

            {/* Dropdown List */}
            {isOpen && (
                <div className="absolute mt-2 w-full bg-white shadow-lg rounded-lg z-10 max-h-60 overflow-y-auto">
                    <ul className="p-2">
                        {questions.map((question) => (
                            <li key={question.id} className="flex items-center p-2 hover:bg-gray-100 cursor-pointer">
                                <input
                                    type="checkbox"
                                    id={question.id}
                                    checked={selectedQuestions.includes(question.id)}
                                    onChange={() => handleSelectQuestion(question.id)}
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                />
                                <label htmlFor={question.id} className="ml-2 text-sm text-gray-900">
                                    {question.text}
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default QuestionSelectDropdown;