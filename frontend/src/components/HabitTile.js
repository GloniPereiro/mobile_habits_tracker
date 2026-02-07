import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SPACING } from '../theme';
import { Trash2, CheckCircle2, Circle } from 'lucide-react-native';

const HabitTile = ({ habit, onToggle, onDelete }) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.habitInfo}
                onPress={() => onToggle(habit._id)}
                activeOpacity={0.7}
            >
                {habit.isDone ? (
                    <CheckCircle2 size={24} color={COLORS.primary} strokeWidth={3} />
                ) : (
                    <Circle size={24} color={COLORS.inactive} />
                )}
                <Text style={[
                    styles.name,
                    habit.isDone && styles.nameDone
                ]}>{habit.name}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => onDelete(habit._id)} style={styles.deleteButton}>
                <Trash2 size={20} color={COLORS.danger} opacity={0.6} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.surface,
        paddingHorizontal: SPACING.medium,
        paddingVertical: SPACING.medium,
        borderRadius: 16,
        marginBottom: SPACING.small,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    habitInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    name: {
        color: COLORS.text,
        fontSize: 16,
        fontWeight: '500',
        marginLeft: SPACING.medium,
    },
    nameDone: {
        color: COLORS.textSecondary,
        textDecorationLine: 'line-through',
    },
    deleteButton: {
        padding: 8,
    }
});

export default HabitTile;
