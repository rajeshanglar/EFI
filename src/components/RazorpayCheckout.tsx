import React, { useState } from "react";
import { ActivityIndicator, View } from "react-native";
import WebView, { WebViewMessageEvent } from "react-native-webview";

interface Props {
  amount: number;
  name: string;
  email: string;
  phone: string;
  order_id: string;
  razorpayKey: string;
  onSuccess: (res: any) => void;
  onFailure: (res: any) => void;
}

const RazorpayCheckout: React.FC<Props> = ({ amount, name, email, phone, order_id, razorpayKey, onSuccess, onFailure }) => {
  const html = `
  <html>
    <body>
      <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      <script>
        var options = {
          key: "${razorpayKey}",
          amount: "${amount * 100}",
          name: "${name}",
          order_id: "${order_id}",
          prefill: { email: "${email}", contact: "${phone}" },
  
          handler: function (response) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              status: "success",
              data: response
            }));
          },
  
          modal: {
            escape: false,
            confirm_close: true,
  
            // USER PRESSED BACK / CLOSED POPUP
            ondismiss: function () {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                status: "cancel"
              }));
            }
          }
        };
  
        var rzp = new Razorpay(options);
  
        // EXTRA FAILURE HANDLERS (Must needed)
        rzp.on("payment.failed", function (response) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            status: "failed",
            data: response.error
          }));
        });
  
        rzp.on("payment.error", function (response) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            status: "failed",
            data: response.error
          }));
        });
  
        rzp.open();
      </script>
    </body>
  </html>
  `;

  const handle = (event: WebViewMessageEvent) => {
    const res = JSON.parse(event.nativeEvent.data);
    if (res.status === "success") {
      onSuccess(res.data);
    } else {
      onFailure(res.data || res);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <WebView
        source={{ html }}
        onMessage={handle}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        renderLoading={() => (
          <ActivityIndicator size="large" style={{ marginTop: 20 }} />
        )}
      />
    </View>
  );
};

export default RazorpayCheckout;
