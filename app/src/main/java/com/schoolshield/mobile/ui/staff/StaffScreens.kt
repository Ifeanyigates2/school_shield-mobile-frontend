package com.schoolshield.mobile.ui.staff

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
import com.schoolshield.mobile.UiState
import com.schoolshield.mobile.data.User
import com.schoolshield.mobile.data.attendanceRate
import com.schoolshield.mobile.data.coveringClasses
import com.schoolshield.mobile.data.formatDateTime
import com.schoolshield.mobile.data.rosterForTeacher
import com.schoolshield.mobile.data.todayAttendance
import com.schoolshield.mobile.data.todayISO
import com.schoolshield.mobile.ui.components.Badge
import com.schoolshield.mobile.ui.components.EmptyState
import com.schoolshield.mobile.ui.components.PageHeader
import com.schoolshield.mobile.ui.components.RowChoice
import com.schoolshield.mobile.ui.components.SsButton
import com.schoolshield.mobile.ui.components.SsCard
import com.schoolshield.mobile.ui.components.SsField
import com.schoolshield.mobile.ui.parent.Stat as ParentStat
import com.schoolshield.mobile.ui.theme.Cream
import com.schoolshield.mobile.ui.theme.Forest
import com.schoolshield.mobile.ui.theme.Ink
import com.schoolshield.mobile.ui.theme.Mute

@Composable
fun TeacherHome(state: UiState, user: User, vm: AppViewModel) {
    val roster = state.app.rosterForTeacher(user.id)
    val classes = state.app.coveringClasses(user.id)
    val present = roster.count {
        val a = state.app.todayAttendance(it.id)
        a != null && a.status != "absent"
    }
    val covering = classes.filter { it.substituteTeacherId == user.id && it.teacherId != user.id }
    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        PageHeader(
            "Teacher desk",
            "${user.name.split(" ").first()}’s class",
            "The register fills from verified drop-offs. Send late alerts if children are missing.",
        )
        if (covering.isNotEmpty()) {
            SsCard(color = Cream) { Text("You are covering ${covering.joinToString { it.name }} as substitute today.") }
        }
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            ParentStat("On roll", roster.size.toString(), classes.joinToString { it.name }.ifBlank { "No class" }, Modifier.weight(1f))
            ParentStat("In today", present.toString(), todayISO(), Modifier.weight(1f))
            ParentStat("Not in", (roster.size - present).toString(), modifier = Modifier.weight(1f))
        }
        SsButton("Send 10 AM drop-off alerts", onClick = { vm.mutate("sendLateAlerts", mapOf("kind" to "late_dropoff")) })
        SsButton("Send late pick-up alerts", onClick = { vm.mutate("sendLateAlerts", mapOf("kind" to "late_pickup")) })
        roster.forEach { s ->
            val a = state.app.todayAttendance(s.id)
            SsCard {
                Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                    Column {
                        Text(s.fullName, fontWeight = FontWeight.SemiBold)
                        Text(s.pickupType.replace('_', ' '), color = Mute, fontSize = 12.sp)
                    }
                    Badge(a?.status?.replace('_', ' ') ?: "absent", if (a != null && a.status != "absent") "success" else "danger")
                }
            }
        }
    }
}

@Composable
fun TeacherActivities(state: UiState, user: User, vm: AppViewModel) {
    val roster = state.app.rosterForTeacher(user.id)
    val notes = state.app.activities.filter { it.teacherId == user.id }.take(20)
    var studentId by remember { mutableStateOf(roster.firstOrNull()?.id.orEmpty()) }
    var title by remember { mutableStateOf("") }
    var notesText by remember { mutableStateOf("") }
    var mood by remember { mutableStateOf("good") }
    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        PageHeader("Daily notes", "Activities", "Parents see these on their child’s day.")
        notes.forEach { a ->
            val s = state.app.students.find { it.id == a.studentId }
            SsCard {
                Text(s?.fullName ?: "Student", fontWeight = FontWeight.SemiBold)
                Text("${a.title} · ${a.mood} · ${a.date}", color = Mute, fontSize = 13.sp)
                Text(a.notes, fontSize = 13.sp)
            }
        }
        SsCard {
            Text("Post a note", fontWeight = FontWeight.SemiBold, fontFamily = FontFamily.Serif, fontSize = 18.sp)
            Spacer(Modifier.height(8.dp))
            RowChoice(roster.map { it.id to it.fullName }, studentId) { studentId = it }
            Spacer(Modifier.height(8.dp))
            SsField(title, { title = it }, "Title")
            Spacer(Modifier.height(8.dp))
            SsField(notesText, { notesText = it }, "Notes", singleLine = false)
            Spacer(Modifier.height(8.dp))
            RowChoice(listOf("great" to "Great", "good" to "Good", "okay" to "Okay", "needs_support" to "Needs support"), mood) { mood = it }
            Spacer(Modifier.height(8.dp))
            SsButton("Post activity", onClick = {
                if (studentId.isBlank() || title.isBlank()) return@SsButton
                vm.mutate(
                    "addActivity",
                    mapOf(
                        "studentId" to studentId,
                        "teacherId" to user.id,
                        "date" to todayISO(),
                        "title" to title.trim(),
                        "notes" to notesText.trim(),
                        "mood" to mood,
                    ),
                )
                title = ""; notesText = ""
            })
        }
    }
}

