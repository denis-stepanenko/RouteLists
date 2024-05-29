import { useEffect, useState } from "react";
import Select from "react-select"
import agent from "../agent";
import { Order } from "../models/Order";

interface Props {
    item?: Order;
    productCode: string;
    onChange: (value: any) => void;
}

export default function SelectOrder({productCode, item, onChange} : Props) {
const [options, setOptions] = useState([]);
const [filter, setFilter] = useState("");
const [value, setValue] = useState({});

useEffect(() => {
    const getData = async () => {
      const arr: any = [];
    
    if(productCode) {
        await agent.Orders.get(productCode).then((res) => {
          res.map((item: any) => {
            return arr.push({value: item, label: `${item.groupName}, ${item.direction}`});
          });
          setOptions(arr)
        });
    }

  };

    getData();

  }, [filter, productCode]);

useEffect(() => {
  if(item)
    setValue({value: item, label: `${item.groupName}, ${item.direction}`})
}, [item]);

  return (
    <Select
        className="input-cont"
        placeholder= "Select an individual"
        options={options}
        value={value}
        onInputChange={(x) => {setFilter(x)}}
        onChange={(x : any) => { 
            onChange(x); 
            console.log('ok')
            console.log(x)
            setValue({value: x.value, label:  `${x.value.groupName}, ${x.value.direction}`})
        }}
        noOptionsMessage={() => 'Ничего не найдено'}
      />
  )
}
