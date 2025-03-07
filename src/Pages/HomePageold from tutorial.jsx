import { db } from "../config/firebase.js";
import {useEffect, useState} from "react";
import { getDocs, collection, addDoc, deleteDoc, updateDoc, doc } from "firebase/firestore";


const HomePage = () => {
    const [questionsList, setQuestionsList] = useState([]);

    // New question states
    const [newQuestionText, setNewQuestionText] = useState("");
    const [newQuestionType, setNewQuestionType] = useState("");
    const [newQuestionMaxSelections, setNewQuestionMaxSelections] = useState("");

    // Update question state
    const [updatedQuestionText, setUpdatedQuestionText] = useState("");

    const questionsCollectionRef = collection(db, "questions");

    const getQuestionList = async () => {
        // READ THE DATA
        // SET THE QUESTIONS LIST
        try {
            const data = await getDocs(questionsCollectionRef);
            const filteredData = data.docs.map((doc) =>
                ({
                    ...doc.data(),
                    id: doc.id
                }));
            setQuestionsList(filteredData);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {

        getQuestionList()
    }, []);

    const onSubmitQuestion = async () => {
        try{
            await addDoc(questionsCollectionRef, {
                text: newQuestionText,
                type: newQuestionType,
                maxSelections: newQuestionMaxSelections
            });
            getQuestionList()
        } catch (error) {
            console.error(error);
        }

    }

    const deleteQuestion = async (id) => {
        const questionDoc = doc(db, "questions", id);
        await deleteDoc(questionDoc);

    };
    const updateQuestionText = async (id) => {
        const questionDoc = doc(db, "questions", id);
        await updateDoc(questionDoc, {text: updatedQuestionText});

    };
    return (
        <div className="z-10">
            <div className="text-black">
                <input placeholder="question text" onChange={(e) => setNewQuestionText(e.target.value)} />
                <input placeholder="question type" onChange={(e) => setNewQuestionType(e.target.value)} />
                <input placeholder="max selections" type="number" onChange={(e) => setNewQuestionMaxSelections(Number(e.target.value))} />
                <button onClick={onSubmitQuestion}>Submit question</button>
            </div>
            <h1>Hello home page</h1>
            <div className="text-black bg-white">
                {questionsList.map((question) => (
                    <div>
                        <h1 className="text-black">{question.text}</h1>
                        <p>{question.type}</p>
                        <button className="border-4" onClick={() => deleteQuestion(question.id)}> Delete question</button>
                        <input placeholder="New Question text" onChange={(e) => setUpdatedQuestionText(e.target.value)} />
                        <button onClick={() => updateQuestionText(question.id)}>update text</button>

                    </div>
                ))}
            </div>
        </div>
    )
}

export default HomePage;