@Composable
fun AdminHome(state: UiState, user: User, vm: AppViewModel) {
    var digits by remember { mutableStateOf("") }
    val live = state.app.codes.filter { it.status == "active" }
    val preview = state.app.codes.find { it.code == digits && it.status == "active" }
    val student = state.app.students.find { it.id == preview?.studentId }
    val parent = state.app.users.find { it.id == preview?.parentId }
    val delegate = state.app.pickupPeople.find { it.id == preview?.pickupPersonId }
    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        PageHeader(
            user.title ?: "School / bus admin",
            "Authenticate drop-off & pick-up",
            "Receive the parent’s code, confirm the child, then the teacher register updates.",
        )
        SsCard {
            Text("GATE / BUS DESK", color = Forest, fontSize = 11.sp, fontWeight = FontWeight.SemiBold, letterSpacing = 1.4.sp)
            Text("Enter parent code", fontSize = 22.sp, fontWeight = FontWeight.SemiBold, fontFamily = FontFamily.Serif)
            Text(
                digits.padEnd(6, '·').toCharArray().joinToString(" "),
                fontSize = 32.sp,
                fontFamily = FontFamily.Serif,
                color = Ink,
                modifier = Modifier.fillMaxWidth().padding(vertical = 12.dp),
            )
            val keys = listOf("1", "2", "3", "4", "5", "6", "7", "8", "9", "C", "0", "✓")
            keys.chunked(3).forEach { row ->
                Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    row.forEach { n ->
                        Text(
                            n,
                            fontWeight = FontWeight.SemiBold,
                            fontSize = 18.sp,
                            modifier = Modifier
                                .weight(1f)
                                .clickable {
                                    when (n) {
                                        "C" -> digits = ""
                                        "✓" -> if (digits.length == 6) vm.mutate("verifyGateCode", mapOf("code" to digits, "adminId" to user.id))
                                        else -> if (digits.length < 6) digits += n
                                    }
                                }
                                .padding(vertical = 14.dp),
                            color = Forest,
                        )
                    }
                }
            }
        }
        SsCard {
            Text("Code preview", fontWeight = FontWeight.SemiBold)
            if (student == null) Text("Enter all 6 digits to preview the student before confirming.", color = Mute, fontSize = 13.sp)
            else {
                Text(student.fullName, fontSize = 18.sp, fontWeight = FontWeight.SemiBold)
                Text(preview?.kind?.replace("dropoff", "drop-off") ?: "", color = Mute)
                Text("Authorising parent: ${parent?.name}", fontSize = 13.sp)
                if (delegate != null) Text("Delegate: ${delegate.name} (${delegate.relationship}) · ${delegate.status}", fontSize = 13.sp)
            }
        }
        Text("Live codes", fontSize = 20.sp, fontWeight = FontWeight.SemiBold, fontFamily = FontFamily.Serif)
        if (live.isEmpty()) EmptyState("No active codes", "They appear when a parent generates one.")
        live.forEach { c ->
            val s = state.app.students.find { it.id == c.studentId }
            SsCard {
                Text(c.code, fontFamily = FontFamily.Monospace, fontSize = 20.sp, fontWeight = FontWeight.Bold)
                Text("${s?.fullName ?: ""} · ${c.kind}", color = Mute, fontSize = 13.sp)
            }
        }
    }
}

