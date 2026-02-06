import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProgressTimeline from '../components/ProgressTimeline';
import MilestoneItem from '../components/MilestoneItem';
import { sampleMilestones } from '../data/milestones';

const STORAGE_KEY = '@milestone_responses';
const CHILD_AGE_KEY = '@child_age';

export default function DashboardScreen({ navigation }) {
    const [childAge, setChildAge] = useState(12); // months
    const [milestoneResponses, setMilestoneResponses] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Load data from AsyncStorage on mount
    useEffect(() => {
        loadData();
    }, []);

    // Auto-save when milestoneResponses changes
    useEffect(() => {
        if (!isLoading) {
            saveData();
        }
    }, [milestoneResponses]);

    const loadData = async () => {
        try {
            setIsLoading(true);

            // Load milestone responses
            const responsesJson = await AsyncStorage.getItem(STORAGE_KEY);
            if (responsesJson !== null) {
                const responses = JSON.parse(responsesJson);
                setMilestoneResponses(responses);
            }

            // Load child age
            const ageString = await AsyncStorage.getItem(CHILD_AGE_KEY);
            if (ageString !== null) {
                setChildAge(parseInt(ageString, 10));
            }

            console.log('✅ Data loaded from AsyncStorage');
        } catch (error) {
            console.error('Error loading data:', error);
            Alert.alert(
                'Load Error',
                'Could not load saved data. Starting fresh.',
                [{ text: 'OK' }]
            );
        } finally {
            setIsLoading(false);
        }
    };

    const saveData = async () => {
        try {
            setIsSaving(true);

            // Save milestone responses
            const responsesJson = JSON.stringify(milestoneResponses);
            await AsyncStorage.setItem(STORAGE_KEY, responsesJson);

            // Save child age
            await AsyncStorage.setItem(CHILD_AGE_KEY, childAge.toString());

            console.log('✅ Data saved to AsyncStorage');
        } catch (error) {
            console.error('Error saving data:', error);
            Alert.alert(
                'Save Error',
                'Could not save your progress. Please try again.',
                [{ text: 'OK' }]
            );
        } finally {
            setIsSaving(false);
        }
    };

    const handleToggle = (milestoneId, value) => {
        setMilestoneResponses(prev => ({
            ...prev,
            [milestoneId]: value
        }));
    };

    const handleRecordVideo = (milestone) => {
        navigation.navigate('VideoRecording', { milestone });
    };

    const handleSaveManually = async () => {
        await saveData();
        Alert.alert(
            'Success',
            'Progress saved successfully!',
            [{ text: 'OK' }]
        );
    };

    const handleClearData = () => {
        Alert.alert(
            'Clear All Data',
            'Are you sure you want to clear all milestone data? This cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Clear',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await AsyncStorage.multiRemove([STORAGE_KEY, CHILD_AGE_KEY]);
                            setMilestoneResponses({});
                            Alert.alert('Success', 'All data cleared');
                        } catch (error) {
                            Alert.alert('Error', 'Could not clear data');
                        }
                    }
                }
            ]
        );
    };

    const currentMilestones = sampleMilestones.filter(
        m => m.age_range_months.min <= childAge && m.age_range_months.max >= childAge
    );

    const completedCount = Object.values(milestoneResponses).filter(v => v === true).length;
    const totalCount = currentMilestones.length;

    if (isLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Loading...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#4CAF50" />
            <ScrollView style={styles.scrollView}>
                {/* Child Info Card */}
                <View style={styles.childCard}>
                    <View style={styles.childHeader}>
                        <Text style={styles.childIcon}>👶</Text>
                        <View style={styles.childInfo}>
                            <Text style={styles.childName}>बच्चे का नाम | Child Name</Text>
                            <Text style={styles.childAge}>{childAge} महीने | {childAge} Months</Text>
                        </View>
                        {isSaving && (
                            <Text style={styles.savingIndicator}>💾 Saving...</Text>
                        )}
                    </View>
                </View>

                {/* Progress Timeline */}
                <ProgressTimeline currentAge={childAge} />

                {/* Progress Summary */}
                <View style={styles.progressCard}>
                    <View style={styles.progressHeader}>
                        <Text style={styles.progressTitle}>📊 प्रगति | Progress</Text>
                        <Text style={styles.progressCount}>
                            {completedCount}/{totalCount}
                        </Text>
                    </View>
                    <View style={styles.progressBar}>
                        <View
                            style={[
                                styles.progressFill,
                                { width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }
                            ]}
                        />
                    </View>
                    <Text style={styles.progressText}>
                        {completedCount === totalCount
                            ? '🎉 बहुत बढ़िया! | Excellent Progress!'
                            : `${totalCount - completedCount} और बचे हैं | ${totalCount - completedCount} more to go`}
                    </Text>
                </View>

                {/* Milestones Section */}
                <View style={styles.milestonesSection}>
                    <Text style={styles.sectionTitle}>
                        ✅ विकास के चरण | Developmental Milestones
                    </Text>
                    <Text style={styles.sectionSubtitle}>
                        {childAge} महीने के लिए | For {childAge} months
                    </Text>

                    {/* Motor Milestones */}
                    <View style={styles.domainSection}>
                        <View style={styles.domainHeader}>
                            <Text style={styles.domainIcon}>🏃</Text>
                            <Text style={styles.domainTitle}>शारीरिक गतिविधि | Motor Skills</Text>
                        </View>
                        {currentMilestones
                            .filter(m => m.domain === 'motor')
                            .map(milestone => (
                                <MilestoneItem
                                    key={milestone.milestone_id}
                                    milestone={milestone}
                                    value={milestoneResponses[milestone.milestone_id]}
                                    onToggle={handleToggle}
                                    onRecordVideo={handleRecordVideo}
                                />
                            ))}
                    </View>

                    {/* Language Milestones */}
                    <View style={styles.domainSection}>
                        <View style={styles.domainHeader}>
                            <Text style={styles.domainIcon}>💬</Text>
                            <Text style={styles.domainTitle}>भाषा | Language Skills</Text>
                        </View>
                        {currentMilestones
                            .filter(m => m.domain === 'language')
                            .map(milestone => (
                                <MilestoneItem
                                    key={milestone.milestone_id}
                                    milestone={milestone}
                                    value={milestoneResponses[milestone.milestone_id]}
                                    onToggle={handleToggle}
                                    onRecordVideo={handleRecordVideo}
                                />
                            ))}
                    </View>

                    {/* Social Milestones */}
                    <View style={styles.domainSection}>
                        <View style={styles.domainHeader}>
                            <Text style={styles.domainIcon}>🤝</Text>
                            <Text style={styles.domainTitle}>सामाजिक | Social Skills</Text>
                        </View>
                        {currentMilestones
                            .filter(m => m.domain === 'social')
                            .map(milestone => (
                                <MilestoneItem
                                    key={milestone.milestone_id}
                                    milestone={milestone}
                                    value={milestoneResponses[milestone.milestone_id]}
                                    onToggle={handleToggle}
                                    onRecordVideo={handleRecordVideo}
                                />
                            ))}
                    </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={handleSaveManually}
                        disabled={isSaving}
                    >
                        <Text style={styles.saveButtonText}>
                            💾 सहेजें | Save Progress
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.clearButton}
                        onPress={handleClearData}
                    >
                        <Text style={styles.clearButtonText}>
                            🗑️ Clear Data
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.bottomPadding} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 18,
        color: '#666',
    },
    scrollView: {
        flex: 1,
    },
    childCard: {
        backgroundColor: '#FFFFFF',
        margin: 16,
        padding: 20,
        borderRadius: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    childHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    childIcon: {
        fontSize: 48,
        marginRight: 16,
    },
    childInfo: {
        flex: 1,
    },
    childName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    childAge: {
        fontSize: 16,
        color: '#666',
    },
    savingIndicator: {
        fontSize: 12,
        color: '#4CAF50',
        fontWeight: 'bold',
    },
    progressCard: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 16,
        marginBottom: 16,
        padding: 20,
        borderRadius: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    progressTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    progressCount: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    progressBar: {
        height: 12,
        backgroundColor: '#E0E0E0',
        borderRadius: 6,
        overflow: 'hidden',
        marginBottom: 8,
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#4CAF50',
        borderRadius: 6,
    },
    progressText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
    milestonesSection: {
        paddingHorizontal: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    sectionSubtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 16,
    },
    domainSection: {
        marginBottom: 24,
    },
    domainHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        paddingBottom: 8,
        borderBottomWidth: 2,
        borderBottomColor: '#E0E0E0',
    },
    domainIcon: {
        fontSize: 24,
        marginRight: 8,
    },
    domainTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#555',
    },
    buttonContainer: {
        paddingHorizontal: 16,
        marginTop: 8,
    },
    saveButton: {
        backgroundColor: '#4CAF50',
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        marginBottom: 12,
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    clearButton: {
        backgroundColor: '#FF5722',
        padding: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    clearButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
    bottomPadding: {
        height: 24,
    },
});
