package com.reactnativeglassfymodule

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise

import org.json.JSONException
import org.json.JSONObject


class GlassfyModuleModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "GlassfyModule"
    }

    @ReactMethod
    fun sdkVersion(promise: Promise) {
      promise.resolve("""{"version":"1.1.7 - android not supported"}""")
    }
    
    @ReactMethod
    fun initializeWithApiKey(apiKey: String, watcherMode: Boolean,promise: Promise) {
      promise.reject("Android platform not supported","Android platform not supported")
    }


}
