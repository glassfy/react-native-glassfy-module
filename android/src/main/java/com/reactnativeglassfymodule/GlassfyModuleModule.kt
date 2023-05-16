package com.reactnativeglassfymodule

import android.content.Intent
import android.net.Uri
import android.util.Log
import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.DialogFragment
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import io.glassfy.glue.GlassfyGlue
import io.glassfy.paywall.GlassfyPaywall
import io.glassfy.paywall.PaywallListener
import kotlinx.coroutines.MainScope
import org.json.JSONArray
import org.json.JSONObject

class GlassfyModuleModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  private var paywallFragment: DialogFragment? = null
  private var paywallListener: PaywallListener? = null

  override fun getName(): String {
    return "GlassfyModule"
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
  fun sdkVersion(promise: Promise) {
    GlassfyGlue.sdkVersion { value, error -> pluginCompletion(promise, value, error) }
  }

  @ReactMethod
  fun initialize(apiKey: String, watcherMode: Boolean, version: String, promise: Promise) {
    GlassfyGlue.initialize(
      this.reactApplicationContext, apiKey, watcherMode, "react-native", version
    ) { value, error -> pluginCompletion(promise, value, error) }
  }

  @ReactMethod
  fun setLogLevel(logLevel: Int, promise: Promise) {
    GlassfyGlue.setLogLevel(logLevel);
    promise.resolve(null)
  }

  @ReactMethod
  fun presentAppStoreCodeRedemptionSheet(promise: Promise) {
    promise.resolve(null)
  }

  @ReactMethod
  fun offerings(promise: Promise) {
    GlassfyGlue.offerings { value, error -> pluginCompletion(promise, value, error) }
  }

  @ReactMethod
  fun purchaseHistory(promise: Promise) {
    GlassfyGlue.purchaseHistory { value, error -> pluginCompletion(promise, value, error) }
  }

  @ReactMethod
  fun permissions(promise: Promise) {
    GlassfyGlue.permissions { value, error -> pluginCompletion(promise, value, error) }
  }

  @ReactMethod
  fun skuWithId(identifier: String, promise: Promise) {
    GlassfyGlue.skuWithId(identifier) { value, error -> pluginCompletion(promise, value, error) }
  }

  @ReactMethod
  fun skuWithIdAndStore(identifier: String, store: Int, promise: Promise) {
    GlassfyGlue.skuWithIdAndStore(identifier, store) { value, error ->
      pluginCompletion(
        promise, value, error
      )
    }
  }

  @ReactMethod
  fun connectCustomSubscriber(subscriberId: String, promise: Promise) {
    GlassfyGlue.connectCustomSubscriber(subscriberId) { value, error ->
      pluginCompletion(
        promise, value, error
      )
    }
  }

  @ReactMethod
  fun connectPaddleLicenseKey(licenseKey: String, force: Int, promise: Promise) {
    GlassfyGlue.connectPaddleLicenseKey(licenseKey, force == 1) { value, error ->
      pluginCompletion(
        promise, value, error
      )
    }
  }

  @ReactMethod
  fun connectGlassfyUniversalCode(universalCode: String, force: Int, promise: Promise) {
    GlassfyGlue.connectGlassfyUniversalCode(universalCode, force == 1) { value, error ->
      pluginCompletion(
        promise, value, error
      )
    }
  }

  @ReactMethod
  fun setEmailUserProperty(email: String, promise: Promise) {
    GlassfyGlue.setEmailUserProperty(email) { value, error ->
      pluginCompletion(
        promise, value, error
      )
    }
  }

  @ReactMethod
  fun setExtraUserProperty(extra: ReadableMap, promise: Promise) {
    val map = HashMap<String, String>()

    extra.entryIterator.forEach { entry ->
      val value = entry.value
      if (value is String) {
        map[entry.key] = value
      } else {
        promise.reject("invalid Extra Property", "invalid Extra Property")
        return;
      }
    }
    GlassfyGlue.setExtraUserProperty(map) { value, error ->
      pluginCompletion(
        promise, value, error
      )
    }
  }

  @ReactMethod
  fun getUserProperties(promise: Promise) {
    GlassfyGlue.getExtraUserProperty() { value, error -> pluginCompletion(promise, value, error) }
  }

  @ReactMethod
  fun purchaseSku(sku: ReadableMap, promise: Promise) {
    val activity = this.reactApplicationContext.currentActivity
    val skuId = sku.getString("skuId")

    if (activity == null) {
      promise.reject("Invalid Android Activity", "Invalid Android Activity")
      return
    }
    if (skuId == null) {
      promise.reject("Invalid SKU", "Invalid SKU")
      return
    }
    GlassfyGlue.purchaseSku(activity, skuId) { value, error ->
      pluginCompletion(
        promise, value, error
      )
    }
  }

  @ReactMethod
  fun restorePurchases(promise: Promise) {
    GlassfyGlue.restorePurchases() { value, error -> pluginCompletion(promise, value, error) }
  }

  @ReactMethod
  fun setDeviceToken(promise: Promise) {
    promise.resolve(null)
  }

  @ReactMethod
  fun subscribeOnPurchaseDelegate() {
  }

  @ReactMethod
  fun setAttribution(type: Int, value: String, promise: Promise) {
    GlassfyGlue.setAttribution(type, value) { res, error ->
      pluginCompletion(
        promise, res, error
      )
    }
  }

  @ReactMethod
  fun setAttributions(items: ReadableArray, promise: Promise) {
    val listItems = mutableListOf<Map<String, Any?>>()
    for (i in 0 until items.size()) {
      val item = items.getMap(i)?.toHashMap()
      if (item != null) {
        listItems.add(item)
      } else {
        promise.reject("Invalid AttributionItem", "Invalid AttributionItem")
        return
      }
    }

    GlassfyGlue.setAttributions(listItems) { value, error ->
      pluginCompletion(
        promise, value, error
      )
    }
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
  fun _paywall(remoteConfig: String, promise: Promise) {
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
    GlassfyPaywall.paywall(remoteConfig, listener) { paywall, _ ->
      MainScope().run {
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
}
