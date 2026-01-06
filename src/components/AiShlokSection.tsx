import React, { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    TextField,
    Paper,
    CircularProgress,
    Divider,
    Stack,
    Alert,
    IconButton,
    InputAdornment
} from '@mui/material';
import { Send, AutoAwesome, HelpOutline, Clear } from '@mui/icons-material';
import { explainShlok, askAiQuestion } from '../api/aiApi';
import { useToast } from '../providers/ToastProvider';

interface AiShlokSectionProps {
    shlokId: string; // Format: chapter-verse
}

const AiShlokSection: React.FC<AiShlokSectionProps> = ({ shlokId }) => {
    const [loading, setLoading] = useState(false);
    const [aiResponse, setAiResponse] = useState<string | null>(null);
    const [question, setQuestion] = useState('');
    const [error, setError] = useState<string | null>(null);
    const { showToast } = useToast();

    const handleExplain = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await explainShlok(shlokId);
            setAiResponse(data.response);
        } catch (err: any) {
            console.error('AI Explain Error:', err);
            setError(err.response?.data?.message || 'Unable to generate explanation right now.');
        } finally {
            setLoading(false);
        }
    };

    const handleAsk = async () => {
        if (!question.trim()) {
            showToast('Please enter a question', 'warning');
            return;
        }

        if (question.length > 300) {
            showToast('Question is too long (max 300 chars)', 'warning');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const data = await askAiQuestion(shlokId, question);
            setAiResponse(data.response);
        } catch (err: any) {
            console.error('AI Ask Error:', err);
            setError(err.response?.data?.message || 'Unable to generate answer right now.');
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setAiResponse(null);
        setQuestion('');
        setError(null);
    };

    return (
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, mt: 4, bgcolor: 'rgba(255, 255, 255, 0.5)', backdropFilter: 'blur(10px)' }}>
            <Stack spacing={3}>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <AutoAwesome color="primary" fontSize="small" />
                    <Typography variant="h6" fontWeight="bold">
                        Understand this Shlok
                    </Typography>
                </Stack>

                {!aiResponse && !loading && (
                    <Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            Get deep spiritual insights and contextual explanations powered by AI.
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<AutoAwesome />}
                            onClick={handleExplain}
                            sx={{ mt: 1, borderRadius: 2 }}
                        >
                            Explain this Shlok
                        </Button>
                    </Box>
                )}

                {(loading || aiResponse || error) && (
                    <Box sx={{ position: 'relative' }}>
                        {loading ? (
                            <Stack alignItems="center" py={4} spacing={2}>
                                <CircularProgress size={30} />
                                <Typography variant="body2" color="text.secondary">Thinking...</Typography>
                            </Stack>
                        ) : (
                            <Box>
                                {error ? (
                                    <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
                                ) : (
                                    <Box sx={{ p: 2, bgcolor: 'primary.50', borderRadius: 2, borderLeft: '4px solid', borderLeftColor: 'primary.main' }}>
                                        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
                                            {aiResponse}
                                        </Typography>
                                    </Box>
                                )}
                                <Button
                                    size="small"
                                    startIcon={<Clear />}
                                    onClick={handleClear}
                                    sx={{ mt: 1 }}
                                >
                                    Clear response
                                </Button>
                            </Box>
                        )}
                    </Box>
                )}

                <Divider />

                <Box>
                    <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <HelpOutline fontSize="inherit" /> Ask a question
                    </Typography>
                    <TextField
                        fullWidth
                        placeholder="What does this teach about attachment?"
                        variant="outlined"
                        size="small"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        disabled={loading}
                        onKeyPress={(e) => e.key === 'Enter' && handleAsk()}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={handleAsk}
                                        disabled={loading || !question.trim()}
                                        color="primary"
                                        edge="end"
                                    >
                                        <Send />
                                    </IconButton>
                                </InputAdornment>
                            ),
                            sx: { borderRadius: 2 }
                        }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                        {question.length}/300 characters
                    </Typography>
                </Box>
            </Stack>
        </Paper>
    );
};

export default AiShlokSection;
