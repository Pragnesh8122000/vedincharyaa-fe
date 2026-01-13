import { Box, Container, Typography, Stack, Button, Card, CardContent, CardActions, Divider, CircularProgress, Tooltip } from "@mui/material";
import { ArrowBack, ContentCopy, Favorite, FavoriteBorder, Share, NavigateBefore, NavigateNext, RecordVoiceOver } from "@mui/icons-material";
import { useSpeechSynthesis } from 'react-speech-kit';
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getShlok } from "../api/shlokApi";
import { getChapters } from "../api/chapterApi";
import { addFavorite, removeFavorite, getFavorites } from "../api/favoritesApi";
import { addHistory } from "../api/historyApi";
import { useAppSelector } from "../store/hooks";
import { memorizationService } from "../services/memorizationService";
import { School } from "@mui/icons-material";
import IconTooltip from "../components/IconTooltip";
import AiShlokSection from "../components/AiShlokSection";

import { useToast } from "../providers/ToastProvider";

const ShlokDetailPage = () => {
    const { chapter, verse } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const settings = useAppSelector((state) => state.shlok.settings);
    const { showToast } = useToast();
    const [speechType, setSpeechType] = useState<'shlok' | 'translation' | null>(null);
    const { speak, cancel, speaking, voices } = useSpeechSynthesis({
        onEnd: () => setSpeechType(null)
    });



    const chapterNum = parseInt(chapter || "1");
    const verseNum = parseInt(verse || "1");

    // Fetch Shlok
    const { data: shlok, isLoading: shlokLoading, error } = useQuery({
        queryKey: ['shlok', chapterNum, verseNum],
        queryFn: () => getShlok(chapterNum, verseNum),
        retry: 1
    });

    // Fetch Chapters for navigation limits
    const { data: chapters = [] } = useQuery({
        queryKey: ['chapters'],
        queryFn: getChapters,
        staleTime: 1000 * 60 * 60
    });

    // Fetch Favorites to check status
    const { data: favorites = [] } = useQuery({
        queryKey: ['favorites'],
        queryFn: getFavorites
    });



    // Add History on load
    const addHistoryMutation = useMutation({
        mutationFn: addHistory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['history'] });
        }
    });

    useEffect(() => {
        if (shlok?.id) {
            addHistoryMutation.mutate(shlok.id);
        }
    }, [shlok?.id]);

    // State for local UI
    const [isFavOptimistic, setIsFavOptimistic] = useState(false);
    const [isMemoOptimistic, setIsMemoOptimistic] = useState(false);

    // Initialize state when data loads
    useEffect(() => {
        if (favorites.some(f => f.chapterNumber === chapterNum && f.verseNumber === verseNum)) {
            setIsFavOptimistic(true);
        } else {
            setIsFavOptimistic(false);
        }

        const checkMemorization = async () => {
            try {
                const memo = await memorizationService.getById(`${chapterNum}-${verseNum}`);
                setIsMemoOptimistic(!!memo);
            } catch (e) {
                console.error("Failed to check memorization status", e);
            }
        };
        checkMemorization();
    }, [favorites, chapterNum, verseNum]);

    // Favorite Mutations
    const addFavMutation = useMutation({
        mutationFn: addFavorite,
        onSuccess: () => {
            // Refetch optional, but good for consistency
            queryClient.invalidateQueries({ queryKey: ['favorites'] });
        },
        onError: () => {
            setIsFavOptimistic(false); // Revert
        }
    });

    const removeFavMutation = useMutation({
        mutationFn: removeFavorite,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['favorites'] });
        },
        onError: () => {
            setIsFavOptimistic(true); // Revert
        }
    });

    const handleToggleFavorite = () => {
        if (!shlok) return;
        const shlokId = `${shlok.chapterNumber}-${shlok.verseNumber}`;

        if (isFavOptimistic) {
            setIsFavOptimistic(false);
            removeFavMutation.mutate(shlokId);
        } else {
            setIsFavOptimistic(true);
            addFavMutation.mutate(shlokId);
        }
    };

    const handleToggleMemorization = async () => {
        if (!shlok) return;

        if (isMemoOptimistic) {
            setIsMemoOptimistic(false);
            await memorizationService.remove(shlok.chapterNumber, shlok.verseNumber);
        } else {
            setIsMemoOptimistic(true);
            await memorizationService.add(shlok.chapterNumber, shlok.verseNumber);
        }
    };

    const handleSpeakShlok = () => {
        if (!shlok) return;

        if (speaking && speechType === 'shlok') {
            cancel();
            setSpeechType(null);
            return;
        }

        cancel();
        setSpeechType('shlok');

        // Try to find a Hindi or Sanskrit voice for the Shlok
        const hindiVoice = voices.find((v: SpeechSynthesisVoice) => v.lang.startsWith('hi') || v.lang.startsWith('sa'));
        const englishVoice = voices.find((v: SpeechSynthesisVoice) => v.lang.startsWith('en')) || voices[0];

        if (hindiVoice) {
            speak({
                text: shlok.sanskritText,
                voice: hindiVoice,
                rate: 0.7
            });
        } else {
            speak({
                text: shlok.transliteration,
                voice: englishVoice,
                rate: 0.8
            });
        }
    };

    const handleSpeakTranslation = () => {
        if (!shlok) return;

        if (speaking && speechType === 'translation') {
            cancel();
            setSpeechType(null);
            return;
        }

        cancel();
        setSpeechType('translation');

        const englishVoice = voices.find((v: SpeechSynthesisVoice) => v.lang.startsWith('en')) || voices[0];

        speak({
            text: shlok.translationEnglish,
            voice: englishVoice,
            rate: 0.9
        });
    };

    const handleNext = () => {
        const currentChapter = chapters.find(c => c.chapterNumber === chapterNum);
        const maxVerses = currentChapter?.verseCount || 20;

        if (verseNum < maxVerses) {
            navigate(`/shlok/${chapterNum}/${verseNum + 1}`);
        } else if (chapterNum < 18) {
            navigate(`/shlok/${chapterNum + 1}/1`);
        } else {
            showToast('You have reached the end of the Bhagavad Gita.', 'info');
        }
    };

    const handlePrevious = () => {
        if (verseNum > 1) {
            navigate(`/shlok/${chapterNum}/${verseNum - 1}`);
        } else if (chapterNum > 1) {
            navigate(`/shlok/${chapterNum - 1}/1`);
        }
    };



    const handleCopy = () => {
        if (shlok) {
            const text = `${shlok.sanskritText}\n\n${shlok.transliteration}\n\n${shlok.translationEnglish}`;
            navigator.clipboard.writeText(text);
            showToast('Shlok copied to clipboard!', 'success');
        }
    };

    if (shlokLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error || !shlok) {
        return (
            <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
                <Typography variant="h5" color="error" gutterBottom>
                    Shlok not found
                </Typography>
                <Button variant="outlined" startIcon={<ArrowBack />} onClick={() => navigate("/")}>
                    Back to Home
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Stack spacing={4}>
                {/* Header with Navigation */}
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)}>
                        Back
                    </Button>
                    <Stack direction="row" spacing={1}>
                        <IconTooltip title="Previous shlok" onClick={handlePrevious} disabled={chapterNum === 1 && verseNum === 1}>
                            <NavigateBefore />
                        </IconTooltip>
                        <Typography variant="h6" sx={{ alignSelf: 'center' }}>
                            {chapterNum}.{verseNum}
                        </Typography>
                        <IconTooltip title="Next shlok" onClick={handleNext}>
                            <NavigateNext />
                        </IconTooltip>
                    </Stack>
                </Stack>

                {/* Main Content Card */}
                <Card variant="elevation" sx={{ borderRadius: 4 }}>
                    <CardContent sx={{ p: 4 }}>
                        <Stack spacing={4} alignItems="center" textAlign="center">
                            {/* Sanskrit */}
                            <Box sx={{ width: '100%' }}>
                                <Stack spacing={1} alignItems="center">
                                    {(() => {
                                        const lines = shlok.sanskritText.split('\n');
                                        const speaker = lines.find(l => l.includes('उवाच'))?.trim();
                                        const content = lines.filter(l => !l.includes('उवाच')).join(' ').replace(/\s+/g, ' ').trim();

                                        const finalLines = [];
                                        if (speaker) finalLines.push(speaker);

                                        if (content) {
                                            // Split at the first single danda | that separates the halves
                                            const dandaIndex = content.indexOf('|');
                                            if (dandaIndex !== -1 && dandaIndex < content.length - 1) {
                                                finalLines.push(content.substring(0, dandaIndex + 1).trim());
                                                finalLines.push(content.substring(dandaIndex + 1).trim());
                                            } else {
                                                finalLines.push(content);
                                            }
                                        }
                                        return finalLines;
                                    })().map((line, index, arr) => (
                                        <Typography
                                            key={index}
                                            variant={line.includes('उवाच') ? "h5" : "h4"}
                                            component="div"
                                            sx={{
                                                fontFamily: 'serif',
                                                color: 'primary.main',
                                                fontWeight: line.includes('उवाच') ? 'bold' : 'medium',
                                                lineHeight: 1.6,
                                                mb: index === arr.length - 1 ? 0 : (line.includes('उवाच') ? 2 : 0.5)
                                            }}
                                        >
                                            {line}
                                        </Typography>
                                    ))}
                                </Stack>
                            </Box>

                            <Divider flexItem />

                            {/* Transliteration */}
                            <Typography variant="h6" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                {shlok.transliteration}
                            </Typography>

                            {/* Word Meanings */}
                            {shlok.words && shlok.words.length > 0 && (
                                <Box sx={{ mt: 2, mb: 2, width: '100%' }}>
                                    <Stack direction="row" alignItems="center" gap={1} mb={1}>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Word Meanings
                                        </Typography>
                                    </Stack>

                                    <Box display="flex" flexWrap="wrap" justifyContent="center" gap={1}>
                                        {shlok.words.map((word, index) => (
                                            <Box key={index} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, px: 1, py: 0.5, bgcolor: 'background.default' }}>
                                                <Typography variant="body2" component="span" fontWeight="bold">
                                                    {word.sanskrit}
                                                </Typography>
                                                <Typography variant="body2" component="span" color="text.secondary" sx={{ mx: 0.5 }}>
                                                    :
                                                </Typography>
                                                <Typography variant="body2" component="span">
                                                    {word.meaning}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                </Box>
                            )}

                            {/* Speech Controls */}
                            <Box width="100%">
                                <Box display="flex" justifyContent="center" mt={1}>
                                    <Button
                                        size="small"
                                        startIcon={<RecordVoiceOver />}
                                        onClick={handleSpeakShlok}
                                        color={speaking && speechType === 'shlok' ? "primary" : "inherit"}
                                        sx={{ ml: 1 }}
                                    >
                                        {speaking && speechType === 'shlok' ? "Stop Shlok" : "Speak Shlok"}
                                    </Button>
                                    <Button
                                        size="small"
                                        startIcon={<RecordVoiceOver />}
                                        onClick={handleSpeakTranslation}
                                        color={speaking && speechType === 'translation' ? "primary" : "inherit"}
                                        sx={{ ml: 1 }}
                                    >
                                        {speaking && speechType === 'translation' ? "Stop Translation" : "Speak Translation"}
                                    </Button>
                                </Box>
                            </Box>

                            <Divider flexItem />

                            {/* Translations */}
                            <Box width="100%" textAlign="left">
                                <Stack spacing={3}>
                                    {settings.showEnglishTranslation && (
                                        <Box>
                                            <Typography variant="subtitle2" color="primary" gutterBottom>
                                                English Translation
                                            </Typography>
                                            <Typography variant="body1">
                                                {shlok.translationEnglish}
                                            </Typography>
                                        </Box>
                                    )}

                                    {settings.showHindiTranslation && shlok.translationHindi && (
                                        <Box>
                                            <Typography variant="subtitle2" color="primary" gutterBottom>
                                                Hindi Translation
                                            </Typography>
                                            <Typography variant="body1">
                                                {shlok.translationHindi}
                                            </Typography>
                                        </Box>
                                    )}
                                </Stack>
                            </Box>
                        </Stack>
                    </CardContent>

                    <Divider />

                    <CardActions sx={{ justifyContent: 'space-between', px: 3, py: 2 }}>
                        <Stack direction="row" spacing={1}>
                            <Tooltip title={isFavOptimistic ? "Remove from favorites" : "Save to favorites"}>
                                <Button
                                    startIcon={isFavOptimistic ? <Favorite /> : <FavoriteBorder />}
                                    color={isFavOptimistic ? "error" : "inherit"}
                                    onClick={handleToggleFavorite}
                                >
                                    {isFavOptimistic ? "Saved" : "Save"}
                                </Button>
                            </Tooltip>
                            <Tooltip title={isMemoOptimistic ? "In memorization" : "Save for memorization"}>
                                <Button
                                    startIcon={<School />}
                                    color={isMemoOptimistic ? "secondary" : "inherit"}
                                    onClick={handleToggleMemorization}
                                >
                                    {isMemoOptimistic ? "Memorizing" : "Memorize"}
                                </Button>
                            </Tooltip>
                            <Tooltip title="Share this shlok">
                                <Button startIcon={<Share />}>Share</Button>
                            </Tooltip>
                        </Stack>
                        <IconTooltip onClick={handleCopy} title="Copy shlok text">
                            <ContentCopy />
                        </IconTooltip>
                    </CardActions>
                </Card>

                {/* AI Section (Phase 3) */}
                <AiShlokSection shlokId={`${chapterNum}-${verseNum}`} />
            </Stack>
        </Container>
    );
};

export default ShlokDetailPage;
