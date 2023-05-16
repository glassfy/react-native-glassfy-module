package com.reactnativeglassfymodule

import android.net.Uri
import android.util.Log
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.WritableMap
import io.glassfy.androidsdk.GlassfyError
import io.glassfy.androidsdk.model.Sku
import io.glassfy.androidsdk.model.Transaction
import io.glassfy.paywall.PaywallFragment
import io.glassfy.paywall.PaywallListener
import io.glassfy.glue.encodedJson
import org.json.JSONObject

internal class ReactPaywallListener(
  private val handler: (eventName: String, payload: JSONObject) -> Unit
) : PaywallListener {
  override fun onClose(f: PaywallFragment, transaction: Transaction?, error: GlassfyError?) {
    Log.d("ReactPaywallListener", "onClose")
    val payload = JSONObject().apply {
      put("transaction", transaction?.encodedJson())
      put("error", error?.toString())
    }
    handler("onClose", payload)
  }

  override fun onLink(f: PaywallFragment, url: Uri) {
    Log.d("ReactPaywallListener", "onLink $url")
    val payload = JSONObject().apply {
      put("url", url.toString())
    }
    handler("onLink", payload)
  }

  override fun onRestore(f: PaywallFragment) {
    Log.d("ReactPaywallListener", "onRestore")
    val payload = JSONObject().apply {
      // ...
    }
    handler("onRestore", payload)
  }

  override fun onPurchase(f: PaywallFragment, sku: Sku) {
    Log.d("ReactPaywallListener", "onPurchase")
    val payload = JSONObject().apply {
      put("sku", sku.encodedJson())
    }
    handler("onPurchase", payload)
  }
}
