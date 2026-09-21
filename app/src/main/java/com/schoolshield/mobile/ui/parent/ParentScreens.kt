package com.schoolshield.mobile.ui.parent

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.CheckCircle
import androidx.compose.material.icons.outlined.QrCode2
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.schoolshield.mobile.AppViewModel
import com.schoolshield.mobile.Page
import com.schoolshield.mobile.UiState
import com.schoolshield.mobile.data.AppState
import com.schoolshield.mobile.data.User
import com.schoolshield.mobile.data.childrenOf
import com.schoolshield.mobile.data.classById
import com.schoolshield.mobile.data.formatDateTime
import com.schoolshield.mobile.data.formatTime
import com.schoolshield.mobile.data.teacherOf
import com.schoolshield.mobile.data.todayAttendance
import com.schoolshield.mobile.data.todayISO
import com.schoolshield.mobile.ui.components.Badge
import com.schoolshield.mobile.ui.components.EmptyState
import com.schoolshield.mobile.ui.components.HandlerRow
import com.schoolshield.mobile.ui.components.InitialsAvatar
import com.schoolshield.mobile.ui.components.PageHeader
import com.schoolshield.mobile.ui.components.RowChoice
import com.schoolshield.mobile.ui.components.SsButton
import com.schoolshield.mobile.ui.components.SsCard
import com.schoolshield.mobile.ui.components.SsField
import com.schoolshield.mobile.ui.theme.Danger
import com.schoolshield.mobile.ui.theme.Forest
import com.schoolshield.mobile.ui.theme.Gold
import com.schoolshield.mobile.ui.theme.Ink
import com.schoolshield.mobile.ui.theme.Mute
import com.schoolshield.mobile.ui.theme.SoftFill
import com.schoolshield.mobile.ui.theme.Success
import com.schoolshield.mobile.ui.theme.White
import kotlinx.coroutines.delay

@Composable
fun ParentHome(state: UiState, user: User, vm: AppViewModel) {
    val kids = state.app.childrenOf(user.id)
    val first = user.name.split(" ").first()
    val openInc = state.app.incidents.count { inc ->
        val s = state.app.students.find { it.id == inc.studentId }
        s?.parentIds?.contains(user.id) == true && inc.status != "resolved"
    }
    Column(verticalArrangement = Arrangement.spacedBy(14.dp)) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Column(Modifier.weight(1f)) {
                Text("Good morning,", color = Mute, fontSize = 14.sp)
                Text(first, fontSize = 28.sp, fontWeight = FontWeight.SemiBold, color = Ink)
            }
            InitialsAvatar(user.name, size = 52.dp, hue = user.hue)
        }
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            Stat("Children", kids.size.toString(), modifier = Modifier.weight(1f))
            Stat("Today", todayISO().takeLast(5), "Lagos", modifier = Modifier.weight(1f))
            Stat("Open", openInc.toString(), "incidents", modifier = Modifier.weight(1f))
        }
        SsCard(color = Forest) {
            Text("MANAGE PICKUP", color = Gold, fontSize = 11.sp, fontWeight = FontWeight.SemiBold, letterSpacing = 1.2.sp)
            Spacer(Modifier.height(6.dp))
            Text("Generate a live gate code", color = White, fontSize = 20.sp, fontWeight = FontWeight.SemiBold)
            Text("Valid for 15 minutes. Share only with school or bus staff at handover.", color = White.copy(alpha = 0.72f), fontSize = 13.sp)
            Spacer(Modifier.height(14.dp))
            SsButton("Start pickup or drop-off", gold = true, onClick = { vm.openPage(Page.Codes) })
        }
        kids.forEach { k ->
            val att = state.app.todayAttendance(k.id)
            val klass = state.app.classById(k.classId)
            SsCard {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    InitialsAvatar(k.fullName, size = 48.dp)
                    Spacer(Modifier.width(12.dp))
                    Column(Modifier.weight(1f)) {
                        Text(k.fullName, fontWeight = FontWeight.SemiBold)
                        Text("${klass?.name ?: ""} · ${k.pickupType.replace('_', ' ')}", color = Mute, fontSize = 13.sp)
                    }
                    Badge(
                        att?.status?.replace('_', ' ') ?: "not in yet",
                        tone = when (att?.status) {
                            "picked_up" -> "success"
                            "present" -> "info"
                            else -> "warn"
                        },
                    )
                }
                if (att?.dropoffAt != null) {
                    Text("In ${formatTime(att.dropoffAt)}", color = Mute, fontSize = 12.sp, modifier = Modifier.padding(top = 8.dp))
                }
            }
        }
    }
}

