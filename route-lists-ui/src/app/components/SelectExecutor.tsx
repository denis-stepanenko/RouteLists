import { useEffect, useState } from "react";
import Select from "react-select"
import agent from "../agent";
import { Executor } from "../models/Executor";

interface Props {
    item?: Executor;
    onChange?: (value: any) => void;
}

export default function SelectExecutor({item, onChange} : Props) {
const [options, setOptions] = useState([]);
const [filter, setFilter] = useState("");
const [value, setValue] = useState({});

useEffect(() => {
    const getData = async () => {
      const arr: any = [];

    await agent.Executors.find(filter).then((res) => {
      res.map((item: any) => {
        return arr.push({value: item, label: `${item.firstName} ${item.secondName} ${item.patronymic}`});
      });
      setOptions(arr)
    });
  };

    getData();

  }, [filter]);

useEffect(() => {
  if(item)
    setValue({value: item, label: `${item.firstName} ${item.secondName} ${item.patronymic}`})
}, [item]);

  return (
    <Select
        className="input-cont"
        placeholder= "Select an individual"
        options={options}
        value={value}
        onInputChange={(x) => {setFilter(x)}}
        onChange={(x : any) => { 
            if(onChange)
              onChange(x); 
            setValue({value: x.value, label: ` ${x.value.firstName} ${x.value.secondName} ${x.value.patronymic}`})
        }}
        noOptionsMessage={() => 'Ничего не найдено'}
      />
  )
}
