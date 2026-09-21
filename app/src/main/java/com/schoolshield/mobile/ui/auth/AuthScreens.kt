package com.schoolshield.mobile.ui.auth

import android.app.Activity
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.outlined.ArrowBack
import androidx.compose.material.icons.outlined.Add
import androidx.compose.material.icons.outlined.CheckCircle
import androidx.compose.material.icons.outlined.Notifications
import androidx.compose.material.icons.outlined.PhotoCamera
import androidx.compose.material.icons.outlined.Shield
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.platform.LocalView
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.view.WindowCompat
import com.schoolshield.mobile.AppViewModel
import com.schoolshield.mobile.Screen
import com.schoolshield.mobile.UiState
import com.schoolshield.mobile.data.DemoDesks
import com.schoolshield.mobile.data.PASSWORD_POLICY
import com.schoolshield.mobile.data.ROLE_OPTIONS
import com.schoolshield.mobile.data.passwordMeetsPolicy
import com.schoolshield.mobile.data.roleLabel
import com.schoolshield.mobile.ui.components.ErrorBanner
import com.schoolshield.mobile.ui.components.RoleCard
import com.schoolshield.mobile.ui.components.SocialButton
import com.schoolshield.mobile.ui.components.SsButton
import com.schoolshield.mobile.ui.components.SsCard
import com.schoolshield.mobile.ui.components.SsField
import com.schoolshield.mobile.ui.components.Wordmark
import com.schoolshield.mobile.ui.theme.Cream
import com.schoolshield.mobile.ui.theme.Forest
import com.schoolshield.mobile.ui.theme.Gold
import com.schoolshield.mobile.ui.theme.Ink
import com.schoolshield.mobile.ui.theme.Mute
import com.schoolshield.mobile.ui.theme.SoftFill
import com.schoolshield.mobile.ui.theme.Success
import com.schoolshield.mobile.ui.theme.White

@Composable
fun AuthScaffold(content: @Composable () -> Unit) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Cream)
            .imePadding(),
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 24.dp, vertical = 28.dp),
        ) {
            Wordmark()
            Spacer(Modifier.height(28.dp))
            content()
        }
    }
}

@Composable
fun WelcomeScreen(vm: AppViewModel) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Forest),
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(28.dp),
            verticalArrangement = Arrangement.SpaceBetween,
        ) {
            Wordmark(light = true)
            Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.fillMaxWidth()) {
                Box(
                    Modifier
                        .size(88.dp)
                        .clip(CircleShape)
                        .background(White.copy(alpha = 0.12f)),
                    contentAlignment = Alignment.Center,
                ) {
                    Icon(Icons.Outlined.Shield, contentDescription = null, tint = Gold, modifier = Modifier.size(42.dp))
                }
                Spacer(Modifier.height(24.dp))
                Text(
                    "You're all set",
                    color = White,
                    fontSize = 32.sp,
                    fontWeight = FontWeight.SemiBold,
                    textAlign = TextAlign.Center,
                )
                Spacer(Modifier.height(12.dp))
                Text(
                    "Live 15-minute gate codes, attendance that follows verification, and a desk for parents, teachers, and school admins.",
                    color = White.copy(alpha = 0.78f),
                    fontSize = 16.sp,
                    textAlign = TextAlign.Center,
                    lineHeight = 22.sp,
                )
            }
            Column {
                SsButton("Sign in", onClick = { vm.go(Screen.Login) }, gold = true)
                Spacer(Modifier.height(10.dp))
                TextButton(
                    onClick = { vm.go(Screen.Signup) },
                    modifier = Modifier.fillMaxWidth().height(54.dp),
                ) {
                    Text("Create an account", color = White, fontWeight = FontWeight.SemiBold, fontSize = 16.sp)
                }
            }
        }
    }
}

