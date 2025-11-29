import { Box, Container, Typography, Stack, Card, CardContent, CardHeader, Divider, Switch, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from "@mui/material";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { updateSettings } from "../store/shlokSlice";

const SettingsPage = () => {
    const settings = useAppSelector((state) => state.shlok.settings);
    const dispatch = useAppDispatch();

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Stack spacing={4} alignItems="stretch">
                <Typography variant="h4" component="h1" sx={{ fontFamily: 'serif', color: 'primary.main', fontWeight: 'bold' }}>
                    Settings
                </Typography>

                <Card variant="outlined">
                    <CardHeader title="Reading Preferences" titleTypographyProps={{ variant: 'h6' }} />
                    <Divider />
                    <CardContent>
                        <Stack spacing={4}>
                            <Box>
                                <FormControl component="fieldset">
                                    <FormLabel component="legend" sx={{ mb: 1, fontWeight: 'bold' }}>Font Size</FormLabel>
                                    <RadioGroup
                                        row
                                        value={settings.fontSize}
                                        onChange={(e) => dispatch(updateSettings({ fontSize: e.target.value as 'small' | 'medium' | 'large' }))}
                                    >
                                        <FormControlLabel value="small" control={<Radio />} label="Small" />
                                        <FormControlLabel value="medium" control={<Radio />} label="Medium" />
                                        <FormControlLabel value="large" control={<Radio />} label="Large" />
                                    </RadioGroup>
                                </FormControl>
                            </Box>

                            <Divider />

                            <Box>
                                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Translations</Typography>
                                <Stack spacing={1}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={settings.showEnglishTranslation}
                                                onChange={(e) => dispatch(updateSettings({ showEnglishTranslation: e.target.checked }))}
                                            />
                                        }
                                        label="Show English Translation"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={settings.showHindiTranslation}
                                                onChange={(e) => dispatch(updateSettings({ showHindiTranslation: e.target.checked }))}
                                            />
                                        }
                                        label="Show Hindi Translation"
                                    />
                                </Stack>
                            </Box>
                        </Stack>
                    </CardContent>
                </Card>

                <Card variant="outlined">
                    <CardHeader title="About" titleTypographyProps={{ variant: 'h6' }} />
                    <Divider />
                    <CardContent>
                        <Typography variant="body1">Vedincharya v1.0.0</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            A spiritual companion for reading and understanding the Bhagavad Gita.
                        </Typography>
                    </CardContent>
                </Card>
            </Stack>
        </Container>
    );
};

export default SettingsPage;
