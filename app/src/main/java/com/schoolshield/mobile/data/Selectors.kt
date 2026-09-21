package com.schoolshield.mobile.data

import java.time.Instant
import java.time.ZoneId
import java.time.ZonedDateTime
import java.time.format.DateTimeFormatter
import java.util.Locale

private val lagos: ZoneId = ZoneId.of("Africa/Lagos")

fun todayISO(): String =
    ZonedDateTime.now(lagos).format(DateTimeFormatter.ISO_LOCAL_DATE)

fun formatTime(iso: String): String = runCatching {
    Instant.parse(iso).atZone(lagos).format(DateTimeFormatter.ofPattern("h:mm a", Locale.UK))
}.getOrElse { iso }

fun formatDateTime(iso: String): String = runCatching {
    Instant.parse(iso).atZone(lagos)
        .format(DateTimeFormatter.ofPattern("EEE d MMM · h:mm a", Locale.UK))
}.getOrElse { iso }

fun relativeTime(iso: String): String {
    val then = runCatching { Instant.parse(iso).toEpochMilli() }.getOrNull() ?: return iso
    val mins = ((System.currentTimeMillis() - then) / 60000).toInt()
    return when {
        mins < 1 -> "just now"
        mins < 60 -> "${mins}m ago"
        mins < 1440 -> "${mins / 60}h ago"
        else -> "${mins / 1440}d ago"
    }
}

fun homeFor(role: String) = when (role) {
    "teacher" -> "teacher"
    "admin" -> "admin"
    "super_admin" -> "super"
    else -> "parent"
}

fun AppState.childrenOf(parentId: String) =
    students.filter { parentId in it.parentIds }

fun AppState.classById(id: String) = classes.find { it.id == id }

fun AppState.teacherOf(student: Student) =
    users.find { it.id == classById(student.classId)?.teacherId }

fun AppState.todayAttendance(studentId: String) =
    attendance.find { it.studentId == studentId && it.date == todayISO() }

fun AppState.teacherClassIds(teacherId: String) =
    (classes.filter { it.teacherId == teacherId } +
        classes.filter { it.substituteTeacherId == teacherId })
        .map { it.id }
        .distinct()

fun AppState.rosterForTeacher(teacherId: String): List<Student> {
    val ids = teacherClassIds(teacherId)
    return students.filter { it.classId in ids }
}

fun AppState.coveringClasses(teacherId: String) =
    classes.filter { it.teacherId == teacherId || it.substituteTeacherId == teacherId }

fun attendanceRate(records: List<AttendanceRecord>): Int {
    if (records.isEmpty()) return 0
    val present = records.count { it.status == "present" || it.status == "picked_up" }
    return (present * 100) / records.size
}

fun AppState.conversationPartners(userId: String): List<User> {
    val ids = mutableSetOf<String>()
    messages.forEach {
        if (it.fromId == userId) ids += it.toId
        if (it.toId == userId) ids += it.fromId
    }
    return users.filter { it.id in ids }
}

fun AppState.thread(a: String, b: String) =
    messages.filter {
        (it.fromId == a && it.toId == b) || (it.fromId == b && it.toId == a)
    }.sortedBy { it.createdAt }

fun AppState.unreadCount(userId: String, fromId: String? = null) =
    messages.count { it.toId == userId && !it.read && (fromId == null || it.fromId == fromId) }

fun AppState.messagingTargets(role: String, userId: String): List<User> {
    val result = when (role) {
        "parent" -> {
            val kids = childrenOf(userId)
            val teacherIds = kids.mapNotNull { classById(it.classId)?.teacherId }.toSet()
            users.filter { it.id in teacherIds || it.role == "admin" || it.role == "super_admin" }
        }
        "teacher" -> {
            val parentIds = rosterForTeacher(userId).flatMap { it.parentIds }.toSet()
            users.filter { it.id in parentIds || it.role == "admin" || it.role == "super_admin" }
        }
        else -> users.filter { it.role == "parent" || it.role == "teacher" }
    }
    return result.filter { it.id != userId }.distinctBy { it.id }
}

fun AppState.myNotifications(userId: String) =
    notifications.filter { it.userId == userId }
