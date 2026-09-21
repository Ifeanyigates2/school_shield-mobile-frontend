package com.schoolshield.mobile

import android.app.Application
import com.schoolshield.mobile.data.PersistentCookieJar
import com.schoolshield.mobile.data.SchoolApi
import okhttp3.OkHttpClient
import java.util.concurrent.TimeUnit

class SchoolShieldApp : Application() {
    lateinit var cookieJar: PersistentCookieJar
        private set
    lateinit var api: SchoolApi
        private set

    override fun onCreate() {
        super.onCreate()
        val prefs = getSharedPreferences("schoolshield", MODE_PRIVATE)
        cookieJar = PersistentCookieJar(prefs)
        val client = OkHttpClient.Builder()
            .cookieJar(cookieJar)
            .connectTimeout(25, TimeUnit.SECONDS)
            .readTimeout(25, TimeUnit.SECONDS)
            .writeTimeout(25, TimeUnit.SECONDS)
            .build()
        api = SchoolApi(client) {
            prefs.getString(KEY_API, DEFAULT_API) ?: DEFAULT_API
        }
    }

    companion object {
        const val DEFAULT_API = "https://school-shield.vercel.app"
        const val KEY_API = "api_base"
    }
}
