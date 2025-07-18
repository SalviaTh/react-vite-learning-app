// import React, { useState } from 'react';
// import { View, Text, StyleSheet, Pressable, TextInput, Dimensions } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { router } from 'expo-router';
// import { useUser } from '@/contexts/UserContext';
// import Animated, { 
//   useAnimatedStyle, 
//   useSharedValue, 
//   withSpring,
//   withSequence,
//   withTiming
// } from 'react-native-reanimated';

// const { width } = Dimensions.get('window');

// const avatars = [
//   '🧙‍♂️', '🧙‍♀️', '🦸‍♂️', '🦸‍♀️', '🧚‍♂️', '🧚‍♀️',
//   '🐱', '🐶', '🦊', '🐼', '🐨', '🦁',
//   '🌟', '🎯', '🚀', '⭐', '🎨', '🎪'
// ];

// export default function OnboardingScreen() {
//   const [name, setName] = useState('');
//   const [selectedAvatar, setSelectedAvatar] = useState(avatars[0]);
//   const [currentStep, setCurrentStep] = useState(0);
//   const [isCreating, setIsCreating] = useState(false);
//   const { createUser } = useUser();

//   const stepScale = useSharedValue(1);
//   const avatarScales = avatars.map(() => useSharedValue(1));

//   const stepAnimatedStyle = useAnimatedStyle(() => ({
//     transform: [{ scale: stepScale.value }],
//   }));

//   const handleNext = () => {
//     if (currentStep === 0 && name.trim().length < 2) {
//       // Shake animation for invalid input
//       stepScale.value = withSequence(
//         withTiming(1.05, { duration: 100 }),
//         withTiming(0.95, { duration: 100 }),
//         withTiming(1, { duration: 100 })
//       );
//       return;
//     }

//     if (currentStep < 2) {
//       setCurrentStep(currentStep + 1);
//       stepScale.value = withSequence(
//         withTiming(0, { duration: 200 }),
//         withSpring(1, { damping: 15, stiffness: 100 })
//       );
//     }
//   };

//   const handleBack = () => {
//     if (currentStep > 0) {
//       setCurrentStep(currentStep - 1);
//       stepScale.value = withSequence(
//         withTiming(0, { duration: 200 }),
//         withSpring(1, { damping: 15, stiffness: 100 })
//       );
//     }
//   };

//   const handleAvatarSelect = (avatar: string, index: number) => {
//     setSelectedAvatar(avatar);
//     avatarScales[index].value = withSequence(
//       withSpring(1.3, { damping: 15, stiffness: 100 }),
//       withSpring(1, { damping: 15, stiffness: 100 })
//     );
//   };

//   const handleCreateAccount = async () => {
//     if (name.trim().length < 2) return;
    
//     setIsCreating(true);
//     try {
//       await createUser(name.trim(), selectedAvatar);
//       router.replace('/(tabs)');
//     } catch (error) {
//       console.error('Error creating user:', error);
//       setIsCreating(false);
//     }
//   };

//   const renderStep = () => {
//     switch (currentStep) {
//       case 0:
//         return (
//           <Animated.View style={[styles.stepContainer, stepAnimatedStyle]}>
//             <Text style={styles.stepTitle}>Welcome to E-Buddy! 🎉</Text>
//             <Text style={styles.stepSubtitle}>Let's start your math adventure</Text>
            
//             <View style={styles.inputContainer}>
//               <Text style={styles.inputLabel}>What's your name?</Text>
//               <TextInput
//                 style={styles.textInput}
//                 placeholder="Enter your name"
//                 placeholderTextColor="#5D6D7E"
//                 value={name}
//                 onChangeText={setName}
//                 maxLength={20}
//                 autoCapitalize="words"
//                 autoCorrect={false}
//               />
//               {name.trim().length > 0 && name.trim().length < 2 && (
//                 <Text style={styles.errorText}>Name must be at least 2 characters</Text>
//               )}
//             </View>

//             <View style={styles.welcomeIcons}>
//               <Text style={styles.welcomeIcon}>🔢</Text>
//               <Text style={styles.welcomeIcon}>🎮</Text>
//               <Text style={styles.welcomeIcon}>⭐</Text>
//             </View>
//           </Animated.View>
//         );

//       case 1:
//         return (
//           <Animated.View style={[styles.stepContainer, stepAnimatedStyle]}>
//             <Text style={styles.stepTitle}>Choose Your Avatar 🎭</Text>
//             <Text style={styles.stepSubtitle}>Pick one that represents you!</Text>
            
