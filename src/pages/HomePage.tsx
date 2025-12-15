import { Box, Container, Typography, Stack, Grid, Card, CardContent, CardActionArea, Button, alpha, useTheme } from "@mui/material";
import { MenuBook, Shuffle, AutoStories, ArrowForward, VerifiedUserOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

// Static verse counts for the 18 chapters of Bhagavad Gita
const GITA_VERSE_COUNTS = [
    47, 72, 43, 42, 29, 47, 30, 28, 34,
    42, 55, 20, 35, 27, 20, 24, 28, 78
];

const HomePage = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const [randomLoading, setRandomLoading] = useState(false);

    const handleRandomShlok = async () => {
        setRandomLoading(true);
        try {
            // Random chapter 1-18
            const chapterNum = Math.floor(Math.random() * 18) + 1;
            // Get verse count for this chapter (array is 0-indexed)
            const verseCount = GITA_VERSE_COUNTS[chapterNum - 1];

            const verseNum = Math.floor(Math.random() * verseCount) + 1;
            navigate(`/shlok/${chapterNum}/${verseNum}`);
        } catch (error) {
            console.error("Error navigating to random shlok", error);
        } finally {
            setRandomLoading(false);
        }
    };

    return (
        <Box sx={{ pb: 8 }}>
            {/* Hero Section */}
            <Box
                sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: 4,
                    bgcolor: 'primary.main',
                    backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 1)} 0%, ${alpha(theme.palette.primary.dark, 1)} 100%)`,
                    color: 'primary.contrastText',
                    mb: 6,
                    px: { xs: 3, md: 8 },
                    py: { xs: 8, md: 10 },
                    textAlign: 'center',
                    boxShadow: 6
                }}
            >
                {/* Decorative Pattern Background (Optional SVG or CSS effect) */}
                <Box sx={{
                    position: 'absolute',
                    top: -50,
                    right: -50,
                    width: 200,
                    height: 200,
                    borderRadius: '50%',
                    bgcolor: 'white',
                    opacity: 0.1
                }} />
                <Box sx={{
                    position: 'absolute',
                    bottom: -30,
                    left: -30,
                    width: 150,
                    height: 150,
                    borderRadius: '50%',
                    bgcolor: 'white',
                    opacity: 0.1
                }} />

                <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
                    <Typography
                        variant="overline"
                        sx={{
                            letterSpacing: 2,
                            fontWeight: 600,
                            opacity: 0.9,
                            display: 'block',
                            mb: 1
                        }}
                    >
                        Ancient Wisdom for Modern Life
                    </Typography>
                    <Typography
                        variant="h1"
                        component="h1"
                        sx={{
                            fontFamily: 'serif',
                            fontWeight: 700,
                            fontSize: { xs: '2.5rem', md: '4rem' },
                            mb: 2
                        }}
                    >
                        Vedincharya
                    </Typography>
                    <Typography
                        variant="h5"
                        sx={{
                            maxWidth: '700px',
                            mx: 'auto',
                            mb: 5,
                            opacity: 0.95,
                            fontWeight: 300
                        }}
                    >
                        Discover the timeless teachings of the Bhagavad Gita. Find clarity, peace, and purpose in your daily journey.
                    </Typography>

                    <Button
                        variant="contained"
                        size="large"
                        onClick={() => navigate("/shlok/1/1")}
                        endIcon={<ArrowForward />}
                        sx={{
                            bgcolor: 'white',
                            color: 'primary.main',
                            px: 4,
                            py: 1.5,
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            boxShadow: 3,
                            '&:hover': {
                                bgcolor: 'grey.100',
                                transform: 'translateY(-2px)',
                                boxShadow: 5
                            },
                            transition: 'all 0.3s ease'
                        }}
                    >
                        Start Reading
                    </Button>
                </Container>
            </Box>

            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    {/* Quick Access Cards */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Card
                            variant="outlined"
                            sx={{
                                height: '100%',
                                borderRadius: 3,
                                transition: 'all 0.3s ease',
                                border: '1px solid',
                                borderColor: 'divider',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: 4,
                                    borderColor: 'primary.light'
                                }
                            }}
                        >
                            <CardActionArea
                                onClick={() => navigate("/browse")}
                                sx={{ height: '100%', p: 2 }}
                            >
                                <CardContent sx={{ textAlign: 'center' }}>
                                    <Box
                                        sx={{
                                            width: 60,
                                            height: 60,
                                            borderRadius: '50%',
                                            bgcolor: alpha(theme.palette.secondary.main, 0.1),
                                            color: 'secondary.main',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mx: 'auto',
                                            mb: 2
                                        }}
                                    >
                                        <MenuBook fontSize="large" />
                                    </Box>
                                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                                        Browse Chapters
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        Explore all 18 chapters and 700 verses systematically.
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <Card
                            variant="outlined"
                            sx={{
                                height: '100%',
                                borderRadius: 3,
                                transition: 'all 0.3s ease',
                                border: '1px solid',
                                borderColor: 'divider',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: 4,
                                    borderColor: 'primary.light'
                                }
                            }}
                        >
                            <CardActionArea
                                onClick={handleRandomShlok}
                                disabled={randomLoading}
                                sx={{ height: '100%', p: 2 }}
                            >
                                <CardContent sx={{ textAlign: 'center' }}>
                                    <Box
                                        sx={{
                                            width: 60,
                                            height: 60,
                                            borderRadius: '50%',
                                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                                            color: 'primary.main',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mx: 'auto',
                                            mb: 2
                                        }}
                                    >
                                        <Shuffle fontSize="large" sx={{ animation: randomLoading ? 'spin 1s linear infinite' : 'none', '@keyframes spin': { '0%': { transform: 'rotate(0deg)' }, '100%': { transform: 'rotate(360deg)' } } }} />
                                    </Box>
                                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                                        Random Shlok
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        Let destiny guide you to a verse for today's inspiration.
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <Card
                            variant="outlined"
                            sx={{
                                height: '100%',
                                borderRadius: 3,
                                transition: 'all 0.3s ease',
                                border: '1px solid',
                                borderColor: 'divider',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: 4,
                                    borderColor: 'primary.light'
                                }
                            }}
                        >
                            <CardActionArea
                                onClick={() => navigate("/memorize")}
                                sx={{ height: '100%', p: 2 }}
                            >
                                <CardContent sx={{ textAlign: 'center' }}>
                                    <Box
                                        sx={{
                                            width: 60,
                                            height: 60,
                                            borderRadius: '50%',
                                            bgcolor: alpha(theme.palette.success.main, 0.1),
                                            color: 'success.main',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mx: 'auto',
                                            mb: 2
                                        }}
                                    >
                                        <AutoStories fontSize="large" />
                                    </Box>
                                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                                        Memorize
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        Track your learning progress and master shloks.
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                </Grid>

                {/* Footer Section / Quote */}
                <Box sx={{ mt: 8, textAlign: 'center', opacity: 0.7 }}>
                    <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" sx={{ mb: 1, color: 'primary.main' }}>
                        <VerifiedUserOutlined fontSize="small" />
                        <Typography variant="subtitle2" fontWeight="bold">
                            AUTHENTIC SCRIPTURE
                        </Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                        "You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions."
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default HomePage;
