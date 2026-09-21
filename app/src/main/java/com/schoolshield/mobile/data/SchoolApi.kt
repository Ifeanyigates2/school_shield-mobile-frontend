package com.schoolshield.mobile.data

import com.google.gson.Gson
import com.google.gson.GsonBuilder
import com.google.gson.JsonParser
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import java.util.concurrent.TimeUnit

class SchoolApi(
    private val client: OkHttpClient,
    private val baseUrlProvider: () -> String,
) {
    private val gson: Gson = GsonBuilder().serializeNulls().create()
    private val jsonType = "application/json; charset=utf-8".toMediaType()

    fun login(email: String, password: String) =
        post("/api/auth/login", mapOf("email" to email, "password" to password))

    fun signup(role: String, name: String, email: String, phone: String, password: String) =
        post(
            "/api/auth/signup",
            mapOf(
                "role" to role,
                "name" to name,
                "email" to email,
                "phone" to phone,
                "password" to password,
            ),
        )

    fun social(
        provider: String,
        mode: String,
        role: String?,
        name: String,
        email: String,
        phone: String,
    ) = post(
        "/api/auth/social",
        buildMap {
            put("provider", provider)
            put("mode", mode)
            put("name", name)
            put("email", email)
            put("phone", phone)
            if (!role.isNullOrBlank()) put("role", role)
        },
    )

    fun demo(email: String) = post("/api/auth/demo", mapOf("email" to email))

    fun verifyOtp(code: String) = post("/api/auth/verify-otp", mapOf("code" to code))

    fun resendOtp() = post("/api/auth/resend-otp", emptyMap<String, Any>())

    fun completeSignup(body: Map<String, Any?>) = post("/api/auth/complete", body)

    fun logout() = post("/api/auth/logout", emptyMap<String, Any>())

    fun mutate(action: String, payload: Map<String, Any?> = emptyMap()) =
        post("/api/mutate", mapOf("action" to action, "payload" to payload))

    fun state(): AppState {
        val req = Request.Builder()
            .url(url("/api/state"))
            .get()
            .header("Accept", "application/json")
            .build()
        client.newCall(req).execute().use { res ->
            val text = res.body?.string().orEmpty()
            if (!res.isSuccessful) {
                val env = runCatching { gson.fromJson(text, ApiEnvelope::class.java) }.getOrNull()
                throw ApiException(env?.error ?: "Could not load SchoolShield (${res.code})")
            }
            return gson.fromJson(text, AppState::class.java) ?: AppState()
        }
    }

    private fun post(path: String, body: Map<String, Any?>): ApiEnvelope {
        val payload = gson.toJson(body)
        val req = Request.Builder()
            .url(url(path))
            .post(payload.toRequestBody(jsonType))
            .header("Accept", "application/json")
            .header("Content-Type", "application/json")
            .build()
        client.newCall(req).execute().use { res ->
            val text = res.body?.string().orEmpty()
            val env = parseEnvelope(text)
            if (!res.isSuccessful && env.error.isNullOrBlank()) {
                return env.copy(ok = false, error = "Request failed (${res.code})")
            }
            return env
        }
    }

    private fun parseEnvelope(text: String): ApiEnvelope {
        if (text.isBlank()) return ApiEnvelope(ok = false, error = "Empty response from server")
        return runCatching { gson.fromJson(text, ApiEnvelope::class.java) }.getOrElse {
            val msg = runCatching {
                JsonParser.parseString(text).asJsonObject.get("error")?.asString
            }.getOrNull()
            ApiEnvelope(ok = false, error = msg ?: "Unexpected response from SchoolShield")
        } ?: ApiEnvelope(ok = false, error = "Unexpected response from SchoolShield")
    }

    private fun url(path: String): String {
        val base = baseUrlProvider().trim().trimEnd('/')
        return base + path
    }
}

class ApiException(message: String) : Exception(message)
