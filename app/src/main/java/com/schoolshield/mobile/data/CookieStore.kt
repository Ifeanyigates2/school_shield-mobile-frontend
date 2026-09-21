package com.schoolshield.mobile.data

import android.content.SharedPreferences
import okhttp3.Cookie
import okhttp3.CookieJar
import okhttp3.HttpUrl
import org.json.JSONArray
import org.json.JSONObject

class PersistentCookieJar(private val prefs: SharedPreferences) : CookieJar {
    private val lock = Any()
    private var store: MutableList<Cookie> = load().toMutableList()

    override fun saveFromResponse(url: HttpUrl, cookies: List<Cookie>) {
        synchronized(lock) {
            cookies.forEach { incoming ->
                store.removeAll { sameIdentity(it, incoming) }
                store += incoming
            }
            persist()
        }
    }

    override fun loadForRequest(url: HttpUrl): List<Cookie> {
        synchronized(lock) {
            val now = System.currentTimeMillis()
            store = store.filter { it.expiresAt >= now }.toMutableList()
            persist()
            return store.filter { it.matches(url) }
        }
    }

    fun clear() {
        synchronized(lock) {
            store.clear()
            prefs.edit().remove(KEY).apply()
        }
    }

    private fun sameIdentity(a: Cookie, b: Cookie) =
        a.name == b.name && a.domain == b.domain && a.path == b.path

    private fun persist() {
        val arr = JSONArray()
        store.forEach { c ->
            arr.put(
                JSONObject().apply {
                    put("name", c.name)
                    put("value", c.value)
                    put("domain", c.domain)
                    put("path", c.path)
                    put("expiresAt", c.expiresAt)
                    put("secure", c.secure)
                    put("httpOnly", c.httpOnly)
                    put("hostOnly", c.hostOnly)
                },
            )
        }
        prefs.edit().putString(KEY, arr.toString()).apply()
    }

    private fun load(): List<Cookie> {
        val raw = prefs.getString(KEY, null) ?: return emptyList()
        return runCatching {
            val arr = JSONArray(raw)
            buildList {
                for (i in 0 until arr.length()) {
                    val o = arr.getJSONObject(i)
                    val builder = Cookie.Builder()
                        .name(o.getString("name"))
                        .value(o.getString("value"))
                        .path(o.optString("path", "/"))
                        .expiresAt(o.optLong("expiresAt", Long.MAX_VALUE))
                    val domain = o.getString("domain")
                    if (o.optBoolean("hostOnly", false)) builder.hostOnlyDomain(domain) else builder.domain(domain)
                    if (o.optBoolean("secure")) builder.secure()
                    if (o.optBoolean("httpOnly")) builder.httpOnly()
                    add(builder.build())
                }
            }
        }.getOrDefault(emptyList())
    }

    companion object {
        private const val KEY = "cookies_v1"
    }
}