@Composable
fun AdminDelegates(state: UiState, vm: AppViewModel) {
    val pending = state.app.pickupPeople
    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        PageHeader("Approvals", "Designated pick-ups", "Approve a photo-verified adult before they can collect a child.")
        if (pending.isEmpty()) EmptyState("No delegates", "Parents submit designated pick-ups from their desk.")
        pending.forEach { p ->
            val parent = state.app.users.find { it.id == p.parentId }
            SsCard {
                Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                    Column {
                        Text(p.name, fontWeight = FontWeight.SemiBold)
                        Text("${p.relationship} · ${p.phone}", color = Mute, fontSize = 13.sp)
                        Text("Parent: ${parent?.name}", color = Mute, fontSize = 12.sp)
                    }
                    Badge(p.status, if (p.status == "approved") "success" else if (p.status == "rejected") "danger" else "warn")
                }
                if (p.status == "pending") {
                    Spacer(Modifier.height(8.dp))
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        SsButton("Approve", onClick = { vm.mutate("reviewPickupPerson", mapOf("id" to p.id, "status" to "approved")) }, modifier = Modifier.weight(1f))
                        SsButton("Decline", onClick = { vm.mutate("reviewPickupPerson", mapOf("id" to p.id, "status" to "rejected")) }, modifier = Modifier.weight(1f))
                    }
                }
            }
        }
    }
}

@Composable
fun AdminLog(state: UiState) {
    val used = state.app.codes.filter { it.status == "used" }.take(30)
    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        PageHeader("Gate log", "Verified handovers", "Every used code is a proof of drop-off or pick-up.")
        if (used.isEmpty()) EmptyState("No verifications yet", "Verified codes will list here.")
        used.forEach { c ->
            val s = state.app.students.find { it.id == c.studentId }
            SsCard {
                Text(s?.fullName ?: "Student", fontWeight = FontWeight.SemiBold)
                Text("${c.kind} · ${c.code} · ${c.usedAt?.let { formatDateTime(it) } ?: ""}", color = Mute, fontSize = 13.sp)
            }
        }
    }
}

@Composable
fun SuperHome(state: UiState) {
    val rate = attendanceRate(state.app.attendance)
    val open = state.app.incidents.count { it.status != "resolved" }
    val pending = state.app.pickupPeople.count { it.status == "pending" }
    val bus = state.app.students.count { it.pickupType == "school_bus" }
    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        PageHeader(
            "School super admin",
            "Command centre",
            "${state.app.schoolName}, ${state.app.schoolLocation}. Attendance, incidents, and gate proof in one view.",
        )
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            ParentStat("Attendance", "$rate%", modifier = Modifier.weight(1f))
            ParentStat("Open", open.toString(), "incidents", Modifier.weight(1f))
        }
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            ParentStat("Delegates", pending.toString(), "pending", Modifier.weight(1f))
            ParentStat("Bus riders", bus.toString(), "of ${state.app.students.size}", Modifier.weight(1f))
        }
        Text("Attendance by class", fontSize = 20.sp, fontWeight = FontWeight.SemiBold, fontFamily = FontFamily.Serif)
        state.app.classes.forEach { c ->
            val roster = state.app.students.filter { it.classId == c.id }
            val recs = state.app.attendance.filter { a -> roster.any { it.id == a.studentId } }
            val r = attendanceRate(recs)
            SsCard {
                Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                    Text("${c.name} (${roster.size})", fontWeight = FontWeight.SemiBold)
                    Text("$r%")
                }
            }
        }
        Text("Needs attention", fontSize = 20.sp, fontWeight = FontWeight.SemiBold, fontFamily = FontFamily.Serif)
        state.app.incidents.filter { it.status != "resolved" }.forEach { i ->
            val s = state.app.students.find { it.id == i.studentId }
            SsCard {
                Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                    Column(Modifier.weight(1f)) {
                        Text(s?.fullName ?: "", fontWeight = FontWeight.SemiBold)
                        Text(i.description, color = Mute, fontSize = 13.sp, maxLines = 2)
                    }
                    Badge(i.status.replace('_', ' '), if (i.status == "open") "danger" else "warn")
                }
            }
        }
    }
}

@Composable
fun SuperUsers(state: UiState) {
    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        PageHeader("Directory", "People", "Everyone with a SchoolShield desk at ${state.app.schoolName}.")
        state.app.users.forEach { u ->
            SsCard {
                Text(u.name, fontWeight = FontWeight.SemiBold)
                Text("${u.role.replace('_', ' ')} · ${u.phone}", color = Mute, fontSize = 13.sp)
                if (u.email.isNotBlank()) Text(u.email, color = Mute, fontSize = 12.sp)
            }
        }
    }
}

