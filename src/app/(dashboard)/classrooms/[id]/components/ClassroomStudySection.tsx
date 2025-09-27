"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CircularProgress from "@/components/CircularProgress";
import StreakDisplay from "@/components/StreakDisplay";
import { 
  BookOpenIcon, 
  ClockIcon, 
  BrainIcon, 
  TrophyIcon, 
  CheckCircleIcon,
  PlusIcon,
  PlayIcon,
  PauseIcon,
  TimerIcon,
  BarChart3Icon,
  CalendarIcon,
  ListTodoIcon
} from "lucide-react";
import { useState, useEffect } from "react";

interface ClassroomStudySectionProps {
  classroomId: string;
}

export default function ClassroomStudySection({ classroomId }: ClassroomStudySectionProps) {
  // Study timer state
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [studyTime, setStudyTime] = useState(0); // in seconds
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  
  // Format time in HH:MM:SS
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0')
    ].join(':');
  };
  
  // Start/stop timer
  const toggleTimer = () => {
    if (isTimerRunning) {
      // Stop timer
      if (timerInterval) {
        clearInterval(timerInterval);
        setTimerInterval(null);
      }
    } else {
      // Start timer
      const interval = setInterval(() => {
        setStudyTime(prev => prev + 1);
      }, 1000);
      setTimerInterval(interval);
    }
    
    setIsTimerRunning(!isTimerRunning);
  };
  
  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [timerInterval]);
  
  // Sample study data
  const studyData = {
    streak: 5,
    maxStreak: 12,
    totalStudyHours: 42.5,
    weeklyGoal: 10,
    weeklyProgress: 8.5,
    topics: [
      { name: "Algorithms", progress: 75 },
      { name: "Data Structures", progress: 60 },
      { name: "Programming Concepts", progress: 90 },
      { name: "Problem Solving", progress: 45 }
    ],
    flashcards: {
      total: 120,
      mastered: 78,
      learning: 32,
      new: 10
    },
    quizzes: [
      { name: "Algorithms Basics", score: 85, totalQuestions: 20, completedQuestions: 20 },
      { name: "Data Structures", score: 92, totalQuestions: 15, completedQuestions: 15 },
      { name: "Recursion", score: 78, totalQuestions: 10, completedQuestions: 10 },
      { name: "Sorting Algorithms", score: null, totalQuestions: 25, completedQuestions: 0 }
    ],
    studySessions: [
      { date: "2025-09-22", duration: 2.5, topics: ["Algorithms", "Problem Solving"] },
      { date: "2025-09-21", duration: 1.5, topics: ["Data Structures"] },
      { date: "2025-09-20", duration: 3.0, topics: ["Programming Concepts"] },
      { date: "2025-09-18", duration: 1.0, topics: ["Algorithms"] },
      { date: "2025-09-17", duration: 2.0, topics: ["Data Structures", "Problem Solving"] }
    ]
  };
  
  return (
    <div className="space-y-6">
      {/* Study Timer and Streak */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Study Timer */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <ClockIcon className="h-5 w-5 text-orange-500" />
              Study Timer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-6">
              <div className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                {formatTime(studyTime)}
              </div>
              
              <div className="flex items-center gap-4">
                <Button 
                  size="lg"
                  className={isTimerRunning ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
                  onClick={toggleTimer}
                >
                  {isTimerRunning ? (
                    <>
                      <PauseIcon className="h-5 w-5 mr-2" />
                      Pause
                    </>
                  ) : (
                    <>
                      <PlayIcon className="h-5 w-5 mr-2" />
                      Start Studying
                    </>
                  )}
                </Button>
                
                <Button variant="outline" size="lg" onClick={() => setStudyTime(0)} disabled={studyTime === 0}>
                  Reset
                </Button>
              </div>
              
              {isTimerRunning && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                  Your study time is being tracked. Don't forget to take breaks!
                </p>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Study Streak */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <TrophyIcon className="h-5 w-5 text-orange-500" />
              Study Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-6">
              <CircularProgress
                percentage={(studyData.streak / 7) * 100}
                size={120}
                strokeWidth={10}
                color="#ea580c"
                bgColor="#ffedd5"
                value={studyData.streak.toString()}
                label="Day Streak"
              />
              
              <div className="mt-6 w-full">
                <StreakDisplay 
                  streak={studyData.streak} 
                  maxStreak={studyData.maxStreak} 
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Study Content Tabs */}
      <Tabs defaultValue="progress">
        <TabsList className="mb-6">
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
          <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
          <TabsTrigger value="history">Study History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="progress">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Weekly Goal */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <BarChart3Icon className="h-5 w-5 text-orange-500" />
                  Weekly Study Goal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">This Week</span>
                    <span className="font-medium">{studyData.weeklyProgress} / {studyData.weeklyGoal} hours</span>
                  </div>
                  
                  <Progress 
                    value={(studyData.weeklyProgress / studyData.weeklyGoal) * 100} 
                    className="h-2"
                  />
                  
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>0h</span>
                    <span>{studyData.weeklyGoal / 2}h</span>
                    <span>{studyData.weeklyGoal}h</span>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-100 dark:border-gray-800 mt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Total Study Time</span>
                      <span className="font-medium">{studyData.totalStudyHours} hours</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Topic Progress */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <BookOpenIcon className="h-5 w-5 text-orange-500" />
                  Topic Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {studyData.topics.map((topic, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700 dark:text-gray-300">{topic.name}</span>
                        <span className="text-sm font-medium">{topic.progress}%</span>
                      </div>
                      <Progress value={topic.progress} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="flashcards">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <BrainIcon className="h-5 w-5 text-orange-500" />
                  Flashcards
                </CardTitle>
                <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Create Flashcards
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-green-50 dark:bg-green-900/10 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {studyData.flashcards.mastered}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Mastered</div>
                </div>
                
                <div className="bg-orange-50 dark:bg-orange-900/10 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                    {studyData.flashcards.learning}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Learning</div>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {studyData.flashcards.new}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">New</div>
                </div>
              </div>
              
              <div className="flex justify-center">
                <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                  Start Review Session
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="quizzes">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <ListTodoIcon className="h-5 w-5 text-orange-500" />
                Practice Quizzes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {studyData.quizzes.map((quiz, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">{quiz.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {quiz.totalQuestions} questions
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      {quiz.score !== null ? (
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-2">
                            <CheckCircleIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <div className="font-bold text-gray-900 dark:text-gray-100">{quiz.score}%</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Score</div>
                          </div>
                        </div>
                      ) : (
                        <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                          Start Quiz
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-orange-500" />
                Study History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {studyData.studySessions.map((session, index) => {
                  const date = new Date(session.date);
                  const formattedDate = date.toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                  });
                  
                  return (
                    <div 
                      key={index}
                      className="flex items-start p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mr-4">
                        <TimerIcon className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-gray-900 dark:text-gray-100">
                            {formattedDate}
                          </h3>
                          <span className="font-bold text-gray-900 dark:text-gray-100">
                            {session.duration} hrs
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mt-2">
                          {session.topics.map((topic, i) => (
                            <span 
                              key={i}
                              className="bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-xs px-2 py-1 rounded"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}