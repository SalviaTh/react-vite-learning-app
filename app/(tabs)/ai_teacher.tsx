


// import { Platform, View, StyleSheet } from 'react-native';
// import { WebView } from 'react-native-webview';
// import React from 'react';

// const AI_TEACHER_URL = 'https://jolly-liger-085f8a.netlify.app/'; 

// export default function AITeacher() {
//   if (Platform.OS === 'web') {
//     return (
//       <div style={{ flex: 1, height: '100vh', width: '100%' }}>
//         <iframe
//           src={AI_TEACHER_URL}
//           style={{
//             border: 'none',
//             width: '100%',
//             height: '100%',
//           }}
//           title="AI Teacher"
//           allowFullScreen
//         />
//       </div>
//     );
//   }

//   // For iOS/Android native
//   return (
//     <View style={styles.container}>
//       <WebView
//         source={{ uri: AI_TEACHER_URL }}
//         style={{ flex: 1 }}
//         javaScriptEnabled
//         domStorageEnabled
//         allowsFullscreenVideo
//         startInLoadingState
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
// });