@Composable
fun SuperAttendance(state: UiState) {
    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        PageHeader("School", "Attendance", "Sample of verified in / out records.")
        state.app.attendance.take(40).forEach { a ->
            val s = state.app.students.find { it.id == a.studentId }
            SsCard {
                Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                    Column {
                        Text(s?.fullName ?: "Student", fontWeight = FontWeight.SemiBold)
                        Text("${a.date} · ${a.method.replace('_', ' ')}", color = Mute, fontSize = 12.sp)
                    }
                    Badge(a.status.replace('_', ' '), if (a.status == "absent") "danger" else "success")
                }
            }
        }
    }
}

@Composable
fun SubstitutePage(state: UiState, user: User, vm: AppViewModel) {
    val mine = state.app.classes.filter { it.teacherId == user.id }
    val subs = state.app.users.filter { it.role == "teacher" && it.isSubstitute == true }
    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        PageHeader("Cover", "Substitute", "Assign another teacher to cover your class.")
        mine.forEach { c ->
            SsCard {
                Text(c.name, fontWeight = FontWeight.SemiBold)
                Text("Current cover: ${state.app.users.find { it.id == c.substituteTeacherId }?.name ?: "None"}", color = Mute, fontSize = 13.sp)
                Spacer(Modifier.height(8.dp))
                subs.forEach { t ->
                    SsButton("Assign ${t.name}", onClick = {
                        vm.mutate("assignSubstitute", mapOf("classId" to c.id, "substituteTeacherId" to t.id))
                    })
                    Spacer(Modifier.height(6.dp))
                }
                SsButton("Clear substitute", onClick = { vm.mutate("assignSubstitute", mapOf("classId" to c.id)) })
            }
        }
    }
}

@Composable
fun UpdatesPage(state: UiState, user: User, vm: AppViewModel) {
    val list = state.app.updates
    var title by remember { mutableStateOf("") }
    var body by remember { mutableStateOf("") }
    var audience by remember { mutableStateOf("all") }
    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        PageHeader("Notices", "School updates", "Parents and teachers see posts for their audience.")
        list.forEach { u ->
            SsCard {
                Text(u.title, fontWeight = FontWeight.SemiBold)
                Text(u.body, color = Mute, fontSize = 13.sp)
                Text("${u.audience} · ${formatDateTime(u.createdAt)}", color = Mute, fontSize = 12.sp)
            }
        }
        if (user.role == "super_admin" || user.role == "admin") {
            SsCard {
                Text("Publish an update", fontWeight = FontWeight.SemiBold, fontFamily = FontFamily.Serif, fontSize = 18.sp)
                Spacer(Modifier.height(8.dp))
                SsField(title, { title = it }, "Title")
                Spacer(Modifier.height(8.dp))
                SsField(body, { body = it }, "Body", singleLine = false)
                Spacer(Modifier.height(8.dp))
                RowChoice(listOf("all" to "All", "parents" to "Parents", "teachers" to "Teachers"), audience) { audience = it }
                Spacer(Modifier.height(8.dp))
                SsButton("Publish", onClick = {
                    if (title.isBlank()) return@SsButton
                    vm.mutate("postUpdate", mapOf("title" to title.trim(), "body" to body.trim(), "audience" to audience))
                    title = ""; body = ""
                })
            }
        }
    }
}

@Composable
fun ReviewsPage(state: UiState, user: User, vm: AppViewModel) {
    var rating by remember { mutableStateOf(5) }
    var comment by remember { mutableStateOf("") }
    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        PageHeader("Feedback", "Reviews", "Rate the school so super admin can see parent sentiment.")
        state.app.reviews.take(20).forEach { r ->
            val p = state.app.users.find { it.id == r.parentId }
            SsCard {
                Text("${p?.name ?: "Parent"} · ${r.rating}/5", fontWeight = FontWeight.SemiBold)
                Text(r.comment, color = Mute, fontSize = 13.sp)
            }
        }
        if (user.role == "parent") {
            SsCard {
                Text("Leave a review", fontWeight = FontWeight.SemiBold)
                Spacer(Modifier.height(8.dp))
                RowChoice((1..5).map { it.toString() to "$it" }, rating.toString()) { rating = it.toInt() }
                Spacer(Modifier.height(8.dp))
                SsField(comment, { comment = it }, "Comment", singleLine = false)
                Spacer(Modifier.height(8.dp))
                SsButton("Send review", onClick = {
                    vm.mutate(
                        "addReview",
                        mapOf("parentId" to user.id, "target" to "school", "rating" to rating, "comment" to comment.trim()),
                    )
                    comment = ""
                })
            }
        }
    }
}
