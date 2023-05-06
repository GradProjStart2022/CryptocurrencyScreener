import axios from "axios";

const SCREEN_PRICE_URL = "http://127.0.0.1:8000/price/screening/";

const getFilteredData = async (
  filter_id,
  used_bar_table,
  date_range,
  setPriceData
) => {
  let return_success = false;
  let price_data = [];

  try {
    let resp = await axios.get(SCREEN_PRICE_URL, {
      params: {
        id: filter_id,
        table: used_bar_table,
        date_range: date_range,
      },
    });

    resp.data.forEach((elem, index) => {
      price_data.push({
        id: index,
        ...elem,
      });
    });

    setPriceData(price_data);

    return_success = true;
  } catch (error) {
    console.log("getFilteredData error :>> ", error);
    return_success = false;
  } finally {
    return return_success;
  }
};

export default getFilteredData;
