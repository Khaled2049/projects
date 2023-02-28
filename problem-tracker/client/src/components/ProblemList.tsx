import React, { useContext, useState } from "react";
import CodesContext from "../context/Codes";

const ProblemList = () => {
  const { selectProblem } = useContext(CodesContext);

  const problems = [
    {
      id: "1",
      name: "Two Sum",
      desc: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.",
    },
    {
      id: "2",
      name: "Valid Anagram",
      desc: "Given two strings s and t, return true if t is an anagram of s, and false otherwise. An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.",
    },
  ];
  return (
    <ul>
      {problems.map((p) => (
        <li key={p.id} onClick={() => selectProblem(p.id)}>
          {p.name}
        </li>
      ))}
    </ul>
  );
};

export default ProblemList;
