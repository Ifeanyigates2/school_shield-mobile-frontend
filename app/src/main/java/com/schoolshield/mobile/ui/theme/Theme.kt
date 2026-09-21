package com.schoolshield.mobile.ui.theme

import androidx.compose.material3.ColorScheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Typography
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp

/** Navy / canvas tokens from the School Shield Figma Guardian App. */
val Forest = Color(0xFF0B1F3D)
val ForestDeep = Color(0xFF071529)
val Navy = Forest
val NavyDeep = ForestDeep
val Gold = Color(0xFFF5A524)
val GoldDeep = Color(0xFFD48912)
val Cream = Color(0xFFF3F5F9)
val Canvas = Cream
val Ink = Color(0xFF0B1F3D)
val Mute = Color(0xFF6B7285)
val Line = Color(0xFFE6E9F0)
val Success = Color(0xFF1F9D5C)
val Danger = Color(0xFFE24B4A)
val White = Color(0xFFFFFFFF)
val SoftFill = Color(0xFFF7F8FB)

private val Colors: ColorScheme = lightColorScheme(
    primary = Forest,
    onPrimary = White,
    primaryContainer = ForestDeep,
    onPrimaryContainer = Gold,
    secondary = Gold,
    onSecondary = ForestDeep,
    secondaryContainer = Color(0xFFFFE8C2),
    background = Cream,
    onBackground = Ink,
    surface = White,
    onSurface = Ink,
    surfaceVariant = SoftFill,
    onSurfaceVariant = Mute,
    outline = Line,
    error = Danger,
    onError = White,
)

private val Type = Typography(
    displaySmall = TextStyle(
        fontFamily = FontFamily.SansSerif,
        fontWeight = FontWeight.SemiBold,
        fontSize = 28.sp,
        lineHeight = 34.sp,
    ),
    headlineMedium = TextStyle(
        fontFamily = FontFamily.SansSerif,
        fontWeight = FontWeight.SemiBold,
        fontSize = 24.sp,
        lineHeight = 30.sp,
    ),
    titleLarge = TextStyle(
        fontFamily = FontFamily.SansSerif,
        fontWeight = FontWeight.SemiBold,
        fontSize = 18.sp,
    ),
    bodyLarge = TextStyle(
        fontFamily = FontFamily.SansSerif,
        fontSize = 16.sp,
    ),
    bodyMedium = TextStyle(
        fontFamily = FontFamily.SansSerif,
        fontSize = 14.sp,
    ),
    labelSmall = TextStyle(
        fontFamily = FontFamily.SansSerif,
        fontWeight = FontWeight.SemiBold,
        fontSize = 11.sp,
        letterSpacing = 1.1.sp,
    ),
)

@Composable
fun SchoolShieldTheme(content: @Composable () -> Unit) {
    MaterialTheme(colorScheme = Colors, typography = Type, content = content)
}
