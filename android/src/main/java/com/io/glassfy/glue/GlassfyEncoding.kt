package io.glassfy.glue

import io.glassfy.androidsdk.model.*
import org.json.JSONArray
import org.json.JSONObject


fun encodeArray(array:List<JSONObject>):JSONArray {
    val all = JSONArray()
    array.forEach {
        all.put(it)
    }
    return all
}

fun Offering.encodedJson(): JSONObject {
    val jo = JSONObject()
    jo.put("offeringId",this.offeringId)

    val skus = encodeArray(this.skus.map { it.encodedJson()})
    jo.put("skus",skus)
    return jo
}

fun Offerings.encodedJson(): JSONObject {
    val jo = JSONObject()
    val all = encodeArray(this.all.map { it.encodedJson()})
    jo.put("all",all)
    return jo
}

fun Permission.encodedJson(): JSONObject {
    val jo = JSONObject()
    jo.put("permissionId",this.permissionId)
    jo.put("entitlement",this.entitlement)
    jo.put("isValid",this.isValid)
    jo.put("expireDate",this.expireDate)
    jo.put("accountableSkus",this.accountableSkus)
    return jo
}

fun Permissions.encodedJson(): JSONObject {
    val jo = JSONObject()
    val permissions = encodeArray(this.all.map { it.encodedJson() })
    jo.put("all",permissions)
    return jo
}

fun Sku.encodedJson(): JSONObject {
    val jo = JSONObject()
    jo.put("skuId",this.skuId)
    jo.put("productId",this.productId)
    return jo
}

fun Transaction.encodedJson(): JSONObject {
    val jo = JSONObject()
    jo.put("permissions", this.permissions.encodedJson())
    return jo
}

fun skuFromJsonObject(jo:JSONObject):Sku {
    val skuId = jo.getString("skuId") ?: ""
    val productId = jo.getString("productId") ?: ""
    return Sku(skuId,productId, emptyMap<String, String>())
}

