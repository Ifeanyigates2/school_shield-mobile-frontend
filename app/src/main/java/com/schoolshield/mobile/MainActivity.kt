package com.schoolshield.mobile

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import com.schoolshield.mobile.ui.auth.ForgotPasswordScreen
import com.schoolshield.mobile.ui.auth.LoginScreen
import com.schoolshield.mobile.ui.auth.OnboardingScreen
import com.schoolshield.mobile.ui.auth.OtpScreen
import com.schoolshield.mobile.ui.auth.SignupScreen
import com.schoolshield.mobile.ui.auth.SplashScreen
import com.schoolshield.mobile.ui.auth.WelcomeScreen
import com.schoolshield.mobile.ui.shell.MainShell
import com.schoolshield.mobile.ui.theme.Cream
import com.schoolshield.mobile.ui.theme.SchoolShieldTheme

class MainActivity : ComponentActivity() {
    private val vm: AppViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            SchoolShieldTheme {
                Surface(Modifier.fillMaxSize(), color = Cream) {
                    SchoolShieldRoot(vm)
                }
            }
        }
    }
}

@Composable
fun SchoolShieldRoot(vm: AppViewModel) {
    val state by vm.ui.collectAsState()
    if (state.hydrating) {
        SplashScreen()
        return
    }
    when (val screen = state.screen) {
        Screen.Welcome -> WelcomeScreen(vm)
        Screen.Login -> LoginScreen(state, vm)
        Screen.Signup -> SignupScreen(state, vm)
        Screen.ForgotPassword -> ForgotPasswordScreen(state, vm)
        Screen.Otp -> OtpScreen(state, vm)
        Screen.Onboarding -> OnboardingScreen(state, vm)
        is Screen.Main -> {
            val user = state.app.user
            if (user == null) LoginScreen(state, vm)
            else MainShell(state, user, vm)
        }
    }
}
