import { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, Card, CardContent, CircularProgress, Stack } from '@mui/material';
import { ArrowBack, Check, Close, Refresh } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getDueShloks, updateProgress, DueShlok } from '../api/memorizationApi';

const MemorizationPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [dueShloks, setDueShloks] = useState<DueShlok[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [showResult, setShowResult] = useState(false); // To show "Finished" state

    const fetchDue = async () => {
        setLoading(true);
        try {
            const data = await getDueShloks();
            setDueShloks(data);
            setCurrentIndex(0);
            setShowResult(false);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDue();
    }, []);

    const handleNext = () => {
        setIsFlipped(false);
        if (currentIndex < dueShloks.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            setShowResult(true);
        }
    };

    const handleRate = async (isCorrect: boolean) => {
        const currentShlok = dueShloks[currentIndex];
        // Optimistic update
        handleNext();

        // API Call
        try {
            await updateProgress(currentShlok.chapterNumber, currentShlok.verseNumber, isCorrect);
        } catch (error) {
            console.error('Failed to update progress', error);
            // Ideally rollback UI or show toast
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                <CircularProgress />
            </Box>
        );
    }

    if (showResult || dueShloks.length === 0) {
        return (
            <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
                <Typography variant="h5" gutterBottom>
                    You're all caught up!
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                    {dueShloks.length > 0 ? "Great job reviewing your cards." : "No cards due for review right now."}
                </Typography>
                <Button variant="contained" onClick={() => navigate('/browse')}>
                    Learn New Shloks
                </Button>
                <Box mt={2}>
                    <Button startIcon={<Refresh />} onClick={fetchDue}>
                        Refresh
                    </Button>
                </Box>
            </Container>
        );
    }

    const currentShlok = dueShloks[currentIndex];

    return (
        <Container maxWidth="sm" sx={{ py: 4 }}>
            <Box mb={2}>
                <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)}>
                    Back
                </Button>
            </Box>

            <Typography variant="h6" align="center" gutterBottom>
                Reviewing {currentIndex + 1} of {dueShloks.length}
            </Typography>

            <Card
                sx={{
                    minHeight: 300,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                    bgcolor: 'background.paper',
                    transition: 'transform 0.3s',
                    transform: isFlipped ? 'rotateX(180deg)' : 'none',
                    transformStyle: 'preserve-3d',
                    position: 'relative'
                }}
                onClick={() => setIsFlipped(!isFlipped)}
            >
                <CardContent sx={{
                    position: 'absolute',
                    backfaceVisibility: 'hidden',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    p: 4
                }}>
                    {/* Front Side */}
                    <Typography variant="h5" sx={{ fontFamily: 'serif', fontWeight: 'bold' }}>
                        {currentShlok.sanskritText}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" mt={2}>
                        Tap to flip
                    </Typography>
                </CardContent>

                <CardContent sx={{
                    position: 'absolute',
                    backfaceVisibility: 'hidden',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    transform: 'rotateX(180deg)',
                    p: 4,
                    textAlign: 'center'
                }}>
                    {/* Back Side */}
                    <Typography variant="h6" gutterBottom color="primary">
                        Chapter {currentShlok.chapterNumber}, Verse {currentShlok.verseNumber}
                    </Typography>
                    <Typography variant="body1">
                        {currentShlok.translationEnglish}
                    </Typography>
                </CardContent>
            </Card>

            {isFlipped && (
                <Stack direction="row" justifyContent="center" spacing={4} mt={4}>
                    <Button
                        variant="outlined"
                        color="error"
                        startIcon={<Close />}
                        onClick={(e) => { e.stopPropagation(); handleRate(false); }}
                    >
                        Forgot
                    </Button>
                    <Button
                        variant="contained"
                        color="success"
                        startIcon={<Check />}
                        onClick={(e) => { e.stopPropagation(); handleRate(true); }}
                    >
                        Recall It
                    </Button>
                </Stack>
            )}
        </Container>
    );
};

export default MemorizationPage;
