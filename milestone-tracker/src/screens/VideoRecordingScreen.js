import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    Alert,
} from 'react-native';
import { Camera } from 'expo-camera';

export default function VideoRecordingScreen({ route, navigation }) {
    const { milestone } = route.params;
    const [hasPermission, setHasPermission] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const cameraRef = useRef(null);
    const timerRef = useRef(null);

    React.useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);

    const startRecording = async () => {
        if (cameraRef.current) {
            try {
                setIsRecording(true);
                setRecordingTime(0);

                // Start timer
                timerRef.current = setInterval(() => {
                    setRecordingTime(prev => prev + 1);
                }, 1000);

                const video = await cameraRef.current.recordAsync({
                    maxDuration: 30, // 30 seconds max
                    quality: Camera.Constants.VideoQuality['720p'],
                });

                console.log('Video recorded:', video.uri);

                // Stop timer
                if (timerRef.current) {
                    clearInterval(timerRef.current);
                }

                Alert.alert(
                    '✅ सफलता | Success',
                    'वीडियो सहेजा गया। AI विश्लेषण जल्द ही उपलब्ध होगा।\nVideo saved. AI analysis coming soon.',
                    [
                        {
                            text: 'ठीक है | OK',
                            onPress: () => navigation.goBack(),
                        },
                    ]
                );
            } catch (error) {
                console.error('Recording error:', error);
                Alert.alert('Error', 'Failed to record video');
            } finally {
                setIsRecording(false);
            }
        }
    };

    const stopRecording = () => {
        if (cameraRef.current && isRecording) {
            cameraRef.current.stopRecording();
            setIsRecording(false);
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    if (hasPermission === null) {
        return (
            <View style={styles.container}>
                <Text style={styles.messageText}>कैमरा की अनुमति मांगी जा रही है...</Text>
                <Text style={styles.messageText}>Requesting camera permission...</Text>
            </View>
        );
    }

    if (hasPermission === false) {
        return (
            <View style={styles.container}>
                <Text style={styles.messageText}>❌ कैमरा की अनुमति नहीं मिली</Text>
                <Text style={styles.messageText}>No access to camera</Text>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backButtonText}>वापस जाएं | Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Milestone Info Banner */}
            <View style={styles.infoBanner}>
                <Text style={styles.infoTitle}>📹 रिकॉर्ड करें | Record:</Text>
                <Text style={styles.infoDescription}>{milestone.milestone_description}</Text>
                <Text style={styles.infoHint}>
                    💡 सुझाव: बच्चे को गतिविधि करते हुए दिखाएं
                </Text>
                <Text style={styles.infoHint}>
                    Tip: Show child performing the activity
                </Text>
            </View>

            {/* Camera View */}
            <Camera
                style={styles.camera}
                type={Camera.Constants.Type.back}
                ref={cameraRef}
            >
                {/* Recording Indicator */}
                {isRecording && (
                    <View style={styles.recordingIndicator}>
                        <View style={styles.recordingDot} />
                        <Text style={styles.recordingText}>रिकॉर्डिंग | REC</Text>
                        <Text style={styles.timerText}>{formatTime(recordingTime)}</Text>
                    </View>
                )}

                {/* Instructions Overlay */}
                {!isRecording && (
                    <View style={styles.instructionsOverlay}>
                        <Text style={styles.instructionText}>
                            📱 फोन को स्थिर रखें
                        </Text>
                        <Text style={styles.instructionText}>
                            Keep phone steady
                        </Text>
                    </View>
                )}
            </Camera>

            {/* Controls */}
            <View style={styles.controls}>
                {!isRecording ? (
                    <TouchableOpacity
                        style={styles.recordButton}
                        onPress={startRecording}
                    >
                        <View style={styles.recordButtonInner} />
                        <Text style={styles.recordButtonText}>
                            शुरू करें | START
                        </Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={styles.stopButton}
                        onPress={stopRecording}
                    >
                        <View style={styles.stopButtonInner} />
                        <Text style={styles.stopButtonText}>
                            रोकें | STOP
                        </Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => navigation.goBack()}
                    disabled={isRecording}
                >
                    <Text style={[
                        styles.cancelButtonText,
                        isRecording && styles.cancelButtonTextDisabled
                    ]}>
                        रद्द करें | Cancel
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    messageText: {
        fontSize: 16,
        color: '#FFF',
        textAlign: 'center',
        marginVertical: 8,
    },
    infoBanner: {
        backgroundColor: '#2196F3',
        padding: 16,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 8,
    },
    infoDescription: {
        fontSize: 14,
        color: '#FFF',
        marginBottom: 12,
    },
    infoHint: {
        fontSize: 12,
        color: '#E3F2FD',
        marginTop: 4,
    },
    camera: {
        flex: 1,
    },
    recordingIndicator: {
        position: 'absolute',
        top: 20,
        left: 20,
        right: 20,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(244, 67, 54, 0.9)',
        padding: 12,
        borderRadius: 8,
    },
    recordingDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#FFF',
        marginRight: 8,
    },
    recordingText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
        flex: 1,
    },
    timerText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 18,
    },
    instructionsOverlay: {
        position: 'absolute',
        top: 20,
        left: 20,
        right: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: 16,
        borderRadius: 8,
    },
    instructionText: {
        color: '#FFF',
        fontSize: 14,
        textAlign: 'center',
        marginVertical: 4,
    },
    controls: {
        backgroundColor: '#1A1A1A',
        padding: 24,
        alignItems: 'center',
    },
    recordButton: {
        alignItems: 'center',
        marginBottom: 16,
    },
    recordButtonInner: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#F44336',
        borderWidth: 6,
        borderColor: '#FFF',
        marginBottom: 8,
    },
    recordButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    stopButton: {
        alignItems: 'center',
        marginBottom: 16,
    },
    stopButtonInner: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#FFF',
        borderWidth: 6,
        borderColor: '#F44336',
        marginBottom: 8,
    },
    stopButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    cancelButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
    },
    cancelButtonText: {
        color: '#FFF',
        fontSize: 14,
    },
    cancelButtonTextDisabled: {
        color: '#666',
    },
    backButton: {
        backgroundColor: '#4CAF50',
        padding: 16,
        borderRadius: 8,
        margin: 20,
    },
    backButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
