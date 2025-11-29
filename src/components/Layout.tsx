import { AppBar, Box, Container, Toolbar, Typography, IconButton, Stack, useTheme } from "@mui/material";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Home, MenuBook, Favorite, Settings, Brightness4, Brightness7, History } from "@mui/icons-material";
import { useColorMode } from "../context/ThemeContext";

const Layout = () => {
    const { mode, toggleColorMode } = useColorMode();
    const theme = useTheme();
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
            {/* Navigation Bar */}
            <AppBar position="sticky" color="default" elevation={1} sx={{ bgcolor: 'background.paper' }}>
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <Link to="/" style={{ textDecoration: 'none', flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                            <Typography variant="h5" component="div" sx={{ color: 'primary.main', fontFamily: 'serif', fontWeight: 'bold' }}>
                                Vedincharya
                            </Typography>
                        </Link>

                        <Stack direction="row" spacing={1}>
                            <Link to="/">
                                <IconButton color={isActive('/') ? "primary" : "default"} aria-label="Home">
                                    <Home />
                                </IconButton>
                            </Link>
                            <Link to="/browse">
                                <IconButton color={isActive('/browse') ? "primary" : "default"} aria-label="Browse">
                                    <MenuBook />
                                </IconButton>
                            </Link>
                            <Link to="/favorites">
                                <IconButton color={isActive('/favorites') ? "primary" : "default"} aria-label="Favorites">
                                    <Favorite />
                                </IconButton>
                            </Link>
                            <Link to="/history">
                                <IconButton color={isActive('/history') ? "primary" : "default"} aria-label="History">
                                    <History />
                                </IconButton>
                            </Link>
                            <Link to="/settings">
                                <IconButton color={isActive('/settings') ? "primary" : "default"} aria-label="Settings">
                                    <Settings />
                                </IconButton>
                            </Link>
                            <IconButton onClick={toggleColorMode} color="inherit">
                                {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
                            </IconButton>
                        </Stack>
                    </Toolbar>
                </Container>
            </AppBar>

            {/* Main Content */}
            <Container maxWidth="xl" sx={{ py: 4, flexGrow: 1 }}>
                <Outlet />
            </Container>
        </Box>
    );
};

export default Layout;
