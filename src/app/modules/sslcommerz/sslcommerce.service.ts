import { StatusCodes } from "http-status-codes";
import { envVars } from "../../config/env"
import appError from "../../errorHelper/appError";
import { ISSLCommerz } from "./sslcommerce.interface"
import { default as axios } from 'axios';


 const sslPaymentInit =async (payload:ISSLCommerz)=>{
    try {
      const data ={
          store_id: envVars.SSL.SSL_STORE_ID,
            store_passwd:envVars.SSL.SSL_SECRET_KEY, 
            total_amount: payload.amount,
            currency: "BDT",
            tran_id: payload.transactionId,
            success_url: `${envVars.SSL.SSL_SUCCESS_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=success`,
            cancel_url: `${envVars.SSL.SSL_CANCEL_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=cancel`,
            fail_url: `${envVars.SSL.SSL_FAIL_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=fail`,
            // ipn_url: "http://localhost:3030/ipn",
            shipping_method: "N/A",
            product_name: "Tour",
            product_category: "Service",
            product_profile: "general",
            cus_name: payload.name,
            cus_email:payload.email,
            cus_add1: payload.address,
            cus_add2: "N/A",
            cus_city: "Dhaka",
            cus_state: "Dhaka",
            cus_postcode: "1000",
            cus_country: "Bangladesh",
            cus_phone: payload.phoneNumber,
            cus_fax: "01711111111",
            ship_name: "N/A",
            ship_add1: "N/A",
            ship_add2: "N/A",
            ship_city: "N/A",
            ship_state: "N/A",
            ship_postcode: 1000,
            ship_country: "N/A",
    }

    const response = await axios({
      method:"POST",
      url:envVars.SSL.SSL_PAYMENT_API,
      data,
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
    })

    return response.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
      if (envVars.NODE_ENV === "Development") {
        // eslint-disable-next-line no-console
        console.log(error);
      }
      throw new appError(StatusCodes.BAD_REQUEST, error.message)
    }

}

export const sslServicess ={
  sslPaymentInit,
}