package com.schoolshield.mobile.ui.components

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Shield
import androidx.compose.material.icons.outlined.Visibility
import androidx.compose.material.icons.outlined.VisibilityOff
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.schoolshield.mobile.ui.theme.Cream
import com.schoolshield.mobile.ui.theme.Danger
import com.schoolshield.mobile.ui.theme.Forest
import com.schoolshield.mobile.ui.theme.ForestDeep
import com.schoolshield.mobile.ui.theme.Gold
import com.schoolshield.mobile.ui.theme.Ink
import com.schoolshield.mobile.ui.theme.Line
import com.schoolshield.mobile.ui.theme.Mute
import com.schoolshield.mobile.ui.theme.SoftFill
import com.schoolshield.mobile.ui.theme.Success
import com.schoolshield.mobile.ui.theme.White

val CardShape = RoundedCornerShape(24.dp)
val ButtonShape = RoundedCornerShape(28.dp)
val FieldShape = RoundedCornerShape(18.dp)

@Composable
fun Wordmark(light: Boolean = false, compact: Boolean = false) {
    Row(verticalAlignment = Alignment.CenterVertically) {
        Box(
            modifier = Modifier
                .size(if (compact) 36.dp else 40.dp)
                .clip(RoundedCornerShape(10.dp))
                .background(if (light) White.copy(alpha = 0.12f) else Forest),
            contentAlignment = Alignment.Center,
        ) {
            Icon(
                Icons.Outlined.Shield,
                contentDescription = null,
                tint = if (light) White else Gold,
                modifier = Modifier.size(if (compact) 18.dp else 22.dp),
            )
        }
        Spacer(Modifier.width(10.dp))
        Column {
            Text("SchoolShield", color = if (light) White else Ink, fontWeight = FontWeight.SemiBold, fontSize = 18.sp)
            if (!compact) {
                Text(
                    "EVERY CHILD ACCOUNTED FOR",
                    color = if (light) White.copy(alpha = 0.7f) else Mute,
                    fontSize = 10.sp,
                    fontWeight = FontWeight.Medium,
                    letterSpacing = 1.1.sp,
                )
            }
        }
    }
}

@Composable
fun InitialsAvatar(
    name: String,
    modifier: Modifier = Modifier,
    size: Dp = 48.dp,
    hue: Int? = null,
) {
    val initials = name.split(" ").filter { it.isNotBlank() }.take(2).joinToString("") { it.first().uppercase() }
        .ifBlank { "?" }
    val bg = avatarColor(hue ?: (name.hashCode() and 0xFF))
    Box(
        modifier = modifier
            .size(size)
            .clip(CircleShape)
            .background(bg),
        contentAlignment = Alignment.Center,
    ) {
        Text(initials, color = White, fontWeight = FontWeight.SemiBold, fontSize = (size.value * 0.34f).sp)
    }
}

fun avatarColor(seed: Int): Color {
    val palette = listOf(
        Color(0xFF0B1F3D),
        Color(0xFF1F6B5A),
        Color(0xFFC45C26),
        Color(0xFF3D5A80),
        Color(0xFF8B5E3C),
        Color(0xFF5C4D7D),
    )
    return palette[kotlin.math.abs(seed) % palette.size]
}

@Composable
fun SsCard(
    modifier: Modifier = Modifier,
    color: Color = White,
    content: @Composable ColumnScope.() -> Unit,
) {
    Column(
        modifier = modifier
            .fillMaxWidth()
            .clip(CardShape)
            .background(color)
            .padding(16.dp),
        content = content,
    )
}