@Composable
fun LoginScreen(state: UiState, vm: AppViewModel) {
    var email by remember { mutableStateOf("ada@greenfield.school") }
    var password by remember { mutableStateOf(DemoDesks.PASSWORD) }
    var visible by remember { mutableStateOf(false) }
    val greet = DemoDesks.accounts.find { it.email.equals(email.trim(), true) }?.name?.split(" ")?.first()
        ?: "there"
    LightStatusBar(lightIcons = true)

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFF071529))
            .imePadding(),
    ) {
        Canvas(Modifier.fillMaxSize()) {
            drawCircle(
                Color(0xFF12345C),
                radius = size.maxDimension * 0.55f,
                center = Offset(size.width * 1.05f, size.height * 0.18f),
            )
            drawCircle(
                Color(0xFF0A2748).copy(alpha = 0.9f),
                radius = size.maxDimension * 0.62f,
                center = Offset(size.width * -0.05f, size.height * 0.72f),
            )
            drawCircle(
                Color(0xFF163E6A).copy(alpha = 0.35f),
                radius = size.maxDimension * 0.4f,
                center = Offset(size.width * 0.85f, size.height * 0.58f),
            )
        }
        Column(
            modifier = Modifier
                .fillMaxSize()
                .statusBarsPadding()
                .navigationBarsPadding()
                .padding(horizontal = 24.dp, vertical = 20.dp),
        ) {
            Wordmark(light = true, compact = true)
            Spacer(Modifier.height(36.dp))
            Text(
                "Welcome back, $greet",
                color = White,
                fontSize = 32.sp,
                fontWeight = FontWeight.SemiBold,
                lineHeight = 38.sp,
            )
            Spacer(Modifier.height(28.dp))
            ErrorBanner(state.error)
            DarkField(
                value = email,
                onValueChange = { email = it },
                label = "Phone number or email",
                keyboardType = KeyboardType.Email,
            )
            Spacer(Modifier.height(16.dp))
            DarkField(
                value = password,
                onValueChange = { password = it },
                label = "Password",
                password = !visible,
                trailing = {
                    Text(
                        if (visible) "Hide" else "Show",
                        color = White.copy(alpha = 0.7f),
                        fontWeight = FontWeight.SemiBold,
                        fontSize = 14.sp,
                        modifier = Modifier
                            .clickable { visible = !visible }
                            .padding(end = 8.dp),
                    )
                },
            )
            Spacer(Modifier.height(14.dp))
            Text(
                "Forgot password?",
                color = White,
                fontWeight = FontWeight.SemiBold,
                fontSize = 14.sp,
                modifier = Modifier
                    .align(Alignment.End)
                    .clickable { vm.go(Screen.ForgotPassword) }
                    .padding(vertical = 4.dp),
            )
            Spacer(Modifier.weight(1f))
            SsButton("Log in", inverted = true, busy = state.busy, onClick = { vm.login(email, password) })
        }
    }
}

@Composable
private fun DarkField(
    value: String,
    onValueChange: (String) -> Unit,
    label: String,
    password: Boolean = false,
    keyboardType: KeyboardType = KeyboardType.Text,
    trailing: @Composable (() -> Unit)? = null,
) {
    Column {
        Text(label, color = White.copy(alpha = 0.72f), fontSize = 13.sp, fontWeight = FontWeight.Medium)
        Spacer(Modifier.height(8.dp))
        OutlinedTextField(
            value = value,
            onValueChange = onValueChange,
            modifier = Modifier.fillMaxWidth(),
            singleLine = true,
            visualTransformation = if (password) PasswordVisualTransformation() else VisualTransformation.None,
            keyboardOptions = KeyboardOptions(keyboardType = if (password) KeyboardType.Password else keyboardType),
            trailingIcon = trailing,
            shape = RoundedCornerShape(14.dp),
            textStyle = TextStyle(color = White, fontSize = 16.sp),
            colors = OutlinedTextFieldDefaults.colors(
                focusedBorderColor = White.copy(alpha = 0.18f),
                unfocusedBorderColor = Color.Transparent,
                focusedContainerColor = Color.White.copy(alpha = 0.08f),
                unfocusedContainerColor = Color.White.copy(alpha = 0.08f),
                cursorColor = White,
            ),
        )
    }
}

