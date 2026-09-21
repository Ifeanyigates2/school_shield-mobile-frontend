package com.schoolshield.mobile

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.schoolshield.mobile.data.ApiEnvelope
import com.schoolshield.mobile.data.AppState
import com.schoolshield.mobile.data.DemoDesks
import com.schoolshield.mobile.data.PASSWORD_POLICY
import com.schoolshield.mobile.data.passwordMeetsPolicy
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

sealed interface Screen {
    data object Welcome : Screen
    data object Login : Screen
    data object Signup : Screen
    data object ForgotPassword : Screen
    data object Otp : Screen
    data object Onboarding : Screen
    data class Main(val tab: Int = 0, val page: Page = Page.Tab) : Screen
}

sealed interface Page {
    data object Tab : Page
    data object Codes : Page
    data object Attendance : Page
    data object Delegates : Page
    data object Incidents : Page
    data object Activities : Page
    data object Updates : Page
    data object Reviews : Page
    data object Users : Page
    data object Log : Page
    data object Substitute : Page
    data object Profile : Page
    data object Settings : Page
    data class Thread(val otherId: String) : Page
}

data class UiState(
    val hydrating: Boolean = true,
    val busy: Boolean = false,
    val toast: String? = null,
    val error: String? = null,
    val screen: Screen = Screen.Login,
    val app: AppState = AppState(),
    val apiBase: String = SchoolShieldApp.DEFAULT_API,
)

class AppViewModel(application: Application) : AndroidViewModel(application) {
    private val appContext = application as SchoolShieldApp
    private val prefs = application.getSharedPreferences("schoolshield", Application.MODE_PRIVATE)
    private val api get() = appContext.api

    private val _ui = MutableStateFlow(
        UiState(apiBase = prefs.getString(SchoolShieldApp.KEY_API, SchoolShieldApp.DEFAULT_API) ?: SchoolShieldApp.DEFAULT_API),
    )
    val ui: StateFlow<UiState> = _ui

    init {
        hydrate()
    }

    fun hydrate() {
        launch("Could not reach SchoolShield") {
            val state = api.state()
            _ui.update {
                it.copy(
                    hydrating = false,
                    app = state,
                    screen = destinationFor(state, it.screen),
                    error = null,
                )
            }
        }
    }

    fun go(screen: Screen) {
        _ui.update { it.copy(screen = screen, error = null) }
    }

    fun openPage(page: Page) {
        val current = _ui.value.screen
        val tab = (current as? Screen.Main)?.tab ?: 0
        _ui.update { it.copy(screen = Screen.Main(tab, page), error = null) }
    }

    fun setTab(tab: Int) {
        _ui.update { it.copy(screen = Screen.Main(tab, Page.Tab), error = null) }
    }

    fun back() {
        val screen = _ui.value.screen
        _ui.update {
            it.copy(
                screen = when (screen) {
                    is Screen.Main -> if (screen.page != Page.Tab) Screen.Main(screen.tab, Page.Tab) else screen
                    Screen.ForgotPassword -> Screen.Login
                    Screen.Otp, Screen.Onboarding, Screen.Signup -> Screen.Login
                    else -> Screen.Login
                },
                error = null,
            )
        }
    }

    fun clearToast() = _ui.update { it.copy(toast = null) }

    fun login(email: String, password: String) = authCall {
        api.login(email.trim(), password)
    }

    fun demo(email: String) = authCall { api.demo(email) }

    fun signup(role: String, name: String, email: String, phone: String, password: String) {
        when {
            role.isBlank() -> fail("Select your role first. Parent / Guardian is required if you collect a child.")
            phone.isBlank() -> fail("Phone number is required")
            !passwordMeetsPolicy(password) -> fail(PASSWORD_POLICY)
            else -> authCall {
                api.signup(role, name.trim(), email.trim(), phone.trim(), password)
            }
        }
    }