@Composable
fun SsButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    gold: Boolean = false,
    enabled: Boolean = true,
    busy: Boolean = false,
    outline: Boolean = false,
    inverted: Boolean = false,
) {
    val labelColor = when {
        inverted -> Forest
        gold -> ForestDeep
        outline -> Forest
        else -> White
    }
    Button(
        onClick = onClick,
        enabled = enabled && !busy,
        modifier = modifier.fillMaxWidth().height(54.dp),
        shape = RoundedCornerShape(16.dp),
        colors = when {
            inverted -> ButtonDefaults.buttonColors(containerColor = White, contentColor = Forest)
            outline -> ButtonDefaults.outlinedButtonColors(contentColor = Forest)
            gold -> ButtonDefaults.buttonColors(containerColor = Gold, contentColor = ForestDeep)
            else -> ButtonDefaults.buttonColors(containerColor = Forest, contentColor = White)
        },
        border = if (outline) BorderStroke(1.dp, Line) else null,
        elevation = ButtonDefaults.buttonElevation(defaultElevation = 0.dp),
    ) {
        if (busy) CircularProgressIndicator(Modifier.size(18.dp), color = labelColor, strokeWidth = 2.dp)
        else Text(text, fontWeight = FontWeight.SemiBold, fontSize = 16.sp, color = labelColor)
    }
}

@Composable
fun SsField(
    value: String,
    onValueChange: (String) -> Unit,
    label: String,
    modifier: Modifier = Modifier,
    hint: String? = null,
    password: Boolean = false,
    keyboardType: KeyboardType = KeyboardType.Text,
    singleLine: Boolean = true,
) {
    var visible by remember { mutableStateOf(false) }
    Column(modifier) {
        Text(label, color = Mute, fontSize = 13.sp, fontWeight = FontWeight.Medium)
        Spacer(Modifier.height(8.dp))
        OutlinedTextField(
            value = value,
            onValueChange = onValueChange,
            modifier = Modifier.fillMaxWidth(),
            singleLine = singleLine,
            visualTransformation = if (password && !visible) PasswordVisualTransformation() else VisualTransformation.None,
            keyboardOptions = KeyboardOptions(keyboardType = if (password) KeyboardType.Password else keyboardType),
            trailingIcon = if (password) {
                {
                    IconButton(onClick = { visible = !visible }) {
                        Icon(
                            if (visible) Icons.Outlined.VisibilityOff else Icons.Outlined.Visibility,
                            contentDescription = if (visible) "Hide password" else "Show password",
                            tint = Mute,
                        )
                    }
                }
            } else null,
            shape = FieldShape,
            colors = OutlinedTextFieldDefaults.colors(
                focusedBorderColor = Forest,
                unfocusedBorderColor = Color.Transparent,
                focusedContainerColor = White,
                unfocusedContainerColor = SoftFill,
            ),
        )
        if (hint != null) {
            Spacer(Modifier.height(4.dp))
            Text(hint, color = Mute, fontSize = 12.sp)
        }
    }
}

@Composable
fun Badge(text: String, tone: String = "neutral") {
    val (bg, fg) = when (tone) {
        "success" -> Success.copy(alpha = 0.14f) to Success
        "warn" -> Gold.copy(alpha = 0.22f) to GoldDeep
        "danger" -> Danger.copy(alpha = 0.12f) to Danger
        "info" -> Forest.copy(alpha = 0.10f) to Forest
        else -> SoftFill to Mute
    }
    Text(
        text,
        color = fg,
        fontSize = 11.sp,
        fontWeight = FontWeight.SemiBold,
        modifier = Modifier
            .clip(RoundedCornerShape(999.dp))
            .background(bg)
            .padding(horizontal = 10.dp, vertical = 4.dp),
    )
}

private val GoldDeep = Color(0xFFD48912)

@Composable
fun Stat(label: String, value: String, hint: String? = null) {
    SsCard {
        Text(label.uppercase(), color = Mute, fontSize = 11.sp, fontWeight = FontWeight.SemiBold, letterSpacing = 1.sp)
        Text(value, color = Ink, fontSize = 24.sp, fontWeight = FontWeight.SemiBold)
        if (hint != null) Text(hint, color = Mute, fontSize = 12.sp)
    }
}

@Composable
fun PageHeader(eyebrow: String, title: String, body: String) {
    Column(Modifier.padding(bottom = 12.dp)) {
        if (eyebrow.isNotBlank()) {
            Text(eyebrow.uppercase(), color = Mute, fontSize = 11.sp, fontWeight = FontWeight.SemiBold, letterSpacing = 1.2.sp)
            Spacer(Modifier.height(6.dp))
        }
        Text(title, color = Ink, fontSize = 26.sp, fontWeight = FontWeight.SemiBold)
        if (body.isNotBlank()) {
            Spacer(Modifier.height(6.dp))
            Text(body, color = Mute, fontSize = 14.sp, lineHeight = 20.sp)
        }
    }
}

