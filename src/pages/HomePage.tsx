import { Box, Container, Typography, Stack, Grid, Card, CardContent, CardActionArea, Paper, CircularProgress } from "@mui/material";
import { MenuBook, Shuffle } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getChapters } from "../api/chapterApi";

const HomePage = () => {
    const navigate = useNavigate();
    const [randomLoading, setRandomLoading] = useState(false);

    const { data: chapters = [] } = useQuery({
        queryKey: ['chapters'],
        queryFn: getChapters,
        staleTime: 1000 * 60 * 60, // 1 hour
    });

    const handleRandomShlok = async () => {
        setRandomLoading(true);
        try {
            // Random chapter 1-18
            const chapterNum = Math.floor(Math.random() * 18) + 1;
            // We need verse count for this chapter. 
            let verseCount = 20; // fallback
            if (chapters.length > 0) {
                const chapter = chapters.find(c => c.chapterNumber === chapterNum);
                if (chapter) verseCount = chapter.verseCount;
            }

            const verseNum = Math.floor(Math.random() * verseCount) + 1;
            navigate(`/shlok/${chapterNum}/${verseNum}`);
        } catch (error) {
            console.error("Error navigating to random shlok", error);
        } finally {
            setRandomLoading(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: 8 }}>
            <Stack spacing={6} alignItems="center">
                {/* Hero Section */}
                <Box textAlign="center">
                    <Typography variant="h2" component="h1" sx={{ fontFamily: 'serif', color: 'primary.main', fontWeight: 'bold', mb: 2 }}>
                        Vedincharya
                    </Typography>
                    <Typography variant="h5" color="text.secondary" sx={{ maxWidth: '600px', mx: 'auto' }}>
                        Your daily companion for spiritual wisdom from the Bhagavad Gita.
                    </Typography>
                </Box>

                {/* Quick Navigation */}
                <Paper elevation={0} sx={{ p: 4, bgcolor: 'primary.light', borderRadius: 4, width: '100%', maxWidth: '600px', color: 'primary.contrastText' }}>
                    <Stack spacing={2} alignItems="center">
                        <Typography variant="h6" fontWeight="bold">
                            Start Reading
                        </Typography>
                        <Typography variant="body1" textAlign="center">
                            Begin your journey with Chapter 1, Verse 1
                        </Typography>
                        <Card variant="elevation" sx={{ borderRadius: 8, mt: 2 }}>
                            <CardActionArea onClick={() => navigate("/shlok/1/1")} sx={{ px: 4, py: 1.5 }}>
                                <Typography variant="button" fontWeight="bold" color="primary">
                                    Go to 1.1
                                </Typography>
                            </CardActionArea>
                        </Card>
                    </Stack>
                </Paper>

                {/* Quick Actions */}
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card variant="outlined" sx={{ '&:hover': { bgcolor: 'action.hover', cursor: 'pointer' } }}>
                            <CardActionArea onClick={() => navigate("/browse")}>
                                <CardContent>
                                    <Stack spacing={2} alignItems="center" textAlign="center">
                                        <MenuBook sx={{ fontSize: 40, color: 'secondary.main' }} />
                                        <Typography variant="h6">Browse Chapters</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Explore all 18 chapters and 700 verses
                                        </Typography>
                                    </Stack>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card variant="outlined" sx={{ '&:hover': { bgcolor: 'action.hover', cursor: 'pointer' } }}>
                            <CardActionArea onClick={handleRandomShlok} disabled={randomLoading}>
                                <CardContent>
                                    <Stack spacing={2} alignItems="center" textAlign="center">
                                        {randomLoading ? <CircularProgress size={40} /> : <Shuffle sx={{ fontSize: 40, color: 'primary.main' }} />}
                                        <Typography variant="h6">Random Shlok</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Read a random verse for inspiration
                                        </Typography>
                                    </Stack>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                </Grid>
            </Stack>
        </Container>
    );
};

export default HomePage;
