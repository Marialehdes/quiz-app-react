// App.js
//https://reactnavigation.org/docs/stack-navigator/
//https://reactnavigation.org/docs/params/
//React Native Testing Library
//answers: 1. Rupert Grint (3), 2.Argog (2), 3. Severus Snape and Dolores Umbridge (1-2), 4. True (1), 5. Hogwarts (0). 

import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, View, ScrollView, StyleSheet } from 'react-native';
import { Button, ButtonGroup } from 'react-native-elements';

//needed the const below 
const Stack = createNativeStackNavigator();

//here is the data for the quiz, the questions: True/False, Multiple Choice, and Multiple Answer.
//starts with 0, therefore, it is 0,1,2,3 for the choices.
const quizQuestions = [
  {
    prompt: "Who played Ron Weasely?",
    type: "multiple-choice",
    choices: ["Daniel Radcliffe", "Tom Feltom", "Matthew Lewis", "Rupert Grint"],
    correct: 3
  },
    {
    prompt: "Hagrid's pet spiderwas known by what name?",
    type: "multiple-choice",
    choices: ["Grey", "Hedwig", "Argog", "Tom"],
    correct: 2
  },
  {
    prompt: "Who is a Defense Against the Dark Arts teacher in Happy Potter? (more than one answer)",
    type: "multiple-answer",
    choices: ["Sybill Trelawney", "Severus Snape", "Dolores Umbridge", "Silvanus Kettleburn"],
    correct: [1, 2]
  },
  {
    prompt: "Tom Riddle is Voldemort's real name in the story?",
    type: "true-false",
    choices: ["False", "True"],
    correct: 1
  },
  {
    prompt: "What is the name where the students study?",
    type: "multiple-choice",
    choices: ["Hogwarts", "Diagon Alley", "Gringotts", "Godric's Hallow"],
    correct: 0
  },
];

//answers: 1. Rupert Grint (3), 2.Argog (2), 3. Severus Snape and Dolores Umbridge (1-2), 4. True (1), 5. Hogwarts (0). 

//Simple Navigation Stack
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Harry Potter Quiz" component={Question} />
        <Stack.Screen name="How did you do?" component={Summary} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

//Question Component from App.js (named component "question" to follow rubric)
export function Question({ route, navigation }) {
  //https://reactnavigation.org/docs/params/
  const { data = quizQuestions, index = 0, userAnswers = [] } = route.params || {};
  const question = data[index];
  const [optionSelection, setOptionSelection] = useState([]);

  const multipleOptions = question.type === 'multiple-answer';

//push from previous labs in client-side 
  const handleNext = () => {
    const updatedAnswers = [...userAnswers, optionSelection];
    if (index + 1 < data.length) {
      navigation.push('Harry Potter Quiz', { data, index: index + 1, userAnswers: updatedAnswers });
    } else {
      navigation.replace('How did you do?', { data, userAnswers: updatedAnswers });
    }
  };

//selectedIndex is used a lot for this type of navigation
  const toggleSelection = (selectedIndex) => {
    if (multipleOptions) {
      setOptionSelection(prev =>
        prev.includes(selectedIndex)
          ? prev.filter(i => i !== selectedIndex)
          : [...prev, selectedIndex]
      );
    } else {
      setOptionSelection([selectedIndex]);
    }
  };

  //Added a bit of information to make it fun: 
  return (
    <View style={styles.container}>
    <Text style={styles.description}>Welcome to the Harry Potter Quiz! Choose the correct answers below. You cannot go back, so choose wisely.</Text>

      <Text style={styles.prompt}>{question.prompt}</Text>
      <ButtonGroup
        buttons={question.choices}
        vertical
        testID="choices"
        selectedIndexes={optionSelection}
        onPress={toggleSelection}
        selectedButtonStyle={{ backgroundColor: '#4B0082' }}
        containerStyle={{ marginBottom: 20 }}
      />
      <Button
        title="Next Question"
        testID="next-question"
        onPress={handleNext}
        disabled={optionSelection.length === 0}
        buttonStyle={{
          backgroundColor: '#8b4513', 
        }}
      />
    </View>
  );
}

//Summary Component from App.js (named component "summary" to follow rubric)
export function Summary({ route }) {
  const { data = [], userAnswers = [] } = route.params || {};
  let total = 0;

  const correctAnswer = (correct, answer) => {
    if (Array.isArray(correct)) {
      return correct.sort().toString() === answer.sort().toString();
    } else {
      return correct === answer[0];
    }
  };

//The reduce() function is used to reduce an array to a single value
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
//Style is mixed with the code and then separate at the bottom. 
//map() Method:
//I used many const variables but it was the only way for it to work.
  return (
  <ScrollView style={styles.container}>
      <Text style={styles.heading} testID="total">
        Total Score: {
          data.reduce((score, q, i) =>
            correctAnswer(q.correct, userAnswers[i]) ? score + 1 : score
          , 0)
        } / {data.length}
      </Text>
      {data.map((q, idx) => {

        const userAnswer = userAnswers[idx];
        const correct = q.correct;
        const correctAnswerChosen = correctAnswer(correct, userAnswer);

        return (

        <View key={idx} style={{ marginBottom: 25 }}>

        <Text style={styles.prompt}>{q.prompt}</Text>
        
        {q.choices.map((choice, i) => {
        const correctAnswerChoice = Array.isArray(correct) ? correct.includes(i) : correct === i;
        const answerSelected = userAnswer.includes(i);
        const style = {
        fontWeight: answerSelected && correctAnswerChoice ? 'bold' : 'normal',
        textDecorationLine: answerSelected && !correctAnswerChoice ? 'line-through' : 'none',
        color: correctAnswerChoice ? '#4d908e' : answerSelected ? '#720026' : 'black',
        };
      return (
      <Text key={i} style={style}>- {choice}</Text>
      );
      })}
      <Text>{correctAnswerChosen ? 'Correct' : 'Incorrect'}</Text>
      </View>
      );
    })}
  </ScrollView>
  );
}

//Style Harry Potter Themed 
const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#8b4513', 
    textAlign: 'center'
  },
  prompt: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
    fontFamily: 'Garamond', 
    color: '#4B0082', 
    lineHeight: 30, 
    textAlign: 'center',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    fontFamily: 'Times New Roman', 
    color: '#C04000',
    textAlign: 'center',
    textShadowColor: '#ffcc00', 
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  description: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2f4f4f',
    fontFamily: 'Garamond', 
    backgroundColor: '#ffebcd',
    padding: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#8b4513',
  },
});