@Composable
fun ErrorBanner(message: String?) {
    if (message.isNullOrBlank()) return
    Text(
        message,
        color = Danger,
        fontSize = 13.sp,
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(16.dp))
            .background(Danger.copy(alpha = 0.1f))
            .padding(12.dp),
    )
    Spacer(Modifier.height(12.dp))
}

@Composable
fun RoleCard(selected: Boolean, title: String, hint: String, onClick: () -> Unit) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(18.dp))
            .border(1.5.dp, if (selected) Forest else Line, RoundedCornerShape(18.dp))
            .background(if (selected) Forest.copy(alpha = 0.06f) else White)
            .clickable(onClick = onClick)
            .padding(14.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Box(
            Modifier
                .size(18.dp)
                .clip(CircleShape)
                .border(2.dp, if (selected) Forest else Line, CircleShape)
                .background(if (selected) Forest else Color.Transparent),
        )
        Spacer(Modifier.width(12.dp))
        Column {
            Text(title, fontWeight = FontWeight.SemiBold, color = Ink)
            Text(hint, color = Mute, fontSize = 12.sp)
        }
    }
}

@Composable
fun SocialButton(label: String, onClick: () -> Unit) {
    TextButton(
        onClick = onClick,
        modifier = Modifier
            .fillMaxWidth()
            .height(50.dp)
            .border(1.dp, Line, RoundedCornerShape(18.dp)),
        shape = RoundedCornerShape(18.dp),
        colors = ButtonDefaults.textButtonColors(contentColor = Ink),
    ) { Text(label, fontWeight = FontWeight.SemiBold) }
}

@Composable
fun EmptyState(title: String, body: String) {
    SsCard(color = SoftFill) {
        Text(title, fontWeight = FontWeight.SemiBold)
        Text(body, color = Mute, fontSize = 13.sp)
    }
}

@Composable
fun RowChoice(items: List<Pair<String, String>>, selected: String, onSelect: (String) -> Unit) {
    Row(horizontalArrangement = Arrangement.spacedBy(8.dp), modifier = Modifier.fillMaxWidth()) {
        items.forEach { (value, label) ->
            val on = selected == value
            Text(
                label,
                color = if (on) White else Ink,
                fontSize = 13.sp,
                fontWeight = FontWeight.SemiBold,
                modifier = Modifier
                    .clip(RoundedCornerShape(999.dp))
                    .background(if (on) Forest else SoftFill)
                    .clickable { onSelect(value) }
                    .padding(horizontal = 14.dp, vertical = 8.dp),
            )
        }
    }
}

@Composable
fun HandlerRow(
    name: String,
    subtitle: String,
    selected: Boolean,
    onClick: () -> Unit,
    trailing: @Composable (() -> Unit)? = null,
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(18.dp))
            .background(if (selected) Forest.copy(alpha = 0.06f) else SoftFill)
            .clickable(onClick = onClick)
            .padding(12.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        InitialsAvatar(name, size = 44.dp)
        Spacer(Modifier.width(12.dp))
        Column(Modifier.weight(1f)) {
            Text(name, fontWeight = FontWeight.SemiBold)
            Text(subtitle, color = Mute, fontSize = 12.sp)
        }
        trailing?.invoke() ?: Box(
            Modifier
                .size(20.dp)
                .clip(CircleShape)
                .border(2.dp, if (selected) Forest else Line, CircleShape)
                .background(if (selected) Forest else Color.Transparent),
        )
    }
}

@Composable
fun IconCircle(icon: ImageVector, tint: Color = Forest, bg: Color = SoftFill) {
    Box(
        Modifier
            .size(44.dp)
            .clip(CircleShape)
            .background(bg),
        contentAlignment = Alignment.Center,
    ) {
        Icon(icon, contentDescription = null, tint = tint)
    }
}
