package com.reactnativeglassfymodule

import com.facebook.react.bridge.*
import io.glassfy.glue.GlassfyGlue
import org.json.JSONArray
import org.json.JSONObject
import kotlin.reflect.typeOf


class GlassfyModuleModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String {
    return "GlassfyModule"
  }

  fun JSONObject.toMap(): Map<String, *> = keys().asSequence().associateWith {
    when (val value = this[it])
    {
      is JSONArray ->
      {
        val map = (0 until value.length()).associate { Pair(it.toString(), value[it]) }
        JSONObject(map).toMap().values.toList()
      }
      is JSONObject -> value.toMap()
      JSONObject.NULL -> null
      else            -> value
    }
  }

  private fun pluginCompletion(promise: Promise, value: String?, error: String?) {
    if (error != null) {
      promise.reject(error, error)
      return
    }

   if (value==null) {
     promise.resolve(null)
     return;
   }

    // convert json string to JSONOBJECT
    val jo = value.let { JSONObject(it).toMap() }
    // convert JSONOBJECT to NativeMap
    val map = Arguments.makeNativeMap(jo)
    promise.resolve(map)
  }

  @ReactMethod
  fun sdkVersion(promise: Promise) {
    GlassfyGlue.sdkVersion { value, error -> pluginCompletion(promise, value, error) }
  }

  @ReactMethod
  fun initialize(apiKey: String, watcherMode: Boolean, promise: Promise) {
    GlassfyGlue.initialize(
      this.reactApplicationContext,
      apiKey,
      watcherMode
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
        promise,
        value,
        error
      )
    }
  }

  @ReactMethod
  fun connectCustomSubscriber(subscriberId: String, promise: Promise) {
    GlassfyGlue.connectCustomSubscriber(subscriberId) { value, error ->
      pluginCompletion(
        promise,
        value,
        error
      )
    }
  }

  @ReactMethod
  fun connectPaddleLicenseKey(licenseKey: String, force: Int, promise: Promise) {
    GlassfyGlue.connectPaddleLicenseKey(licenseKey, force == 1) { value, error ->
      pluginCompletion(
        promise,
        value,
        error
      )
    }
  }

  @ReactMethod
  fun setEmailUserProperty(email: String, promise: Promise) {
    GlassfyGlue.setEmailUserProperty(email) { value, error ->
      pluginCompletion(
        promise,
        value,
        error
      )
    }
  }

  @ReactMethod
  fun setExtraUserProperty(extra: ReadableMap, promise: Promise) {
    val map = HashMap<String,String>()

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
        promise,
        value,
        error
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
           promise,
           value,
            error
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
  fun subscribeOnPurchaseDelegate() {}
}
