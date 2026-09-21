package com.schoolshield.mobile.ui.shell

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.schoolshield.mobile.AppViewModel
import com.schoolshield.mobile.Page
import com.schoolshield.mobile.UiState
import com.schoolshield.mobile.data.User
import com.schoolshield.mobile.data.conversationPartners
import com.schoolshield.mobile.data.formatDateTime
import com.schoolshield.mobile.data.messagingTargets
import com.schoolshield.mobile.data.myNotifications
import com.schoolshield.mobile.data.roleLabel
import com.schoolshield.mobile.data.thread
import com.schoolshield.mobile.data.unreadCount
import com.schoolshield.mobile.ui.components.EmptyState
import com.schoolshield.mobile.ui.components.PageHeader
import com.schoolshield.mobile.ui.components.RowChoice
import com.schoolshield.mobile.ui.components.SsButton
import com.schoolshield.mobile.ui.components.SsCard
import com.schoolshield.mobile.ui.components.SsField
import com.schoolshield.mobile.ui.theme.Forest
import com.schoolshield.mobile.ui.theme.Mute

data class TabSpec(val label: String, val page: Page = Page.Tab)

fun tabsFor(role: String) = when (role) {
    "teacher" -> listOf("Class", "Notes", "Chat", "More")
    "admin" -> listOf("Gate", "Delegates", "Chat", "More")
    "super_admin" -> listOf("Centre", "People", "Chat", "More")
    else -> listOf("Home", "Children", "Chat", "More")
}

@Composable
fun MessagesPage(state: UiState, user: User, vm: AppViewModel, threadId: String?) {
    if (threadId != null) {
        ThreadPage(state, user, threadId, vm)
        return
    }
    val partners = (state.app.conversationPartners(user.id) + state.app.messagingTargets(user.role, user.id))
        .distinctBy { it.id }
    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        PageHeader("Inbox", "Messages", "Talk to the other desks that share a child or a gate.")
        if (partners.isEmpty()) EmptyState("No threads yet", "Start a conversation with a teacher, parent, or admin.")
        partners.forEach { other ->
            val last = state.app.thread(user.id, other.id).lastOrNull()
            val unread = state.app.unreadCount(user.id, other.id)
            SsCard(modifier = Modifier.clickable {
                vm.mutate("markThreadRead", mapOf("otherId" to other.id))
                vm.openPage(Page.Thread(other.id))
            }) {
                Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                    Text(other.name, fontWeight = FontWeight.SemiBold)
                    if (unread > 0) Text("$unread new", color = Forest, fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
                }
                Text(last?.body ?: roleLabel(other.role), color = Mute, fontSize = 13.sp, maxLines = 2)
            }
        }
    }
}

@Composable
private fun ThreadPage(state: UiState, user: User, otherId: String, vm: AppViewModel) {
    val other = state.app.users.find { it.id == otherId }
    var body by remember { mutableStateOf("") }
    val messages = state.app.thread(user.id, otherId)
    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
        PageHeader("Thread", other?.name ?: "Message", roleLabel(other?.role.orEmpty()))
        messages.forEach { m ->
            val mine = m.fromId == user.id
            SsCard(color = if (mine) Forest.copy(alpha = 0.08f) else androidx.compose.ui.graphics.Color.White) {
                Text(m.body)
                Text(formatDateTime(m.createdAt), color = Mute, fontSize = 11.sp)
            }
        }
        SsField(body, { body = it }, "Message", singleLine = false)
        SsButton("Send", onClick = {
            if (body.isBlank()) return@SsButton
            vm.mutate(
                "sendMessage",
                mapOf("fromId" to user.id, "toId" to otherId, "body" to body.trim()),
            )
            body = ""
        })
    }
}

