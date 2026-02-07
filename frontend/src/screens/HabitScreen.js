import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Modal,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING } from '../theme';
import { getHabits, addHabit, toggleStatus, deleteHabit } from '../services/api';
import HabitTile from '../components/HabitTile';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Plus, X, Calendar as CalendarIcon, List } from 'lucide-react-native';

const CATEGORIES = [
    { id: 'poranne', label: 'Poranne' },
    { id: 'dzienne', label: 'Dzienne' },
    { id: 'wieczorne', label: 'Wieczorne' }
];

const HabitScreen = () => {
    const [habits, setHabits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setModalVisible] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [newHabit, setNewHabit] = useState({ name: '', category: 'poranne' });
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'history'

    const dateString = selectedDate.toISOString().split('T')[0];

    useEffect(() => {
        fetchHabits();
    }, [dateString]);

    const fetchHabits = async () => {
        try {
            setLoading(true);
            const response = await getHabits(dateString);
            setHabits(response.data);
        } catch (err) {
            console.error('Error fetching habits:', err);
        } finally {
            setLoading(false);
        }
    };

    const onDateChange = (event, date) => {
        setShowDatePicker(false);
        if (date) {
            setSelectedDate(date);
            setViewMode('list'); // Switch back to list view when date is selected
        }
    };

    const handleAddHabit = async () => {
        if (!newHabit.name) return;

        try {
            await addHabit(newHabit);
            setModalVisible(false);
            setNewHabit({ name: '', category: 'poranne' });
            fetchHabits();
        } catch (err) {
            console.error('Error adding habit:', err);
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            // Optimistic update
            setHabits(prev => prev.map(h =>
                h._id === id ? { ...h, isDone: !h.isDone } : h
            ));
            await toggleStatus(id, dateString);
        } catch (err) {
            console.error('Error toggling status:', err);
            fetchHabits(); // Rollback on error
        }
    };

    const handleDeleteHabit = async (id) => {
        try {
            await deleteHabit(id);
            setHabits(prev => prev.filter(h => h._id !== id));
        } catch (err) {
            console.error('Error deleting habit:', err);
        }
    };

    const renderCategory = (category) => {
        const categoryHabits = habits.filter(h => h.category === category.id);
        if (categoryHabits.length === 0) return null;

        return (
            <View key={category.id} style={styles.categorySection}>
                <Text style={styles.categoryTitle}>{category.label}</Text>
                {categoryHabits.map(habit => (
                    <HabitTile
                        key={habit._id}
                        habit={habit}
                        onToggle={handleToggleStatus}
                        onDelete={handleDeleteHabit}
                    />
                ))}
            </View>
        );
    };

    const renderProgressBar = () => {
        if (habits.length === 0) return null;
        return (
            <View style={styles.statusBar}>
                <View style={styles.progressContainer}>
                    {habits.map((h, i) => (
                        <View
                            key={h._id || i}
                            style={[
                                styles.progressSquare,
                                { backgroundColor: h.isDone ? COLORS.primary : COLORS.inactive }
                            ]}
                        />
                    ))}
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.title}>Nawyki</Text>
                        <Text style={styles.dateText}>{dateString}</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.modeButton}
                        onPress={() => setViewMode(viewMode === 'list' ? 'history' : 'list')}
                    >
                        {viewMode === 'list' ? (
                            <CalendarIcon color={COLORS.primary} size={24} />
                        ) : (
                            <List color={COLORS.primary} size={24} />
                        )}
                    </TouchableOpacity>
                </View>

                {/* Progress Bar (Visible even in history if habits exist) */}
                {viewMode === 'list' && renderProgressBar()}

                {loading ? (
                    <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} />
                ) : (
                    <View style={{ flex: 1 }}>
                        {viewMode === 'list' ? (
                            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                                {habits.length === 0 ? (
                                    <Text style={styles.emptyState}>Brak nawyków. Dodaj nowy!</Text>
                                ) : (
                                    CATEGORIES.map(renderCategory)
                                )}
                            </ScrollView>
                        ) : (
                            <View style={styles.historyView}>
                                <Text style={styles.historyTitle}>Wybierz datę</Text>
                                <DateTimePicker
                                    value={selectedDate}
                                    mode="date"
                                    display="inline"
                                    onChange={onDateChange}
                                    maximumDate={new Date()}
                                    themeVariant="dark"
                                />
                                <TouchableOpacity
                                    style={styles.backButton}
                                    onPress={() => setViewMode('list')}
                                >
                                    <Text style={styles.backButtonText}>Powrót do dzisiaj</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                )}

                {viewMode === 'list' && (
                    <TouchableOpacity
                        style={styles.fab}
                        onPress={() => setModalVisible(true)}
                    >
                        <Plus color="#fff" size={30} />
                    </TouchableOpacity>
                )}

                {/* Add Habit Modal */}
                <Modal
                    visible={isModalVisible}
                    animationType="slide"
                    transparent={true}
                >
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.modalOverlay}>
                            <KeyboardAvoidingView
                                behavior={Platform.OS === "ios" ? "padding" : "height"}
                                style={styles.modalContent}
                            >
                                <View style={styles.modalHeader}>
                                    <Text style={styles.modalTitle}>Nowy Nawyk</Text>
                                    <TouchableOpacity onPress={() => setModalVisible(false)}>
                                        <X color={COLORS.text} size={24} />
                                    </TouchableOpacity>
                                </View>

                                <TextInput
                                    style={styles.input}
                                    placeholder="Nazwa nawyku"
                                    placeholderTextColor={COLORS.textSecondary}
                                    value={newHabit.name}
                                    onChangeText={(text) => setNewHabit({ ...newHabit, name: text })}
                                    autoFocus
                                />

                                <Text style={styles.label}>Pora dnia</Text>
                                <View style={styles.categoryToggle}>
                                    {CATEGORIES.map(cat => (
                                        <TouchableOpacity
                                            key={cat.id}
                                            style={[
                                                styles.toggleButton,
                                                newHabit.category === cat.id && styles.toggleButtonActive
                                            ]}
                                            onPress={() => setNewHabit({ ...newHabit, category: cat.id })}
                                        >
                                            <Text style={[
                                                styles.toggleText,
                                                newHabit.category === cat.id && styles.toggleTextActive
                                            ]}>{cat.label}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>

                                <TouchableOpacity style={styles.addButton} onPress={handleAddHabit}>
                                    <Text style={styles.addButtonText}>Dodaj Nawyk</Text>
                                </TouchableOpacity>
                            </KeyboardAvoidingView>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    container: {
        flex: 1,
        paddingHorizontal: SPACING.medium,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: SPACING.large,
    },
    title: {
        color: COLORS.text,
        fontSize: 28,
        fontWeight: 'bold',
    },
    dateText: {
        color: COLORS.primary,
        fontSize: 14,
        marginTop: 4,
    },
    modeButton: {
        padding: 10,
        backgroundColor: COLORS.surface,
        borderRadius: 12,
    },
    statusBar: {
        marginBottom: SPACING.large,
    },
    progressContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
        backgroundColor: COLORS.surface,
        padding: 12,
        borderRadius: 12,
    },
    progressSquare: {
        width: 20,
        height: 20,
        borderRadius: 4,
    },
    categorySection: {
        marginBottom: SPACING.large,
    },
    categoryTitle: {
        color: COLORS.textSecondary,
        fontSize: 13,
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginBottom: SPACING.medium,
        fontWeight: '600',
    },
    emptyState: {
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginTop: 100,
        fontSize: 16,
    },
    historyView: {
        flex: 1,
        alignItems: 'center',
        paddingTop: SPACING.large,
    },
    historyTitle: {
        color: COLORS.text,
        fontSize: 18,
        fontWeight: '600',
        marginBottom: SPACING.large,
    },
    backButton: {
        marginTop: SPACING.large,
        padding: SPACING.medium,
    },
    backButtonText: {
        color: COLORS.primary,
        fontSize: 16,
        fontWeight: '600',
    },
    fab: {
        position: 'absolute',
        bottom: 40,
        right: 20,
        backgroundColor: COLORS.primary,
        width: 65,
        height: 65,
        borderRadius: 33,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: COLORS.surface,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: SPACING.large,
        paddingBottom: Platform.OS === 'ios' ? 60 : 40,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.large,
    },
    modalTitle: {
        color: COLORS.text,
        fontSize: 22,
        fontWeight: 'bold',
    },
    label: {
        color: COLORS.textSecondary,
        marginBottom: SPACING.small,
        fontSize: 14,
    },
    input: {
        backgroundColor: COLORS.background,
        color: COLORS.text,
        padding: SPACING.medium,
        borderRadius: 12,
        marginBottom: SPACING.medium,
        fontSize: 16,
    },
    categoryToggle: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: SPACING.large,
    },
    toggleButton: {
        flex: 1,
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.inactive,
        alignItems: 'center',
    },
    toggleButtonActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    toggleText: {
        color: COLORS.textSecondary,
        fontSize: 14,
    },
    toggleTextActive: {
        color: '#fff',
        fontWeight: 'bold',
    },
    addButton: {
        backgroundColor: COLORS.primary,
        padding: SPACING.medium,
        borderRadius: 12,
        alignItems: 'center',
    },
    addButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default HabitScreen;
