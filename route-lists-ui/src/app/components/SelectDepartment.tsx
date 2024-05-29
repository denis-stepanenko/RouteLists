import { Dropdown } from 'semantic-ui-react'

interface Props {
    item: number | null,
    onChange: (department: number | null) => void;
}

export default function SelectDepartment({ item, onChange } : Props) {
    const friendOptions = [
        { key: '4', text: '4', value: '4' },
        { key: '5', text: '5', value: '5' },
        { key: '6', text: '6', value: '6' },
        { key: '13', text: '13', value: '13' },
        { key: '17', text: '17', value: '17' },
        { key: '80', text: '80', value: '80' },
        { key: '82', text: '82', value: '82' },
    ]

    return (
        <Dropdown
                placeholder='Поиск по цеху'
                fluid
                selection
                clearable
                options={friendOptions}
                value={item?.toString()}
                onChange={(_e, {value}) => onChange(value === '' ? null : Number(value))}
            />
    )
}
