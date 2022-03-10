package com.reactnativeglassfymodule

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import io.glassfy.glue.GlassfyGlue


class GlassfyModuleModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String {
    return "GlassfyModule"
  }

  private fun pluginCompletion(promise: Promise, value: String?, error: String?) {
    if (error != null) {
      promise.reject(error, error)
      return
    }
    promise.resolve(value)
  }

  @ReactMethod
  fun sdkVersion(promise: Promise) {
    GlassfyGlue.sdkVersion { value, error -> pluginCompletion(promise, value, error) }
  }

  @ReactMethod
  fun initializeWithApiKey(apiKey: String, watcherMode: Boolean, promise: Promise) {
    GlassfyGlue.initialize(
      this.reactApplicationContext,
      apiKey,
      watcherMode
    ) { value, error -> pluginCompletion(promise, value, error) }
  }

  @ReactMethod
  fun offerings(promise: Promise) {
    GlassfyGlue.offerings { value, error -> pluginCompletion(promise, value, error) }
  }

  @ReactMethod
  fun permissions(promise: Promise) {
    GlassfyGlue.permissions { value, error -> pluginCompletion(promise, value, error) }
  }


@ReactMethod  fun login(promise: Promise) {
    promise.resolve(null)
  }

@ReactMethod  fun logout(promise: Promise) {
    promise.resolve(null)
  }


//@ReactMethod  fun purchaseSku(sku:Spromise: Promise) {
//    val skujson = promise.getObject("sku")
//    val jo = JSONObject(skujson.toString())
//    val sku = skuFromJsonObject(jo)
//
//    GlassfyGlue.purchaseSku(activity,sku){ value, error -> pluginCompletion(promise, value, error) }
//  }

@ReactMethod  fun restorePurchases(promise: Promise) {
    GlassfyGlue.restorePurchases()  { value, error -> pluginCompletion(promise, value, error) }
  }

@ReactMethod  fun setLogLevel(promise: Promise) {
    promise.resolve(null)
  }

@ReactMethod  fun setDeviceToken(promise: Promise) {
    promise.resolve(null)
  }

@ReactMethod  fun setExtraUserProperty(promise: Promise) {
    promise.resolve(null)
  }

@ReactMethod  fun getUserProperty(promise: Promise) {
    promise.resolve(null)
  }
}
