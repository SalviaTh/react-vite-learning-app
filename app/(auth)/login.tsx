// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   Pressable,
//   StyleSheet,
//   Alert,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
// } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { router } from 'expo-router';
// import { useAuth } from '@/contexts/AuthContext';
// import { Mail, Lock, Eye, EyeOff } from 'lucide-react-native';

// export default function LoginScreen() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const { signIn } = useAuth();

//   const handleLogin = async () => {
//     if (!email || !password) {
//       Alert.alert('Error', 'Please fill in all fields');
//       return;
//     }

//     setLoading(true);
//     const { error } = await signIn(email, password);
//     setLoading(false);

//     if (error) {
//       Alert.alert('Login Failed', error.message);
//     } else {
//       router.replace('/(tabs)');
//     }
//   };

//   return (
//     <LinearGradient colors={['#FFF8DC', '#FFE4E1', '#E6E6FA']} style={styles.container}>
//       <SafeAreaView style={styles.safeArea}>
//         <KeyboardAvoidingView
//           behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//           style={styles.keyboardView}
//         >
//           <ScrollView contentContainerStyle={styles.scrollContent}>
//             {/* Header */}
//             <View style={styles.header}>
//               <Text style={styles.title}>Welcome Back! 👋</Text>
//               <Text style={styles.subtitle}>Sign in to continue your math adventure</Text>
//             </View>

//             {/* Login Form */}
//             <View style={styles.formContainer}>
//               <LinearGradient
//                 colors={['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.7)']}
//                 style={styles.formCard}
//               >
//                 {/* Email Input */}
//                 <View style={styles.inputContainer}>
//                   <View style={styles.inputWrapper}>
//                     <Mail size={20} color="#5D6D7E" style={styles.inputIcon} />
//                     <TextInput
//                       style={styles.textInput}
//                       placeholder="Email address"
//                       placeholderTextColor="#5D6D7E"
//                       value={email}
//                       onChangeText={setEmail}
//                       keyboardType="email-address"
//                       autoCapitalize="none"
//                       autoCorrect={false}
//                     />
//                   </View>
//                 </View>

//                 {/* Password Input */}
//                 <View style={styles.inputContainer}>
//                   <View style={styles.inputWrapper}>
//                     <Lock size={20} color="#5D6D7E" style={styles.inputIcon} />
//                     <TextInput
//                       style={[styles.textInput, styles.passwordInput]}
//                       placeholder="Password"
//                       placeholderTextColor="#5D6D7E"
//                       value={password}
//                       onChangeText={setPassword}
//                       secureTextEntry={!showPassword}
//                       autoCapitalize="none"
//                       autoCorrect={false}
//                     />
//                     <Pressable
//                       onPress={() => setShowPassword(!showPassword)}
//                       style={styles.eyeIcon}
//                     >
//                       {showPassword ? (
//                         <EyeOff size={20} color="#5D6D7E" />
//                       ) : (
//                         <Eye size={20} color="#5D6D7E" />
//                       )}
//                     </Pressable>
//                   </View>
//                 </View>

//                 {/* Login Button */}
//                 <Pressable
//                   style={[styles.loginButton, loading && styles.loginButtonDisabled]}
//                   onPress={handleLogin}
//                   disabled={loading}
//                 >
//                   <LinearGradient
//                     colors={['#FF9A9E', '#FECFEF']}
//                     style={styles.loginButtonGradient}
//                   >
//                     <Text style={styles.loginButtonText}>
//                       {loading ? 'Signing In...' : '🚀 Sign In'}
//                     </Text>
//                   </LinearGradient>
//                 </Pressable>

//                 {/* Divider */}
//                 <View style={styles.divider}>
//                   <View style={styles.dividerLine} />
//                   <Text style={styles.dividerText}>or</Text>
//                   <View style={styles.dividerLine} />
//                 </View>

