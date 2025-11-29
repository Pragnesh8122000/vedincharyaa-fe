import { Box, Container, Typography, Stack, Button, IconButton, Card, CardContent, CardActions, Divider, Snackbar, Alert, CircularProgress } from "@mui/material";
import { ArrowBack, ContentCopy, Favorite, FavoriteBorder, Share, NavigateBefore, NavigateNext } from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getShlok } from "../api/shlokApi";
import { getChapters } from "../api/chapterApi";
import { addFavorite, removeFavorite, getFavorites } from "../api/favoritesApi";
import { addHistory } from "../api/historyApi";

const ShlokDetailPage = () => {
    const { chapter, verse } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [showCopyToast, setShowCopyToast] = useState(false);
    const [showEndToast, setShowEndToast] = useState(false);

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

    const isFavorite = favorites.some(f => f.chapterNumber === chapterNum && f.verseNumber === verseNum);
    // My API says removeFavorite takes shlokId. 
    // But wait, removeFavorite in controller takes shlokId.
    // And addFavorite takes shlokId.
    // The shlok object has an ID like "1-1".

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

    // Favorite Mutations
    const addFavMutation = useMutation({
        mutationFn: addFavorite,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['favorites'] });
        }
    });

    const removeFavMutation = useMutation({
        mutationFn: removeFavorite,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['favorites'] });
        }
    });

    const handleToggleFavorite = () => {
        if (!shlok) return;
        if (isFavorite) {
            removeFavMutation.mutate(shlok.id);
        } else {
            addFavMutation.mutate(shlok.id);
        }
    };

    const handleNext = () => {
        const currentChapter = chapters.find(c => c.chapterNumber === chapterNum);
        const maxVerses = currentChapter?.verseCount || 20;

        if (verseNum < maxVerses) {
            navigate(`/shlok/${chapterNum}/${verseNum + 1}`);
        } else if (chapterNum < 18) {
            navigate(`/shlok/${chapterNum + 1}/1`);
        } else {
            setShowEndToast(true);
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
            setShowCopyToast(true);
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
                        <IconButton onClick={handlePrevious} disabled={chapterNum === 1 && verseNum === 1}>
                            <NavigateBefore />
                        </IconButton>
                        <Typography variant="h6" sx={{ alignSelf: 'center' }}>
                            {chapterNum}.{verseNum}
                        </Typography>
                        <IconButton onClick={handleNext}>
                            <NavigateNext />
                        </IconButton>
                    </Stack>
                </Stack>

                {/* Main Content Card */}
                <Card variant="elevation" sx={{ borderRadius: 4 }}>
                    <CardContent sx={{ p: 4 }}>
                        <Stack spacing={4} alignItems="center" textAlign="center">
                            {/* Sanskrit */}
                            <Typography variant="h4" component="div" sx={{ fontFamily: 'serif', color: 'primary.main', fontWeight: 'medium' }}>
                                {shlok.sanskritText}
                            </Typography>

                            <Divider flexItem />

                            {/* Transliteration */}
                            <Typography variant="h6" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                {shlok.transliteration}
                            </Typography>

                            <Divider flexItem />

                            {/* Translations */}
                            <Box width="100%" textAlign="left">
                                <Stack spacing={3}>
                                    <Box>
                                        <Typography variant="subtitle2" color="primary" gutterBottom>
                                            English Translation
                                        </Typography>
                                        <Typography variant="body1">
                                            {shlok.translationEnglish}
                                        </Typography>
                                    </Box>

                                    {shlok.translationHindi && (
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
                            <Button
                                startIcon={isFavorite ? <Favorite /> : <FavoriteBorder />}
                                color={isFavorite ? "error" : "inherit"}
                                onClick={handleToggleFavorite}
                            >
                                {isFavorite ? "Saved" : "Save"}
                            </Button>
                            <Button startIcon={<Share />}>Share</Button>
                        </Stack>
                        <IconButton onClick={handleCopy} title="Copy Shlok">
                            <ContentCopy />
                        </IconButton>
                    </CardActions>
                </Card>
            </Stack>

            {/* Notifications */}
            <Snackbar open={showCopyToast} autoHideDuration={3000} onClose={() => setShowCopyToast(false)}>
                <Alert onClose={() => setShowCopyToast(false)} severity="success" sx={{ width: '100%' }}>
                    Shlok copied to clipboard!
                </Alert>
            </Snackbar>

            <Snackbar open={showEndToast} autoHideDuration={3000} onClose={() => setShowEndToast(false)}>
                <Alert onClose={() => setShowEndToast(false)} severity="info" sx={{ width: '100%' }}>
                    You have reached the end of the Bhagavad Gita.
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default ShlokDetailPage;