@Composable
fun ForgotPasswordScreen(state: UiState, vm: AppViewModel) {
    var step by remember { mutableIntStateOf(0) }
    var identifier by remember { mutableStateOf("") }
    var code by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var contact by remember { mutableStateOf(false) }
    LightStatusBar(lightIcons = false)

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Cream)
            .statusBarsPadding()
            .navigationBarsPadding()
            .imePadding()
            .verticalScroll(rememberScrollState())
            .padding(horizontal = 24.dp, vertical = 8.dp),
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            IconButton(onClick = {
                if (step > 0) step-- else vm.go(Screen.Login)
            }) {
                Icon(Icons.AutoMirrored.Outlined.ArrowBack, contentDescription = "Back", tint = Ink)
            }
            Text(
                "Reset password",
                fontWeight = FontWeight.SemiBold,
                modifier = Modifier.weight(1f),
                textAlign = TextAlign.Center,
            )
            Spacer(Modifier.width(48.dp))
        }
        Spacer(Modifier.height(20.dp))
        when (step) {
            0 -> {
                Text("Reset your password", fontSize = 28.sp, fontWeight = FontWeight.SemiBold, color = Ink)
                Spacer(Modifier.height(8.dp))
                Text(
                    "Enter the phone number or email on your SchoolShield account. We'll send a 4-digit code.",
                    color = Mute,
                    fontSize = 14.sp,
                    lineHeight = 20.sp,
                )
                Spacer(Modifier.height(20.dp))
                ErrorBanner(state.error)
                SsField(identifier, { identifier = it }, "Phone number or email")
                Spacer(Modifier.height(16.dp))
                SsCard {
                    Text("FOUR STEPS", color = Mute, fontSize = 11.sp, fontWeight = FontWeight.SemiBold, letterSpacing = 1.1.sp)
                    Spacer(Modifier.height(12.dp))
                    ResetStep(1, "Confirm your phone number or email", true)
                    ResetStep(2, "Enter the 4-digit code we send", false)
                    ResetStep(3, "Choose a new password", false)
                    ResetStep(4, "Sign in with it", false)
                }
                Spacer(Modifier.height(24.dp))
                SsButton("Send code", onClick = { if (identifier.isNotBlank()) step = 1 }, enabled = identifier.isNotBlank())
                Spacer(Modifier.height(10.dp))
                SsButton("Contact school instead", outline = true, onClick = { contact = true })
            }
            1 -> {
                Text("Enter your code", fontSize = 28.sp, fontWeight = FontWeight.SemiBold, color = Ink)
                Spacer(Modifier.height(8.dp))
                Text("We sent a 4-digit code to $identifier.", color = Mute, fontSize = 14.sp)
                Spacer(Modifier.height(20.dp))
                OtpBoxes(code, length = 4) { code = it.filter { ch -> ch.isDigit() }.take(4) }
                Spacer(Modifier.height(12.dp))
                SsCard(color = Gold.copy(alpha = 0.18f)) {
                    Text("ON-SCREEN CODE", color = Forest, fontSize = 11.sp, fontWeight = FontWeight.SemiBold)
                    Text("0000", fontSize = 28.sp, fontWeight = FontWeight.Bold, color = Ink, letterSpacing = 4.sp)
                    Text("Demo reset code is 0000.", color = Mute, fontSize = 12.sp)
                }
                Spacer(Modifier.height(20.dp))
                SsButton("Continue", onClick = { step = 2 }, enabled = code == "0000" || code == "000000")
            }
            else -> {
                Text("Choose a new password", fontSize = 28.sp, fontWeight = FontWeight.SemiBold, color = Ink)
                Spacer(Modifier.height(8.dp))
                Text("Then sign in with it on the next screen.", color = Mute, fontSize = 14.sp)
                Spacer(Modifier.height(20.dp))
                SsField(password, { password = it }, "New password", password = true)
                Spacer(Modifier.height(10.dp))
                PasswordChecks(password)
                Spacer(Modifier.height(20.dp))
                SsButton(
                    "Sign in with it",
                    onClick = { vm.login(identifier, password) },
                    busy = state.busy,
                    enabled = passwordMeetsPolicy(password),
                )
            }
        }
    }
    if (contact) {
        AlertDialog(
            onDismissRequest = { contact = false },
            title = { Text("Contact school") },
            text = {
                Text(
                    "Ask the school admin desk to reset your SchoolShield password. Greenfield Academy demo: tunde@greenfield.school.",
                    color = Mute,
                )
            },
            confirmButton = {
                TextButton(onClick = { contact = false }) {
                    Text("Close", color = Forest, fontWeight = FontWeight.SemiBold)
                }
            },
            containerColor = White,
            shape = RoundedCornerShape(20.dp),
        )
    }
}