//             <View style={styles.avatarGrid}>
//               {avatars.map((avatar, index) => {
//                 const avatarAnimatedStyle = useAnimatedStyle(() => ({
//                   transform: [{ scale: avatarScales[index].value }],
//                 }));

//                 return (
//                   <Animated.View key={avatar} style={avatarAnimatedStyle}>
//                     <Pressable
//                       style={[
//                         styles.avatarOption,
//                         selectedAvatar === avatar && styles.selectedAvatar
//                       ]}
//                       onPress={() => handleAvatarSelect(avatar, index)}
//                     >
//                       <Text style={styles.avatarEmoji}>{avatar}</Text>
//                     </Pressable>
//                   </Animated.View>
//                 );
//               })}
//             </View>
//           </Animated.View>
//         );

//       case 2:
//         return (
//           <Animated.View style={[styles.stepContainer, stepAnimatedStyle]}>
//             <Text style={styles.stepTitle}>You're All Set! 🚀</Text>
//             <Text style={styles.stepSubtitle}>Ready to start learning?</Text>
            
//             <View style={styles.summaryContainer}>
//               <LinearGradient
//                 colors={['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.7)']}
//                 style={styles.summaryCard}
//               >
//                 <Text style={styles.summaryAvatar}>{selectedAvatar}</Text>
//                 <Text style={styles.summaryName}>{name}</Text>
//                 <Text style={styles.summaryText}>Math Explorer Level 1</Text>
//               </LinearGradient>
//             </View>

//             <View style={styles.featuresContainer}>
//               <View style={styles.feature}>
//                 <Text style={styles.featureIcon}>📊</Text>
//                 <Text style={styles.featureText}>Track your progress</Text>
//               </View>
//               <View style={styles.feature}>
//                 <Text style={styles.featureIcon}>🏆</Text>
//                 <Text style={styles.featureText}>Earn achievements</Text>
//               </View>
//               <View style={styles.feature}>
//                 <Text style={styles.featureIcon}>⭐</Text>
//                 <Text style={styles.featureText}>Collect stars</Text>
//               </View>
//             </View>
//           </Animated.View>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <LinearGradient colors={['#FFF8DC', '#FFE4E1', '#E6E6FA']} style={styles.container}>
//       <SafeAreaView style={styles.safeArea}>
//         {/* Progress Indicator */}
//         <View style={styles.progressContainer}>
//           {[0, 1, 2].map((step) => (
//             <View
//               key={step}
//               style={[
//                 styles.progressDot,
//                 step <= currentStep && styles.progressDotActive
//               ]}
//             />
//           ))}
//         </View>

//         {/* Step Content */}
//         <View style={styles.content}>
//           {renderStep()}
//         </View>

//         {/* Navigation Buttons */}
//         <View style={styles.navigationContainer}>
//           {currentStep > 0 && (
//             <Pressable style={styles.backButton} onPress={handleBack}>
//               <LinearGradient colors={['#95A5A6', '#7F8C8D']} style={styles.buttonGradient}>
//                 <Text style={styles.buttonText}>Back</Text>
//               </LinearGradient>
//             </Pressable>
//           )}

