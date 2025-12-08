import { Box, Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Home } from '@mui/icons-material';

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <Container maxWidth="md" sx={{ py: 10, textAlign: 'center' }}>
            <Box
                component="img"
                src="https://illustrations.popsy.co/amber/floating-guru.svg"
                // Using a placeholder illustration that fits the theme vaguely or a generic 404 one
                // Since I can't guarantee an asset, I'll rely on Typography mainly if this image fails or just omit it if preferred.
                // Let's stick to pure UI elements to be safe and "expert".
                sx={{ display: 'none' }}
            />

            <Typography variant="h1" color="primary" sx={{ fontWeight: 'bold', fontSize: '8rem', opacity: 0.2 }}>
                404
            </Typography>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                Page Not Found
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                <br />
                Or perhaps this is just Maya (illusion)?
            </Typography>

            <Button
                variant="contained"
                size="large"
                startIcon={<Home />}
                onClick={() => navigate('/')}
            >
                Return Home
            </Button>
        </Container>
    );
};

export default NotFoundPage;