//                 {/* Register Link */}
//                 <Pressable
//                   style={styles.registerLink}
//                   onPress={() => router.push('/(auth)/register')}
//                 >
//                   <Text style={styles.registerText}>
//                     Don't have an account?{' '}
//                     <Text style={styles.registerTextBold}>Create one!</Text>
//                   </Text>
//                 </Pressable>
//               </LinearGradient>
//             </View>

//             {/* Fun Elements */}
//             <View style={styles.funElements}>
//               <Text style={styles.funEmoji}>🎯</Text>
//               <Text style={styles.funText}>Ready to learn and have fun?</Text>
//               <Text style={styles.funEmoji}>⭐</Text>
//             </View>
//           </ScrollView>
//         </KeyboardAvoidingView>
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
//   keyboardView: {
//     flex: 1,
//   },
//   scrollContent: {
//     flexGrow: 1,
//     paddingHorizontal: 20,
//     paddingVertical: 20,
//   },
//   header: {
//     alignItems: 'center',
//     marginBottom: 40,
//     marginTop: 20,
//   },
//   title: {
//     fontSize: 32,
//     fontFamily: 'Fredoka-Bold',
//     color: '#2C3E50',
//     marginBottom: 8,
//     textAlign: 'center',
//   },
//   subtitle: {
//     fontSize: 16,
//     fontFamily: 'Nunito-Regular',
//     color: '#5D6D7E',
//     textAlign: 'center',
//   },
//   formContainer: {
//     marginBottom: 30,
//   },
//   formCard: {
//     borderRadius: 20,
//     padding: 30,
//     borderWidth: 2,
//     borderColor: 'rgba(255, 107, 107, 0.2)',
//     elevation: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//   },
//   inputContainer: {
//     marginBottom: 20,
//   },
//   inputWrapper: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(255, 255, 255, 0.8)',
//     borderRadius: 15,
//     borderWidth: 2,
//     borderColor: 'rgba(255, 107, 107, 0.2)',
//     paddingHorizontal: 15,
//     paddingVertical: 12,
//   },
//   inputIcon: {
//     marginRight: 12,
//   },
//   textInput: {
//     flex: 1,
//     fontSize: 16,
//     fontFamily: 'Nunito-Regular',
//     color: '#2C3E50',
//   },
//   passwordInput: {
//     paddingRight: 40,
//   },
//   eyeIcon: {
//     position: 'absolute',
//     right: 15,
//     padding: 5,
//   },
//   loginButton: {
//     borderRadius: 15,
//     elevation: 6,
//     shadowColor: '#FF9A9E',
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.3,
//     shadowRadius: 6,
//     marginBottom: 20,
//   },
//   loginButtonDisabled: {
//     opacity: 0.7,
//   },
//   loginButtonGradient: {
//     paddingVertical: 16,
//     borderRadius: 15,
//     alignItems: 'center',
//     borderWidth: 2,
//     borderColor: 'rgba(255, 255, 255, 0.8)',
//   },
//   loginButtonText: {
//     fontSize: 18,
//     fontFamily: 'Fredoka-Bold',
//     color: '#FFFFFF',
//     textShadowColor: 'rgba(0, 0, 0, 0.2)',
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 2,
//   },
//   divider: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginVertical: 20,
//   },
//   dividerLine: {
//     flex: 1,
//     height: 1,
//     backgroundColor: 'rgba(93, 109, 126, 0.3)',
//   },
//   dividerText: {
//     marginHorizontal: 15,
//     fontSize: 14,
//     fontFamily: 'Nunito-Regular',
//     color: '#5D6D7E',
//   },
//   registerLink: {
//     alignItems: 'center',
//   },
//   registerText: {
//     fontSize: 16,
//     fontFamily: 'Nunito-Regular',
//     color: '#5D6D7E',
//     textAlign: 'center',
//   },
//   registerTextBold: {
//     fontFamily: 'Nunito-Bold',
//     color: '#FF6B6B',
//   },
//   funElements: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 20,
//     gap: 10,
//   },
//   funEmoji: {
//     fontSize: 24,
//   },
//   funText: {
//     fontSize: 14,
//     fontFamily: 'Nunito-SemiBold',
//     color: '#5D6D7E',
//   },
// });