/* eslint-disable react/prop-types */
import { toast } from 'react-toastify';
import { backend_url } from '../../../server';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import axios from 'axios';

const SellerPayPalPayment = ({item}) => {

  const initialOptions = {
      clientId: "AfFPQyFjoighEawdekfr2QzGVeVSuMwbZoldGgZ-6GQ8T04sCkit6SPfw0zMeOJQ-LZ_Ma8S_S9Mxplq",
      intent: "capture",
      currency: "USD",
    };

    const createOrder = async () => {
      try {
        const sellerres=await axios.get(`${backend_url}/seller/sellerinfo`,{withCredentials:true})
        const seller=sellerres.data.seller
        const response = await fetch(`${backend_url}/seller/subscription`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          // use the "body" param to optionally pass additional order information
          // like product ids and quantities
          body: JSON.stringify({
              subscription:
              {
                id: item.id,
                quantity: 1
              },
              seller:seller
          },
        ),
        });
        const orderData = await response.json();
        if(orderData.success==false){
          return toast.error(orderData.message)
        }
        if (orderData.id) {
          return orderData.id;
        } else {
          const errorDetail = orderData?.details?.[0];
          const errorMessage = errorDetail
            ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
            : JSON.stringify(orderData);

          return toast.error(errorMessage);
        }
      } catch (error) {
        console.log(error);
        toast.error(`Could not initiate PayPal Checkout...${error}`);
      }
    }

    const onApprove=async (data, actions) => {
      try {
        const sellerres=await axios.get(`${backend_url}/seller/sellerinfo`,{withCredentials:true})
        const seller=sellerres.data.seller
        const response = await fetch(
          `${backend_url}/seller/subscription/${data.orderID}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body:JSON.stringify({
              seller:seller
            })
          },
        );

        const orderData = await response.json();
        // Three cases to handle:
        //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
        //   (2) Other non-recoverable errors -> Show a failure message
        //   (3) Successful transaction -> Show confirmation or thank you message
        const errorDetail = orderData?.details?.[0];

        if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
          // (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
          // recoverable state, per https://developer.paypal.com/docs/checkout/standard/customize/handle-funding-failures/
          return actions.restart();
        } else if (errorDetail) {
          // (2) Other non-recoverable errors -> Show a failure message
          throw new Error(
            `${errorDetail.description} (${orderData.debug_id})`,
          );
        } else {
          // (3) Successful transaction -> Show confirmation or thank you message
          // Or go to another URL:  actions.redirect('thank_you.html');
          const transaction =
            orderData.purchase_units[0].payments.captures[0];
          toast.success(
            `Transaction ${transaction.status}: ${transaction.id}. See console for all available details`,
          );
          console.log(
            "Capture result",
            orderData,
            JSON.stringify(orderData, null, 2),
          );
        }
      } catch (error) {
        console.error(error);
        toast.error(
          `Sorry, your transaction could not be processed...${error}`,
        );
      }
    }

    return (
        <>
        <PayPalScriptProvider initialOptions={initialOptions}>
        <PayPalButtons
          style={{
            shape: "pill",
            color:'blue',
            layout: "vertical",
          }}
          createOrder={createOrder}
          onApprove={onApprove}
          />
          </PayPalScriptProvider>
    </> 
    );
}

export default SellerPayPalPayment