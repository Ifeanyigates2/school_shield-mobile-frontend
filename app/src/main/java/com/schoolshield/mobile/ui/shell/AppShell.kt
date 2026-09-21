package com.schoolshield.mobile.ui.shell

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.outlined.ArrowBack
import androidx.compose.material.icons.automirrored.outlined.Chat
import androidx.compose.material.icons.outlined.GridView
import androidx.compose.material.icons.outlined.Home
import androidx.compose.material.icons.outlined.People
import androidx.compose.material.icons.outlined.Shield
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.schoolshield.mobile.AppViewModel
import com.schoolshield.mobile.Page
import com.schoolshield.mobile.UiState
import com.schoolshield.mobile.data.User
import com.schoolshield.mobile.ui.components.ErrorBanner
import com.schoolshield.mobile.ui.parent.AttendancePage
import com.schoolshield.mobile.ui.parent.ChildrenPage
import com.schoolshield.mobile.ui.parent.CodesPage
import com.schoolshield.mobile.ui.parent.DelegatesPage
import com.schoolshield.mobile.ui.parent.IncidentsPage
import com.schoolshield.mobile.ui.parent.ParentHome
import com.schoolshield.mobile.ui.staff.AdminDelegates
import com.schoolshield.mobile.ui.staff.AdminHome
import com.schoolshield.mobile.ui.staff.AdminLog
import com.schoolshield.mobile.ui.staff.ReviewsPage
import com.schoolshield.mobile.ui.staff.SubstitutePage
import com.schoolshield.mobile.ui.staff.SuperAttendance
import com.schoolshield.mobile.ui.staff.SuperHome
import com.schoolshield.mobile.ui.staff.SuperUsers
import com.schoolshield.mobile.ui.staff.TeacherActivities
import com.schoolshield.mobile.ui.staff.TeacherHome
import com.schoolshield.mobile.ui.staff.UpdatesPage
import com.schoolshield.mobile.ui.theme.Cream
import com.schoolshield.mobile.ui.theme.Forest
import com.schoolshield.mobile.ui.theme.Ink
import com.schoolshield.mobile.ui.theme.Mute
import com.schoolshield.mobile.ui.theme.White

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainShell(state: UiState, user: User, vm: AppViewModel) {
    val main = state.screen as com.schoolshield.mobile.Screen.Main
    val tabs = tabsFor(user.role)
    val snackbar = remember { SnackbarHostState() }
    LaunchedEffect(state.toast) {
        val msg = state.toast ?: return@LaunchedEffect
        snackbar.showSnackbar(msg)
        vm.clearToast()
    }
    Scaffold(
        containerColor = Cream,
        snackbarHost = { SnackbarHost(snackbar) },
        topBar = {
            if (main.page != Page.Tab) {
                TopAppBar(
                    title = { Text(pageTitle(main.page), fontWeight = FontWeight.SemiBold) },
                    navigationIcon = {
                        IconButton(onClick = { vm.back() }) {
                            Icon(Icons.AutoMirrored.Outlined.ArrowBack, contentDescription = "Back")
                        }
                    },
                    colors = TopAppBarDefaults.topAppBarColors(containerColor = Cream, titleContentColor = Ink),
                )
            }
        },
        bottomBar = {
            if (main.page == Page.Tab || main.page is Page.Thread) {
                NavigationBar(containerColor = White, tonalElevation = 0.dp) {
                    tabs.forEachIndexed { index, label ->
                        NavigationBarItem(
                            selected = main.tab == index && main.page == Page.Tab,
                            onClick = { vm.setTab(index) },
                            icon = { Icon(tabIcon(user.role, index), contentDescription = label) },
                            label = { Text(label) },
                            colors = NavigationBarItemDefaults.colors(
                                selectedIconColor = Forest,
                                selectedTextColor = Forest,
                                indicatorColor = Forest.copy(alpha = 0.12f),
                                unselectedIconColor = Mute,
                                unselectedTextColor = Mute,
                            ),
                        )
                    }
                }
            }
        },
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 20.dp, vertical = 8.dp),
        ) {
            ErrorBanner(state.error)
            when (val page = main.page) {
                Page.Tab -> TabContent(state, user, vm, main.tab)
                Page.Codes -> CodesPage(state, user, vm)
                Page.Attendance -> if (user.role == "super_admin") SuperAttendance(state) else AttendancePage(state, user)
                Page.Delegates -> if (user.role == "admin" || user.role == "super_admin") AdminDelegates(state, vm) else DelegatesPage(state, user, vm)
                Page.Incidents -> IncidentsPage(state, user, vm)
                Page.Activities -> if (user.role == "teacher") TeacherActivities(state, user, vm) else ActivitiesForParent(state, user)
                Page.Updates -> UpdatesPage(state, user, vm)
                Page.Reviews -> ReviewsPage(state, user, vm)
                Page.Users -> SuperUsers(state)
                Page.Log -> AdminLog(state)
                Page.Substitute -> SubstitutePage(state, user, vm)
                Page.Profile -> ProfilePage(state, user, vm)
                Page.Settings -> SettingsPage(state, vm)
                is Page.Thread -> MessagesPage(state, user, vm, page.otherId)
            }
            Spacer(Modifier.height(24.dp))
        }
    }
}

@Composable
private fun TabContent(state: UiState, user: User, vm: AppViewModel, tab: Int) {
    when (user.role) {
        "teacher" -> when (tab) {
            1 -> TeacherActivities(state, user, vm)
            2 -> MessagesPage(state, user, vm, null)
            3 -> MorePage(state, user, vm)
            else -> TeacherHome(state, user, vm)
        }
        "admin" -> when (tab) {
            1 -> AdminDelegates(state, vm)
            2 -> MessagesPage(state, user, vm, null)
            3 -> MorePage(state, user, vm)
            else -> AdminHome(state, user, vm)
        }
        "super_admin" -> when (tab) {
            1 -> SuperUsers(state)
            2 -> MessagesPage(state, user, vm, null)
            3 -> MorePage(state, user, vm)
            else -> SuperHome(state)
        }
        else -> when (tab) {
            1 -> ChildrenPage(state, user, vm)
            2 -> MessagesPage(state, user, vm, null)
            3 -> MorePage(state, user, vm)
            else -> ParentHome(state, user, vm)
        }
    }
}

private fun pageTitle(page: Page) = when (page) {
    Page.Codes -> "Codes"
    Page.Attendance -> "Attendance"
    Page.Delegates -> "Delegates"
    Page.Incidents -> "Incidents"
    Page.Activities -> "Activities"
    Page.Updates -> "Updates"
    Page.Reviews -> "Reviews"
    Page.Users -> "People"
    Page.Log -> "Gate log"
    Page.Substitute -> "Substitute"
    Page.Profile -> "Profile"
    Page.Settings -> "Settings"
    is Page.Thread -> "Message"
    Page.Tab -> "SchoolShield"
}

private fun tabIcon(role: String, index: Int): ImageVector = when {
    index == 0 -> if (role == "admin") Icons.Outlined.Shield else Icons.Outlined.Home
    index == 1 -> Icons.Outlined.People
    index == 2 -> Icons.AutoMirrored.Outlined.Chat
    else -> Icons.Outlined.GridView
}
