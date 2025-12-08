import { Box, Container, Typography, Stack, CircularProgress, Button, Chip, Tooltip } from "@mui/material";
import { FilterList } from "@mui/icons-material";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { getChapters } from "../api/chapterApi";
import { getShloks } from "../api/shlokApi";
import ShlokCard from "../components/ShlokCard";
import SearchBar from "../components/SearchBar";
import FilterDialog from "../components/FilterDialog";

const ShlokListPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialQuery = searchParams.get("q") || "";

    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [filters, setFilters] = useState<{ chapterNumbers: number[]; tags: string[] }>({
        chapterNumbers: [],
        tags: []
    });
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const { data: chapters = [] } = useQuery({
        queryKey: ['chapters'],
        queryFn: getChapters,
        staleTime: 1000 * 60 * 60,
    });

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error
    } = useInfiniteQuery({
        queryKey: ['shloks', filters.chapterNumbers, filters.tags, searchQuery],
        queryFn: ({ pageParam = 1 }) => getShloks({
            chapterNumbers: filters.chapterNumbers.length > 0 ? filters.chapterNumbers.join(',') : undefined,
            tags: filters.tags.length > 0 ? filters.tags.join(',') : undefined,
            search: searchQuery || undefined,
            page: pageParam,
            limit: 20
        }),
        getNextPageParam: (lastPage) => lastPage.pagination.nextPage,
        initialPageParam: 1
    });

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setSearchParams(query ? { q: query } : {});
    };

    const handleApplyFilters = (newFilters: { chapterNumbers: number[]; tags: string[] }) => {
        setFilters(newFilters);
    };

    // Flatten the pages of shloks
    const allShloks = data?.pages.flatMap(page => page.items) || [];

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Stack spacing={4} alignItems="stretch">
                <Typography variant="h4" component="h1" sx={{ fontFamily: 'serif', color: 'primary.main', fontWeight: 'bold' }}>
                    Browse Shloks
                </Typography>

                <Stack direction="row" spacing={2}>
                    <SearchBar initialValue={searchQuery} onSearch={handleSearch} />
                    <Tooltip title="Filter shloks">
                        <Button
                            variant="outlined"
                            startIcon={<FilterList />}
                            onClick={() => setIsFilterOpen(true)}
                            sx={{ minWidth: 120 }}
                        >
                            Filters
                            {(filters.chapterNumbers.length > 0 || filters.tags.length > 0) && (
                                <Box component="span" sx={{
                                    ml: 1,
                                    bgcolor: 'primary.main',
                                    color: 'white',
                                    borderRadius: '50%',
                                    width: 20,
                                    height: 20,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.75rem'
                                }}>
                                    {filters.chapterNumbers.length + filters.tags.length}
                                </Box>
                            )}
                        </Button>
                    </Tooltip>
                </Stack>

                {/* Active Filters Display */}
                {(filters.chapterNumbers.length > 0 || filters.tags.length > 0) && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {filters.chapterNumbers.map(ch => (
                            <Chip
                                key={`ch-${ch}`}
                                label={`Chapter ${ch}`}
                                onDelete={() => setFilters(prev => ({ ...prev, chapterNumbers: prev.chapterNumbers.filter(c => c !== ch) }))}
                            />
                        ))}
                        {filters.tags.map(tag => (
                            <Chip
                                key={`tag-${tag}`}
                                label={tag}
                                onDelete={() => setFilters(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }))}
                            />
                        ))}
                        <Button size="small" onClick={() => setFilters({ chapterNumbers: [], tags: [] })}>
                            Clear All
                        </Button>
                    </Box>
                )}

                <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {isLoading ? "Loading..." : `Showing ${allShloks.length} shloks`}
                    </Typography>

                    {isLoading ? (
                        <Box textAlign="center" py={5}>
                            <CircularProgress />
                        </Box>
                    ) : isError ? (
                        <Box textAlign="center" py={5}>
                            <Typography color="error">
                                Error loading shloks: {(error as Error).message}
                            </Typography>
                        </Box>
                    ) : allShloks.length > 0 ? (
                        <Stack spacing={2}>
                            {allShloks.map((shlok) => (
                                <ShlokCard key={`${shlok.chapterNumber}-${shlok.verseNumber}`} shlok={shlok} />
                            ))}

                            {hasNextPage && (
                                <Box textAlign="center" py={2}>
                                    <Button
                                        variant="outlined"
                                        onClick={() => fetchNextPage()}
                                        disabled={isFetchingNextPage}
                                    >
                                        {isFetchingNextPage ? 'Loading more...' : 'Load more'}
                                    </Button>
                                </Box>
                            )}
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

            <FilterDialog
                open={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                onApply={handleApplyFilters}
                chapters={chapters}
                initialFilters={filters}
            />
        </Container>
    );
};

export default ShlokListPage;