    fun social(
        provider: String,
        mode: String,
        role: String?,
        name: String,
        email: String,
        phone: String,
    ) {
        if (mode == "signup" && role.isNullOrBlank()) {
            fail("Select your role first. Parent / Guardian is required if you collect a child.")
            return
        }
        if (mode == "signup" && phone.isBlank()) {
            fail("Phone number is required")
            return
        }
        authCall { api.social(provider, mode, role, name.trim(), email.trim(), phone.trim()) }
    }

    fun verifyOtp(code: String) = authCall { api.verifyOtp(code.trim()) }

    fun resendOtp() = authCall { api.resendOtp() }

    fun completeSignup(
        username: String,
        idDocumentName: String?,
        classId: String?,
        isSubstitute: Boolean?,
    ) = authCall {
        api.completeSignup(
            buildMap {
                put("username", username.trim())
                if (!idDocumentName.isNullOrBlank()) put("idDocumentName", idDocumentName)
                if (!classId.isNullOrBlank()) put("classId", classId)
                if (isSubstitute != null) put("isSubstitute", isSubstitute)
            },
        )
    }

    fun logout() {
        launch("Could not sign out") {
            runCatching { api.logout() }
            appContext.cookieJar.clear()
            _ui.update {
                it.copy(
                    app = AppState(),
                    screen = Screen.Login,
                    busy = false,
                    toast = "Signed out",
                )
            }
        }
    }

    fun mutate(action: String, payload: Map<String, Any?> = emptyMap()) {
        launch("Action failed") {
            val res = api.mutate(action, payload)
            applyEnvelope(res, stayOnOtp = false)
            if (!res.ok) _ui.update { it.copy(error = res.error ?: "That did not work") }
        }
    }

    fun saveApiBase(url: String) {
        val cleaned = url.trim().trimEnd('/')
        prefs.edit().putString(SchoolShieldApp.KEY_API, cleaned).apply()
        _ui.update { it.copy(apiBase = cleaned, toast = "Server saved. Pulling latest state…") }
        hydrate()
    }

    private fun authCall(block: () -> ApiEnvelope) {
        launch("Could not reach SchoolShield") {
            applyEnvelope(block(), stayOnOtp = true)
        }
    }

    private fun applyEnvelope(res: ApiEnvelope, stayOnOtp: Boolean) {
        val state = res.state ?: _ui.value.app
        val current = _ui.value.screen
        val pending = state.pendingAuth ?: res.pendingAuth
        val screen = when {
            !res.ok -> current
            res.next == "onboarding" -> Screen.Onboarding
            state.user != null -> if (current is Screen.Main) current else Screen.Main()
            stayOnOtp && pending != null -> Screen.Otp
            else -> destinationFor(state, current)
        }
        _ui.update {
            it.copy(
                app = state,
                screen = screen,
                error = if (res.ok) null else res.error,
                toast = res.message ?: res.student?.let { s ->
                    "${s.fullName} ${if (res.kind == "pickup") "checked out" else "checked in"}"
                },
                hydrating = false,
            )
        }
    }

    private fun destinationFor(state: AppState, current: Screen): Screen {
        val pending = state.pendingAuth
        return when {
            state.user != null -> (current as? Screen.Main) ?: Screen.Main()
            pending?.mode == "signup" && current is Screen.Onboarding -> Screen.Onboarding
            pending != null -> Screen.Otp
            else -> if (current is Screen.Login || current is Screen.Signup || current is Screen.ForgotPassword) current else Screen.Login
        }
    }

    private fun fail(message: String) {
        _ui.update { it.copy(error = message, busy = false) }
    }

    private fun launch(failMessage: String, block: suspend () -> Unit) {
        _ui.update { it.copy(busy = true, error = null) }
        viewModelScope.launch {
            try {
                withContext(Dispatchers.IO) { block() }
            } catch (e: Exception) {
                _ui.update {
                    it.copy(
                        hydrating = false,
                        error = e.message ?: failMessage,
                    )
                }
            } finally {
                _ui.update { it.copy(busy = false) }
            }
        }
    }
}

val DemoDesks.hint: String
    get() = "Demo password ${DemoDesks.PASSWORD}. Demo OTP ${DemoDesks.OTP}."
