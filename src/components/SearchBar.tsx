import { TextField, InputAdornment, Box } from "@mui/material";
import { Search } from "@mui/icons-material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/browse?q=${encodeURIComponent(query)}`);
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
                        sx: { bgcolor: 'background.paper', borderRadius: 2 }
                    }
                }}
            />
        </Box>
    );
};

export default SearchBar;
