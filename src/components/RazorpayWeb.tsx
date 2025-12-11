// src/components/RazorpayWeb.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Platform,
  BackHandler,
} from "react-native";
import { WebView, WebViewMessageEvent } from "react-native-webview";

type RazorCallback = (res: any) => void;

interface Props {
  visible: boolean;
  order_id: string;
  amount: number; // rupees (decimal)
  razorpayKey: string;
  name?: string;
  email?: string;
  mobile?: string;
  onSuccess: RazorCallback;
  onFailure: RazorCallback;
  onClose: () => void;
}

const RazorpayWeb: React.FC<Props> = ({
  visible,
  order_id,
  amount,
  razorpayKey,
  name = "",
  email = "",
  mobile = "",
  onSuccess,
  onFailure,
  onClose,
}) => {
  const webRef = useRef<WebView | null>(null);
  const [loading, setLoading] = useState(true);
  const [injectedOnce, setInjectedOnce] = useState(false);
  const handledRef = useRef<{ done: boolean }>({ done: false });

  // HTML fallback (same as file) — used only if require() fails
  const fallbackHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head><body><script src="https://checkout.razorpay.com/v1/checkout.js"></script><script>(${String((function(){/* placeholder */}) )})()</script></body></html>`;

  // Try to use bundled asset first (require)
  // NOTE: Metro can bundle .html files as assets if placed in project and referenced via require.
  // If metro doesn't include it, fallback to inline html (defined below).
  let source: any;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const asset = require("../../assets/razorpayCheckout.html");
    source = asset;
  } catch (err) {
    // fallback to inline embedded string (we'll build proper htmlContent string below)
    source = { html: null };
  }

  // Inline content fallback (same logic as file)
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
        <title>Razorpay Checkout</title>
      </head>
      <body>
        <script>
          (function () {
            window._razorpayInstance = null;
            function sendMessage(event, data) {
              var msg = { event: event };
              if (typeof data !== 'undefined') msg.data = data;
              try { window.ReactNativeWebView.postMessage(JSON.stringify(msg)); } catch(e){}
            }

            window.startRazorpay = function (orderId, key, name, email, contact, amount) {
              try {
                var options = {
                  key: key,
                  order_id: orderId,
                  amount: amount,
                  name: "EFI",
                  description: "Payment for Registration",
                  prefill: { name: name || "", email: email || "", contact: contact || "" },
                  modal: { ondismiss: function () { sendMessage("CLOSE"); try { if (window._razorpayInstance) window._razorpayInstance.close(); } catch(e){} }, escape: false, confirm_close: true },
                  handler: function (response) {
                    sendMessage("SUCCESS", { razorpay_payment_id: response.razorpay_payment_id, razorpay_order_id: response.razorpay_order_id, razorpay_signature: response.razorpay_signature });
                    try { if (window._razorpayInstance) window._razorpayInstance.close(); } catch(e){}
                  }
                };

                var rzp = new Razorpay(options);
                window._razorpayInstance = rzp;

                rzp.on("payment.failed", function (response) {
                  var err = response && response.error ? response.error : response;
                  sendMessage("FAILURE", { code: err && err.code ? err.code : "PAYMENT_FAILED", description: err && err.description ? err.description : "Payment failed", metadata: err && err.metadata ? err.metadata : {} });
                  try { if (window._razorpayInstance) window._razorpayInstance.close(); } catch(e){}
                });

                rzp.on("payment.error", function (response) {
                  var err = response && response.error ? response.error : response;
                  sendMessage("ERROR", { description: err && err.description ? err.description : "An error occurred" });
                  try { if (window._razorpayInstance) window._razorpayInstance.close(); } catch(e){}
                });

                rzp.open();

                setTimeout(function(){ try { if (window._razorpayInstance) { window._razorpayInstance.close(); sendMessage("TIMEOUT"); } } catch(e){} }, 60000);
              } catch (err) {
                sendMessage("ERROR", { description: String(err) });
                try { if (window._razorpayInstance) window._razorpayInstance.close(); } catch(e){}
              }
            };
          })();
        </script>
      </body>
    </html>
  `;

  if (!source || (source && typeof source === "object" && !source.uri && !source.html && !source.bundle)) {
    source = { html: htmlContent };
  }

  // Inject JS to call startRazorpay with params (escape properly)
  const injectStart = (oId: string, key: string, nm: string, em: string, contact: string, amt: number) => {
    const esc = (s: any) =>
      String(s || "")
        .replace(/\\/g, "\\\\")
        .replace(/`/g, "\\`")
        .replace(/\$/g, "\\$")
        .replace(/\n/g, "\\n")
        .replace(/\r/g, "\\r");

    const amountPaise = Math.round(amt * 100);

    const js = `
      try {
        if (typeof startRazorpay === 'function') {
          startRazorpay("${esc(oId)}", "${esc(key)}", "${esc(nm)}", "${esc(em)}", "${esc(contact)}", ${amountPaise});
        } else {
          // if function not ready, wait and retry
          var attempts = 0;
          var intv = setInterval(function(){
            attempts++;
            if (typeof startRazorpay === 'function') {
              startRazorpay("${esc(oId)}", "${esc(key)}", "${esc(nm)}", "${esc(em)}", "${esc(contact)}", ${amountPaise});
              clearInterval(intv);
            } else if (attempts > 20) {
              clearInterval(intv);
              window.ReactNativeWebView.postMessage(JSON.stringify({ event: 'ERROR', data: { description: 'startRazorpay not available' } }));
            }
          }, 200);
        }
      } catch(e){
        try { window.ReactNativeWebView.postMessage(JSON.stringify({ event: 'ERROR', data: { description: String(e) } })); } catch(err){}
      }
      true;
    `;
    return js;
  };

  // Prevent Android Back from leaving mid-checkout: optional behavior
  useEffect(() => {
    const onBack = () => {
      // if visible, send close
      if (visible) {
        try { webRef.current?.injectJavaScript(`(function(){ try{ if(window._razorpayInstance) window._razorpayInstance.close(); }catch(e){} window.ReactNativeWebView.postMessage(JSON.stringify({event:'CLOSE'})); })(); true;`); } catch(e){}
        return true; // handled
      }
      return false;
    };
    const sub = BackHandler.addEventListener("hardwareBackPress", onBack);
    return () => sub.remove();
  }, [visible]);

  // When the webview loads, inject startRazorpay once
  useEffect(() => {
    if (!visible) {
      handledRef.current.done = false;
      setInjectedOnce(false);
    }
  }, [visible, order_id, razorpayKey, amount, name, email, mobile]);

  if (!visible) return null;

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" />
        </View>
      )}

      <WebView
        ref={webRef as React.RefObject<WebView>}
        originWhitelist={["*"]}
        source={source}
        javaScriptEnabled
        domStorageEnabled
        onLoadEnd={() => {
          setLoading(false);
          if (!injectedOnce) {
            const js = injectStart(order_id, razorpayKey, name, email, mobile, amount);
            try {
              webRef.current?.injectJavaScript(js);
              setInjectedOnce(true);
            } catch (e) {
              // If inject fails, we'll rely on HTML's auto behavior or user retry
            }
          }
        }}
        onMessage={(event: WebViewMessageEvent) => {
          try {
            const payload = JSON.parse(event.nativeEvent.data);
            const ev = payload.event;
            const data = payload.data;

            // ensure single handling
            if (handledRef.current.done && (ev === "SUCCESS" || ev === "FAILURE" || ev === "ERROR")) {
              return;
            }

            switch (ev) {
              case "SUCCESS":
                handledRef.current.done = true;
                onSuccess(data || {});
                break;
              case "FAILURE":
                handledRef.current.done = true;
                onFailure(data || {});
                break;
              case "ERROR":
                handledRef.current.done = true;
                onFailure(data || {});
                break;
              case "CLOSE":
                onClose();
                break;
              case "TIMEOUT":
                onFailure({ description: "Payment timeout" });
                break;
              default:
                // ignore unknown
                break;
            }
          } catch (err) {
            // invalid message
          }
        }}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          onFailure({ description: "WebView error: " + nativeEvent.description });
        }}
        onHttpError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          onFailure({ description: "HTTP error: " + nativeEvent.statusCode });
        }}
        style={styles.webview}
      />
    </View>
  );
};

export default RazorpayWeb;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#00000080", justifyContent: "center" },
  loader: {
    position: "absolute",
    top: "45%",
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 5,
  },
  webview: { flex: 1, backgroundColor: "transparent" },
});
