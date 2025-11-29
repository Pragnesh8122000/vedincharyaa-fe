import { Box, Container, Typography, Stack, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, CircularProgress } from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFavorites, clearFavorites } from "../api/favoritesApi";
import ShlokCard from "../components/ShlokCard";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const FavoritesPage = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [openDialog, setOpenDialog] = useState(false);

    const { data: favorites = [], isLoading } = useQuery({
        queryKey: ['favorites'],
        queryFn: getFavorites
    });

    const clearMutation = useMutation({
        mutationFn: clearFavorites,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['favorites'] });
            setOpenDialog(false);
        }
    });

    const handleClearFavorites = () => {
        clearMutation.mutate();
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Stack spacing={4} alignItems="stretch">
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h4" component="h1" sx={{ fontFamily: 'serif', color: 'primary.main', fontWeight: 'bold' }}>
                        My Favorites
                    </Typography>
                    {favorites.length > 0 && (
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={() => setOpenDialog(true)}
                        >
                            Clear All
                        </Button>
                    )}
                </Box>

                {isLoading ? (
                    <Box textAlign="center" py={5}>
                        <CircularProgress />
                    </Box>
                ) : favorites.length > 0 ? (
                    <Stack spacing={2}>
                        {favorites.map((shlok) => (
                            <ShlokCard key={`${shlok.chapterNumber}-${shlok.verseNumber}`} shlok={shlok} />
                        ))}
                    </Stack>
                ) : (
                    <Box textAlign="center" py={5} sx={{ bgcolor: 'background.paper', borderRadius: 2, p: 4 }}>
                        <Typography variant="body1" color="text.secondary" paragraph>
                            You haven't added any favorites yet.
                        </Typography>
                        <Button variant="contained" onClick={() => navigate("/browse")}>Browse Shloks</Button>
                    </Box>
                )}
            </Stack>

            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
            >
                <DialogTitle>Clear Favorites</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to clear all your favorite shloks? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleClearFavorites} color="error" autoFocus disabled={clearMutation.isPending}>
                        {clearMutation.isPending ? "Clearing..." : "Clear All"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default FavoritesPage;