@Composable
fun Stat(label: String, value: String, hint: String? = null, modifier: Modifier = Modifier) {
    Column(modifier) { com.schoolshield.mobile.ui.components.Stat(label, value, hint) }
}

@Composable
fun CodesPage(state: UiState, user: User, vm: AppViewModel) {
    val kids = state.app.childrenOf(user.id)
    var step by remember { mutableIntStateOf(0) }
    var studentId by remember { mutableStateOf(kids.firstOrNull()?.id.orEmpty()) }
    var kind by remember { mutableStateOf("pickup") }
    var handlerId by remember { mutableStateOf("") }
    var oneTime by remember { mutableStateOf(false) }
    var otName by remember { mutableStateOf("") }
    var otPhone by remember { mutableStateOf("") }
    var otRel by remember { mutableStateOf("Sister") }
    val student = state.app.students.find { it.id == studentId }
    val delegates = state.app.pickupPeople.filter {
        it.parentId == user.id && it.status == "approved" && (studentId.isBlank() || studentId in it.studentIds)
    }
    val live = state.app.codes.find {
        it.parentId == user.id && it.studentId == studentId && it.kind == kind && it.status == "active"
    }
    val handlerName = when {
        handlerId.isBlank() && !oneTime -> user.name
        oneTime -> otName.ifBlank { "One-time handler" }
        else -> delegates.find { it.id == handlerId }?.name ?: user.name
    }

    if (live != null && step < 4) step = 4

    when (step) {
        0 -> Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
            PageHeader("", "Manage pickup", "Who is collecting, and is this a drop-off or pick-up.")
            RowChoice(listOf("pickup" to "Pickup", "dropoff" to "Drop-off"), kind) { kind = it }
            Spacer(Modifier.height(4.dp))
            Text("This week", fontWeight = FontWeight.SemiBold)
            kids.forEach { k ->
                HandlerRow(
                    name = k.fullName,
                    subtitle = state.app.classById(k.classId)?.name.orEmpty(),
                    selected = studentId == k.id,
                    onClick = { studentId = k.id; handlerId = "" },
                )
            }
            SsButton("Continue", onClick = { if (studentId.isNotBlank()) step = 1 }, enabled = studentId.isNotBlank())
        }
        1 -> Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
            PageHeader("", "Choose a handler", "Your saved handlers will be authorised for this code.")
            HandlerRow(user.name, "You · ${user.phone.ifBlank { "parent" }}", handlerId.isBlank() && !oneTime, {
                handlerId = ""; oneTime = false
            })
            delegates.forEach { d ->
                HandlerRow(d.name, "${d.relationship} · ${d.phone}", handlerId == d.id, {
                    handlerId = d.id; oneTime = false
                })
            }
            HandlerRow("Someone else, once", "One-time handler for this window", oneTime, {
                oneTime = true; handlerId = ""
            })
            SsButton("Continue with $handlerName", onClick = { step = if (oneTime) 2 else 3 })
        }
        2 -> Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
            PageHeader("", "One-time handler", "This person will only be authorised for this window.")
            SsField(otName, { otName = it }, "Full name")
            SsField(otPhone, { otPhone = it }, "Phone number")
            Text("Relationship", color = Mute, fontSize = 13.sp)
            RowChoice(listOf("Sister" to "Sister", "Brother" to "Brother", "Family friend" to "Family friend", "Other" to "Other"), otRel) { otRel = it }
            SsButton("Continue", onClick = { if (otName.isNotBlank()) step = 3 }, enabled = otName.isNotBlank())
        }
        3 -> Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
            PageHeader("", "Check this before you confirm", "The code is single-use and expires in 15 minutes.")
            SsCard {
                Text("Child", color = Mute, fontSize = 12.sp)
                Text(student?.fullName.orEmpty(), fontWeight = FontWeight.SemiBold, fontSize = 18.sp)
                Spacer(Modifier.height(10.dp))
                Text("Handler", color = Mute, fontSize = 12.sp)
                Text(handlerName, fontWeight = FontWeight.SemiBold)
                Spacer(Modifier.height(10.dp))
                Text("Window", color = Mute, fontSize = 12.sp)
                Text("${if (kind == "pickup") "Pick-up" else "Drop-off"} · ${todayISO()}", fontWeight = FontWeight.SemiBold)
            }
            SsButton("Confirm ${if (kind == "pickup") "pickup" else "drop-off"}", onClick = {
                if (studentId.isBlank()) return@SsButton
                vm.mutate(
                    "generateCode",
                    buildMap {
                        put("parentId", user.id)
                        put("studentId", studentId)
                        put("kind", kind)
                        if (handlerId.isNotBlank()) put("pickupPersonId", handlerId)
                    },
                )
                step = 4
            })
        }
        else -> AuthorizedCard(state.app, user.id, studentId, kind, handlerName)
    }

    val mine = state.app.codes.filter { it.parentId == user.id }
    if (step == 0 && mine.isNotEmpty()) {
        Spacer(Modifier.height(8.dp))
        Text("Recent codes", fontSize = 18.sp, fontWeight = FontWeight.SemiBold)
        Spacer(Modifier.height(8.dp))
        mine.take(8).forEach { c ->
            val s = state.app.students.find { it.id == c.studentId }
            SsCard {
                Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                    Column {
                        Text(c.code, fontFamily = FontFamily.Monospace, fontSize = 18.sp, fontWeight = FontWeight.Bold)
                        Text("${s?.fullName ?: "Student"} · ${c.kind} · ${formatDateTime(c.createdAt)}", color = Mute, fontSize = 12.sp)
                    }
                    Badge(c.status, tone = if (c.status == "used") "success" else if (c.status == "active") "warn" else "neutral")
                }
            }
            Spacer(Modifier.height(8.dp))
        }
    }
}

