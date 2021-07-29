import  React, {useState, useEffect} from 'react';
import {MenuItem,FormControl,Select} from '@material-ui/core';
import {Card,CardContent} from '@material-ui/core';
import InfoBox from './InfoBox';
import Table from './Table';
import Map from './Map';
import LineGraph from './LineGraph';
import "leaflet/dist/leaflet.css";
import './App.css';
import { sortData, prettyPrintStat } from './util';
//https://disease.sh/v3/covid-19/countries
//https://disease.sh/v3/covid-19/all
//https://disease.sh/v3/covid-19/countries/{country}
function App() {

  const [countries, setCountries] = useState([]);//gets data of all the countries
  const [country,setCountry]=useState('worldwide');//for data of a particular country
  const [countryInfo,setCountryInfo]=useState({});
  const [tableData,setTableData]=useState([]);//for the table showing live cases by country
  const [mapCountries,setMapCountries]=useState([]);
  const [casesTypes,setCasesType]=useState("cases");

  const [mapCenter, setMapCenter] = useState([34.80746, -40.4796]);
  const [zoom, setZoom] = useState(3);

      useEffect(() => {
      const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
            }));
          const sortedData=sortData(data);///sorts the data by live cases
          setTableData(sortedData);

          setMapCountries(data);//all data of all the countries
          setCountries(countries);
           });
          };
          getCountriesData();
        }, []);


    useEffect(()=>{
      fetch("https://disease.sh/v3/covid-19/all")
     .then((response)=>response.json())
     .then((data)=>{
     setCountryInfo(data);
     });
    },[]);



  const onCountryChange=async(event)=>
  {

    const countryCode=event.target.value;
    setCountry(countryCode);
   
    //const url=countryCode==='worldwide'
      //        ?'//https://disease.sh/v3/covid-19/all'
        //      :`//https://disease.sh/v3/covid-19/countries/${countryCode}`;
     if(countryCode==='worldwide')
     {
     await fetch(`https://disease.sh/v3/covid-19/all`)
     .then(response=>response.json())
     .then(data=>{
      setCountry(countryCode);
      setCountryInfo(data);
      
      countryCode === "worldwide"
          ? setMapCenter([34.80746, -40.4796])
          : setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      setZoom(4);  
    }); 
     }   
     else{
    await fetch(`https://disease.sh/v3/covid-19/countries/${countryCode}`)
    .then(response=>response.json())
    .then(data=>{
      setCountry(countryCode);
       setCountryInfo(data);
       countryCode === "worldwide"
          ? setMapCenter([34.80746, -40.4796])
          : setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      setZoom(4); 
      });
      }
  
  }
   return (
    <div className="app">
    <div className="app__left">
    <div className="app__header">
     
     <h1>COVID 19 TRACKER</h1> 
       
       <FormControl className="app__dropdown">
          
          <Select variant="standard" value={country} onChange={onCountryChange}>
          <MenuItem value="worldwide">Worldwide</MenuItem>
              {
                countries.map((country)=>(
                  <MenuItem value={country.value}>{country.name}</MenuItem>
                ))
              }
          </Select>

       </FormControl>

    </div>
     {/*Header*/}
     {/*Title+input dropdown menu*/}


    <div className="app__stats"> 
     <InfoBox  
     onClick={e=>setCasesType("cases")}
     title="Coronavirus Cases" cases={prettyPrintStat(countryInfo.todayCases)} total={prettyPrintStat(countryInfo.cases)}/>
     <InfoBox 
     onClick={e=>setCasesType("recovered")}
     title="Recovered" cases={prettyPrintStat(countryInfo.todayRecovered)} total={prettyPrintStat(countryInfo.recovered)}/>
     <InfoBox
     onClick={e=>setCasesType("deaths")} 
     title="Deaths" cases={prettyPrintStat(countryInfo.todayDeaths)} total={prettyPrintStat(countryInfo.deaths)}/>
     {/*Infobox*/}
     {/*Infobox*/}
     {/*Infobox*/}
    </div>
     <Map countries={mapCountries} casesType={casesTypes} center={mapCenter} zoom={zoom}/>
     {/*Map*/}
    </div>


    <Card className="app__right">
      
      <CardContent>
     <h3>Live Cases by Country</h3>
     <Table countries={tableData}/>
      {/*Table*/}
      
      <h3>Worldwide data on {casesTypes}</h3>
      <LineGraph casetype={casesTypes}/>
     {/*Graph*/}
     </CardContent>
    </Card>
     
    </div>
  );
}

export default App;



///App.js