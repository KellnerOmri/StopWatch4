import React from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { ScreenContainer } from '../../components/shared/ScreenContainer';
import { BackButton } from '../../components/shared/BackButton';
import { Card } from '../../components/shared/Card';
import { ThemedText } from '../../components/shared/ThemedText';
import { useAppDispatch } from '../../app/hooks';
import { setSelectedPage } from '../../store/global.slice';
import { PagesNameEnum } from '../../models';

export const Settings = () => {
    const { theme, isDarkMode, toggleTheme } = useTheme();
    const { t, language, toggleLanguage } = useLanguage();
    const dispatch = useAppDispatch();

    const packageJson = require('../../../package.json');
    const version = packageJson.version;

    return (
        <ScreenContainer>
            <BackButton onPress={() => dispatch(setSelectedPage(PagesNameEnum.menu))} />

            <ThemedText variant="heading1" style={styles.title}>
                {t.settings}
            </ThemedText>

            <ThemedText
                variant="caption"
                style={[styles.sectionLabel, { color: theme.colors.textSecondary }]}
            >
                {t.appearance.toUpperCase()}
            </ThemedText>
            <Card style={styles.card}>
                <View style={styles.row}>
                    <View style={styles.rowLeft}>
                        <View style={[styles.iconCircle, { backgroundColor: theme.colors.primaryContainer }]}>
                            <Ionicons name="moon" size={18} color={theme.colors.primary} />
                        </View>
                        <ThemedText variant="body">{t.darkMode}</ThemedText>
                    </View>
                    <Switch
                        value={isDarkMode}
                        onValueChange={toggleTheme}
                        trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                        thumbColor={theme.colors.surface}
                    />
                </View>
            </Card>

            <ThemedText
                variant="caption"
                style={[styles.sectionLabel, { color: theme.colors.textSecondary }]}
            >
                {t.general.toUpperCase()}
            </ThemedText>
            <Card style={styles.card}>
                <TouchableOpacity style={styles.row} onPress={toggleLanguage}>
                    <View style={styles.rowLeft}>
                        <View style={[styles.iconCircle, { backgroundColor: '#E0F2FE' }]}>
                            <Ionicons name="language" size={18} color="#0284C7" />
                        </View>
                        <ThemedText variant="body">{t.language}</ThemedText>
                    </View>
                    <View style={styles.rowRight}>
                        <Text style={[styles.languageLabel, { color: theme.colors.textSecondary }]}>
                            {language === 'en' ? t.english : t.hebrew}
                        </Text>
                        <Ionicons name="chevron-forward" size={18} color={theme.colors.textTertiary} />
                    </View>
                </TouchableOpacity>
            </Card>

            <ThemedText variant="caption" style={styles.versionText}>
                {t.version} {version}
            </ThemedText>
        </ScreenContainer>
    );
};

const styles = StyleSheet.create({
    title: {
        marginTop: 16,
        marginBottom: 24,
    },
    sectionLabel: {
        marginBottom: 8,
        marginLeft: 4,
        letterSpacing: 1,
    },
    card: {
        marginBottom: 24,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    rowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    rowRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    iconCircle: {
        width: 34,
        height: 34,
        borderRadius: 17,
        alignItems: 'center',
        justifyContent: 'center',
    },
    languageLabel: {
        fontSize: 15,
    },
    versionText: {
        textAlign: 'center',
        marginTop: 'auto',
        marginBottom: 32,
    },
});