@Composable
private fun AuthorizedCard(app: AppState, parentId: String, studentId: String, kind: String, handlerName: String) {
    val live = app.codes.find {
        it.parentId == parentId && it.studentId == studentId && it.kind == kind && it.status == "active"
    }
    val student = app.students.find { it.id == studentId }
    var left by remember { mutableStateOf("") }
    LaunchedEffect(live?.id, live?.expiresAt) {
        if (live == null) {
            left = ""
            return@LaunchedEffect
        }
        while (true) {
            val ms = runCatching { java.time.Instant.parse(live.expiresAt).toEpochMilli() - System.currentTimeMillis() }.getOrDefault(0)
            left = if (ms <= 0) "Expired" else "${ms / 60000}:${((ms / 1000) % 60).toString().padStart(2, '0')} left"
            delay(1000)
        }
    }
    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        SsCard(color = Forest) {
            Box(
                Modifier
                    .size(56.dp)
                    .clip(CircleShape)
                    .background(White.copy(alpha = 0.12f))
                    .align(Alignment.CenterHorizontally),
                contentAlignment = Alignment.Center,
            ) {
                Icon(Icons.Outlined.CheckCircle, contentDescription = null, tint = Gold, modifier = Modifier.size(32.dp))
            }
            Spacer(Modifier.height(12.dp))
            Text(
                if (kind == "pickup") "Pickup authorised" else "Drop-off authorised",
                color = White,
                fontSize = 24.sp,
                fontWeight = FontWeight.SemiBold,
                textAlign = TextAlign.Center,
                modifier = Modifier.fillMaxWidth(),
            )
            Text(
                "${student?.fullName ?: "Your child"} · $handlerName",
                color = White.copy(alpha = 0.75f),
                textAlign = TextAlign.Center,
                modifier = Modifier.fillMaxWidth(),
            )
            Spacer(Modifier.height(16.dp))
            if (live != null && left != "Expired") {
                Text(
                    live.code,
                    color = Gold,
                    fontSize = 40.sp,
                    fontFamily = FontFamily.Monospace,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 6.sp,
                    textAlign = TextAlign.Center,
                    modifier = Modifier.fillMaxWidth(),
                )
                Text(left, color = White.copy(alpha = 0.8f), textAlign = TextAlign.Center, modifier = Modifier.fillMaxWidth())
            } else {
                Text("Generating code…", color = White.copy(alpha = 0.7f), textAlign = TextAlign.Center, modifier = Modifier.fillMaxWidth())
            }
            Spacer(Modifier.height(16.dp))
            Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp), verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Outlined.QrCode2, contentDescription = null, tint = White, modifier = Modifier.size(28.dp))
                Text("Show this at the school doors", color = White, fontWeight = FontWeight.Medium)
            }
        }
        SsCard {
            Text("Share this at the school doors", fontWeight = FontWeight.SemiBold)
            Spacer(Modifier.height(8.dp))
            Text("Gate staff enter the 6-digit code. Keep it on-screen until they confirm.", color = Mute, fontSize = 13.sp)
            Spacer(Modifier.height(12.dp))
            SsButton("Share with $handlerName", outline = true, onClick = {})
        }
    }
}

