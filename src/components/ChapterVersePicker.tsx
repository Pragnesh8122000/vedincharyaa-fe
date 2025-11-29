import { FormControl, InputLabel, Select, MenuItem, Stack, Button, SelectChangeEvent } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getChapters } from "../api/chapterApi";

const ChapterVersePicker = () => {
    const navigate = useNavigate();
    const [selectedChapter, setSelectedChapter] = useState<string>("");
    const [selectedVerse, setSelectedVerse] = useState<string>("");
    const [verseCount, setVerseCount] = useState<number>(0);

    const { data: chapters = [] } = useQuery({
        queryKey: ['chapters'],
        queryFn: getChapters,
        staleTime: 1000 * 60 * 60,
    });

    const handleChapterChange = (event: SelectChangeEvent) => {
        const chapterNum = event.target.value;
        setSelectedChapter(chapterNum);
        setSelectedVerse(""); // Reset verse

        const chapter = chapters.find(c => c.chapterNumber.toString() === chapterNum);
        if (chapter) {
            setVerseCount(chapter.verseCount);
        } else {
            setVerseCount(0);
        }
    };

    const handleVerseChange = (event: SelectChangeEvent) => {
        setSelectedVerse(event.target.value);
    };

    const handleGo = () => {
        if (selectedChapter && selectedVerse) {
            navigate(`/shlok/${selectedChapter}/${selectedVerse}`);
        }
    };

    return (
        <Stack direction="row" spacing={2} alignItems="center">
            <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel id="chapter-select-label">Chapter</InputLabel>
                <Select
                    labelId="chapter-select-label"
                    value={selectedChapter}
                    label="Chapter"
                    onChange={handleChapterChange}
                >
                    {chapters.map((chapter) => (
                        <MenuItem key={chapter.chapterNumber} value={chapter.chapterNumber.toString()}>
                            Chapter {chapter.chapterNumber}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 100 }} disabled={!selectedChapter}>
                <InputLabel id="verse-select-label">Verse</InputLabel>
                <Select
                    labelId="verse-select-label"
                    value={selectedVerse}
                    label="Verse"
                    onChange={handleVerseChange}
                >
                    {Array.from({ length: verseCount }, (_, i) => i + 1).map((verse) => (
                        <MenuItem key={verse} value={verse.toString()}>
                            Verse {verse}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Button
                variant="contained"
                onClick={handleGo}
                disabled={!selectedChapter || !selectedVerse}
            >
                Go
            </Button>
        </Stack>
    );
};

export default ChapterVersePicker;