@Composable
private fun ResetStep(n: Int, label: String, active: Boolean) {
    Row(Modifier.padding(vertical = 6.dp), verticalAlignment = Alignment.CenterVertically) {
        Box(
            Modifier
                .size(28.dp)
                .clip(CircleShape)
                .background(if (active) Forest else SoftFill),
            contentAlignment = Alignment.Center,
        ) {
            Text(n.toString(), color = if (active) White else Mute, fontWeight = FontWeight.SemiBold, fontSize = 13.sp)
        }
        Spacer(Modifier.width(12.dp))
        Text(label, color = Ink, fontSize = 14.sp)
    }
}

@Composable
private fun LightStatusBar(lightIcons: Boolean) {
    val view = LocalView.current
    DisposableEffect(lightIcons) {
        val window = (view.context as? Activity)?.window
        val controller = window?.let { WindowCompat.getInsetsController(it, view) }
        val previous = controller?.isAppearanceLightStatusBars
        controller?.isAppearanceLightStatusBars = !lightIcons
        onDispose {
            if (previous != null) controller.isAppearanceLightStatusBars = previous
        }
    }
}

@Composable
fun SignupScreen(state: UiState, vm: AppViewModel) {
    var role by remember { mutableStateOf("") }
    var name by remember { mutableStateOf("") }
    var email by remember { mutableStateOf("") }
    var phone by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var social by remember { mutableStateOf<String?>(null) }

    AuthScaffold {
        Text("Create an account", fontSize = 30.sp, fontWeight = FontWeight.SemiBold, color = Ink)
        Spacer(Modifier.height(6.dp))
        Text("Role is required. Phone is required. Email is optional.", color = Mute, fontSize = 14.sp)
        Spacer(Modifier.height(18.dp))
        ErrorBanner(state.error)
        ROLE_OPTIONS.forEach { opt ->
            RoleCard(selected = role == opt.value, title = opt.label, hint = opt.hint) { role = opt.value }
            Spacer(Modifier.height(8.dp))
        }
        Spacer(Modifier.height(8.dp))
        SsField(name, { name = it }, "Full name")
        Spacer(Modifier.height(12.dp))
        SsField(phone, { phone = it }, "Phone", keyboardType = KeyboardType.Phone)
        Spacer(Modifier.height(12.dp))
        SsField(email, { email = it }, "Email (optional)", keyboardType = KeyboardType.Email)
        Spacer(Modifier.height(12.dp))
        SsField(password, { password = it }, "Create a password", password = true)
        Spacer(Modifier.height(10.dp))
        PasswordChecks(password)
        Spacer(Modifier.height(18.dp))
        SsButton("Continue", onClick = { vm.signup(role, name, email, phone, password) }, busy = state.busy)
        Spacer(Modifier.height(12.dp))
        SocialButton("Continue with Google") { social = "google" }
        Spacer(Modifier.height(8.dp))
        SocialButton("Continue with Facebook") { social = "facebook" }
        Spacer(Modifier.height(16.dp))
        Text("Already have an account? Sign in", color = Forest, fontWeight = FontWeight.SemiBold, modifier = Modifier.clickable { vm.go(Screen.Login) })
    }
    if (social != null) {
        SocialDialog(
            provider = social!!,
            mode = "signup",
            initialEmail = email,
            needPhone = true,
            busy = state.busy,
            onClose = { social = null },
            onContinue = { n, mail, ph ->
                vm.social(social!!, "signup", role, n, mail, ph)
            },
        )
    }
}