@Composable
fun ChildrenPage(state: UiState, user: User, vm: AppViewModel) {
    val kids = state.app.childrenOf(user.id)
    var first by remember { mutableStateOf("") }
    var last by remember { mutableStateOf("") }
    var classId by remember { mutableStateOf(state.app.classes.firstOrNull()?.id.orEmpty()) }
    var pickup by remember { mutableStateOf("parent") }
    var bus by remember { mutableStateOf("") }
    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        PageHeader("Family", "Your children", "Map each child to your account. Attendance and incidents follow this mapping.")
        kids.forEach { k ->
            val att = state.app.todayAttendance(k.id)
            SsCard {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    InitialsAvatar(k.fullName, size = 56.dp)
                    Spacer(Modifier.width(12.dp))
                    Column(Modifier.weight(1f)) {
                        Text(k.fullName, fontWeight = FontWeight.SemiBold, fontSize = 18.sp)
                        Text("${state.app.classById(k.classId)?.name} · ${state.app.teacherOf(k)?.name ?: ""}", color = Mute, fontSize = 13.sp)
                    }
                    Badge(k.pickupType.replace('_', ' '))
                }
                Spacer(Modifier.height(12.dp))
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    TimeChip("Drop-off", k.agreedMorningPickup ?: att?.dropoffAt?.let { formatTime(it) } ?: "—", Success)
                    TimeChip("Pick-up", k.agreedAfternoonDrop ?: att?.pickupAt?.let { formatTime(it) } ?: "—", if (att?.status == "picked_up") Success else Danger)
                }
                if (!k.busRoute.isNullOrBlank()) {
                    Spacer(Modifier.height(8.dp))
                    Text("Bus: ${k.busRoute}", color = Mute, fontSize = 13.sp)
                }
            }
        }
        SsCard {
            Text("Add a student", fontSize = 20.sp, fontWeight = FontWeight.SemiBold)
            Spacer(Modifier.height(10.dp))
            SsField(first, { first = it }, "First name")
            Spacer(Modifier.height(8.dp))
            SsField(last, { last = it }, "Last name")
            Spacer(Modifier.height(8.dp))
            Text("Class", color = Mute, fontSize = 12.sp)
            Spacer(Modifier.height(6.dp))
            RowChoice(state.app.classes.map { it.id to it.name }, classId) { classId = it }
            Spacer(Modifier.height(8.dp))
            Text("Usual handover", color = Mute, fontSize = 12.sp)
            Spacer(Modifier.height(6.dp))
            RowChoice(
                listOf("parent" to "Parent", "delegate" to "Designated adult", "school_bus" to "School bus"),
                pickup,
            ) { pickup = it }
            if (pickup == "school_bus") {
                Spacer(Modifier.height(8.dp))
                SsField(bus, { bus = it }, "Bus route")
            }
            Spacer(Modifier.height(12.dp))
            SsButton("Save student", onClick = {
                if (first.isBlank() || last.isBlank()) return@SsButton
                vm.mutate(
                    "addStudent",
                    buildMap {
                        put("firstName", first.trim())
                        put("lastName", last.trim())
                        put("classId", classId)
                        put("parentIds", listOf(user.id))
                        put("pickupType", pickup)
                        put("gender", "female")
                        if (bus.isNotBlank()) put("busRoute", bus.trim())
                    },
                )
                first = ""; last = ""; bus = ""
            })
        }
    }
}

