import { useState } from 'react';
import { Box, Button, TextField, Typography, Container, Card, CardContent, Stack, InputAdornment } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { verifyOtp } from '../api/authApi';
import { Key, VerifiedUser } from '@mui/icons-material';

const VerifyOtpPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const email = searchParams.get('email') || '';

    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await verifyOtp({ email, otp });
            // Redirect to login on success
            navigate('/login');
        } catch (err: any) {
            // Toast will handle error
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ py: 8, minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Card sx={{ width: '100%', p: 2 }}>
                <CardContent>
                    <Box textAlign="center" mb={4}>
                        <VerifiedUser color="primary" sx={{ fontSize: 60, mb: 2 }} />
                        <Typography variant="h4" component="h1" gutterBottom fontFamily="serif" color="primary" fontWeight="bold">
                            Verify Email
                        </Typography>
                        <Typography variant="body1" color="text.secondary" gutterBottom>
                            We've sent a 6-digit verification code to
                        </Typography>
                        <Typography variant="subtitle1" fontWeight="bold" color="text.primary">
                            {email}
                        </Typography>
                    </Box>

                    <Box component="form" onSubmit={handleSubmit}>
                        <Stack spacing={4}>
                            <Box>
                                <TextField
                                    label="Enter Verification Code"
                                    name="otp"
                                    required
                                    fullWidth
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    // Tracking added to simulate code input feel
                                    inputProps={{
                                        maxLength: 6,
                                        style: {
                                            textAlign: 'center',
                                            letterSpacing: '0.8em',
                                            fontSize: '1.5em',
                                            fontWeight: 'bold',
                                            paddingLeft: '0.8em' // Balance the spacing visually
                                        }
                                    }}
                                    placeholder="------"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Key color="action" />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <Typography variant="caption" display="block" align="center" color="text.disabled" mt={1}>
                                    (Hint: Use 123456 for testing)
                                </Typography>
                            </Box>

                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                fullWidth
                                disabled={loading || otp.length !== 6}
                                sx={{ py: 1.5, fontSize: '1.1rem' }}
                            >
                                {loading ? 'Verifying...' : 'Verify & Continue'}
                            </Button>
                        </Stack>
                    </Box>
                </CardContent>
            </Card>
        </Container>
    );
};

export default VerifyOtpPage;
