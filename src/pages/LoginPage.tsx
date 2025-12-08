import { useState } from 'react';
import { Box, Button, TextField, Typography, Container, Card, CardContent, Stack, InputAdornment, IconButton } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { login as loginApi } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import { Email, Lock, Visibility, VisibilityOff, Login as LoginIcon } from '@mui/icons-material';

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
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
            const data = await loginApi(formData);
            login(data.token, data.user);
            navigate('/');
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
                            Welcome Back
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Sign in to continue your spiritual journey
                        </Typography>
                    </Box>

                    <Box component="form" onSubmit={handleSubmit}>
                        <Stack spacing={3}>
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

                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                fullWidth
                                disabled={loading}
                                startIcon={<LoginIcon />}
                                sx={{ py: 1.5, fontSize: '1.1rem' }}
                            >
                                {loading ? 'Logging in...' : 'Login'}
                            </Button>
                        </Stack>

                        <Box mt={4} textAlign="center">
                            <Typography variant="body2" color="text.secondary">
                                New to Vedincharyaa?{' '}
                                <Link to="/signup" style={{ textDecoration: 'none', fontWeight: 'bold', color: '#ff9933' }}>
                                    Create an Account
                                </Link>
                            </Typography>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </Container>
    );
};

export default LoginPage;
