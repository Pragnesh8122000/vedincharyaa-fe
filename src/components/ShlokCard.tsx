import { Card, CardContent, Typography, Chip, Stack, CardActionArea } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Shlok } from "../api/shlokApi";

interface ShlokCardProps {
    shlok: Shlok;
}

const ShlokCard = ({ shlok }: ShlokCardProps) => {
    const navigate = useNavigate();

    return (
        <Card variant="outlined" sx={{ '&:hover': { borderColor: 'primary.main', boxShadow: 2 } }}>
            <CardActionArea onClick={() => navigate(`/shlok/${shlok.chapterNumber}/${shlok.verseNumber}`)}>
                <CardContent>
                    <Stack spacing={2}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Chip
                                label={`Chapter ${shlok.chapterNumber}, Verse ${shlok.verseNumber}`}
                                color="primary"
                                size="small"
                                variant="outlined"
                            />
                        </Stack>

                        <Typography variant="h6" component="div" sx={{ fontFamily: 'serif', fontStyle: 'italic' }}>
                            {shlok.sanskritText}
                        </Typography>

                        <Typography variant="body2" color="text.secondary" sx={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {shlok.translationEnglish || shlok.translationHindi}
                        </Typography>
                    </Stack>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export default ShlokCard;
