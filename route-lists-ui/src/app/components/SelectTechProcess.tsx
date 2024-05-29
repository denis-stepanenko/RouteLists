import { useEffect, useState } from "react";
import Select from "react-select"
import agent from "../agent";
import { Button } from "semantic-ui-react";
import { TechProcess } from "../models/TechProcess";

interface Props {
  item?: TechProcess;
  onChange: (value: any) => void;
  onClear: () => void;
}

function isEmpty(value: string) {
  return value === '' || value === null;
}

export default function SelectTechProcess({ item, onChange, onClear }: Props) {
  const [options, setOptions] = useState([]);
  const [filter, setFilter] = useState("");
  const [value, setValue] = useState({});

  useEffect(() => {
    const getData = async () => {
      const arr: any = [];

      await agent.TechProcesses.find(filter).then((res) => {
        res.map((item: any) => {
          return arr.push({ value: item, label: `${item.productCode} - ${item.productName} ${(isEmpty(item.description) ? '' : '(' + item.description + ')')}` });
        });
        setOptions(arr)
      });
    };

    getData();

  }, [filter]);

  useEffect(() => {
    if (item)
      setValue({ value: item, label: `${item.productCode} - ${item.productName} ${(isEmpty(item.description) ? '' : '(' + item.description + ')')}` })
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
            setValue({ value: x.value, label: `${x.value.productCode} - ${x.value.productName} ${(isEmpty(x.value.description) ? '' : '(' + x.value.description + ')')}`})
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
