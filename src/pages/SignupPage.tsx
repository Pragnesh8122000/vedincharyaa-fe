import { useState } from 'react';
import { Box, Button, TextField, Typography, Container, Card, CardContent, Stack, InputAdornment, IconButton } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../api/authApi';
import { Person, Email, Lock, Visibility, VisibilityOff, ArrowForward } from '@mui/icons-material';

const SignupPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await signup(formData);
            // Redirect to verify otp with email in query param
            navigate(`/verify-otp?email=${encodeURIComponent(formData.email)}`);
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
                        <Typography variant="h4" component="h1" gutterBottom fontFamily="serif" color="primary" fontWeight="bold">
                            Join Vedincharyaa
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Begin your journey into ancient wisdom
                        </Typography>
                    </Box>

                    <Box component="form" onSubmit={handleSubmit}>
                        <Stack spacing={3}>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                <TextField
                                    label="First Name"
                                    name="firstName"
                                    required
                                    fullWidth
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Person color="action" />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <TextField
                                    label="Last Name"
                                    name="lastName"
                                    required
                                    fullWidth
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Person color="action" />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Stack>
                            <TextField
                                label="Email Address"
                                name="email"
                                type="email"
                                required
                                fullWidth
                                value={formData.email}
                                onChange={handleChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Email color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                label="Password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                required
                                fullWidth
                                value={formData.password}
                                onChange={handleChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Lock color="action" />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <Typography variant="caption" color="text.secondary" sx={{ mt: -1, ml: 1, display: 'block' }}>
                                Password must be at least 6 characters
                            </Typography>

                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                fullWidth
                                disabled={loading}
                                endIcon={<ArrowForward />}
                                sx={{ py: 1.5, fontSize: '1.1rem' }}
                            >
                                {loading ? 'Creating Account...' : 'Sign Up'}
                            </Button>
                        </Stack>

                        <Box mt={4} textAlign="center">
                            <Typography variant="body2" color="text.secondary">
                                Already have an account?{' '}
                                <Link to="/login" style={{ textDecoration: 'none', fontWeight: 'bold', color: '#ff9933' }}>
                                    Login here
                                </Link>
                            </Typography>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </Container>
    );
};

export default SignupPage;
