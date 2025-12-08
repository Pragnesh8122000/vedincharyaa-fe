import { useState, useRef, useEffect } from 'react';
import { Box, Slider, Typography, CircularProgress, Paper, Stack } from '@mui/material';
import IconTooltip from './IconTooltip';
import { PlayArrow, Pause, Repeat, RepeatOne, SkipNext, SkipPrevious } from '@mui/icons-material';

interface ShlokAudioPlayerProps {
    audioUrl?: string;
    onEnded?: () => void;
    autoPlay?: boolean;
    onNext?: () => void;
    onPrevious?: () => void;
    title?: string;
}

const ShlokAudioPlayer = ({
    audioUrl,
    onEnded,
    autoPlay = false,
    onNext,
    onPrevious,
    title
}: ShlokAudioPlayerProps) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const [isRepeat, setIsRepeat] = useState(false);

    useEffect(() => {
        if (audioUrl) {
            setIsLoading(true);
            setError(false);
            setCurrentTime(0);
            setIsPlaying(false);

            if (audioRef.current) {
                audioRef.current.src = audioUrl;
                audioRef.current.load();
                if (autoPlay) {
                    const playPromise = audioRef.current.play();
                    if (playPromise !== undefined) {
                        playPromise
                            .then(() => setIsPlaying(true))
                            .catch(e => console.error("Auto-play failed:", e));
                    }
                }
            }
        } else {
            setError(true);
        }
    }, [audioUrl, autoPlay]);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch(e => console.error("Play failed:", e));
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
            setIsLoading(false);
        }
    };

    const handleEnded = () => {
        setIsPlaying(false);
        if (isRepeat && audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
            setIsPlaying(true);
        } else if (onEnded) {
            onEnded();
        }
    };

    const handleSeek = (_: Event, newValue: number | number[]) => {
        const time = newValue as number;
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setCurrentTime(time);
        }
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    if (!audioUrl) {
        return null;
    }

    if (error) {
        return (
            <Paper elevation={0} sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                    Audio not available for this shlok.
                </Typography>
            </Paper>
        );
    }

    return (
        <Paper
            elevation={3}
            sx={{
                p: 2,
                borderRadius: 4,
                background: 'linear-gradient(to right, #fff, #f5f5f5)',
                border: '1px solid',
                borderColor: 'divider'
            }}
        >
            <audio
                ref={audioRef}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleEnded}
                onError={() => {
                    setError(true);
                    setIsLoading(false);
                }}
            />

            <Stack spacing={1}>
                {title && (
                    <Typography variant="caption" color="text.secondary" align="center">
                        {title}
                    </Typography>
                )}

                <Stack direction="row" alignItems="center" spacing={2} justifyContent="center">
                    {onPrevious && (
                        <IconTooltip title="Previous shlok" onClick={onPrevious} size="small">
                            <SkipPrevious />
                        </IconTooltip>
                    )}

                    <Box sx={{ position: 'relative' }}>
                        <IconTooltip
                            title={isPlaying ? "Pause audio" : "Play audio"}
                            onClick={togglePlay}
                            disabled={isLoading}
                            color="primary"
                            sx={{
                                width: 56,
                                height: 56,
                                bgcolor: 'primary.main',
                                color: 'white',
                                '&:hover': { bgcolor: 'primary.dark' }
                            }}
                        >
                            {isLoading ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : isPlaying ? (
                                <Pause fontSize="large" />
                            ) : (
                                <PlayArrow fontSize="large" />
                            )}
                        </IconTooltip>
                    </Box>

                    {onNext && (
                        <IconTooltip title="Next shlok" onClick={onNext} size="small">
                            <SkipNext />
                        </IconTooltip>
                    )}
                </Stack>

                <Stack direction="row" spacing={2} alignItems="center">
                    <Typography variant="caption" color="text.secondary" sx={{ minWidth: 35 }}>
                        {formatTime(currentTime)}
                    </Typography>

                    <Slider
                        size="small"
                        value={currentTime}
                        max={duration || 100}
                        onChange={handleSeek}
                        disabled={isLoading}
                        sx={{ color: 'primary.main' }}
                    />

                    <Typography variant="caption" color="text.secondary" sx={{ minWidth: 35 }}>
                        {formatTime(duration)}
                    </Typography>

                    <IconTooltip
                        title="Repeat this shlok"
                        size="small"
                        onClick={() => setIsRepeat(!isRepeat)}
                        color={isRepeat ? "primary" : "default"}
                    >
                        {isRepeat ? <RepeatOne fontSize="small" /> : <Repeat fontSize="small" />}
                    </IconTooltip>
                </Stack>
            </Stack>
        </Paper>
    );
};

export default ShlokAudioPlayer;