//           <Pressable
//             style={[styles.nextButton, currentStep === 0 && styles.fullWidthButton]}
//             onPress={currentStep === 2 ? handleCreateAccount : handleNext}
//             disabled={isCreating || (currentStep === 0 && name.trim().length < 2)}
//           >
//             <LinearGradient
//               colors={
//                 isCreating || (currentStep === 0 && name.trim().length < 2)
//                   ? ['#BDC3C7', '#95A5A6']
//                   : ['#FF9A9E', '#FECFEF']
//               }
//               style={styles.buttonGradient}
//             >
//               <Text style={styles.buttonText}>
//                 {isCreating 
//                   ? 'Creating...' 
//                   : currentStep === 2 
//                     ? 'Start Adventure!' 
//                     : 'Next'
//                 }
//               </Text>
//             </LinearGradient>
//           </Pressable>
//         </View>
//       </SafeAreaView>
//     </LinearGradient>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   safeArea: {
//     flex: 1,
//   },
//   progressContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: 20,
//     gap: 12,
//   },
//   progressDot: {
//     width: 12,
//     height: 12,
//     borderRadius: 6,
//     backgroundColor: 'rgba(255, 255, 255, 0.5)',
//   },
//   progressDotActive: {
//     backgroundColor: '#FF6B6B',
//   },
//   content: {
//     flex: 1,
//     paddingHorizontal: 20,
//     justifyContent: 'center',
//   },
//   stepContainer: {
//     alignItems: 'center',
//   },
//   stepTitle: {
//     fontSize: 32,
//     fontFamily: 'Fredoka-Bold',
//     color: '#2C3E50',
//     textAlign: 'center',
//     marginBottom: 12,
//   },
//   stepSubtitle: {
//     fontSize: 18,
//     fontFamily: 'Nunito-Regular',
//     color: '#5D6D7E',
//     textAlign: 'center',
//     marginBottom: 40,
//   },
//   inputContainer: {
//     width: '100%',
//     marginBottom: 40,
//   },
//   inputLabel: {
//     fontSize: 18,
//     fontFamily: 'Nunito-SemiBold',
//     color: '#2C3E50',
//     marginBottom: 12,
//     textAlign: 'center',
//   },
//   textInput: {
//     backgroundColor: 'rgba(255, 255, 255, 0.9)',
//     borderRadius: 15,
//     borderWidth: 2,
//     borderColor: 'rgba(255, 107, 107, 0.3)',
//     paddingHorizontal: 20,
//     paddingVertical: 15,
//     fontSize: 18,
//     fontFamily: 'Nunito-Regular',
//     color: '#2C3E50',
//     textAlign: 'center',
//   },
//   errorText: {
//     fontSize: 14,
//     fontFamily: 'Nunito-Regular',
//     color: '#E74C3C',
//     textAlign: 'center',
//     marginTop: 8,
//   },
//   welcomeIcons: {
//     flexDirection: 'row',
//     gap: 20,
//   },
//   welcomeIcon: {
//     fontSize: 40,
//   },
//   avatarGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'center',
//     gap: 15,
//     maxWidth: width - 40,
//   },
//   avatarOption: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: 'rgba(255, 255, 255, 0.8)',
//     borderWidth: 2,
//     borderColor: 'rgba(255, 107, 107, 0.3)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     elevation: 4,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   selectedAvatar: {
//     borderColor: '#FF6B6B',
//     borderWidth: 3,
//     backgroundColor: 'rgba(255, 107, 107, 0.1)',
//   },
//   avatarEmoji: {
//     fontSize: 28,
//   },
//   summaryContainer: {
//     marginBottom: 40,
//   },
//   summaryCard: {
//     borderRadius: 20,
//     padding: 30,
//     alignItems: 'center',
//     borderWidth: 2,
//     borderColor: 'rgba(255, 107, 107, 0.3)',
//     elevation: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 8,
//   },
//   summaryAvatar: {
//     fontSize: 60,
//     marginBottom: 15,
//   },
//   summaryName: {
//     fontSize: 24,
//     fontFamily: 'Fredoka-Bold',
//     color: '#2C3E50',
//     marginBottom: 8,
//   },
//   summaryText: {
//     fontSize: 16,
//     fontFamily: 'Nunito-SemiBold',
//     color: '#5D6D7E',
//   },
//   featuresContainer: {
//     gap: 15,
//   },
//   feature: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(255, 255, 255, 0.8)',
//     paddingHorizontal: 20,
//     paddingVertical: 15,
//     borderRadius: 15,
//     borderWidth: 1,
//     borderColor: 'rgba(255, 107, 107, 0.2)',
//   },
//   featureIcon: {
//     fontSize: 24,
//     marginRight: 15,
//   },
//   featureText: {
//     fontSize: 16,
//     fontFamily: 'Nunito-SemiBold',
//     color: '#2C3E50',
//   },
//   navigationContainer: {
//     flexDirection: 'row',
//     paddingHorizontal: 20,
//     paddingBottom: 20,
//     gap: 15,
//   },
//   backButton: {
//     flex: 1,
//     borderRadius: 15,
//     elevation: 6,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.2,
//     shadowRadius: 6,
//   },
//   nextButton: {
//     flex: 2,
//     borderRadius: 15,
//     elevation: 6,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.2,
//     shadowRadius: 6,
//   },
//   fullWidthButton: {
//     flex: 1,
//   },
//   buttonGradient: {
//     paddingVertical: 15,
//     borderRadius: 15,
//     alignItems: 'center',
//     borderWidth: 2,
//     borderColor: 'rgba(255, 255, 255, 0.8)',
//   },
//   buttonText: {
//     fontSize: 18,
//     fontFamily: 'Fredoka-Bold',
//     color: '#FFFFFF',
//   },
// });