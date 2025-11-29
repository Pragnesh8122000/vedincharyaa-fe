```
import {
    Box,
    Button,
    Container,
    Stack,
    Typography,
    Paper,
} from "@mui/material";
import { NavigateNext, NavigateBefore } from "@mui/icons-material";

const GeetaShloks = () => {
    return (
        <Box
            sx={{
                width: '100%',
                px: 8,
                py: 8,
                minHeight: '90vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            {/* Controls and Shlok Section */}
            <Box flex={1} p={3} sx={{ bgcolor: 'background.paper', height: '100vh', width: '100%' }}>
                <Stack spacing={4} alignItems="center">
                    {/* Navigation Buttons */}
                    <Stack direction="row" spacing={2} justifyContent="center">
                        <Button variant="outlined"><NavigateBefore /></Button>
                        <Button variant="outlined"><NavigateNext /></Button>
                    </Stack>

                    {/* Shlok Display */}
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            bgcolor: 'warning.light', // orange.50 equivalent-ish
                            borderRadius: 3,
                            borderLeft: 4,
                            borderColor: 'warning.main', // orange.500
                            position: 'relative',
                            maxWidth: '600px'
                        }}
                    >
                        <Typography
                            variant="h5"
                            color="warning.main"
                            sx={{ mb: 2, fontFamily: 'serif', fontWeight: 'bold' }}
                        >
                            अध्याय 1 श्लोक 1
                        </Typography>

                        <Typography
                            variant="h6"
                            fontWeight="bold"
                            sx={{ lineHeight: 1.8, color: 'text.primary', textAlign: 'justify' }}
                        >
                            "धर्मक्षेत्रे कुरुक्षेत्रे समवेता युयुत्सवः | <br />
                            मामकाः पाण्डवाश्चैव किमकुर्वत सञ्जय ||1||"
                        </Typography>
                    </Paper>
                    <Typography
                        variant="body2"
                        color="warning.dark"
                        fontWeight="bold"
                        sx={{ opacity: 0.8 }}
                    >
                        Chapter 1 • Verse 1
                    </Typography>
                </Stack>
            </Box>
        </Box>
    );
};

export default GeetaShloks;
```