@Composable
private fun TimeChip(label: String, value: String, color: androidx.compose.ui.graphics.Color) {
    Column(
        Modifier
            .clip(RoundedCornerShape(16.dp))
            .background(color.copy(alpha = 0.12f))
            .padding(horizontal = 12.dp, vertical = 8.dp),
    ) {
        Text(label, color = color, fontSize = 11.sp, fontWeight = FontWeight.SemiBold)
        Text(value, fontWeight = FontWeight.SemiBold, fontSize = 14.sp)
    }
}

@Composable
fun AttendancePage(state: UiState, user: User) {
    val kids = state.app.childrenOf(user.id)
    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        PageHeader("Register", "Attendance", "Records appear when a gate or bus admin verifies your code.")
        if (kids.isEmpty()) EmptyState("No children yet", "Add a child to see attendance.")
        kids.forEach { k ->
            val recs = state.app.attendance.filter { it.studentId == k.id }.take(14)
            SsCard {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    InitialsAvatar(k.fullName, size = 40.dp)
                    Spacer(Modifier.width(10.dp))
                    Text(k.fullName, fontWeight = FontWeight.SemiBold)
                }
                if (recs.isEmpty()) Text("No records yet", color = Mute, fontSize = 13.sp, modifier = Modifier.padding(top = 8.dp))
                recs.forEach { a ->
                    Row(Modifier.fillMaxWidth().padding(top = 8.dp), horizontalArrangement = Arrangement.SpaceBetween) {
                        Text(a.date, fontSize = 13.sp)
                        Badge(a.status.replace('_', ' '), if (a.status == "absent") "danger" else "success")
                    }
                }
            }
        }
    }
}

@Composable
fun DelegatesPage(state: UiState, user: User, vm: AppViewModel) {
    val kids = state.app.childrenOf(user.id)
    val mine = state.app.pickupPeople.filter { it.parentId == user.id }
    var name by remember { mutableStateOf("") }
    var phone by remember { mutableStateOf("") }
    var relationship by remember { mutableStateOf("Aunt") }
    var studentId by remember { mutableStateOf(kids.firstOrNull()?.id.orEmpty()) }
    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        PageHeader("Handover", "Your saved handlers", "School admins must approve a handler before they can collect.")
        mine.forEach { p ->
            HandlerRow(
                name = p.name,
                subtitle = "${p.relationship} · ${p.phone}",
                selected = p.status == "approved",
                onClick = {},
                trailing = {
                    Badge(p.status, tone = if (p.status == "approved") "success" else if (p.status == "rejected") "danger" else "warn")
                },
            )
        }
        SsCard {
            Text("Add a designated adult", fontSize = 18.sp, fontWeight = FontWeight.SemiBold)
            Spacer(Modifier.height(10.dp))
            SsField(name, { name = it }, "Name")
            Spacer(Modifier.height(8.dp))
            SsField(phone, { phone = it }, "Phone")
            Spacer(Modifier.height(8.dp))
            SsField(relationship, { relationship = it }, "Relationship")
            Spacer(Modifier.height(8.dp))
            RowChoice(kids.map { it.id to it.fullName }, studentId) { studentId = it }
            Spacer(Modifier.height(12.dp))
            SsButton("Submit for approval", onClick = {
                if (name.isBlank() || studentId.isBlank()) return@SsButton
                vm.mutate(
                    "addPickupPerson",
                    mapOf(
                        "parentId" to user.id,
                        "studentIds" to listOf(studentId),
                        "name" to name.trim(),
                        "phone" to phone.trim(),
                        "relationship" to relationship.trim(),
                    ),
                )
                name = ""; phone = ""
            })
        }
    }
}

