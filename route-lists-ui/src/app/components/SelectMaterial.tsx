import { useEffect, useState } from "react";
import Select from "react-select"
import agent from "../agent";
import { Material } from "../models/Material";

interface Props {
  item: Material;
  productCode: string;
  showOnlyMaterialsByProduct: Boolean;
  onChange: (value: any) => void;
}

export default function SelectMaterial({ item, showOnlyMaterialsByProduct, productCode, onChange }: Props) {
  const [options, setOptions] = useState([]);
  const [filter, setFilter] = useState("");
  const [value, setValue] = useState({});

  useEffect(() => {
    const getData = async () => {
      const arr: any = [];

      if (showOnlyMaterialsByProduct) {
        await agent.Materials.getByProduct(productCode).then((res) => {
          res.map((item: any) => {
            return arr.push({ value: item, label: item.code + ' - ' + item.name });
          });
        });
      } else {
        await agent.Materials.get(filter).then((res) => {
          res.map((item: any) => {
            return arr.push({ value: item, label: item.code + ' - ' + item.name });
          });
        });
      }

      setOptions(arr)
      console.log(showOnlyMaterialsByProduct)
      console.log(productCode);
    };

    getData();

  }, [filter, showOnlyMaterialsByProduct]);

  useEffect(() => {
    setValue({ value: item, label: item.code + ' - ' + item.name })
  }, [item]);

  return (
    <Select
      className="input-cont"
      placeholder="Select an individual"
      options={options}
      value={value}
      onInputChange={(x) => { setFilter(x) }}
      onChange={(x: any) => {
        onChange(x);
        setValue({ value: x.value, label: x.value.code + ' - ' + x.value.name })
      }}
      noOptionsMessage={() => 'Ничего не найдено'}
    />
  )
}