@Composable
private fun PasswordChecks(password: String) {
    val checks = listOf(
        "At least 8 characters" to (password.length >= 8),
        "A capital letter" to password.any { it.isUpperCase() },
        "A number" to password.any { it.isDigit() },
        "A special character" to password.any { !it.isLetterOrDigit() },
    )
    Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
        checks.forEach { (label, ok) ->
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(
                    Icons.Outlined.CheckCircle,
                    contentDescription = null,
                    tint = if (ok) Success else Mute.copy(alpha = 0.4f),
                    modifier = Modifier.size(18.dp),
                )
                Spacer(Modifier.width(8.dp))
                Text(label, color = if (ok) Success else Mute, fontSize = 13.sp)
            }
        }
        if (password.isNotBlank() && !passwordMeetsPolicy(password)) {
            Text(PASSWORD_POLICY, color = Mute, fontSize = 12.sp)
        }
    }
}

@Composable
fun OtpScreen(state: UiState, vm: AppViewModel) {
    var code by remember { mutableStateOf("") }
    val pending = state.app.pendingAuth
    AuthScaffold {
        Text("Verify your phone", fontSize = 30.sp, fontWeight = FontWeight.SemiBold, color = Ink)
        val dest = listOfNotNull(
            pending?.email?.takeIf { it.contains("@") },
            pending?.phone?.takeIf { it.isNotBlank() },
        ).joinToString(" and ").ifBlank { "your phone or email" }
        Spacer(Modifier.height(6.dp))
        Text("We sent a 6-digit OTP to $dest.", color = Mute, fontSize = 14.sp)
        Spacer(Modifier.height(20.dp))
        ErrorBanner(state.error)
        if (state.toast != null) Text(state.toast, color = Forest, fontSize = 13.sp)
        OtpBoxes(code) { code = it.filter { ch -> ch.isDigit() }.take(6) }
        if (pending?.revealOtp == true && pending.otp.isNotBlank()) {
            Spacer(Modifier.height(12.dp))
            SsCard(color = Gold.copy(alpha = 0.18f)) {
                Text("ON-SCREEN CODE", color = Forest, fontSize = 11.sp, fontWeight = FontWeight.SemiBold)
                Text(pending.otp, fontSize = 28.sp, fontWeight = FontWeight.Bold, color = Ink, letterSpacing = 4.sp)
                Text("Delivery failed, so the code is shown here. Demo OTP is ${DemoDesks.OTP}.", color = Mute, fontSize = 12.sp)
            }
        }
        Spacer(Modifier.height(20.dp))
        SsButton("Verify", onClick = { vm.verifyOtp(code) }, busy = state.busy, enabled = code.length == 6)
        Spacer(Modifier.height(8.dp))
        TextButton(onClick = { vm.resendOtp() }, modifier = Modifier.fillMaxWidth()) {
            Text("Resend code", color = Forest, fontWeight = FontWeight.SemiBold)
        }
        TextButton(onClick = { vm.go(Screen.Login) }, modifier = Modifier.fillMaxWidth()) {
            Text("Start over", color = Mute)
        }
    }
}

@Composable
private fun OtpBoxes(code: String, length: Int = 6, onChange: (String) -> Unit) {
    Box {
        BasicTextField(
            value = code,
            onValueChange = onChange,
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.NumberPassword),
            cursorBrush = SolidColor(Forest),
            textStyle = TextStyle(color = Ink, fontSize = 1.sp),
            modifier = Modifier.fillMaxWidth().height(64.dp),
        )
        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            repeat(length) { i ->
                val ch = code.getOrNull(i)?.toString().orEmpty()
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .height(56.dp)
                        .clip(RoundedCornerShape(16.dp))
                        .background(SoftFill),
                    contentAlignment = Alignment.Center,
                ) {
                    Text(ch, fontSize = 22.sp, fontWeight = FontWeight.SemiBold, color = Ink)
                }
            }
        }
    }
}

