package com.reactnativeglassfyuimodule

import android.content.Intent
import android.net.Uri
import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.DialogFragment
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import io.glassfy.glue.GlassfyGlue
import io.glassfy.paywall.GlassfyPaywall
import kotlinx.coroutines.MainScope
import org.json.JSONArray
import org.json.JSONObject

class GlassfyUIModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  private var paywallFragment: DialogFragment? = null
  private var paywallListener: ReactPaywallListener? = null

  override fun getName(): String {
    return "GlassfyUIModule"
  }

  fun JSONObject.toMap(): Map<String, *> = keys().asSequence().associateWith {
    when (val value = this[it]) {
      is JSONArray -> {
        val map = (0 until value.length()).associate { Pair(it.toString(), value[it]) }
        JSONObject(map).toMap().values.toList()
      }

      is JSONObject -> value.toMap()
      JSONObject.NULL -> null
      else -> value
    }
  }

  private fun pluginCompletion(promise: Promise, value: String?, error: String?) {
    if (error != null) {
      promise.reject(error, error)
      return
    }

    if (value == null) {
      promise.resolve(null)
      return;
    }

    val jo = value.let { JSONObject(it).toMap() }
    val map = Arguments.makeNativeMap(jo)
    promise.resolve(map)
  }

  @ReactMethod
  fun _openUrl(urlString: String, promise: Promise) {
    try {
      val i = Intent(Intent.ACTION_VIEW).apply { data = Uri.parse(urlString) }
      currentActivity?.startActivity(i)
    } catch (e: Exception) {
      pluginCompletion(promise, null, e.toString())
    }
  }

  @ReactMethod
  fun _closePaywall(promise: Promise) {
    MainScope().run {
      paywallFragment?.dismiss()
      paywallFragment = null
      paywallListener = null
    }
    pluginCompletion(promise, null, null)
  }

  @ReactMethod
  fun _paywall(remoteConfig: String, awaitLoading: Boolean, promise: Promise) {
    if (paywallFragment != null) {
      promise.reject(
        "Only one paywall can be shown at a time",
        "Only one paywall can be shown at a time, please call `GlassfyPaywall.close()`"
      )
      return
    }
    val activity = currentActivity as? AppCompatActivity
    if (activity == null) {
      promise.reject("No activity", "Could not find a AppCompatActivity")
      return
    }

    val listener = ReactPaywallListener { eventName, payload ->
      sendEvent(eventName, payload)
    }
    paywallListener = listener
    GlassfyPaywall.fragment(activity, remoteConfig, awaitLoading) { paywall, _ ->
      MainScope().run {
        paywall?.setCloseHandler(listener.onClose)
        paywall?.setPurchaseHandler(listener.onPurchase)
        paywall?.setRestoreHandler(listener.onRestore)
        paywall?.setLinkHandler(listener.onLink)
        paywall?.show(activity.supportFragmentManager, "paywall")
      }
      paywallFragment = paywall
      pluginCompletion(promise, null, null)
    }
  }

  private fun sendEvent(eventName: String, value: JSONObject) {
    val params = Arguments.createMap()
    params.putString("event", eventName)
    params.putString("encodedData", value.toString(2))

    reactApplicationContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
      .emit("paywallEvent", params)
  }

  @ReactMethod
  fun addListener(eventName: String) {
    // ...
  }

  @ReactMethod
  fun removeListeners(count: Int) {
    // ...
  }
}
