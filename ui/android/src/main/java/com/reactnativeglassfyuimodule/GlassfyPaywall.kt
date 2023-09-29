package com.reactnativeglassfyuimodule

import android.net.Uri
import android.util.Log
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.WritableMap
import io.glassfy.androidsdk.GlassfyError
import io.glassfy.androidsdk.model.Sku
import io.glassfy.androidsdk.model.Transaction
import io.glassfy.paywall.PaywallFragment
import io.glassfy.glue.encodedJson
import org.json.JSONObject

internal class ReactPaywallListener(private val handler: (String, JSONObject) -> Unit) {
    val onClose: (Transaction?, GlassfyError?) -> Unit = { transaction, error ->
        Log.d("ReactPaywallListener", "onClose")
        val payload = JSONObject().apply {
            put("transaction", transaction?.encodedJson())
            put("error", error?.toString())
        }
        handler("onClose", payload)
    }

    val onLink: (Uri) -> Unit = { url ->
        Log.d("ReactPaywallListener", "onLink $url")
        val payload = JSONObject().apply {
            put("url", url.toString())
        }
        handler("onLink", payload)
    }

    val onRestore: () -> Unit = {
        Log.d("ReactPaywallListener", "onRestore")
        val payload = JSONObject().apply {
            // ...
        }
        handler("onRestore", payload)
    }

    val onPurchase: (Sku) -> Unit = { sku ->
        Log.d("ReactPaywallListener", "onPurchase")
        val payload = JSONObject().apply {
            put("sku", sku.encodedJson())
        }
        handler("onPurchase", payload)
    }
}