@Composable
fun OnboardingScreen(state: UiState, vm: AppViewModel) {
    val pending = state.app.pendingAuth
    var step by remember { mutableIntStateOf(0) }
    var username by remember { mutableStateOf("") }
    var idDoc by remember { mutableStateOf("") }
    var classId by remember { mutableStateOf(state.app.classes.firstOrNull()?.id.orEmpty()) }
    var substitute by remember { mutableStateOf(false) }
    var photoAdded by remember { mutableStateOf(false) }
    var alerts by remember { mutableStateOf(true) }
    var weekly by remember { mutableStateOf(true) }
    val isParent = pending?.role == "parent"
    val last = if (isParent) 3 else 2

    fun finish() {
        vm.completeSignup(
            username = username,
            idDocumentName = idDoc.ifBlank { null },
            classId = if (pending?.role == "teacher" && !substitute) classId else null,
            isSubstitute = if (pending?.role == "teacher") substitute else null,
        )
    }

    if (step == last) {
        Box(Modifier.fillMaxSize().background(Forest).padding(28.dp)) {
            Column(Modifier.fillMaxSize(), verticalArrangement = Arrangement.SpaceBetween) {
                Wordmark(light = true)
                Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.fillMaxWidth()) {
                    Icon(Icons.Outlined.CheckCircle, contentDescription = null, tint = Gold, modifier = Modifier.size(72.dp))
                    Spacer(Modifier.height(20.dp))
                    Text("You're all set", color = White, fontSize = 32.sp, fontWeight = FontWeight.SemiBold)
                    Spacer(Modifier.height(10.dp))
                    Text(
                        "Your SchoolShield desk is ready. Generate a live code before you reach the gate.",
                        color = White.copy(alpha = 0.78f),
                        textAlign = TextAlign.Center,
                    )
                }
                SsButton("Continue", gold = true, onClick = { finish() }, busy = state.busy, enabled = username.isNotBlank())
            }
        }
        return
    }

    AuthScaffold {
        Text(
            when (step) {
                0 -> "Your details"
                1 -> if (isParent) "Add your photo" else "Finish your profile"
                else -> "Stay informed"
            },
            fontSize = 30.sp,
            fontWeight = FontWeight.SemiBold,
            color = Ink,
        )
        Spacer(Modifier.height(6.dp))
        Text(
            when (step) {
                0 -> if (isParent) "Add a username and a note of the ID you will use at the gate."
                else "Complete the details your school will recognise."
                1 -> "Required. Gate staff match this face at handover."
                else -> "Used for your weekly summary and pickup alerts."
            },
            color = Mute,
            fontSize = 14.sp,
        )
        Spacer(Modifier.height(8.dp))
        Text(roleLabel(pending?.role.orEmpty()), color = Forest, fontWeight = FontWeight.SemiBold)
        Spacer(Modifier.height(16.dp))
        ErrorBanner(state.error)

        when (step) {
            0 -> {
                SsField(username, { username = it }, "Username")
                if (isParent) {
                    Spacer(Modifier.height(12.dp))
                    SsField(idDoc, { idDoc = it }, "Valid identification", hint = "National ID, driver’s licence, or international passport.")
                }
                if (pending?.role == "teacher") {
                    Spacer(Modifier.height(12.dp))
                    RoleCard(selected = substitute, title = "I am a substitute teacher", hint = "Leave unchecked if you have a main class") {
                        substitute = !substitute
                    }
                    if (!substitute && state.app.classes.isNotEmpty()) {
                        Spacer(Modifier.height(12.dp))
                        Text("Main class", color = Mute, fontSize = 12.sp)
                        Spacer(Modifier.height(6.dp))
                        state.app.classes.forEach { c ->
                            RoleCard(selected = classId == c.id, title = c.name, hint = c.level) { classId = c.id }
                            Spacer(Modifier.height(8.dp))
                        }
                    }
                }
            }
            1 -> if (isParent) {
                Box(
                    Modifier
                        .fillMaxWidth()
                        .height(180.dp)
                        .clip(RoundedCornerShape(24.dp))
                        .background(SoftFill)
                        .clickable { photoAdded = true },
                    contentAlignment = Alignment.Center,
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Box(
                            Modifier.size(72.dp).clip(CircleShape).background(White),
                            contentAlignment = Alignment.Center,
                        ) {
                            Icon(
                                if (photoAdded) Icons.Outlined.CheckCircle else Icons.Outlined.PhotoCamera,
                                contentDescription = null,
                                tint = if (photoAdded) Success else Forest,
                                modifier = Modifier.size(32.dp),
                            )
                        }
                        Spacer(Modifier.height(10.dp))
                        Text(if (photoAdded) "Photo added" else "Add your photo · required", fontWeight = FontWeight.SemiBold)
                        Text("Tap to use a demo photo on this device.", color = Mute, fontSize = 12.sp)
                    }
                }
            } else {
                Text("Teachers and admins skip the parent photo step.", color = Mute, fontSize = 14.sp)
            }
            else -> {
                NotifyRow("Pickup and drop-off alerts", Icons.Outlined.Notifications, alerts) { alerts = it }
                Spacer(Modifier.height(8.dp))
                NotifyRow("Weekly school summary", Icons.Outlined.Add, weekly) { weekly = it }
            }
        }

        Spacer(Modifier.height(24.dp))
        SsButton(
            if (step == 1 && isParent && !photoAdded) "Continue" else "Continue",
            onClick = { if (username.isNotBlank()) step++ },
            enabled = username.isNotBlank() && (step != 1 || !isParent || photoAdded),
        )
        if (step == 1 && isParent) {
            Spacer(Modifier.height(8.dp))
            TextButton(onClick = { step++ }, modifier = Modifier.fillMaxWidth()) {
                Text("Skip for now", color = Mute)
            }
        }
    }
}

