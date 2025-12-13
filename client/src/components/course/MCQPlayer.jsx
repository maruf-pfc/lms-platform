'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function MCQPlayer({ courseId, moduleId, lesson, onComplete }) {
    const [answers, setAnswers] = useState({}); // { questionId: optionString }
    const [submitted, setSubmitted] = useState(false);
    const [result, setResult] = useState(null);
    const [cheated, setCheated] = useState(false);

    // Anti-Cheat: Detect Tab Switching
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden && !submitted) {
                setCheated(true);
                toast.error("⚠️ warning: Tab switching detected! This will be recorded.");
            }
        };

        const handleBlur = () => {
            if (!submitted) {
                setCheated(true);
                toast.error("⚠️ warning: Focus lost! Please stay on this page.");
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("blur", handleBlur);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("blur", handleBlur);
        };
    }, [submitted]);

    const handleSelect = (questionId, option) => {
        if (submitted) return;
        setAnswers(prev => ({ ...prev, [questionId]: option }));
    };

    const submitQuiz = async () => {
        if (Object.keys(answers).length < lesson.questions.length) {
            toast.error("Please answer all questions");
            return;
        }

        try {
            const res = await api.post(`/courses/${courseId}/modules/${moduleId}/mcq`, {
                subModuleId: lesson._id,
                answers,
                cheated
            });

            setResult(res.data);
            setSubmitted(true);

            if (res.data.passed) {
                toast.success("Quiz Passed! 🎉");
                onComplete();
            } else {
                toast.error(res.data.message || "Quiz Failed");
            }

        } catch (err) {
            toast.error("Failed to submit quiz");
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold">{lesson.title}</h2>
                {cheated && <span className="text-red-600 font-bold bg-red-100 px-3 py-1 rounded text-sm">⚠️ Cheating Detected</span>}
            </div>

            {/* Result View */}
            {result && (
                <div className={`p-4 mb-6 rounded-lg text-center ${result.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    <h3 className="text-xl font-bold mb-2">{result.passed ? 'Passed!' : 'Failed'}</h3>
                    <p>Score: {result.score} / {result.totalPoints}</p>
                    <p className="text-sm mt-1">{result.message}</p>
                    {!result.passed && (
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-3 bg-red-600 text-white px-4 py-2 rounded font-bold text-sm"
                        >
                            Retry Quiz
                        </button>
                    )}
                </div>
            )}

            {/* Questions */}
            <div className={`space-y-8 ${submitted ? 'opacity-75 pointer-events-none' : ''}`}>
                {lesson.questions.map((q, idx) => (
                    <div key={q._id} className="p-4 bg-gray-50 rounded-lg">
                        <p className="font-semibold text-lg mb-4">{idx + 1}. {q.question}</p>
                        <div className="space-y-2">
                            {q.options.map((option) => (
                                <div
                                    key={option}
                                    onClick={() => handleSelect(q._id, option)}
                                    className={`p-3 border rounded cursor-pointer transition flex items-center gap-3 ${answers[q._id] === option
                                            ? 'bg-blue-600 text-white border-blue-600'
                                            : 'hover:bg-gray-200 border-gray-300'
                                        }`}
                                >
                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${answers[q._id] === option ? 'border-white' : 'border-gray-400'
                                        }`}>
                                        {answers[q._id] === option && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                    </div>
                                    {option}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {!submitted && (
                <div className="mt-8 flex justify-end">
                    <button
                        onClick={submitQuiz}
                        className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 shadow-lg"
                    >
                        Submit Quiz
                    </button>
                </div>
            )}
        </div>
    );
}