@Composable
fun IncidentsPage(state: UiState, user: User, vm: AppViewModel, staff: Boolean = false) {
    val kids = if (staff) emptyList() else state.app.childrenOf(user.id)
    val list = if (user.role == "parent") {
        state.app.incidents.filter { inc ->
            state.app.students.find { it.id == inc.studentId }?.parentIds?.contains(user.id) == true
        }
    } else state.app.incidents
    var studentId by remember { mutableStateOf(kids.firstOrNull()?.id.orEmpty()) }
    var description by remember { mutableStateOf("") }
    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        PageHeader("Safety", "Something isn’t right", "Report and follow a case until it is resolved.")
        list.forEach { inc ->
            val s = state.app.students.find { it.id == inc.studentId }
            SsCard {
                Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                    Text(s?.fullName ?: "Student", fontWeight = FontWeight.SemiBold)
                    Badge(inc.status.replace('_', ' '), if (inc.status == "open") "danger" else if (inc.status == "resolved") "success" else "warn")
                }
                Text(inc.description, color = Mute, fontSize = 13.sp)
                inc.teacherResponse?.let { Text("Teacher: $it", fontSize = 12.sp, modifier = Modifier.padding(top = 6.dp)) }
                inc.superAdminResponse?.let { Text("Super admin: $it", fontSize = 12.sp) }
                if (user.role == "teacher" || user.role == "super_admin") {
                    IncidentReply(inc.id, inc.status, user.role, vm)
                }
            }
        }
        if (user.role == "parent" && kids.isNotEmpty()) {
            SsCard {
                Text("Report an incident", fontWeight = FontWeight.SemiBold, fontSize = 18.sp)
                Spacer(Modifier.height(8.dp))
                RowChoice(kids.map { it.id to it.fullName }, studentId) { studentId = it }
                Spacer(Modifier.height(8.dp))
                SsField(description, { description = it }, "What happened?", singleLine = false)
                Spacer(Modifier.height(8.dp))
                SsButton("Submit", onClick = {
                    if (description.isBlank()) return@SsButton
                    vm.mutate(
                        "createIncident",
                        mapOf(
                            "studentId" to studentId,
                            "createdById" to user.id,
                            "createdByRole" to user.role,
                            "description" to description.trim(),
                        ),
                    )
                    description = ""
                })
            }
        }
    }
}

@Composable
private fun IncidentReply(id: String, status: String, role: String, vm: AppViewModel) {
    var reply by remember { mutableStateOf("") }
    Spacer(Modifier.height(8.dp))
    SsField(reply, { reply = it }, "Response")
    Spacer(Modifier.height(8.dp))
    SsButton("Update incident", onClick = {
        val nextStatus = if (status == "open") "under_resolution" else "resolved"
        val patch = buildMap<String, Any> {
            put("status", nextStatus)
            if (role == "teacher") put("teacherResponse", reply) else put("superAdminResponse", reply)
        }
        vm.mutate("respondIncident", mapOf("id" to id, "patch" to patch))
        reply = ""
    })
}
