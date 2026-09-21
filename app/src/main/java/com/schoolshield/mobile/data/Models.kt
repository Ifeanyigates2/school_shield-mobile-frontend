package com.schoolshield.mobile.data

data class User(
    val id: String = "",
    val role: String = "parent",
    val name: String = "",
    val email: String = "",
    val phone: String = "",
    val username: String = "",
    val password: String = "",
    val initials: String = "",
    val hue: Int = 160,
    val verified: Boolean = false,
    val idDocumentName: String? = null,
    val classIds: List<String> = emptyList(),
    val isSubstitute: Boolean? = null,
    val title: String? = null,
    val authProvider: String? = null,
)

data class SchoolClass(
    val id: String = "",
    val name: String = "",
    val level: String = "primary",
    val teacherId: String = "",
    val substituteTeacherId: String? = null,
)

data class Student(
    val id: String = "",
    val firstName: String = "",
    val lastName: String = "",
    val classId: String = "",
    val parentIds: List<String> = emptyList(),
    val pickupType: String = "parent",
    val gender: String = "female",
    val busRoute: String? = null,
    val agreedMorningPickup: String? = null,
    val agreedAfternoonDrop: String? = null,
) {
    val fullName: String get() = "$firstName $lastName".trim()
}

data class PickupPerson(
    val id: String = "",
    val parentId: String = "",
    val studentIds: List<String> = emptyList(),
    val name: String = "",
    val phone: String = "",
    val relationship: String = "",
    val photoDataUrl: String? = null,
    val status: String = "pending",
    val createdAt: String = "",
)

data class VerificationCode(
    val id: String = "",
    val parentId: String = "",
    val studentId: String = "",
    val kind: String = "dropoff",
    val code: String = "",
    val pickupPersonId: String? = null,
    val createdAt: String = "",
    val expiresAt: String = "",
    val usedAt: String? = null,
    val verifiedBy: String? = null,
    val status: String = "active",
)

data class AttendanceRecord(
    val id: String = "",
    val studentId: String = "",
    val date: String = "",
    val dropoffAt: String? = null,
    val pickupAt: String? = null,
    val dropoffVerifiedBy: String? = null,
    val pickupVerifiedBy: String? = null,
    val method: String = "parent",
    val status: String = "absent",
)

data class Incident(
    val id: String = "",
    val studentId: String = "",
    val classId: String = "",
    val teacherId: String = "",
    val createdById: String = "",
    val createdByRole: String = "parent",
    val description: String = "",
    val status: String = "open",
    val teacherResponse: String? = null,
    val superAdminResponse: String? = null,
    val parentResponse: String? = null,
    val createdAt: String = "",
    val updatedAt: String = "",
)

data class Message(
    val id: String = "",
    val fromId: String = "",
    val toId: String = "",
    val body: String = "",
    val createdAt: String = "",
    val read: Boolean = false,
    val relatedStudentId: String? = null,
    val alertType: String? = null,
)

data class DailyActivity(
    val id: String = "",
    val studentId: String = "",
    val teacherId: String = "",
    val date: String = "",
    val title: String = "",
    val notes: String = "",
    val mood: String = "good",
)

data class SchoolUpdate(
    val id: String = "",
    val audience: String = "all",
    val title: String = "",
    val body: String = "",
    val createdAt: String = "",
    val authorId: String = "",
)

data class Review(
    val id: String = "",
    val parentId: String = "",
    val target: String = "school",
    val teacherId: String? = null,
    val rating: Int = 5,
    val comment: String = "",
    val createdAt: String = "",
)

data class AppNotification(
    val id: String = "",
    val userId: String = "",
    val title: String = "",
    val body: String = "",
    val read: Boolean = false,
    val createdAt: String = "",
    val href: String? = null,
)

data class PendingAuth(
    val email: String = "",
    val phone: String = "",
    val password: String = "",
    val role: String = "parent",
    val name: String? = null,
    val otp: String = "",
    val mode: String = "login",
    val userId: String? = null,
    val authProvider: String? = null,
    val deliveredVia: List<String>? = null,
    val revealOtp: Boolean? = null,
    val otpSentAt: String? = null,
)

data class AppState(
    val version: Int = 1,
    val schoolName: String = "Greenfield Academy",
    val schoolLocation: String = "Lekki, Lagos",
    val users: List<User> = emptyList(),
    val classes: List<SchoolClass> = emptyList(),
    val students: List<Student> = emptyList(),
    val pickupPeople: List<PickupPerson> = emptyList(),
    val codes: List<VerificationCode> = emptyList(),
    val attendance: List<AttendanceRecord> = emptyList(),
    val incidents: List<Incident> = emptyList(),
    val messages: List<Message> = emptyList(),
    val activities: List<DailyActivity> = emptyList(),
    val updates: List<SchoolUpdate> = emptyList(),
    val reviews: List<Review> = emptyList(),
    val notifications: List<AppNotification> = emptyList(),
    val currentUserId: String? = null,
    val pendingAuth: PendingAuth? = null,
) {
    val user: User? get() = users.find { it.id == currentUserId }
}

data class ApiEnvelope(
    val ok: Boolean = false,
    val error: String? = null,
    val message: String? = null,
    val next: String? = null,
    val pendingId: String? = null,
    val sessionUserId: String? = null,
    val pendingAuth: PendingAuth? = null,
    val state: AppState? = null,
    val student: Student? = null,
    val kind: String? = null,
)

data class DemoAccount(
    val role: String,
    val email: String,
    val name: String,
    val blurb: String,
)

object DemoDesks {
    const val PASSWORD = "SchoolShield1"
    const val OTP = "000000"
    val accounts = listOf(
        DemoAccount("parent", "ada@greenfield.school", "Adaeze Okonkwo", "Generate drop-off & pick-up codes"),
        DemoAccount("teacher", "folake@greenfield.school", "Folake Adeyemi", "Class attendance & daily reports"),
        DemoAccount("admin", "tunde@greenfield.school", "Tunde Bakare", "Verify codes at the school gate"),
        DemoAccount("super_admin", "ngozi@greenfield.school", "Dr. Ngozi Nwosu", "School-wide reports & incidents"),
    )
}

data class RoleOption(val value: String, val label: String, val hint: String)

val ROLE_OPTIONS = listOf(
    RoleOption("parent", "Parent / Guardian", "Codes for drop-off and pick-up"),
    RoleOption("teacher", "Teacher", "Class register and daily notes"),
    RoleOption("admin", "School or bus admin", "Verify codes at the gate or on the bus"),
    RoleOption("super_admin", "School super admin", "School-wide reports and incidents"),
)

fun roleLabel(role: String) = ROLE_OPTIONS.find { it.value == role }?.label ?: role

fun passwordMeetsPolicy(password: String): Boolean {
    val special = Regex("""[!@#${'$'}%^&*()_+\-=\[\]{};':"\\|,.<>/?`~]""")
    return password.any { it.isUpperCase() } &&
        password.any { it.isDigit() } &&
        special.containsMatchIn(password)
}

const val PASSWORD_POLICY =
    "Password must include at least one capital letter, one number, and one special character."
