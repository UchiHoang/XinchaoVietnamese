import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Headphones } from 'lucide-react';

interface ListeningAudioPlayerProps {
  audioUrl?: string;
  language: 'vi' | 'zh';
}

const ListeningAudioPlayer = ({ audioUrl, language }: ListeningAudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [playCount, setPlayCount] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Demo audio URL
  const demoAudioUrl = 'https://upload.wikimedia.org/wikipedia/commons/5/5b/Chinese-Mandarin-nihao.ogg';
  const actualAudioUrl = audioUrl || demoAudioUrl;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
      if (currentTime === 0) {
        setPlayCount(prev => prev + 1);
      }
    }
    setIsPlaying(!isPlaying);
  };

  const handleRestart = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = 0;
    setCurrentTime(0);
    setPlayCount(prev => prev + 1);
    audio.play();
    setIsPlaying(true);
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = value[0];
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newVolume = value[0];
    audio.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = volume || 0.8;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const formatTime = (time: number) => {
    if (!isFinite(time)) return '0:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="h-fit lg:sticky lg:top-20 shadow-lg border-2 overflow-hidden">
      <CardContent className="p-0">
        {/* Header - using primary color */}
        <div className="bg-primary p-4 text-primary-foreground">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary-foreground/20 rounded-full animate-bounce-soft">
              <Headphones className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">
                {language === 'vi' ? 'Bài nghe' : '听力材料'}
              </h3>
              <p className="text-sm opacity-90">
                {language === 'vi' 
                  ? 'Nghe và trả lời câu hỏi bên dưới' 
                  : '听音频并回答下方问题'}
              </p>
            </div>
          </div>
        </div>

        {/* Audio visualizer - using theme colors */}
        <div className="relative bg-gradient-to-br from-secondary via-muted to-secondary p-8">
          {/* Animated waveform */}
          <div className="flex items-center justify-center gap-1 h-24 mb-4">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className={`w-2 rounded-full transition-all duration-150 ${
                  isPlaying 
                    ? 'bg-primary' 
                    : 'bg-primary/50'
                }`}
                style={{
                  height: isPlaying 
                    ? `${Math.random() * 60 + 20}%`
                    : `${Math.sin(i * 0.5) * 20 + 30}%`,
                  animationDelay: `${i * 50}ms`,
                }}
              />
            ))}
          </div>

          {/* Progress bar */}
          <div className="mb-4">
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={0.1}
              onValueChange={handleSeek}
              className="cursor-pointer"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            {/* Volume */}
            <div className="flex items-center gap-2 w-32">
              <Button
                variant="ghost"
                size="icon"
                className="text-foreground hover:bg-primary/10"
                onClick={toggleMute}
              >
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </Button>
              <Slider
                value={[isMuted ? 0 : volume]}
                max={1}
                step={0.01}
                onValueChange={handleVolumeChange}
                className="w-20"
              />
            </div>

            {/* Play controls */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-foreground hover:bg-primary/10"
                onClick={handleRestart}
              >
                <RotateCcw className="h-5 w-5" />
              </Button>
              <Button
                size="lg"
                className="rounded-full w-14 h-14 bg-primary hover:bg-primary/90 shadow-lg animate-pulse-glow"
                onClick={togglePlay}
              >
                {isPlaying ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6 ml-1" />
                )}
              </Button>
            </div>

            {/* Play count */}
            <div className="w-32 text-right">
              <span className="text-xs text-muted-foreground">
                {language === 'vi' ? 'Đã nghe: ' : '已听: '}
                <span className="text-primary font-bold">{playCount}</span>
                {language === 'vi' ? ' lần' : ' 次'}
              </span>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-muted/50 p-3 text-center border-t border-border">
          <p className="text-xs text-muted-foreground">
            💡 {language === 'vi' 
              ? 'Mẹo: Bạn có thể nghe nhiều lần để hiểu rõ nội dung' 
              : '提示：您可以多听几遍以更好地理解内容'}
          </p>
        </div>

        <audio ref={audioRef} src={actualAudioUrl} preload="metadata" />
      </CardContent>
    </Card>
  );
};

export default ListeningAudioPlayer;
