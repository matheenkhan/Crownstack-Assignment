import React, { useState, useEffect } from 'react'

//sample product
const products = [
    {id:'1', title: 'Armani Suit', price_rupees: 30000, img: require('../Assets/armani.jpg'), alt: "logo_armani_suit", filtered_currencies: {INR: 30000} },
    {id:'2', title: 'Rolex Watch', price_rupees: 144000, img: require('../Assets/rolex.jpg'), alt: "logo_rolex_watch", filtered_currencies: {INR: 144000} },
    {id:'3', title: 'Nike Shoes', price_rupees: 3000, img: require('../Assets/nike.jpg'), alt: "logo_nike_shoe", filtered_currencies: {INR: 3000} },
]
//sample currencies
//var allCurrencies = ['INR', 'AUD', 'CAD', 'JPY'];
// const currencyexchangevalue = 73.70; //to be used if API Call Fails

export const ProductList = (props) => {
  var allCurrencies = props.list.result;
  const [currency, setCurrency] = useState("INR");
  const [currencyDetails, setCurrencyDetails] = useState({});
  const [fetchedState, setfetchedState] = useState(false);
  const [innerfetchedState, setinnerfetchedState] = useState(false);
  //populate products with information
    useEffect(() => {
      allCurrencies = props.list.result;
      document.title = `Product List`;
      fetch("https://api.exchangeratesapi.io/latest?base=INR")
        .then(res => res.json())
        .then(
          (result) => {
            const filtered_currencies = Object.fromEntries(
              Object.entries(result.rates).filter(
                 ([key])=>allCurrencies.includes(key)
              )
            );
            //add deep cloned filter_currency object
            products.forEach(x=>Object.assign(x, JSON.parse(JSON.stringify({filtered_currencies}))));
            //add currency details to inner object
            products.forEach(x=>Object.keys(x.filtered_currencies).forEach(function(key){ x.filtered_currencies[key] *= x.price_rupees }));
            if(innerfetchedState!=true) {setCurrencyDetails(filtered_currencies);}
            setfetchedState(true);
         }).catch((e) => { 
        });
    },[props]);
    //populate currency data with others; Ideally one base currency should be used upon a Fetch-then-render methodology. The problem states render then fetch, 
    //so a useEffect hook acts as the perfect supplement to a componentDidMount lifecycle. The above effect replaces componentWillMount alone. 
    useEffect(() => {
      fetch("https://api.exchangeratesapi.io/latest?base="+currency)
        .then(res => res.json())
        .then(
          (result) => {
            const filtered_currencies = Object.fromEntries(
              Object.entries(result.rates).filter(
                 ([key])=>allCurrencies.includes(key)
              )
            );
            setCurrencyDetails(filtered_currencies);
            // currencyDetails=filtered_currencies;
            setfetchedState(true);
            setinnerfetchedState(true);
         }).catch((e) => { 
        });
    },[currency])
    const renderedPosts = products.map(product => (
        <article className="productList" key={product.id}>
          <img src={product.img} alt={product.alt} style={{height:"200px",width:"200px"}}/>
          <h3>{product.title}</h3>
          <p>{numberWithCommas((Math.round(product.filtered_currencies[currency] * 100) / 100).toFixed(2))} {currency}</p>
        </article>
      ))
    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    if(allCurrencies){
        var currencydetails = allCurrencies.map(currency=>(
          <option value={currency} key={currency}>{currency}</option>
          ));
    }
      return (
        <div>
        <section className="currencyTab">
          Currency
          <select value={currency} onChange={(e)=>{setCurrency(e.target.value);}}>
          {currencydetails}
          </select>
        </section>
        <div className="clear"></div>
        <section className="productsTab">          
        <h2><u>Sample UI</u></h2>
          {renderedPosts}
        </section>
        <section className="productsTab">
          <h2>Currency list</h2>
          {fetchedState===true?allCurrencies.map(x=><div>
            <span><u>{Object.values(x)} </u></span>
            <span>{currencyDetails[x]}</span>
            </div>):"loading..."}
        </section>
        </div>
    )
}