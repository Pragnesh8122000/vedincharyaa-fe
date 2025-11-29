import { Box, Container, Typography, Stack, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, CircularProgress } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getChapters } from "../api/chapterApi";
import { getShloks } from "../api/shlokApi";
import ShlokCard from "../components/ShlokCard";
import SearchBar from "../components/SearchBar";

const ShlokListPage = () => {
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get("q") || "";
    const [selectedChapter, setSelectedChapter] = useState<string>("all");

    const { data: chapters = [] } = useQuery({
        queryKey: ['chapters'],
        queryFn: getChapters,
        staleTime: 1000 * 60 * 60,
    });

    const { data: shloks = [], isLoading: loading } = useQuery({
        queryKey: ['shloks', selectedChapter, searchQuery],
        queryFn: () => getShloks({
            chapterNumber: selectedChapter !== "all" ? parseInt(selectedChapter) : undefined,
            search: searchQuery || undefined,
            limit: 100 // Fetch reasonable amount
        }),
        enabled: true
    });

    const handleChapterChange = (event: SelectChangeEvent) => {
        setSelectedChapter(event.target.value as string);
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Stack spacing={4} alignItems="stretch">
                <Typography variant="h4" component="h1" sx={{ fontFamily: 'serif', color: 'primary.main', fontWeight: 'bold' }}>
                    Browse Shloks
                </Typography>

                <SearchBar />

                <Box>
                    <FormControl fullWidth size="small">
                        <InputLabel id="chapter-filter-label">Filter by Chapter</InputLabel>
                        <Select
                            labelId="chapter-filter-label"
                            value={selectedChapter}
                            label="Filter by Chapter"
                            onChange={handleChapterChange}
                        >
                            <MenuItem value="all">All Chapters</MenuItem>
                            {chapters.map((chapter) => (
                                <MenuItem key={chapter.chapterNumber} value={chapter.chapterNumber.toString()}>
                                    Chapter {chapter.chapterNumber}: {chapter.chapterName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {loading ? "Loading..." : `Showing ${shloks.length} shloks`}
                    </Typography>

                    {loading ? (
                        <Box textAlign="center" py={5}>
                            <CircularProgress />
                        </Box>
                    ) : shloks.length > 0 ? (
                        <Stack spacing={2}>
                            {shloks.map((shlok) => (
                                <ShlokCard key={`${shlok.chapterNumber}-${shlok.verseNumber}`} shlok={shlok} />
                            ))}
                        </Stack>
                    ) : (
                        <Box textAlign="center" py={5}>
                            <Typography color="text.secondary">
                                No shloks found matching your criteria.
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Stack>
        </Container>
    );
};

export default ShlokListPage;
