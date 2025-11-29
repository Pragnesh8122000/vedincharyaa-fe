import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Box,
    Chip,
    OutlinedInput,
    SelectChangeEvent
} from "@mui/material";
import { useState, useEffect } from "react";
import { Chapter } from "../api/chapterApi";

interface FilterDialogProps {
    open: boolean;
    onClose: () => void;
    onApply: (filters: { chapterNumbers: number[]; tags: string[] }) => void;
    chapters: Chapter[];
    initialFilters: { chapterNumbers: number[]; tags: string[] };
}

const FilterDialog = ({ open, onClose, onApply, chapters, initialFilters }: FilterDialogProps) => {
    const [selectedChapters, setSelectedChapters] = useState<number[]>([]);
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState("");

    useEffect(() => {
        if (open) {
            setSelectedChapters(initialFilters.chapterNumbers);
            setTags(initialFilters.tags);
        }
    }, [open, initialFilters]);

    const handleChapterChange = (event: SelectChangeEvent<number[]>) => {
        const {
            target: { value },
        } = event;
        setSelectedChapters(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',').map(Number) : value,
        );
    };

    const handleTagKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' && tagInput.trim()) {
            event.preventDefault();
            if (!tags.includes(tagInput.trim())) {
                setTags([...tags, tagInput.trim()]);
            }
            setTagInput("");
        }
    };

    const handleDeleteTag = (tagToDelete: string) => {
        setTags((tags) => tags.filter((tag) => tag !== tagToDelete));
    };

    const handleApply = () => {
        onApply({ chapterNumbers: selectedChapters, tags });
        onClose();
    };

    const handleReset = () => {
        setSelectedChapters([]);
        setTags([]);
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Filter Shloks</DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
                    <FormControl fullWidth>
                        <InputLabel id="chapter-multiple-checkbox-label">Chapters</InputLabel>
                        <Select
                            labelId="chapter-multiple-checkbox-label"
                            id="chapter-multiple-checkbox"
                            multiple
                            value={selectedChapters}
                            onChange={handleChapterChange}
                            input={<OutlinedInput label="Chapters" />}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map((value) => (
                                        <Chip key={value} label={`Ch ${value}`} size="small" />
                                    ))}
                                </Box>
                            )}
                            MenuProps={{
                                PaperProps: {
                                    style: {
                                        maxHeight: 224,
                                        width: 250,
                                    },
                                },
                            }}
                        >
                            {chapters.map((chapter) => (
                                <MenuItem key={chapter.chapterNumber} value={chapter.chapterNumber}>
                                    Chapter {chapter.chapterNumber}: {chapter.chapterName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Box>
                        <TextField
                            fullWidth
                            label="Tags (Press Enter to add)"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleTagKeyDown}
                            placeholder="e.g. karma, bhakti"
                        />
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                            {tags.map((tag) => (
                                <Chip
                                    key={tag}
                                    label={tag}
                                    onDelete={() => handleDeleteTag(tag)}
                                />
                            ))}
                        </Box>
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleReset} color="inherit">Reset</Button>
                <Button onClick={onClose} color="inherit">Cancel</Button>
                <Button onClick={handleApply} variant="contained">Apply Filters</Button>
            </DialogActions>
        </Dialog>
    );
};

export default FilterDialog;