@Composable
private fun NotifyRow(label: String, icon: androidx.compose.ui.graphics.vector.ImageVector, on: Boolean, onChange: (Boolean) -> Unit) {
    Row(
        Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(18.dp))
            .background(White)
            .padding(14.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Icon(icon, contentDescription = null, tint = Forest)
        Spacer(Modifier.width(12.dp))
        Text(label, fontWeight = FontWeight.Medium, modifier = Modifier.weight(1f))
        Switch(checked = on, onCheckedChange = onChange, colors = SwitchDefaults.colors(checkedTrackColor = Forest))
    }
}

@Composable
fun SplashScreen() {
    Box(Modifier.fillMaxSize().background(Forest), contentAlignment = Alignment.Center) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Wordmark(light = true)
            Spacer(Modifier.height(24.dp))
            CircularProgressIndicator(color = Gold)
        }
    }
}

@Composable
private fun SocialDialog(
    provider: String,
    mode: String,
    initialEmail: String,
    needPhone: Boolean = false,
    busy: Boolean,
    onClose: () -> Unit,
    onContinue: (name: String, email: String, phone: String) -> Unit,
) {
    var name by remember { mutableStateOf("") }
    var email by remember { mutableStateOf(initialEmail) }
    var phone by remember { mutableStateOf("") }
    AlertDialog(
        onDismissRequest = onClose,
        title = { Text("Continue with ${provider.replaceFirstChar { it.uppercase() }}") },
        text = {
            Column {
                Text("SchoolShield confirms the same details used on the website. Email is optional on sign-up.", color = Mute, fontSize = 13.sp)
                Spacer(Modifier.height(12.dp))
                SsField(name, { name = it }, "Name")
                Spacer(Modifier.height(8.dp))
                SsField(email, { email = it }, "Email" + if (mode == "signup") " (optional)" else "")
                if (needPhone || mode == "signup") {
                    Spacer(Modifier.height(8.dp))
                    SsField(phone, { phone = it }, "Phone", keyboardType = KeyboardType.Phone)
                }
            }
        },
        confirmButton = {
            TextButton(onClick = { onContinue(name, email, phone) }, enabled = !busy) {
                Text(if (busy) "Working…" else "Continue", color = Forest, fontWeight = FontWeight.SemiBold)
            }
        },
        dismissButton = { TextButton(onClick = onClose) { Text("Cancel") } },
        containerColor = White,
        shape = RoundedCornerShape(20.dp),
    )
}
