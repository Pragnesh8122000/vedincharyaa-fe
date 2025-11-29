import { TextField, InputAdornment, Box, IconButton } from "@mui/material";
import { Search, Clear } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface SearchBarProps {
    initialValue?: string;
    onSearch?: (query: string) => void;
}

const SearchBar = ({ initialValue = "", onSearch }: SearchBarProps) => {
    const [query, setQuery] = useState(initialValue);
    const navigate = useNavigate();

    useEffect(() => {
        setQuery(initialValue);
    }, [initialValue]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (onSearch) {
            onSearch(query);
        } else {
            navigate(`/browse?q=${encodeURIComponent(query)}`);
        }
    };

    const handleClear = () => {
        setQuery("");
        if (onSearch) {
            onSearch("");
        } else {
            navigate('/browse');
        }
    };

    return (
        <Box component="form" onSubmit={handleSearch} sx={{ width: '100%' }}>
            <TextField
                fullWidth
                placeholder="Search shloks by word, meaning, or theme..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                variant="outlined"
                slotProps={{
                    input: {
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search color="action" />
                            </InputAdornment>
                        ),
                        endAdornment: query && (
                            <InputAdornment position="end">
                                <IconButton onClick={handleClear} edge="end">
                                    <Clear />
                                </IconButton>
                            </InputAdornment>
                        ),
                        sx: { bgcolor: 'background.paper', borderRadius: 2 }
                    }
                }}
            />
        </Box>
    );
};

export default SearchBar;
