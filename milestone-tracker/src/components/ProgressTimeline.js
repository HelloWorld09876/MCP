import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function ProgressTimeline({ currentAge }) {
    const milestones = [
        { age: 0, label: 'जन्म\nBirth', icon: '🍼' },
        { age: 3, label: '3 महीने\n3 Mo', icon: '👶' },
        { age: 6, label: '6 महीने\n6 Mo', icon: '🧸' },
        { age: 9, label: '9 महीने\n9 Mo', icon: '🎯' },
        { age: 12, label: '12 महीने\n12 Mo', icon: '🎂' },
        { age: 18, label: '18 महीने\n18 Mo', icon: '🚶' },
        { age: 24, label: '24 महीने\n24 Mo', icon: '🏃' },
        { age: 36, label: '36 महीने\n36 Mo', icon: '🎓' },
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.title}>🕐 उम्र की रेखा | Age Timeline</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {milestones.map((milestone, index) => {
                    const isPast = currentAge > milestone.age;
                    const isCurrent = currentAge >= milestone.age &&
                        (index === milestones.length - 1 || currentAge < milestones[index + 1].age);
                    const isFuture = currentAge < milestone.age;

                    return (
                        <View key={milestone.age} style={styles.milestoneContainer}>
                            {/* Connecting Line */}
                            {index > 0 && (
                                <View style={[
                                    styles.line,
                                    isPast && styles.linePast,
                                    isCurrent && styles.lineCurrent,
                                ]} />
                            )}

                            {/* Milestone Node */}
                            <View style={styles.nodeContainer}>
                                <View style={[
                                    styles.node,
                                    isPast && styles.nodePast,
                                    isCurrent && styles.nodeCurrent,
                                    isFuture && styles.nodeFuture,
                                ]}>
                                    <Text style={styles.nodeIcon}>{milestone.icon}</Text>
                                </View>
                                <Text style={[
                                    styles.label,
                                    isCurrent && styles.labelCurrent,
                                ]}>
                                    {milestone.label}
                                </Text>
                                {isCurrent && (
                                    <View style={styles.currentBadge}>
                                        <Text style={styles.currentBadgeText}>अभी | Now</Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    );
                })}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 16,
        marginBottom: 16,
        padding: 16,
        borderRadius: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
    },
    scrollContent: {
        paddingHorizontal: 8,
        alignItems: 'center',
    },
    milestoneContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    line: {
        width: 40,
        height: 4,
        backgroundColor: '#E0E0E0',
        marginHorizontal: 4,
    },
    linePast: {
        backgroundColor: '#4CAF50',
    },
    lineCurrent: {
        backgroundColor: '#4CAF50',
    },
    nodeContainer: {
        alignItems: 'center',
        width: 80,
    },
    node: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#F5F5F5',
        borderWidth: 3,
        borderColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    nodePast: {
        backgroundColor: '#E8F5E9',
        borderColor: '#4CAF50',
    },
    nodeCurrent: {
        backgroundColor: '#4CAF50',
        borderColor: '#2E7D32',
        transform: [{ scale: 1.1 }],
        elevation: 4,
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    nodeFuture: {
        backgroundColor: '#FAFAFA',
        borderColor: '#E0E0E0',
    },
    nodeIcon: {
        fontSize: 28,
    },
    label: {
        fontSize: 11,
        color: '#666',
        textAlign: 'center',
        lineHeight: 14,
    },
    labelCurrent: {
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    currentBadge: {
        backgroundColor: '#4CAF50',
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 2,
        marginTop: 4,
    },
    currentBadgeText: {
        fontSize: 10,
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
});
