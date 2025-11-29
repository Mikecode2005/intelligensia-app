"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  MicOff,
  Play,
  Pause,
  Square,
  Trash2,
  Send,
  Clock,
  Volume2,
  CheckCircle,
  XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface VoiceNoteRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  onCancel: () => void;
  maxDuration?: number;
}

export default function VoiceNoteRecorder({
  onRecordingComplete,
  onCancel,
  maxDuration = 60
}: VoiceNoteRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (isRecording && recordingTime >= maxDuration) {
      stopRecording();
    }
  }, [isRecording, recordingTime, maxDuration]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        setDuration(recordingTime);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  };

  const playRecording = () => {
    if (audioUrl) {
      if (!audioRef.current) {
        audioRef.current = new Audio(audioUrl);
      }
      
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
        
        audioRef.current.onended = () => {
          setIsPlaying(false);
        };
      }
    }
  };

  const deleteRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioBlob(null);
    setAudioUrl(null);
    setDuration(0);
    setRecordingTime(0);
    setIsPlaying(false);
  };

  const sendRecording = () => {
    if (audioBlob) {
      onRecordingComplete(audioBlob);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getRecordingStatus = () => {
    if (isRecording) {
      const percentage = (recordingTime / maxDuration) * 100;
      if (percentage > 80) return "warning";
      return "recording";
    }
    return "idle";
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="p-6 glass-strong">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Voice Note
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="text-gray-500 hover:text-gray-700"
            >
              <XCircle className="h-4 w-4" />
            </Button>
          </div>

          {/* Recording Controls */}
          <div className="flex items-center justify-center space-x-4">
            {!audioBlob ? (
              <div className="flex items-center space-x-4">
                <motion.button
                  className={cn(
                    "w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300",
                    isRecording
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                  )}
                  onClick={isRecording ? stopRecording : startRecording}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {isRecording ? (
                    <Square className="h-6 w-6 text-white" />
                  ) : (
                    <Mic className="h-6 w-6 text-white" />
                  )}
                </motion.button>

                {isRecording && (
                  <div className="text-center">
                    <motion.div
                      className="text-2xl font-mono font-bold"
                      animate={{
                        color: getRecordingStatus() === "warning" ? "#ef4444" : "#ea580c"
                      }}
                    >
                      {formatTime(recordingTime)}
                    </motion.div>
                    <div className="text-sm text-gray-500">
                      Max: {formatTime(maxDuration)}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={deleteRecording}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={playRecording}
                  className="text-green-500 hover:text-green-600"
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>

                <div className="text-center">
                  <div className="text-lg font-mono font-bold">
                    {formatTime(duration)}
                  </div>
                  <div className="text-sm text-gray-500">Duration</div>
                </div>
              </div>
            )}
          </div>

          {/* Visualizer */}
          {isRecording && (
            <div className="h-20 flex items-center justify-center">
              <div className="flex space-x-1">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 bg-gradient-to-t from-orange-400 to-amber-500 rounded"
                    animate={{
                      height: [10, Math.random() * 40 + 10, 10],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 0.5,
                      repeat: Infinity,
                      delay: i * 0.05,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Recording Progress */}
          {isRecording && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Recording</span>
                <span className="text-gray-600 dark:text-gray-400">
                  {formatTime(recordingTime)} / {formatTime(maxDuration)}
                </span>
              </div>
              <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(recordingTime / maxDuration) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          )}

          {/* Actions */}
          {audioBlob && (
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={deleteRecording}
                className="text-gray-600 dark:text-gray-400"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>

              <Button
                size="sm"
                onClick={sendRecording}
                className="bg-gradient-to-r from-orange-500 to-amber-500 text-white"
              >
                <Send className="h-4 w-4 mr-1" />
                Send
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}