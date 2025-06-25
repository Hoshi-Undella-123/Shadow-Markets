import streamlit as st
from alpha_vantage.timeseries import TimeSeries
import pandas as pd
import plotly.express as px
import datetime

API_KEY = "4NCMASFLAN7M5HKF"  # replace with your API key

ts = TimeSeries(key=API_KEY, output_format='pandas')

st.set_page_config(page_title="Shadow Market Protocol", layout="wide")
st.title("🌐 Shadow Market Protocol")
st.markdown("Simulate financial markets without constraints — welcome to the shadow.")

ticker = st.sidebar.text_input("Stock Ticker (e.g. TSLA, AAPL)", value="TSLA").strip().upper()
start_date = st.sidebar.date_input("Start Date", datetime.date(2010, 1, 1))
end_date = st.sidebar.date_input("End Date", datetime.date.today())
scenario = st.sidebar.selectbox(
    "Shadow Scenario",
    ["None", "No ESG Mandate (+15%)", "High Inflation (-15%)", "Tech Boom (+25%)", "Market Crash (-30%)"]
)

if start_date >= end_date:
    st.sidebar.error("Error: Start date must be before end date.")

@st.cache_data(ttl=3600)
def get_stock_data(ticker):
    try:
        data, meta_data = ts.get_daily(symbol=ticker, outputsize='full')
        data.reset_index(inplace=True)
        data['date'] = pd.to_datetime(data['date'])
        return data
    except Exception as e:
        st.error(f"Error fetching data from Alpha Vantage: {e}")
        return pd.DataFrame()  # Always return DataFrame to avoid None

if st.sidebar.button("Run Simulation"):
    df = get_stock_data(ticker)

    if df is None or df.empty:
        st.error(f"No data found for ticker '{ticker}'. Check symbol or try again later.")
        st.stop()

    mask = (df['date'] >= pd.to_datetime(start_date)) & (df['date'] <= pd.to_datetime(end_date))
    filtered_df = df.loc[mask]

    if filtered_df.empty:
        st.error("No data in selected date range.")
        st.stop()

    # Use close price (free endpoint returns '4. close')
    filtered_df['Base_Price'] = filtered_df['4. close']

    # Apply shadow scenario adjustments
    if scenario == "None":
        filtered_df['Shadow_Price'] = filtered_df['Base_Price']
    elif scenario == "No ESG Mandate (+15%)":
        filtered_df['Shadow_Price'] = filtered_df['Base_Price'] * 1.15
    elif scenario == "High Inflation (-15%)":
        filtered_df['Shadow_Price'] = filtered_df['Base_Price'] * 0.85
    elif scenario == "Tech Boom (+25%)":
        filtered_df['Shadow_Price'] = filtered_df['Base_Price'] * 1.25
    elif scenario == "Market Crash (-30%)":
        filtered_df['Shadow_Price'] = filtered_df['Base_Price'] * 0.70
    else:
        filtered_df['Shadow_Price'] = filtered_df['Base_Price']

    st.subheader(f"{ticker} Data ({start_date} to {end_date})")
    st.write(filtered_df[['date', 'Base_Price', 'Shadow_Price', '5. volume']].head(10))

    st.subheader("Price Comparison: Real vs Shadow Market")
    fig_price = px.line(
        filtered_df,
        x='date',
        y=['Base_Price', 'Shadow_Price'],
        labels={'value': 'Price', 'date': 'Date', 'variable': 'Market'},
        title=f"{ticker} Real vs Shadow Market Price"
    )
    st.plotly_chart(fig_price, use_container_width=True)

    st.subheader("Trading Volume")
    fig_vol = px.bar(
        filtered_df,
        x='date',
        y='5. volume',
        labels={'5. volume': 'Volume', 'date': 'Date'},
        title=f"{ticker} Trading Volume"
    )
    st.plotly_chart(fig_vol, use_container_width=True)

    st.markdown("---")
    st.markdown("Develop your own shadow market scenarios and expand this research lab!")
