import React, { useEffect, useState } from "react";

const processSurveyResponses = (surveyData, question) => {
    const scoreMap = {};
    const countMap = {};

    surveyData.forEach((response) => {
        if (response[question]) {
            const rankedOptions = response[question].split(/(?<!\\),/).map((option) => option.trim());

            rankedOptions.forEach((option, index) => {
                const score = rankedOptions.length - index;
                scoreMap[option] = (scoreMap[option] || 0) + score;
                countMap[option] = (countMap[option] || 0) + 1;
            });
        }
    });

    return Object.keys(scoreMap)
        .map((option) => ({
            category: option,
            value: scoreMap[option] / countMap[option],
        }))
        .sort((a, b) => b.value - a.value);
};

const getSurveyResultsData = async (question) => {
    try {
        const response = await fetch("/survey_data.json");
        const data = await response.json();
        return processSurveyResponses(data, question);
    } catch (error) {
        console.error("Error loading JSON:", error);
        return [];
    }
};

export default getSurveyResultsData;