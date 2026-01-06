import { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, Card, CardContent, CircularProgress, Stack, Tooltip } from '@mui/material';
import { ArrowBack, Check, Close, Refresh } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { memorizationService } from '../services/memorizationService';
import { getShlok, Shlok } from '../api/shlokApi';

const MemorizationPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [dueShloks, setDueShloks] = useState<Shlok[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [showResult, setShowResult] = useState(false);

    useEffect(() => {
        const loadDueShloks = async () => {
            setLoading(true);
            try {
                const allProgress = await memorizationService.getAll();
                // Simple logic: Review everything that is "learning"
                const learningItems = allProgress.filter((p: any) => p.status === 'learning');

                if (learningItems.length === 0) {
                    setDueShloks([]);
                    setLoading(false);
                    return;
                }

                // Fetch details for each item
                const promises = learningItems.map((item: any) => {
                    const [chapter, verse] = item.shlokId.split('-');
                    return getShlok(parseInt(chapter), parseInt(verse))
                        .catch(() => null);
                });

                const results = await Promise.all(promises);
                const validShloks = results.filter((s): s is Shlok => s !== null);
                setDueShloks(validShloks);
            } catch (error) {
                console.error("Failed to load due shloks", error);
            } finally {
                setLoading(false);
            }
        };

        loadDueShloks();
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
        // const shlokId = `${currentShlok.chapterNumber}-${currentShlok.verseNumber}`;

        await memorizationService.updateProgress(currentShlok.chapterNumber, currentShlok.verseNumber, isCorrect);
        handleNext();
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
                    Find New Shloks to Learn
                </Button>
                <Box mt={2}>
                    <Button startIcon={<Refresh />} onClick={() => window.location.reload()}>
                        Refresh
                    </Button>
                </Box>
            </Container>
        );
    }

    const currentShlok = dueShloks[currentIndex];

    // Safety check
    if (!currentShlok) return null;

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
                    <Typography variant="h5" sx={{ fontFamily: 'serif', fontWeight: 'bold', textAlign: 'center' }}>
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
                    <Tooltip title="I forgot this" arrow>
                        <Button
                            variant="outlined"
                            color="error"
                            startIcon={<Close />}
                            onClick={(e) => { e.stopPropagation(); handleRate(false); }}
                        >
                            Forgot
                        </Button>
                    </Tooltip>
                    <Tooltip title="I remembered this" arrow>
                        <Button
                            variant="contained"
                            color="success"
                            startIcon={<Check />}
                            onClick={(e) => { e.stopPropagation(); handleRate(true); }}
                        >
                            Recall It
                        </Button>
                    </Tooltip>
                </Stack>
            )}
        </Container>
    );
};

export default MemorizationPage;