@Composable
fun MorePage(state: UiState, user: User, vm: AppViewModel) {
    val notes = state.app.myNotifications(user.id).take(8)
    Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
        PageHeader(roleLabel(user.role), user.name, user.email.ifBlank { user.phone })
        notes.forEach { n ->
            SsCard { Text(n.title, fontWeight = FontWeight.SemiBold); Text(n.body, color = Mute, fontSize = 13.sp) }
        }
        when (user.role) {
            "parent" -> {
                LinkRow("Pickup & drop-off") { vm.openPage(Page.Codes) }
                LinkRow("Attendance") { vm.openPage(Page.Attendance) }
                LinkRow("Saved handlers") { vm.openPage(Page.Delegates) }
                LinkRow("Incidents") { vm.openPage(Page.Incidents) }
                LinkRow("Daily notes") { vm.openPage(Page.Activities) }
                LinkRow("School updates") { vm.openPage(Page.Updates) }
                LinkRow("Reviews") { vm.openPage(Page.Reviews) }
            }
            "teacher" -> {
                LinkRow("Incidents") { vm.openPage(Page.Incidents) }
                LinkRow("Substitute cover") { vm.openPage(Page.Substitute) }
                LinkRow("School updates") { vm.openPage(Page.Updates) }
            }
            "admin" -> {
                LinkRow("Verification log") { vm.openPage(Page.Log) }
                LinkRow("Incidents") { vm.openPage(Page.Incidents) }
                LinkRow("School updates") { vm.openPage(Page.Updates) }
            }
            else -> {
                LinkRow("Attendance") { vm.openPage(Page.Attendance) }
                LinkRow("Incidents") { vm.openPage(Page.Incidents) }
                LinkRow("School updates") { vm.openPage(Page.Updates) }
                LinkRow("Reviews") { vm.openPage(Page.Reviews) }
            }
        }
        LinkRow("Profile") { vm.openPage(Page.Profile) }
        LinkRow("Server & settings") { vm.openPage(Page.Settings) }
        SsButton("Sign out", onClick = { vm.logout() })
    }
}

@Composable
private fun LinkRow(label: String, onClick: () -> Unit) {
    SsCard(modifier = Modifier.clickable(onClick = onClick)) {
        Text(label, fontWeight = FontWeight.SemiBold, color = Forest)
    }
}

@Composable
fun ProfilePage(state: UiState, user: User, vm: AppViewModel) {
    var name by remember { mutableStateOf(user.name) }
    var phone by remember { mutableStateOf(user.phone) }
    var username by remember { mutableStateOf(user.username) }
    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        PageHeader("Account", "Profile", "These details are shared with the school desk.")
        SsField(name, { name = it }, "Name")
        SsField(phone, { phone = it }, "Phone")
        SsField(username, { username = it }, "Username")
        SsButton("Save profile", onClick = {
            vm.mutate("updateProfile", mapOf("patch" to mapOf("name" to name, "phone" to phone, "username" to username)))
        })
    }
}

@Composable
fun SettingsPage(state: UiState, vm: AppViewModel) {
    var url by remember { mutableStateOf(state.apiBase) }
    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        PageHeader("Connection", "Server", "The app uses the same SchoolShield API as the website.")
        SsField(url, { url = it }, "API base URL", hint = "Production is https://school-shield.vercel.app. On an emulator, local Next.js is http://10.0.2.2:3000")
        SsButton("Save server", onClick = { vm.saveApiBase(url) })
        SsCard {
            Text("Demo desks", fontWeight = FontWeight.SemiBold, fontFamily = FontFamily.Serif, fontSize = 18.sp)
            Spacer(Modifier.height(6.dp))
            Text("ada@ / folake@ / tunde@ / ngozi@greenfield.school", color = Mute, fontSize = 13.sp)
            Text("Password SchoolShield1 · OTP 000000", color = Mute, fontSize = 13.sp)
        }
    }
}

@Composable
fun ActivitiesForParent(state: UiState, user: User) {
    val kids = state.app.students.filter { user.id in it.parentIds }.map { it.id }.toSet()
    val notes = state.app.activities.filter { it.studentId in kids }
    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        PageHeader("Day", "Activities", "Notes posted by the class teacher.")
        if (notes.isEmpty()) EmptyState("No notes yet", "Teachers post daily activities here.")
        notes.forEach { a ->
            val s = state.app.students.find { it.id == a.studentId }
            SsCard {
                Text("${s?.fullName} · ${a.title}", fontWeight = FontWeight.SemiBold)
                Text(a.notes, color = Mute, fontSize = 13.sp)
                Text("${a.mood} · ${a.date}", color = Mute, fontSize = 12.sp)
            }
        }
    }
}
