import { Box, Container, Typography, Stack, CircularProgress, Button } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getHistory } from "../api/historyApi";
import ShlokCard from "../components/ShlokCard";
import { useNavigate } from "react-router-dom";

const HistoryPage = () => {
    const navigate = useNavigate();
    const { data: history = [], isLoading } = useQuery({
        queryKey: ['history'],
        queryFn: getHistory
    });

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Stack spacing={4} alignItems="stretch">
                <Typography variant="h4" component="h1" sx={{ fontFamily: 'serif', color: 'primary.main', fontWeight: 'bold' }}>
                    Recent History
                </Typography>

                {isLoading ? (
                    <Box textAlign="center" py={5}>
                        <CircularProgress />
                    </Box>
                ) : history.length > 0 ? (
                    <Stack spacing={2}>
                        {history.map((shlok, index) => (
                            <ShlokCard key={`${shlok.chapterNumber}-${shlok.verseNumber}-${index}`} shlok={shlok} />
                        ))}
                    </Stack>
                ) : (
                    <Box textAlign="center" py={5} sx={{ bgcolor: 'background.paper', borderRadius: 2, p: 4 }}>
                        <Typography variant="body1" color="text.secondary" paragraph>
                            You haven't viewed any shloks yet.
                        </Typography>
                        <Button variant="contained" onClick={() => navigate("/browse")}>Browse Shloks</Button>
                    </Box>
                )}
            </Stack>
        </Container>
    );
};

export default HistoryPage;
