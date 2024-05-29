import { useEffect, useState } from "react";
import Select from "react-select"
import agent from "../agent";
import { Product } from "../models/Product";
import { Button } from "semantic-ui-react";

interface Props {
  item?: Product;
  onChange: (value: any) => void;
  onClear: () => void;
}

export default function SelectProduct({ item, onChange, onClear }: Props) {
  const [options, setOptions] = useState([]);
  const [filter, setFilter] = useState("");
  const [value, setValue] = useState({});

  useEffect(() => {
    const getData = async () => {
      const arr: any = [];

      await agent.Products.list(filter).then((res) => {
        res.map((item: any) => {
          return arr.push({ value: item, label: item.code + ' - ' + item.name });
        });
        setOptions(arr)
      });
    };

    getData();

  }, [filter]);

  useEffect(() => {
    if (item)
      setValue({ value: item, label: item.code + ' - ' + item.name })
  }, [item]);

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <div style={{ width: '100%' }}>
        <Select
          className="input-cont"
          placeholder="Select an individual"
          options={options}
          value={value}
          onInputChange={(x) => { setFilter(x) }}
          onChange={(x: any) => {
            onChange(x);
            console.log('ok')
            console.log(x)
            setValue({ value: x.value, label: x.value.code + ' - ' + x.value.name })
          }}
          noOptionsMessage={() => 'Ничего не найдено'}
        />
      </div>
      <Button type='button' content='Очистить' onClick={() => 
        {
          setValue({});
            onClear();
        }} />
    </div>
  )
}
