import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function MilestoneItem({ milestone, value, onToggle, onRecordVideo }) {
    const getSubdomainIcon = (subdomain) => {
        const icons = {
            gross_motor: '🏃',
            fine_motor: '✋',
            receptive_language: '👂',
            expressive_language: '🗣️',
            social_emotional: '😊',
        };
        return icons[subdomain] || '📌';
    };

    return (
        <View style={[
            styles.container,
            value === true && styles.containerCompleted,
            value === false && styles.containerIncomplete,
        ]}>
            {/* Milestone Header */}
            <View style={styles.header}>
                <Text style={styles.icon}>{getSubdomainIcon(milestone.subdomain)}</Text>
                <View style={styles.textContainer}>
                    <Text style={styles.description}>{milestone.milestone_description}</Text>
                    {milestone.red_flag && (
                        <View style={styles.redFlagBadge}>
                            <Text style={styles.redFlagText}>⚠️ महत्वपूर्ण | Important</Text>
                        </View>
                    )}
                </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actions}>
                {/* Yes/No Toggle Buttons */}
                <View style={styles.toggleContainer}>
                    <TouchableOpacity
                        style={[
                            styles.toggleButton,
                            styles.yesButton,
                            value === true && styles.yesButtonActive,
                        ]}
                        onPress={() => onToggle(milestone.milestone_id, true)}
                    >
                        <Text style={[
                            styles.toggleText,
                            value === true && styles.toggleTextActive,
                        ]}>
                            ✓ हाँ | Yes
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.toggleButton,
                            styles.noButton,
                            value === false && styles.noButtonActive,
                        ]}
                        onPress={() => onToggle(milestone.milestone_id, false)}
                    >
                        <Text style={[
                            styles.toggleText,
                            value === false && styles.toggleTextActive,
                        ]}>
                            ✗ नहीं | No
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Record Video Button */}
                <TouchableOpacity
                    style={styles.videoButton}
                    onPress={() => onRecordVideo(milestone)}
                >
                    <Text style={styles.videoButtonText}>📹</Text>
                    <Text style={styles.videoButtonLabel}>वीडियो{'\n'}Video</Text>
                </TouchableOpacity>
            </View>

            {/* Age Range Info */}
            <View style={styles.ageInfo}>
                <Text style={styles.ageText}>
                    ⏱️ सामान्य उम्र | Typical: {milestone.age_range_months.typical} महीने | months
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        borderLeftWidth: 4,
        borderLeftColor: '#E0E0E0',
    },
    containerCompleted: {
        borderLeftColor: '#4CAF50',
        backgroundColor: '#F1F8F4',
    },
    containerIncomplete: {
        borderLeftColor: '#FF9800',
        backgroundColor: '#FFF8F0',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    icon: {
        fontSize: 28,
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
    },
    description: {
        fontSize: 16,
        color: '#333',
        lineHeight: 22,
        fontWeight: '500',
    },
    redFlagBadge: {
        backgroundColor: '#FFF3E0',
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginTop: 6,
        alignSelf: 'flex-start',
        borderWidth: 1,
        borderColor: '#FF9800',
    },
    redFlagText: {
        fontSize: 12,
        color: '#F57C00',
        fontWeight: 'bold',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    toggleContainer: {
        flexDirection: 'row',
        flex: 1,
        marginRight: 12,
    },
    toggleButton: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 2,
        marginHorizontal: 4,
        alignItems: 'center',
    },
    yesButton: {
        borderColor: '#4CAF50',
        backgroundColor: '#FFFFFF',
    },
    yesButtonActive: {
        backgroundColor: '#4CAF50',
    },
    noButton: {
        borderColor: '#FF9800',
        backgroundColor: '#FFFFFF',
    },
    noButtonActive: {
        backgroundColor: '#FF9800',
    },
    toggleText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#666',
    },
    toggleTextActive: {
        color: '#FFFFFF',
    },
    videoButton: {
        backgroundColor: '#2196F3',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 12,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 70,
    },
    videoButtonText: {
        fontSize: 24,
        marginBottom: 2,
    },
    videoButtonLabel: {
        fontSize: 10,
        color: '#FFFFFF',
        fontWeight: 'bold',
        textAlign: 'center',
        lineHeight: 12,
    },
    ageInfo: {
        backgroundColor: '#F5F5F5',
        borderRadius: 6,
        padding: 8,
    },
    ageText: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
    },
});
