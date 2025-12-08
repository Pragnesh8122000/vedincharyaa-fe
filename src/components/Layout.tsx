import { AppBar, Box, Container, Toolbar, Typography, Stack } from "@mui/material";
import IconTooltip from "./IconTooltip";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Home, MenuBook, Favorite, Settings, Brightness4, Brightness7, History, School, Login, Logout } from "@mui/icons-material";
import { useColorMode } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

const Layout = () => {
    const { mode, toggleColorMode } = useColorMode();
    const { isAuthenticated, logout } = useAuth();
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

                        {!['/login', '/signup', '/verify-otp'].includes(location.pathname) && (
                            <Stack direction="row" spacing={1}>
                                <Link to="/">
                                    <IconTooltip title="Home" color={isActive('/') ? "primary" : "default"} aria-label="Home">
                                        <Home />
                                    </IconTooltip>
                                </Link>
                                <Link to="/browse">
                                    <IconTooltip title="Search shloks" color={isActive('/browse') ? "primary" : "default"} aria-label="Browse">
                                        <MenuBook />
                                    </IconTooltip>
                                </Link>
                                <Link to="/favorites">
                                    <IconTooltip title="Favorites" color={isActive('/favorites') ? "primary" : "default"} aria-label="Favorites">
                                        <Favorite />
                                    </IconTooltip>
                                </Link>
                                <Link to="/history">
                                    <IconTooltip title="History" color={isActive('/history') ? "primary" : "default"} aria-label="History">
                                        <History />
                                    </IconTooltip>
                                </Link>
                                <Link to="/memorize">
                                    <IconTooltip title="Memorization mode" color={isActive('/memorize') ? "primary" : "default"} aria-label="Memorize">
                                        <School />
                                    </IconTooltip>
                                </Link>
                                <Link to="/settings">
                                    <IconTooltip title="Settings" color={isActive('/settings') ? "primary" : "default"} aria-label="Settings">
                                        <Settings />
                                    </IconTooltip>
                                </Link>
                                <IconTooltip title="Toggle theme" onClick={toggleColorMode} color="inherit">
                                    {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
                                </IconTooltip>

                                {isAuthenticated ? (
                                    <IconTooltip title="Logout" onClick={logout} color="inherit">
                                        <Logout />
                                    </IconTooltip>
                                ) : (
                                    <Link to="/login">
                                        <IconTooltip title="Login" color="primary">
                                            <Login />
                                        </IconTooltip>
                                    </Link>
                                )}
                            </Stack>
                        )}
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
